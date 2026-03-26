import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getTrackPaginationApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request<Pagination>({
    method: "GET",
    url: "/track/pagination",
    params,
    ...options,
  });
}

export function createTrackApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/track/create",
    data,
    ...options,
  });
}

export function updateTrackApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/track/update",
    data,
    ...options,
  });
}

export function getTrackDetailApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "GET",
    url: "/track/detail",
    params,
    ...options,
  });
}

export function deleteTrackApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/track/delete",
    data,
    ...options,
  });
}
