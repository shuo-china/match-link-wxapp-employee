<template>
    <view>
        <view class="filter-wrapper">
            <view class="filter-left">共 {{ listRef?.total || 0 }} 条数据</view>
            <view class="divider"></view>
            <view class="filter-right" @tap="searchFormVisible = true">筛选</view>
        </view>
        <uni-swipe-action ref="swipeActionRef">
            <pro-pagination ref="listRef" :request="getMbrPaginationApi" v-slot="{ data }">
                <uni-list>
                    <uni-swipe-action-item v-for="item in data" :key="item.id" :rightOptions="rightOptions"
                        @click="e => handleClickActionItem(e, item)">
                        <uni-list-item :thumb="item.cover?.path" thumb-size="lg" @tap=" handleTapItem(item)">
                            <template #body>
                                <view class="item-body">
                                    <view class="item-body-header">
                                        <text class="item-body-name">{{ item.name }}</text>
                                        <view class="item-body-gender" size="small"
                                            :class="item.gender === '1' ? 'item-body-man' : 'item-body-woman'">
                                            {{ item.age + '岁' }}
                                        </view>
                                    </view>
                                    <view class="item-body-footer item-body-desc">
                                        <text>{{ item.height + 'cm' }} / {{
                                            item.education_text }} / {{ item.marital_status_text }} / </text>
                                        <text>年收{{ item.annualIncome + '万元' }} / </text>
                                        <text v-if="item.hasHouse">有{{ item.houseCount }}套房 / </text>
                                        <text v-else>无房 / </text>
                                        <text>{{ item.hasVehicle ? '有车' : '无车' }}</text>
                                    </view>
                                </view>
                            </template>
                        </uni-list-item>
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
                    <uni-col :span="12">
                        <uni-forms-item label="学历" name="education">
                            <uni-data-select v-model="searchFormData.education" :localdata="dict?.education"
                                :multiple="true" />
                        </uni-forms-item>
                    </uni-col>
                    <uni-col :span="12">
                        <uni-forms-item label="婚姻" name="marital_status">
                            <uni-data-select v-model="searchFormData.maritalStatus" :localdata="dict?.marital_status"
                                :multiple="true" />
                        </uni-forms-item>
                    </uni-col>
                    <uni-col :span="24">
                        <uni-forms-item label="年龄" name="age" label-position="left">
                            <pro-slider-range v-model="searchFormData.age" :show-value="true" :min-unlimited="true"
                                :max-unlimited="true" :min=15 :max="60" :value-formatter="(v) => v + '岁'" />
                        </uni-forms-item>
                    </uni-col>
                    <uni-col :span="24">
                        <uni-forms-item label="身高" name="height" label-position="left">
                            <pro-slider-range v-model="searchFormData.height" :show-value="true" :min-unlimited="true"
                                :max-unlimited="true" :min=140 :max="200" :value-formatter="(v) => v + 'cm'" />
                        </uni-forms-item>
                    </uni-col>
                </uni-row>
            </uni-forms>
        </pro-search-form>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { deleteMbrApi, getMbrPaginationApi } from '@/api/mbr';
import { onShow } from '@dcloudio/uni-app';
import useDict from '@/hooks/useDict';

const { dict } = useDict(['education', 'marital_status'])

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
    mobile: '',
    age: [null, null],
    height: [null, null],
    education: [],
    maritalStatus: []
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

let flag = false
onShow(() => {
    if (!flag) {
        flag = true
        return
    }
    listRef.value?.refresh()
})
</script>

<style lang="scss" scoped>
.filter-wrapper {
    display: flex;
    justify-content: space-around;
    font-size: 13px;
    color: #555;

    .filter-left {
        padding: 12px 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .filter-right {
        padding: 12px 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .divider {
        flex: 0 0 auto;
        width: 1px;
        background-color: rgba(0, 0, 0, 0.1);
    }
}

.item-body {
    flex: 1;
    display: flex;
    flex-direction: column;

    &-header {
        display: flex;
        align-items: center;
        column-gap: 10px;
        min-width: 0;

        .item-body-name {
            flex: 1;
            min-width: 0;
            font-size: 15px;
            color: #3b4144;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .item-body-gender {
            flex: 0 0 auto;
            font-size: 12px;
            padding: 1px 4px;
            line-height: 1;
            white-space: nowrap;
            border-radius: 4px;
            border-width: 1px;
            border-style: solid;
        }

        .item-body-man {
            color: #2979ff;
            border-color: #2979ff;
        }

        .item-body-woman {
            color: #e43d33;
            border-color: #e43d33;
        }
    }

    &-footer {
        margin-top: 8px;
    }

    &-desc {
        font-size: 13px;
        color: #999;
    }
}
</style>