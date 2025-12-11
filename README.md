# 寻味金陵小程序项目说明

## 项目结构
- **Prototype**：提示词/需求文档
- **Prototype**：存放.html格式的原型图文件
- **Miniprogram**：存放小程序主程序代码
  - **custom**：用户端（食客）前端代码
  - **merchant**：商家端前端代码（未完成）
  - **super**：管理员端前端代码（未完成）

## 使用说明
将项目文件粘贴到微信小程序开发项目中，替换掉同名文件夹即可使用。
加载云数据库——建立restaurant表，直接导入custom文件夹下的restaurant_data.csv即可

## 依赖安装
使用之前需要下载TDesign组件库：https://tdesign.tencent.com/miniprogram/getting-started
1. 确保已安装Node.js，可通过以下链接下载：
   [Node.js — 下载 Node.js®](https://nodejs.org/)
2. 使用Node.js控制台指令安装TDesign组件库：
   ```bash
   npm install tdesign-miniprogram
   ```
