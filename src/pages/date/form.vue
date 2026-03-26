<template>
    <view class="container">
        <uni-card>
            <uni-forms ref="formRef" label-position="top" :label-width="200" :modelValue="formData">
                <uni-forms-item label="男会员" name="male_member_id">
                    <pro-combox v-model="formData.male_member_id" :options="maleMbrOptions" placeholder="请选择男会员" />
                </uni-forms-item>
                <uni-forms-item label="女会员" name="female_member_id">
                    <pro-combox v-model="formData.female_member_id" :options="femaleMbrOptions" placeholder="请选择女会员" />
                </uni-forms-item>
                <uni-forms-item label="约会时间" name="date_time">
                    <uni-datetime-picker type="datetime" :hide-second="true" v-model="formData.date_time"
                        placeholder="请选择约会时间" />
                </uni-forms-item>
                <template v-if="isEdit">
                    <uni-forms-item label="男方对女方满意度" name="man_to_woman_level">
                        <uni-data-select v-model="formData.man_to_woman_level" :localdata="dict?.date_result"
                            placeholder="请选择满意度" />
                    </uni-forms-item>
                    <uni-forms-item label="女方对男方满意度" name="woman_to_man_level">
                        <uni-data-select v-model="formData.woman_to_man_level" :localdata="dict?.date_result"
                            placeholder="请选择满意度" />
                    </uni-forms-item>
                </template>
                <uni-forms-item label="备注" name="remark">
                    <uni-easyinput type="textarea" v-model="formData.remark" placeholder="请输入备注信息" />
                </uni-forms-item>
            </uni-forms>
            <view class="submit-btn">
                <button type="primary" @click="submitForm">提交</button>
            </view>
        </uni-card>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getMbrOptionsApi } from '@/api/mbr'
import { createDateApi, getDateDetailApi, updateDateApi } from '@/api/date'
import useRequest from '@/hooks/useRequest'
import useDict from '@/hooks/useDict'
import { onLoad, onReady } from '@dcloudio/uni-app'

const { dict } = useDict(['date_result'])
let isEdit = false

const { data: maleMbrOptions } = useRequest(() => getMbrOptionsApi({ gender: '1' }))
const { data: femaleMbrOptions } = useRequest(() => getMbrOptionsApi({ gender: '2' }))

const formData = ref({
    male_member_id: '',
    female_member_id: '',
    date_time: '',
    remark: '',
    man_to_woman_level: '',
    woman_to_man_level: ''
})

const formRef = ref()

const rules = {
    male_member_id: {
        rules: [{ required: true, errorMessage: '请选择男会员' }]
    },
    female_member_id: {
        rules: [{ required: true, errorMessage: '请选择女会员' }]
    },
    date_time: {
        rules: [{ required: true, errorMessage: '请选择约会时间' }]
    }
}

const submitForm = () => {
    formRef.value.validate().then((res) => {
        let requestApi = id ? updateDateApi : createDateApi
        const submitData = { ...res }
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
        isEdit = true
        uni.showLoading({ title: '加载中' })
        getDateDetailApi({ id: options.id }).then(res => {
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
    padding-bottom: 20px;

    &::before {
        content: '';
        display: table;
    }

    .submit-btn {
        padding-top: 20px;
        padding-bottom: 16px;
    }
}
</style>