// pages/custom/social_subpackage/taste_analysis/index.ts
Page({
  data: {
    // --- 模拟后端数据：用户信息 ---
    userInfo: {
      nickName: '美食爱好者',
      avatarUrl: '', // 空则显示默认
      level: 8
    },

    // --- 模拟后端数据：口味六维数据 (0-100) ---
    // TODO: 【后端接口】请通过接口返回以下数组，顺序对应：甜、辣、咸、酸、鲜、油
    tasteData: [
      { label: '甜度', value: 80, color: '#ff9800' },
      { label: '辣度', value: 45, color: '#ff5722' },
      { label: '咸度', value: 60, color: '#795548' },
      { label: '酸度', value: 30, color: '#8bc34a' }, 
      { label: '鲜度', value: 85, color: '#2196f3' }, 
      { label: '油度', value: 50, color: '#ffc107' }  
    ],

    // --- 模拟后端数据：隐私设置 ---
    // public=公开, private=私密, fans=仅粉丝
    privacyValue: 'public', 
  },

  onLoad() {
    // 这里不再需要 initRadarChart
    // 如果后续要从后端获取 tasteData，请在这里发起 wx.request
    // 获取成功后调用 this.setData({ tasteData: res.data }, () => this.drawRadar())
  },

  // 页面初次渲染完成时，开始绘图 (Canvas 必须在节点准备好后才能获取)
  onReady() {
    this.drawRadar();
  },

  // --- 核心绘图函数 (Canvas 2D) ---
  drawRadar() {
    const query = wx.createSelectorQuery();
    query.select('#radarCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // 1. 处理高清屏模糊问题 (关键步骤)
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        // 2. 基础配置
        const width = res[0].width;
        const height = res[0].height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2 - 20; // 半径，留出20px边距
        const sides = 6; // 六边形

        // 3. 清空画布
        ctx.clearRect(0, 0, width, height);

        // ==========================
        // A. 绘制背景网格 (3层: 100%, 66%, 33%)
        // ==========================
        const levels = [1, 0.66, 0.33];
        ctx.strokeStyle = '#e0e0e0'; // 网格颜色
        ctx.lineWidth = 1;

        levels.forEach(scale => {
          const r = radius * scale;
          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const angle = (Math.PI / 180) * (i * 60 - 90); // -90度是12点钟方向
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        });

        // ==========================
        // B. 绘制放射轴线
        // ==========================
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (Math.PI / 180) * (i * 60 - 90);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // ==========================
        // C. 绘制数据区域 (橙色画像)
        // ==========================
        const values = this.data.tasteData.map(item => item.value);
        ctx.beginPath();
        values.forEach((val, i) => {
          const angle = (Math.PI / 180) * (i * 60 - 90);
          const r = (val / 100) * radius; // 根据百分比计算半径
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();

        // 填充半透明橙色
        ctx.fillStyle = 'rgba(255, 152, 0, 0.5)'; 
        ctx.fill();
        
        // 描边深橙色
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制顶点小圆点 (可选)
        ctx.fillStyle = '#fff';
        values.forEach((val, i) => {
          const angle = (Math.PI / 180) * (i * 60 - 90);
          const r = (val / 100) * radius;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI); // 半径3的小圆点
          ctx.fill();
          ctx.stroke();
        });
      });
  },

  // --- 隐私设置切换 ---
  onPrivacyChange(e: any) {
    const val = e.detail.value;
    this.setData({ privacyValue: val });
    
    // TODO: 【后端接口】这里调用 API 更新用户的隐私设置
    console.log('隐私权限已更新为:', val);
  },

  // --- 保存画像 ---
  onSaveImage() {
    wx.showToast({ title: '画像保存功能待开发', icon: 'none' });
    // TODO: 后续可以使用 wxml-to-canvas 插件实现保存图片
  }
});