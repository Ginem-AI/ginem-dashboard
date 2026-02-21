import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import {
  Alert,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { convertTime } from "../../utilities/convertTime";
import { useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function NoRowsOverlay({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100%", py: 6, px: 2 }}
      spacing={0.5}
    >
      <Typography fontWeight={700}>{title}</Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

export default function ListLoggerView() {
  const [tableData, setTableData] = useState<any[]>([]);
  const { handleGetTableDataRequest } = useHttp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 1,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getTableData = async ({ search }: { search: string }) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const result = await handleGetTableDataRequest({
        path: "/logs",
        page: paginationModel.page,
        size: paginationModel.pageSize,
        filter: { search },
      });

      if (result && result?.items) {
        setTableData(result?.items);
        setRowCount(result.totalItems ?? 0);
        setLastUpdated(new Date());
      }
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage("Failed to load logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const search = searchParams.get("search") || "";
    getTableData({ search });
  }, [paginationModel, searchParams]);

  function CustomToolbar() {
    const initialSearch = searchParams.get("search") || "";
    const [search, setSearch] = useState<string>(initialSearch);

    useEffect(() => {
      setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = () => {
      const newSearchParams = new URLSearchParams();
      if (search) newSearchParams.set("search", search);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      setSearchParams(newSearchParams);
    };

    const handleReset = () => {
      setSearch("");
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      setSearchParams(new URLSearchParams());
    };

    return (
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={1.25}
        alignItems={{ xs: "stretch", lg: "center" }}
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Refresh">
            <span>
              <IconButton
                size="small"
                onClick={() => getTableData({ search })}
                disabled={loading}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            size="small"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <Tooltip title="Clear">
                    <IconButton
                      size="small"
                      onClick={() => setSearch("")}
                      edge="end"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : undefined,
            }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" onClick={handleSearch}>
              Apply
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={handleReset}
              startIcon={<RestartAltIcon fontSize="small" />}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  const getLevelColor = (
    level: string,
  ): "default" | "primary" | "success" | "warning" | "error" => {
    const s = String(level ?? "").toLowerCase();
    if (s === "error") return "error";
    if (s === "warn" || s === "warning") return "warning";
    if (s === "info") return "primary";
    if (s === "debug") return "default";
    return "default";
  };

  return (
    <Box sx={{ pb: 2 }}>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Logger",
            link: "/logger",
            icon: <IconMenus.logger fontSize="small" />,
          },
        ]}
      />

      <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.25}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Logs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Application and request logs
              {lastUpdated ? ` • Updated ${lastUpdated.toLocaleString()}` : ""}
            </Typography>
          </Box>
        </Stack>

        {errorMessage ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ width: "100%" }}>
          <CustomToolbar />

          {(!loading && tableData.length === 0) || rowCount === 0 ? (
            <NoRowsOverlay
              title="No logs"
              subtitle="Try adjusting your search or wait for new log entries."
            />
          ) : (
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, width: 80 }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 100 }}>
                      Level
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 160 }}>
                      Created at
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row: any) => {
                    const level = String(row?.level ?? "info");
                    const message = row?.message ?? "";
                    return (
                      <TableRow
                        key={row?.logId}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2">
                            {row?.logId ?? "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={
                              level.charAt(0).toUpperCase() +
                              level.slice(1).toLowerCase()
                            }
                            color={getLevelColor(level)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={message} placement="top-start">
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 480,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontFamily: "monospace",
                                fontSize: "0.75rem",
                              }}
                            >
                              {message || "—"}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {convertTime(row?.createdAt) || "—"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {rowCount > 0 && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {tableData.length} of {rowCount} items
              </Typography>
              <Pagination
                color="primary"
                shape="rounded"
                page={paginationModel.page + 1}
                count={Math.max(
                  1,
                  Math.ceil(rowCount / paginationModel.pageSize),
                )}
                onChange={(_, page) =>
                  setPaginationModel((prev) => ({ ...prev, page: page - 1 }))
                }
              />
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
