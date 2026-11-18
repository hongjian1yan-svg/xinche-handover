<!--
  钥匙柜管理 - 变更钥匙地址页
  对应 HTML 原型 SCENE 3。
  背景色/卡片样式细节参见 设计规范-钥匙柜地址变更.md。
-->
<template>
  <view v-if="order" class="page">
    <view class="navbar">
      <view class="back" @tap="goBack">
        <image class="back-icon" src="/static/icons/nav-back-arrow.svg" mode="aspectFit" />
      </view>
      <text class="title">变更钥匙地址</text>
    </view>

    <view class="screen-body">
      <!-- 当前钥匙柜地址：只读展示，橘色描边 + 5%透明度橘色底色 -->
      <view class="current-cabinet-card">
        <view class="field">
          <text class="label">当前钥匙柜地址</text>
          <text class="value muted">{{ currentAddressText }}</text>
        </view>
      </view>

      <view class="form-section">
        <view class="field tappable" @tap="pickerVisible = true">
          <view class="label-row">
            <text class="req">*</text>
            <text class="label">选择新的存放钥匙柜</text>
          </view>
          <view class="value-row">
            <text class="value" :class="{ placeholder: !selectedCabinet }">{{ selectedCabinet || '请选择存放钥匙柜' }}</text>
            <image class="chevron" src="/static/icons/fanhui.svg" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>

    <view class="primary-cta">
      <button :disabled="!selectedCabinet || confirming" @tap="onConfirm">
        {{ confirming ? '开锁中…' : '变更柜门' }}
      </button>
    </view>

    <!-- 选择存放钥匙柜：当前所在钥匙柜置灰不可选；柜体已满同样置灰（PRD §5.3.2/5.3.3） -->
    <view v-if="pickerVisible" class="overlay open" @tap="pickerVisible = false">
      <view class="sheet" @tap.stop>
        <text class="sheet-title">请选择存放钥匙柜</text>
        <view class="sheet-options">
          <view
            v-for="opt in cabinetOptions"
            :key="opt.name"
            class="sheet-option"
            :class="{ disabled: isCurrent(opt.name) || opt.full, selected: selectedCabinet === opt.name }"
            @tap="selectCabinet(opt)"
          >
            <image
              class="radio-ic"
              :src="selectedCabinet === opt.name ? '/static/icons/check-circle-filled.svg' : '/static/icons/circle-unselected.svg'"
              mode="aspectFit"
            />
            <text>{{ opt.name }}</text>
            <text v-if="isCurrent(opt.name)" class="note">当前钥匙柜</text>
            <text v-else-if="opt.full" class="note">已无空余柜门</text>
          </view>
        </view>
        <view class="sheet-footer">
          <button @tap="pickerVisible = false">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { findOrder, cabinetOptions } from '../../mock/orders.js'

export default {
  data() {
    return {
      order: null,
      cabinetOptions,
      pickerVisible: false,
      selectedCabinet: '',
      confirming: false
    }
  },
  computed: {
    currentAddressText() {
      return `${this.order.cabinetName} · ${this.order.cabinetNo || '--'}号柜门`
    }
  },
  onLoad(query) {
    this.order = findOrder(query.id)
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    isCurrent(name) {
      return name === this.order.cabinetName
    },
    selectCabinet(opt) {
      if (this.isCurrent(opt.name) || opt.full) return
      this.selectedCabinet = opt.name
      this.pickerVisible = false
    },
    // 变更流程：联动硬件同时打开原柜门与新柜门，一步到位，不做分步确认（PRD §5.4）
    onConfirm() {
      if (!this.selectedCabinet || this.confirming) return
      this.confirming = true
      setTimeout(() => {
        this.confirming = false
        const oldAddress = this.currentAddressText
        const newCabinetNo = '056' // TODO：接口对接时用真实分配到的柜门号替换
        const newAddress = `${this.selectedCabinet} · ${newCabinetNo}号柜门`

        this.order.cabinetName = this.selectedCabinet
        this.order.cabinetNo = newCabinetNo
        this.selectedCabinet = ''

        // 订单流转：原钥匙柜记录"结束使用"，新钥匙柜按普通"打开柜门"记录格式追加（PRD §5.4.3）
        const ts = this.nowText()
        this.order.timeline.unshift({ title: '打开柜门', desc: `${newAddress} · ${ts} · 市场管理员：张三`, _justAdded: true })
        this.order.timeline.splice(1, 0, { title: '结束使用', desc: `${oldAddress} · ${ts} · 市场管理员：张三` })

        uni.showToast({ title: '已变更柜门', icon: 'none' })
        // TODO：接口对接时替换为「变更柜门」接口调用；任一柜门开锁失败需提示"柜门开启失败，请重试"且不更新数据（PRD §5.5）
      }, 900)
    },
    nowText() {
      const d = new Date()
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
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
  border-bottom: 1px solid $border;
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

.screen-body {
  flex: 1;
}

.form-section {
  background: #fff;
  margin: 28rpx 28rpx 0;
  border-radius: 24rpx;
  overflow: hidden;
}

// "当前钥匙柜地址"独立成卡片：橘色描边 + 5%透明度橘色底色，与页面白底区分（用户指定，不要用 #fbfbfc 灰底）
.current-cabinet-card {
  background: $accent-5;
  margin: 28rpx 28rpx 0;
  border-radius: 24rpx;
  overflow: hidden;
  border: 1px solid $accent;
}
// 文案上下留白对称，使其在卡片矩形内垂直居中
.current-cabinet-card .field {
  padding: 34rpx 28rpx;
  border-top: none;
}

.field {
  padding: 48rpx 28rpx 20rpx;
  border-top: 1px solid $border;
}
.field:first-child {
  border-top: none;
}
.form-section .field:last-child {
  border-bottom: 1px solid $border;
}
.field .label {
  font-size: 28rpx;
  font-weight: 500;
  color: $ink;
}
.field .label-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
}
.field .req {
  color: $accent;
}
.field .value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
}
.field .value {
  color: $ink;
}
.field .value.muted {
  color: $muted;
}
.field .value.placeholder {
  color: $faint;
}
.chevron {
  width: 32rpx;
  height: 32rpx;
  flex: none;
}
.tappable {
  // uni-app view 默认无 cursor 概念，保留 class 便于 H5 端语义化
}

.primary-cta {
  flex: none;
  background: #fff;
  border-top: 1px solid $border;
  padding: 12rpx 40rpx 80rpx;
}
.primary-cta button {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 12rpx;
  background: $accent;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;

  &::after {
    border: none;
  }
  &[disabled] {
    background: #f5c2b3;
    color: #fff;
  }
}

// ===== 底部弹层 =====
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
.sheet-options {
  padding: 0 28rpx 80rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.sheet-option {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 0 28rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background: $page-app-bg;
  font-size: 28rpx;
  color: $ink;
}
.sheet-option .radio-ic {
  width: 32rpx;
  height: 32rpx;
  flex: none;
}
.sheet-option.selected {
  background: $accent-soft;
  color: $accent;
  font-weight: 600;
}
.sheet-option.disabled {
  opacity: 0.5;
}
.sheet-option .note {
  margin-left: auto;
  font-size: 21rpx;
  color: $faint;
}
.sheet-footer {
  padding: 12rpx 40rpx 80rpx;
  border-top: 1px solid $border;
}
.sheet-footer button {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 12rpx;
  background: $accent;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;

  &::after {
    border: none;
  }
}
</style>
