<template>
    <view class="container">
        <pro-load-more ref="listRef" :request="getUserPaginationApi" v-slot="{ data }">
            <view class="user-list">
                <view class="user-card" v-for="item in data" :key="item.id">
                    <view class="card-header">
                        <text class="user-mobile">{{ item.mobile }}</text>
                    </view>
                    <view class="card-body">
                        <view class="info-row">
                            <text class="label">注册时间：</text>
                            <text class="value">{{ item.create_time }}</text>
                        </view>
                    </view>
                </view>

            </view>
        </pro-load-more>
    </view>
</template>

<script setup lang="ts">
import { getUserPaginationApi } from '@/api/user';

</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.user-list {
    padding: 12px;
}

.user-card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.99);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;

        .user-mobile {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
    }

    .card-body {
        .info-row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.5;

            &:last-child {
                margin-bottom: 0;
            }

            .label {
                color: #909399;
                width: 70px;
                /* 固定宽度，对齐 */
                flex-shrink: 0;
            }

            .value {
                color: #606266;
                flex: 1;
                word-break: break-all;
            }
        }
    }
}
</style>