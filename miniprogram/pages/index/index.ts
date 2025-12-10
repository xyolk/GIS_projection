// index.ts
// 获取应用实例
export {}  // 防报错，什么时候取用再说
const app = getApp<IAppOption>()

Component({
  data: {
    // 页面数据
  },
  methods: {
    // 导航到食客端
    navigateToDiner() {
      wx.navigateTo({
        url: '/pages/custom/diner_login/index', 
        success: () => {
          console.log('跳转成功')
       },
        fail: (err) => {
           console.error('跳转失败，原因：', err)
        }
      })
    },
    
    // 导航到商家端
    navigateToMerchant() {
      wx.navigateTo({
        url: '/pages/merchant/login/index',
      })
    },
    
    // 导航到管理端
    navigateToAdmin() {
      wx.navigateTo({
        url: '/pages/super/login/index',
      })
    },
  },
})
