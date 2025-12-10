# 寻味金陵 - 小程序原型

## 项目简介
"寻味金陵"是一款基于GIS技术的美食推荐小程序原型，旨在为用户提供南京地区的美食探索、评价和推荐服务。

## 技术栈
- HTML + Tailwind CSS + JavaScript
- Material Design风格
- 响应式设计

## 项目结构
```
your_project/
├── index.html          # 主入口文件
├── README.md           # 项目说明文档
└── screens/            # 各个界面文件
    ├── identity_selection.html     # 身份选择界面
    ├── diner_login.html            # 食客登录界面
    ├── diner_register.html         # 食客注册界面
    ├── merchant_login.html         # 商家登录界面
    ├── diner_explore.html          # 食客探索界面
    ├── diner_social.html           # 食客社媒界面
    ├── diner_collections.html      # 食客收藏界面
    ├── diner_settings.html         # 食客设置界面
    ├── merchant_analytics.html     # 商家数据分析界面
    ├── merchant_store.html         # 商家店铺管理界面
    └── merchant_reviews.html       # 商家评价中心界面
    ├── super_login.html            # 管理员登录界面
    ├── super_dashboard.html        # 管理员控制台界面
    ├── super_data_maintenance.html # 数据维护界面
    ├── super_content_reviews.html  # 评价管理界面
    ├── super_system_settings.html  # 系统设置界面
```

## 功能模块

### 身份认证模块
- 身份选择（食客/商家/管理员）
- 食客登录/注册
- 商家登录

### 食客端功能
- **探索界面**：地图展示、搜索功能、餐厅推荐
- **社媒界面**：个人信息、动态发布、口味分析
- **收藏界面**：智能推荐系列、我的收藏系列
- **设置界面**：账号安全、通知设置、缓存管理

### 商家端功能
- **数据分析**：销售统计、订单趋势、客户数据
- **店铺管理**：店铺信息编辑、菜品管理、活动设置
- **评价中心**：评价统计、评价列表、回复管理

### 管理员端功能
- **用户管理**：用户账号管理、店铺状态管理
- **数据维护**：POI变动审核、异常店铺数据处理
- **评价管理**：评价内容审核、违规评价处理
- **系统设置**：参数配置、数据备份


## 使用方法
1. 打开`index.html`文件
2. 界面将以iPhone 15 Pro的规格（393x852px）展示
3. 通过iframe嵌入的方式平铺展示所有界面

## 设计特点
- **Material Design风格**：遵循Google Material Design设计规范
- **响应式布局**：适配不同屏幕尺寸
- **圆角设计**：模拟真实移动设备的外观
- **统一配色**：食客端采用橙色主题，商家端采用青色主题,管理员端为紫色主题
- **交互动效**：平滑的过渡动画和悬停效果

## 注意事项
- 本项目为原型界面，不包含实际的后端功能
- 所有数据均为模拟数据
- 地图功能仅为界面展示，不包含实际的GIS功能

## 浏览器兼容性
- Chrome
- Firefox
- Safari
- Edge

## 作者
suda