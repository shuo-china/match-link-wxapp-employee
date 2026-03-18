<template>
  <view class="container">
    <view class="hero-card">
      <view class="hero-title">Hi，{{ employeeInfo?.nickname }}</view>
      <view class="hero-subtitle">红娘顾问 · 徐州门店</view>
    </view>

    <view class="section-title">快捷功能</view>
    <view class="fns-wrapper">
      <view v-for="(item, index) in fnList" :index="index" :key="index" class="fns-item" @tap="handleTapFnItem(item)">
        <view class="icon-wrap" :style="{ background: item.bgColor }">
          <uni-icons :type="item.icon" size="24" color="#fff"></uni-icons>
        </view>
        <text class="text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useEmployeeStore } from '@/stores/employee';
import { storeToRefs } from 'pinia';

const employeeStore = useEmployeeStore()
const { employeeInfo } = storeToRefs(employeeStore)



const fnList = [
  {
    icon: 'person',
    text: '会员列表',
    link: '/pages/mbr/list',
    bgColor: 'linear-gradient(135deg, #5b7dff, #7b9aff)'
  },
  {
    icon: 'personadd',
    text: '添加会员',
    link: '/pages/mbr/form',
    bgColor: 'linear-gradient(135deg, #14b8a6, #2dd4bf)'
  },
  {
    icon: 'weixin',
    text: '小程序用户',
    link: '/pages/user/list',
    bgColor: 'linear-gradient(135deg, #07c160, #2bdc8d)'
  },
  {
    icon: 'map',
    text: '数据统计',
    link: '/pages/stat/list',
    bgColor: 'linear-gradient(135deg, #00b4d8, #48cae4)'
  },
]

const handleTapFnItem = (item) => {
  uni.navigateTo({
    url: item.link
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  padding: 12px;
  background: linear-gradient(180deg, #f8f5f2 0%, #f5f5f5 220px);
}

.hero-card {
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #764c24, #9a6a3d);
  box-shadow: 0 6px 16px rgba(118, 76, 36, 0.2);

  .hero-title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }

  .hero-subtitle {
    margin-top: 8px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.88);
  }
}

.section-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #3d3d3d;
}

.fns-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .fns-item {
    padding: 14px 0 12px;
    border-radius: 12px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    .icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .text {
      font-size: 13px;
      color: #333;
    }
  }
}
</style>