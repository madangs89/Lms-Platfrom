import SectionCard from "@/mycomponents/admin/SectionCard";
import StatusBadge from "@/mycomponents/admin/StatusBadge";
import { useDepartments } from "@/hooks/useDepartments";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import InfoRow from "@/mycomponents/admin/InfoRow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ─── Main component ───────────────────────────────────────────────────────────
const BranchUpdateDepartment = ({ theme, branch }) => {
  const currentDept = branch?.department;
  const queryClient = useQueryClient();
  const departments = useDepartments({});

  const [selectedDeptId, setSelectedDeptId] = useState("");
  const availableDepts = (departments.data ?? []).filter(
    (d) => d.id !== currentDept?.id,
  );

  // Toast on fetch error
  useEffect(() => {
    if (departments.error) {
      toast.error(
        departments.error?.response?.data?.message ||
          departments.error.message ||
          "Failed to fetch departments",
      );
    }
  }, [departments.error]);

  const updateDepartment = async ({ branchId, departmentId }) => {
    const { data } = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/branch/update/department`,
      {
        branch_id: branchId,
        department_id: departmentId,
      },
      {
        withCredentials: true,
      },
    );

    return data.branch;
  };

  const departmentUpdateMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: (data) => {
      toast.success("Department updated successfully");
      queryClient.invalidateQueries(["departments"]);
      queryClient.invalidateQueries(["branches-table"]);
      queryClient.invalidateQueries(["singleBranch"]);
      queryClient.invalidateQueries(["branches-counts"]);
      queryClient.invalidateQueries(["branch-search"]);
      queryClient.invalidateQueries(["singleBranch"]);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update department",
      );
    },
  });

  const handleUpdate = () => {
    if (!selectedDeptId) {
      toast.error("Please select a department first.");
      return;
    }
    departmentUpdateMutation.mutate({
      branchId: branch.id,
      departmentId: selectedDeptId,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Current Department Card ──────────────────────────────────────── */}
      <SectionCard title="Current Department" theme={theme}>
        {currentDept ? (
          <div
            className="rounded-lg px-4 py-1 divide-y"
            style={{ divideColor: theme.divider }}
          >
            {/* Department icon + name header */}
            <div className="flex items-center gap-3 py-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: theme.primarySoft }}
              >
                <Building2 size={18} style={{ color: theme.primary }} />
              </div>
              <div>
                <p
                  className="text-[14px] font-bold"
                  style={{ color: theme.textPrimary }}
                >
                  {currentDept.name}
                </p>
                <p className="text-[11px]" style={{ color: theme.textMuted }}>
                  Assigned department
                </p>
              </div>
              <div className="ml-auto">
                <StatusBadge active={currentDept.is_active} />
              </div>
            </div>
            <InfoRow label="Code" theme={theme}>
              <code
                className="text-[12px] px-2 py-0.5 rounded"
                style={{
                  background: theme.primarySoft,
                  color: theme.primary,
                }}
              >
                {currentDept.code}
              </code>
            </InfoRow>
            <InfoRow label="Department Id" theme={theme}>
              <span
                className="text-[11px] font-mono"
                style={{ color: theme.textMuted }}
              >
                {currentDept.id}
              </span>
            </InfoRow>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 gap-2">
            <Building2 size={26} style={{ color: theme.textMuted }} />
            <p className="text-[13px]" style={{ color: theme.textMuted }}>
              No department assigned to this branch.
            </p>
          </div>
        )}
      </SectionCard>

      {/* ── Change Department Card ───────────────────────────────────────── */}
      <SectionCard title="Change Department" theme={theme}>
        <div className="flex flex-col gap-4 p-1">
          {/* Visual flow: current → new */}
          {currentDept && selectedDeptId && (
            <div
              className="flex items-center gap-2 text-[12px] rounded-lg px-3 py-2"
              style={{
                background: theme.primarySoft,
                color: theme.textSecondary,
              }}
            >
              <span
                className="font-semibold truncate"
                style={{ color: theme.textPrimary }}
              >
                {currentDept.name}
              </span>
              <ArrowRight
                size={14}
                style={{ color: theme.primary, flexShrink: 0 }}
              />
              <span
                className="font-semibold truncate"
                style={{ color: theme.primary }}
              >
                {availableDepts.find((d) => d.id === selectedDeptId)?.name ??
                  "—"}
              </span>
            </div>
          )}

          {/* Select */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[12px] uppercase tracking-wide font-semibold"
              style={{ color: theme.textMuted }}
            >
              Select New Department
            </label>

            {departments.isLoading ? (
              <div
                className="flex items-center gap-2 text-[13px] px-3 py-2 rounded-md border"
                style={{ borderColor: theme.border, color: theme.textMuted }}
              >
                <Loader2
                  size={14}
                  className="animate-spin"
                  style={{ color: theme.primary }}
                />
                Loading departments…
              </div>
            ) : (
              <Select
                value={selectedDeptId}
                onValueChange={setSelectedDeptId}
                disabled={
                  departmentUpdateMutation.isPending || departments.isLoading
                }
              >
                <SelectTrigger
                  className="text-[13px] h-9"
                  style={{
                    background: theme.cardBg ?? theme.background,
                    borderColor: theme.border,
                    color: selectedDeptId ? theme.textPrimary : theme.textMuted,
                  }}
                >
                  <SelectValue placeholder="Choose a department…" />
                </SelectTrigger>

                <SelectContent
                  style={{
                    background: theme.cardBg ?? theme.background,
                    borderColor: theme.border,
                  }}
                >
                  {availableDepts.length === 0 ? (
                    <div
                      className="px-3 py-4 text-[13px] text-center"
                      style={{ color: theme.textMuted }}
                    >
                      No other departments available.
                    </div>
                  ) : (
                    availableDepts.map((dept) => (
                      <SelectItem
                        key={dept.id}
                        value={dept.id}
                        className="text-[13px]"
                        style={{ color: theme.textPrimary }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{dept.name}</span>
                          <code
                            className="text-[11px] px-1.5 py-0.5 rounded"
                            style={{
                              background: theme.primarySoft,
                              color: theme.primary,
                            }}
                          >
                            {dept.code}
                          </code>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Update button */}
          <Button
            onClick={handleUpdate}
            disabled={
              !selectedDeptId ||
              departmentUpdateMutation.isPending ||
              departments.isLoading
            }
            className="w-full h-9 text-[13px] font-semibold gap-2"
            style={{
              background: selectedDeptId ? theme.primary : theme.primarySoft,
              color: selectedDeptId
                ? (theme.primaryForeground ?? "#fff")
                : theme.textMuted,
              cursor: !selectedDeptId ? "not-allowed" : "pointer",
            }}
          >
            {departmentUpdateMutation.isPending ? (
              <>
                <Spinner size={14} />
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Update Department
              </>
            )}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default BranchUpdateDepartment;
