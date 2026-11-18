<!--
  钥匙柜管理 - 列表页
  对应 HTML 原型 SCENE 1，交互原型里"未完成/已完成"两个 tab 是靠 CSS/JS 切换 display，
  这里改成基于 activeTab 过滤 mock 数据渲染，逻辑等价。
-->
<template>
  <view class="page">
    <view class="navbar">
      <view class="back" @tap="goBack">
        <image class="back-icon" src="/static/icons/nav-back-arrow.svg" mode="aspectFit" />
      </view>
      <text class="title">钥匙柜管理</text>
    </view>

    <view class="list-tabs">
      <view
        v-for="t in tabs"
        :key="t.value"
        class="list-tab"
        :class="{ active: activeTab === t.value }"
        @tap="activeTab = t.value"
      >{{ t.label }}</view>
    </view>

    <!-- 状态/类型/VIN/柜号/时间筛选：本次迭代不涉及筛选逻辑改造，先保留原静态展示，接口对接时再补 -->
    <view class="filter-row">
      <view v-for="f in filters" :key="f" class="filter-item">
        <text>{{ f }}</text>
        <image class="chevron" src="/static/icons/dropdown-chevron.svg" mode="aspectFit" />
      </view>
    </view>

    <scroll-view scroll-y class="screen-body">
      <view class="count-row">
        <view class="line" />
        <text class="count-text">共找到{{ visibleOrders.length }}个</text>
        <view class="line" />
      </view>

      <view class="list-body">
        <order-card
          v-for="order in visibleOrders"
          :key="order.id"
          :order="order"
          @tap-card="goDetail"
          @more="openMore"
          @toggle-urgent="toggleUrgent"
          @change-cabinet="goChange"
          @open-door="onOpenDoor"
        />
      </view>
    </scroll-view>

    <!-- "更多"底部弹窗：联系车商 + 分配订单；车商已取出的订单只保留联系车商（PRD §6.2 例外条款） -->
    <view v-if="moreVisible" class="overlay open" @tap="closeMore">
      <view class="sheet" @tap.stop>
        <text class="sheet-title">更多操作</text>
        <view class="action-sheet-list">
          <view class="action-sheet-item" @tap="contactDealer">联系车商</view>
          <view v-if="moreOrder && canAssign(moreOrder)" class="action-sheet-item" @tap="assignOrder">分配订单</view>
        </view>
        <button class="sheet-cancel" @tap="closeMore">取消</button>
      </view>
    </view>

    <open-cabinet-confirm
      :visible="confirmVisible"
      @cancel="confirmVisible = false"
      @confirm="onConfirmOpenDoor"
    />
  </view>
</template>

<script>
import OrderCard from '../../components/OrderCard.vue'
import OpenCabinetConfirm from '../../components/OpenCabinetConfirm.vue'
import { orders, canAssign, isDepositDoor } from '../../mock/orders.js'

export default {
  components: { OrderCard, OpenCabinetConfirm },
  data() {
    return {
      tabs: [
        { label: '未完成', value: 'unfinished' },
        { label: '已完成', value: 'finished' }
      ],
      filters: ['状态', '类型', 'VIN', '柜号', '时间'],
      activeTab: 'unfinished',
      orders,
      moreVisible: false,
      moreOrder: null,
      confirmVisible: false,
      pendingDoorOrder: null
    }
  },
  computed: {
    visibleOrders() {
      return this.orders.filter(o => o.tab === this.activeTab)
    }
  },
  methods: {
    canAssign,
    goBack() {
      uni.navigateBack()
    },
    goDetail(order) {
      uni.navigateTo({ url: `/pages/keyCabinet/detail?id=${order.id}` })
    },
    goChange(order) {
      uni.navigateTo({ url: `/pages/keyCabinet/change?id=${order.id}` })
    },
    openMore(order) {
      this.moreOrder = order
      this.moreVisible = true
    },
    closeMore() {
      this.moreVisible = false
      this.moreOrder = null
    },
    contactDealer() {
      this.closeMore()
      uni.showToast({ title: '已拨打车商联系电话（示例）', icon: 'none' })
    },
    assignOrder() {
      this.closeMore()
      uni.showToast({ title: '已打开分配订单面板（示例）', icon: 'none' })
    },
    toggleUrgent(order) {
      order.urgent = !order.urgent
      uni.showToast({ title: order.urgent ? '已标记为加急' : '已取消加急', icon: 'none' })
      // TODO：接口对接时替换为「设为加急/取消加急」接口调用，成功后再更新本地状态
    },
    // 打开柜门：奇数（存入）直接进入表单页；偶数（取出）先弹确认框，确定后取出（PRD §7.3）
    onOpenDoor(order) {
      if (isDepositDoor(order.doorCount)) {
        uni.navigateTo({ url: `/pages/keyCabinet/deposit?id=${order.id}` })
      } else {
        this.pendingDoorOrder = order
        this.confirmVisible = true
      }
    },
    onConfirmOpenDoor() {
      this.confirmVisible = false
      if (!this.pendingDoorOrder) return
      uni.showToast({ title: '柜门已打开，请取出钥匙', icon: 'none' })
      // TODO：接口对接时调用「取出」接口；成功后按需刷新该订单状态（如转为已完成/已取出）
      this.pendingDoorOrder = null
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $page-app-bg;
  display: flex;
  flex-direction: column;
}

.navbar {
  flex: none;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #fff;
}
.navbar .back {
  position: absolute;
  left: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon {
  width: 18rpx;
  height: 32rpx;
}
.navbar .title {
  font-size: 32rpx;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
}

.list-tabs {
  flex: none;
  background: #fff;
  display: flex;
  padding-top: 20rpx;
}
.list-tab {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #4c4c4c;
  padding-bottom: 16rpx;
  position: relative;
}
.list-tab.active {
  font-weight: 600;
  color: $accent;
}
.list-tab.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  border-radius: 4rpx;
  background: $accent;
}

.filter-row {
  flex: none;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  border-bottom: 1px solid $border;
}
.filter-item {
  display: inline-flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
  color: #4c4c4c;
  white-space: nowrap;
}
.chevron {
  width: 14rpx;
  height: 9rpx;
}

.screen-body {
  flex: 1;
}

.count-row {
  background: $page-app-bg;
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 20rpx 28rpx 0;
}
.count-row .line {
  flex: 1;
  height: 1px;
  background: #d9d9d9;
}
.count-row .count-text {
  flex: none;
  font-size: 24rpx;
  color: #666;
}

.list-body {
  padding: 20rpx 20rpx 48rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

// ===== 底部弹层（更多操作），与详情页/变更页/存入页的弹层样式保持一致 =====
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 30;
}
.sheet {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx 0 0;
}
.sheet-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  color: #111;
  padding: 0 40rpx 28rpx;
}
.action-sheet-list {
  padding: 0 28rpx;
}
.action-sheet-item {
  padding: 30rpx 0;
  font-size: 28rpx;
  color: $ink;
  text-align: center;
  border-bottom: 1px solid $border;
}
.action-sheet-item:last-child {
  border-bottom: none;
}
.sheet-cancel {
  margin: 16rpx 28rpx 36rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 20rpx;
  background: $page-app-bg;
  color: $ink;
  font-size: 28rpx;
  font-weight: 600;

  &::after {
    border: none;
  }
}
</style>
