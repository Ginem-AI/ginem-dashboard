import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import DeviceCard from "../../components/DeviceCard";
import { convertTime } from "../../utilities/convertTime";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IDevice } from "../../interfaces/Device";

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

const initialFormState = {
  deviceName: "",
  deviceType: "",
  deviceFirmwareVersion: "",
  deviceMetadataRoom: "",
  deviceMetadataVoltage: "",
};

const initialEditFormState = {
  deviceName: "",
  deviceStatus: "",
  deviceFirmwareVersion: "",
  deviceMetadataRoom: "",
  deviceMetadataVoltage: "",
};

export default function ListDeviceView() {
  const [tableData, setTableData] = useState<IDevice[]>([]);

  const {
    handleGetTableDataRequest,
    handlePostRequest,
    handleRemoveRequest,
    handleUpdateRequest,
  } = useHttp();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 1,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addFormError, setAddFormError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState(initialFormState);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<{
    deviceId: number;
    deviceName: string;
  } | null>(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [deviceToEdit, setDeviceToEdit] = useState<any>(null);
  const [editForm, setEditForm] = useState(initialEditFormState);

  const getTableData = async ({ search }: { search: string }) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const result = await handleGetTableDataRequest({
        path: "/devices",
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
      setErrorMessage("Failed to load devices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const search = searchParams.get("search") || "";

    getTableData({
      search,
    });
  }, [paginationModel, searchParams]);

  const handleOpenAddModal = () => {
    setAddForm(initialFormState);
    setAddFormError(null);
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (!submitLoading) {
      setOpenAddModal(false);
      setAddForm(initialFormState);
      setAddFormError(null);
    }
  };

  const handleAddDeviceSubmit = async () => {
    setAddFormError(null);
    if (!addForm.deviceName?.trim()) {
      setAddFormError("Device name is required.");
      return;
    }
    if (!addForm.deviceType?.trim()) {
      setAddFormError("Device type is required.");
      return;
    }
    try {
      setSubmitLoading(true);
      const body = {
        deviceName: addForm.deviceName.trim(),
        deviceType: addForm.deviceType.trim(),
        deviceFirmwareVersion:
          addForm.deviceFirmwareVersion.trim() || undefined,
        deviceMetadata: {
          ...(addForm.deviceMetadataRoom.trim() && {
            room: addForm.deviceMetadataRoom.trim(),
          }),
          ...(addForm.deviceMetadataVoltage.trim() && {
            voltage: addForm.deviceMetadataVoltage.trim(),
          }),
        },
      };
      if (Object.keys(body.deviceMetadata).length === 0) {
        delete (body as any).deviceMetadata;
      }
      await handlePostRequest({
        path: "/devices",
        body,
      });
      handleCloseAddModal();
      const search = searchParams.get("search") || "";
      getTableData({ search });
    } catch (error: unknown) {
      console.error(error);
      setAddFormError(
        error instanceof Error ? error.message : "Failed to add device.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenDeleteModal = (deviceId: number, deviceName: string) => {
    setDeviceToDelete({ deviceId, deviceName });
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (!deleteLoading) {
      setOpenDeleteModal(false);
      setDeviceToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;
    try {
      setDeleteLoading(true);
      await handleRemoveRequest({
        path: `/devices/${deviceToDelete.deviceId}`,
      });
      handleCloseDeleteModal();
      const search = searchParams.get("search") || "";
      getTableData({ search });
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenEditModal = (row: any) => {
    const meta =
      row?.deviceMetadata && typeof row.deviceMetadata === "object"
        ? row.deviceMetadata
        : {};
    setDeviceToEdit(row);
    setEditForm({
      deviceName: row?.deviceName ?? "",
      deviceStatus: row?.deviceStatus ?? "offline",
      deviceFirmwareVersion: row?.deviceFirmwareVersion ?? "",
      deviceMetadataRoom: meta?.room ?? "",
      deviceMetadataVoltage: meta?.voltage ?? "",
    });
    setEditFormError(null);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (!editSubmitLoading) {
      setOpenEditModal(false);
      setDeviceToEdit(null);
      setEditForm(initialEditFormState);
      setEditFormError(null);
    }
  };

  const handleEditDeviceSubmit = async () => {
    if (!deviceToEdit?.deviceId) return;

    setEditFormError(null);

    if (!editForm.deviceName?.trim()) {
      setEditFormError("Device name is required.");
      return;
    }
    try {
      setEditSubmitLoading(true);

      const deviceMetadata: Record<string, string> = {};

      if (editForm.deviceMetadataRoom.trim())
        deviceMetadata.room = editForm.deviceMetadataRoom.trim();
      if (editForm.deviceMetadataVoltage.trim())
        deviceMetadata.voltage = editForm.deviceMetadataVoltage.trim();

      const body = {
        deviceName: editForm.deviceName.trim(),
        deviceStatus: editForm.deviceStatus || "offline",
        deviceFirmwareVersion:
          editForm.deviceFirmwareVersion.trim() || undefined,
        deviceMetadata,
      };

      await handleUpdateRequest({
        path: `/devices/${deviceToEdit.deviceId}`,
        body,
      });

      handleCloseEditModal();
      const search = searchParams.get("search") || "";
      getTableData({ search });
    } catch (error: unknown) {
      console.error(error);
      setEditFormError(
        error instanceof Error ? error.message : "Failed to update device.",
      );
    } finally {
      setEditSubmitLoading(false);
    }
  };

  function CustomToolbar() {
    const initialSearch = searchParams.get("search") || "";

    const [search, setSearch] = useState<string>(initialSearch);

    useEffect(() => {
      setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = () => {
      const newSearchParams = new URLSearchParams();
      if (search) {
        newSearchParams.set("search", search);
      }
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
            placeholder="Search devices..."
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

  return (
    <Box sx={{ pb: 2 }}>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Devices",
            link: "/devices",
            icon: <IconMenus.device fontSize="small" />,
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
              Devices
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your devices
              {lastUpdated ? ` • Updated ${lastUpdated.toLocaleString()}` : ""}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
          >
            Add Device
          </Button>
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
              title="No devices"
              subtitle="Try adjusting your search or add a new device."
            />
          ) : (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {tableData.map((row: any) => (
                <Grid item key={row?.deviceId} xs={12} md={6}>
                  <DeviceCard
                    device={row}
                    convertTime={convertTime}
                    onDetail={() => navigate(`/devices/${row?.deviceId}`)}
                    onEdit={() => handleOpenEditModal(row)}
                    onDelete={() =>
                      handleOpenDeleteModal(
                        row?.deviceId,
                        row?.deviceName || "Unknown",
                      )
                    }
                  />
                </Grid>
              ))}
            </Grid>
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

      <Dialog
        open={openAddModal}
        onClose={handleCloseAddModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Device</DialogTitle>
        <DialogContent>
          {addFormError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addFormError}
            </Alert>
          ) : null}
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              size="small"
              label="Device Name"
              required
              fullWidth
              value={addForm.deviceName}
              onChange={(e) =>
                setAddForm((prev) => ({ ...prev, deviceName: e.target.value }))
              }
              placeholder="e.g. Sensor Kebakaran"
            />
            <FormControl size="small" fullWidth required>
              <InputLabel id="add-device-type-label">Device Type</InputLabel>
              <Select
                labelId="add-device-type-label"
                id="add-device-type"
                value={addForm.deviceType}
                label="Device Type"
                onChange={(e) =>
                  setAddForm((prev) => ({
                    ...prev,
                    deviceType: e.target.value,
                  }))
                }
              >
                <MenuItem value="sensor">sensor</MenuItem>
                <MenuItem value="actuator">actuator</MenuItem>
                <MenuItem value="hybrid">hybrid</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="add-device-firmware-label">
                Firmware Version
              </InputLabel>
              <Select
                labelId="add-device-firmware-label"
                id="add-device-firmware"
                value={addForm.deviceFirmwareVersion}
                label="Firmware Version"
                onChange={(e) =>
                  setAddForm((prev) => ({
                    ...prev,
                    deviceFirmwareVersion: e.target.value,
                  }))
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="v1.0.0">v1.0.0</MenuItem>
                <MenuItem value="v1.1.0">v1.1.0</MenuItem>
                <MenuItem value="v2.0.0">v2.0.0</MenuItem>
                <MenuItem value="v2.1.0">v2.1.0</MenuItem>
                <MenuItem value="v3.0.0">v3.0.0</MenuItem>
              </Select>
            </FormControl>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ pt: 0.5 }}
            >
              Metadata (optional)
            </Typography>
            <TextField
              size="small"
              label="Room"
              fullWidth
              value={addForm.deviceMetadataRoom}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  deviceMetadataRoom: e.target.value,
                }))
              }
              placeholder="e.g. bedroom"
            />
            <TextField
              size="small"
              label="Voltage"
              fullWidth
              value={addForm.deviceMetadataVoltage}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  deviceMetadataVoltage: e.target.value,
                }))
              }
              placeholder="e.g. 220V"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAddModal} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddDeviceSubmit}
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Device</DialogTitle>
        <DialogContent>
          {editFormError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editFormError}
            </Alert>
          ) : null}
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              size="small"
              label="Device Name"
              required
              fullWidth
              value={editForm.deviceName}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, deviceName: e.target.value }))
              }
              placeholder="e.g. Sensor Kebakaran"
            />
            <FormControl size="small" fullWidth>
              <InputLabel id="edit-device-status-label">
                Device Status
              </InputLabel>
              <Select
                labelId="edit-device-status-label"
                id="edit-device-status"
                value={editForm.deviceStatus}
                label="Device Status"
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    deviceStatus: e.target.value,
                  }))
                }
              >
                <MenuItem value="online">online</MenuItem>
                <MenuItem value="offline">offline</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="edit-device-firmware-label">
                Firmware Version
              </InputLabel>
              <Select
                labelId="edit-device-firmware-label"
                id="edit-device-firmware"
                value={editForm.deviceFirmwareVersion}
                label="Firmware Version"
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    deviceFirmwareVersion: e.target.value,
                  }))
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="v1.0.0">v1.0.0</MenuItem>
                <MenuItem value="v1.1.0">v1.1.0</MenuItem>
                <MenuItem value="v2.0.0">v2.0.0</MenuItem>
                <MenuItem value="v2.1.0">v2.1.0</MenuItem>
                <MenuItem value="v2.2.0">v2.2.0</MenuItem>
                <MenuItem value="v3.0.0">v3.0.0</MenuItem>
              </Select>
            </FormControl>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ pt: 0.5 }}
            >
              Metadata (optional)
            </Typography>
            <TextField
              size="small"
              label="Room"
              fullWidth
              value={editForm.deviceMetadataRoom}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  deviceMetadataRoom: e.target.value,
                }))
              }
              placeholder="e.g. bedroom"
            />
            <TextField
              size="small"
              label="Voltage"
              fullWidth
              value={editForm.deviceMetadataVoltage}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  deviceMetadataVoltage: e.target.value,
                }))
              }
              placeholder="e.g. 220V"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseEditModal} disabled={editSubmitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditDeviceSubmit}
            disabled={editSubmitLoading}
            startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            {editSubmitLoading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: (t) => t.shadows[24],
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pb: 0,
            pt: 2.5,
            px: 3,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "error.light",
              color: "error.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" component="span">
              Delete device?
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "block", mt: 0.25 }}
            >
              This action cannot be undone.
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            You are about to remove
            <Typography
              component="span"
              variant="body2"
              fontWeight={700}
              color="text.primary"
              sx={{ mx: 0.5 }}
            >
              {deviceToDelete?.deviceName ?? "this device"}
            </Typography>
            from your devices.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCloseDeleteModal}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? null : (
                <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
              )
            }
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
