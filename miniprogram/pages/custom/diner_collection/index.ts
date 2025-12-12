// pages/custom/diner_collections/index.ts
export {}
const app = getApp<IAppOption>()

Page({
  data: {
    showModal: false,
    inputName: '',
    inputDesc: '',
    privacy: 'public',
    
    // 智能推荐数据
    recommendList: [
      { id: 1, name: '南京必吃榜', count: 12, favs: '2.3k', user: '美食达人', bgClass: 'bg-orange-100' },
      { id: 2, name: '秦淮小吃地图', count: 8, favs: '1.8k', user: '本地向导', bgClass: 'bg-teal-100' },
      { id: 3, name: '网红打卡店', count: 15, favs: '3.1k', user: '美食博主', bgClass: 'bg-red-100' }
    ],

    // 我的收藏数据
    myCollections: [
      { id: 1, name: '我的最爱', count: 6, icon: 'fork', iconColor: '#9c27b0', bgClass: 'bg-purple-100' },
      { id: 2, name: '甜品合集', count: 8, icon: 'gift', iconColor: '#2196f3', bgClass: 'bg-blue-100' },
      { id: 3, name: '咖啡馆', count: 12, icon: 'coffee', iconColor: '#4caf50', bgClass: 'bg-green-100' }
    ],

    // 关注收藏数据
    followedList: [
      { id: 1, name: '周末 brunch 指南', desc: '8家早午餐店', tag: '美食摄影师', bgClass: 'bg-yellow-100' },
      { id: 2, name: '老南京味道', desc: '15家地道小吃', tag: '南京通', bgClass: 'bg-pink-100' },
      { id: 3, name: '火锅爱好者', desc: '精选火锅推荐', tag: '火锅达人', bgClass: 'bg-red-100' }
    ]
  },

  onShow() {
    // 1. 读取“我的收藏”
    const localMy = wx.getStorageSync('diner_my_collections');
    if (localMy) {
      this.setData({ myCollections: localMy });
    }

    // 2. 读取“关注列表”
    const localFollow = wx.getStorageSync('diner_followed_list');
    if (localFollow) {
      this.setData({ followedList: localFollow });
    }
  },

  // 1. 底部导航切换
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

  // 2. 弹窗控制
  openModal() { this.setData({ showModal: true }) },
  closeModal() { 
    this.setData({ 
      showModal: false,
      inputName: '',
      inputDesc: '',
      privacy: 'public'
    }) 
  },

  // 3. 隐私切换
  setPrivacy(e: any) {
    this.setData({ privacy: e.currentTarget.dataset.type })
  },

  // 4. 创建收藏夹
  createCollection() {
    const { inputName, myCollections } = this.data
    if (!inputName.trim()) {
      wx.showToast({ title: '请输入名称', icon: 'none' })
      return
    }

    // 随机配色
    const colors = [
      { bg: 'bg-orange-100', color: '#ff9800', icon: 'star' },
      { bg: 'bg-teal-100', color: '#009688', icon: 'shop' },
      { bg: 'bg-pink-100', color: '#e91e63', icon: 'heart' }
    ]
    const random = colors[Math.floor(Math.random() * colors.length)]

    const newItem = {
      id: Date.now(),
      name: inputName,
      count: 0,
      icon: random.icon,
      iconColor: random.color,
      bgClass: random.bg
    }
    // 获取最新的列表
    const newList = [...this.data.myCollections, newItem];

    this.setData({
      myCollections: newList, // 添加到列表末尾
      showModal: false,
      inputName: '',
      inputDesc: ''
    })

    wx.setStorageSync('diner_my_collections', newList);
    wx.showToast({ title: '创建成功', icon: 'success' });

    wx.showToast({ title: '创建成功', icon: 'success' })
  },

  onToDetail(e: any) {
    // 获取点击时传递的 ID 和 标题
    const { id, name } = e.currentTarget.dataset;
    
    console.log(`正在跳转到收藏夹: ${name} (ID: ${id})`);

    // 跳转到详情页，并把 id 和 name 作为参数传过去
    // 注意：请确保下方 url 路径与你实际的详情页路径一致！
    wx.navigateTo({
      url: `/pages/custom/collection_page/index?id=${id}&name=${name}`,
      fail: (err) => {
        console.error('跳转详情页失败:', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
  },

  onLongPressCard(e: any) {
    const { id, name, type } = e.currentTarget.dataset;

    // 1. 弹出底部操作菜单
    wx.showActionSheet({
      itemList: ['删除该收藏夹'],
      itemColor: '#FF0000', // 红色文字警示
      success: (res) => {
        if (res.tapIndex === 0) {
          // 2. 二次确认弹窗
          wx.showModal({
            title: '确认删除',
            content: `确定要删除“${name}”吗？此操作无法恢复。`,
            confirmColor: '#FF0000',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.deleteCollection(id, type);
              }
            }
          });
        }
      }
    });
  },

  deleteCollection(targetId: number, type: string) {
    if (type === 'my') {
      // 从“我的收藏”中删除
      const updatedList = this.data.myCollections.filter((item: any) => item.id !== targetId);
      this.setData({ myCollections: updatedList });

      // 同步缓存
      wx.setStorageSync('diner_my_collections', updatedList);
      
      wx.showToast({ title: '已删除', icon: 'success' });
    } 
    else if (type === 'follow') {
      // 从“关注列表”中删除 (取消关注)
      const updatedList = this.data.followedList.filter((item: any) => item.id !== targetId);
      this.setData({ followedList: updatedList });

      wx.setStorageSync('diner_followed_list', updatedList);
      wx.showToast({ title: '已取消关注', icon: 'success' });
    }
  }
});
  
