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
                <uni-forms-item label="体重" name="height">
                    <pro-picker mode="selector" v-model="formData.weight" :options="weightOptions" init-value="120" />
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
                <uni-forms-item label="会员等级" name="vipLevel" required>
                    <pro-picker mode="selector" v-model="formData.vipLevel" :options="dict?.vip_level" />
                </uni-forms-item>
                <uni-forms-item label="相册" name="albums">
                    <pro-upload v-model="formData.albums" />
                </uni-forms-item>
            </uni-card>

            <uni-card padding="22px 10px">
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
                <uni-forms-item label="有无孩子" name="hasChildren" required>
                    <uni-data-checkbox v-model="formData.hasChildren" :localdata="whetherOptions" mode="tag" />
                </uni-forms-item>
                <uni-forms-item v-if="formData.hasChildren === 1" label="孩子数量">
                    <view class="number-box-wrapper">
                        <uni-number-box v-model="childrenCount" :min="1" />个
                    </view>
                </uni-forms-item>
                <uni-forms-item v-if="formData.hasChildren === 1" name="childrens" label-width="0">
                    <uni-table border>
                        <uni-tr>
                            <uni-th width="50" align="center">序号</uni-th>
                            <uni-th width="100" align="center">孩子性别</uni-th>
                            <uni-th width="120" align="center">孩子跟谁</uni-th>
                        </uni-tr>
                        <uni-tr v-for="(item, index) in formData.childrens" :key="index">
                            <uni-td align="center">{{ index + 1 }}</uni-td>
                            <uni-td align="center">
                                <pro-picker mode="selector" v-model="item.gender" :options="childGenderOptions" />
                            </uni-td>
                            <uni-td align="center">
                                <pro-picker mode="selector" v-model="item.custody" :options="childCustodyOptions" />
                            </uni-td>
                        </uni-tr>
                    </uni-table>
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
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import useDict from '@/hooks/useDict';
import { birthYearOptions, childCustodyOptions, childGenderOptions, heightOptions, weightOptions, whetherOptions } from '@/utils/options';
import { createMbrApi, getMbrDetailApi, updateMbrApi } from '@/api/mbr';

interface Child {
    gender: string | null,
    custody: string | null,
}

const formRef = ref()
const formData = ref({
    name: '',
    gender: '',
    mobile: '',
    birthYear: '',
    height: '',
    weight: '',
    education: '',
    industry: '',
    vipLevel: '',
    occupation: '',
    albums: [],

    currentAddress: [],
    permanentAddress: [],
    familys: [],
    maritalStatus: '',
    hasChildren: null,
    childrens: [] as Child[],

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
    vipLevel: {
        rules: [
            {
                required: true,
                errorMessage: '请选择会员等级',
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
    hasChildren: {
        rules: [
            {
                required: true,
                errorMessage: '请选择是否有孩子',
            }
        ],
    },
    childrens: {
        rules: [
            {
                validateFunction: function (_rule, _value, _data, callback) {
                    if (formData.value.childrens.some(i => i.gender === null || i.custody === null)) {
                        callback('请完善孩子信息')
                    }
                    return true
                }
            }
        ]
    }
}

const { dict } = useDict(['gender', 'industry', 'marital_status', 'education', 'family', 'vip_level'])

let eventChannel: any = null

const submitForm = () => {
    formRef.value.validate().then(() => {
        const res = formData.value as any
        let requestApi = id ? updateMbrApi : createMbrApi
        const submitData = {
            ...res,
            albumKeys: res.albums.map(i => i.key)
        }
        if (id) {
            submitData.id = id
        }
        requestApi(submitData).then(() => {
            return uni.navigateBack()
        }).then(() => {
            eventChannel?.emit('refresh')
            eventChannel?.emit('toast', {
                title: id ? '修改成功' : '添加成功',
                icon: 'success'
            })
        })
    })
}

watch(() => formData.value.hasHouse, (newVal) => {
    if (newVal === 0) {
        formData.value.houseCount = 0;
    } else {
        formData.value.houseCount = 1;
    }
})

const childrenCount = computed({
    get() {
        return formData.value.childrens.length
    },
    set(newVal) {
        if (newVal < formData.value.childrens.length) {
            formData.value.childrens = formData.value.childrens.slice(0, newVal)
        } else if (newVal > formData.value.childrens.length) {
            for (let i = 0; i < newVal - formData.value.childrens.length; i++) {
                formData.value.childrens.push({
                    gender: null,
                    custody: null,
                })
            }
        }

    }
})
watch(() => formData.value.hasChildren, (newVal) => {
    if (newVal === 0) {
        childrenCount.value = 0;
    } else {
        if (formData.value.childrens.length > 0) {
            return
        }
        childrenCount.value = 1;
    }
})

onReady(() => {
    formRef.value?.setRules(rules)
})

let id
onLoad((options) => {
    eventChannel = (getCurrentInstance()?.proxy as any)?.getOpenerEventChannel?.()
    if (options?.id) {
        id = options.id
        uni.showLoading({
            title: '加载中'
        })
        getMbrDetailApi({
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
