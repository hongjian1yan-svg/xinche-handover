<!--
  打开钥匙柜确认弹窗（严格取自 Figma node 152:413「对话框」）
  列表页 / 详情页的"打开柜门"在【取出】场景（开门次数为偶数）下复用本组件；
  【存入】场景（开门次数为奇数）不弹本组件，直接跳转存入钥匙表单页——详见 mock/orders.js 的 isDepositDoor()
-->
<template>
  <view v-if="visible" class="modal-mask" @tap.stop="onCancel">
    <view class="confirm-modal" @tap.stop>
      <view class="confirm-modal-content">
        <text class="confirm-modal-title">打开钥匙柜</text>
        <text class="confirm-modal-subtitle">您确定要打开柜子吗</text>
      </view>
      <view class="confirm-modal-footer">
        <button class="confirm-modal-btn cancel" @tap="onCancel">取消</button>
        <button class="confirm-modal-btn confirm" @tap="onConfirm">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'OpenCabinetConfirm',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 64rpx;
}
.confirm-modal {
  width: 100%;
  max-width: 622rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.confirm-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 40rpx 48rpx 0;
  text-align: center;
  width: 100%;
}
.confirm-modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  width: 100%;
}
.confirm-modal-subtitle {
  font-size: 28rpx;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.7;
  width: 100%;
}
.confirm-modal-footer {
  display: flex;
  gap: 24rpx;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 48rpx 48rpx 40rpx;
}
.confirm-modal-btn {
  flex: 1;
  border: none;
  border-radius: 12rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  line-height: 1.6;

  &::after {
    border: none;
  }
  &.cancel {
    background: $accent-10;
    color: $accent;
    font-weight: 400;
  }
  &.confirm {
    background: $accent;
    color: #fff;
    font-weight: 600;
  }
}
</style>
