// pages/custom/diner_collection_detail/index.ts

interface Store {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  category: string;
  tag?: string;
  tagColor?: string; // 对应 tailwind 的颜色逻辑
  imageColor: string;
}

interface Collection {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: string;
}

Page({
  data: {
    // 新增：用于存储当前详情页对应的 ID，默认为空，onLoad 时获取
    currentId: '',
    // 页面头部信息
    collectionInfo: {
      title: '南京必吃榜',
      subtitle: '12家门店 · 2.3k收藏',
      creator: '美食达人',
      createDate: '2023-10-15',
      description: '南京必吃美食推荐，包含各种特色餐厅和小吃店，让你一次尝遍金陵美味。',
      isFollowed: false
    },

    // 店铺列表数据 (模拟 HTML 中的数据)
    stores: [
      { id: '1', name: '老门东盐水鸭', tag: '特色', tagColor: 'orange', location: '老门东历史文化街区', rating: 4.8, price: 58, category: '熟食', imageColor: '#ffecb3' },
      { id: '2', name: '鸡鸣汤包', tag: '人气', tagColor: 'teal', location: '湖南路美食街', rating: 4.6, price: 35, category: '小吃', imageColor: '#b2dfdb' },
      { id: '3', name: '鸭血粉丝汤', tag: '必吃', tagColor: 'red', location: '夫子庙景区', rating: 4.7, price: 28, category: '汤品', imageColor: '#ffcdd2' },
      { id: '4', name: '金陵大肉包', tag: '早餐', tagColor: 'blue', location: '新街口商圈', rating: 4.5, price: 12, category: '快餐', imageColor: '#bbdefb' },
      { id: '5', name: '桂花糖芋苗', tag: '甜品', tagColor: 'purple', location: '秦淮河畔', rating: 4.4, price: 15, category: '甜品', imageColor: '#e1bee7' },
    ] as Store[],showModal: false,
    selectedStore: null as Store | null,
    
    myCollections: [
      { id: 'c1', name: '我的最爱', count: 6, icon: 'star', color: 'orange' },
      { id: 'c2', name: '甜品合集', count: 8, icon: 'cake', color: 'blue' },
      { id: 'c3', name: '咖啡馆', count: 12, icon: 'local-cafe', color: 'green' }
    ] as Collection[],
    
    targetCollectionId: 'c1'
  },

    onLoad(options: any) {
      // 1. 获取收藏界面传来的 ID 和 Name (如果有的话)
      // 如果是从列表页跳转过来的，options 里应该有 id
      const id = options.id ? String(options.id) : '1';
      const name = options.name || this.data.collectionInfo.title;
  
      this.setData({ 
        currentId: id,
        'collectionInfo.title': name // 更新标题
      });
      this.checkFollowStatus(id);
    },
      
    checkFollowStatus(currentId: string) {
      const followedList = wx.getStorageSync('diner_followed_list') || [];
      console.log('当前缓存的关注列表:', followedList);
  
      // 比较时强制转 string
      const isFollowed = followedList.some((item: any) => String(item.id) === currentId);
      
      console.log(`ID [${currentId}] 是否已关注:`, isFollowed);
  
      this.setData({
        'collectionInfo.isFollowed': isFollowed
      });
    },

  // 1. 关注/取消关注 收藏夹
  onToggleFollow() {
    const { isFollowed, title, subtitle, creator } = this.data.collectionInfo;
    const currentId = this.data.currentId;

    // 1. 读取当前的关注列表
    let followedList = wx.getStorageSync('diner_followed_list') || [];

    if (!isFollowed) {
      // === 执行“关注”逻辑 ===
      
      // 构造要存入缓存的数据对象
      // (字段名要和列表页要求的字段对应: id, name, desc, tag, bgClass)
      const newItem = {
        id: currentId,
        name: title,
        desc: subtitle || '精选推荐', 
        tag: creator || '寻味金陵',
        bgClass: 'bg-orange-100' // 给个默认背景色，或者随机
      };

      // 避免重复添加
      const exists = followedList.some((item: any) => String(item.id) === String(currentId));
      if (!exists) {
        followedList.push(newItem);
      }

      this.setData({ 'collectionInfo.isFollowed': true });
      wx.showToast({ title: '已收藏该系列', icon: 'success' });

    } else {
      // === 执行“取消关注”逻辑 ===
      
      // 过滤掉当前 ID
      followedList = followedList.filter((item: any) => String(item.id) !== String(currentId));

      this.setData({ 'collectionInfo.isFollowed': false });
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    }
    // 保存回本地缓存
    wx.setStorageSync('diner_followed_list', followedList);
  },

  // 2. 点击分享
  onShareCollection() {
    wx.showToast({ title: '分享功能开发中', icon: 'none' });
  },

  // 3. 点击店铺卡片上的爱心 (打开弹窗)
  onFavoriteStore(e: any) {
    const index = e.currentTarget.dataset.index;
    const store = this.data.stores[index];
    
    this.setData({
      selectedStore: store,
      showModal: true
    });
  },

  // 4. 关闭弹窗
  onCloseModal() {
    this.setData({ showModal: false });
  },

  // 5. 弹窗中选择收藏夹
  onSelectCollectionChange(e: any) {
    this.setData({
      targetCollectionId: e.detail.value
    });
  },

  // 6. 确认添加到收藏夹
  onConfirmAdd() {
    const { targetCollectionId, myCollections, selectedStore } = this.data;
    const target = myCollections.find(c => c.id === targetCollectionId);
    
    if (target && selectedStore) {
      wx.showToast({
        title: `已添加到 ${target.name}`,
        icon: 'success'
      });
      this.onCloseModal();
    }
  },

  // 跳转到店铺详情 (预留)
  onNavigateToStore(e: any) {
    const id = e.currentTarget.dataset.id;
    console.log('跳转店铺ID:', id);
    // wx.navigateTo({ url: `/pages/store_detail/index?id=${id}` });
  }
});