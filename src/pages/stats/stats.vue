<template>
    <view class="stats-container">
        <!-- 顶部总览 -->
        <view class="header-card">
            <view class="title">数据概览</view>
            <view class="total-wrap">
                <view class="total-item">
                    <text class="num">{{ totalStats.totalMembers }}</text>
                    <text class="label">累计客户数</text>
                </view>
                <view class="total-item">
                    <text class="num">{{ totalStats.totalDates }}</text>
                    <text class="label">累计排约数</text>
                </view>
            </view>
        </view>

        <!-- 时间筛选 -->
        <view class="filter-tabs">
            <view class="tab-item" :class="{ active: currentTab === 'today' }" @click="switchTab('today')">今日</view>
            <view class="tab-item" :class="{ active: currentTab === 'week' }" @click="switchTab('week')">本周</view>
            <view class="tab-item" :class="{ active: currentTab === 'month' }" @click="switchTab('month')">本月</view>
        </view>

        <!-- 核心指标 -->
        <view class="data-grid">
            <view class="grid-item">
                <view class="val">{{ currentStats.newMembers }}</view>
                <view class="name">新增客户</view>
            </view>
            <view class="grid-item">
                <view class="val">{{ currentStats.followUps }}</view>
                <view class="name">跟进次数</view>
            </view>
            <view class="grid-item">
                <view class="val">{{ currentStats.appointments }}</view>
                <view class="name">新增排约</view>
            </view>
            <view class="grid-item">
                <view class="val">{{ currentStats.transfers }}</view>
                <view class="name">流转客户</view>
            </view>
        </view>

        <!-- 近期动态转化漏斗 (模拟) -->
        <view class="section-title">转化漏斗 (模拟)</view>
        <view class="funnel-card">
            <view class="funnel-item">
                <text class="label">新入库</text>
                <text class="value">{{ currentStats.newMembers }} 人</text>
            </view>
            <view class="funnel-item">
                <text class="label">已建联</text>
                <text class="value">{{ Math.floor(currentStats.newMembers * 0.8) }} 人</text>
            </view>
            <view class="funnel-item">
                <text class="label">已排约</text>
                <text class="value">{{ currentStats.appointments }} 人</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 当前选中的时间标签
const currentTab = ref('today')

// 顶部累计数据 (模拟)
const totalStats = ref({
    totalMembers: 1250,
    totalDates: 320
})

// 当前选中时间段的统计数据 (模拟)
const currentStats = ref({
    newMembers: 0,
    followUps: 0,
    appointments: 0,
    transfers: 0
})

// 模拟向后端请求获取数据
const fetchStats = (tab: string) => {
    uni.showLoading({ title: '加载中...' })

    // 模拟网络请求延迟
    setTimeout(() => {
        if (tab === 'today') {
            currentStats.value = {
                newMembers: 5,
                followUps: 12,
                appointments: 2,
                transfers: 1
            }
        } else if (tab === 'week') {
            currentStats.value = {
                newMembers: 32,
                followUps: 85,
                appointments: 14,
                transfers: 4
            }
        } else if (tab === 'month') {
            currentStats.value = {
                newMembers: 128,
                followUps: 310,
                appointments: 45,
                transfers: 12
            }
        }
        uni.hideLoading()
    }, 500)
}

// 切换时间选项卡
const switchTab = (tab: string) => {
    if (currentTab.value === tab) return
    currentTab.value = tab
    fetchStats(tab)
}

// 页面显示时拉取数据
onShow(() => {
    fetchStats(currentTab.value)
})
</script>

<style lang="scss" scoped>
.stats-container {
    padding: 30rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
}

.header-card {
    /* 使用了与项目全局相近的主题色 #764c24 */
    background: linear-gradient(135deg, #8b5a2b, #764c24);
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    color: #fff;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(118, 76, 36, 0.2);

    .title {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
    }

    .total-wrap {
        display: flex;
        justify-content: space-around;

        .total-item {
            display: flex;
            flex-direction: column;
            align-items: center;

            .num {
                font-size: 48rpx;
                font-weight: bold;
                margin-bottom: 10rpx;
            }

            .label {
                font-size: 24rpx;
                opacity: 0.8;
            }
        }
    }
}

.filter-tabs {
    display: flex;
    background-color: #fff;
    border-radius: 12rpx;
    padding: 10rpx;
    margin-bottom: 30rpx;

    .tab-item {
        flex: 1;
        text-align: center;
        padding: 16rpx 0;
        font-size: 28rpx;
        color: #666;
        border-radius: 8rpx;
        transition: all 0.3s;

        &.active {
            background-color: #764c24;
            color: #fff;
            font-weight: bold;
        }
    }
}

.data-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 40rpx;

    .grid-item {
        width: 48%;
        background-color: #fff;
        border-radius: 16rpx;
        padding: 30rpx 0;
        margin-bottom: 24rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

        .val {
            font-size: 40rpx;
            color: #764c24;
            font-weight: bold;
            margin-bottom: 12rpx;
        }

        .name {
            font-size: 26rpx;
            color: #666;
        }
    }
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    padding-left: 16rpx;
    border-left: 8rpx solid #764c24;
}

.funnel-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

    .funnel-item {
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;

        &:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        &:first-child {
            padding-top: 0;
        }

        .label {
            font-size: 28rpx;
            color: #333;
        }

        .value {
            font-size: 28rpx;
            color: #764c24;
            font-weight: bold;
        }
    }
}
</style>