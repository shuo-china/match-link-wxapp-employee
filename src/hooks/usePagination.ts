import useRequest from "./useRequest";
import { merge, pick } from "lodash";
import type { Options, Service } from "./useRequest/type";
import { computed, onMounted, ref } from "vue";
import { onReachBottom } from "@dcloudio/uni-app";

interface PaginationType {
  pageKey: string;
  pageSizeKey: string;
  totalKey: string;
  dataKey: string;
}

export interface PaginationExtendsOption {
  pagination?: Partial<PaginationType>;
}

export interface PaginationOptions<R = any, P extends unknown[] = any>
  extends Options<R, P>, PaginationExtendsOption {}

function usePagination<R = any, P extends unknown[] = any>(
  service: Service<R, P>,
  options: PaginationOptions<R, P> = {},
) {
  const { pagination, ...restOptions } = options;

  const defaultPaginationOptions: PaginationType = {
    // reuqest keys
    pageKey: "page",
    pageSizeKey: "list_rows",
    // response keys
    totalKey: "total",
    dataKey: "data",
  };

  const { pageKey, pageSizeKey, totalKey, dataKey } = Object.assign(
    {},
    defaultPaginationOptions,
    pagination,
  );

  const finallyOptions = merge(
    {
      defaultParams: [
        {
          [pageKey]: 1,
          [pageSizeKey]: 15,
        },
      ],
    },
    restOptions,
  ) as Options<R, P>;

  const defaultParamsKeys = Object.keys(
    finallyOptions.defaultParams![0] as Record<string, any>,
  );

  const isLastPage = ref(false);

  const {
    data: responseData,
    loading,
    params,
    run,
    refresh,
  } = useRequest<R, P>(
    service,
    {
      ...finallyOptions,
      manual: true,
      onBefore: (args) => {
        isLastPage.value = false;
        const reqPage = args[0]?.[pageKey];
        if (reqPage === 1) {
          data.value = [];
        }
      },
      onSuccess: (res, args) => {
        const reqPage = args[0]?.[pageKey];
        const reqPageSize = args[0]?.[pageSizeKey];
        const resData = res?.[dataKey];
        reqPage === 1 ? (data.value = resData) : data.value.push(...resData);
        isLastPage.value = reqPageSize * reqPage >= res?.[totalKey];
      },
    },
    {
      params: finallyOptions.defaultParams,
    },
  );

  const paging = (
    paginationParams?: Record<string, any>,
    isKeepExtraParams = true,
  ) => {
    const [oldPaginationParams, ...restParams] = (params.value as P[]) || [];
    let newPaginationParams;
    if (isKeepExtraParams) {
      newPaginationParams = {
        ...oldPaginationParams,
        ...paginationParams,
      };
    } else {
      newPaginationParams = {
        ...pick(oldPaginationParams, defaultParamsKeys),
        ...paginationParams,
      };
    }

    const mergerParams = [newPaginationParams, ...restParams] as P;
    run(...mergerParams).catch(() => {
      params.value = [oldPaginationParams, ...restParams] as P;
    });
  };

  const search = (paginationParams?: Record<string, any>) => {
    paging({ [pageKey]: 1, ...paginationParams }, false);
  };

  const reset = () => {
    search();
  };

  const changePage = (page: number, otherParams?: Record<string, any>) => {
    paging({ [pageKey]: page, ...otherParams });
  };

  const changePageSize = (
    pageSize: number,
    otherParams?: Record<string, any>,
  ) => {
    paging({ [pageSizeKey]: pageSize, [pageKey]: 1, ...otherParams });
  };

  const total = computed(() => responseData.value?.[totalKey] || 0);

  const data = ref<Record<string, any>[]>([]);

  const currentPage = computed({
    get: () =>
      (params.value?.[0] as any)?.[pageKey] ??
      (finallyOptions.defaultParams![0] as Record<string, any>)[pageKey],
    set(val: number) {
      changePage(val);
    },
  });

  const pageSize = computed({
    get: () =>
      (params.value?.[0] as any)?.[pageSizeKey] ??
      (finallyOptions.defaultParams![0] as Record<string, any>)[pageSizeKey],
    set(val: number) {
      changePageSize(val);
    },
  });

  const next = () => {
    if (isLastPage.value) {
      return;
    }
    changePage(currentPage.value + 1);
  };

  onMounted(() => {
    changePage(1);
  });

  onReachBottom(() => {
    if (loading.value) {
      return;
    }
    next();
  });

  return {
    isLastPage,
    loading,
    data,
    currentPage,
    pageSize,
    total,
    paging,
    search,
    reset,
    refresh,
    changePage,
    changePageSize,
  };
}

export default usePagination;
