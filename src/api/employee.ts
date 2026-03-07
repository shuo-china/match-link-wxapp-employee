import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getAccessTokenApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/access/createAccessToken",
    data,
    ...options,
  });
}

export function getCurrentEmployeeInfoApi(options?: HttpRequestConfig) {
  return request({
    url: "/employee/currentEmployee",
    method: "GET",
    ...options,
  });
}

export function bindMobileApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/employee/bindMobile",
    data,
    ...options,
  });
}

export function unBindMobileApi(options?: HttpRequestConfig) {
  return request({
    url: "/employee/unBindMobile",
    method: "GET",
    ...options,
  });
}
