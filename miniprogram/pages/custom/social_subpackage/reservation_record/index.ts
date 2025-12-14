// pages/reservation_record/index.ts

// --- 接口定义 (DTO) ---

// 预定状态枚举
type ReservationStatus = 'pending' | 'completed' | 'cancelled';

interface ReservationItem {
  id: string;
  shopId: string;
  shopName: string;
  shopImage: string;
  time: string;          // 预定时间
  peopleCount: number;   // 用餐人数
  status: ReservationStatus;
  statusText: string;    // 前端显示的状态文案
}

Page({
  data: {
    isLoading: true,
    list: [] as ReservationItem[],
    
    // 状态标签的颜色映射 (TDesign Tag Theme)
    statusColors: {
      'pending': 'warning',   // 橙色 (待用餐)
      'completed': 'success', // 绿色 (已完成)
      'cancelled': 'default'  // 灰色 (已取消)
    } as Record<string, string>
  },

  onLoad() {
    this.fetchReservations();
  },

  onPullDownRefresh() {
    this.fetchReservations();
  },

  // --- 模拟获取数据 ---
  fetchReservations() {
    this.setData({ isLoading: true });

    setTimeout(() => {
      const mockList: ReservationItem[] = [
        {
          id: 'res_001',
          shopId: 's1',
          shopName: 'The Queens Arms · 皇后小酒馆',
          shopImage: 'https://tdesign.gtimg.com/miniprogram/images/example1.png',
          time: '2025-12-24 19:00',
          peopleCount: 2,
          status: 'pending',
          statusText: '待用餐'
        },
        {
          id: 'res_002',
          shopId: 's2',
          shopName: '南京大牌档 (德基店)',
          shopImage: 'https://tdesign.gtimg.com/miniprogram/images/example2.png',
          time: '2025-12-10 12:30',
          peopleCount: 4,
          status: 'completed',
          statusText: '已完成'
        },
        {
          id: 'res_003',
          shopId: 's3',
          shopName: 'Blue Frog 蓝蛙',
          shopImage: 'https://tdesign.gtimg.com/miniprogram/images/example3.png',
          time: '2025-11-20 18:00',
          peopleCount: 3,
          status: 'cancelled',
          statusText: '已取消'
        }
      ];

      this.setData({
        list: mockList,
        isLoading: false
      });
      wx.stopPullDownRefresh();
    }, 600);
  },

  // --- 交互逻辑 ---

  // 1. 点击卡片跳转店铺详情
  onTapItem(e: any) {
    const { shopid } = e.currentTarget.dataset;
    // 跳转到店铺详情页 (假设之前做的是 pages/shop_detail/index)
    wx.navigateTo({ url: `/pages/shop_detail/index?id=${shopid}` });
  },

  // 2. 侧滑删除
  onDeleteItem(e: any) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条预定记录吗？',
      confirmColor: '#ff9800',
      success: (res) => {
        if (res.confirm) {
          const newList = this.data.list.filter(item => item.id !== id);
          this.setData({ list: newList });
          wx.showToast({ title: '已删除', icon: 'none' });
          // TODO: Call Backend API
        }
      }
    });
  }
});