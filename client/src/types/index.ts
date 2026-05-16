export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: "new" | "contacted" | "qualified" | "lost";
  source: "website" | "instagram" | "referral";
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
}

export interface LeadFilters {
  status: string;
  source: string;
  search: string;
  sort: "latest" | "oldest";
  page: number;
}
