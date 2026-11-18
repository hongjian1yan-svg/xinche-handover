<!--
  钥匙柜管理 - 存入钥匙页
  对应 HTML 原型 SCENE 4。
  第1次开门（首次存入）：表单为空，"选择存放钥匙柜"可编辑；
  第3/5/7…次开门（非首次）：表单回填上次提交内容，"选择存放钥匙柜"置灰只读（PRD §7.3）。
-->
<template>
  <view v-if="order" class="page">
    <view class="navbar">
      <view class="back" @tap="goBack">
        <image class="back-icon" src="/static/icons/nav-back-arrow.svg" mode="aspectFit" />
      </view>
      <text class="title">存入钥匙</text>
    </view>

    <scroll-view scroll-y class="screen-body">
      <view class="form-section">
        <view class="field">
          <view class="label-row">
            <text class="req">*</text>
            <text class="label">车辆零售价</text>
          </view>
          <view class="value-row">
            <input v-model="form.price" class="input" type="digit" placeholder="请输入车辆零售价" />
            <text class="unit">万元</text>
          </view>
        </view>

        <view class="field">
          <view class="label-row">
            <text class="req">*</text>
            <text class="label">联系电话</text>
          </view>
          <view class="value-row">
            <input v-model="form.phone" class="input" type="number" placeholder="请输入联系电话" />
          </view>
        </view>

        <view class="field tappable" @tap="datePickerVisible = true">
          <view class="label-row">
            <text class="req">*</text>
            <text class="label">上牌日期</text>
          </view>
          <view class="value-row">
            <text class="value" :class="{ placeholder: !form.date }">{{ form.date || '请选择上牌日期' }}</text>
            <image class="chevron" src="/static/icons/fanhui.svg" mode="aspectFit" />
          </view>
        </view>

        <view class="field">
          <view class="label-row">
            <text class="req">*</text>
            <text class="label">停车位号</text>
          </view>
          <view class="value-row">
            <input v-model="form.slot" class="input" placeholder="请输入停车位号" />
          </view>
        </view>

        <view
          class="field"
          :class="{ tappable: isFirstTime, disabled: !isFirstTime }"
          @tap="isFirstTime && (cabinetPickerVisible = true)"
        >
          <view class="label-row">
            <text class="req">*</text>
            <text class="label">选择存放钥匙柜</text>
          </view>
          <view class="value-row">
            <text class="value" :class="{ placeholder: !form.cabinet }">{{ form.cabinet || '请选择钥匙柜地址' }}</text>
            <image v-if="isFirstTime" class="chevron" src="/static/icons/fanhui.svg" mode="aspectFit" />
          </view>
        </view>
      </view>

      <view class="textarea-field">
        <text class="label">备注</text>
        <textarea v-model="form.remark" class="remark-input" :maxlength="20" placeholder="请输入内容，20字以内" />
      </view>
    </scroll-view>

    <view class="primary-cta">
      <button @tap="onSubmit">打开柜门</button>
    </view>

    <!-- 选择存放钥匙柜：仅首次存入可打开，非首次字段本身已禁止点击 -->
    <view v-if="cabinetPickerVisible" class="overlay open" @tap="cabinetPickerVisible = false">
      <view class="sheet" @tap.stop>
        <text class="sheet-title">请选择存放钥匙柜</text>
        <view class="sheet-options">
          <view
            v-for="opt in availableCabinets"
            :key="opt.name"
            class="sheet-option"
            :class="{ selected: form.cabinet === opt.name }"
            @tap="form.cabinet = opt.name; cabinetPickerVisible = false"
          >
            <image
              class="radio-ic"
              :src="form.cabinet === opt.name ? '/static/icons/check-circle-filled.svg' : '/static/icons/circle-unselected.svg'"
              mode="aspectFit"
            />
            <text>{{ opt.name }}</text>
          </view>
        </view>
        <view class="sheet-footer">
          <button @tap="cabinetPickerVisible = false">确定</button>
        </view>
      </view>
    </view>

    <!-- 上牌日期：简化版月历，月份/年份切换在本迭代不做真实翻页（与 HTML 原型一致，仅作示例交互） -->
    <view v-if="datePickerVisible" class="overlay open" @tap="datePickerVisible = false">
      <view class="sheet date-sheet" @tap.stop>
        <view class="sheet-header">
          <text class="sheet-title">选择日期</text>
          <text class="sheet-close" @tap="datePickerVisible = false">×</text>
        </view>
        <view class="month-nav">
          <text @tap="toastDemo">«</text>
          <text @tap="toastDemo">‹</text>
          <text class="month-label">2026年7月</text>
          <text @tap="toastDemo">›</text>
          <text @tap="toastDemo">»</text>
        </view>
        <view class="weekday-row">
          <text v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</text>
        </view>
        <view class="day-grid">
          <text class="watermark">7</text>
          <view v-for="n in 3" :key="'empty-' + n" class="day-cell empty" />
          <view
            v-for="d in 31"
            :key="d"
            class="day-cell"
            @tap="selectedDay = d"
          >
            <text class="num" :class="{ selected: selectedDay === d }">{{ d }}</text>
          </view>
        </view>
        <view class="sheet-footer">
          <button @tap="confirmDate">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { findOrder, isFirstDoorOpen, cabinetOptions } from '../../mock/orders.js'

