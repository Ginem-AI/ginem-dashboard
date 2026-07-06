import { CONFIGS } from "@/config/env";
import { ServiceHttp } from "@/services/api/http";
import type { PaginatedResponse, TableQueryParams } from "./types";

const serviceHttp = new ServiceHttp();

function normalizeFilters(
  filter?: Record<string, string | undefined>,
): Record<string, string> | undefined {
  if (!filter) return undefined;
  const entries = Object.entries(filter).filter(
    ([, value]) => value != null && value !== "",
  ) as [string, string][];
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export const apiClient = {
  get: <T = unknown>(path: string) => serviceHttp.get({ path }) as Promise<T>,

  post: <T = unknown>(path: string, body: unknown) =>
    serviceHttp.post({ path, body }) as Promise<T>,

  patch: <T = unknown>(path: string, body: unknown) =>
    serviceHttp.patch({ path, body }) as Promise<T>,

  remove: <T = unknown>(path: string) =>
    serviceHttp.remove({ path }) as Promise<T>,

  getTableData: <T = unknown>(params: TableQueryParams) =>
    serviceHttp.getTableData({
      url: CONFIGS.baseUrl + params.path,
      pagination: true,
      page: params.page ?? 1,
      size: params.size ?? 10,
      filters: normalizeFilters(params.filter),
    }) as Promise<PaginatedResponse<T>>,
};
