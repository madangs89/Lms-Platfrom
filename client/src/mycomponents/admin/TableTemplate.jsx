import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonRow from "@/mycomponents/shared/SkeletonRow";
import { Settings } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const TableTemplate = ({
  columns,
  data,
  isLoading = false,
  LIMIT = 10,
  template,
  isActionRequired = false,
  setModalOpen,
  setCurrentId,
}) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  return (
    <div className="overflow-x-auto w-full scrollbar-thin ">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow style={{ borderBottom: `1px solid ${colors.border}` }}>
            {columns.map((h) => (
              <TableHead
                key={h.key}
                className="text-[11px] sm:text-[12px] font-medium whitespace-nowrap px-3 sm:px-4"
                style={{ color: colors.textSecondary }}
              >
                {h.label}
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
                No Data found.
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
                  {columns.map((col) => {
                    if (col.key === "actions" && isActionRequired) {
                      return (
                        <TableCell
                          onClick={() => {
                            setModalOpen && setModalOpen(true);
                            setCurrentId && setCurrentId(row.id);
                          }}
                          key={col.key}
                          className="cursor-pointer w-10 text-center"
                        >
                          <Settings color={colors.textSecondary} size={20} />
                        </TableCell>
                      );
                    } else {
                      const config = template[col.key];
                      if (!config) return null;
                      const cellData = config.getter(row);

                      return (
                        <React.Fragment key={col.key}>
                          {config.renderer(cellData)}
                        </React.Fragment>
                      );
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
