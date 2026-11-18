<!--
  列表页订单卡片。列表页原本是把 6 张卡片的 HTML 各写一份（HTML 原型的写法），
  这里改成数据驱动，所有差异都由 mock/orders.js 里的字段 + 业务规则函数控制，
  接真实接口时只需要保证接口返回的字段/规则和 mock 对齐即可，不用再逐张卡片改模板。
-->
<template>
  <view class="order-card" @tap="$emit('tap-card', order)">
    <view class="top-row">
      <view class="split-pill">
        <text class="seg k">检测订单</text>
        <text class="seg v">{{ order.orderNo }}</text>
      </view>
      <text class="status-text">{{ order.statusText }}</text>
    </view>

    <view class="tag-row">
      <text v-for="tag in order.tags" :key="tag" class="type-tag">{{ tag }}</text>
    </view>

    <view class="title-row">
      <text class="model">{{ order.model }}</text>
      <view v-if="order.urgent" class="urgent-flag">
        <image class="urgent-flag-icon" src="/static/icons/urgent-bolt.svg" mode="aspectFit" />
        <text>加急</text>
      </view>
    </view>

    <view class="info-rows">
      <view class="info-row">
        <text class="k">车架号</text>
        <text>{{ order.vin }}</text>
      </view>
      <view class="info-row">
        <text class="k">钥匙柜</text>
        <text>{{ order.cabinetName }}</text>
      </view>
      <view v-if="order.inspector" class="info-row">
        <text class="k">检测师</text>
        <text>{{ order.inspector }}</text>
      </view>
    </view>

    <view class="meta-row">
      <text class="shop">{{ order.shopName }}</text>
      <text class="time">{{ order.time }}</text>
    </view>

    <view class="card-actions" @tap.stop>
      <button class="btn" @tap="$emit('more', order)">更多</button>

      <!-- 车商已取出（订单已完结）：更多之外只保留"查看详情"，不再展示加急/变更柜门/打开柜门 -->
      <button v-if="order.taken" class="btn" @tap="$emit('tap-card', order)">查看详情</button>

      <view v-else class="right-group">
        <button
          v-if="order.urgent !== null"
          class="btn"
          @tap="$emit('toggle-urgent', order)"
        >{{ order.urgent ? '取消加急' : '设为加急' }}</button>

        <button
          v-if="canChangeCabinet(order)"
          class="btn solid"
          @tap="$emit('change-cabinet', order)"
        >变更柜门</button>

        <button
          v-if="canOpenDoor(order)"
          class="btn teal"
          @tap="$emit('open-door', order)"
        >打开柜门</button>
      </view>
    </view>

    <view v-if="canShowStatBoxes(order)" class="stat-boxes">
      <view class="stat-box cab">
        <view class="hd">
          <image class="pin-icon" src="/static/icons/pin-icon.svg" mode="aspectFit" />
          <text>柜门号</text>
        </view>
        <text class="val">{{ order.cabinetNo || '--' }}</text>
      </view>
      <view class="stat-box slot">
        <view class="hd">
          <image class="pin-icon" src="/static/icons/pin-icon.svg" mode="aspectFit" />
          <text>车位号</text>
        </view>
        <text class="val">{{ order.slotNo || '--' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { canChangeCabinet, canOpenDoor, canShowStatBoxes } from '../mock/orders.js'

export default {
  name: 'OrderCard',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  methods: {
    canChangeCabinet,
    canOpenDoor,
    canShowStatBoxes
  }
}
</script>

<style lang="scss" scoped>
.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  position: relative;
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.04), 0 8rpx 28rpx rgba(29, 44, 79, 0.05);
}

.top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 18rpx;
}
.split-pill {
  display: inline-flex;
  height: 36rpx;
  border: 1px solid $split-border;
  border-radius: 4rpx;
  overflow: hidden;
  flex: none;
}
.split-pill .seg {
  display: flex;
  align-items: center;
  padding: 0 12rpx;
  font-size: 20rpx;
  font-weight: 500;
  color: $split-ink;
  white-space: nowrap;
}
.split-pill .seg.k {
  background: $tag-bg;
}
.split-pill .seg.v {
  background: #fff;
}
.status-text {
  font-size: 22rpx;
  font-weight: 600;
  color: $accent;
  white-space: nowrap;
  text-align: right;
}

.tag-row {
  display: flex;
  gap: 12rpx;
  margin-bottom: 18rpx;
}
.type-tag {
  font-size: 20rpx;
  font-weight: 500;
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
  background: $tag-bg;
  color: $tag-ink;
  white-space: nowrap;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 18rpx;
}
.model {
  font-size: 26rpx;
  font-weight: 600;
  color: $ink-strong;
  line-height: 1.4;
}
.urgent-flag {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: #fff;
  background: $accent;
  padding: 0 12rpx;
  height: 36rpx;
  border-radius: 18rpx;
  flex: none;
}
.urgent-flag-icon {
  width: 22rpx;
  height: 22rpx;
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 18rpx;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 24rpx;
  color: $ink;
}
.info-row .k {
  flex: none;
  background: $chip-bg;
  color: $ink;
  font-size: 20rpx;
  padding: 5rpx 12rpx;
  border-radius: 6rpx;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  color: $ink;
  margin-bottom: 18rpx;
  gap: 16rpx;
}
.meta-row .shop {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta-row .time {
  flex: none;
}

// 按钮宽度固定 136rpx（不做 flex 拉伸平分）；"更多"贴卡片左侧，其余按钮靠右分组，打开柜门/查看详情在最右
.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  padding-top: 16rpx;
  border-top: 1px solid $border;
}
.card-actions .right-group {
  display: flex;
  gap: 12rpx;
}
.btn {
  width: 136rpx;
  flex: none;
  min-width: 0;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
  font-weight: 500;
  border: 1px solid $accent;
  background: #fff;
  color: $accent;
  padding: 0 6rpx;

  &::after {
    border: none;
  }
  &.solid {
    background: $accent;
    color: #fff;
    border-color: $accent;
  }
  &.teal {
    background: $teal;
    color: #fff;
    border-color: $teal;
  }
}

.stat-boxes {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  position: absolute;
  right: 24rpx;
  top: 88rpx;
}
.stat-box {
  width: 156rpx;
  border-radius: 12rpx;
  overflow: hidden;
  text-align: center;
  background: #fff;
}
.stat-box .hd {
  font-size: 22rpx;
  font-weight: 600;
  color: #fff;
  padding: 6rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}
.pin-icon {
  width: 18rpx;
  height: 24rpx;
}
.stat-box .val {
  padding: 10rpx 0 12rpx;
  font-variant-numeric: tabular-nums;
}
.stat-box.cab {
  height: 90rpx;
  border: 1px solid $accent;
}
.stat-box.cab .hd {
  background: $accent;
  height: 39rpx;
}
.stat-box.cab .val {
  color: $accent;
  font-size: 32rpx;
  font-weight: 600;
}
.stat-box.slot {
  height: 78rpx;
  border: 1px solid $blue;
}
.stat-box.slot .hd {
  background: $blue;
  height: 39rpx;
}
.stat-box.slot .val {
  color: $blue;
  font-size: 22rpx;
  font-weight: 400;
}
</style>
