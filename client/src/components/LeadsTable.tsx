import type { Lead } from "../types";
import StatusBadge from "./StatusBadge";
import { useAuth } from "../context/useAuth";

interface Props {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const LeadsTable = ({ leads, isLoading, onEdit, onDelete }: Props) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-400 dark:text-gray-300 text-lg">
          No leads found
        </p>
        <p className="text-gray-400 dark:text-gray-400 text-sm mt-1">
          Try adjusting your filters or add a new lead
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-300 font-medium">
                Name
              </th>
              <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-300 font-medium">
                Email
              </th>
              <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-300 font-medium">
                Status
              </th>
              <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-300 font-medium">
                Source
              </th>
              <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-300 font-medium">
                Created
              </th>
              <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-300 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {lead.name}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {lead.email}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 capitalize">
                  {lead.source}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(lead)}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      Edit
                    </button>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => onDelete(lead)}
                        className="text-red-500 hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
