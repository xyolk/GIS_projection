// pages/custom/diner_explore/index.ts
import { config } from '../../../config' // 高德地图api确保路径正确
import { navigateToShopDetail } from '../../../utils/router' // 推荐卡片跳转方法

const app = getApp<IAppOption>()
const db = wx.cloud.database()

// 1. 定义餐厅数据接口
interface Restaurant {
  id: number
  _id?: string // 云数据库自动生成的ID
  name: string
  rating: number
  tags: string[] | string // 兼容数据库可能存字符串的情况
  location: string
  price: number
  distance: string
  imageColor: string
  latitude: number
  longitude: number
}

// 2. 定义页面自定义方法的接口
// 告诉 TS：我的 Page 实例里包含这些自定义函数
interface CustomPageMethods {
  initMap(): void;
  getRestaurantsFromCloud(userLat: number, userLng: number): void;
  updateMarkers(): void;
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string;
  onShopCardTap(e: any): void; // 用于列表卡片点击跳转
  onPopupCardTap(): void;      // 用于悬浮卡片点击跳转
  onNotificationTap(): void;   // 用于跳转消息界面
  onMarkerTap(e: any): void;
  onMapTap(): void;
  onFilterTap(e: any): void;
  switchTab(e: any): void;
  onSearch(): void;
  onNavigate(): void;
  onFavorite(): void;
  onCall(): void;
  onShowLayers(): void;
}

// 3. 定义 Data 的接口
interface PageData {
  latitude: number;
  longitude: number;
  scale: number;
  markers: any[];
  restaurants: Restaurant[];
  filters: Array<{ name: string, active: boolean }>;
  currentTab: string;
  enableSatellite: boolean;
  currentShop: Restaurant | null; //  新增：当前选中的店铺
}


