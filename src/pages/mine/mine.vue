<template>
    <view class="container">
        <view class="header">
            <view class="brand-info">
                <view class="logo-wrapper">
                    <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
                </view>
            </view>
        </view>

        <view class="menu">
            <view class="menu-item" @click="handleUnbind">
                <view class="menu-left">
                    <text class="menu-text">解除绑定</text>
                </view>
                <uni-icons type="right" size="16" color="#ccc"></uni-icons>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { useEmployeeStore } from '@/stores/employee';

const employeeStore = useEmployeeStore();

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
    background-color: #f8f8f8;
}

.header {
    background: linear-gradient(135deg, #8a5a2a 0%, #764c24 100%);
    padding: 50px 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .brand-info {
        display: flex;
        flex-direction: column;
        align-items: center;

        .logo-wrapper {
            width: 130px;
            height: 130px;
            background-color: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 2px solid rgba(255, 255, 255, 0.8);
            overflow: hidden;

            .logo {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
}

.menu {
    margin: -20px 15px 20px;
    padding: 0 15px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 10;

    .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }

        .menu-left {
            display: flex;
            align-items: center;

            .menu-text {
                font-size: 16px;
                color: #333;
                font-weight: 500;
            }
        }
    }
}
</style>