import { TableCell } from "@/components/ui/table";
import React from "react";
import { useSelector } from "react-redux";

const UserCellTemplate = ({ data }) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const identifier = data?.roles?.some((r) => r.role === "student")
    ? `USN: ${data.usn ?? "—"}`
    : data?.roles?.some((r) => ["lecturer", "hod"].includes(r.role))
      ? `EMP: ${data.employee_id ?? "—"}`
      : null;
  return (
    <TableCell key={data.id} className="px-3 sm:px-4 py-2.5">
      {data && data.name ? (
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[11px] sm:text-[12px] font-semibold flex-shrink-0"
            style={{ background: colors.primary }}
          >
            {data?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p
              className="text-[12px] sm:text-[13px] font-medium leading-tight truncate"
              style={{ color: colors.textPrimary }}
            >
              {data?.name}
            </p>
            <p
              className="text-[12px] truncate max-w-[160px]"
              style={{ color: colors.textPrimary }}
            >
              {data?.email}
            </p>
            {identifier && (
              <p
                className="text-[10px] sm:text-[11px] truncate"
                style={{ color: colors.textSecondary }}
              >
                {identifier}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div>no hod</div>
      )}
    </TableCell>
  );
};

export default UserCellTemplate;
