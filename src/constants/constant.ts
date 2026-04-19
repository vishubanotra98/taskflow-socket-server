export const PORT = process.env.PORT || 8080;
export const BASE_URL_CLIENT = process.env.BASE_URL_CLIENT;

export const DEFAULT_STATUSES = [
  { name: "Todo", color: "#6b7280", order: 1, isDefault: true },
  {
    name: "In Progress",
    color: "#2563eb",
    order: 2,
    isDefault: false,
  },
  {
    name: "Done",
    color: "#16a34a",
    order: 3,
    isDefault: false,
  },
  {
    name: "Canceled",
    color: "#ef4444",
    order: 4,
    isDefault: false,
  },
];
