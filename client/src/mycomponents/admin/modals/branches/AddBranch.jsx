import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useDepartments } from "@/hooks/useDepartments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  department_id: "",
  name: "",
  code: "",
  status: "active",
};

const AddBranch = ({ open, onClose }) => {
  const currentTheme = useSelector((s) => s.theme.currentTheme);
  const theme = useSelector((s) => s.theme[currentTheme]);
  const queryClient = useQueryClient();

  const [form, setForm] = useState(INITIAL_FORM);

  // ── Styles ──
  const inputStyle = {
    background: theme.inputBg,
    borderColor: theme.inputBorder,
    color: theme.inputText,
  };

  const departments = useDepartments({
    enabled: open,
  });

  useEffect(() => {
    if (departments.error) {
      toast.error(
        departments.error?.response?.data?.message ||
          departments.error.message ||
          "Failed to fetch departments",
      );
    }
  }, [departments.error]);

  const createBranches = async (payload) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/branch/create`,
      payload,
      {
        withCredentials: true,
      },
    );

    return data;
  };

  const createBranchMutation = useMutation({
    mutationFn: createBranches,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches-counts"] });
      queryClient.invalidateQueries({ queryKey: ["branches-table"] });
      queryClient.invalidateQueries({ queryKey: ["branch-search"] });
      toast.success("Branch created successfully");
      resetAndClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to create branch",
      );
    },
  });

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = () => {
    if (!form.department_id) {
      toast.error("Department is required");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Branch name is required");
      return;
    }
    if (!form.code.trim()) {
      toast.error("Branch code is required");
      return;
    }

    createBranchMutation.mutate({
      department_id: form.department_id,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      is_active: form.status === "active",
    });
  };

  const resetAndClose = useCallback(() => {
    setForm(INITIAL_FORM);
    createBranchMutation.reset();
    onClose();
  }, [onClose]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent
        className="flex flex-col gap-0 p-0 overflow-hidden"
        style={{
          maxWidth: 580,
          width: "calc(100vw - 32px)",
          background: theme.surface,
          borderColor: theme.border,
          color: theme.textPrimary,
        }}
      >
        {/* ── Header ── */}
        <DialogHeader
          className="px-7 pt-6 pb-4 shrink-0"
          style={{ borderBottom: `1px solid ${theme.divider}` }}
        >
          <DialogTitle
            className="text-[20px] font-bold leading-snug"
            style={{ color: theme.textPrimary }}
          >
            Add Branch
          </DialogTitle>
          <DialogDescription
            className="text-[13px] mt-0.5"
            style={{ color: theme.textSecondary }}
          >
            Fill in the details to create a new branch.
          </DialogDescription>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="px-7 py-6 flex flex-col gap-5">
          {/* Department Select */}
          <div className="flex flex-col gap-1.5">
            <Label
              className="text-[13px] font-semibold"
              style={{ color: theme.textPrimary }}
            >
              Department <span style={{ color: theme.danger }}>*</span>
            </Label>
            <Select
              value={form.department_id}
              onValueChange={(val) => handleChange("department_id", val)}
              disabled={departments.isLoading}
            >
              <SelectTrigger className="h-9 text-sm focus:ring-1 focus:ring-offset-0">
                <SelectValue
                  placeholder={
                    departments.isLoading ? "Loading…" : "Select a department"
                  }
                />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: theme.surface,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              >
                {departments.data && departments.data.length > 0 ? (
                  departments.data.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))
                ) : (
                  <div
                    className="px-3 py-2 text-[13px]"
                    style={{ color: theme.textSecondary }}
                  >
                    {departments.isLoading ? (
                      <p>
                        Loading <Spinner />
                      </p>
                    ) : (
                      "No departments available"
                    )}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Branch Name + Code */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <Label
                className="text-[13px] font-semibold"
                style={{ color: theme.textPrimary }}
              >
                Branch Name <span style={{ color: theme.danger }}>*</span>
              </Label>
              <Input
                placeholder="Enter branch name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-9 text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <Label
                className="text-[13px] font-semibold"
                style={{ color: theme.textPrimary }}
              >
                Branch Code <span style={{ color: theme.danger }}>*</span>
              </Label>
              <Input
                placeholder="e.g. CSE-A"
                value={form.code}
                onChange={(e) =>
                  handleChange("code", e.target.value.toUpperCase())
                }
                className="h-9 text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5" style={{ maxWidth: 280 }}>
            <Label
              className="text-[13px] font-semibold"
              style={{ color: theme.textPrimary }}
            >
              Status <span style={{ color: theme.danger }}>*</span>
            </Label>
            <Select
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <SelectTrigger className="h-9 text-sm focus:ring-1 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: theme.surface,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              >
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter
          className="flex justify-end gap-3 px-7 py-5 shrink-0"
          style={{ borderTop: `1px solid ${theme.divider}` }}
        >
          <Button
            variant="outline"
            onClick={resetAndClose}
            disabled={createBranchMutation.isPending}
            className="text-[13px] font-semibold px-5 h-9 cursor-pointer"
            style={{
              background: "transparent",
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createBranchMutation.isPending}
            className="text-[13px] font-semibold cursor-pointer px-5 h-9 hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{
              background: theme.primary,
              color: "#fff",
              border: "none",
            }}
          >
            {createBranchMutation.isPending ? <Spinner /> : "Create Branch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranch;
