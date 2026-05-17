import axios from "axios";
import api from "./axios";
import type { ApiResponse, User } from "../types";

interface AuthData {
  token: string;
  user: User;
}

interface ErrorResponse {
  message?: string;
  errors?: { msg: string }[];
}

const getAxiosMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const data = error.response?.data;
    // express-validator validation errors array
    if (data?.errors && data.errors.length > 0) {
      return data.errors[0].msg;
    }
    // general error message
    return data?.message || fallback;
  }
  return fallback;
};
export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthData> => {
  try {
    const res = await api.post<ApiResponse<AuthData>>("/auth/register", {
      name,
      email,
      password,
    });
    return res.data.data!;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getAxiosMessage(error, "Request failed"), {
        cause: error,
      });
    }
    throw error;
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthData> => {
  try {
    const res = await api.post<ApiResponse<AuthData>>("/auth/login", {
      email,
      password,
    });
    return res.data.data!;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getAxiosMessage(error, "Request failed"), {
        cause: error,
      });
    }
    throw error;
  }
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<ApiResponse<User>>("/auth/me");
  return res.data.data!;
};
