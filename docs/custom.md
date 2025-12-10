# 寻味金陵系统 - 食客端探索模块扩展文档 (Diner Exploration Expansion)

[cite_start]**文档说明：** 本文档基于《食客端开发.docx》整理而成，是对原UI设计文档中“2.1 探索界面”的详细补充与细化 [cite: 213]。重点描述了搜索流程、导航规划及地图POI交互的实现细节。

---

## 2.1 探索界面核心交互与衍生页 (Exploration Interface & Derivatives)

### 2.1.1 地图POI交互逻辑 (Map POI Interaction Logic)
**功能描述：** 地图主界面的核心交互，负责展示周边餐厅信息。

* **显示逻辑 (Display Logic):**
    * [cite_start]**范围:** 默认加载用户当前位置方圆 **2公里** 以内的餐厅POI [cite: 222]。
    * [cite_start]**标记:** 地图上显示POI图标及店名 [cite: 222]。
* **点击交互 (Click Event):**
    * **触发:** 用户点击任意餐厅POI。
    * [cite_start]**响应:** 在被点击的POI旁弹出 **餐厅迷你卡片 (Mini Restaurant Card)** [cite: 222]。
    * [cite_start]**互斥性:** 界面上同时刻只允许存在一张激活的卡片（点击新POI时，旧卡片自动消失） [cite: 222]。
* [cite_start]**卡片跳转:** 点击迷你卡片本体 -> 跳转至 **店铺详情界面 (Shop Detail Interface)** [cite: 222]。

---

### 2.1.2 衍生页：搜索详情页 (Search Detail Page)
[cite_start]**功能描述：** 点击探索界面顶部的搜索框后跳转的页面，采用留白布局（Clean Layout），专注于搜索与历史记录展示 [cite: 216]。

* **顶部区块 (Top Dock - Search Block):**
    * **行1 - 输入栏:**
        * [cite_start]**返回按钮:** 左侧显示 `<-` 图标，点击返回探索界面 [cite: 216]。
        * [cite_start]**输入框:** 提示词 (Hint Text): “请输入地址” [cite: 216]。
    * **行2 - 快捷定位:**
        * [cite_start]**组件:** 长条按钮 (Full-width Button)，高度与输入框一致 [cite: 216]。
        * [cite_start]**内容:** 定位图标 + 文字 “定位到目前所在地” [cite: 216]。
        * **交互:** 点击触发GPS定位并返回地图中心。

* **内容区块 (Content Fill):**
    * **最近搜索 (Recent Search):**
        * **Label:** “最近搜索”。
        * [cite_start]**列表:** 展示最近搜索历史记录的前 **5条** 地点 [cite: 216]。
    * **最近浏览 (Recent Views):**
        * **Label:** “最近浏览”。
        * [cite_start]**列表:** 展示最近浏览过的 **5张** 餐厅卡片 [cite: 216]。
    * **底部操作:**
        * [cite_start]**按钮:** “查看全部” [cite: 216]。
        * **交互:** 点击跳转至完整的历史浏览列表页。

---

### 2.1.3 衍生页：导航规划页 (Navigation Planning Page)
[cite_start]**功能描述:** 点击任意导航按钮后触发，提供路径规划与出行方式选择 [cite: 217, 218]。

* [cite_start]**顶部输入区 (Top Dock - Route Inputs):** [cite: 218]
    * **布局:** 左右结构。左侧为起终点输入，右侧为切换按钮。
    * **输入框1 (Origin):** 默认显示 “我的位置”。
    * **输入框2 (Destination):** 提示 “目标地点”。若从餐厅卡片进入，则自动填入该餐厅地址。
    * **切换按钮 (Swap Button):** 位于右侧垂直居中，点击交换起点与终点内容。

* [cite_start]**出行方式栏 (Transport Mode Bar):** [cite: 218]
    * **位置:** 紧接输入区下方。
    * **选项 (Tabs):** 步行 (Walk)、骑行 (Bike)、驾车 (Drive)、公交 (Transit)。
    * **交互:** 点击切换Tab -> 触发地图路线重新规划。

* [cite_start]**地图画布 (Middle Fill - Route Canvas):** [cite: 218]
    * **功能:** 加载底图，并绘制路径规划线 (Polyline)。

* [cite_start]**信息概览区 (Lower Dock - Info Card):** [cite: 219]
    * **组件:** 悬浮卡片或底部面板。
    * **内容:** 显示预估到达时间 (ETA) 和 距离 (Distance)。

* [cite_start]**底部操作栏 (Bottom Dock - Action):** [cite: 220]
    * **组件:** 主行动按钮 (Primary Button)。
    * **文字:** “开始导航”。
    * **交互:** 点击唤起实时导航模式或跳转第三方地图App。

---

## 开发组件建议 (Component Updates)

为了支持上述新页面，请在组件库中补充以下定义：

1.  **SearchHistoryItem:** 纯文本列表项，带有时钟图标，用于“最近搜索”。
2.  **LocationQuickBtn:** 带有定位图标的全宽幽灵按钮 (Ghost Button) 或 描边按钮。
3.  **RouteInputGroup:** 封装起点、终点输入框与交换按钮的组合组件。
4.  **TransportModeTab:** 包含图标和文字的选中态切换组件。