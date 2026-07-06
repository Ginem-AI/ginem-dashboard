import { useTableDataQuery } from "@/hooks/api";
import { SCHEDULER_API } from "@/services/schedulerService";

export function useSchedulerListQuery(params: {
  page: number;
  size: number;
  search?: string;
}) {
  return useTableDataQuery(SCHEDULER_API.list, {
    page: params.page,
    size: params.size,
    filter: { search: params.search },
  });
}
