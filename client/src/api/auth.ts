import api from "./axios";
import type { ApiResponse, User } from "../types";

interface AuthData {
  token: string;
  user: User;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthData> => {
  const res = await api.post<ApiResponse<AuthData>>("/auth/register", {
    name,
    email,
    password,
  });
  return res.data.data!;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthData> => {
  const res = await api.post<ApiResponse<AuthData>>("/auth/login", {
    email,
    password,
  });
  return res.data.data!;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<ApiResponse<User>>("/auth/me");
  return res.data.data!;
};
