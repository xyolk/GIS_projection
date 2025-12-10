# 寻味金陵系统数据库设计规范

## 1. 概述
[cite_start]本系统数据库包含 **16张核心数据表**，涵盖用户权限管理、业务实体（食客/商家）、交易流程、评价反馈及算法推荐五大模块。系统采用关系型数据库设计，通过严格的外键约束与逻辑关联，构建了完整的“发现-交易-评价-推荐”数据闭环 [cite: 5, 9, 36]。

---

## 2. 模块详细设计

### 2.1 用户与权限模块 (User & RBAC)
[cite_start]该模块是系统的基石，负责账户存储、身份认证及基于角色的权限控制 (RBAC) [cite: 10, 11]。

* **t_user (用户表)**
    * **定义**: 存储系统所有用户的基础账户信息（账号、密码哈希、手机号）。
    * [cite_start]**核心逻辑**: `user_id` 是全系统用户的唯一物理标识。`role` 字段区分用户身份（0=食客, 1=商家, 9=管理员），决定其关联哪个业务身份表 [cite: 13, 14]。
* **t_role (角色表)**
    * **定义**: 定义系统的身份标识（如超级管理员、商家、食客）。
    * [cite_start]**核心逻辑**: 通过 `role_code` 与代码逻辑对应，作为权限分配的根节点 [cite: 19, 20]。
* **t_permission (权限表)**
    * **定义**: 定义具体的功能操作权限（如“创建菜品”、“删除评价”）。
    * [cite_start]**核心逻辑**: 细粒度的功能控制，通过 `perm_code` 供后端鉴权 [cite: 25, 26]。
* **t_role_permission (角色权限中间表)**
    * **定义**: 角色与权限的多对多关联表。
    * [cite_start]**核心逻辑**: 映射 `role_id` 和 `perm_id`，实现灵活的权限配置 [cite: 22, 23]。
* **t_image (头像数据表)**
    * **定义**: 存储头像文件的元数据（MD5、URL、尺寸）。
    * [cite_start]**核心逻辑**: 独立存储以支持文件去重和统一管理，`t_user` 通过 `avatar_url` 关联此表 [cite: 16, 17, 8]。

### 2.2 食客业务模块 (Customer Domain)
[cite_start]定义了消费端的身份与行为特征，是推荐系统与订单系统的核心实体 [cite: 37, 40]。

* **t_customer (食客表)**
    * **定义**: 消费者的业务身份表，存储昵称、口味标签、积分等。
    * [cite_start]**核心逻辑**: `customer_id` 是消费侧的唯一代理主键。表与 `t_user` 为 **1:1** 关系，实现了自然人与消费者身份的解耦 [cite: 39, 41]。
* **t_customer_profile (食客画像表)**
    * **定义**: 消费者的统计型快照，包含偏好菜系、价格区间、活跃时段等。
    * [cite_start]**核心逻辑**: 字段为 **只读**，由每日离线任务计算生成，用于支撑个性化推荐算法 [cite: 47, 49]。
* **t_favorite (收藏表)**
    * **定义**: 记录食客对商家或菜品的收藏行为。
    * [cite_start]**核心逻辑**: 通过 `biz_type` 和 `biz_id` 区分收藏对象，是推荐系统的显性反馈输入 [cite: 34, 35]。
* **t_nav_log (导航记录表)**
    * **定义**: 记录用户从线上推荐到线下门店铺的导航轨迹（起点、终点、耗时）。
    * [cite_start]**核心逻辑**: 验证推荐有效性，并链接线上意图与线下行为 [cite: 30, 32]。

### 2.3 商家与商品模块 (Merchant & Product Domain)
[cite_start]定义了供给端的实体与服务能力 [cite: 58, 75]。

* **t_merchant (商家表)**
    * **定义**: 餐饮店铺的业务身份表，包含店铺名、经纬度坐标、营业状态。
    * [cite_start]**核心逻辑**: `merchant_id` 是供给侧核心主键。使用 GIS `POINT` 类型存储坐标以支持空间查询（附近商家）。表与 `t_user` 为 **1:1** 关系 [cite: 57, 59, 63]。
