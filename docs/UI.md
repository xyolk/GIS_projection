# 寻味金陵系统 (Xunwei Jinling System) - UI设计与开发提示词文档

**文档说明：** 本文档基于《UI设计01.docx》与《UI界面的设计.docx》整理而成。旨在将业务逻辑转化为模块化的UI开发指令，适用于前端框架（如Flutter, React Native, Vue, Swift等）的组件开发。

[cite_start]**设计风格总则 (Global Style Guidelines)[cite: 207, 208]:**
* **核心理念：** 温馨、亲切、人性化。
* **色彩系统：** 暖色调为主（高饱和度），辅以白色背景，互补搭配。
* **组件形态：** 圆角矩形（Rounded Rectangle）为主，避免尖锐棱角。
* **交互动效：** 强调点击反馈与加载动画，支持滑动（Scroll/Swipe）交互。

---

## 1. 身份认证模块 (Authentication Module)

[cite_start]**逻辑描述：** 系统面向三类用户（食客、商家、管理员），通过入口进行身份分流 [cite: 156]。

### 1.1 身份选择页 (Identity Selection)
* **布局 (Layout):** 简单的三段式或卡片式布局。
* **组件 (Components):** 三个大卡片/按钮，分别代表“我是食客”、“我是商家”、“管理员”。
* [cite_start]**交互 (Interaction):** 点击对应按钮跳转至各自的登录界面 [cite: 156]。

### 1.2 登录/注册页 (Login/Register)
* **食客端:**
    * [cite_start]**输入:** 手机号+密码 或 微信一键登录 [cite: 157]。
    * [cite_start]**功能:** 底部提供“找回密码” [cite: 157][cite_start]，“注册账号” [cite: 142]。
* **商家端:**
    * [cite_start]**输入:** 商家账户+密码 [cite: 158]。
    * [cite_start]**功能:** 底部提供“商家账户申请”和“找回密码” [cite: 158]。
* [cite_start]**管理员端:** 工号+密码，无额外提示词 [cite: 159]。

---

## 2. 食客端 (Diner Client) - 核心应用
[cite_start]**导航结构:** 底部导航栏 (Bottom Navigation Bar) 包含四个Tab：探索 (Exploration)、我的社媒 (Social)、收藏 (Collections)、设置 (Settings) [cite: 162]。

### [cite_start]2.1 探索界面 (Exploration Interface) - 首页 [cite: 163]
本页面整合了地图、搜索与推荐功能。

* **顶部 (Top Dock) - 搜索栏:**
    * [cite_start]**组件:** 输入框 (Input Field) [cite: 7]。
    * **功能:** 定位用户输入的目标位置。
    * [cite_start]**交互:** 点击输入框 -> 跳转至“输入位置/模糊搜索页” -> 确认后返回并定位 [cite: 15]。
* **中部 (Fill) - 地图系统:**
    * [cite_start]**组件:** 地图容器 (Map View, 对接高德/百度API) [cite: 11, 29]。
    * **覆盖层 (Overlay):**
        * [cite_start]**POI标记:** 显示周边餐厅，点击弹出简要信息卡（名称、评分、距离）[cite: 20]。
        * [cite_start]**图层切换:** 按钮切换标准图/卫星图 [cite: 22]。
        * [cite_start]**缩放/定位:** 支持手势缩放及实时定位按钮 [cite: 19, 21]。
* **中下部 (Overlay/Bottom) - 筛选与推荐:**
    * [cite_start]**筛选器 (Filter Bar):** 紧贴地图下缘。下拉菜单选择：距离、价格、菜系 [cite: 163, 23]。
    * **推荐列表 (Recommendation List):**
        * [cite_start]**容器:** 可滑动面板 (Draggable Scrollable Sheet) 或 底部列表 [cite: 164]。
        * [cite_start]**卡片样式 (Card Style):** 左图右文（圆角）。包含：商家名称、价格、评分、菜系、位置、距离 [cite: 164]。
        * [cite_start]**交互:** 点击卡片高亮并显示“导航/收藏/电话” [cite: 26][cite_start]；上拉加载更多 [cite: 28]。

### [cite_start]2.2 我的社媒界面 (Social Interface) [cite: 165]
用户个人中心与社交互动的集合。

* **顶部 (Top) - 个人信息:**
    * [cite_start]**组件:** 头像 (Avatar)、昵称、等级标签、位置 [cite: 166]。
    * **交互:** 点击头像跳转详细资料编辑。
* **中部 (Middle) - 功能入口:**
    * **布局:** 网格布局 (Grid) 或 横向排列。
    * [cite_start]**按钮组:** 新增评语、新增照片、打卡 (Check-in)、个人画像 (Persona/Radar Chart) [cite: 167]。
