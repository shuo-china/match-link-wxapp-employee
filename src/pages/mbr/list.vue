<template>
    <view>
        <view class="filter-wrapper">
            <view class="filter-left">共 <text class="highlight">{{ listRef?.total || 0 }}</text> 条数据</view>
            <view class="divider"></view>
            <view class="filter-right" @tap="searchFormVisible = true">
                <uni-icons type="settings-filled" size="16" color="#666"></uni-icons>
                <text class="filter-text">筛选</text>
            </view>
        </view>
        <uni-swipe-action ref="swipeActionRef">
            <pro-pagination ref="listRef" :request="getMbrPaginationApi" v-slot="{ data }">
                <uni-list>
                    <uni-swipe-action-item v-for="item in data" :key="item.id" :rightOptions="rightOptions"
                        @click="e => handleClickActionItem(e, item)">
                        <uni-list-item @tap="handleTapItem(item)">
                            <template #header>
                                <image v-if="item.cover?.path" class="item-avatar" :src="item.cover?.path"
                                    mode="aspectFill"></image>
                                <view v-else class="item-avatar avatar-placeholder">
                                    <uni-icons type="person-filled" size="40" color="#c0c4cc"></uni-icons>
                                </view>
                            </template>
                            <template #body>
                                <view class="item-body">
                                    <view class="item-body-header">
                                        <text class="item-body-name">{{ item.name }}</text>
                                        <view class="item-body-info">
                                            <text :class="item.gender === '1' ? 'gender-man' : 'gender-woman'">{{
                                                item.age }}岁</text>
                                            <text> · {{ item.height }}cm · {{ item.education_text }}</text>
                                        </view>
                                    </view>
                                    <view class="item-body-footer item-body-desc">
                                        <text class="tag">{{ item.marital_status_text }}</text>
                                        <text class="tag">年收{{ item.annualIncome + '万元' }}</text>
                                        <text class="tag" v-if="item.hasHouse">有{{ item.houseCount }}套房</text>
                                        <text class="tag" v-else>无房</text>
                                        <text class="tag">{{ item.hasVehicle ? '有车' : '无车' }}</text>
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
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #666;
    background-color: #ffffff;
    padding: 12px 16px;
    position: sticky;
    top: 0;
    z-index: 99;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-bottom: 8px;

    .filter-left {
        flex: 1;
        display: flex;
        align-items: center;

        .highlight {
            color: #2979ff;
            font-weight: bold;
            margin: 0 4px;
        }
    }

    .filter-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-left: 16px;

        .filter-text {
            margin-left: 4px;
        }
    }

    .divider {
        height: 14px;
        width: 1px;
        background-color: #e5e5e5;
    }
}

.item-avatar {
    vertical-align: top;
    width: 55px;
    height: 55px;
    border-radius: 4px;
    margin-right: 12px;
    background-color: #f5f7fa;
    flex-shrink: 0;
}

.avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .item-body-name {
            font-size: 15px;
            font-weight: 600;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 6px;
        }

        .item-body-info {
            flex-shrink: 0;
            font-size: 14px;
            color: #666;
            display: flex;
            align-items: center;
        }

        .gender-man,
        .gender-woman {
            margin-right: 4px;
        }

        .gender-man {
            color: #2979ff;
        }

        .gender-woman {
            color: #e43d33;
        }
    }

    &-footer {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
    }

    &-desc {
        .tag {
            font-size: 13px;
            color: #666;
            background: #f5f7fa;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
        }
    }
}
</style>