import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http";
import {
  Alert,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import DeviceCard, { DeviceCardItem } from "../../components/DeviceCard";
import { convertTime } from "../../utilities/convertTime";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AddIcon from "@mui/icons-material/Add";
import { IDevice } from "../../interfaces/Device";
import FormDevice, {
  DeviceCreateFormState,
  DeviceEditFormState,
} from "./FormDevice";
import DeleteModalDevice from "./DeleteModalDevice";

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

const initialFormState: DeviceCreateFormState = {
  deviceName: "",
  deviceType: "",
  deviceFirmwareVersion: "",
  deviceMetadataRoom: "",
  deviceMetadataVoltage: "",
};

const initialEditFormState: DeviceEditFormState = {
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
    pageSize: 10,
    page: 1,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addFormError, setAddFormError] = useState<string | null>(null);
  const [addForm, setAddForm] =
    useState<DeviceCreateFormState>(initialFormState);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<{
    deviceId: number;
    deviceName: string;
  } | null>(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [deviceToEdit, setDeviceToEdit] = useState<IDevice | null>(null);
  const [editForm, setEditForm] =
    useState<DeviceEditFormState>(initialEditFormState);

  const getTableData = async ({ search }: { search: string }) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const result = await handleGetTableDataRequest({
        path: "/devices",
        page: paginationModel.page ?? 1,
        size: paginationModel.pageSize ?? 10,
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
      const deviceMetadata: Record<string, string> = {};

      if (addForm.deviceMetadataRoom.trim()) {
        deviceMetadata.room = addForm.deviceMetadataRoom.trim();
      }
      if (addForm.deviceMetadataVoltage.trim()) {
        deviceMetadata.voltage = addForm.deviceMetadataVoltage.trim();
      }

      const body: {
        deviceName: string;
        deviceType: string;
        deviceFirmwareVersion?: string;
        deviceMetadata?: Record<string, string>;
      } = {
        deviceName: addForm.deviceName.trim(),
        deviceType: addForm.deviceType.trim(),
        deviceFirmwareVersion:
          addForm.deviceFirmwareVersion.trim() || undefined,
      };
      if (Object.keys(deviceMetadata).length > 0) {
        body.deviceMetadata = deviceMetadata;
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

  const handleOpenEditModal = (row: IDevice) => {
    const meta =
      row?.deviceMetadata && typeof row.deviceMetadata === "object"
        ? (row.deviceMetadata as Record<string, unknown>)
        : {};
    setDeviceToEdit(row);
    setEditForm({
      deviceName: row?.deviceName ?? "",
      deviceStatus: row?.deviceStatus ?? "offline",
      deviceFirmwareVersion: row?.deviceFirmwareVersion ?? "",
      deviceMetadataRoom: typeof meta.room === "string" ? meta.room : "",
      deviceMetadataVoltage:
        typeof meta.voltage === "string" ? meta.voltage : "",
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
        deviceId: deviceToEdit.deviceId,
        deviceName: editForm.deviceName.trim(),
        deviceStatus: editForm.deviceStatus || "offline",
        deviceFirmwareVersion:
          editForm.deviceFirmwareVersion.trim() || undefined,
        deviceMetadata,
      };

      await handleUpdateRequest({
        path: `/devices`,
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
            {tableData.map((row) => (
              <Grid item key={row?.deviceId} xs={12} md={6}>
                <DeviceCard
                  device={row as DeviceCardItem}
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

      <FormDevice
        open={openAddModal}
        submitLoading={submitLoading}
        formError={addFormError}
        mode="create"
        form={addForm}
        setForm={setAddForm}
        onClose={handleCloseAddModal}
        onSubmit={handleAddDeviceSubmit}
      />

      <FormDevice
        open={openEditModal}
        submitLoading={editSubmitLoading}
        formError={editFormError}
        mode="edit"
        form={editForm}
        setForm={setEditForm}
        onClose={handleCloseEditModal}
        onSubmit={handleEditDeviceSubmit}
      />

      <DeleteModalDevice
        open={openDeleteModal}
        loading={deleteLoading}
        deviceName={deviceToDelete?.deviceName ?? null}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
