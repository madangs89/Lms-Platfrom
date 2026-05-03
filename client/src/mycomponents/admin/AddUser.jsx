import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Field = ({ label, required, children, colors }) => (
  <div className="flex flex-col gap-1.5">
    <Label
      className="text-[12px] font-medium"
      style={{ color: colors.textSecondary }}
    >
      {label}
      {required && <span className="ml-0.5 text-red-400">*</span>}
    </Label>
    {children}
  </div>
);

const AddUser = ({
  open,
  handleClose,
  colors,
  handleChange,
  inputStyle,
  form,
  DEPARTMENTS,
  ROLES,
  handleSubmit,
  mutationLoading,
}) => {
  const isStudent = form.role === "student";
  const isLecturer = ["faculty", "hod"].includes(form.role);
  const isHOD = form.role === "hod";

  const fetchTheDepartmentsWhichDontHaveHod = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/departments-without-hod`,
      {
        withCredentials: true,
      },
    );

    return data.departments;
  };

  const availableHodDepartmentsQuery = useQuery({
    queryKey: ["available-hod-departments"],
    queryFn: fetchTheDepartmentsWhichDontHaveHod,
    enabled: isHOD,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  useEffect(() => {
    if (availableHodDepartmentsQuery.error) {
      toast.error(
        availableHodDepartmentsQuery.error?.response?.data?.message ||
          availableHodDepartmentsQuery?.error?.message ||
          "Failed to fetch available HOD departments",
      );
    }
  }, [availableHodDepartmentsQuery.error]);

  useEffect(() => {
    if (
      !availableHodDepartmentsQuery.isLoading &&
      (availableHodDepartmentsQuery?.data?.length) === 0
    ) {
      toast.error(
        "No departments available for HOD role. Please create a department first.",
      );
      handleChange("role", "");
    }
  }, [
    availableHodDepartmentsQuery.isLoading,
    availableHodDepartmentsQuery.data,
  ]);

  return (
    <div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="w-[95vw] sm:max-w-[520px] p-0 overflow-hidden border"
          style={{
            background: colors.card,
            borderColor: colors.border,
            color: colors.textPrimary,
          }}
        >
          <DialogHeader
            className="px-4 sm:px-6 py-4 border-b"
            style={{ borderColor: colors.divider }}
          >
            <DialogTitle
              className="text-[16px] sm:text-[17px] font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Add New User
            </DialogTitle>
            <p
              className="text-[12px] sm:text-[13px] mt-0.5"
              style={{ color: colors.textSecondary }}
            >
              Fill in the details to create a new user account.
            </p>
          </DialogHeader>

          <div className="px-4 sm:px-6 py-4 flex flex-col gap-3 sm:gap-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Field label="Full Name" required colors={colors}>
                <Input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={inputStyle(colors)}
                  className="h-9 text-[13px] border rounded-md"
                />
              </Field>
              <Field label="Email" required colors={colors}>
                <Input
                  type="email"
                  placeholder="john@college.edu"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  style={inputStyle(colors)}
                  className="h-9 text-[13px] border rounded-md"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Field label="Password" required colors={colors}>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  style={inputStyle(colors)}
                  className="h-9 text-[13px] border rounded-md"
                />
              </Field>
              <Field label="Phone" colors={colors}>
                <Input
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  style={inputStyle(colors)}
                  className="h-9 text-[13px] border rounded-md"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Field label="Department" required colors={colors}>
                <Select
                  value={form.department_id}
                  onValueChange={(v) => handleChange("department_id", v)}
                >
                  <SelectTrigger
                    className="h-9 text-[13px] border rounded-md"
                    style={inputStyle(colors)}
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary,
                    }}
                  >
                    {DEPARTMENTS.map((d) => (
                      <SelectItem
                        key={d.id}
                        value={d.id}
                        className="text-[13px]"
                      >
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Role" required colors={colors}>
                <Select
                  value={form.role}
                  onValueChange={(v) => handleChange("role", v)}
                >
                  <SelectTrigger
                    className="h-9 text-[13px] border rounded-md capitalize"
                    style={inputStyle(colors)}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary,
                    }}
                  >
                    {ROLES.map((r) => (
                      <SelectItem
                        key={r}
                        value={r}
                        className="text-[13px] capitalize"
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {isStudent && (
              <Field label="USN" required colors={colors}>
                <Input
                  placeholder="1XX21CS001"
                  value={form.usn}
                  onChange={(e) => handleChange("usn", e.target.value)}
                  style={inputStyle(colors)}
                  className="h-9 text-[13px] border rounded-md"
                />
              </Field>
            )}
            {isLecturer && (
              <Field label="Employee ID" required colors={colors}>
                <Input
                  placeholder="EMP-2024-001"
                  value={form.employee_id}
                  onChange={(e) => handleChange("employee_id", e.target.value)}
                  style={inputStyle(colors)}
                  className="h-9 text-[13px] border rounded-md"
                />
              </Field>
            )}

            {isHOD &&
            availableHodDepartmentsQuery.data &&
            availableHodDepartmentsQuery.data.length > 0 ? (
              <Field label="Available Hod Roles" required colors={colors}>
                <Select
                  value={form.hod_department_id}
                  onValueChange={(v) => handleChange("hod_department_id", v)}
                >
                  <SelectTrigger
                    className="h-9 text-[13px] border rounded-md"
                    style={inputStyle(colors)}
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary,
                    }}
                  >
                    {availableHodDepartmentsQuery.data.map((d) => (
                      <SelectItem
                        key={d.id}
                        value={d.id}
                        className="text-[13px]"
                      >
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : (
              isHOD && (
                <div>
                  <p>No available HOD roles</p>
                </div>
              )
            )}

            <Field label="Status" colors={colors}>
              <Select
                value={form.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger
                  className="h-9 text-[13px] border rounded-md"
                  style={inputStyle(colors)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                >
                  {["active", "inactive", "suspended"].map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="text-[13px] capitalize"
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div
            className="flex justify-end gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t"
            style={{ borderColor: colors.divider }}
          >
            <Button
              variant="ghost"
              onClick={handleClose}
              className="h-9 px-4 text-[13px] rounded-md border"
              style={{
                borderColor: colors.border,
                color: colors.textSecondary,
                background: "transparent",
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={mutationLoading}
              onClick={handleSubmit}
              className="h-9 px-4 text-[13px] rounded-md"
              style={{
                background: colors.primaryHover,
                color: colors.sidebarText,
              }}
            >
              {mutationLoading ? <Spinner /> : "Create User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddUser;