// 使用泛型 Page<PageData, CustomPageMethods> 彻底解决属性不存在的报错
Page<PageData, CustomPageMethods>({
  data: {
    latitude: 32.07863,  
    longitude: 118.80527,
    scale: 14,
    enableSatellite: false,
    markers: [],
    restaurants: [],
    currentShop: null,
    
    filters: [
      { name: '全部', active: true },
      { name: '距离最近', active: false },
      { name: '价格最低', active: false },
      { name: '评分最高', active: false },
      { name: '江浙菜', active: false },
      { name: '火锅', active: false }
    ],
    currentTab: 'explore'
  },

  
  onLoad() {
    this.initMap()
  },

  initMap() {
    this.updateMarkers()
    
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: (res) => {
        console.log('当前位置:', res.latitude, res.longitude)
        
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.getRestaurantsFromCloud(res.latitude, res.longitude)
      },
      fail: (err) => {
        console.error('定位失败:', err)
        wx.showToast({ title: '定位失败，显示默认位置', icon: 'none' })
        // 定位失败也加载数据
        this.getRestaurantsFromCloud(this.data.latitude, this.data.longitude)
      }
    })
  },

  getRestaurantsFromCloud(userLat: number, userLng: number) {
    wx.showLoading({ title: '寻找美食中...' })

    // 注意：确保你的云数据库里集合名称确实叫 'restaurant'
    db.collection('restaurant').get().then(res => {
      const rawList = res.data
      if (rawList.length === 0) {
        wx.showToast({ title: '附近没有餐厅', icon: 'none' })
        wx.hideLoading()
        return
      }

      const processedList = rawList.map((item: any) => {

        // 1. 获取原始 WGS84 坐标
        const rawLat = Number(item.wgs84_lat)
        const rawLon = Number(item.wgs84_lon)

        // 2. 调用转换函数 WGS84 -> GCJ02
        // 如果数据转换失败(如NaN)，则默认使用原数据
        let finalLat = rawLat;
        let finalLon = rawLon;
        
        if (!isNaN(rawLat) && !isNaN(rawLon)) {
           const gcjPoint = wgs84ToGcj02(rawLat, rawLon);
           finalLat = gcjPoint.lat;
           finalLon = gcjPoint.lon;
        }

        return {
          ...item,
          // 兼容处理：如果是字符串就转数组，如果是数组就直接用
          // ID映射
          id: item._id, 
          
          // 店名映射: shop_name -> name
          name: item.shop_name || '未知店铺',
          
          // 地址映射: address -> location
          location: item.address || '暂无地址',
          
          // 评分映射: avg_score -> rating
          rating: Number(item.avg_score) || 4.0,
          
          // 价格映射: price -> price
          price: item.price || 0, // 暂时给个0或者随机数
          
          // 标签映射: shop_type 是字符串，前端需要数组
          // 如果数据库是 "小吃快餐"，这里转为 ["小吃快餐"]
          tags: item.shop_type ? [item.shop_type] : ['美食'],

          // 使用转换后的火星坐标赋值给 UI
          latitude: finalLat,
          longitude: finalLon,

          // 图片背景
          imageColor: item.imageColor || '#fff3e0',

          // 距离计算
          distance: this.calculateDistance(userLat, userLng, finalLat, finalLon),
        }
      })

      this.setData({
        restaurants: processedList
      })    
      this.updateMarkers()
      wx.hideLoading()

    }).catch(err => {
      console.error('云数据库读取失败:', err)
      wx.hideLoading()
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
    // 容错：防止数据缺失导致计算 NaN
    if (!lat1 || !lng1 || !lat2 || !lng2) return '未知距离';

    const radLat1 = lat1 * Math.PI / 180.0
    const radLat2 = lat2 * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0)
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137
    s = Math.round(s * 10000) / 10000
    
    if (s < 1) {
      return Math.round(s * 1000) + 'm'
    } else {
      return s.toFixed(1) + 'km'
    }
  },

  updateMarkers() {
    const markers = this.data.restaurants.map((item, index) => {
      return {
        // 优先使用云数据库的 _id，如果没有则用 id
        id: index, 
        latitude: item.latitude,
        longitude: item.longitude,
        width: 30,
        height: 30,
        callout: {
          content: ` ${item.name} ¥${item.price}/人 `,
          padding: 10,
          borderRadius: 5,
          bgColor: '#ffffff',
          color: '#333333',
          display: 'ALWAYS',
          fontSize: 12
        }
      }
    })
    this.setData({ markers })
  },

  onMarkerTap(e: any) {
    const index = e.markerId;
    // 直接通过下标获取数据
    const restaurant = this.data.restaurants[index];
    
    if (restaurant) {
      console.log('选中店铺:', restaurant.name);
      this.setData({
        currentShop: restaurant
      });
    }
  },


  // 列表里的卡片点击
  onShopCardTap(e: any) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      console.log('点击列表卡片跳转:', id);
      navigateToShopDetail(id); // <--- 新增：调用跳转
    }
  },

  onMapTap() {
    if (this.data.currentShop) {
      console.log('点击地图空白，关闭卡片');
      this.setData({
        currentShop: null
      });
    }
  },

  // 地图悬浮卡片点击 (直接取 currentShop)
  onPopupCardTap() {
    const shop = this.data.currentShop;
    if (shop) {
      console.log('悬浮卡片跳转:', shop.name);
      // 优先用 _id (云开发ID)，没有则用 id
      navigateToShopDetail(shop._id || shop.id);
    }
  },


  onShowLayers() {
    // 获取当前状态并取反
    const nextStatus = !this.data.enableSatellite;
    
    this.setData({
      enableSatellite: nextStatus
    });
    // 给个提示让用户知道切过去了
    wx.showToast({
      title: nextStatus ? '已切换卫星图' : '已切换标准图',
      icon: 'none'
    });
  },

  // --- 新增：点击通知图标跳转 ---
  onNotificationTap() {
    wx.navigateTo({
      url: '/pages/custom/social_subpackage/message_notice/index',
      fail: (err) => {
        console.error('跳转消息中心失败:', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
  },

  onFilterTap(e: any) {
    const index = e.currentTarget.dataset.index
    const filters = this.data.filters.map((item, i) => ({
      ...item,
      active: i === index
    }))
    this.setData({ filters })
  },

  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab
    const urlMap: Record<string, string> = {
      'explore': '/pages/custom/diner_explore/index',
      'social': '/pages/custom/diner_social/index',
      'collection': '/pages/custom/diner_collection/index', 
      'settings': '/pages/custom/diner_settings/index'
    }
    const targetUrl = urlMap[tab]
    if (targetUrl) {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (targetUrl.includes(currentPage.route)) return
      wx.reLaunch({
        url: targetUrl,
        fail: (err) => console.error('跳转失败:', err)
      })
    }
  },

  onSearch() {
    wx.navigateTo({ url: '/pages/custom/searching/index' })
  },
  onNavigate() {
    wx.showToast({ title: '开始导航', icon: 'none' })
  },
  onFavorite() {
    wx.showToast({ title: '已收藏', icon: 'success' })
  },
  onCall() {
    wx.makePhoneCall({ phoneNumber: '12345678900' })
  }
})




// 坐标转换算法
const x_pi = 3.14159265358979324 * 3000.0 / 180.0;

function wgs84ToGcj02(lat: number, lon: number) {
  if (outOfChina(lat, lon)) {
    return { lat, lon };
  }
  const a = 6378245.0;
  const ee = 0.00669342162296594323;
  let dLat = transformLat(lon - 105.0, lat - 35.0);
  let dLon = transformLon(lon - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  return {
    lat: lat + dLat,
    lon: lon + dLon
  };
}

function transformLat(x: number, y: number) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLon(x: number, y: number) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
  return ret;
}

function outOfChina(lat: number, lon: number) {
  if (lon < 72.004 || lon > 137.8347) return true;
  if (lat < 0.8293 || lat > 55.8271) return true;
  return false;
}