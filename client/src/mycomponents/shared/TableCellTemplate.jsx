import { TableCell } from "@/components/ui/table";
import React from "react";
import { useSelector } from "react-redux";

const TableCellTemplate = ({ data }) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  return (
    <TableCell
      className="px-4 py-2.5 text-[13px] max-w-[160px]"
      style={{ color: colors.textPrimary }}
    >
      <span className="truncate block">{data.name}</span>
    </TableCell>
  );
};

export default TableCellTemplate;
