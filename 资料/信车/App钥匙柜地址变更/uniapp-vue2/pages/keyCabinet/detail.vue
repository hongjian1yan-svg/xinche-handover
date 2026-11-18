<!--
  钥匙柜管理 - 订单详情页
  对应 HTML 原型 SCENE 2。
  顶部状态展示跟随列表卡片的状态字段（statusText），车商已取出的订单不展示"打开柜门/编辑备注"。
-->
<template>
  <view v-if="order" class="page">
    <view class="navbar">
      <view class="back" @tap="goBack">
        <image class="back-icon" src="/static/icons/nav-back-arrow.svg" mode="aspectFit" />
      </view>
      <text class="title">订单详情</text>
    </view>

    <scroll-view scroll-y class="screen-body">
      <view class="detail-hero">
        <text class="hero-title">{{ order.statusText }}</text>
      </view>

      <view class="detail-card">
        <text class="card-title">订单信息</text>
        <view class="detail-row">
          <text class="k">质押订单号</text>
          <view class="v-wrap">
            <text class="v">{{ order.pledgeNo }}</text>
            <text class="chip-sm">{{ order.pledgeStatus }}</text>
          </view>
        </view>
        <view class="detail-row">
          <text class="k">抵押车辆VIN</text>
          <text class="v">{{ order.vin }}</text>
        </view>
        <view class="detail-row">
          <text class="k">申请车商</text>
          <text class="v">{{ order.dealer }}</text>
        </view>
        <view class="detail-row">
          <text class="k">联系电话</text>
          <text class="v">{{ order.phone }}</text>
        </view>
        <view class="detail-row">
          <text class="k">柜门号</text>
          <text class="v">{{ order.cabinetNo || '--' }}</text>
        </view>
        <view class="detail-row">
          <text class="k">钥匙柜地址</text>
          <text class="v">{{ order.cabinetName }}</text>
        </view>
        <view class="detail-row">
          <text class="k">钥匙柜状态</text>
          <text class="v">{{ order.cabinetStatus }}</text>
        </view>
        <view class="detail-row">
          <text class="k">存入时间</text>
          <text class="v">{{ order.depositTime || '-' }}</text>
        </view>
        <view class="detail-row">
          <text class="k">创建时间</text>
          <text class="v">{{ order.createdTime }}</text>
        </view>
        <view class="detail-row">
          <text class="k">备注</text>
          <text class="v">{{ order.remark || '-' }}</text>
        </view>
      </view>

      <view class="timeline-card">
        <text class="card-title">订单流转</text>
        <view class="timeline">
          <view v-for="(item, i) in order.timeline" :key="i" class="timeline-item" :class="{ new: i === 0 && item._justAdded }">
            <view class="dot" />
            <view class="body">
              <text class="body-title">{{ item.title }}</text>
              <text class="body-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="bottombar">
      <view class="action" @tap="contactDealer">
        <!-- TODO：底部三个操作图标（电话/开锁/编辑）HTML原型里是内联SVG，assets/icons 里没有对应导出文件，
             需要设计再导出 phone.svg / unlock.svg / edit.svg 三个图标替换下面的 src -->
        <image class="ic" src="/static/icons/phone.svg" mode="aspectFit" />
        <text>联系车商</text>
      </view>
      <view v-if="!order.taken" class="action" @tap="onOpenDoor">
        <image class="ic" src="/static/icons/unlock.svg" mode="aspectFit" />
        <text>打开柜门</text>
      </view>
      <view v-if="!order.taken" class="action primary" @tap="openRemarkEditor">
        <image class="ic" src="/static/icons/edit.svg" mode="aspectFit" />
        <text>编辑备注</text>
      </view>
    </view>

    <!-- 编辑备注：市场管理员可见/可操作，20字限制（PRD §4） -->
    <view v-if="remarkVisible" class="overlay open" @tap="closeRemarkEditor">
      <view class="sheet" @tap.stop>
        <text class="sheet-title">编辑备注</text>
        <view class="remark-modal">
          <textarea
            v-model="remarkDraft"
            class="remark-input"
            :maxlength="20"
            placeholder="请输入内容，20字以内"
          />
          <text class="counter" :class="{ limit: remarkDraft.length >= 20 }">{{ remarkDraft.length }}/20</text>
          <view class="btn-row">
            <button class="btn-cancel" @tap="closeRemarkEditor">取消</button>
            <button class="btn-save" @tap="saveRemark">保存</button>
          </view>
        </view>
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
import OpenCabinetConfirm from '../../components/OpenCabinetConfirm.vue'
import { findOrder, isDepositDoor } from '../../mock/orders.js'

