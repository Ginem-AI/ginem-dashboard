import { apiClient } from "./api";
import type { PaginatedResponse } from "./types";

export const SCHEDULER_API = {
  list: "/scheduler-logs",
} as const;

export interface SchedulerListParams {
  page: number;
  size: number;
  search?: string;
}

export const schedulerService = {
  getList: (params: SchedulerListParams): Promise<PaginatedResponse<unknown>> =>
    apiClient.getTableData({
      path: SCHEDULER_API.list,
      page: params.page,
      size: params.size,
      filter: { search: params.search },
    }),
};
