<template>
    <view class="date-list-page">
        <view class="filter-wrapper">
            <view class="filter-left">
                <button class="add-btn" @click="handleAdd">
                    <uni-icons type="plusempty" size="14" color="#ffffff"></uni-icons>
                    <text class="btn-text">添加约会记录</text>
                </button>
            </view>
        </view>

        <view class="list-container">
            <uni-swipe-action ref="swipeActionRef">
                <pro-pagination ref="listRef" :request="getDatePaginationApi" v-slot="{ data }">
                    <view class="record-item" v-for="item in data" :key="item.id">
                        <uni-swipe-action-item :rightOptions="rightOptions"
                            @click="e => handleClickActionItem(e, item)">
                            <view @tap="handleTapItem(item)">
                                <view class="record-header">
                                    <text class="time">约会时间：{{ item.date_time }}</text>
                                </view>

                                <view class="member-pair">
                                    <view class="member-info">
                                        <image class="avatar" :src="item.male_member?.cover?.path" mode="aspectFill">
                                        </image>
                                        <view class="info-details">
                                            <view class="name">{{ item.male_member?.name }}</view>
                                        </view>
                                    </view>
                                    <view class="vs-icon">
                                        <uni-icons type="heart-filled" size="24" color="#ff4d4f"></uni-icons>
                                    </view>
                                    <view class="member-info right" style="justify-content: flex-end;">
                                        <view class="info-details" style="text-align: right; padding-right: 20rpx;">
                                            <view class="name">{{ item.female_member?.name }}</view>
                                        </view>
                                        <image class="avatar" style="margin-right: 0;"
                                            :src="item.female_member?.cover?.path" mode="aspectFill"></image>
                                    </view>
                                </view>

                                <view class="chat-eval-container"
                                    v-if="item.man_to_woman_level || item.woman_to_man_level">
                                    <view class="eval-bubble left-bubble" v-if="item.man_to_woman_level">
                                        <text class="bubble-label">他对她：</text>
                                        <text class="bubble-value" :class="'text-level-' + item.man_to_woman_level">{{
                                            item.man_to_woman_level_text }}</text>
                                    </view>
                                    <view class="eval-bubble right-bubble" v-if="item.woman_to_man_level">
                                        <text class="bubble-label">她对他：</text>
                                        <text class="bubble-value" :class="'text-level-' + item.woman_to_man_level">{{
                                            item.woman_to_man_level_text }}</text>
                                    </view>
                                </view>
                                <view class="remark" v-if="item.remark">
                                    备注：{{ item.remark }}
                                </view>
                            </view>
                        </uni-swipe-action-item>
                    </view>
                    <view class="empty-tip" v-if="!data?.length">暂无约会记录</view>
                </pro-pagination>
            </uni-swipe-action>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { deleteDateApi, getDatePaginationApi } from '@/api/date';
import { onShow } from '@dcloudio/uni-app';

const swipeActionRef = ref()
const listRef = ref()

const rightOptions = [
    {
        action: 'edit',
        text: '编辑',
        style: {
            color: '#fff',
            backgroundColor: '#2979ff'
        }
    },
    {
        action: 'delete',
        text: '删除',
        style: {
            color: '#fff',
            backgroundColor: '#e43d33',
        }
    }
]

const handleAdd = () => {
    uni.navigateTo({
        url: '/pages/date/form'
    });
}

const handleTapItem = (item) => {
    uni.navigateTo({
        url: '/pages/date/detail?id=' + item.id
    })
}

const handleClickActionItem = (e, item) => {
    switch (e.content.action) {
        case 'edit':
            uni.navigateTo({
                url: '/pages/date/form?id=' + item.id
            }).then(() => {
                swipeActionRef.value?.closeAll()
            })
            break;

        case 'delete':
            uni.showModal({
                title: '提示',
                content: '是否删除',
                success: res => {
                    if (res.confirm) {
                        deleteDateApi({
                            id: item.id
                        }).then(() => {
                            listRef.value?.refresh()
                        })
                    }
                }
            });
            break;
    }
}

let flag = false
onShow(() => {
    if (!flag) {
        flag = true
        return
    }
    listRef.value?.refresh()
})
</script>

<style lang="scss" scoped>
.date-list-page {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.filter-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-bottom: 8px;
    position: sticky;
    top: 0;
    z-index: 99;
}

.add-btn {
    margin: 0;
    font-size: 13px;
    background-color: #2979ff;
    color: #fff;
    border-radius: 100px;
    padding: 0 14px;
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
        border: none;
    }
}

.list-container {
    padding: 20rpx;
}

.record-item {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
}

.record-header {
    margin-bottom: 24rpx;
    border-bottom: 1rpx dashed #eee;
    padding-bottom: 16rpx;
}

.time {
    font-size: 26rpx;
    color: #666;
}

.member-pair {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.member-info {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
}

.avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 4px;
    margin-right: 20rpx;
    background-color: #eee;
    flex-shrink: 0;
}

.info-details {
    flex: 1;
    overflow: hidden;
}

.name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
}

.chat-eval-container {
    margin-top: 18rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 16rpx;
}

.eval-bubble {
    display: inline-flex;
    align-items: center;
    padding: 12rpx 24rpx;
    font-size: 24rpx;
    max-width: 48%;
    position: relative;
}

.left-bubble {
    background-color: #f0f7ff;
    border-radius: 4rpx 30rpx 30rpx 30rpx;
}

.right-bubble {
    margin-left: auto;
    background-color: #fff0f6;
    border-radius: 30rpx 4rpx 30rpx 30rpx;
}

.bubble-label {
    color: #666;
}

.bubble-value {
    font-weight: bold;
}

.text-level-1 {
    color: #ff4d4f;
}

.text-level-2 {
    color: #faad14;
}

.text-level-3 {
    color: #52c41a;
}

.vs-icon {
    padding: 0 20rpx;
}

.remark {
    font-size: 26rpx;
    color: #666;
    margin-top: 16rpx;
}

.empty-tip {
    text-align: center;
    color: #999;
    font-size: 28rpx;
    padding: 40rpx 0;
}
</style>