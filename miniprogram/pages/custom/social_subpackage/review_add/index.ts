// pages/custom/subpackages/review_add/index.ts
Page({
  data: {
    // 页面状态
    statusBarHeight: 0, 

    // 选店逻辑状态
    selectedShop: null as any, 
    searchKeyword: '',
    
    // --- 动态数据部分 ---
    // 最近浏览 (初始为空，等待接口加载)
    recentShops: [] as any[], 

    // 搜索结果 (初始为空)
    searchResults: [] as any[],
    
    // 是否正在搜索 (用于界面状态切换)
    isSearching: false,
  
    // 表单数据
    rateValue: 0, 
    reviewText: '', 
    fileList: [] as any[],
    
    // 快捷标签
    tags: [
      { text: '味道赞', checked: false },
      { text: '服务热情', checked: false },
      { text: '环境优雅', checked: false },
      { text: '性价比高', checked: false },
      { text: '需排队', checked: false }
    ]
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sysInfo.statusBarHeight });

    // 页面加载时，调用接口获取“最近光顾/浏览”
    this.fetchRecentShops();
  },

  // --- 1. 获取最近浏览 (模拟后端) ---
  fetchRecentShops() {
    // TODO: 【后端对接】发送 wx.request 获取用户的浏览历史
    // 模拟延迟加载
    setTimeout(() => {
      const mockData = [
        { id: 1, name: '南京大牌档 (德基店)', img: 'bg-orange-light', distance: '0.5km' },
        { id: 2, name: '小厨娘淮扬菜', img: 'bg-teal-light', distance: '1.2km' },
        { id: 3, name: '李记清真馆', img: 'bg-red-light', distance: '3.0km' }
      ];
      this.setData({ recentShops: mockData });
    }, 500);
  },

  // --- 2. 监听搜索输入 (新增逻辑) ---
  onSearchChange(e: any) {
    const keyword = e.detail.value;
    
    // 更新搜索词和搜索状态
    this.setData({ 
      searchKeyword: keyword,
      isSearching: keyword && keyword.length > 0 // 只要有字就算正在搜索
    });

    // 防抖逻辑通常在这里做，简单起见直接调用
    if (keyword.length > 0) {
      this.doSearch(keyword);
    } else {
      // 如果清空了输入框，也清空搜索结果
      this.setData({ searchResults: [] });
    }
  },

  // --- 3. 执行搜索 (新增逻辑) ---
  doSearch(keyword: string) {
    console.log('正在搜索关键词:', keyword);
    
    // TODO: 【后端对接】发送 wx.request 调用搜索店铺接口
    // 参数: { keyword: keyword, city_id: ... }
    
    // --- ⬇️ 以下是纯前端模拟数据，后端对接时请删除 ---
    // 我们构建一个更大的假数据库来演示搜索效果
    const mockDatabase = [
      ...this.data.recentShops, // 包含最近浏览的
      { id: 4, name: '茶颜悦色 (新街口店)', img: 'bg-orange-light', distance: '0.1km' },
      { id: 5, name: '海底捞火锅', img: 'bg-red-light', distance: '2.5km' },
      { id: 6, name: '星巴克 (1912街区)', img: 'bg-teal-light', distance: '0.8km' }
    ];

    // 简单的模糊匹配
    const results = mockDatabase.filter(shop => 
      shop.name.includes(keyword)
    );
    // --- ⬆️ 模拟结束 ---

    this.setData({ searchResults: results });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 选择店铺
  selectShop(e: any) {
    const shop = e.currentTarget.dataset.shop;
    
    this.setData({ 
      selectedShop: shop,
      // 选中后，清空搜索状态，这样如果用户点击"X"移除店铺，看到的是干净的默认界面
      searchKeyword: '',
      isSearching: false,
      searchResults: []
    });
  },

  // 移除当前店铺（重选）
  removeShop() {
    this.setData({ selectedShop: null });
  },

  // 评分变化
  onRateChange(e: any) {
    this.setData({ rateValue: e.detail.value });
  },

  // 文本输入
  onInputChange(e: any) {
    this.setData({ reviewText: e.detail.value });
  },

  // 标签选择
  onTagChange(e: any) {
    const index = e.currentTarget.dataset.index;
    const key = `tags[${index}].checked`;
    this.setData({ [key]: !this.data.tags[index].checked });
  },

  // 图片上传 (TDesign 组件回调)
  handleAdd(e: any) {
    const { files } = e.detail;
    const { fileList } = this.data;
    this.setData({
      fileList: [...fileList, ...files] 
    });
  },

  // 删除图片
  handleRemove(e: any) {
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({ fileList });
  },

  // 提交评价
  submitReview() {
    if (!this.data.selectedShop) {
      wx.showToast({ title: '请先选择店铺', icon: 'none' });
      return;
    }
    if (this.data.rateValue === 0) {
      wx.showToast({ title: '请打分', icon: 'none' });
      return;
    }
    
    // TODO: 【后端对接】这里提交最终数据到服务器
    // const postData = {
    //   shopId: this.data.selectedShop.id,
    //   rate: this.data.rateValue,
    //   content: this.data.reviewText,
    //   tags: this.data.tags.filter(t => t.checked).map(t => t.text),
    //   images: this.data.fileList.map(f => f.url)
    // }

    wx.showLoading({ title: '发布中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    }, 1000);
  }
});