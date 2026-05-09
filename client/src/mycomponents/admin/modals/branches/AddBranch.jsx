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
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const AddBranch = ({ open, onClose }) => {
  const currentTheme = useSelector((s) => s.theme.currentTheme);
  const theme = useSelector((s) => s.theme[currentTheme]);
  const inputStyle = {
    background: theme.inputBg,
    borderColor: theme.inputBorder,
    color: theme.inputText,
  };
  const queryClient = useQueryClient();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="flex flex-col gap-0 p-0 overflow-hidden"
        style={{
          maxWidth: 680,
          width: "calc(100vw - 32px)",
          maxHeight: "92vh",
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
            Add Department
          </DialogTitle>
          <DialogDescription
            className="text-[13px] mt-0.5"
            style={{ color: theme.textSecondary }}
          >
            Fill in the details to create a new department.
          </DialogDescription>
        </DialogHeader>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-7">
          {/* ─── Section 1 — Department Information ─── */}
          <section className="py-5">
            <h3
              className="text-[15px] font-bold mb-4"
              style={{ color: theme.textPrimary }}
            >
              1. Department Information
            </h3>

            {/* Name + Code — side by side, wrap on small screens */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                <Label
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  Department Name <span style={{ color: theme.danger }}>*</span>
                </Label>
                <Input
                  placeholder="Enter department name"
                  value={""}
                  //   onChange={}
                  className="h-9 text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                <Label
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  Department Code <span style={{ color: theme.danger }}>*</span>
                </Label>
                <Input
                  placeholder="Enter unique department code"
                  //   value={deptCode}
                  //   onChange={(e) => setDeptCode(e.target.value)}
                  className="h-9 text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
                  style={inputStyle}
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
              <Select>
                <SelectTrigger
                  className="h-9 text-sm focus:ring-1 focus:ring-offset-0"
                  style={inputStyle}
                >
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
          </section>

          {/* Thin divider */}
          <div className="h-px w-full" style={{ background: theme.divider }} />

          {/* ─── Section 2 — Assign HOD ─── */}
          <section className="py-5">
            <h3
              className="text-[15px] font-bold mb-1"
              style={{ color: theme.textPrimary }}
            >
              2. Assign Head of Department (HOD)
            </h3>
            <p
              className="text-[13px] mb-4"
              style={{ color: theme.textSecondary }}
            >
              Search and select a user to assign as Head of Department.
            </p>

            {/* Info note */}
            <div
              className="flex gap-2.5 items-start rounded-lg mt-3.5 p-3"
              style={{
                background: theme.primarySoft,
                border: `1px solid ${theme.border}`,
              }}
            >
              <span className="text-base shrink-0 mt-px">ℹ️</span>
              <p
                className="text-[13px] leading-relaxed m-0"
                style={{ color: theme.textSecondary }}
              >
                <strong style={{ color: theme.textPrimary }}>Note:</strong> A
                single user cannot be the HOD of two departments. If the
                selected user is already assigned as HOD of another department,
                they will be removed from that department and assigned here.
              </p>
            </div>
          </section>
        </div>

        {/* ── Footer ── */}
        <DialogFooter
          className="flex justify-end gap-3 px-7 py-6 shrink-0"
          style={{ borderTop: `1px solid ${theme.divider}` }}
        >
          <Button
            variant="outline"
            // onClick={resetAndClose}
            className="text-[13px] font-semibold px-5 h-9"
            style={{
              background: "transparent",
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          >
            Cancel
          </Button>
          <Button
            // onClick={handleSubmit}
            // disabled={createDeptMutation.isPending}
            className="text-[13px] font-semibold px-5 h-9 hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{
              background: theme.primary,
              color: "#fff",
              border: "none",
            }}
          >
            {"Create Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranch;