export default {
  data() {
    return {
      order: null,
      isFirstTime: true,
      form: { price: '', phone: '', date: '', slot: '', cabinet: '', remark: '' },
      cabinetPickerVisible: false,
      datePickerVisible: false,
      selectedDay: 20
    }
  },
  computed: {
    availableCabinets() {
      return cabinetOptions.filter(o => !o.full)
    }
  },
  onLoad(query) {
    this.order = findOrder(query.id)
    this.isFirstTime = isFirstDoorOpen(this.order.doorCount)
    if (this.isFirstTime) {
      // 首次存入：全部为空，等待现场填写
      this.form = { price: '', phone: '', date: '', slot: '', cabinet: '', remark: '' }
    } else {
      // 非首次：回填上一次提交的内容，"选择存放钥匙柜"不可再改（PRD §7.3.2）
      this.form = {
        price: this.order.depositPrice,
        phone: this.order.depositPhone,
        date: this.order.depositDate,
        slot: this.order.depositSlot,
        cabinet: this.order.cabinetName,
        remark: this.order.remark
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    toastDemo() {
      uni.showToast({ title: '示例：月份切换', icon: 'none' })
    },
    confirmDate() {
      const pad = n => String(n).padStart(2, '0')
      this.form.date = `2026-07-${pad(this.selectedDay)}`
      this.datePickerVisible = false
    },
    onSubmit() {
      if (!this.form.price || !this.form.phone || !this.form.date || !this.form.slot || !this.form.cabinet) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }
      // TODO：接口对接时替换为「打开柜门/存入钥匙」接口调用，成功后再回写下面这些字段
      this.order.depositPrice = this.form.price
      this.order.depositPhone = this.form.phone
      this.order.depositDate = this.form.date
      this.order.depositSlot = this.form.slot
      this.order.remark = this.form.remark
      if (this.isFirstTime) {
        this.order.cabinetName = this.form.cabinet
        this.order.deposited = true
      }
      uni.showToast({ title: '柜门已打开', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 800)
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
  margin: 20rpx 0 0;
}
.field {
  position: relative;
  padding: 28rpx 36rpx 12rpx;

  &::before {
    content: '';
    position: absolute;
    left: 36rpx;
    right: 36rpx;
    top: 0;
    height: 1px;
    background: $border;
  }
  &:first-child::before {
    display: none;
  }
  &:first-child {
    padding-top: 0;
  }
  &.disabled {
    opacity: 0.5;
  }
}
.form-section .field:last-child {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 36rpx;
    right: 36rpx;
    bottom: 0;
    height: 1px;
    background: $border;
  }
}
.field .label-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-bottom: 28rpx;
}
.field .label {
  font-size: 28rpx;
  font-weight: 500;
  color: $ink;
}
.field .req {
  color: $accent;
  margin-left: -16rpx;
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
.field .value.placeholder {
  color: $faint;
}
.field .unit {
  color: $ink-strong;
  font-weight: 700;
  flex: none;
}
.field .input {
  flex: 1;
  font-size: 28rpx;
  color: $ink;
}
.chevron {
  width: 32rpx;
  height: 32rpx;
  flex: none;
}

.textarea-field {
  background: #fff;
  border: 1px solid $border;
  border-radius: 12rpx;
  padding: 24rpx;
  margin: 28rpx 28rpx 0;
}
.textarea-field .label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 12rpx;
  color: $ink;
}
.remark-input {
  width: 100%;
  min-height: 80rpx;
  font-size: 28rpx;
  color: $ink;
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
  max-height: 80vh;
  display: flex;
  flex-direction: column;
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
  overflow-y: auto;
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

// 日期选择弹层
.sheet-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40rpx 28rpx;
}
.sheet-header .sheet-title {
  padding: 0;
}
.sheet-close {
  position: absolute;
  right: 40rpx;
  top: 0;
  width: 40rpx;
  height: 40rpx;
  color: $faint;
  font-size: 40rpx;
  line-height: 40rpx;
}
.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
  padding: 4rpx 40rpx 32rpx;
}
.month-nav text {
  font-size: 30rpx;
  color: $faint;
  padding: 8rpx;
}
.month-nav .month-label {
  font-size: 34rpx;
  font-weight: 700;
  color: #111;
  min-width: 216rpx;
  text-align: center;
}
.weekday-row {
  display: flex;
  padding: 0 28rpx;
  color: $faint;
  font-size: 24rpx;
}
.weekday-row text {
  flex: 1;
  text-align: center;
}
.day-grid {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx 28rpx 0;
  overflow: hidden;
}
.day-grid .watermark {
  position: absolute;
  right: 32rpx;
  top: -12rpx;
  font-size: 176rpx;
  font-weight: 800;
  color: #eef0f4;
  line-height: 1;
  z-index: 0;
}
.day-cell {
  width: 14.2857%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.day-cell .num {
  width: 68rpx;
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  font-size: 32rpx;
  color: #111;
}
.day-cell .num.selected {
  background: $accent;
  color: #fff;
  font-weight: 700;
}
</style>
