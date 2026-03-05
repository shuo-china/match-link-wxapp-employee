<template>
    <view>
        <!-- <uni-list>
            <uni-list-item title="列表文字1" note="列表禁用状态1"
                thumb="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" thumb-size="lg"
                rightText="rightText" to="/pages/mbr/detail"></uni-list-item>
            <uni-list-item title="列表文字2" note="列表禁用状态2"></uni-list-item>
            <uni-list-item title="列表文字3" note="列表禁用状态3"></uni-list-item>
        </uni-list> -->

        <button @tap="searchFormVisible = true">筛选</button>
        <pro-list ref="listRef" :request="getMbrPaginationApi" v-slot="{ data }">
            <uni-list-item v-for="item in data" :key="item.id" :title="item.name" note="列表禁用状态2"></uni-list-item>
        </pro-list>
        <pro-search-form v-model:visible="searchFormVisible" @reset="handleReset"
            @search="() => listRef.search(searchFormData)">
            <uni-forms label-position="top">
                <uni-row :gutter="48">
                    <uni-col :span="12">
                        <uni-forms-item label="姓名" name="name">
                            <uni-easyinput v-model="searchFormData.name" type="text" placeholder="请输入姓名" />
                        </uni-forms-item>
                    </uni-col>
                    <uni-col :span="12">
                        <uni-forms-item label="手机号" name="mobile">
                            <uni-easyinput v-model="searchFormData.mobile" type="text" placeholder="请输入手机号" />
                        </uni-forms-item>
                    </uni-col>
                </uni-row>

            </uni-forms>
        </pro-search-form>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getMbrPaginationApi } from '@/api/mbr';

const listRef = ref()

const searchFormVisible = ref(false)
const getInitialSearchFormData = () => ({
    name: '',
    mobile: ''
})
const searchFormData = ref(getInitialSearchFormData())

const handleReset = () => {
    searchFormData.value = getInitialSearchFormData()
    listRef.value?.search(searchFormData.value)
}
</script>