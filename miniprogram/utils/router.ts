// utils/router.ts

/**
 * 统一跳转到店铺详情页
 * @param shopId 店铺的唯一标识 (_id)
 */
export const navigateToShopDetail = (shopId: string | number) => {
  if (!shopId) {
    wx.showToast({ title: '店铺ID丢失', icon: 'none' });
    return;
  }

  // 确保 ID 转为字符串，避免参数类型错误
  const idStr = String(shopId);
  const url = `/pages/custom/restaurant_detail/index?id=${idStr}`; // 详情页路径

  wx.navigateTo({
    url: url,
    fail: (err) => {
      console.error('跳转详情页失败:', err);
      // 容错处理：如果是因为页面层级过深，尝试使用 redirectTo
      if (err.errMsg.includes('limit')) {
        wx.redirectTo({ url });
      } else {
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    }
  });
};