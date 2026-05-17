import { useState, useEffect, useCallback } from "react";
import type { Lead, LeadFilters } from "../types";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from "../api/leads";
import Navbar from "../components/Navbar";
import LeadFiltersBar from "../components/LeadFilters";
import LeadsTable from "../components/LeadsTable";
import Pagination from "../components/Pagination";
import LeadModal from "../components/LeadModal";
import DeleteModal from "../components/DeleteModal";
import useDebounce from "../hooks/useDebounce";

const DashboardPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<LeadFilters>({
    status: "",
    source: "",
    search: "",
    sort: "latest",
    page: 1,
  });

  // Debounce only the search field
  const debouncedSearch = useDebounce(filters.search, 500);

  // Lead modal state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      setError("");
      const result = await getLeads({
        status: filters.status,
        source: filters.source,
        sort: filters.sort,
        page: filters.page,
        search: debouncedSearch,
      });
      setLeads(result.leads);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError("Failed to load leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.status,
    filters.source,
    filters.sort,
    filters.page,
    debouncedSearch,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchLeads();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchLeads]);

  const handleFilterChange = (changed: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...changed }));
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setDeletingLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleExport = async () => {
    try {
      await exportLeads();
    } catch {
      setError("Failed to export leads.");
    }
  };

  const handleLeadSubmit = async (data: Partial<Lead>) => {
    if (editingLead) {
      await updateLead(editingLead._id, data);
    } else {
      await createLead(
        data as Omit<Lead, "_id" | "createdBy" | "createdAt" | "updatedAt">,
      );
    }
    fetchLeads();
  };

  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      setError("");
      await deleteLead(deletingLead._id);
      setIsDeleteModalOpen(false);
      setDeletingLead(null);
      fetchLeads();
    } catch (err) {
      console.error("Failed to delete lead:", err);
      setError("Failed to delete lead. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leads
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Manage and track your leads
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Filters */}
        <LeadFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onAddLead={handleAddLead}
        />

        {/* Table */}
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
        />

        {/* Pagination */}
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          total={total}
          onPageChange={(page) => handleFilterChange({ page })}
        />
      </main>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        lead={editingLead}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleLeadSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        lead={deletingLead}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardPage;
