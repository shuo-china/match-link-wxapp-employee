<template>
  <view class="page-container">
    <!-- Header / Hero -->
    <view class="header-section">
      <view class="hero-card">
        <view class="user-profile">
          <view class="avatar-box">
            <uni-icons type="person-filled" size="40" color="#8B5A2B"></uni-icons>
          </view>
          <view class="user-info">
            <view class="greeting">{{ employeeInfo?.nickname }}</view>
            <view class="role-tag">红娘顾问 · 门店代表</view>
          </view>
        </view>
        <view class="decoration-circle"></view>
        <view class="decoration-circle-small"></view>
      </view>
    </view>

    <!-- Main Content -->
    <view class="main-content">
      <view class="section-header">
        <view class="title-indicator"></view>
        <text class="section-title">工作台</text>
      </view>

      <view class="menu-card">
        <view class="menu-grid">
          <view v-for="(item, index) in fnList" :key="index" class="menu-item" @tap="handleTapFnItem(item)">
            <view class="icon-box" :style="{ background: item.bgColor }">
              <uni-icons :type="item.icon" size="30" color="#fff"></uni-icons>
            </view>
            <text class="menu-text">{{ item.text }}</text>
          </view>
        </view>
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
    icon: 'phone',
    text: '跟进记录',
    link: '/pages/track/list',
    bgColor: 'linear-gradient(135deg, #f59e0b, #f97316)'
  },
  {
    icon: 'heart',
    text: '约会记录',
    link: '/pages/date/list',
    bgColor: 'linear-gradient(135deg, #f472b6, #ec4899)'
  },
  {
    icon: 'calendar',
    text: '约会日程',
    link: '/pages/date/cal',
    bgColor: 'linear-gradient(135deg, #00b4d8, #48cae4)'
  },
  {
    icon: 'map',
    text: '数据统计',
    link: '/pages/stats/stats',
    bgColor: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
  },
]

const handleTapFnItem = (item) => {
  uni.navigateTo({
    url: item.link
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F8F5F2;
}

.header-section {
  padding: 12px 16px 0;
  background: #F8F5F2;
}

.hero-card {
  position: relative;
  height: 80px;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #8B5A2B 0%, #B8860B 100%);
  box-shadow: 0 8px 16px rgba(139, 90, 43, 0.2);
  overflow: hidden;
  display: flex;
  align-items: center;

  .user-profile {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .avatar-box {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .greeting {
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 12px;
    letter-spacing: 1px;
  }

  .role-tag {
    display: inline-block;
    padding: 3px 10px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    font-size: 12px;
    color: #ffffff;
    backdrop-filter: blur(4px);
  }

  .decoration-circle {
    position: absolute;
    right: -10px;
    top: -20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 1;
  }

  .decoration-circle-small {
    position: absolute;
    right: 60px;
    bottom: -15px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 1;
  }
}

.main-content {
  padding: 20px 16px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .title-indicator {
    width: 4px;
    height: 16px;
    background: #8B5A2B;
    border-radius: 2px;
    margin-right: 8px;
  }

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
  }
}

.menu-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 12px 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.2s;
  padding: 16px 8px;

  &:active {
    opacity: 0.7;
  }

  .icon-box {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .menu-text {
    font-size: 14px;
    color: #4A4A4A;
    font-weight: 500;
  }
}
</style>