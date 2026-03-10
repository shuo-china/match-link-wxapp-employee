import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getMbrPaginationApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request<Pagination>({
    method: "GET",
    url: "/member/pagination",
    params,
    ...options,
  });
}

export function createMbrApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/member/create",
    data,
    ...options,
  });
}

export function updateMbrApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/member/update",
    data,
    ...options,
  });
}

export function getMbrDetailApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "GET",
    url: "/member/detail",
    params,
    ...options,
  });
}

export function deleteMbrApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/member/delete",
    data,
    ...options,
  });
}
