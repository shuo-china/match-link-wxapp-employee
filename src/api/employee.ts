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

export function getEmpPaginationApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request<Pagination>({
    method: "GET",
    url: "/employee/pagination",
    params,
    ...options,
  });
}

export function createEmpApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/employee/create",
    data,
    ...options,
  });
}

export function updateEmpApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/employee/update",
    data,
    ...options,
  });
}

export function getEmpDetailApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "GET",
    url: "/employee/detail",
    params,
    ...options,
  });
}

export function deleteEmpApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/employee/delete",
    data,
    ...options,
  });
}
