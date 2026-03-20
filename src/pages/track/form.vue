<template>
    <view class="container">
        <uni-card>
            <uni-forms ref="formRef" label-position="top" :modelValue="formData">
                <uni-forms-item label="会员" name="memberId">
                    <pro-combox v-model="formData.memberId" :options="mbrOptions" placeholder="请输入会员姓名或手机号" />
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
import useRequest from '@/hooks/useRequest'
import useDict from '@/hooks/useDict'
import { onReady } from '@dcloudio/uni-app'

const { data: mbrOptions } = useRequest(getMbrOptionsApi)
const { dict } = useDict(['purchase_intention'])

const formData = ref({
    memberId: '',
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
    memberId: {
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
        console.log('res', res)
    })
}

onReady(() => {
    console.log('formRef.value.setRules', formRef.value.setRules)
    formRef.value?.setRules(rules)
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