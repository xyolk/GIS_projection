// pages/custom/diner_settings/index.ts.ts
// pages/custom/diner_settings/index.ts
export {}
const app = getApp<IAppOption>()

Page({
  data: {
    // 模拟设置状态
    settings: {
      newMerchant: true,
      favUpdate: true,
      reply: false
    }
  },

  // 1. 底部导航切换 (核心跳转逻辑)
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

  // 2. 切换设置开关
  toggleSetting(e: any) {
    const key = e.currentTarget.dataset.key
    const currentVal = (this.data.settings as any)[key]
    
    this.setData({
      [`settings.${key}`]: !currentVal
    })
    
    wx.showToast({
      title: !currentVal ? '已开启' : '已关闭',
      icon: 'none',
      duration: 1000
    })
  },

  // 3. 清除缓存
  onClearCache() {
    wx.showLoading({ title: '清理中...' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '缓存已清除', icon: 'success' })
    }, 1000)
  },

  // 4. 退出登录
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的用户信息等逻辑
          wx.removeStorageSync('token')
          
          wx.showToast({ title: '已退出', icon: 'none' })
          
          // 返回身份选择页 (假设是 /pages/index/index)
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 1000)
        }
      }
    })
  }
})