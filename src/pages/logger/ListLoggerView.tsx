/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import {
  GridRowsProp,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { MoreOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import { Button, Chip, Stack, TextField } from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { useNavigate } from "react-router-dom";
import { convertTime } from "../../utilities/convertTime";

export default function ListLoggerView() {
  const navigation = useNavigate();
  const [tableData, setTableData] = useState<GridRowsProp[]>([]);
  const { handleGetTableDataRequest } = useHttp();

  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 1,
  });

  const getTableData = async ({ search }: { search: string }) => {
    try {
      setLoading(true);
      const result = await handleGetTableDataRequest({
        path: "/logs",
        page: paginationModel.page ?? 1,
        size: paginationModel.pageSize ?? 10,
        filter: { search },
      });

      if (result && result.items) {
        setTableData(result.items);
        setRowCount(result.totalItems);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableData({ search: "" });
  }, [paginationModel]);

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
          <Button variant="outlined" onClick={() => getTableData({ search })}>
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
          getRowId={(row: any) => row.appLogId}
          sx={{ backgroundColor: "white", p: 2 }}
          autoHeight
          initialState={{
            pagination: { paginationModel: { pageSize: 2, page: 1 } },
          }}
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
