# 寻味金陵 (Taste of Jinling) - UI 设计规范 & 开发提示词

> **使用说明**：在开发新页面时，请将本文件内容发送给 AI，并附带指令：“请严格遵循以下 UI 规范生成代码”。

## 1. 核心视觉 (Visual Core)

### 1.1 全局样式 (Global)
* **字体 (Font)**：强制使用宋体，以体现金陵古韵。
    ```css
    font-family: "Songti SC", "SimSun", "STSong", "serif";
    ```
* **背景色 (Background)**：`#f5f5f5` (浅灰)。
* **布局 (Layout)**：
    * **一屏原则**：页面高度设为 `95vh`，`overflow: hidden`，避免出现滚动条。
    * **弹性布局**：使用 `flex-direction: column` + `align-items: center`。
    * **间距控制**：使用 `clamp()` 函数适配不同屏幕高度（例：Header 底部间距 `clamp(60rpx, 4vh, 80rpx)`）。

### 1.2 配色方案 (Colors)
* **品牌主色 (Brand Orange)**：`#ff9800` (用于标题、高亮)。
* **按钮渐变 (Button Gradient)**：`linear-gradient(135deg, #ff9800 0%, #f57c00 100%)`。
* **辅助背景 (Sub-bg)**：
    * 食客端：`#fff3e0`
    * 商家端：`#e0f2f1`
    * 管理端：`#f3e5f5`
* **文本色**：一级 `#333333` / 二级 `#666666` / 描述 `#888888`。

---

## 2. 组件规范 (Components)

### 2.1 卡片 (Cards)
所有功能入口或信息块必须使用“悬浮白卡片”样式：
* **背景**：`white`
* **圆角**：`30rpx`
* **阴影**：`box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08)`
* **内边距**：`25rpx`
* **交互**：点击时上浮 `translateY(-5rpx)`。

### 2.2 按钮 (Buttons)
配合 TDesign 使用，但必须强制覆盖样式 (**Override**)：
* **尺寸**：宽 `220rpx`，高 `80rpx`，胶囊圆角 `32rpx`。
* **样式强制**：
    * `background: linear-gradient(...) !important;` (橙色渐变)
    * `color: #ffffff !important;` (纯白文字)
    * `border: none !important;`
* **字体**：`28rpx`。

### 2.3 图标容器 (Icon Wrapper)
* **尺寸**：`90rpx * 90rpx`，圆形 (`50%`)。
* **布局**：内部图标居中，图标尺寸 `50rpx`。

---

## 3. AI 代码生成指令 (Prompt for AI)

当需要生成新页面（如“食客首页”、“商家后台”）时，请直接复制以下 Prompt：

```text
你现在是《寻味金陵》小程序的 UI 设计师与前端工程师。请根据以下设计规范编写 WXML 和 WXSS：

1. 【风格基调】：宋体风格 ("Songti SC")，背景 #f5f5f5，核心元素为白色圆角卡片（Radius 30rpx，轻阴影）。
2. 【布局要求】：
   - 必须使用 Flex 布局垂直居中。
   - 尽量保持一屏显示 (height: 95vh)，使用 clamp() 动态调整垂直间距。
3. 【组件样式】：
   - 按钮：统一使用 TDesign 组件，但必须通过 CSS !important 强制改为橙色渐变背景 (#ff9800 -> #f57c00)，白色文字，胶囊形状 (220rpx * 80rpx)。
   - 标题：主标题使用 #ff9800，加粗；副标题使用 #666666。
4. 【代码输出】：
   - 不需要 HTML 标签，严格使用小程序原生标签 (view, text, image, scroll-view)。
   - 确保 class 命名语义化（如 .diner-card, .menu-list）。