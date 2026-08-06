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
  payoutId: string | null;

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

export interface GetAllPayoutsResponse {
  payouts: Payout[];
  pagination: Pagination;
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

export interface GetAllCommissionsResponse {
  commissions: Commission[];
  pagination: Pagination;
}

export interface AdminReferral {
  id: string;

  name: string;

  email: string;

  joinedAt: string;

  affiliate: {
    id: string;
    name: string;
    email: string;
  };

  totalPurchases: number;

  totalPurchaseAmount: number;

  totalCommission: number;

  status:
  | "ACTIVE"
  | "PENDING_PURCHASE";
}

export interface GetReferralHistoryResponse {
  referrals: AdminReferral[];

  pagination: Pagination;
}


export const adminApi = {
  getAllCommissions: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) =>
    api.get<ApiResponse<GetAllCommissionsResponse>>(
      "/admin/commissions",
      {
        params,
      }
    ),

  getReferralHistory: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) =>
    api.get<ApiResponse<GetReferralHistoryResponse>>(
      "/admin/referrals",
      {
        params,
      }
    ),

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

export interface DashboardData {
  role: "USER" | "ADMIN";

  totalUsers?: number;

  totalPurchases: number;

  totalReferrals?: number;

  totalCommissions?: number;

  pendingCommissions?: number;

  pendingCommission?: number;

  approvedCommission?: number;

  paidCommission?: number;

  totalEarnings?: number;

  totalPayouts: number;

  pendingPayouts?: number;
}

export interface Referral {
  id: string;
  name: string;
  email: string;
  referralCode: string;

  joinedAt: string;

  totalPurchases: number;
  totalPurchaseAmount: number;
  totalCommissionEarned: number;

  status:
  | "ACTIVE"
  | "PENDING_PURCHASE";
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;

  joinedAt: string;

  referralCount: number;

  totalSales: number;

  totalCommission: number;

  availableBalance: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetAllAffiliatesResponse {
  affiliates: Affiliate[];
  pagination: Pagination;
}

export interface AffiliateDetails {
  id: string;
  name: string;
  email: string;
  referralCode: string;

  referrals: Referral[];

  purchases: Purchase[];

  commissions: Commission[];

  payouts: Payout[];

  stats: {
    referralCount: number;

    totalSales: number;

    totalCommission: number;

    approvedCommission: number;

    paidCommission: number;

    availableBalance: number;
  };
}

export interface PlatformStats {
  totalUsers: number;

  totalAffiliates: number;

  totalReferrals: number;

  totalPurchases: number;

  totalRevenue: number;

  totalCommission: number;

  pendingCommissionAmount: number;

  approvedCommissionAmount: number;

  paidCommissionAmount: number;

  pendingPayoutAmount: number;

  approvedPayoutAmount: number;
}

export const dashboardApi = {
  getDashboard: () =>
    api.get<ApiResponse<DashboardData>>(
      "/dashboard"
    ),
};

export const commissionApi = {

  getMyCommissions: () =>
    api.get<ApiResponse<Commission[]>>(
      "/commissions"
    ),

  getAllAffiliates: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) =>
    api.get<
      ApiResponse<GetAllAffiliatesResponse>
    >("/affiliate", {
      params,
    }),

  getAffiliateDetails: (
    affiliateId: string
  ) =>
    api.get<ApiResponse<AffiliateDetails>>(
      `/affiliate/${affiliateId}`
    ),

  getTopAffiliates: () =>
    api.get<ApiResponse<Affiliate[]>>(
      "/affiliate/top-affiliates"
    ),

  getPlatformStats: () =>
    api.get<ApiResponse<PlatformStats>>(
      "/affiliate/platform-stats"
    ),

};

export const payoutApi = {
  requestPayout: (
  commissionIds: string[]
) =>
  api.post<ApiResponse<Payout>>(
    "/payouts/request",
    {
      commissionIds,
    }
  ),

  getMyPayouts: () =>
    api.get<ApiResponse<Payout[]>>("/payouts/my"),

  getAllPayouts: (params?: {
    page?: number;
    limit?: number;
  }) =>
    api.get<ApiResponse<GetAllPayoutsResponse>>(
      "/payouts/admin",
      {
        params,
      }
    ),

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

export const referralApi = {
  getMyReferrals: () =>
    api.get<ApiResponse<Referral[]>>(
      "/referrals"
    ),
};