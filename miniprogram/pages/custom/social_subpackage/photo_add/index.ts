// pages/custom/social_subpackage/post_publish/index.ts
Page({
  data: {
    // 表单数据
    content: '',
    fileList: [] as any[],
    isPublishing: false,

    //  新增：动态配置项 (对接后端) 

    // 1. 所在位置 (动态配置) ---
    location: null as any,      // 后端需要的完整对象 (name, address, lat, lng)
    locationText: '所在位置',    // 前端显示的文案 (默认值)

    // 2. 谁可以看
    privacyOptions: ['公开', '私密', '仅粉丝可见'],
    privacyIndex: 0, // 默认索引
    privacyText: '公开', // 显示的文本

    // 3. 提醒谁看
    mentionList: [] as any[], // 选中的用户列表 (id, name)
    mentionText: '' // 用于显示在右侧的文本 (如: "@张三 等2人")
  },

  // 1. 监听输入
  onInput(e: any) {
    this.setData({ content: e.detail.value });
  },

  // 2. 图片上传 - 添加
  handleAdd(e: any) {
    const { files } = e.detail;
    const { fileList } = this.data;
    this.setData({
      fileList: [...fileList, ...files]
    });
  },

  // 3. 图片上传 - 删除
  handleRemove(e: any) {
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({ fileList });
  },

  // 4. 选择位置
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        console.log('选择的位置:', res);
        this.setData({
          location: res,
          // 选中后，更新文案为地点名称
          locationText: res.name 
        });
      },
      fail: (err) => {
        // 用户取消无需处理，保持原样即可
        console.log('未选择位置', err);
      }
    });
  },

   // 5. 清除位置 
   clearLocation() {
    // 恢复默认状态
        this.setData({
        location: null,
        locationText: '所在位置' 
    });
  },

  // 6. 发布
  submitPost() {
    const { content, fileList, location } = this.data;
    if (!content.trim() && fileList.length === 0) {
      wx.showToast({ title: '内容不能为空', icon: 'none' });
      return;
    }

    this.setData({ isPublishing: true });
    wx.showLoading({ title: '发布中...' });

    // 模拟提交
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ isPublishing: false });
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    }, 1000);
  },

  // --- 新增：选择“谁可以看” ---
  choosePrivacy() {
    // 这里可以使用 wx.showActionSheet 模拟选择
    wx.showActionSheet({
      itemList: this.data.privacyOptions,
      success: (res) => {
        const index = res.tapIndex;
        this.setData({
          privacyIndex: index,
          privacyText: this.data.privacyOptions[index]
        });
      }
    });
  },

  // --- 新增：选择“提醒谁看” ---
  chooseMention() {
    // TODO: 【后端对接】跳转到好友选择页面
    // wx.navigateTo({ url: '/pages/friend_selector/index' })
    
    // 模拟选中了两个人
    wx.showToast({ title: '模拟选中好友', icon: 'none' });
    const mockUsers = [{ name: '饭搭子' }, { name: '小馋猫' }];
    
    this.setData({
      mentionList: mockUsers,
      mentionText: `包含 ${mockUsers[0].name} 等${mockUsers.length}人`
    });
  }
});