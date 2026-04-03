<template>
    <view class="login-container">
        <view class="logo-section">
            <image class="logo" src="/static/logo.png" mode="aspectFit" />
            <view class="title">徐州大胆恋爱员工端</view>
            <view class="subtitle">仅限内部人员使用</view>
        </view>

        <view class="btn-wrapper">
            <button type="primary" open-type="getPhoneNumber" @getphonenumber="login" :loading="loading"
                :disabled="loading">
                手机号快捷登录
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useEmployeeStore } from "@/stores/employee";

const employeeStore = useEmployeeStore()

const loading = ref(false)
const login = (e) => {
    if (e.detail.code) {
        loading.value = true
        employeeStore.bindMobile(e.detail.code).then(() => {
            uni.reLaunch({
                url: "/pages/home/home"
            })
        }).finally(() => {
            loading.value = false
        })
    }
}
</script>

<style lang="scss" scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 24px 0;
    box-sizing: border-box;
    background-color: #fff;

    .logo-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
        letter-spacing: 2px;

        .logo {
            width: 180px;
        }

        .title {
            font-size: 22px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }

        .subtitle {
            font-size: 14px;
            color: #999;
        }
    }

    .btn-wrapper {
        width: 100%;
    }
}
</style>