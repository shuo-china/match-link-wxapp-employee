<template>
    <view class="date-detail-page">
        <view class="header-card">
            <view class="time-title">约会时间</view>
            <view class="time-value">{{ detail?.date_time || '-' }}</view>
            <view class="remark" v-if="detail?.remark">备注：{{ detail.remark }}</view>
        </view>

        <view class="compare-container">
            <view class="column male-column">
                <view class="column-title man">男方</view>
                <view class="member-card" @tap="goToMember(detail?.male_member?.id)">
                    <image class="avatar" :src="detail?.male_member?.cover?.path" mode="aspectFill"></image>
                    <view class="info-list">
                        <view class="info-item">
                            <text class="label">姓名</text>
                            <text class="value">{{ detail?.male_member?.name }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">年龄</text>
                            <text class="value">{{ detail?.male_member.age + '岁'
                            }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">身高</text>
                            <text class="value">{{ detail?.male_member.height + 'cm'
                            }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">行业</text>
                            <text class="value">{{ detail?.male_member?.industry_text || '-' }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">职业</text>
                            <text class="value">{{ detail?.male_member?.occupation || '-' }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">婚姻</text>
                            <text class="value">{{ detail?.male_member?.marital_status_text }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">学历</text>
                            <text class="value">{{ detail?.male_member?.education_text || '-' }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">月收入</text>
                            <text class="value">{{ detail?.male_member?.annualIncome + '万元' }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">满意度</text>
                            <text class="value">{{ detail?.man_to_woman_level_text || '-' }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="vs-divider">
                <view class="line"></view>
                <view class="vs-text">
                    <uni-icons type="heart-filled" size="24" color="#ff4d4f"></uni-icons>
                </view>
                <view class="line"></view>
            </view>

            <view class="column female-column">
                <view class="column-title woman">女方</view>
                <view class="member-card" @tap="goToMember(detail?.female_member?.id)">
                    <image class="avatar" :src="detail?.female_member?.cover?.path" mode="aspectFill"></image>
                    <view class="info-list right-align">
                        <view class="info-item">
                            <text class="label">姓名</text>
                            <text class="value">{{ detail?.female_member?.name }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">年龄</text>
                            <text class="value">{{ detail?.female_member.age + '岁'
                            }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">身高</text>
                            <text class="value">{{ detail?.female_member.height + 'cm'
                            }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">行业</text>
                            <text class="value">{{ detail?.female_member?.industry_text }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">职业</text>
                            <text class="value">{{ detail?.female_member?.occupation || '-' }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">婚姻</text>
                            <text class="value">{{ detail?.female_member?.marital_status_text }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">学历</text>
                            <text class="value">{{ detail?.female_member?.education_text || '-' }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">月收入</text>
                            <text class="value">{{ detail?.female_member?.annualIncome + '万元' }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">满意度</text>
                            <text class="value">{{ detail?.woman_to_man_level_text || '-' }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDateDetailApi } from '@/api/date'
import useDict from '@/hooks/useDict'

const detail = ref<any>(null)

const goToMember = (id) => {
    if (!id) return
    uni.navigateTo({
        url: '/pages/mbr/detail?id=' + id
    })
}

onLoad((options) => {
    if (options?.id) {
        uni.showLoading({ title: '加载中' })
        getDateDetailApi({ id: options.id }).then(res => {
            detail.value = res
        }).finally(() => {
            uni.hideLoading()
        })
    }
})
</script>

<style lang="scss" scoped>
.date-detail-page {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 20rpx;
    box-sizing: border-box;
}

.header-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;
    text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .time-title {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 12rpx;
    }

    .time-value {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
    }

    .remark {
        margin-top: 20rpx;
        padding-top: 20rpx;
        border-top: 1rpx dashed #eee;
        font-size: 26rpx;
        color: #999;
        text-align: left;
    }
}

.compare-container {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx 0;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.column {
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .column-title {
        font-size: 30rpx;
        font-weight: bold;
        padding: 6rpx 24rpx;
        border-radius: 100rpx;
        margin-bottom: 24rpx;

        &.man {
            color: #2979ff;
            background-color: #eaf3ff;
        }

        &.woman {
            color: #e43d33;
            background-color: #ffefee;
        }
    }

    .member-card {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 20rpx;
        box-sizing: border-box;

        .avatar {
            width: 140rpx;
            height: 140rpx;
            border-radius: 50%;
            background-color: #eee;
            margin-bottom: 24rpx;
            border: 4rpx solid #fff;
            box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
        }

        .info-list {
            width: 100%;

            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16rpx 0;
                border-bottom: 1rpx solid #f5f5f5;

                .label {
                    font-size: 26rpx;
                    color: #999;
                    flex-shrink: 0;
                }

                .value {
                    font-size: 26rpx;
                    color: #333;
                    font-weight: 500;
                    text-align: right;
                    flex: 1;
                    width: 0;
                    margin-left: 20rpx;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }

            &.right-align {
                .info-item {
                    flex-direction: row-reverse;

                    .value {
                        text-align: left;
                        margin-left: 0;
                        margin-right: 20rpx;
                    }
                }
            }
        }
    }
}

.vs-divider {
    width: 60rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60rpx;

    .line {
        width: 2rpx;
        flex: 1;
        background-color: #f0f0f0;
        min-height: 100rpx;
    }

    .vs-text {
        padding: 20rpx 0;
    }
}
</style>