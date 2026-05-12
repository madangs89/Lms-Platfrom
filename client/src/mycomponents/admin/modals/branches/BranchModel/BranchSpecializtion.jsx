import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SectionCard from "@/mycomponents/admin/SectionCard";
import StatusBadge from "@/mycomponents/admin/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookOpen } from "lucide-react";
import React from "react";

const BranchSpecialization = ({ theme, branch }) => {
  const fetchSpecialization = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/specialization/modal/branch/${branch.id}`,
      {
        withCredentials: true,
      },
    );
    return data.data;
  };

  const specializationQuery = useQuery({
    queryKey: ["branch-specializations-modal", branch.id],
    queryFn: fetchSpecialization,
  });

  const specializations = specializationQuery.data || [];

  return (
    <SectionCard title="All Branches" theme={theme}>
      {specializations.length === 0 ? (
        <div className="flex flex-col items-center py-10 gap-2">
          <BookOpen size={28} color={theme.textMuted} />
          <p className="text-[13px]" style={{ color: theme.textMuted }}>
            No branches found for this department
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow
              style={{
                background: theme.primarySoft,
                borderColor: theme.border,
              }}
            >
              {["Branch Name", "Code", "Specializations", "Status"].map((h) => (
                <TableHead
                  key={h}
                  className="text-[12px] font-bold uppercase tracking-wide"
                  style={{ color: theme.textMuted }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {specializations.map((b) => (
              <TableRow key={b.id} style={{ borderColor: theme.divider }}>
                <TableCell
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {b?.name}
                </TableCell>
                <TableCell>
                  <code
                    className="text-[12px] px-2 py-0.5 rounded"
                    style={{
                      background: theme.primarySoft,
                      color: theme.primary,
                    }}
                  >
                    {b?.code}
                  </code>
                </TableCell>
                <TableCell
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textSecondary }}
                >
                  {b?._count?.specializations}
                </TableCell>
                <TableCell>
                  <StatusBadge active={b.is_active} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
};

export default BranchSpecialization;
