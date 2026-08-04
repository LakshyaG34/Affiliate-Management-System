import api from "./api";

import type { User } from "@/types/auth.types";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface Purchase {
  id: string;
  purchaseAmount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  commissionAmount: number;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
  createdAt: string;
  updatedAt: string;

  affiliate: {
    id: string;
    name: string;
    email: string;
  };

  purchase: {
    id: string;
    purchaseAmount: number;

    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface Payout {
  id: string;
  payoutAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;

  affiliate: {
    id: string;
    name: string;
    email: string;
  };

  commissions: Commission[];
}

export interface CommissionSettingsData {
  id: number;
  commissionPercentage: number;
  minimumPayoutAmount: number;
}

interface CreatePurchaseData {
  purchaseAmount: number;
}


interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  register: (data: RegisterData) =>
    api.post<ApiResponse<User>>("/auth/register", data),

  login: (data: LoginData) =>
    api.post<ApiResponse<User>>("/auth/login", data),

  logout: () =>
    api.post("/auth/logout"),

  getCurrentUser: () =>
    api.get<ApiResponse<User>>("/auth/me"),
};

export const purchaseService = {
  createPurchase: (data: CreatePurchaseData) =>
    api.post<ApiResponse<Purchase>>("/purchases", data),
};


export const adminApi = {
  getAllCommissions: () =>
    api.get<ApiResponse<Commission[]>>("/admin/commissions"),

  updateCommissionStatus: (
    commissionId: string,
    status: "APPROVED" | "REJECTED"
  ) =>
    api.patch<ApiResponse<Commission>>(
      `/admin/commissions/${commissionId}`,
      {
        status,
      }
    ),

  getCommissionSettings: () =>
    api.get<ApiResponse<CommissionSettingsData>>(
      "/admin/commission-settings"
    ),

  updateCommissionSettings: (
    data: {
      commissionPercentage: number;
      minimumPayoutAmount: number;
    }
  ) =>
    api.put<ApiResponse<CommissionSettingsData>>(
      "/admin/commission-settings",
      data
    ),
};

export const commissionApi = {

  getMyCommissions: () =>
    api.get<ApiResponse<Commission[]>>(
      "/commissions"
    ),

};

export const payoutApi = {
  requestPayout: () =>
    api.post<ApiResponse<Payout>>("/payouts/request"),

  getMyPayouts: () =>
    api.get<ApiResponse<Payout[]>>("/payouts/my"),

  getAllPayouts: () =>
    api.get<ApiResponse<Payout[]>>("/payouts/admin"),

  updatePayoutStatus: (
    payoutId: string,
    status: "APPROVED" | "REJECTED"
  ) =>
    api.patch<ApiResponse<Payout>>(
      `/payouts/admin/${payoutId}`,
      {
        status,
      }
    ),
};