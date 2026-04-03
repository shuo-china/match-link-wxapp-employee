<template>
    <view class="emp-list-page">
        <view class="filter-wrapper">
            <view class="filter-left">
                <button class="add-btn" @click="handleAdd">
                    <uni-icons type="plusempty" size="14" color="#ffffff"></uni-icons>
                    <text class="btn-text">添加红娘</text>
                </button>
            </view>
        </view>

        <view class="list-container">
            <uni-swipe-action ref="swipeActionRef">
                <pro-pagination ref="listRef" :request="getEmpPaginationApi" v-slot="{ data }">
                    <view class="list-wrapper">
                        <uni-swipe-action-item v-for="item in data" :key="item.id"
                            :rightOptions="item.is_super === 1 ? rightOptionsWithoutDelete : rightOptions"
                            @click="e => handleClickActionItem(e, item)" class="swipe-item">
                            <view class="emp-card" @tap="handleTapItem(item)">
                                <view class="card-avatar">
                                    <image v-if="item.avatar?.length && item.avatar[0]?.path" :src="item.avatar[0].path"
                                        class="avatar-image" mode="aspectFill" />
                                    <uni-icons v-else type="person-filled" size="28" color="#c0c4cc"></uni-icons>
                                </view>
                                <view class="card-content">
                                    <view class="card-title">{{ item.nickname }}</view>
                                    <view class="card-subtitle">
                                        <text class="phone-text">{{ item.mobile }}</text>
                                    </view>
                                </view>
                            </view>
                        </uni-swipe-action-item>
                    </view>
                    <view class="empty-wrapper" v-if="!data?.length">
                        <uni-icons type="info" size="36" color="#dcdfe6"></uni-icons>
                        <view class="empty-tip">暂无红娘数据</view>
                    </view>
                </pro-pagination>
            </uni-swipe-action>
        </view>

    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { deleteEmpApi, getEmpPaginationApi } from '@/api/employee';
import { useEmployeeStore } from '@/stores/employee';

const swipeActionRef = ref();
const listRef = ref();

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
];

const rightOptionsWithoutDelete = [
    {
        action: 'edit',
        text: '编辑',
        style: {
            color: '#fff',
            backgroundColor: '#2979ff'
        }
    }
];

const employeeStore = useEmployeeStore();
const refresh = (data) => {
    listRef.value?.refresh();
    if (data && data.id && Number(data.id) === employeeStore.employeeInfo?.id) {
        employeeStore.getEmployeeInfo();
    }
}

const handleAdd = () => {
    uni.navigateTo({
        url: '/pages/emp/form',
        events: {
            refresh,
            toast(data) {
                uni.showToast(data)
            }
        }
    });
};

const handleTapItem = (item) => {
    uni.navigateTo({
        url: '/pages/emp/detail?id=' + item.id
    });
};

const handleClickActionItem = (e, item) => {
    switch (e.content.action) {
        case 'edit':
            uni.navigateTo({
                url: '/pages/emp/form?id=' + item.id,
                events: {
                    refresh,
                    toast(data) {
                        uni.showToast(data)
                    }
                }
            }).then(() => {
                swipeActionRef.value?.closeAll();
            });
            break;

        case 'delete':
            if (item.is_super === 1) {
                uni.showToast({
                    title: '超级管理员不能删除',
                    icon: 'none'
                });
                return;
            }
            uni.showModal({
                title: '提示',
                content: '是否删除',
                success: res => {
                    if (res.confirm) {
                        deleteEmpApi({
                            id: item.id
                        }).then(() => {
                            listRef.value?.refresh();
                        });
                    }
                }
            });
            break;
    }
};
</script>

<style lang="scss" scoped>
.emp-list-page {
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
    padding: 24rpx;
    box-sizing: border-box;
}

.list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

:deep(.swipe-item) {
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.emp-card {
    background-color: #fff;
    padding: 32rpx 24rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
}

.card-avatar {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    background-color: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: block;
}

.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    overflow: hidden;
}

.card-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-subtitle {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 26rpx;
    color: #666;

    .phone-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.empty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;
    gap: 16rpx;

    .empty-tip {
        color: #999;
        font-size: 28rpx;
    }
}
</style>