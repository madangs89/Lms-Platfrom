import { TableCell } from "@/components/ui/table";
import React from "react";
import { useSelector } from "react-redux";

const roleBadge = (role) =>
  ({
    student: { bg: "#e8f5e9", color: "#2e7d32" },
    lecturer: { bg: "#e3f2fd", color: "#1565c0" },
    faculty: { bg: "#e3f2fd", color: "#1565c0" },
    hod: { bg: "#fff8e1", color: "#f57f17" },
    admin: { bg: "#fce4ec", color: "#c62828" },
  })[role] ?? { bg: "#f0f0f0", color: "#555" };

const RoleCellTemplate = ({ data }) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];
  return (
    <TableCell className="px-3 sm:px-4 py-2.5">
      {data?.roles && data.roles.length > 0
        ? data.roles.map((r) => {
            const rb = roleBadge(r.role);

            return (
              <span
                className="px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium capitalize whitespace-nowrap"
                style={{ background: rb.bg, color: rb.color }}
              >
                {r.role}
              </span>
            );
          })
        : data?.name || "—"}
    </TableCell>
  );
};

export default RoleCellTemplate;
