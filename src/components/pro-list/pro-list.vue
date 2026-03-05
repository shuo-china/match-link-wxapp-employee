<template>
    <uni-list>
        <slot :data="data"></slot>
    </uni-list>
    <view class="load-more">
        <uni-load-more :status="loadMoreStatus"></uni-load-more>
    </view>
</template>

<script setup lang="ts">
import usePagination, { PaginationOptions } from '@/hooks/usePagination';
import { Service } from '@/hooks/useRequest/type';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    request: Service<any, any>
    requestOptions?: PaginationOptions;
}>(), {
    requestOptions: () => ({}),
})

const { data, loading, search, reset, isLastPage } =
    usePagination(props.request, props.requestOptions);


const loadMoreStatus = computed(() => {
    if (loading.value) {
        return 'loading';
    }
    if (isLastPage.value) {
        return 'nomore';
    }
    return 'more';
})

const _expose = {
    search,
    reset,
};

defineExpose(_expose);
</script>

<style lang="scss" scoped>
.load-more {
    padding: 8px 0;
}
</style>