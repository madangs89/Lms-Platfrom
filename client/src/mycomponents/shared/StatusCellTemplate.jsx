import { TableCell } from "@/components/ui/table";
import React from "react";
import { useSelector } from "react-redux";

const statusBadge = (status) =>
  ({
    active: { bg: "#e8f5e9", color: "#2e7d32" },
    inactive: { bg: "#fce4ec", color: "#c62828" },
    suspended: { bg: "#fff3e0", color: "#e65100" },
  })[status] ?? { bg: "#f0f0f0", color: "#555" };

const StatusCellTemplate = ({ data }) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const sb = statusBadge(data.name);
  return (
    <TableCell key={data.id} className="px-3 sm:px-4 py-2.5">
      <span
        className="px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium capitalize whitespace-nowrap"
        style={{ background: sb.bg, color: sb.color }}
      >
        {data.name}
      </span>
    </TableCell>
  );
};

export default StatusCellTemplate;
