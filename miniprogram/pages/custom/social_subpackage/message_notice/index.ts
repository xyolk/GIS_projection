// pages/message_center/index.ts

// --- 接口定义 (DTO) ---

// 消息类型枚举
type MessageType = 'like' | 'comment' | 'system' | 'reply';

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

interface MessageItem {
  id: string;
  type: MessageType;
  sender: UserInfo;      // 发送者 (如果是系统消息，则是系统图标)
  content?: string;      // 评论内容/系统通知内容
  targetId: string;      // 跳转目标的ID (比如店铺ID、动态ID)
  targetImage?: string;  // 目标内容的缩略图 (比如我发的动态图)
  createTime: string;    // 时间
  isRead: boolean;       // 是否已读
}

Page({
  data: {
    isLoading: true,
    list: [] as MessageItem[],
    
    // 分页参数 (方便后端对接)
    page: 1,
    hasMore: true,
  },

  onLoad() {
    this.fetchMessages(true);
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.fetchMessages(true);
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.fetchMessages(false);
    }
  },

  // --- 模拟获取消息列表 ---
  fetchMessages(reset: boolean) {
    if (reset) {
      this.setData({ page: 1, hasMore: true });
    }

    this.setData({ isLoading: true });

    setTimeout(() => {
      // Mock 数据
      const newMessages: MessageItem[] = [
        {
          id: `msg_${Date.now()}_1`,
          type: 'like',
          sender: { id: 'u1', name: '周末探店小队', avatar: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png' },
          targetId: 'post_101',
          targetImage: 'https://tdesign.gtimg.com/miniprogram/images/example1.png',
          createTime: '10分钟前',
          isRead: false
        },
        {
          id: `msg_${Date.now()}_2`,
          type: 'comment',
          sender: { id: 'u2', name: '南京干饭王', avatar: 'https://tdesign.gtimg.com/miniprogram/images/avatar2.png' },
          content: '这家店的盐水鸭确实不错，推荐！',
          targetId: 'post_102',
          targetImage: 'https://tdesign.gtimg.com/miniprogram/images/example2.png',
          createTime: '1小时前',
          isRead: false
        },
        {
          id: `msg_${Date.now()}_3`,
          type: 'reply',
          sender: { id: 'u3', name: 'Yelp资深吃货', avatar: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png' },
          content: '回复 @你: 下次可以一起去探店呀~',
          targetId: 'post_103',
          targetImage: '', // 纯文本动态，无图
          createTime: '昨天',
          isRead: true
        },
        {
          id: `msg_${Date.now()}_4`,
          type: 'system',
          sender: { id: 'sys', name: '系统通知', avatar: '/assets/system_icon.png' }, // 需替换为你的系统图标路径
          content: '您提交的店铺收录申请已通过审核。',
          targetId: 'sys_001',
          createTime: '3天前',
          isRead: true
        }
      ];

      if (reset) {
        this.setData({ list: newMessages, isLoading: false });
        wx.stopPullDownRefresh();
      } else {
        // 加载更多逻辑
        this.setData({ 
          list: [...this.data.list, ...newMessages], 
          isLoading: false 
        });
      }
    }, 600);
  },

  // --- 交互逻辑 ---

  // 1. 点击消息跳转
  onTapItem(e: any) {
    const { id, targetid, type, isread } = e.currentTarget.dataset;
    
    // 如果未读，标记为已读 (视觉更新)
    if (!isread) {
      const newList = this.data.list.map(item => {
        if (item.id === id) return { ...item, isRead: true };
        return item;
      });
      this.setData({ list: newList });
      // TODO: Call API marking as read
    }

    // 根据类型跳转不同页面
    if (type === 'system') {
      wx.showModal({ title: '系统通知', content: '这里可以弹窗展示详情，也可以跳转网页' });
    } else {
      // 跳转到我们之前写的评论详情页
      wx.navigateTo({ url: `/pages/review_detail/index?id=${targetid}` });
    }
  },

  // 2. 侧滑删除消息
  onDeleteItem(e: any) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '提示',
      content: '确定删除这条通知吗？',
      confirmColor: '#ff9800', // 橙色确认按钮
      success: (res) => {
        if (res.confirm) {
          const newList = this.data.list.filter(item => item.id !== id);
          this.setData({ list: newList });
          // TODO: Call API delete message
        }
      }
    });
  },
  
  // 3. 一键已读 (可选功能)
  onMarkAllRead() {
     const newList = this.data.list.map(item => ({ ...item, isRead: true }));
     this.setData({ list: newList });
     wx.showToast({ title: '已全部设为已读', icon: 'success' });
  }
});