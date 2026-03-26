import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getDatePaginationApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request<Pagination>({
    method: "GET",
    url: "/date/pagination",
    params,
    ...options,
  });
}

export function getDateListApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "GET",
    url: "/date/list",
    params,
    ...options,
  });
}

export function createDateApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/date/create",
    data,
    ...options,
  });
}

export function updateDateApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/date/update",
    data,
    ...options,
  });
}

export function getDateDetailApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "GET",
    url: "/date/detail",
    params,
    ...options,
  });
}

export function deleteDateApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/date/delete",
    data,
    ...options,
  });
}
