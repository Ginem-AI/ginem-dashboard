import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useState } from "react";
import { useLoggerListQuery } from "@/hooks/services";
import { Button, Chip, Stack, TextField } from "@mui/material";
import BreadCrumberStyle from "@/components/common/Breadcrumb";
import { IconMenus } from "@/assets/icons";
import { convertTime } from "@/utils/convertTime";

export default function ListLoggerView() {
  // DataGrid is 0-based; API expects page >= 1
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { data, isFetching, refetch } = useLoggerListQuery({
    page: paginationModel.page + 1,
    size: paginationModel.pageSize,
    search: "",
  });

  const tableData = data?.items ?? [];
  const rowCount = data?.totalItems ?? 0;
  const loading = isFetching;

  const getLevelChipProps = (
    raw: unknown,
  ): { label: string; color: "error" | "warning" | "info" | "default" } => {
    const level = String(raw ?? "").toLowerCase();
    if (level === "error") {
      return { label: "error", color: "error" };
    }
    if (level === "warn" || level === "warning") {
      return { label: "warn", color: "warning" };
    }
    if (level === "info") {
      return { label: "info", color: "info" };
    }
    return { label: String(raw ?? "—"), color: "default" };
  };

  const columns: GridColDef[] = [
    {
      field: "appLogId",
      renderHeader: () => <strong>{"ID"}</strong>,
      editable: true,
    },
    {
      field: "appLogLevel",
      width: 120,
      renderHeader: () => <strong>{"Level"}</strong>,
      editable: false,
      renderCell: (params) => {
        const { label, color } = getLevelChipProps(params.value);
        return (
          <Chip size="small" label={label} color={color} variant="outlined" />
        );
      },
    },
    {
      field: "appLogMessage",
      flex: 2,
      renderHeader: () => <strong>{"Message"}</strong>,
      editable: true,
    },
    {
      field: "createdAt",
      flex: 1,
      renderHeader: () => <strong>{"Dipesan pada"}</strong>,
      editable: true,
      valueFormatter: (item) => convertTime(item.value),
    },
  ];

  function CustomToolbar() {
    const [search, setSearch] = useState<string>("");
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between", mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <GridToolbarExport />
        </Stack>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <TextField
            size="small"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outlined" onClick={() => refetch()}>
            Search
          </Button>
        </Stack>
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Logger",
            link: "/logger",
            icon: <IconMenus.logger fontSize="small" />,
          },
        ]}
      />
      <Box
        sx={{
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={tableData}
          columns={columns}
          editMode="row"
          getRowId={(row) => row.appLogId}
          sx={{ backgroundColor: "background.default", p: 2 }}
          autoHeight
          loading={loading}
          pageSizeOptions={[2, 5, 10, 25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{
            toolbar: CustomToolbar,
          }}
          rowCount={rowCount}
          paginationMode="server"
        />
      </Box>
    </>
  );
}
