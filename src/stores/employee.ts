import {
  bindMobileApi,
  getAccessTokenApi,
  getCurrentEmployeeInfoApi,
  unBindMobileApi,
} from "@/api/employee";
import { UserLevel } from "@/utils/enums";

import { defineStore } from "pinia";
import { ref } from "vue";

interface EmployeeInfo {
  id: number;
  mobile: string;
  nickname: string;
  avatarPath: string | null;
  isSuper: boolean;
}

export const useEmployeeStore = defineStore("employee", () => {
  const token = ref<Nullable<string>>(null);
  const employeeInfo = ref<Nullable<EmployeeInfo>>(null);
  const employeeLevel = ref<UserLevel>(UserLevel.Anonymous);

  function getAccessToken() {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: "weixin",
        success: (res) => {
          if (res.errMsg === "login:ok") {
            getAccessTokenApi({
              code: res.code,
            }).then((res) => {
              token.value = res.token_info.access_token;
              employeeLevel.value = res.level;
              resolve(res);
            });
          }
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  async function getEmployeeInfo() {
    const res = await getCurrentEmployeeInfoApi();
    employeeInfo.value = {
      id: res.id,
      mobile: res.mobile,
      nickname: res.nickname,
      avatarPath: res.avatar?.length ? res.avatar[0].path : null,
      isSuper: !!res.is_super,
    };
    return res;
  }

  async function bindMobile(code: string) {
    await bindMobileApi({
      code,
    });
    await getAccessToken();
    await getEmployeeInfo();
  }

  async function unBindMobile() {
    await unBindMobileApi();
    await getAccessToken();
    employeeInfo.value = null;
  }

  return {
    token,
    employeeInfo,
    employeeLevel,
    getAccessToken,
    getEmployeeInfo,
    bindMobile,
    unBindMobile,
  };
});
