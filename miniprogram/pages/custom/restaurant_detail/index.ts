// pages/shop_detail/index.ts

// --- 接口定义 ---

interface RatingDistribution {
  score: 5 | 4 | 3 | 2 | 1;
  count: number;
  percent: number;
}

interface ReviewTag {
  id: string;
  text: string;
  count: number;
  type: 'positive' | 'negative' | 'neutral'; // 用于前端区分颜色
}

interface ReviewStats {
  averageScore: number;     // 总分
  tasteScore: number;       // 口味分
  serviceScore: number;     // 服务分
  environmentScore: number; // 环境分
  totalCount: number;
  tags: ReviewTag[];        // 筛选标签列表
  distribution?: RatingDistribution[]; 
}

interface ShopTag {
  text: string;
  type: 'outline' | 'light' | 'primary';
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  recommendCount: number;
}

interface UserReview {
  id: string;
  userId: string;
  userName: string;
  userLevel?: number; // 用户等级
  avatarUrl: string;
  rating: number;     // 评分
  date: string;
  content: string;
  images?: string[];
  likeCount: number;  // 点赞数
  isLiked: boolean;   // 当前用户是否已赞
  replyCount: number; // 回复数
  merchantReply?: string; // 商家回复
}

interface ShopDetail {
  id: string;
  name: string;
  coverImages: string[];
  rating: number;
  reviewCount: number;
  perCapita: number;
  category: string;
  tags: ShopTag[];
  
  // 商家画像/Vibe
  matchScore: number;
  vibeTags: string[];
  
  // 基础信息
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  openTime: string;
  
  // 关联数据
  topMenu: MenuItem[];
  reviews: UserReview[];
  reviewStats: ReviewStats; 
}

