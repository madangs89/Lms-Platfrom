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
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

// Dummy departments — replace with DB fetch later
const DEPARTMENTS = [
  { id: "dept-cs", name: "Computer Science" },
  { id: "dept-ec", name: "Electronics & Communication" },
  { id: "dept-me", name: "Mechanical Engineering" },
  { id: "dept-ce", name: "Civil Engineering" },
  { id: "dept-is", name: "Information Science" },
];

const ROLES = ["student", "lecturer", "hod", "admin"];

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  department_id: "",
  role: "",
  usn: "",
  employee_id: "",
  status: "active",
};

const AdminUserShow = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];
  const isDark = theme.currentTheme === "dark";

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Clear role-specific fields on role change
      if (field === "role") {
        updated.usn = "";
        updated.employee_id = "";
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    console.log("New user payload:", form);
    // TODO: dispatch API call
    setOpen(false);
    setForm(INITIAL_FORM);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(INITIAL_FORM);
  };

  const isStudent = form.role === "student";
  const isLecturer = ["lecturer", "hod"].includes(form.role);

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex w-full justify-between items-center">
        <div className="mt-3 flex flex-col gap-1">
          <h1
            className="text-2xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
            Users
          </h1>
          <p className="text-muted-foreground text-[14px]">
            {"Dashboard > Users"}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
          style={{
            background: colors.primaryHover,
            color: colors.sidebarText,
          }}
          className="flex items-center gap-1 p-2 text-[13px] rounded-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Users
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-[520px] p-0 overflow-hidden border"
          style={{
            background: colors.card,
            borderColor: colors.border,
            color: colors.textPrimary,
          }}
        >
          {/* Modal Header */}
          <DialogHeader
            className="px-6 py-4 border-b"
            style={{ borderColor: colors.divider }}
          >
            <DialogTitle
              className="text-[17px] font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Add New User
            </DialogTitle>
            <p
              className="text-[13px] mt-0.5"
              style={{ color: colors.textSecondary }}
            >
              Fill in the details to create a new user account.
            </p>
          </DialogHeader>

          {/* Form Body */}
          <div className="px-6 py-5 flex flex-col gap-4 max-h-[68vh] overflow-y-auto">
            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Password + Phone */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Department + Role */}
            <div className="grid grid-cols-2 gap-4">
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
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem
                        key={dept.id}
                        value={dept.id}
                        className="text-[13px]"
                      >
                        {dept.name}
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

            {/* Conditional: USN for student */}
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

            {/* Conditional: Employee ID for lecturer/hod */}
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

            {/* Status */}
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

          {/* Footer */}
          <div
            className="flex justify-end gap-2 px-6 py-4 border-t"
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
              onClick={handleSubmit}
              className="h-9 px-4 text-[13px] rounded-md"
              style={{
                background: colors.primaryHover,
                color: colors.sidebarText,
              }}
            >
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Small helper to keep field wrappers clean
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

// Consistent input styling from theme
const inputStyle = (colors) => ({
  background: colors.inputBg,
  borderColor: colors.inputBorder,
  color: colors.inputText,
});

export default AdminUserShow;
