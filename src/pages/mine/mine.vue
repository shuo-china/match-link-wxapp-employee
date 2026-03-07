<template>
    <view class="container">
        <view class="header">
            <view class="user-info">
                <image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
                <text class="nickname">Hello, {{ employeeInfo?.nickname }}</text>
            </view>
        </view>

        <view class="menu">
            <view class="menu-item" @click="handleUnbind">
                <text>解除绑定</text>
                <uni-icons type="right" size="20" color="#999"></uni-icons>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { useEmployeeStore } from '@/stores/employee';
import { storeToRefs } from 'pinia';

const employeeStore = useEmployeeStore();
const { employeeInfo } = storeToRefs(employeeStore);

const handleUnbind = () => {
    uni.showModal({
        title: '提示',
        content: '确定要解除绑定吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    await employeeStore.unBindMobile();
                    uni.reLaunch({ url: '/pages/login/login' });
                } catch (error) {
                    uni.showToast({
                        title: '解除绑定失败',
                        icon: 'none'
                    });
                }
            }
        }
    });
};
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.header {
    background-color: #764c24;
    padding: 40px 20px;
    color: white;

    .user-info {
        display: flex;
        align-items: center;

        .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 15px;
            background-color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .nickname {
            font-size: 18px;
            font-weight: bold;
        }
    }
}

.menu {
    overflow: hidden;
    margin: 20px 15px;
    padding: 0 15px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        font-size: 16px;
        color: #333;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }
    }
}
</style>