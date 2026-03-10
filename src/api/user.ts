import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getUserPaginationApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request<Pagination>({
    method: "GET",
    url: "/user/pagination",
    params,
    ...options,
  });
}
