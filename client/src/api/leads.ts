import axios from "axios";
import api from "./axios";
import type { ApiResponse, Lead, LeadFilters } from "../types";

export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ErrorResponse {
  message?: string;
}

const getAxiosMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const getLeads = async (
  filters: Partial<LeadFilters>,
): Promise<LeadsResponse> => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.source) params.append("source", filters.source);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.page) params.append("page", filters.page.toString());

  const res = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
  return {
    leads: res.data.data || [],
    pagination: res.data.pagination!,
  };
};

export const createLead = async (
  data: Omit<Lead, "_id" | "createdBy" | "createdAt" | "updatedAt">,
): Promise<Lead> => {
  try {
    const res = await api.post<ApiResponse<Lead>>("/leads", data);
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

export const updateLead = async (
  id: string,
  data: Partial<Lead>,
): Promise<Lead> => {
  try {
    const res = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
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

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeads = async (): Promise<void> => {
  const res = await api.get("/leads/export", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "leads.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
