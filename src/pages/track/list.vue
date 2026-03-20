<template>
    <view class="track-list-page">
        <!-- 顶部操作栏 -->
        <view class="header">
            <view class="filter-bar">
                <text class="filter-text">筛选</text>
                <text class="filter-icon">▼</text>
            </view>
            <button class="add-btn" type="primary" size="mini" @click="handleAdd">添加跟踪记录</button>
        </view>

        <!-- 跟踪记录列表 -->
        <scroll-view scroll-y class="list-container">
            <view class="record-item" v-for="item in mockList" :key="item.id">
                <!-- 头部：时间和付费意愿 -->
                <view class="record-header">
                    <text class="time">跟踪时间：{{ item.trackTime }}</text>
                    <view class="willingness" :class="item.willingnessLevel">
                        意愿：{{ item.willingness }}
                    </view>
                </view>

                <!-- 主体：会员信息和备注 -->
                <view class="member-info">
                    <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
                    <view class="info-details">
                        <view class="name-row">
                            <text class="name">{{ item.name }}</text>
                            <text class="tag">{{ item.age }}岁</text>
                            <text class="tag">{{ item.job }}</text>
                        </view>
                        <view class="remark">
                            备注：{{ item.remark }}
                        </view>
                    </view>
                </view>
            </view>

            <view class="empty-tip" v-if="mockList.length === 0">暂无跟踪记录</view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 模拟数据
const mockList = ref([
    {
        id: 1,
        trackTime: '2023-10-25 14:30',
        willingness: '高',
        willingnessLevel: 'high',
        avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
        name: '张三',
        age: 28,
        job: '软件工程师',
        remark: '客户对高端匹配服务非常感兴趣，但是觉得价格稍微有点超出预算，需要跟进提供分期方案或者优惠活动，下次沟通时间定在周五。'
    },
    {
        id: 2,
        trackTime: '2023-10-24 10:15',
        willingness: '中',
        willingnessLevel: 'medium',
        avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
        name: '李四',
        age: 32,
        job: '产品经理',
        remark: '初步沟通，了解了基本需求，暂无明确付费意向，保持常规跟进。'
    },
    {
        id: 3,
        trackTime: '2023-10-22 16:45',
        willingness: '低',
        willingnessLevel: 'low',
        avatar: 'https://cdn.uviewui.com/uview/album/3.jpg',
        name: '王五',
        age: 26,
        job: '设计师',
        remark: '觉得目前没有迫切需求，暂时不需要服务，建议一个月后再回访。'
    }
]);

const handleAdd = () => {
    uni.showToast({
        title: '点击了添加跟踪记录',
        icon: 'none'
    });
};
</script>

<style lang="scss" scoped>
.track-list-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #eee;
}

.filter-bar {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #333;
    padding: 10rpx;
}

.filter-icon {
    font-size: 20rpx;
    margin-left: 8rpx;
    color: #666;
}

.add-btn {
    margin: 0;
    font-size: 26rpx;
    background-color: #007aff;
    color: #fff;
    border-radius: 8rpx;
    padding: 0 30rpx;
    height: 60rpx;
    line-height: 60rpx;
}

.list-container {
    flex: 1;
    padding: 20rpx;
    box-sizing: border-box;
}

.record-item {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}

.record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    border-bottom: 1rpx dashed #eee;
    padding-bottom: 16rpx;
}

.time {
    font-size: 26rpx;
    color: #666;
}

.willingness {
    font-size: 24rpx;
    padding: 4rpx 16rpx;
    border-radius: 6rpx;
}

.willingness.high {
    color: #ff4d4f;
    background-color: #fff1f0;
}

.willingness.medium {
    color: #faad14;
    background-color: #fffbe6;
}

.willingness.low {
    color: #52c41a;
    background-color: #f6ffed;
}

.member-info {
    display: flex;
    align-items: flex-start;
}

.avatar {
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
    margin-right: 20rpx;
    flex-shrink: 0;
    background-color: #eee;
}

.info-details {
    flex: 1;
    overflow: hidden;
}

.name-row {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
}

.name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-right: 16rpx;
}

.tag {
    font-size: 22rpx;
    color: #666;
    background-color: #f5f5f5;
    padding: 4rpx 12rpx;
    border-radius: 4rpx;
    margin-right: 12rpx;
}

.remark {
    font-size: 26rpx;
    color: #666;
    line-height: 1.5;
    /* 多行文本省略号处理 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}

.empty-tip {
    text-align: center;
    color: #999;
    font-size: 28rpx;
    padding: 40rpx 0;
}
</style>