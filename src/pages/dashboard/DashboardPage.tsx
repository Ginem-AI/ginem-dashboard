import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useApiGet, useTableDataQuery } from "@/hooks/api";
import BreadCrumberStyle from "@/components/common/Breadcrumb";
import { IconMenus } from "@/assets/icons";
import Alert from "@mui/material/Alert";
import DeviceHubOutlinedIcon from "@mui/icons-material/DeviceHubOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { convertTime } from "@/utils/convertTime";
import { Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface StatsData {
  devices: number;
  users: number;
  schedulerLogs: number;
  appLogs: number;
  vectorIndexes: number;
}

const statCards: {
  key: keyof StatsData;
  label: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
}[] = [
  {
    key: "devices",
    label: "Devices",
    icon: DeviceHubOutlinedIcon,
    color: "#3B82F6",
    bgGradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
  },
  {
    key: "users",
    label: "Admins",
    icon: PeopleOutlinedIcon,
    color: "#10B981",
    bgGradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  },
  {
    key: "vectorIndexes",
    label: "Embeddings",
    icon: StorageOutlinedIcon,
    color: "#8B5CF6",
    bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
  },
  {
    key: "schedulerLogs",
    label: "Schedulers",
    icon: AccessAlarmIcon,
    color: "#F59E0B",
    bgGradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  },
];

export default function DashboardView() {
  const {
    data: statsResult,
    isLoading: statsLoading,
    isError: statsError,
  } = useApiGet<StatsData>("/stats");

  const stats = statsResult ?? null;
  const error = statsError ? "Failed to load statistics." : null;

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 1,
  });

  const { data: logsData, isFetching: logsLoading } = useTableDataQuery(
    "/logs",
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      filter: { search: "" },
    },
  );

  const tableData = logsData?.items ?? [];
  const rowCount = logsData?.totalItems ?? 0;

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

  return (
    <Box sx={{ pb: 2 }}>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Dashboard",
            link: "/",
            icon: <IconMenus.dashboard fontSize="small" />,
          },
        ]}
      />

      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Statistics across your application
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {statCards.map(({ key, label, icon: Icon, bgGradient }) => (
          <Grid item key={key} xs={12} sm={6} md={4} lg={3}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: bgGradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                    color: "white",
                  }}
                >
                  <Icon sx={{ fontSize: 28 }} />
                </Box>
                {statsLoading ? (
                  <>
                    <Skeleton variant="text" width={80} height={32} />
                    <Skeleton variant="text" width={40} height={24} />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {label}
                    </Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {stats?.[key] ?? 0}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <DataGrid
          rows={tableData}
          columns={columns}
          editMode="row"
          getRowId={(row) => row.appLogId}
          sx={{
            backgroundColor: "background.default",
            p: 2,
            ml: 2,
            my: 5,
          }}
          autoHeight
          initialState={{
            pagination: { paginationModel: { pageSize: 2, page: 1 } },
          }}
          loading={logsLoading}
          pageSizeOptions={[2, 5, 10, 25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={rowCount}
          paginationMode="server"
        />
      </Grid>
    </Box>
  );
}
