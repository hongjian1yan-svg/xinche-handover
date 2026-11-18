/**
 * 钥匙柜订单 mock 数据 + 业务规则辅助函数
 *
 * 对接后端时：
 * - orders 数组应替换为列表接口返回数据（分页），字段名可按接口调整，
 *   但下面几个业务判断字段建议保留（或在 VO 里补上），因为交互规则全部依赖它们：
 *   deposited / taken / doorCount
 * - findOrder() 应替换为详情接口请求
 * - 所有 mutate 类操作（切换加急、变更柜门、编辑备注、打开柜门）都应替换为对应接口调用，
 *   目前直接改 mock 对象是为了让原型可以在本地演示"编辑后立刻生效"的效果
 *
 * 业务规则出处：PRD-钥匙柜地址变更.md
 */

export const orders = [
  {
    id: 'BD9',
    orderNo: '5597842BD9',
    tab: 'unfinished',
    statusText: '待检测  车商待存入',
    tags: ['初检', '事故排查初检'],
    model: '宝马3系330i',
    vin: 'WAUAGD4L2ED02255',
    cabinetName: 'B区3楼钥匙柜',
    inspector: '刘老根',
    shopName: '锦和二手车城/恒嘉二手车行',
    time: '2024-04-06 20:32',
    urgent: true,
    // 车商待存入：钥匙尚未首次存入任何钥匙柜（PRD §5.2）
    deposited: false,
    taken: false,
    doorCount: 1, // 下一次点击"打开柜门"= 第1次开门（首次存入）
    cabinetNo: '',
    slotNo: '',
    remark: '',
    // 首次存入，表单字段均为空，等待市场管理员/操作员现场填写
    depositPrice: '',
    depositPhone: '',
    depositDate: '',
    depositSlot: '',
    pledgeNo: 'XCJR20251016002',
    pledgeStatus: '待放款',
    phone: '18700992566',
    dealer: '锦和二手车城/恒嘉二手车行',
    createdTime: '2024-04-06 20:32',
    depositTime: '',
    cabinetStatus: '未存入',
    timeline: [
      { title: '生成订单', desc: '2026-01-12 11:32' }
    ]
  },
  {
    id: 'AD9',
    orderNo: '5597842AD9',
    tab: 'unfinished',
    statusText: '待检测  车商已存/检测师待取',
    tags: ['初检'],
    model: '奥迪 A6L 45 TFSI',
    vin: 'WAUAGD4L2ED09931',
    cabinetName: '新能源中心钥匙柜',
    inspector: '王老五',
    shopName: '严小二精品车行',
    time: '2024-04-07 20:32',
    urgent: false,
    deposited: true,
    taken: false,
    doorCount: 3, // 非首次存入（第3次开门，奇数）——"选择存放钥匙柜"字段应置灰（PRD §7.3.2）
    cabinetNo: '288',
    slotNo: '56',
    remark: '',
    // 非首次存入时，存入钥匙表单需回填上一次提交的内容（除"选择存放钥匙柜"外均可再编辑）
    depositPrice: '13',
    depositPhone: '17600195188',
    depositDate: '2025-03-10',
    depositSlot: '329',
    pledgeNo: 'XCJR20251016003',
    pledgeStatus: '待放款',
    phone: '18700992567',
    dealer: '严小二精品车行',
    createdTime: '2024-04-07 20:32',
    depositTime: '2024-04-07 20:40',
    cabinetStatus: '已关闭',
    timeline: [
      { title: '打开柜门', desc: '2026-01-12 13:43 · 市场管理员：王五' },
      { title: '生成订单', desc: '2026-01-12 11:32' }
    ]
  },
  {
    id: 'AD2',
    orderNo: '5597842AD2',
    tab: 'unfinished',
    statusText: '待检测  车商已存/检测师待取',
    tags: ['复检'],
    model: '奔驰 GLC300L',
    vin: 'WAUAGD4L2ED03311',
    cabinetName: 'A区10楼新能源汽车钥匙柜',
    inspector: '',
    shopName: '恒嘉二手车行',
    time: '2024-03-28 11:02',
    urgent: false,
    deposited: true,
    taken: false,
    doorCount: 2, // 取出（第2次开门，偶数）——点击打开柜门直接弹窗确认，不展示表单（PRD §7.3.3）
    cabinetNo: '132',
    slotNo: '27',
    remark: '',
    pledgeNo: 'XCJR20251016004',
    pledgeStatus: '待放款',
    phone: '18700992568',
    dealer: '恒嘉二手车行',
    createdTime: '2024-03-28 11:02',
    depositTime: '2024-03-28 11:10',
    cabinetStatus: '已关闭',
    timeline: [
      { title: '打开柜门', desc: '2026-01-10 09:00 · 市场管理员：王五' },
      { title: '生成订单', desc: '2026-01-10 08:40' }
    ]
  },
  {
    id: 'CF1',
    orderNo: '5597842CF1',
    tab: 'finished',
    statusText: '检测完成  车商待取',
    tags: ['初检'],
    model: '丰田 凯美瑞',
    vin: 'WAUAGD4L2ED07711',
    cabinetName: '负二楼钥匙柜',
    inspector: '刘老根',
    shopName: '锦和二手车城',
    time: '2024-04-05 09:12',
    urgent: null, // 已完成 Tab 不展示加急开关
    deposited: true,
    taken: false,
    doorCount: 4, // 车商来取车取钥匙 = 取出动作，按偶数处理，点击直接弹窗确认（不是再走一遍存入表单）
    cabinetNo: '156',
    slotNo: '18',
    remark: '',
    pledgeNo: 'XCJR20251016005',
    pledgeStatus: '待放款',
    phone: '18700992569',
    dealer: '锦和二手车城',
    createdTime: '2024-04-05 09:00',
    depositTime: '2024-04-05 09:12',
    cabinetStatus: '已关闭',
    timeline: [
      { title: '打开柜门', desc: '2026-01-12 13:43 · 市场管理员：王五' },
      { title: '生成订单', desc: '2026-01-12 11:32' }
    ]
  },
  {
    id: 'CF2',
    orderNo: '5597842CF2',
    tab: 'finished',
    statusText: '检测不通过  车商已取出',
    tags: ['复检'],
    model: '大众 帕萨特',
    vin: 'WAUAGD4L2ED08822',
    cabinetName: '新能源中心钥匙柜',
    inspector: '',
    shopName: '恒嘉二手车行',
    time: '2024-03-30 16:40',
    urgent: null,
    deposited: true,
    taken: true, // 钥匙已由车商取出：不展示变更柜门/打开柜门/柜门号车位号，"更多"仅联系车商
    doorCount: 6,
    cabinetNo: '',
    slotNo: '',
    remark: '',
    pledgeNo: 'XCJR20251016006',
    pledgeStatus: '已放款',
    phone: '18700992570',
    dealer: '恒嘉二手车行',
    createdTime: '2024-03-30 16:00',
    depositTime: '2024-03-30 16:10',
    cabinetStatus: '已取出',
    timeline: [
      { title: '取出钥匙', desc: '2026-01-05 10:20 · 市场管理员：王五' },
      { title: '打开柜门', desc: '2026-01-02 09:10 · 市场管理员：王五' },
      { title: '生成订单', desc: '2026-01-02 08:40' }
    ]
  },
  {
    id: 'CF3',
    orderNo: '5597842CF3',
    tab: 'finished',
    statusText: '检测取消  车商已取出',
    tags: ['初检'],
    model: '本田 CR-V',
    vin: 'WAUAGD4L2ED09933',
    cabinetName: 'A区10楼新能源汽车钥匙柜',
    inspector: '',
    shopName: '严小二精品车行',
    time: '2024-03-22 10:05',
    urgent: null,
    deposited: true,
    taken: true,
    doorCount: 4,
    cabinetNo: '',
    slotNo: '',
    remark: '',
    pledgeNo: 'XCJR20251016007',
    pledgeStatus: '已取消',
    phone: '18700992571',
    dealer: '严小二精品车行',
    createdTime: '2024-03-22 09:50',
    depositTime: '2024-03-22 10:00',
    cabinetStatus: '已取出',
    timeline: [
      { title: '取出钥匙', desc: '2026-01-01 15:00 · 市场管理员：王五' },
      { title: '打开柜门', desc: '2025-12-30 09:10 · 市场管理员：王五' },
      { title: '生成订单', desc: '2025-12-30 08:40' }
    ]
  }
]

