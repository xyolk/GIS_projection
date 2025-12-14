// pages/custom/social_subpackage/checkin_add/index.ts

// 定义后端数据接口规范 (Interface) 
interface ShopInfo {
  id: number;
  name: string;
  category: string;
  visitCount: number;
}

interface HistoryItem {
  id: number;
  timestamp: number; // 使用时间戳
  dateStr: string;   // 前端格式化后的日期
  timeStr: string;   // 前端格式化后的时间
  shopName: string;
  mood: string;      // 心情 Tag
  imageUrl?: string; // 图片地址 (可选)
}

Page({
  data: {
    // --- 页面状态 ---
    isLoading: true,
    
    // --- 2. 顶部卡片数据 (等待接口填充) ---
    currentShop: null as ShopInfo | null,

    // --- 3. 心情标签配置 (Emoji 是文本，后端存储字符串即可) ---
    moodTags: [
      { text: '😊 开心', checked: true },
      { text: '😋 嘴馋', checked: false },
      { text: '😌 放松', checked: false },
      { text: '🏃 匆忙', checked: false },
      { text: '👫 聚会', checked: false },
      { text: '💼 商务', checked: false }
    ],

    // --- 4. 图片上传 ---
    fileList: [] as any[],

    // --- 5. 历史足迹列表 ---
    historyList: [] as HistoryItem[]
  },

  onLoad() {
    this.initPageData();
  },

  // --- 初始化数据 (模拟并发请求) ---
  initPageData() {
    wx.showLoading({ title: '定位中...' });
    
    // 模拟 Promise.all 等待后端返回
    Promise.all([
      this.fetchCurrentShop(),
      this.fetchHistory()
    ]).then(() => {
      wx.hideLoading();
      this.setData({ isLoading: false });
    });
  },

  // --- 接口 A: 获取当前店铺/推荐店铺 ---
  fetchCurrentShop() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockShop: ShopInfo = {
          id: 1,
          name: '南京大牌档 (德基广场店)',
          category: '淮扬菜',
          visitCount: 3
        };
        this.setData({ currentShop: mockShop });
        resolve(mockShop);
      }, 500);
    });
  },

  // --- 接口 B: 获取历史打卡记录 ---
  fetchHistory() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockHistory: HistoryItem[] = [
          {
            id: 101, timestamp: 1702377000000, dateStr: '12.12', timeStr: '18:30',
            shopName: '茶颜悦色 (新街口店)', mood: '😋 嘴馋', 
            imageUrl: 'https://tdesign.gtimg.com/miniprogram/images/example1.png' // 模拟有图
          },
          {
            id: 102, timestamp: 1702182900000, dateStr: '12.10', timeStr: '12:15',
            shopName: '老门东大排档', mood: '👫 聚会' // 无图
          },
          {
            id: 103, timestamp: 1701738000000, dateStr: '12.05', timeStr: '09:00',
            shopName: '星巴克 (1912街区)', mood: '💼 商务'
          }
        ];
        this.setData({ historyList: mockHistory });
        resolve(mockHistory);
      }, 500);
    });
  },

  // 切换心情标签
  onTagChange(e: any) {
    const index = e.currentTarget.dataset.index;
    const newTags = this.data.moodTags.map((tag, i) => ({
      ...tag,
      checked: i === index
    }));
    this.setData({ moodTags: newTags });
  },

  // 图片上传
  handleAdd(e: any) {
    const { files } = e.detail;
    this.setData({ fileList: [...this.data.fileList, ...files] });
  },
  
  handleRemove(e: any) {
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({ fileList });
  },

  onChangeShop() {
    wx.showToast({ title: '打开店铺列表选择', icon: 'none' });
  },

  // 查看大图
  onPreviewImage(e: any) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url], // 需要数组
      current: url
    });
  },

  // --- 确认打卡 ---
  doCheckIn() {
    const selectedMood = this.data.moodTags.find(t => t.checked);
    
    // 1. 构造提交给后端的 Payload
    const payload = {
      shopId: this.data.currentShop?.id,
      mood: selectedMood?.text || '打卡',
      // 如果有图片，通常是先上传得到 URL，这里取第一张
      imageUrl: this.data.fileList.length > 0 ? this.data.fileList[0].url : null, 
      timestamp: new Date().getTime()
    };

    console.log('>>> 向后端提交打卡数据:', payload);

    wx.showLoading({ title: '记录中...' });

    // 2. 模拟成功回调
    setTimeout(() => {
      wx.hideLoading();
      
      // 手动构造一个本地显示的 Item，插入到列表头部，实现"即时反馈"
      const now = new Date();
      const newRecord: HistoryItem = {
        id: now.getTime(),
        timestamp: now.getTime(),
        dateStr: '刚刚',
        timeStr: 'Now',
        shopName: this.data.currentShop?.name || '未知店铺',
        mood: payload.mood,
        imageUrl: payload.imageUrl || (this.data.fileList.length > 0 ? this.data.fileList[0].url : undefined)
      };

      this.setData({
        historyList: [newRecord, ...this.data.historyList],
        fileList: [], // 清空上传框
      });

      wx.showToast({ title: '打卡成功', icon: 'success' });
    }, 600);
  }
});