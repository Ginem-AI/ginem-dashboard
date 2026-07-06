import type { IUser } from "@/types/User";
import type { AdminCreateValues } from "@/utils/validators/adminSchema";
import { apiClient } from "./api";
import type { PaginatedResponse } from "./types";

export interface AdminUpdatePayload {
  userId: number;
  userName: string;
  userEmail: string;
  userPassword?: string;
}

export interface AdminListParams {
  page: number;
  size: number;
  search?: string;
}

export const userService = {
  getMyProfile: () => apiClient.get<IUser>("/my-profiles"),

  getAdmins: (params: AdminListParams) =>
    apiClient.getTableData<IUser>("/admins", {
      page: params.page,
      size: params.size,
      filter: { search: params.search },
    }),

  createAdmin: (payload: AdminCreateValues) =>
    apiClient.post("/admins", payload),

  updateAdmin: (payload: AdminUpdatePayload) =>
    apiClient.patch("/admins", payload),

  deleteAdmin: (userId: number) => apiClient.remove(`/admins/${userId}`),
};

export type { PaginatedResponse };
