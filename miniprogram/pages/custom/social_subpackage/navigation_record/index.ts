// pages/navigation_record/index.ts

// --- DTO: 后端数据接口定义 ---

// 交通方式枚举
type TransportType = 'driving' | 'walking' | 'bicycling' | 'transit';

// 导航记录项
interface NavigationRecord {
  id: string;
  createTime: string;      // 发起导航的时间
  fromName: string;        // 起点名称 (通常是 "我的位置")
  toName: string;          // 终点名称 (店铺名)
  toAddress: string;       // 终点地址
  transportType: TransportType; // 交通方式
  distance?: string;       // 预估距离 (可选，如 "5.2km")
  status: 'completed' | 'cancelled'; // 这里的状态通常由前端记录发起即为completed，或者由用户手动标记，导航APP无法回调
}

// --- 💡 关键：数据流向说明 (给后端开发者看) ---
/*
 * 场景：用户在“店铺详情页”点击“导航”按钮。
 * 流程：
 * 1. 前端调用 wx.getLocation 获取当前位置。
 * 2. 前端调用后端接口: POST /api/navigation/add
 * Payload: { shopId: 's1', shopName: '店铺名', transportType: 'driving', ... }
 * 3. 后端保存记录，返回 success。
 * 4. 前端调用 wx.openLocation 打开地图。
 */

Page({
  data: {
    isLoading: true,
    list: [] as NavigationRecord[],

    // 交通方式对应的图标映射 (TDesign Icon)
    iconMap: {
      'driving': 'logo-wechat', // 模拟车图标，实际可用 'car' 如果图标库有
      'walking': 'user',
      'bicycling': 'bg-colors', // 模拟
      'transit': 'location'
    } as Record<string, string>,

    // 交通方式文案
    textMap: {
      'driving': '驾车',
      'walking': '步行',
      'bicycling': '骑行',
      'transit': '公交'
    } as Record<string, string>
  },

  onLoad() {
    this.fetchRecords();
  },

  onPullDownRefresh() {
    this.fetchRecords();
  },

  // --- 模拟获取列表数据 ---
  fetchRecords() {
    this.setData({ isLoading: true });

    setTimeout(() => {
      const mockList: NavigationRecord[] = [
        {
          id: 'nav_001',
          createTime: '2025-12-14 18:20',
          fromName: '当前位置',
          toName: 'The Queens Arms · 皇后小酒馆',
          toAddress: '鼓楼区北京西路99号',
          transportType: 'driving',
          distance: '3.5km',
          status: 'completed'
        },
        {
          id: 'nav_002',
          createTime: '2025-12-10 12:00',
          fromName: '新街口地铁站',
          toName: '南京大牌档 (德基店)',
          toAddress: '中山路18号德基广场',
          transportType: 'walking',
          distance: '800m',
          status: 'completed'
        },
        {
          id: 'nav_003',
          createTime: '2025-11-20 09:30',
          fromName: '当前位置',
          toName: '先锋书店',
          toAddress: '五台山店',
          transportType: 'transit',
          distance: '12km',
          status: 'completed'
        }
      ];

      this.setData({
        list: mockList,
        isLoading: false
      });
      wx.stopPullDownRefresh();
    }, 500);
  },

  // --- 交互：侧滑删除 ---
  onDeleteItem(e: any) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条导航历史吗？',
      confirmColor: '#ff9800',
      success: (res) => {
        if (res.confirm) {
          const newList = this.data.list.filter(item => item.id !== id);
          this.setData({ list: newList });
          // TODO: Call API: DELETE /api/navigation/{id}
        }
      }
    });
  },

  // 再次发起导航 (复用记录)
  onReNavigate(e: any) {
    const item = e.currentTarget.dataset.item as NavigationRecord;
    // 这里演示了“再次导航”的数据闭环
    wx.openLocation({
      latitude: 0, // 实际开发需要从 item 里存坐标
      longitude: 0,
      name: item.toName,
      address: item.toAddress
    });
    // 注意：这里理论上应该再调一次 POST /api/navigation/add 生成新记录
  }
});