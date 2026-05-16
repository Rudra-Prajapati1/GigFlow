type Status = "new" | "contacted" | "qualified" | "lost";

const colors: Record<Status, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }: { status: Status }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colors[status]}`}
  >
    {status}
  </span>
);

export default StatusBadge;
