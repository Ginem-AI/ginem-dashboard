import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import Alert from "@mui/material/Alert";
import DeviceHubOutlinedIcon from "@mui/icons-material/DeviceHubOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

interface StatsData {
  devices: number;
  users: number;
  schedulerLogs: number;
  appLogs: number;
  embeddings: number;
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
    label: "Users",
    icon: PeopleOutlinedIcon,
    color: "#10B981",
    bgGradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  },
  {
    key: "embeddings",
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
  const { handleGetRequest } = useHttp();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await handleGetRequest({ path: "/stats" });
        if (result && typeof result === "object") {
          setStats({
            devices: result.devices ?? 0,
            users: result.users ?? 0,
            embeddings: result.embeddings ?? 0,
            schedulerLogs: result.schedulerLogs ?? 0,
            appLogs: result.appLogs ?? 0,
          });
        }
      } catch (err: unknown) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load statistics.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
                {loading ? (
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
    </Box>
  );
}