export default {
  components: { OpenCabinetConfirm },
  data() {
    return {
      orderId: '',
      order: null,
      remarkVisible: false,
      remarkDraft: '',
      confirmVisible: false
    }
  },
  onLoad(query) {
    this.orderId = query.id
    // TODO：接口对接时替换为详情接口请求，this.order = await api.getOrderDetail(this.orderId)
    this.order = findOrder(this.orderId)
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    contactDealer() {
      uni.showToast({ title: '已拨打车商联系电话（示例）', icon: 'none' })
    },
    onOpenDoor() {
      if (isDepositDoor(this.order.doorCount)) {
        uni.navigateTo({ url: `/pages/keyCabinet/deposit?id=${this.order.id}` })
      } else {
        this.confirmVisible = true
      }
    },
    onConfirmOpenDoor() {
      this.confirmVisible = false
      uni.showToast({ title: '柜门已打开，请取出钥匙', icon: 'none' })
    },
    openRemarkEditor() {
      this.remarkDraft = this.order.remark || ''
      this.remarkVisible = true
    },
    closeRemarkEditor() {
      this.remarkVisible = false
    },
    saveRemark() {
      const val = this.remarkDraft.trim()
      this.order.remark = val
      this.remarkVisible = false
      // TODO：接口对接时替换为「保存备注」接口调用；失败需提示且不覆盖原备注（PRD §4.4）
      this.order.timeline.unshift({
        title: '编辑备注',
        desc: `${this.nowText()} · 市场管理员：张三`,
        _justAdded: true
      })
      uni.showToast({ title: '备注已更新', icon: 'none' })
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

.detail-hero {
  background: linear-gradient(160deg, $navy-2 0%, $navy-1 100%);
  padding: 32rpx 32rpx 68rpx;
}
.hero-title {
  font-size: 46rpx;
  font-weight: 600;
  color: #fff;
}

.detail-card {
  background: #fff;
  border-radius: 24rpx;
  margin: -30rpx 28rpx 0;
  position: relative;
  z-index: 1;
}
.card-title {
  display: block;
  padding: 28rpx 28rpx 8rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: #111;
}
.detail-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
  padding: 32rpx 28rpx;
  font-size: 24rpx;

  &::before {
    content: '';
    position: absolute;
    left: 28rpx;
    right: 28rpx;
    top: 0;
    height: 1px;
    background: $border;
  }
  &:first-of-type::before {
    display: none;
  }
}
.detail-row .k {
  color: $muted;
  flex: none;
}
.detail-row .v {
  color: $ink;
  text-align: right;
}
.v-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.chip-sm {
  background: $tag-bg;
  color: $tag-ink;
  font-size: 21rpx;
  font-weight: 600;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.timeline-card {
  background: #fff;
  border-radius: 24rpx;
  margin: 24rpx 28rpx 0;
  box-shadow: 0 8rpx 28rpx rgba(29, 44, 79, 0.06);
}
.timeline {
  display: flex;
  flex-direction: column;
  gap: 26rpx;
  padding: 4rpx 28rpx 28rpx;
}
.timeline-item {
  display: flex;
  gap: 18rpx;
}
.timeline-item .dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: $blue;
  margin-top: 12rpx;
  flex: none;
  box-shadow: 0 0 0 6rpx #eaf0ff;
}
.timeline-item .body-title {
  display: block;
  font-size: 24rpx;
  color: #111;
}
.timeline-item .body-desc {
  display: block;
  font-size: 21rpx;
  color: $faint;
}
.timeline-item.new .dot {
  background: $accent;
  box-shadow: 0 0 0 6rpx $accent-soft;
}
.timeline-item.new .body-title {
  color: $accent;
}

.bottombar {
  flex: none;
  background: #fff;
  border-top: 1px solid $border;
  display: flex;
  padding: 16rpx 32rpx 32rpx;
}
.bottombar .action {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.bottombar .action .ic {
  width: 40rpx;
  height: 40rpx;
}
.bottombar .action text {
  font-size: 22rpx;
  color: $ink;
}
.bottombar .action.primary text {
  color: $accent;
  font-weight: 600;
}

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
.remark-modal {
  padding: 0 32rpx 32rpx;
}
.remark-input {
  width: 100%;
  min-height: 176rpx;
  border: 1px solid $border;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: $ink;
  box-sizing: border-box;
}
.counter {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: $faint;
  margin-top: 12rpx;
}
.counter.limit {
  color: $accent;
}
.btn-row {
  display: flex;
  gap: 20rpx;
  padding: 32rpx 0 20rpx;
}
.btn-row button {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;

  &::after {
    border: none;
  }
}
.btn-cancel {
  background: #fff;
  color: $ink;
  border: 1px solid $border;
}
.btn-save {
  background: $accent;
  color: #fff;
  border: 1px solid $accent;
}
</style>
