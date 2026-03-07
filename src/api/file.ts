import { useEmployeeStore } from "@/stores/employee";
import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

interface UploadResponse {
  name: string;
  key: string;
  path: string;
  extension: string;
}

export function uploadFileApi(path: string): Promise<UploadResponse> {
  const employeeStore = useEmployeeStore();
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: import.meta.env.VITE_API_BASE_URL + "/file/upload",
      filePath: path,
      name: "file",
      header: {
        Authorization: `Bearer ${employeeStore.token}`,
      },
      success: (res) => {
        resolve(JSON.parse(res.data));
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}

export function deleteFileApi(key: string, options?: HttpRequestConfig) {
  return request({
    url: "/file/delete/",
    method: "GET",
    params: {
      key,
    },
    ...options,
  });
}
