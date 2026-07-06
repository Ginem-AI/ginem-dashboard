import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { queryKeys } from "../../api/queryKeys";
import { useApiErrorHandler } from "./useApiErrorHandler";

export function useApiGet<T>(
  path: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false;
  },
) {
  const onError = useApiErrorHandler();

  return useQuery({
    queryKey: queryKeys.get(path),
    queryFn: async () => {
      try {
        return await apiClient.get<T>(path);
      } catch (error) {
        onError(error);
        throw error;
      }
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });
}
