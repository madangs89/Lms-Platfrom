import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonRow from "@/mycomponents/shared/SkeletonRow";
import React from "react";

const TableTemplate = ({
  columns,
  data,
  isLoading,
  colors,
  LIMIT = 10,
  template,
}) => {
  return (
    <div className="overflow-auto w-full ">
      <Table className="w-full">
        <TableHeader>
          <TableRow style={{ borderBottom: `1px solid ${colors.border}` }}>
            {columns.map((h) => (
              <TableHead
                key={h}
                className="text-[11px] sm:text-[12px] font-medium whitespace-nowrap px-3 sm:px-4"
                style={{ color: colors.textSecondary }}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: LIMIT }).map((_, i) => (
              <SkeletonRow key={i} colors={colors} cols={columns.length} />
            ))}

          {!isLoading && data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 text-[13px]"
                style={{ color: colors.textMuted }}
              >
                No users found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            data.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  style={{ borderBottom: `1px solid ${colors.divider}` }}
                >
                  {Object.keys(row).map((key) => {
                    if (template[key]) {
                      const d = template[key].getter(row);
                      console.log(key, d);
                      return template[key].renderer(d);
                    }
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableTemplate;
