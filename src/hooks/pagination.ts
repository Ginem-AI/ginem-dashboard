/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "../api/client";
import { queryKeys } from "../api/queryKeys";

export const usePagenation = () => {
  const queryClient = useQueryClient();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getTableData = async ({
    path,
    filter,
  }: {
    path: string;
    filter?: any;
  }) => {
    try {
      const filterKey = JSON.stringify(filter ?? {});
      const apiPage = page ?? 0;
      const size = rowsPerPage ?? 10;

      const result = await queryClient.fetchQuery({
        queryKey: queryKeys.table(path, { page: apiPage, size, filterKey }),
        queryFn: () =>
          apiClient.getTableData({
            path,
            page: apiPage,
            size,
            filter,
          }),
      });

      return result ?? [];
    } catch (error: any) {
      console.log(error);
      return [];
    }
  };

  return {
    getTableData,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};
