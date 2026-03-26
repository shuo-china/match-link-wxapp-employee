<template>
    <view class="container">
        <uni-card>
            <uni-forms ref="formRef" label-position="top" :modelValue="formData">
                <uni-forms-item label="会员" name="member_id">
                    <pro-combox v-model="formData.member_id" :options="mbrOptions" placeholder="请输入会员姓名或手机号" />
                </uni-forms-item>
                <uni-forms-item label="付费意向" name="intention">
                    <uni-data-checkbox mode="tag" :selectedColor="intentionColor" v-model="formData.intention"
                        :localdata="dict?.purchase_intention" />
                </uni-forms-item>
                <uni-forms-item label="备注" name="remark">
                    <uni-easyinput type="textarea" v-model="formData.remark" />
                </uni-forms-item>
            </uni-forms>
            <view class="submit-btn">
                <button type="primary" @click="submitForm">提交</button>
            </view>
        </uni-card>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getMbrOptionsApi } from '@/api/mbr'
import { createTrackApi, getTrackDetailApi, updateTrackApi } from '@/api/track'
import useRequest from '@/hooks/useRequest'
import useDict from '@/hooks/useDict'
import { onLoad, onReady } from '@dcloudio/uni-app'

const { data: mbrOptions } = useRequest(getMbrOptionsApi)
const { dict } = useDict(['purchase_intention'])

const formData = ref({
    member_id: '',
    intention: '',
    remark: ''
})

const intentionColor = computed(() => {
    const value = String(formData.value.intention)
    if (value === '1') return '#999999'
    if (value === '2') return '#faad14'
    if (value === '3') return '#52c41a'
    return '#d9d9d9'
})

const formRef = ref()

const rules = {
    member_id: {
        rules: [
            {
                required: true,
                errorMessage: '请选择会员',
            }
        ],
    },
    intention: {
        rules: [
            {
                required: true,
                errorMessage: '请选择付费意向',
            }
        ],
    },
}

const submitForm = () => {
    formRef.value.validate().then((res) => {
        let requestApi = id ? updateTrackApi : createTrackApi
        const submitData = {
            ...res,
        }
        if (id) {
            submitData.id = id
        }
        requestApi(submitData).then(() => {
            uni.navigateBack()
        }).then(() => {
            uni.showToast({
                title: id ? '修改成功' : '添加成功'
            })
        })
    })
}

onReady(() => {
    formRef.value?.setRules(rules)
})

let id
onLoad((options) => {
    if (options?.id) {
        id = options.id
        uni.showLoading({
            title: '加载中'
        })
        getTrackDetailApi({
            id: options.id
        }).then(res => {
            formData.value = Object.fromEntries(Object.entries(res).filter(([key]) => formData.value.hasOwnProperty(key))) as any
        }).finally(() => {
            uni.hideLoading()
        })
    }
})
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #f5f5f5;

    &::before {
        content: '';
        display: table;
    }

    .submit-btn {
        padding-bottom: 16px;
    }
}
</style>