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
import { BookOpen, Loader2 } from "lucide-react";


const BranchSpecialization = ({ theme, branch, enabled }) => {
  const fetchSpecialization = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/specialization/modal/branch/${branch.id}`,
      { withCredentials: true },
    );
    return data.data;
  };

  const {
    data: specializations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["branch-specializations-modal", branch.id],
    queryFn: fetchSpecialization,
    enabled: enabled && !!branch.id,
  });

  // ── Loading state ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <SectionCard title="Specializations" theme={theme}>
        <div className="flex flex-col items-center py-10 gap-3">
          <Loader2
            size={26}
            className="animate-spin"
            style={{ color: theme.primary }}
          />
          <p className="text-[13px]" style={{ color: theme.textMuted }}>
            Loading specializations…
          </p>
        </div>
      </SectionCard>
    );
  }

  // ── Error state ────────────────────────────────────────────────
  if (isError) {
    return (
      <SectionCard title="Specializations" theme={theme}>
        <div className="flex flex-col items-center py-10 gap-2">
          <BookOpen size={28} color={theme.textMuted} />
          <p className="text-[13px]" style={{ color: theme.textMuted }}>
            Failed to load specializations. Please try again.
          </p>
        </div>
      </SectionCard>
    );
  }

  // ── Empty state ────────────────────────────────────────────────
  if (specializations.length === 0) {
    return (
      <SectionCard title="Specializations" theme={theme}>
        <div className="flex flex-col items-center py-10 gap-2">
          <BookOpen size={28} color={theme.textMuted} />
          <p className="text-[13px]" style={{ color: theme.textMuted }}>
            No specializations found for this branch.
          </p>
        </div>
      </SectionCard>
    );
  }

  // ── Data table ─────────────────────────────────────────────────
  const HEADERS = ["Name", "Code", "Subjects", "Batches", "Sections", "Status"];

  return (
    <SectionCard title="Specializations" theme={theme}>
      <Table>
        <TableHeader>
          <TableRow
            style={{
              background: theme.primarySoft,
              borderColor: theme.border,
            }}
          >
            {HEADERS.map((h) => (
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
          {specializations.map((spec) => {
            // Total sections across all batches of this specialization
            const totalSections =
              spec.batches?.reduce(
                (sum, batch) => sum + (batch._count?.section ?? 0),
                0,
              ) ?? 0;

            return (
              <TableRow key={spec.id} style={{ borderColor: theme.divider }}>
                {/* Name */}
                <TableCell
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {spec.name ?? "—"}
                </TableCell>

                {/* Code */}
                <TableCell>
                  <code
                    className="text-[12px] px-2 py-0.5 rounded"
                    style={{
                      background: theme.primarySoft,
                      color: theme.primary,
                    }}
                  >
                    {spec.code ?? "—"}
                  </code>
                </TableCell>

                {/* Subjects count */}
                <TableCell
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textSecondary }}
                >
                  {spec._count?.subjects ?? 0}
                </TableCell>

                {/* Batches count */}
                <TableCell
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textSecondary }}
                >
                  {spec._count?.batches ?? 0}
                </TableCell>

                {/* Sections count (sum across all batches) */}
                <TableCell
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textSecondary }}
                >
                  {totalSections}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge active={spec.is_active} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </SectionCard>
  );
};

export default BranchSpecialization;
