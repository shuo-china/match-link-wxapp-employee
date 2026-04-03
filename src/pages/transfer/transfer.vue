<template>
    <view class="container">
        <view v-if="data">
            <!-- 顶部背景 -->
            <view class="header-bg" :class="{ 'male-theme': data && data.gender === '1' }">
                <view class="bg-circle-1"></view>
                <view class="bg-circle-2"></view>

                <!-- 用户头部信息 -->
                <view class="user-header">
                    <view class="avatar-box">
                        <image v-if="data.albums?.length" class="avatar" :src="data.albums[0].path" mode="aspectFill">
                        </image>
                        <view v-else class="avatar default-avatar">
                            <uni-icons type="person-filled" size="70" color="#ccc"></uni-icons>
                        </view>
                    </view>
                    <view class="header-info">
                        <view class="name-row">
                            <text class="nickname">{{ data.age }}岁</text>
                            <view class="gender-icon" :class="data.gender === '1' ? 'male' : 'female'">
                                <uni-icons v-if="data.gender === '1'" font-family="iconfont" size="15"
                                    color="#fff">&#xe7e2;</uni-icons>
                                <uni-icons v-else font-family="iconfont" size="15" color="#fff">&#xe8f1;</uni-icons>
                            </view>
                        </view>
                        <view class="sub-info">
                            <text>{{ data.height + 'cm' }} · {{ data.education_text }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="content-wrapper">
                <!-- 基础资料卡片 -->
                <view class="info-card">
                    <view class="card-title">基础资料</view>
                    <view class="basic-info-grid">
                        <view class="info-tag" v-if="data.marital_status_text">
                            <uni-icons font-family="iconfont" size="18" color="#666">&#xe7df</uni-icons>
                            <text>{{ data.marital_status_text }}</text>
                        </view>
                        <view class="info-tag" v-if="data.job_text">
                            <uni-icons font-family="iconfont" size="18" color="#666">&#xe897</uni-icons>
                            <text>{{ data.job_text }}</text>
                        </view>
                        <view class="info-tag" v-if="data.annualIncome">
                            <uni-icons font-family="iconfont" size="18" color="#666">&#xe7cd</uni-icons>
                            <text>年收入{{ data.annualIncome }}万元</text>
                        </view>
                        <view class="info-tag" v-if="data.hasHouse">
                            <uni-icons font-family="iconfont" size="18" color="#666">&#xe7c6</uni-icons>
                            <text v-if="data.houseCount === 1">有房</text>
                            <text v-else>{{ data.houseCount }}套房</text>
                        </view>
                        <view class="info-tag" v-if="data.hasVehicle">
                            <uni-icons font-family="iconfont" size="18" color="#666">&#xe7d7</uni-icons>
                            <text>有车</text>
                        </view>
                        <view class="info-tag" v-if="data.familys">
                            <uni-icons font-family="iconfont" size="18" color="#666">&#xe7ae</uni-icons>
                            <text>{{ data.familys_text }}</text>
                        </view>
                        <view class="info-tag" v-if="data.permanentAddress?.length">
                            <uni-icons font-family="iconfont" size="18" color="#666">&#xe790</uni-icons>
                            <text>{{ data.permanentAddress[1] }} / {{ data.permanentAddress[2] }}</text>
                        </view>
                        <view class="info-tag" v-if="data.childrens_text">
                            <uni-icons font-family="iconfont" size="18" color="#666">&#xe783</uni-icons>
                            <text>{{ data.childrens_text }}</text>
                        </view>
                    </view>
                </view>

                <!-- 照片墙 -->
                <view class="photo-card" v-for="(item, index) in data.albums" :key="index">
                    <image class="photo" :src="item.path" mode="widthFix" @click="previewImage(index as number)">
                    </image>
                </view>
            </view>
        </view>
        <pro-loading v-else></pro-loading>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import { getMbrRoughDetailApi } from '@/api/mbr';
import { getShareMbrDetail } from '@/utils/share';

const data = ref<any>(null);

const previewImage = (index: number) => {
    if (data.value?.albums?.length) {
        uni.previewImage({
            urls: data.value.albums.map(item => item.path),
            current: data.value.albums[index].path
        })
    }
}

onLoad((options) => {
    if (options?.memberId) {
        getMbrRoughDetailApi({ id: options.memberId }).then((res) => {
            data.value = res;
        });
    }
});

onShareAppMessage(() => {
    return getShareMbrDetail(data.value)
})
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #f7f8fa;
    position: relative;

    .header-bg {
        // 使用 mine 页面同款渐变色
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);

        &.male-theme {
            background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
        }

        width: 100%;
        padding: 40px 20px 60px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;

        .bg-circle-1 {
            position: absolute;
            top: -50px;
            right: -50px;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            pointer-events: none;
        }

        .bg-circle-2 {
            position: absolute;
            bottom: -20px;
            left: -20px;
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            pointer-events: none;
        }

        .user-header {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 10;

            .avatar-box {
                margin-right: 16px;

                .avatar {
                    width: 85px;
                    height: 85px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.8);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

                    &.default-avatar {
                        background-color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }

            .header-info {
                flex: 1;
                color: #fff; // 保持白色字体以适应深色或渐变背景

                .name-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    line-height: 1;

                    .nickname {
                        font-size: 22px;
                        font-weight: bold;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }

                    .gender-icon {
                        margin-left: 12px;
                        width: 22px;
                        height: 22px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        backdrop-filter: blur(2px);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    }
                }

                .sub-info {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 4px 12px;
                    border-radius: 14px;
                    font-size: 13px;
                    backdrop-filter: blur(4px);

                    .divider {
                        margin: 0 4px;
                    }
                }
            }
        }
    }

    .content-wrapper {
        padding: 0 16px 30px;
        margin-top: -40px;
        position: relative;
        z-index: 10;
    }

    .info-card {
        background: #fff;
        border-radius: 20px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);

        .card-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 16px;
        }

        .basic-info-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            .info-tag {
                display: flex;
                align-items: center;
                background: #f5f6fa;
                padding: 8px 14px;
                border-radius: 12px;
                font-size: 13px;
                color: #000;
                font-weight: 500;

                uni-icons {
                    margin-right: 6px;
                }
            }
        }
    }

    .photo-card {
        background: #fff;
        border-radius: 20px;
        padding: 0;
        margin-bottom: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        overflow: hidden;

        &:last-child {
            margin-bottom: 0;
        }

        .photo {
            width: 100%;
            display: block;
        }
    }
}
</style>