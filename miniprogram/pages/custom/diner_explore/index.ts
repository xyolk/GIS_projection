// 探索界面
// pages/custom/diner_explore/index.ts
export {}
const app = getApp<IAppOption>()

Page({
  data: {
    // 筛选标签数据
    filters: [
      { name: '全部', active: true },
      { name: '距离最近', active: false },
      { name: '价格最低', active: false },
      { name: '评分最高', active: false },
      { name: '江浙菜', active: false },
      { name: '火锅', active: false }
    ],
    // 餐厅数据 (模拟)
    restaurants: [
      {
        id: 1,
        name: '南京大牌档',
        rating: 4.8,
        tags: ['江浙菜'],
        location: '夫子庙景区',
        price: 88,
        distance: '1.2km',
        imageColor: '#fff3e0' // 模拟图片背景色
      },
      {
        id: 2,
        name: '小厨娘淮扬菜',
        rating: 4.6,
        tags: ['淮扬菜'],
        location: '新街口',
        price: 128,
        distance: '2.5km',
        imageColor: '#e0f2f1'
      },
      {
        id: 3,
        name: '海底捞火锅',
        rating: 4.7,
        tags: ['火锅'],
        location: '河西万达',
        price: 158,
        distance: '3.8km',
        imageColor: '#ffebee'
      }
    ],
    // 底部导航状态
    currentTab: 'explore'
  },

  // 切换筛选标签
  onFilterTap(e: any) {
    const index = e.currentTarget.dataset.index
    const filters = this.data.filters.map((item, i) => ({
      ...item,
      active: i === index // 简单的单选逻辑
    }))
    this.setData({ filters })
  },

  // 底部导航切换
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab
    
    // 定义正确的路径映射 (注意路径要与 app.json 里的完全一致)
    const urlMap: Record<string, string> = {
      'explore': '/pages/custom/diner_explore/index',
      'social': '/pages/custom/diner_social/index',
      'collection': '/pages/custom/diner_collection/index', 
      'settings': '/pages/custom/diner_settings/index'
    }

    const targetUrl = urlMap[tab]

    // 校验目标路径是否存在
    if (targetUrl) {
      // 智能判断：如果点击的是当前所在的页面，就不跳转
      // 获取当前页面栈的最后一个元素（即当前页）
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      
      // 如果目标 URL 包含了当前页面的路径字符串，说明点的是自己，直接返回
      // (加上 / 可以防止类似 /user 和 /user_list 的误判)
      if (targetUrl.includes(currentPage.route)) {
        return
      }

      // 执行跳转
      wx.reLaunch({
        url: targetUrl,
        fail: (err) => {
          console.error('跳转失败:', err)
          wx.showToast({ title: '路径错误，请检查文件夹名', icon: 'none' })
        }
      })
    } else {
      console.error('未找到对应的 tab 映射:', tab)
    }
  },

  // 搜索点击
  onSearch() {
    wx.navigateTo({ url: '/pages/custom/diner_search_detail/index' })
  },

  // 导航点击
  onNavigate() {
    wx.showToast({ title: '开始导航', icon: 'none' })
  },

  // 收藏点击
  onFavorite() {
    wx.showToast({ title: '已收藏', icon: 'success' })
  },
  
  // 电话点击
  onCall() {
    wx.makePhoneCall({ phoneNumber: '12345678900' })
  }
})