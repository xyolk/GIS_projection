// 食客登录界面逻辑
// pages/custom/login/index.ts
export {}
const app = getApp<IAppOption>()

Page({
  data: {
    phone: '',
    password: '',
  },

  // 1. 通用输入事件处理 (配合 WXML 中的 data-field 使用)
  onInput(e: any) {
    // 原生 input 的字段名通常存在 dataset 中，而不是 detail 中
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    this.setData({
      [field]: value
    })
  },

  // 2. 登录逻辑
  onLogin() {
    const { phone, password } = this.data
    
    console.log('提交的数据:', phone, password) // 调试用

    // 简单验证
    if (!phone || !password) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    
    // 模拟登录
    wx.showLoading({ title: '登录中...' })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          // 延迟跳转
          setTimeout(() => {
            wx.navigateTo({
              // 注意：去掉 /miniprogram，且确保该页面已在 app.json 注册
              url: '/pages/custom/diner_explore/index', 
              fail: (err) => console.error('跳转探索页失败:', err)
            })
          }, 1500)
        }
      })
    }, 1000)
  },

  // 3. 微信登录
  onWechatLogin() {
    wx.showToast({ title: '微信登录功能开发中', icon: 'none' })
  },

  // 4. 跳转注册 (关键修复：增加 fail 回调看报错)
  goToRegister() {
    console.log('点击了注册')
    wx.navigateTo({
      // 请确保 app.json 的 pages 中有这个路径！
      url: '/pages/custom/diner_register/index',
      success: () => console.log('跳转注册成功'),
      fail: (err) => {
        console.error('跳转注册失败:', err)
        wx.showToast({ title: '页面路径错误', icon: 'none' })
      }
    })
  },

  // 5. 忘记密码
  onForgotPassword() {
    console.log('点击了忘记密码')
    wx.showToast({
      title: '忘记密码功能开发中',
      icon: 'none'
    })
  },

  // 6. 返回上一页
  goBack() {
    wx.navigateBack()
  }
})

 //7.跳转至主页
 setTimeout(() => {
  wx.reLaunch({ 
    url: '/pages/custom/diner_explore/index',
    fail: (err) => console.error('跳转探索页失败:', err)
  })
}, 1500)