import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TableTemplate from "@/mycomponents/admin/TableTemplate";
import { userColumns, userTemplate } from "@/configs/template";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { useSearchFaculty } from "@/hooks/useSearchFaculty";
import SearchBar from "../../SearchBar";

export default function CreateDepartmentModal({ onClose, open }) {
  const currentTheme = useSelector((s) => s.theme.currentTheme);
  const theme = useSelector((s) => s.theme[currentTheme]);
  const queryClient = useQueryClient();
  const [debounceSearch, setDebounceSearch] = useState("");
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedUser, setSelectedUser] = useState(null);

  const searchFacultyQuery = useSearchFaculty({
    searchQuery: debounceSearch,
  });

  useEffect(() => {
    if (searchFacultyQuery.error) {
      toast.error(
        searchFacultyQuery.error.response?.data?.message ||
          searchFacultyQuery.error.message ||
          "Enable To Search Faculty",
      );
    }
  }, [searchFacultyQuery.error]);

  const facultyData = searchFacultyQuery.data ?? [];

  const createDepartment = async (payload) => {
    const { deptName, deptCode, status, selectedUser } = payload;
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/create`,
      {
        name: deptName,
        code: deptCode,
        status,
        hod_id: selectedUser,
      },
      { withCredentials: true },
    );
    return data;
  };

  const resetAndClose = () => {
    setDeptName("");
    setDeptCode("");
    setStatus("active");
    setDebounceSearch("");
    setSelectedUser(null);
    onClose?.();
  };

  const createDeptMutation = useMutation({
    mutationFn: () =>
      createDepartment({ deptName, deptCode, status, selectedUser }),
    onSuccess: (data) => {
      toast.success(data.message || "Department created successfully");
      queryClient.invalidateQueries(["search-faculty"]);
      queryClient.invalidateQueries(["departments-count"]);
      queryClient.invalidateQueries(["departments-for-table"]);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["userCounts"]);
      queryClient.invalidateQueries(["available-hod-departments"]);
      resetAndClose();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create department",
      );
    },
    retry: 3,
    retryDelay: 1000,
  });

  const handleSubmit = () => {
    if (!deptName.trim() || !deptCode.trim() || !status) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedUser) {
      toast.error("Please select a Head of Department (HOD)");
      return;
    }
    createDeptMutation.mutate({
      deptName,
      deptCode,
      status,
      selectedUser,
    });
  };

  const inputStyle = {
    background: theme.inputBg,
    borderColor: theme.inputBorder,
    color: theme.inputText,
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
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
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
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
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
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
              <Select value={status} onValueChange={setStatus}>
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

            {/* SearchBar + Table wrapped in a themed border */}
            <div
              className="rounded-lg border w-full overflow-hidden"
              style={{ borderColor: theme.border }}
            >
              <SearchBar
                searching={searchFacultyQuery.isLoading}
                debounceSearch={debounceSearch}
                setDebounceSearch={setDebounceSearch}
                handleClose={() => {
                  setSelectedUser(null);
                  setDebounceSearch("");
                }}
              />
              <TableTemplate
                columns={userColumns}
                data={facultyData}
                isLoading={searchFacultyQuery.isLoading}
                template={userTemplate}
                isSelectRequired={true}
                selectedId={selectedUser}
                setSelectedId={setSelectedUser}
              />
            </div>

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
            onClick={resetAndClose}
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
            onClick={handleSubmit}
            disabled={createDeptMutation.isPending}
            className="text-[13px] font-semibold px-5 h-9 hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{
              background: theme.primary,
              color: "#fff",
              border: "none",
            }}
          >
            {createDeptMutation.isPending ? <Spinner /> : "Create Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
