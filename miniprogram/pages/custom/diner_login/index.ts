// 食客登录界面逻辑
// pages/custom/login/index.ts
export {}
const app = getApp<IAppOption>()

Page({
  data: {
    phone: '',
    password: '',
  },

  // --- 生命周期：实现自动登录 ---
  onLoad() {
    this.checkAutoLogin()
  },

  // 0. 检查自动登录逻辑
  checkAutoLogin() {
    // 从缓存获取 token
    const token = wx.getStorageSync('token')
    
    if (token) {
      console.log('检测到登录状态，正在自动跳转...')
      // 可以在这里简单校验 token 是否过期（如果后端支持），这里直接信任缓存
      wx.switchTab({
        url: '/pages/custom/diner_explore/index',
        fail: () => {
          // 如果 switchTab 失败（例如目标页面不是 TabBar），尝试 reLaunch
          wx.reLaunch({ url: '/pages/custom/diner_explore/index' })
        }
      })
    }
  },

  // 1. 通用输入事件处理
  onInput(e: any) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value.trim() // 去除首尾空格
    
    this.setData({
      [field]: value
    })
  },

  // 2. 账号密码登录逻辑 (含严格验证)
  onLogin() {
    const { phone, password } = this.data
    
    // --- 验证逻辑开始 ---
    
    // 验证手机号：必须是11位数字，且以1开头
    const phoneRegex = /^1\d{10}$/
    if (!phoneRegex.test(phone)) {
      wx.showToast({ title: '请输入正确的11位手机号', icon: 'none' })
      return
    }

    // 验证密码：必须是 6-20 位
    if (password.length < 6 || password.length > 20) {
      wx.showToast({ title: '密码长度需为6-20位', icon: 'none' })
      return
    }
    
    // --- 验证逻辑结束 ---

    console.log('验证通过，提交数据:', phone, password)
    
    wx.showLoading({ title: '登录中...' })
    
    // 模拟API请求
    setTimeout(() => {
      wx.hideLoading()
      // 假设登录成功，后端返回 token
      const mockToken = 'user_token_' + new Date().getTime()
      this.handleLoginSuccess(mockToken)
    }, 1000)
  },

  // 3. 微信一键登录 (后端逻辑留空)
  onWechatLogin() {
    wx.showLoading({ title: '授权中...' })

    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('获得微信Code:', res.code)

          // --- 向后端发起请求 ---
          wx.request({
            // 你的本地后端地址，例如: http://localhost:8080/api/login/wechat
            url: 'http://localhost:8080/api/login/wechat', 
            method: 'POST',
            data: {
              code: res.code // 将 code 发给后端
            },
            success: (loginRes: any) => {
              wx.hideLoading()
              
              // 假设后端返回格式: { code: 200, data: { token: 'xxx' } }
              if (loginRes.data?.code === 200) {
                 const token = loginRes.data.data.token
                 this.handleLoginSuccess(token)
              } else {
                 wx.showToast({ title: '登录失败', icon: 'none' })
              }
            },
            fail: (err) => {
              wx.hideLoading()
              // 这里为了演示，假设请求失败也视为“演示环境”并在此处模拟后端逻辑
              console.log('--- 后端未连接，以下是后端应实现的逻辑 ---')
              
              /* * =================================================================
               * 【后端逻辑示例 (伪代码)】 - 供你参考编写后端接口
               * =================================================================
               * 1. 接收前端传来的 'code'
               * 2. 后端调用微信接口 (auth.code2Session):
               * URL: https://api.weixin.qq.com/sns/jscode2session
               * 参数: appid, secret, js_code(即前端的code), grant_type='authorization_code'
               * 3. 微信接口返回: { openid: "...", session_key: "..." }
               * 4. 数据库查询: Select * From users Where open_id = '...'
               * - 如果存在: 生成 Token (JWT) 返回给前端。
               * - 如果不存在: 自动注册新用户，插入数据库，然后生成 Token 返回。
               * =================================================================
               */

              // 临时模拟成功，方便你调试前端跳转
              // 实际开发请删除下面这行，并在 fail 中提示网络错误
              // this.handleLoginSuccess('mock_wechat_token_123') 
              
              wx.showToast({ title: '请连接后端API', icon: 'none' })
            }
          })
        }
      }
    })
  },

  // 4. 登录成功的公共处理 (存储 Token 并跳转)
  handleLoginSuccess(token: string) {
    // ... 保存 token ...
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/custom/diner_explore/index',
        fail: (err) => {
          console.warn('switchTab 失败，尝试使用 reLaunch 跳转', err)
          // 如果目标不是 TabBar，switchTab 会失败，此时用 reLaunch 兜底
          wx.reLaunch({
            url: '/pages/custom/diner_explore/index'
          })
        }
      })
    }, 1500)
},

  // 5. 跳转注册
  goToRegister() {
    wx.navigateTo({
      url: '/pages/custom/diner_register/index'
    })
  },

  // 6. 忘记密码
  onGetPhoneNumber(e: any) {
    // 1. 检查用户是否拒绝了授权
    // 注意：新版基础库如果不回调，通常是因为没有去微信后台付费认证，
    // 但如果有回调且 errMsg 包含 "fail user deny" 则表示用户拒绝。
    if (e.detail.errMsg && e.detail.errMsg.includes('fail user deny')) {
      wx.showToast({ title: '已取消授权', icon: 'none' })
      return
    }

    // 2. 获取动态令牌 code (注意：这个 code 和 wx.login 的 code 不一样)
    const phoneCode = e.detail.code

    if (!phoneCode) {
      // 这种情况通常是基础库版本太低，建议提示用户升级微信
      wx.showToast({ title: '获取手机号失败，请升级微信', icon: 'none' })
      return
    }

    console.log('获取到手机号Code:', phoneCode)
    wx.showLoading({ title: '正在验证...' })

    // 3. 发送给后端
    wx.request({
      url: 'YOUR_BACKEND_API_URL/api/login/phone_quick', // 你的后端接口
      method: 'POST',
      data: {
        code: phoneCode
      },
      success: (res: any) => {
        wx.hideLoading()
        
        // 假设后端逻辑：
        // 1. 拿 code 换取真实手机号
        // 2. 查库：这个手机号注册过吗？
        // 3. 注册过 -> 返回 token；没注册 -> 自动注册并返回 token (或报错)
        
        if (res.data && res.data.code === 200) {
          const token = res.data.data.token
          
          // 复用你之前的成功逻辑
          this.handleLoginSuccess(token) 
        } else {
          wx.showToast({ 
            title: res.data.msg || '无法识别该手机号', 
            icon: 'none' 
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        
        // --- 后端逻辑备注 (开发阶段参考) ---
        console.log('--- 后端未连接，以下是后端逻辑说明 ---')
        /*
          后端收到 code 后，需调用微信接口：
          POST https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=ACCESS_TOKEN
          JSON body: { "code": "前端传来的phoneCode" }
          返回结果包含: 
          {
            "errcode": 0,
            "phone_info": {
              "phoneNumber": "13588888888",
              "purePhoneNumber": "13588888888", 
              "countryCode": "86",
              "watermark": { ... }
            }
          }    
          拿到 phoneNumber 后，去数据库 `select * from users where phone = '...'`
        */
        // 模拟成功演示 (实际请删除)
        // this.handleLoginSuccess('mock_phone_token_999') 
        wx.showToast({ title: '请求后端失败', icon: 'none' })
      }
    })
  },
  
  // 7. 退出登录 
  // 你需要在“个人中心”页面写这个逻辑
  handleLogout() {
    wx.removeStorageSync('token') // 清除缓存
    wx.reLaunch({ url: '/pages/custom/login/index' }) // 回到登录页
  }
})