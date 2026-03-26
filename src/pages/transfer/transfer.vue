<template>
    <view class="container">
        <!-- 顶部浪漫渐变背景 -->
        <view class="bg-header"></view>

        <view class="content-wrapper">
            <view class="title-section">
                <text class="main-title">为您推荐优质嘉宾</text>
                <text class="sub-title">遇见心动的TA</text>
            </view>

            <view v-if="memberInfo" class="member-card">
                <view class="card-bg"></view>
                <view class="avatar-wrap">
                    <image class="avatar" :src="memberInfo.albums?.[0]?.path" mode="aspectFill"></image>
                </view>

                <view class="info">
                    <view class="name-row">
                        <text class="name">{{ memberInfo.name }}</text>
                    </view>

                    <view class="tags">
                        <view class="tag tag-item" v-if="memberInfo.age">
                            <text class="tag-text">{{ memberInfo.age }}岁</text>
                        </view>
                        <view class="tag tag-item" v-if="memberInfo.height">
                            <text class="tag-text">{{ memberInfo.height }}cm</text>
                        </view>
                        <view class="tag tag-item" v-if="memberInfo.education_text">
                            <text class="tag-text">{{ memberInfo.education_text }}</text>
                        </view>
                        <view class="tag tag-item" v-if="memberInfo.marital_status_text">
                            <text class="tag-text">{{ memberInfo.marital_status_text }}</text>
                        </view>
                        <view class="tag tag-item" v-if="memberInfo.job_text">
                            <text class="tag-text">{{ memberInfo.job_text }}</text>
                        </view>
                    </view>

                    <view class="divider"></view>
                    <view class="desc-text">点击下方按钮，查看TA的详细资料与照片</view>
                </view>
            </view>

            <view v-else class="loading-state">
                <text>正在为您加载嘉宾信息...</text>
            </view>

            <view class="btn-group">
                <button class="nav-btn" hover-class="btn-hover" @click="handleNavigate">
                    <text>查看更多资料</text>
                </button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getMbrRoughDetailApi } from '@/api/mbr';

let memberId = '';
const memberInfo = ref<any>(null);

onLoad((options) => {
    if (options?.memberId) {
        memberId = options.memberId;
        getMbrRoughDetailApi({ id: memberId }).then((res) => {
            memberInfo.value = res;
        });
    }
});

const handleNavigate = () => {
    if (memberId) {
        uni.navigateToMiniProgram({
            appId: 'wx31ccfafb7c027857',
            path: 'pages/mbr/detail?id=' + memberId,
            extraData: {
                memberId
            },
            envVersion: 'develop'
        });
    } else {
        uni.showToast({ title: '缺少会员ID参数', icon: 'none' });
    }
};
</script>

<style scoped>
.container {
    min-height: 100vh;
    background-color: #fcf9f9;
    position: relative;
    overflow: hidden;
}

.bg-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 460rpx;
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
    border-radius: 0 0 60rpx 60rpx;
    z-index: 0;
}

.content-wrapper {
    position: relative;
    z-index: 1;
    padding: 60rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title-section {
    text-align: center;
    margin-bottom: 50rpx;
    margin-top: 20rpx;
    color: #fff;
}

.main-title {
    font-size: 44rpx;
    font-weight: 600;
    display: block;
    margin-bottom: 12rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.sub-title {
    font-size: 28rpx;
    opacity: 0.9;
}

.member-card {
    width: 100%;
    background-color: #fff;
    border-radius: 32rpx;
    padding: 0 0 50rpx 0;
    margin-bottom: 60rpx;
    box-shadow: 0 16rpx 40rpx rgba(255, 154, 158, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.card-bg {
    width: 100%;
    height: 160rpx;
    background: linear-gradient(to bottom, #fff0f3, #ffffff);
}

.avatar-wrap {
    margin-top: -100rpx;
    padding: 8rpx;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
}

.avatar {
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: block;
}

.info {
    width: 100%;
    padding: 0 40rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.name-row {
    margin: 24rpx 0;
}

.name {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16rpx;
    margin-bottom: 30rpx;
}

.tag {
    padding: 8rpx 24rpx;
    border-radius: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tag-text {
    font-size: 24rpx;
    font-weight: 500;
}

.tag-item {
    background: #f5f5f5;
    color: #666666;
}

.divider {
    width: 80%;
    height: 2rpx;
    background-color: #f0f0f0;
    margin: 20rpx 0;
}

.desc-text {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
}

.loading-state {
    height: 400rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 28rpx;
}

.btn-group {
    width: 100%;
    padding: 0 20rpx;
    box-sizing: border-box;
}

.nav-btn {
    width: 100%;
    height: 96rpx;
    border-radius: 48rpx;
    background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12rpx 24rpx rgba(255, 117, 140, 0.3);
    border: none;
}

.nav-btn::after {
    border: none;
}

.btn-hover {
    transform: translateY(2rpx);
    box-shadow: 0 6rpx 12rpx rgba(255, 117, 140, 0.3);
    opacity: 0.9;
}
</style>
