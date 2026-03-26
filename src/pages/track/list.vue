<template>
    <view class="track-list-page">
        <view class="filter-wrapper">
            <view class="filter-left">
                <button class="add-btn" @click="handleAdd">
                    <uni-icons type="plusempty" size="14" color="#ffffff"></uni-icons>
                    <text class="btn-text">添加跟进记录</text>
                </button>
            </view>
            <view class="divider"></view>
            <view class="filter-right" @tap="searchFormVisible = true">
                <uni-icons type="settings-filled" size="16" color="#666"></uni-icons>
                <text class="filter-text">筛选</text>
            </view>
        </view>

        <view class="list-container">
            <uni-swipe-action ref="swipeActionRef">
                <pro-pagination ref="listRef" :request="getTrackPaginationApi" v-slot="{ data }">
                    <view class="record-item" v-for="item in data" :key="item.id">
                        <uni-swipe-action-item :rightOptions="rightOptions"
                            @click="e => handleClickActionItem(e, item)">
                            <view @tap="handleTapItem(item)">
                                <view class="record-header">
                                    <text class="time">跟进时间：{{ item.create_time }}</text>
                                    <view class="willingness" :class="getIntentionClass(item.intention)">
                                        {{ item.intention_text }}
                                    </view>
                                </view>

                                <view class="member-info-wrapper">
                                    <view class="member-info">
                                        <image class="avatar" :src="item.member?.cover?.path" mode="aspectFill"></image>
                                        <view class="info-details">
                                            <view class="name-row">
                                                <text class="name">{{ item.member?.name }}</text>
                                                <view class="tags">
                                                    <text class="tag"
                                                        :class="item.member?.gender === '1' ? 'gender-man' : 'gender-woman'">
                                                        {{ item.member?.age }}岁
                                                    </text>
                                                    <text class="tag" v-if="item.member?.job_text">{{
                                                        item.member?.job_text }}</text>
                                                </view>
                                            </view>
                                            <view class="matchmaker-row">
                                                <view class="info-item">
                                                    <text class="label">跟进红娘：</text>
                                                    <text class="value">{{ item.employee?.nickname || '-' }}</text>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                    <view class="remark-box">
                                        <text class="value remark-text">{{ item.remark || '暂无备注' }}</text>
                                    </view>
                                </view>
                            </view>
                        </uni-swipe-action-item>
                    </view>
                    <view class="empty-tip" v-if="!data?.length">暂无跟进记录</view>
                </pro-pagination>
            </uni-swipe-action>
        </view>

        <pro-search-form v-model:visible="searchFormVisible" @reset="handleReset"
            @search="() => listRef.search(searchFormData)">
            <uni-forms label-position="top">
                <uni-row :gutter="36">
                    <uni-col :span="12">
                        <uni-forms-item label="会员姓名" name="name">
                            <uni-easyinput v-model="searchFormData.name" type="text" placeholder="请输入会员姓名" />
                        </uni-forms-item>
                    </uni-col>
                    <uni-col :span="12">
                        <uni-forms-item label="会员手机号" name="mobile">
                            <uni-easyinput v-model="searchFormData.mobile" type="text" placeholder="请输入会员手机号" />
                        </uni-forms-item>
                    </uni-col>
                    <uni-col :span="24">
                        <uni-forms-item label="付费意向" name="intention">
                            <uni-data-select v-model="searchFormData.intention" :localdata="dict?.purchase_intention"
                                :multiple="true" />
                        </uni-forms-item>
                    </uni-col>
                </uni-row>
            </uni-forms>
        </pro-search-form>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { deleteTrackApi, getTrackPaginationApi } from '@/api/track';
import { onShow } from '@dcloudio/uni-app';
import useDict from '@/hooks/useDict';
const { dict } = useDict(['purchase_intention'])

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

const searchFormVisible = ref(false)
const getInitialSearchFormData = () => ({
    name: '',
    mobile: '',
    intention: []
})
const searchFormData = ref(getInitialSearchFormData())

const getIntentionClass = (value) => {
    const intention = Number(value)
    if (intention === 3) return 'high'
    if (intention === 2) return 'medium'
    return 'low'
}

const handleAdd = () => {
    uni.navigateTo({
        url: '/pages/track/form'
    });
}

const handleTapItem = (item) => {
    uni.navigateTo({
        url: '/pages/mbr/detail?id=' + item.member_id
    })
}

const handleReset = () => {
    searchFormData.value = getInitialSearchFormData()
    listRef.value?.search(searchFormData.value)
}

const handleClickActionItem = (e, item) => {
    switch (e.content.action) {
        case 'edit':
            uni.navigateTo({
                url: '/pages/track/form?id=' + item.id
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
                        deleteTrackApi({
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
.track-list-page {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.filter-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #666;
    background-color: #ffffff;
    padding: 12px 16px;
    position: sticky;
    top: 0;
    z-index: 99;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-bottom: 8px;

    .filter-left {
        flex: 1;
        display: flex;
        align-items: center;
    }

    .filter-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-left: 16px;

        .filter-text {
            margin-left: 4px;
        }
    }

    .divider {
        height: 14px;
        width: 1px;
        background-color: #e5e5e5;
    }
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

    .btn-text {
        margin-left: 2px;
    }
}

.list-container {
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
    color: #52c41a;
    background-color: #f6ffed;
}

.willingness.medium {
    color: #faad14;
    background-color: #fffbe6;
}

.willingness.low {
    color: #999999;
    background-color: #f5f5f5;
}

.member-info-wrapper {
    display: flex;
    flex-direction: column;
}

.member-info {
    display: flex;
    align-items: center;
}

.avatar {
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
    margin-right: 24rpx;
    flex-shrink: 0;
    background-color: #f5f5f5;
    border: 2rpx solid #f0f0f0;
}

.info-details {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.name-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
}

.matchmaker-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 12rpx;
}

.tags {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;
}

.tag {
    font-size: 22rpx;
    color: #666;
    background-color: #f5f5f5;
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
    flex-shrink: 0;
}

.tag.gender-man {
    color: #2979ff;
    background-color: #eaf3ff;
}

.tag.gender-woman {
    color: #e43d33;
    background-color: #ffefee;
}

.remark-box {
    background-color: #fafafa;
    border-radius: 8rpx;
    padding: 16rpx;
    display: flex;
    align-items: flex-start;
    border: 1px solid #f0f0f0;
    margin-top: 20rpx;
    font-size: 24rpx;
    line-height: 1.4;
}

.remark-box .value {
    color: #333;
    flex: 1;
    word-break: break-all;
    text-align: justify;
}

.remark-box .remark-text {
    color: #666;
}

.info-item {
    display: flex;
    font-size: 24rpx;
    align-items: center;
}

.info-item .label {
    color: #999;
    flex-shrink: 0;
}

.info-item .value {
    color: #333;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.empty-tip {
    text-align: center;
    color: #999;
    font-size: 28rpx;
    padding: 40rpx 0;
}
</style>