// pages/custom/diner_search_detail/index.ts
import { config } from '../../../config' // 高德地图api确保路径正确

const app = getApp<IAppOption>()
const db = wx.cloud.database()


Page({
  data: {
    keyword: '',
    historyList: [] as string[],
    
    // 搜索结果
    searchList: [] as any[],
    
    // 推荐/最近浏览 
    hotList: [] as any[],
    
    // 当前定位 
    currentLat: 0,
    currentLng: 0
  },

  onLoad() {
    this.loadHistory()
    this.getCurrentLocation()
    this.loadRecommendations()
  },

  // 1. 获取当前定位
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          currentLat: res.latitude,
          currentLng: res.longitude
        })
      }
    })
  },

  // 2. 加载推荐数据 (模拟最近浏览)
  loadRecommendations() {
    // 从云数据库随机取几条，或者按评分排序
    db.collection('restaurant').limit(5).get().then(res => {
      const list = res.data.map((item: any) => this.processRestaurantData(item))
      this.setData({ hotList: list })
    })
  },

  // 数据处理 (与 explore 页面逻辑类似)
  processRestaurantData(item: any) {
    // 这里简单处理，实际应复用 explore 的转换逻辑
    // 假设数据库里已经是处理好的 lat/lng 或者在这里做转换
    // 为了演示，我们假设 item 里有 valid 的 latitude/longitude
    return {
      ...item,
      id: item._id,
      name: item.shop_name || item.name,
      location: item.address || item.location,
      rating: item.avg_score || item.rating || 4.5,
      price: item.price || 88,
      tags: item.shop_type ? [item.shop_type] : ['美食'],
      imageColor: item.imageColor || '#ffe0b2',
      // 简单距离标识
      distance: '计算中...' 
    }
  },

  // 3. 搜索输入处理
  onInput(e: any) {
    const val = e.detail.value
    this.setData({ keyword: val })
    
    if (!val) {
      this.setData({ searchList: [] })
      return
    }

    // 防抖搜索 (简单演示直接搜)
    this.doSearch(val)
  },

  onClearInput() {
    this.setData({ keyword: '', searchList: [] })
  },

  // 执行搜索
  doSearch(keyword: string) {
    db.collection('restaurant').where(
      db.command.or([
        { shop_name: db.RegExp({ regexp: keyword, options: 'i' }) },
        { address: db.RegExp({ regexp: keyword, options: 'i' }) }
      ])
    ).get().then(res => {
      const list = res.data.map((item: any) => this.processRestaurantData(item))
      this.setData({ searchList: list })
    })
  },

  // 确认搜索 (回车)
  onSearch() {
    if (this.data.keyword) {
      this.saveHistory(this.data.keyword)
      this.doSearch(this.data.keyword)
    }
  },

  // 4. 历史记录管理
  loadHistory() {
    const history = wx.getStorageSync('search_history') || []
    this.setData({ historyList: history })
  },

  saveHistory(keyword: string) {
    let history = this.data.historyList
    // 去重，移到最前
    history = history.filter(k => k !== keyword)
    history.unshift(keyword)
    if (history.length > 10) history.pop() // 限制10条
    
    this.setData({ historyList: history })
    wx.setStorageSync('search_history', history)
  },

  onClearHistory() {
    this.setData({ historyList: [] })
    wx.removeStorageSync('search_history')
  },

  onDeleteHistoryItem(e: any) {
    const keyword = e.currentTarget.dataset.keyword
    const history = this.data.historyList.filter(k => k !== keyword)
    this.setData({ historyList: history })
    wx.setStorageSync('search_history', history)
  },

  onHistoryTap(e: any) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.doSearch(keyword)
  },

  // 5. 核心：选中地点进行导航规划
  onSelectLocation(e: any) {
    const item = e.currentTarget.dataset.item
    console.log('选中目的地:', item)
    
    // 保存到历史记录
    this.saveHistory(item.name)

    // 获取上一页 (探索页) 实例
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] // 倒数第二个是上一页

    if (prevPage) {
      // 调用 explore 页面预留的方法，传递目的地坐标
      // 假设 explore 页面有一个方法叫 startNavigation(lat, lng, name)
      if (prevPage.startNavigation) {
        prevPage.startNavigation(item.latitude, item.longitude, item.name)
      } else {
        // 如果没有定义专门方法，也可以直接设置数据让 onLoad/onShow 处理
        // 但推荐用方法调用
        console.warn('Explore页面未定义 startNavigation 方法')
      }
      
      // 返回上一页，地图会自动开始规划路线
      wx.navigateBack()
    } else {
      // 异常情况
      wx.showToast({ title: '无法返回地图', icon: 'none' })
    }
  },

  onBack() {
    wx.navigateBack()
  },

  onUseCurrentLocation() {
    // 定位到当前位置，通常是清空搜索，返回地图并移动中心点
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    if (prevPage && prevPage.moveToCurrentLocation) {
        prevPage.moveToCurrentLocation()
    }
    wx.navigateBack()
  }
})