// 食客注册界面逻辑
// pages/custom/diner_register/index.ts
export {}

Page({
  data: {
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
    
    // UI状态
    passwordVisible: false,
    confirmPasswordVisible: false,
    counting: false, // 是否正在倒计时
    count: 60,       // 倒计时秒数
  },

  // 1. 通用输入处理
  onInput(e: any) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value
    })
  },

  // 2. 切换密码可见性
  togglePassword() {
    this.setData({ passwordVisible: !this.data.passwordVisible })
  },
  toggleConfirmPassword() {
    this.setData({ confirmPasswordVisible: !this.data.confirmPasswordVisible })
  },

  // 3. 获取验证码
  onGetCode() {
    if (this.data.counting) return // 防止重复点击
    
    const { phone } = this.data
    // 简单手机号验证
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    wx.showToast({ title: '验证码已发送', icon: 'success' })
    
    // 开始倒计时
    this.setData({ counting: true, count: 60 })
    const timer = setInterval(() => {
      if (this.data.count <= 1) {
        clearInterval(timer)
        this.setData({ counting: false, count: 60 })
      } else {
        this.setData({ count: this.data.count - 1 })
      }
    }, 1000)
  },

  // 4. 注册提交
  onRegister() {
    const { phone, code, password, confirmPassword } = this.data

    if (!phone || !code || !password || !confirmPassword) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    if (password !== confirmPassword) {
      wx.showToast({ title: '两次输入的密码不一致', icon: 'none' })
      return
    }

    if (password.length < 6) {
      wx.showToast({ title: '密码不能少于6位', icon: 'none' })
      return
    }

    // 模拟注册请求
    wx.showLoading({ title: '注册中...' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            // 注册成功后返回登录页
            wx.navigateBack()
          }, 1500)
        }
      })
    }, 1500)
  },

  // 5. 微信一键注册
  onWechatRegister() {
    wx.showToast({ title: '微信注册功能开发中', icon: 'none' })
  },

  // 6. 跳转回登录页
  goToLogin() {
    wx.navigateBack()
  }
})

// ... 在注册成功的 success 回调里
setTimeout(() => {
  wx.reLaunch({ 
    url: '/pages/custom/diner_explore/index' 
  })
}, 1500)