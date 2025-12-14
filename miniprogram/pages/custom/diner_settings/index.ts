// pages/custom/diner_settings/index.ts.ts

export {}
const app = getApp<IAppOption>()

const MockAPI = {
  // 发送验证码
  sendVerifyCode: (phone: string) => {
    return new Promise((resolve) => {
      console.log(`[Backend] Sending code to ${phone}`);
      setTimeout(() => resolve({ success: true, code: '1234' }), 500);
    });
  },
  // 更新手机号
  updatePhone: (params: { newPhone: string; code: string }) => {
    return new Promise((resolve, reject) => {
      console.log('[Backend] Updating Phone:', params);
      // 模拟校验：验证码必须是 1234
      if (params.code === '1234') resolve({ success: true });
      else reject({ msg: '验证码错误' });
    });
  },
  // 更新密码
  updatePassword: (params: { phone: string; code: string; newPass: string }) => {
    return new Promise((resolve, reject) => {
      console.log('[Backend] Updating Password:', params);
      if (params.code === '1234') resolve({ success: true });
      else reject({ msg: '验证码错误' });
    });
  }
};

Page({
  data: {
    // 示例初始数据
    userInfo: {
      phone: '13800138000', 
      password: '••••••••'
    },
    // 模拟设置状态
    settings: {
      newMerchant: true,
      favUpdate: true,
      reply: false
    },

     // --- 弹窗相关状态 ---
     showDialog: false,
     dialogType: '' as 'phone' | 'password', // 当前弹窗类型
     dialogTitle: '',

     // 表单数据
     formData: {
      phoneInput: '',    // 新手机号输入
      codeInput: '',     // 验证码输入
      passInput: ''      // 新密码输入
    },
    
    // 倒计时状态
    countdown: 60,
    isCounting: false,
    btnText: '发送验证码'
  },

  timer: null as any, // 定时器引用

  // --- 1. 触发弹窗 ---
  
  // 点击手机号栏
  onEditPhone() {
    this.resetForm();
    this.setData({
      showDialog: true,
      dialogType: 'phone',
      dialogTitle: '更换绑定手机'
    });
  },

  // 点击密码栏
  onEditPassword() {
    this.resetForm();
    this.setData({
      showDialog: true,
      dialogType: 'password',
      dialogTitle: '重置登录密码'
    });
  },

  // --- 2. 表单交互逻辑 ---

  // 统一输入处理
  onInputChange(e: any) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${key}`]: value
    });
  },

  // 发送验证码
  onSendCode() {
    if (this.data.isCounting) return;

    // 简单校验手机号 (修改密码时默认使用当前绑定的手机号)
    const targetPhone = this.data.dialogType === 'phone' 
      ? this.data.formData.phoneInput 
      : this.data.userInfo.phone;

    if (!/^1\d{10}$/.test(targetPhone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '发送中...' });

    // 调用后端接口
    MockAPI.sendVerifyCode(targetPhone).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      
      // 开始倒计时
      this.setData({ isCounting: true, countdown: 60, btnText: '60s' });
      this.timer = setInterval(() => {
        let t = this.data.countdown;
        if (t > 1) {
          this.setData({ countdown: t - 1, btnText: `${t - 1}s` });
        } else {
          clearInterval(this.timer);
          this.setData({ isCounting: false, countdown: 60, btnText: '重新发送' });
        }
      }, 1000);
    });
  },

  // 提交确认
  onDialogConfirm() {
    const { dialogType, formData } = this.data;
    const { phoneInput, codeInput, passInput } = formData;

    if (!codeInput) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    // 分流处理
    if (dialogType === 'phone') {
      if (!/^1\d{10}$/.test(phoneInput)) {
        wx.hideLoading();
        wx.showToast({ title: '新手机号格式错误', icon: 'none' });
        return;
      }

      MockAPI.updatePhone({ newPhone: phoneInput, code: codeInput })
        .then(() => {
          this.handleSuccess('手机号修改成功');
          this.setData({ 'userInfo.phone': phoneInput }); // 更新页面显示
        })
        .catch((err: any) => this.handleError(err));

    } else if (dialogType === 'password') {
      if (passInput.length < 6) {
        wx.hideLoading();
        wx.showToast({ title: '密码不能少于6位', icon: 'none' });
        return;
      }

      MockAPI.updatePassword({ 
        phone: this.data.userInfo.phone, 
        code: codeInput, 
        newPass: passInput 
      })
      .then(() => {
        this.handleSuccess('密码重置成功，请重新登录');
        // 密码修改通常需要登出，这里仅做演示
      })
      .catch((err: any) => this.handleError(err));
    }
  },

  // 关闭弹窗
  onDialogClose() {
    this.setData({ showDialog: false });
    this.resetForm();
  },

  // 辅助函数：重置表单
  resetForm() {
    clearInterval(this.timer);
    this.setData({
      'formData.phoneInput': '',
      'formData.codeInput': '',
      'formData.passInput': '',
      isCounting: false,
      btnText: '发送验证码'
    });
  },

  // 辅助函数：成功处理
  handleSuccess(msg: string) {
    wx.hideLoading();
    this.setData({ showDialog: false });
    wx.showToast({ title: msg, icon: 'success' });
  },

  // 辅助函数：错误处理
  handleError(err: any) {
    wx.hideLoading();
    wx.showToast({ title: err.msg || '操作失败', icon: 'none' });
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