* **中下部 (Middle-Lower) - 最近浏览:**
    * **组件:** 浏览历史卡片组件（固定两片，两行单列）。
    * [cite_start]**操作:** 底部按钮“显示更多” -> 跳转至完整浏览历史列表 [cite: 168]。
* **底部 (Bottom) - 个性化信息:**
    * [cite_start]**列表项:** 个人口味分析、消息通知、我的动态、预定记录、导航记录 [cite: 169]。

### [cite_start]2.3 收藏界面 (Collections Interface) [cite: 170]
管理用户的收藏夹及发现推荐收藏。

* **顶部 (Header):**
    * **左侧:** 标题“收藏界面”。
    * [cite_start]**右侧:** “建立”按钮 (Create Button) -> 弹出对话框创建新收藏夹 [cite: 171]。
* **区块1: 智能推荐系列 (Smart Recommendations):**
    * [cite_start]**布局:** 单行横向滚动 (Horizontal Scroll View) [cite: 172]。
    * **内容:** 系统推荐的收藏集卡片（含标题、简介、作者）。
    * **交互:** 点击进入收藏集详情页（含“一键收藏店铺”功能）。
* **区块2: 我的收藏系列 (My Collections):**
    * **布局:** 单行横向滚动。
    * **内容:** 用户自建收藏夹缩略图。
    * [cite_start]**交互:** 点击“查看全部”进入管理模式（批量删除、重命名）[cite: 173]。
* **区块3: 关注收藏系列 (Followed Collections):**
    * **布局:** 单列多行列表 (Vertical List)。
    * [cite_start]**内容:** 显示关注的其他博主的收藏集 [cite: 174]。

### [cite_start]2.4 设置界面 (Settings Interface) [cite: 175]
* **顶部:** 标题栏 + 登录状态显示。
* **列表 (List View):**
    * 账号与安全 (Account & Security)
    * 通知设置 (Notifications)
    * 缓存与存储 (Cache & Storage)
    * 隐私设置 (Privacy)
    * [cite_start]关于我们 (About Us) [cite: 177]
* [cite_start]**底部:** “退出登录”按钮 (Log Out)，点击触发确认弹窗 [cite: 178]。

---

## 3. 商家端 (Merchant Client)
[cite_start]**导航结构:** 底部导航栏包含三个Tab：数据分析、店铺管理、评价中心 [cite: 179]。

### [cite_start]3.1 数据分析 (Data Analysis) [cite: 180]
* [cite_start]**顶部:** 欢迎语 + 商家头像 [cite: 181]。
* **数据看板 (Dashboard):**
    * [cite_start]**关键指标 (KPI Cards):** 今日订单、今日营收、平均客单价、座位利用率（均显示较昨日涨跌幅）[cite: 182]。
    * [cite_start]**趋势图 (Charts):** 营收折线图，支持切换“近7日/30日” [cite: 182]。
* [cite_start]**底部:** 热门菜品排行榜 (Top Selling Items) [cite: 183]。

### [cite_start]3.2 店铺管理 (Shop Management) [cite: 184]
* [cite_start]**基本信息区:** 编辑店铺名称、分类、电话、地址 [cite: 185-188]。
* **营业控制:**
    * [cite_start]**开关:** 营业状态 (Switch: Open/Closed) [cite: 190]。
    * [cite_start]**时间:** 营业时间设置 (Time Picker) [cite: 191]。
* **菜品管理 (Menu Management):**
    * **列表:** 展示菜品名称、价格。
    * [cite_start]**操作:** 底部“新增菜品”按钮 [cite: 192-199]。

### [cite_start]3.3 评价中心 (Review Center) [cite: 200]
* [cite_start]**评分概览:** 总体评分显示 + 星级分布条形图 (1-5星占比) [cite: 201]。
* [cite_start]**标签云 (Tag Cloud):** 显示高频评价词（如：味道好、排队久）[cite: 202]。
* [cite_start]**评论流:** 历史评论列表，支持商家回复 [cite: 203]。

---

## 4. 通用组件库需求 (Component Library Requirements)
*请查阅父文件夹中lib文件夹中的ui_components、utils、themes、models等文件*
*为了保证代码的一致性，请预先定义以下组件：*
1.  **XunweiCard:** 圆角卡片容器，带有微弱阴影，用于展示餐厅或收藏集。
2.  **XunweiButton:** 品牌色（暖色）背景的圆角按钮，按压有透明度变化。
3.  **XunweiTag:** 胶囊状标签，用于筛选器和评价标签。
4.  **XunweiRadar:** 雷达图组件，用于展示口味画像（酸甜苦辣咸）。
5.  **XunweiMapOverlay:** 自定义地图覆盖层，处理POI点击事件。