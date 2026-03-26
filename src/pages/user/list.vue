<template>
    <view class="container">
        <pro-load-more ref="listRef" :request="getUserPaginationApi" v-slot="{ data }">
            <view class="user-list">
                <view class="user-card" v-for="item in data" :key="item.id">
                    <!-- Header -->
                    <view class="card-header">
                        <view class="user-info">
                            <view class="phone-icon-wrapper">
                                <uni-icons type="phone-filled" size="22" color="#165DFF"></uni-icons>
                            </view>
                            <text class="user-mobile">{{ item.mobile }}</text>
                        </view>
                    </view>

                    <!-- Body -->
                    <view class="card-body">
                        <view class="stats-container">
                            <view class="stat-item">
                                <text class="stat-label">注册时间</text>
                                <text class="stat-value">{{ item.create_time }}</text>
                            </view>
                            <view class="stat-divider"></view>
                            <view class="stat-item">
                                <text class="stat-label">最后登录</text>
                                <text class="stat-value">{{ item.last_login_time }}</text>
                            </view>
                        </view>

                        <!-- Members Section -->
                        <view class="members-section">
                            <view class="section-title">
                                <text class="title-text">收藏会员</text>
                                <text class="count-text" v-if="item.members?.length">{{ item.members.length }}人</text>
                            </view>
                            <view class="members-content">
                                <scroll-view scroll-x class="members-scroll"
                                    v-if="item.members && item.members.length > 0">
                                    <view class="members-list">
                                        <view class="member-item" v-for="member in item.members" :key="member.id"
                                            @click.stop="goToMemberDetail(member.id)">
                                            <image class="member-avatar"
                                                :src="member.cover?.path || '/static/default_avatar.png'"
                                                mode="aspectFill"></image>
                                            <text class="member-name">{{ member.name }}</text>
                                        </view>
                                    </view>
                                </scroll-view>
                                <view v-else class="empty-state">
                                    <text class="empty-text">暂无收藏记录</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </pro-load-more>
    </view>
</template>

<script setup lang="ts">
import { getUserPaginationApi } from '@/api/user';

const goToMemberDetail = (id: number | string) => {
    uni.navigateTo({
        url: `/pages/mbr/detail?id=${id}`
    });
};
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #F4F6F8;
}

.user-list {
    padding: 16px;
}

.user-card {
    background-color: #ffffff;
    border-radius: 20px;
    padding: 0;
    margin-bottom: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    overflow: hidden;

    &:last-child {
        margin-bottom: 0;
    }

    .card-header {
        padding: 20px 20px 16px;
        background: linear-gradient(135deg, #F9FBFF 0%, #F0F5FF 100%);
        border-bottom: 1px solid #F0F4F8;

        .user-info {
            display: flex;
            align-items: center;

            .phone-icon-wrapper {
                width: 36px;
                height: 36px;
                background-color: #E8F3FF;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
            }

            .user-mobile {
                font-size: 18px;
                font-weight: 600;
                color: #1D2129;
                font-family: 'DIN Alternate', -apple-system, sans-serif;
                letter-spacing: 0.5px;
            }
        }
    }

    .card-body {
        padding: 20px;

        .stats-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #F8FAFC;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;

            .stat-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;

                .stat-label {
                    font-size: 12px;
                    color: #86909C;
                    margin-bottom: 6px;
                }

                .stat-value {
                    font-size: 14px;
                    color: #1D2129;
                    font-weight: 500;
                }
            }

            .stat-divider {
                width: 1px;
                height: 24px;
                background-color: #E5E6EB;
            }
        }

        .members-section {
            .section-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;

                .title-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4E5969;
                    position: relative;
                    padding-left: 10px;

                    &::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 3px;
                        height: 12px;
                        background-color: #165DFF;
                        border-radius: 2px;
                    }
                }

                .count-text {
                    font-size: 12px;
                    color: #86909C;
                    background-color: #F2F3F5;
                    padding: 2px 8px;
                    border-radius: 10px;
                }
            }

            .members-content {
                .members-scroll {
                    width: 100%;
                    white-space: nowrap;

                    .members-list {
                        display: inline-flex;
                        padding: 4px 0 8px;
                    }

                    .member-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-right: 16px;
                        width: 56px;

                        &:last-child {
                            margin-right: 0;
                        }

                        .member-avatar {
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            background-color: #F2F3F5;
                            margin-bottom: 8px;
                            border: 2px solid #fff;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                            transition: transform 0.2s;

                            &:active {
                                transform: scale(0.95);
                            }
                        }

                        .member-name {
                            font-size: 12px;
                            color: #4E5969;
                            text-align: center;
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }

                .empty-state {
                    padding: 16px 0;
                    text-align: center;
                    background-color: #F8FAFC;
                    border-radius: 8px;
                    border: 1px dashed #E5E6EB;

                    .empty-text {
                        font-size: 13px;
                        color: #C9CDD4;
                    }
                }
            }
        }
    }
}
</style>