Page({
  data: {
    isLoading: true,
    shopId: '',
    
    // 页面状态
    currentTab: 'review', // 默认展示 review 方便调试
    currentTagId: 'all',  // 当前选中的评价筛选标签
    
    // 核心数据对象
    shop: null as ShopDetail | null,
    
    // 静态配置：Tab选项
    tabList: [
      { value: 'menu', label: '推荐菜品' },
      { value: 'info', label: '商家信息' },
      { value: 'review', label: '用户评价' },
    ]
  },

  onLoad(options: { id?: string }) {
    const id = options.id || '1001';
    this.setData({ shopId: id });
    this.fetchShopDetail(id);
  },

  // --- 模拟 API 请求 ---
  fetchShopDetail(id: string) {
    this.setData({ isLoading: true });
    
    setTimeout(() => {
      // 1. 构造评价概览数据
      const mockReviewStats: ReviewStats = {
        averageScore: 4.8,
        tasteScore: 4.9,
        serviceScore: 4.7,
        environmentScore: 4.8,
        totalCount: 2045,
        tags: [
          { id: 'all', text: '全部', count: 2045, type: 'neutral' },
          { id: 'pic', text: '有图', count: 560, type: 'neutral' },
          { id: 'good', text: '味道赞', count: 1200, type: 'positive' },
          { id: 'bad', text: '服务一般', count: 45, type: 'negative' },
          { id: 'env', text: '环境好', count: 800, type: 'positive' }
        ]
      };

      // 2. 构造评价列表数据
      const mockReviews: UserReview[] = [
        {
          id: 'r1',
          userId: 'u1',
          userName: 'Yelp资深吃货',
          userLevel: 6,
          avatarUrl: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
          rating: 5,
          date: '2025-12-12',
          content: '非常有格调的一家店，牛排火候控制得刚刚好，服务也很贴心！强烈推荐晚上来，灯光氛围绝了。',
          images: [
            'https://tdesign.gtimg.com/miniprogram/images/example1.png',
            'https://tdesign.gtimg.com/miniprogram/images/example2.png'
          ],
          likeCount: 128,
          isLiked: true,
          replyCount: 5,
          merchantReply: '感谢您的喜爱，期待再次光临！'
        },
        {
          id: 'r2',
          userId: 'u2',
          userName: '周末探店小队',
          userLevel: 3,
          avatarUrl: 'https://tdesign.gtimg.com/miniprogram/images/avatar2.png',
          rating: 4,
          date: '2025-12-10',
          content: '环境满分，拍照很出片。就是人比较多，建议提前预约。',
          likeCount: 45,
          isLiked: false,
          replyCount: 0,
          images: []
        },
        {
          id: 'r3',
          userId: 'u3',
          userName: '老南京生活',
          avatarUrl: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
          rating: 5,
          date: '2025-12-08',
          content: '味道很正宗，作为老南京人觉得这家的创新菜做得很有意思，推荐大家试试。',
          likeCount: 12,
          isLiked: false,
          replyCount: 2
        }
      ];

      // 3. 合并完整数据
      const mockData: ShopDetail = {
        id: id,
        name: 'The Queens Arms · 皇后小酒馆',
        coverImages: [
          'https://tdesign.gtimg.com/miniprogram/images/example1.png',
          'https://tdesign.gtimg.com/miniprogram/images/example2.png'
        ],
        rating: 4.8,
        reviewCount: 2045,
        perCapita: 128,
        category: '英式西餐 · Bistro',
        tags: [
          { text: '黑珍珠入围', type: 'light' },
          { text: '南京西餐热门榜 No.1', type: 'light' }
        ],
        matchScore: 92,
        vibeTags: ['氛围感拉满', '适合约会', '爵士乐', '露台座位'],
        address: '南京市鼓楼区北京西路99号 (近南大校门)',
        latitude: 32.060255,
        longitude: 118.796877,
        phone: '025-88889999',
        openTime: '周一至周日 11:00-02:00',
        topMenu: [
          { id: 'm1', name: '惠灵顿牛排', price: 298, recommendCount: 520, imageUrl: 'https://tdesign.gtimg.com/miniprogram/images/example3.png' },
          { id: 'm2', name: '黑松露意面', price: 88, recommendCount: 310, imageUrl: 'https://tdesign.gtimg.com/miniprogram/images/example1.png' }
        ],
        reviewStats: mockReviewStats,
        reviews: mockReviews
      };

      this.setData({
        shop: mockData,
        isLoading: false
      });
    }, 800);
  },

  // --- 交互事件 ---

  // 1. 切换页面 Tab
  onTabChange(e: any) {
    this.setData({ currentTab: e.detail.value });
  },

  // 2. 切换评价筛选标签 (全部/有图/差评)
  onTapReviewTag(e: any) {
    const tagId = e.currentTarget.dataset.id;
    if (tagId === this.data.currentTagId) return;
    
    this.setData({ currentTagId: tagId });
    
    wx.showToast({ title: `切换标签: ${tagId}`, icon: 'none' });
    // 真实开发：此处调用 this.fetchReviews(tagId) 重新拉取列表
  },

  // 3. 评价点赞
  onLikeReview(e: any) {
    const index = e.currentTarget.dataset.index; // 需要 wxml 传递 data-index
    const review = this.data.shop?.reviews[index];
    if (!review) return;

    // 乐观 UI 更新
    const newStatus = !review.isLiked;
    const newCount = newStatus ? review.likeCount + 1 : review.likeCount - 1;
    
    const key = `shop.reviews[${index}]`;
    this.setData({
      [`${key}.isLiked`]: newStatus,
      [`${key}.likeCount`]: newCount
    });

    // TODO: 调用后端 API
  },

  // 4. 点击评价卡片 (准备跳转详情页)
  onTapReviewCard(e: any) {
    const id = e.currentTarget.dataset.id;
    
    // 跳转到刚才新建的页面
    wx.navigateTo({
      url: `/pages/custom/social_subpackage/review_detail/index`,
      success: () => {
        console.log('跳转评论详情成功:', id);
      },
      fail: (err) => {
        console.error('跳转失败，请检查 app.json 是否注册了页面', err);
      }
    });
  },

  // 5. 评价图片预览 (区别于顶部的商家图预览)
  onPreviewReviewImage(e: any) {
    // 阻止冒泡，避免触发卡片点击
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({
      current: current,
      urls: urls // 只浏览当前这条评论的图片
    });
  },

  // --- 原有通用交互 ---

  onCallShop() {
    const { shop } = this.data;
    if (!shop) return;
    wx.makePhoneCall({ phoneNumber: shop.phone });
  },

  onOpenMap() {
    const { shop } = this.data;
    if (!shop) return;
    wx.openLocation({
      latitude: shop.latitude,
      longitude: shop.longitude,
      name: shop.name,
      address: shop.address,
      scale: 18
    });
  },

  // 顶部商家图预览
  onPreviewImage(e: any) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.shop?.coverImages || []
    });
  },
  
  onBookTable() {
    wx.showToast({ title: '跳转预约小程序...', icon: 'none' });
  }
});