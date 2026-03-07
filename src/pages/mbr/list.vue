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
        <uni-swipe-action ref="swipeActionRef">
            <pro-pagination ref="listRef" :request="getMbrPaginationApi" v-slot="{ data }">
                <uni-list>
                    <uni-swipe-action-item v-for="item in data" :key="item.id" :rightOptions="rightOptions"
                        @click="e => handleClickActionItem(e, item)">
                        <uni-list-item :title="item.name" note="列表禁用状态2" @tap="handleTapItem(item)"></uni-list-item>
                    </uni-swipe-action-item>
                </uni-list>
            </pro-pagination>
        </uni-swipe-action>
        <pro-search-form v-model:visible="searchFormVisible" @reset="handleReset"
            @search="() => listRef.search(searchFormData)">
            <uni-forms label-position="top">
                <uni-row :gutter="36">
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
import { onMounted, ref } from 'vue';
import { deleteMbrApi, getMbrPaginationApi } from '@/api/mbr';


const swipeActionRef = ref()

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
]

const handleClickActionItem = (e, item) => {
    switch (e.content.action) {
        case 'edit':
            uni.navigateTo({
                url: '/pages/mbr/form?id=' + item.id
            }).then(() => {
                swipeActionRef.value?.closeAll()
            })
            break;

        case 'delete':
            uni.showModal({
                title: '提示',
                content: '是否删除',
                success: res => {
                    if (res.confirm) {
                        deleteMbrApi({
                            id: item.id
                        }).then(() => {
                            listRef.value?.refresh()
                        })
                    }
                }
            });
            break;
    }
}

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

const handleTapItem = (item) => {
    uni.navigateTo({
        url: '/pages/mbr/detail?id=' + item.id
    })
}
</script>