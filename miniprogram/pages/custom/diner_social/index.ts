// pages/custom/diner_social/index.ts
export {}
const app = getApp<IAppOption>()

Page({
  data: {
    avatarUrl: '',

    gridConfig: [
      { 
        id: 'review',
        text: '新增评语', 
        icon: 'chat', 
        iconColor: '#ff9800', 
        bgClass: 'bg-orange', 
        path: '/pages/custom/social_subpackage/review_add/index' 
      },
      { 
        id: 'photo',
        text: '发布动态', 
        icon: 'camera', 
        iconColor: '#2196f3', 
        bgClass: 'bg-blue', 
        path: '/pages/custom/social_subpackage/photo_add/index' 
      },
      { 
        id: 'checkin',
        text: '打卡', 
        icon: 'location', 
        iconColor: '#4caf50', 
        bgClass: 'bg-green', 
        path: '/pages/custom/social_subpackage/checkin_add/index' 
      },
      { 
        id: 'profile',
        text: '个人画像', 
        icon: 'chart-bar', 
        iconColor: '#9c27b0', 
        bgClass: 'bg-purple', 
        path: '/pages/custom/social_subpackage/individual_chart/index' 
      }
    ],

    // --- 新增：用户信息 ---
    userInfo: {
      nickName: '美食爱好者',
      level: 'Lv.8',
      region: ['江苏省', '南京市', '秦淮区'], // 默认位置
      signature: ''
    },
    // --- 新增：弹窗控制变量 ---
    showEditModal: false,
    tempUserInfo: {} as any, // 编辑时的临时数据

    // 最近浏览数据 (预留给后端)
    recentList: [
      { id: 1, name: '南京大牌档', rating: 4.8, imageClass: 'bg-orange-light' },
      { id: 2, name: '小厨娘淮扬菜', rating: 4.6, imageClass: 'bg-teal-light' }
    ],

    // 口味分析数据 (预留给后端)
    tasteData: [
      { id: 1, label: '咸度偏好', value: 70, color: '#ff9800' },
      { id: 2, label: '甜度偏好', value: 50, color: '#ff9800' },
      { id: 3, label: '辣度偏好', value: 30, color: '#ff9800' }
    ],

    // 动态列表数据 (预留给后端)
    feedList: [
      {
        id: 101,
        user: '美食爱好者',
        avatar: '', // 暂时空着，实际用 user.avatarUrl
        content: '今天在南京大牌档享用了美味的盐水鸭，口感绝佳！',
        time: '2小时前',
        likes: 32,
        comments: 8,
        images: ['bg-orange-light', 'bg-yellow-light', 'bg-red-light'] // 模拟图片类名或URL
      }
    ]
  },

  onChooseAvatar(e: any) {
    // 获取微信返回的临时头像路径
    const { avatarUrl } = e.detail
    
    // 更新页面数据，实现即时预览
    this.setData({
      avatarUrl
    })
    // 注意: 目前的 avatarUrl 是临时路径。
    // 如果需要持久化保存，通常需要在这里调用 wx.uploadFile
    // 将图片上传到你的服务器，然后保存服务器返回的 URL
    console.log('用户选择的头像路径：', avatarUrl)
  },

 // --- 新增：编辑资料相关逻辑 ---

  // 1. 打开弹窗
  openEditModal() {
    // 把当前 userInfo 复制一份给 tempUserInfo，防止还没点保存页面就变了
    this.setData({
      showEditModal: true,
      tempUserInfo: { ...this.data.userInfo } 
    })
  },

  // 2. 关闭弹窗
  closeEditModal() {
    this.setData({ showEditModal: false })
  },

  // 3. 防止弹窗背景滚动
  preventScroll() { return },

  // 4. 监听昵称输入 (微信原生昵称填写能力)
  onNickNameChange(e: any) {
    const val = e.detail.value
    this.setData({ 'tempUserInfo.nickName': val })
  },

  // 5. 监听地区选择
  onRegionChange(e: any) {
    this.setData({ 'tempUserInfo.region': e.detail.value })
  },

  // 6. 监听签名输入
  onSignatureInput(e: any) {
    this.setData({ 'tempUserInfo.signature': e.detail.value })
  },

  // 7. 保存逻辑
  saveProfile() {
    // 更新正式展示的数据
    this.setData({
      userInfo: this.data.tempUserInfo,
      showEditModal: false
    })

    wx.showToast({ title: '已更新', icon: 'success' })
  }, 

  // --- 新增：点击动态跳转详情页 ---
  onTapFeed(e: any) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;

    wx.navigateTo({
      url: `/pages/custom/social_subpackage/review_detail/index`, 
      success: () => {
        console.log('跳转动态详情成功 ID:', id);
      },
      fail: (err) => {
        console.error('跳转失败，请检查 app.json 是否注册了 pages/review_detail/index', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
  },

  // (可选) 预览动态中的图片，防止冒泡触发跳转
  onPreviewImage(e: any) {
    // 实际项目中这里需要传入真实的 url 列表
    wx.showToast({ title: '预览图片', icon: 'none' });
  },

  // 统一的跳转处理函数
  onGridTap(e: any) {
    // 获取点击项携带的 path
    const path = e.currentTarget.dataset.path;

    if (!path) {
      wx.showToast({ title: '功能开发中...', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: path,
      fail: (err) => {
        console.error('跳转失败:', err);
        // 如果页面还没建，提示用户
        wx.showToast({ title: '页面尚未创建', icon: 'none' });
      }
    });
  },

  // 底部导航切换 (核心跳转逻辑)
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
  }
})