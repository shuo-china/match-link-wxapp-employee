<template>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { useEmployeeStore } from "@/stores/employee";
import { UserLevel } from "@/utils/enums";

const employeeStore = useEmployeeStore()

onLoad(async () => {
    uni.showLoading({
        title: "加载中",
        mask: true
    })

    await employeeStore.getAccessToken()
    if (employeeStore.employeeLevel === UserLevel.Bound) {
        await employeeStore.getEmployeeInfo()
        uni.reLaunch({
            url: '/pages/home/home'
        })
    } else {
        uni.reLaunch({
            url: "/pages/login/login"
        })
    }
})
</script>