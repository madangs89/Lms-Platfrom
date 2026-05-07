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
  isSelectRequired = false,
  selectedId,
  setSelectedId,
}) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  // Build final columns without mutating the original prop
  let finalColumns = [...columns];
  if (isSelectRequired)
    finalColumns = [{ key: "select", label: "" }, ...finalColumns];
  if (isActionRequired)
    finalColumns = [...finalColumns, { key: "actions", label: "Actions" }];

  return (
    <div className="overflow-x-auto w-full scrollbar-thin ">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow style={{ borderBottom: `1px solid ${colors.border}` }}>
            {finalColumns.map((h) => (
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
              <SkeletonRow key={i} colors={colors} cols={finalColumns.length} />
            ))}

          {!isLoading && data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={finalColumns.length}
                className="text-center py-10 text-[13px]"
                style={{ color: colors.textMuted }}
              >
                No Data found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            data.map((row) => (
              <TableRow
                key={row.id}
                style={{ borderBottom: `1px solid ${colors.divider}` }}
              >
                {finalColumns.map((col) => {
                  // Radio select column
                  if (col.key === "select" && isSelectRequired) {
                    return (
                      <TableCell
                        key="select"
                        className="w-10 text-center cursor-pointer"
                        onClick={() => setSelectedId && setSelectedId(row.id)}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: `2px solid ${selectedId === row.id ? colors.primary : colors.inputBorder}`,
                            background:
                              selectedId === row.id
                                ? colors.primary
                                : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            transition: "all 0.15s",
                          }}
                        >
                          {selectedId === row.id && (
                            <div
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "#fff",
                              }}
                            />
                          )}
                        </div>
                      </TableCell>
                    );
                  }

                  // Actions column
                  if (col.key === "actions" && isActionRequired) {
                    return (
                      <TableCell
                        key="actions"
                        onClick={() => {
                          setModalOpen && setModalOpen(true);
                          setCurrentId && setCurrentId(row.id);
                        }}
                        className="cursor-pointer w-10 text-center"
                      >
                        <Settings color={colors.textSecondary} size={20} />
                      </TableCell>
                    );
                  }

                  // Normal column
                  const config = template[col.key];
                  if (!config) return null;
                  const cellData = config.getter(row);

                  return (
                    <React.Fragment key={col.key}>
                      {config.renderer(cellData)}
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableTemplate;
