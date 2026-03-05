import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getMbrPaginationApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request<Pagination>({
    method: "GET",
    url: "/mbr/pagination",
    params,
    ...options,
  });
}