// 全量钥匙柜地址列表，供【变更钥匙地址】/【存入钥匙-选择钥匙柜】两个弹层复用
// full: true 表示柜体已满、无空余柜门，选择列表里应置灰（PRD §5.3.3）
export const cabinetOptions = [
  { name: '负二楼钥匙柜', full: false },
  { name: '新能源中心钥匙柜', full: false },
  { name: 'A区10楼新能源汽车钥匙柜', full: false },
  { name: 'B区3楼钥匙柜', full: true }
]

export function findOrder(id) {
  return orders.find(o => o.id === id)
}

/**
 * 是否展示【变更柜门】入口
 * PRD §5.2：订单状态需在【已首次存入】之后、【车商已取出】之前
 * （车商待存入 = 还没有原钥匙柜可变更；车商已取出 = 钥匙已离柜，都不展示）
 */
export function canChangeCabinet(order) {
  return !!order.deposited && !order.taken
}

/** 是否展示【打开柜门】入口——钥匙已取出后不再展示 */
export function canOpenDoor(order) {
  return !order.taken
}

/**
 * "更多"弹窗是否展示【分配订单】
 * PRD §6.2 例外条款：订单已流转至【车商已取出】（订单已完结），不再展示分配订单，仅保留联系车商
 */
export function canAssign(order) {
  return !order.taken
}

/** 是否展示柜门号/车位号方框——钥匙已取出后柜门不再被占用，不展示 */
export function canShowStatBoxes(order) {
  return !order.taken
}

/** PRD §7：开门次数为奇数=存入（展示表单），偶数=取出（直接弹窗确认） */
export function isDepositDoor(doorCount) {
  return doorCount % 2 === 1
}

/** PRD §7.3.1：第1次开门（首次存入），"选择存放钥匙柜"字段可编辑；第3/5/7…次置灰只读 */
export function isFirstDoorOpen(doorCount) {
  return doorCount === 1
}
