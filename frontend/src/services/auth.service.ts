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