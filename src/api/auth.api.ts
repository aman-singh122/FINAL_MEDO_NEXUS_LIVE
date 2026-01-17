import API from "@/lib/axios";

/* ================= AUTH TYPES ================= */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

/* ================= AUTH APIS ================= */

// REGISTER
export const registerUser = (data: RegisterPayload) =>
  API.post("/auth/register", data);

// LOGIN
export const loginUser = (data: LoginPayload) =>
  API.post("/auth/login", data);

// LOGOUT
export const logoutUser = () =>
  API.post("/auth/logout");

// CURRENT USER
export const getCurrentUser = () =>
  API.get("/auth/me");

