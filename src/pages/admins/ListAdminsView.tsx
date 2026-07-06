import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useState } from "react";
import {
  useApiDeleteMutation,
  useApiPatchMutation,
  useApiPostMutation,
  useTableDataQuery,
} from "../../hooks/api";
import {
  Button,
  Stack,
  TextField,
  Chip,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { convertTime } from "../../utilities/convertTime";
import {
  adminCreateSchema,
  AdminCreateValues,
} from "../../validations/adminSchema";

interface AdminRow {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  userOnboardingStatus: string;
  createdAt: string;
}

export default function ListAdminView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { data, isFetching } = useTableDataQuery<AdminRow>("/admins", {
    page: paginationModel.page + 1,
    size: paginationModel.pageSize,
    filter: { search: searchFilter },
  });

  const tableData = data?.items ?? [];
  const rowCount = data?.totalItems ?? 0;
  const loading = isFetching;

  const createAdmin = useApiPostMutation({
    invalidateTablePaths: ["/admins"],
  });
  const updateAdmin = useApiPatchMutation({
    invalidateTablePaths: ["/admins"],
  });
  const deleteAdmin = useApiDeleteMutation({
    invalidateTablePaths: ["/admins"],
  });

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createFieldErrors, setCreateFieldErrors] = useState<
    Partial<Record<keyof AdminCreateValues, string>>
  >({});

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editFieldErrors, setEditFieldErrors] = useState<
    Partial<Record<keyof AdminCreateValues, string>>
  >({});

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminRow | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const columns: GridColDef[] = [
    {
      field: "userName",
      flex: 1,
      renderHeader: () => <strong>{"ADMIN"}</strong>,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
            }}
          >
            {(params.row.userName || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={600} variant="body2">
              {params.row.userName || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.userEmail || "—"}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "userRole",
      width: 120,
      renderHeader: () => <strong>{"ROLE"}</strong>,
      renderCell: (params) => (
        <Chip
          label={params.value || "admin"}
          size="small"
          color="error"
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "userOnboardingStatus",
      width: 140,
      renderHeader: () => <strong>{"ONBOARDING"}</strong>,
      renderCell: (params) => {
        const status = (params.value || "").toLowerCase();
        const color =
          status === "completed"
            ? "success"
            : status === "waiting"
              ? "warning"
              : "default";
        return (
          <Chip
            label={params.value || "unknown"}
            size="small"
            color={color}
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
        );
      },
    },
    {
      field: "createdAt",
      width: 170,
      renderHeader: () => <strong>{"JOINED AT"}</strong>,
      valueFormatter: (item) => convertTime(item.value),
    },
    {
      field: "actions",
      width: 190,
      renderHeader: () => <strong>{"ACTION"}</strong>,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row as AdminRow;
        return (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setEditTarget(row);
                setEditName(row.userName || "");
                setEditEmail(row.userEmail || "");
                setEditPassword("");
                setEditError(null);
                setEditFieldErrors({});
                setOpenEditModal(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => {
                setDeleteTarget(row);
                setOpenDeleteModal(true);
              }}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  function CustomToolbar() {
    const [search, setSearch] = useState<string>("");
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between", mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <GridToolbarExport />
          <Button
            variant="outlined"
            onClick={() => {
              setCreateName("");
              setCreateEmail("");
              setCreatePassword("");
              setCreateError(null);
              setCreateFieldErrors({});
              setOpenCreateModal(true);
            }}
          >
            Create
          </Button>
        </Stack>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <TextField
            size="small"
            placeholder="search admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outlined" onClick={() => setSearchFilter(search)}>
            Search
          </Button>
        </Stack>
      </GridToolbarContainer>
    );
  }

  return (
    <Box>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Admins",
            link: "/admins",
            icon: <IconMenus.admin fontSize="small" />,
          },
        ]}
      />
      <Box
        sx={{
          width: "100%",
          "& .MuiDataGrid-columnHeaders": {
            fontWeight: 700,
            backgroundColor: "action.hover",
          },
        }}
      >
        <DataGrid
          rows={tableData}
          columns={columns}
          getRowId={(row: AdminRow) => row.userId}
          sx={{ padding: 2, backgroundColor: "background.default" }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          autoHeight
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{
            toolbar: CustomToolbar,
          }}
          rowCount={rowCount}
          paginationMode="server"
          loading={loading}
        />
      </Box>

      <Dialog
        open={openCreateModal}
        onClose={() => {
          if (!createSubmitting) {
            setOpenCreateModal(false);
            setCreateError(null);
            setCreateFieldErrors({});
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Tambah Admin</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nama Admin"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              fullWidth
              size="small"
              error={Boolean(createFieldErrors.userName)}
              helperText={createFieldErrors.userName}
            />
            <TextField
              label="Email Admin"
              type="email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              fullWidth
              size="small"
              error={Boolean(createFieldErrors.userEmail)}
              helperText={createFieldErrors.userEmail}
            />
            <TextField
              label="Password"
              type="password"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              fullWidth
              size="small"
              error={
                Boolean(createFieldErrors.userPassword) || Boolean(createError)
              }
              helperText={createFieldErrors.userPassword || createError}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!createSubmitting) {
                setOpenCreateModal(false);
                setCreateError(null);
              }
            }}
            disabled={createSubmitting}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              const values: AdminCreateValues = {
                userName: createName.trim(),
                userEmail: createEmail.trim(),
                userPassword: createPassword,
              };

              const parsed = adminCreateSchema.safeParse(values);
              if (!parsed.success) {
                const fieldErrors: Partial<
                  Record<keyof AdminCreateValues, string>
                > = {};
                parsed.error.issues.forEach((issue) => {
                  const field = issue.path[0] as keyof AdminCreateValues;
                  if (!fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                  }
                });
                setCreateFieldErrors(fieldErrors);
                setCreateError(null);
                return;
              }

              setCreateSubmitting(true);
              setCreateError(null);
              setCreateFieldErrors({});
              try {
                await createAdmin.mutateAsync({
                  path: "/admins",
                  body: {
                    userName: parsed.data.userName,
                    userEmail: parsed.data.userEmail,
                    userPassword: parsed.data.userPassword,
                  },
                });
                setOpenCreateModal(false);
                setCreateName("");
                setCreateEmail("");
                setCreatePassword("");
              } catch (error: any) {
                console.error(error);
                setCreateError(error?.message ?? "Gagal menambah admin.");
              } finally {
                setCreateSubmitting(false);
              }
            }}
            disabled={createSubmitting}
          >
            {createSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditModal}
        onClose={() => {
          if (!editSubmitting) {
            setOpenEditModal(false);
            setEditError(null);
            setEditFieldErrors({});
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nama Admin"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              size="small"
              error={Boolean(editFieldErrors.userName)}
              helperText={editFieldErrors.userName}
            />
            <TextField
              label="Email Admin"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              fullWidth
              size="small"
              error={Boolean(editFieldErrors.userEmail)}
              helperText={editFieldErrors.userEmail}
            />
            <TextField
              label="Password (opsional)"
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              fullWidth
              size="small"
              error={
                Boolean(editFieldErrors.userPassword) || Boolean(editError)
              }
              helperText={editFieldErrors.userPassword || editError}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!editSubmitting) {
                setOpenEditModal(false);
                setEditError(null);
                setEditFieldErrors({});
              }
            }}
            disabled={editSubmitting}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!editTarget) return;
              const values: AdminCreateValues = {
                userName: editName.trim(),
                userEmail: editEmail.trim(),
                userPassword: editPassword, // boleh kosong (opsional)
              };

              const parsed = adminCreateSchema.safeParse(values);
              if (!parsed.success) {
                const fieldErrors: Partial<
                  Record<keyof AdminCreateValues, string>
                > = {};
                parsed.error.issues.forEach((issue) => {
                  const field = issue.path[0] as keyof AdminCreateValues;
                  if (!fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                  }
                });
                setEditFieldErrors(fieldErrors);
                setEditError(null);
                return;
              }

              setEditSubmitting(true);
              setEditError(null);
              setEditFieldErrors({});
              try {
                const body: any = {
                  userId: editTarget.userId,
                  userName: parsed.data.userName,
                  userEmail: parsed.data.userEmail,
                };
                if (parsed.data.userPassword) {
                  body.userPassword = parsed.data.userPassword;
                }

                await updateAdmin.mutateAsync({
                  path: "/admins",
                  body,
                });
                setOpenEditModal(false);
              } catch (error: any) {
                console.error(error);
                setEditError(error?.message ?? "Gagal mengupdate admin.");
              } finally {
                setEditSubmitting(false);
              }
            }}
            disabled={editSubmitting}
          >
            {editSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        onClose={() => {
          if (!deleteSubmitting) {
            setOpenDeleteModal(false);
            setDeleteTarget(null);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Hapus Admin</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteTarget
              ? `Yakin ingin menghapus admin \"${deleteTarget.userName}\" (${deleteTarget.userEmail})?`
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!deleteSubmitting) {
                setOpenDeleteModal(false);
                setDeleteTarget(null);
              }
            }}
            disabled={deleteSubmitting}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (!deleteTarget) return;
              setDeleteSubmitting(true);
              try {
                await deleteAdmin.mutateAsync({
                  path: `/admins/${deleteTarget.userId}`,
                });
                setOpenDeleteModal(false);
                setDeleteTarget(null);
              } catch (error) {
                console.error(error);
              } finally {
                setDeleteSubmitting(false);
              }
            }}
            disabled={deleteSubmitting}
          >
            {deleteSubmitting ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
