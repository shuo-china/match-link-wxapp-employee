<template>
    <view class="container">
        <view v-if="data">
            <uni-section title="基础信息" type="line">
                <uni-card margin="0 12px 6px" spacing="0" padding="0 8px">
                    <uni-list :border="false" class="list-wrapper">
                        <uni-list-item title="昵称" :rightText="data.nickname || '-'" />
                        <uni-list-item title="手机号" :rightText="data.mobile || '-'" />
                        <uni-list-item v-if="data.create_time" title="创建时间" :rightText="data.create_time" />
                    </uni-list>
                </uni-card>
            </uni-section>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { getEmpDetailApi } from '@/api/employee';
import useRequest from '@/hooks/useRequest';

const { run, data } = useRequest(getEmpDetailApi, {
    manual: true
});

onLoad((options) => {
    if (options?.id) {
        uni.showLoading({
            title: '加载中'
        });
        run({
            id: options.id
        }).finally(() => {
            uni.hideLoading();
        });
    }
});
</script>

<style lang="scss" scoped>
.container {
    padding-bottom: 12px;

    .list-wrapper {
        :deep(.uni-list-item__extra-text) {
            color: #333;
            font-size: 14px;
        }

        :deep(.uni-list-item__content) {
            flex: 1 0 auto;
        }
    }
}
</style>