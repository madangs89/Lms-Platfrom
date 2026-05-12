import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import SectionCard from "@/mycomponents/admin/SectionCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const BranchEdit = ({ theme, branch }) => {
  const [name, setName] = useState(branch?.name);
  const [code, setCode] = useState(branch?.code);
  const [active, setActive] = useState(branch?.is_active);
  const [initialData, setInitialData] = useState({
    name: branch?.name,
    code: branch?.code,
    active: branch?.is_active,
  });
  const queryClient = useQueryClient();

  const updateBranch = async (payload) => {
    const { branchName, branchCode, branchIs_active } = payload;
    const { data } = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/branch/update/info/${branch.id}`,
      { name: branchName, code: branchCode, is_active: branchIs_active },
      { withCredentials: true },
    );
    return data.branch;
  };

  const updateBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      toast.success("Branch updated successfully");
      queryClient.invalidateQueries(["singleBranch"]);
      queryClient.invalidateQueries(["branches-table"]);
      queryClient.invalidateQueries(["branches-counts"]);
      queryClient.invalidateQueries(["branch-search"]);
      setInitialData({ name, code, active });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to update branch. Try again.",
      );
    },
  });

  const hasChanges =
    name !== initialData.name ||
    code !== initialData.code ||
    active !== initialData.active;

  const handleSave = () => {
    if (!name.trim() || !code.trim()) {
      toast.error("Branch name and code cannot be empty");
      return;
    }
    if (!hasChanges) {
      toast.error("No changes detected");
      return;
    }
    updateBranchMutation.mutate({
      branchName: name,
      branchCode: code,
      branchIs_active: active,
    });
  };

  return (
    <div className="max-w-lg">
      <SectionCard title="Edit Branch Details" theme={theme}>
        <div className="flex flex-col gap-5">
          {[
            { label: "Branch Name", value: name, set: setName },
            { label: "Branch Code", value: code, set: setCode },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <Label
                className="text-[13px] font-semibold"
                style={{ color: theme.textPrimary }}
              >
                {label} <span style={{ color: theme.danger }}>*</span>
              </Label>
              <Input
                value={value}
                onChange={(e) => set(e.target.value)}
                className="h-9 text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
                style={{
                  background: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.inputText,
                }}
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <Label
              className="text-[13px] font-semibold"
              style={{ color: theme.textPrimary }}
            >
              Status
            </Label>
            <div className="flex gap-2">
              {[true, false].map((v) => {
                const selected = active === v;
                return (
                  <button
                    key={String(v)}
                    onClick={() => setActive(v)}
                    className="px-5 py-2 rounded-lg text-[13px] font-bold transition-all"
                    style={{
                      border: `2px solid ${selected ? theme.primary : theme.border}`,
                      background: selected ? theme.primarySoft : "transparent",
                      color: selected ? theme.primary : theme.textMuted,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {v ? "Active" : "Inactive"}
                  </button>
                );
              })}
            </div>
          </div>

          {updateBranchMutation.isError && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-[12px]">
                {updateBranchMutation.error?.response?.data?.message ||
                  "Failed to save changes."}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSave}
            disabled={updateBranchMutation.isPending || !hasChanges}
            className="h-9 text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: theme.primary, color: "#fff", border: "none" }}
          >
            {updateBranchMutation.isPending ? <Spinner /> : "Save Changes"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default BranchEdit;
