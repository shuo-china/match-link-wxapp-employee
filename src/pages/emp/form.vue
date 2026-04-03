<template>
    <view class="container">
        <uni-forms ref="formRef" :modelValue="formData" :label-width="75">
            <uni-card padding="22px 10px 0">
                <uni-forms-item label="昵称" name="nickname" required>
                    <uni-easyinput type="text" v-model="formData.nickname" />
                </uni-forms-item>
                <uni-forms-item label="手机号" name="mobile" required>
                    <uni-easyinput type="text" v-model="formData.mobile" />
                </uni-forms-item>
                <uni-forms-item label="头像" name="avatar_key">
                    <pro-upload v-model="formData.avatar" :limit="1" />
                </uni-forms-item>
            </uni-card>
        </uni-forms>
        <view class="submit-btn">
            <button type="primary" @click="submitForm">提交</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import { createEmpApi, getEmpDetailApi, updateEmpApi } from '@/api/employee';

const formRef = ref();

const formData = ref({
    nickname: '',
    mobile: '',
    avatar: []
});

const rules = {
    nickname: {
        rules: [
            {
                required: true,
                errorMessage: '请输入昵称',
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
};

let eventChannel: any = null

const submitForm = () => {
    formRef.value.validate().then(() => {
        const res = formData.value as any
        const submitData: any = {
            ...res,
            avatar_key: res.avatar.map(i => i.key)
        };

        const requestApi = id ? updateEmpApi : createEmpApi;
        if (id) {
            submitData.id = id;
        }

        requestApi(submitData).then(() => {
            return uni.navigateBack();
        }).then(() => {
            eventChannel?.emit('refresh', {
                id,
            })
            eventChannel?.emit('toast', {
                title: id ? '修改成功' : '添加成功',
                icon: 'success'
            })
        })
    });
};

onReady(() => {
    formRef.value?.setRules(rules);
});

let id;
onLoad((options) => {
    eventChannel = (getCurrentInstance()?.proxy as any)?.getOpenerEventChannel?.()
    if (options?.id) {
        id = options.id;
        uni.showLoading({
            title: '加载中'
        });
        getEmpDetailApi({
            id: options.id
        }).then((res) => {
            formData.value = Object.fromEntries(
                Object.entries(res).filter(([key]) => (formData.value as any).hasOwnProperty(key))
            ) as any;
        }).finally(() => {
            uni.hideLoading();
        });
    }
});
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
        padding: 0 16px 32px;
    }
}
</style>