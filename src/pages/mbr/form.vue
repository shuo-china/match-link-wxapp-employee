<template>
    <view class="container">
        <uni-forms ref="formRef" :modelValue="formData" :label-width="75">
            <uni-card padding="22px 10px 0">
                <uni-forms-item label="姓名" name="name" required>
                    <uni-easyinput type="text" v-model="formData.name" />
                </uni-forms-item>
                <uni-forms-item label="性别" name="gender" required>
                    <uni-data-checkbox v-model="formData.gender" :localdata="dict?.gender" mode="tag" />
                </uni-forms-item>
                <uni-forms-item label="手机号" name="mobile" required>
                    <uni-easyinput type="text" v-model="formData.mobile" />
                </uni-forms-item>
                <uni-forms-item label="出生年份" name="birthYear" required>
                    <pro-picker mode="selector" v-model="formData.birthYear" :options="birthYearOptions"
                        init-value="2000" />
                </uni-forms-item>
                <uni-forms-item label="身高" name="height" required>
                    <pro-picker mode="selector" v-model="formData.height" :options="heightOptions" init-value="170" />
                </uni-forms-item>
                <uni-forms-item label="学历" name="education" required>
                    <pro-picker mode="selector" v-model="formData.education" :options="dict?.education"
                        init-value="3" />
                </uni-forms-item>
                <uni-forms-item label="行业" name="industry" required>
                    <pro-picker mode="selector" v-model="formData.industry" :options="dict?.industry" />
                </uni-forms-item>
                <uni-forms-item label="职业" name="occupation">
                    <uni-easyinput type="text" v-model="formData.occupation" />
                </uni-forms-item>
                <uni-forms-item label="相册" name="album">
                    <pro-upload v-model="formData.album" />
                </uni-forms-item>
            </uni-card>

            <uni-card padding="22px 10px 0">
                <uni-forms-item label="居住地" name="currentAddress" required>
                    <pro-picker mode="region" v-model="formData.currentAddress" :init-value="['江苏省', '徐州市', '鼓楼区']" />
                </uni-forms-item>
                <uni-forms-item label="老家" name="permanentAddress" required>
                    <pro-picker mode="region" v-model="formData.permanentAddress" :init-value="['江苏省', '徐州市', '鼓楼区']" />
                </uni-forms-item>
                <uni-forms-item label="家庭成员" name="familys" required>
                    <uni-data-checkbox multiple v-model="formData.familys" :localdata="dict?.family" />
                </uni-forms-item>
                <uni-forms-item label="婚姻" name="maritalStatus" required>
                    <pro-picker mode="selector" v-model="formData.maritalStatus" :options="dict?.marital_status" />
                </uni-forms-item>
                <uni-forms-item label="有无孩子" name="childrenStatus" required>
                    <pro-picker mode="selector" v-model="formData.childrenStatus" :options="dict?.children_status" />
                </uni-forms-item>
            </uni-card>

            <uni-card padding="22px 10px 0">
                <uni-forms-item label="年收入" name="annualIncome" required>
                    <view class="number-box-wrapper">
                        <uni-number-box v-model="formData.annualIncome" />万元
                    </view>
                </uni-forms-item>
                <uni-forms-item label="是否有房" name="hasHouse" required>
                    <uni-data-checkbox v-model="formData.hasHouse" :localdata="whetherOptions" mode="tag" />
                </uni-forms-item>
                <uni-forms-item v-if="formData.hasHouse === 1" label="房子数量" name="houseCount">
                    <view class="number-box-wrapper">
                        <uni-number-box v-model="formData.houseCount" :min="1" />套房
                    </view>
                </uni-forms-item>
                <uni-forms-item label="是否有车" name="hasVehicle" required>
                    <uni-data-checkbox v-model="formData.hasVehicle" :localdata="whetherOptions" mode="tag" />
                </uni-forms-item>
                <uni-forms-item label="备注" name="remark">
                    <uni-easyinput type="textarea" v-model="formData.remark" />
                </uni-forms-item>
            </uni-card>
        </uni-forms>
        <view class="submit-btn">
            <button type="primary" @click="submitForm">提交</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import useDict from '@/hooks/useDict';
import { birthYearOptions, heightOptions, whetherOptions } from '@/utils/options';

const formRef = ref()
const formData = ref({
    name: '',
    gender: '',
    mobile: '',
    birthYear: '',
    height: '',
    education: '',
    industry: '',
    occupation: '',
    album: [],

    currentAddress: [],
    permanentAddress: [],
    familys: [],
    maritalStatus: '',
    childrenStatus: '',

    annualIncome: 0,
    hasHouse: null,
    houseCount: 0,
    hasVehicle: null,
    remark: ''
})

const rules = {
    name: {
        rules: [
            {
                required: true,
                errorMessage: '请输入姓名',
            }
        ],
    },
    gender: {
        rules: [
            {
                required: true,
                errorMessage: '请选择性别',
            }
        ],
    },
    mobile: {
        rules: [
            {
                required: true,
                errorMessage: '请输入手机号',
            }
        ],
    },
    birthYear: {
        rules: [
            {
                required: true,
                errorMessage: '请选择出生年份',
            }
        ],
    },
    height: {
        rules: [
            {
                required: true,
                errorMessage: '请选择身高',
            }
        ],
    },
    education: {
        rules: [
            {
                required: true,
                errorMessage: '请选择学历',
            }
        ],
    },
    industry: {
        rules: [
            {
                required: true,
                errorMessage: '请选择行业',
            }
        ],
    },
    currentAddress: {
        rules: [
            {
                required: true,
                errorMessage: '请选择居住地',
            }
        ],
    },
    permanentAddress: {
        rules: [
            {
                required: true,
                errorMessage: '请选择老家',
            }
        ],
    },
    familys: {
        rules: [
            {
                required: true,
                errorMessage: '请选择家庭成员',
            }
        ],
    },
    maritalStatus: {
        rules: [
            {
                required: true,
                errorMessage: '请选择婚姻状况',
            }
        ],
    },
    annualIncome: {
        rules: [
            {
                required: true,
                errorMessage: '请输入年收入',
            }
        ],
    },

    hasHouse: {
        rules: [
            {
                required: true,
                errorMessage: '请选择是否有房',
            }
        ],
    },
    hasVehicle: {
        rules: [
            {
                required: true,
                errorMessage: '请选择是否有车',
            }
        ],
    },
}

const { dict } = useDict(['gender', 'industry', 'marital_status', 'education', 'children_status', 'family'])

const submitForm = () => {
    formRef.value.validate().then((res) => {
        console.log(res)
    })
}

watch(() => formData.value.hasHouse, (newVal) => {
    if (newVal === 0) {
        formData.value.houseCount = 0;
    } else {
        formData.value.houseCount = 1;
    }
})

onReady(() => {
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

    .number-box-wrapper {
        display: flex;
        align-items: center;
        height: 100%;
        column-gap: 8px;
    }

    .submit-btn {
        padding: 0 16px 32px;
    }
}
</style>
