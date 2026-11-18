# 钥匙柜地址变更 · uni-app (Vue2) 代码

本目录是从 [`交互原型/index.html`](../交互原型/index.html) 静态原型转写出来的 uni-app / Vue2 代码，用于交接给前端同事对接真实接口。业务规则来自 [`../PRD-钥匙柜地址变更.md`](../PRD-钥匙柜地址变更.md)，视觉细节来自 [`../设计规范-钥匙柜地址变更.md`](../设计规范-钥匙柜地址变更.md)，**接入前请先看这两份文档**，代码注释里也大量引用了对应章节号。

## 目录结构

```
uniapp-vue2/
├── pages.json                      路由片段（合并进项目已有 pages.json，不要整份覆盖）
├── uni.scss                        全局设计变量（颜色等），uni-app 会自动注入每个页面
├── pages/keyCabinet/
│   ├── list.vue                    列表页（未完成/已完成 两个 tab）
│   ├── detail.vue                  订单详情页
│   ├── change.vue                  变更钥匙地址页
│   └── deposit.vue                 存入钥匙页
├── components/
│   ├── OrderCard.vue                列表页卡片组件
│   └── OpenCabinetConfirm.vue       打开钥匙柜确认弹窗（列表页/详情页公用）
├── mock/orders.js                  演示数据 + 业务规则纯函数（canChangeCabinet / canOpenDoor 等）
└── static/icons/                   SVG 图标（从原型 assets/icons 直接拷贝）
```

## 关于 mock 数据 / 接口对接

`mock/orders.js` 里的 `orders` 数组模拟了 6 种典型订单状态（对应原型里的 6 张示例卡片），detail / change / deposit 三个页面都是通过 `onLoad(query)` 拿到 `id`，再用 `findOrder(id)` 查出订单对象来渲染——**这就是真实接口应该长什么样的最小范式**：列表接口返回数组，详情类页面按 id 查详情。

接口对接时按下面的顺序替换即可：
1. `list.vue`：`orders` 改为分页列表接口返回值。
2. `detail.vue` / `change.vue` / `deposit.vue` 的 `onLoad`：`findOrder(query.id)` 换成详情接口请求。
3. 所有标了 `// TODO：` 的地方，都是当前用本地直接改 mock 对象模拟"提交成功后界面立刻更新"效果的位置，需要替换成真实接口调用（提交 → 等待返回 → 用接口返回值更新页面，而不是直接改本地对象）。

`mock/orders.js` 里同时导出了几个**业务规则纯函数**（`canChangeCabinet`、`canOpenDoor`、`canAssign`、`canShowStatBoxes`、`isDepositDoor`、`isFirstDoorOpen`），每条都在注释里写清楚了对应 PRD 章节和判断依据。这些函数只依赖 `deposited` / `taken` / `doorCount` 三个字段，**建议详情接口的返回结构里保留（或映射出）这三个字段**，这样前端不用为每个状态单独写 if/else，接口字段一变所有页面的显隐规则自动跟着对。

## 已知需要设计再补的资源

- `static/icons/phone.svg`、`unlock.svg`、`edit.svg`：详情页底部"联系车商/打开柜门/编辑备注"三个图标，HTML 原型里是内联 SVG 路径，原始 `assets/icons/` 目录没有对应的导出文件（小程序端不支持内联 `<svg>`，必须用图片资源），`detail.vue` 里先用这三个占位文件名占着，需要找设计导出后替换。

## 与 HTML 原型的差异说明

- **单位换算**：HTML 原型用的是网页 CSS px（已经手动 /2 换算过），这里全部改用 uni-app 的 `rpx`，所以**直接用设计规范文档里 Figma 标注的原始像素数字**即可（不用再手动 /2），因为 750rpx = 375px 屏宽，rpx 会自动按比例换算。唯一例外是 border 描边宽度，沿用字面 `1px`，不要写成 rpx。
- **弹窗/底部弹层**：原型里用 CSS `overlay` + `.open` 类切换实现，这里改成 `v-if` 控制显隔，效果等价。
- **"打开柜门"交互**：按 PRD §7 的开门次数奇偶规则——奇数直接跳转存入钥匙表单页，偶数弹出确认框（不是所有点击都先弹确认框，这一版已经按最新需求改过，参见 `list.vue` / `detail.vue` 的 `onOpenDoor`）。
- **列表卡片**：HTML 原型里 6 张卡片是各写一份 HTML（方便逐张调设计细节），这里改成 `OrderCard.vue` + `v-for` 数据驱动，所有差异都由 `mock/orders.js` 里的字段控制，不用再逐张改模板。

## 待前端同事确认的开放问题

- PRD §6.3 提到的"质押类订单卡片"收纳方案目前未定义，本代码和原型一样只实现了"检测类"卡片样式。
- 权限控制（编辑备注/变更柜门仅市场管理员可见，PRD §8）本代码未实现角色判断，需要接入登录态/角色信息后在 `detail.vue`（编辑备注按钮）、`OrderCard.vue`（变更柜门按钮）里补上 `v-if` 判断。
