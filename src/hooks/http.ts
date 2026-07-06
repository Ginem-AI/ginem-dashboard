/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { queryKeys } from "../api/queryKeys";
import { useApiErrorHandler } from "./api/useApiErrorHandler";

interface PostRequestTypes {
  path: string;
  body: any;
}

interface GetRequestTypes {
  path: string;
}

interface RemoveRequestTypes {
  path: string;
  body?: any;
}

interface UpdateRequestTypes {
  path: string;
  body: any;
}

interface GetTabelDataRequestTypes {
  path: string;
  page?: number;
  size?: number;
  filter?: any;
}

export interface HttpRequestTypes {
  handleGetRequest: (value: GetRequestTypes) => any;
  handlePostRequest: (value: PostRequestTypes) => any;
  handleRemoveRequest: (value: RemoveRequestTypes) => any;
  handleGetTableDataRequest: (value: GetTabelDataRequestTypes) => any;
}

/**
 * @deprecated Prefer `useApiGet`, `useTableDataQuery`, and mutation hooks from `hooks/api`.
 */
export const useHttp = () => {
  const onError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const handleGetRequest = async ({ path }: GetRequestTypes) => {
    try {
      return await queryClient.fetchQuery({
        queryKey: queryKeys.get(path),
        queryFn: () => apiClient.get(path),
      });
    } catch (error: any) {
      onError(error);
    }
  };

  const handlePostRequest = async ({ path, body }: PostRequestTypes) => {
    try {
      const result = await apiClient.post(path, body);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tableRoot(path),
      });
      return result;
    } catch (error: any) {
      onError(error);
    }
  };

  const handleRemoveRequest = async ({ path }: RemoveRequestTypes) => {
    try {
      const result = await apiClient.remove(path);
      const basePath = "/" + path.split("/").filter(Boolean)[0];
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tableRoot(basePath),
      });
      return result;
    } catch (error: any) {
      onError(error);
    }
  };

  const handleUpdateRequest = async ({ path, body }: UpdateRequestTypes) => {
    try {
      const result = await apiClient.patch(path, body);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tableRoot(path),
      });
      return result;
    } catch (error: any) {
      onError(error);
    }
  };

  const handleGetTableDataRequest = async (props: GetTabelDataRequestTypes) => {
    const filterKey = JSON.stringify(props.filter ?? {});
    const page = props.page || 1;
    const size = props.size || 10;

    try {
      return await queryClient.fetchQuery({
        queryKey: queryKeys.table(props.path, { page, size, filterKey }),
        queryFn: () =>
          apiClient.getTableData({
            path: props.path,
            page,
            size,
            filter: props.filter,
          }),
      });
    } catch (error: any) {
      onError(error);
    }
  };

  return {
    handleGetRequest,
    handlePostRequest,
    handleRemoveRequest,
    handleUpdateRequest: handleUpdateRequest,
    handleGetTableDataRequest,
  };
};
