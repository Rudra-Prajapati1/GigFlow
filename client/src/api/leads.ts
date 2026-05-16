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
  const res = await api.post<ApiResponse<Lead>>("/leads", data);
  return res.data.data!;
};

export const updateLead = async (
  id: string,
  data: Partial<Lead>,
): Promise<Lead> => {
  const res = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
  return res.data.data!;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeads = (): void => {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  window.open(`${baseURL}/leads/export?token=${token}`, "_blank");
};