* **t_merchant_profile (商家画像表)**
    * **定义**: 店铺经营能力的统计报告，包含综合评分、复购率、月销量。
    * [cite_start]**核心逻辑**: 全局 **只读**，基于订单和评价数据离线计算，作为商家排序和流量分配的权重依据 [cite: 66, 67, 73]。
* **t_dish (菜品表)**
    * **定义**: 商家发布的商品信息，包含价格、库存、口味标签。
    * [cite_start]**核心逻辑**: 通过 `merchant_id` 归属商家。`stock_type` 控制库存逻辑（无限/限量），是交易的核心标的 [cite: 77, 78]。

### 2.4 交易与评价模块 (Transaction & Review)
[cite_start]连接食客与商家的核心业务流程 [cite: 84, 99]。


* **t_order (订单表)**
    * **定义**: 记录交易全生命周期，包含状态、总金额、支付方式。
    * [cite_start]**核心逻辑**: 双外键设计 (`customer_id`, `merchant_id`) 链接买卖双方。`order_status` 驱动业务流转 [cite: 86, 87, 88]。
* **t_order_item (订单明细表)**
    * **定义**: 订单内的具体商品清单及快照价格。
    * [cite_start]**核心逻辑**: 关联 `t_order` 和 `t_dish`，记录交易时的瞬时单价，防止后续改价影响历史账单 [cite: 95, 96]。
* **t_review (评价表)**
    * **定义**: 交易完成后的多维度反馈（口味、服务、环境评分及文本）。
    * [cite_start]**核心逻辑**: 强制关联 `order_id` 实现 **“一单一评”**，数据反哺商家画像与推荐系统 [cite: 101, 102]。

### 2.5 算法推荐模块 (Recommendation)
[cite_start]系统的智能化核心，负责流量分发 [cite: 107]。

* **t_rec_pool (个性化推荐池表)**
    * **定义**: 算法每日为食客计算的候选商家集合。
    * [cite_start]**核心逻辑**: 存储计算后的 `score` (匹配分) 和 `reason_tag` (推荐理由)。通过 `expire_time` 控制时效性（每日重算），实现千人千面 [cite: 109, 110, 113]。

---

## 3. 核心关系与索引设计 (ER & Constraints)

[cite_start]本系统通过以下关键外键关系维持数据完整性 [cite: 8]：

### 3.1 身份关联链 (1:1)
* `t_user.user_id` ⟷ `t_customer.user_id`: 账号 -> 消费者身份
* `t_user.user_id` ⟷ `t_merchant.user_id`: 账号 -> 商家身份
* `t_customer.customer_id` ⟷ `t_customer_profile.customer_id`: 消费者 -> 画像数据
* `t_merchant.merchant_id` ⟷ `t_merchant_profile.merchant_id`: 商家 -> 画像数据

### 3.2 交易业务链 (1:N)
* `t_merchant.merchant_id` -> `t_dish.merchant_id`: 商家拥有多菜品
* `t_customer.customer_id` -> `t_order.customer_id`: 食客发起多订单
* `t_merchant.merchant_id` -> `t_order.merchant_id`: 商家承接多订单
* `t_order.order_id` -> `t_order_item.order_id`: 订单包含多明细
* `t_dish.dish_id` -> `t_order_item.dish_id`: 明细关联具体菜品

### 3.3 反馈与算法链
* `t_order.order_id` ⟷ `t_review.order_id` (**1:1**, 唯一约束): 订单对应唯一评价
* `t_customer.customer_id` -> `t_rec_pool.customer_id`: 食客拥有推荐列表
* `t_merchant.merchant_id` -> `t_rec_pool.merchant_id`: 推荐列表指向具体商家
* `t_customer.customer_id` -> `t_nav_log.customer_id`: 食客产生导航日志