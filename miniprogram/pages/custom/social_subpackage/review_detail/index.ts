// pages/review_detail/index.ts

// --- 接口定义 (DTO) ---

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

// 子评论结构
interface CommentItem {
  id: string;
  user: UserInfo;
  replyTo?: UserInfo; // 如果是回复某人，则有此字段
  content: string;
  createTime: string;
}

// 详情页完整数据结构
interface ReviewDetail {
  id: string;
  author: UserInfo;
  content: string;
  images: string[];
  createTime: string;
  rating: number; // 评分 1-5
  
  // 朋友圈风格互动区数据
  likes: UserInfo[];   // 点赞人列表
  isLiked: boolean;    // 我是否点赞
  comments: CommentItem[]; // 评论列表
}

Page({
  data: {
    id: '',
    isLoading: true,
    detail: null as ReviewDetail | null,
    
    // 输入框状态
    inputValue: '',
    placeholder: '评论一句...',
    replyTarget: null as UserInfo | null, // 当前回复的目标用户，null代表回复楼主
    keyboardHeight: 0,
  },

  onLoad(options: { id: string }) {
    // 如果传了id就用传的，没传(调试时)就用默认的 'test_01'
    const id = options.id || 'test_01'; 
    
    console.log('当前页面加载 ID:', id); // 加上日志方便调试

    this.setData({ id });
    this.fetchDetail(id);
  },

  // --- 模拟获取详情 ---
  fetchDetail(id: string) {
    this.setData({ isLoading: true });
    
    setTimeout(() => {
      const mockDetail: ReviewDetail = {
        id,
        author: { id: 'u1', name: 'Yelp资深吃货', avatar: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png' },
        content: '非常有格调的一家店，牛排火候控制得刚刚好，服务也很贴心！强烈推荐晚上来，灯光氛围绝了。',
        images: [
          'https://tdesign.gtimg.com/miniprogram/images/example1.png',
          'https://tdesign.gtimg.com/miniprogram/images/example2.png'
        ],
        createTime: '2025-12-12 18:30',
        rating: 5,
        isLiked: true,
        likes: [
          { id: 'u2', name: '周末探店小队', avatar: '' },
          { id: 'u3', name: '南京干饭王', avatar: '' },
          { id: 'u4', name: '路人甲', avatar: '' }
        ],
        comments: [
          {
            id: 'c1',
            user: { id: 'u2', name: '周末探店小队', avatar: '' },
            content: '看着真不错，下周去试试！',
            createTime: '12-12 19:00'
          },
          {
            id: 'c2',
            user: { id: 'shop', name: '商家小助手', avatar: '' },
            replyTo: { id: 'u1', name: 'Yelp资深吃货', avatar: '' },
            content: '感谢您的认可，期待再次光临~',
            createTime: '12-12 20:00'
          }
        ]
      };

      this.setData({ detail: mockDetail, isLoading: false });
    }, 500);
  },

  // --- 交互逻辑 ---

  // 1. 点赞/取消点赞
  onToggleLike() {
    const { detail } = this.data;
    if (!detail) return;

    const isLiked = !detail.isLiked;
    let newLikes = [...detail.likes];
    const me = { id: 'me', name: '我', avatar: '' }; // 模拟当前用户

    if (isLiked) {
      newLikes.push(me);
    } else {
      newLikes = newLikes.filter(u => u.id !== 'me');
    }

    this.setData({
      'detail.isLiked': isLiked,
      'detail.likes': newLikes
    });
    
    // TODO: Call API
  },

  // 2. 点击某条评论（准备回复）
  onTapComment(e: any) {
    const { user } = e.currentTarget.dataset;
    // 如果是点击自己的评论，可以弹出删除菜单，这里简化为回复
    this.setData({
      replyTarget: user,
      placeholder: `回复 ${user.name}:`,
    });
  },

  // 3. 点击空白处或主评论区（取消特定回复，变回评论楼主）
  onResetReply() {
    this.setData({
      replyTarget: null,
      placeholder: '评论一句...'
    });
  },

  // 4. 输入监听
  onInput(e: any) {
    this.setData({ inputValue: e.detail.value });
  },

  // 5. 发送评论
  onSend() {
    const { inputValue, detail, replyTarget } = this.data;
    if (!inputValue.trim() || !detail) return;

    const newComment: CommentItem = {
      id: `new_${Date.now()}`,
      user: { id: 'me', name: '我', avatar: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png' },
      replyTo: replyTarget || undefined,
      content: inputValue,
      createTime: '刚刚'
    };

    const newComments = [...detail.comments, newComment];

    this.setData({
      'detail.comments': newComments,
      inputValue: '',
      replyTarget: null,
      placeholder: '评论一句...'
    });

    // TODO: Call API
  },
  
  // 图片预览
  onPreviewImage(e: any) {
    const { current } = e.currentTarget.dataset;
    wx.previewImage({
      current,
      urls: this.data.detail?.images || []
    });
  }
});