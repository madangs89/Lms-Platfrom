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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricCard from "@/mycomponents/admin/MetricCard";
import {
  GraduationCap,
  Plus,
  ShieldUser,
  UserRoundPen,
  UserStar,
  X,
} from "lucide-react";
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

const allTabs = [
  { id: "all", label: "All Users" },
  { id: "students", label: "Students" },
  { id: "lecturers", label: "Lecturers" },
  { id: "hods", label: "HODs" },
  { id: "admins", label: "Admins" },
];

let limit = 10;

const AdminUserShow = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];
  const isDark = theme.currentTheme === "dark";
  const [activeTab, setActiveTab] = useState("all");

  const [data, setData] = useState([]);
  const [currentPaginationData, setCurrentPaginationData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const ALL_USERS = [
    {
      id: "usr-1",
      name: "Arjun Sharma",
      email: "arjun.sharma@college.edu",
      phone: "+91 98765 43001",
      role: "student",
      department: "Computer Science",
      usn: "1RN21CS001",
      employee_id: null,
      status: "active",
      joined: "15 Jan 2022",
    },
    {
      id: "usr-2",
      name: "Priya Nair",
      email: "priya.nair@college.edu",
      phone: "+91 98765 43002",
      role: "student",
      department: "Information Science",
      usn: "1RN21IS024",
      employee_id: null,
      status: "active",
      joined: "16 Jan 2022",
    },
    {
      id: "usr-3",
      name: "Rohan Mehta",
      email: "rohan.mehta@college.edu",
      phone: "+91 98765 43003",
      role: "student",
      department: "Electronics & Communication",
      usn: "1RN21EC045",
      employee_id: null,
      status: "inactive",
      joined: "17 Jan 2022",
    },
    {
      id: "usr-4",
      name: "Sneha Rao",
      email: "sneha.rao@college.edu",
      phone: "+91 98765 43004",
      role: "student",
      department: "Mechanical Engineering",
      usn: "1RN21ME012",
      employee_id: null,
      status: "active",
      joined: "18 Jan 2022",
    },
    {
      id: "usr-5",
      name: "Karthik Reddy",
      email: "karthik.reddy@college.edu",
      phone: "+91 98765 43005",
      role: "student",
      department: "Civil Engineering",
      usn: "1RN21CE033",
      employee_id: null,
      status: "active",
      joined: "19 Jan 2022",
    },
    {
      id: "usr-6",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@college.edu",
      phone: "+91 98765 43006",
      role: "lecturer",
      department: "Computer Science",
      usn: null,
      employee_id: "EMP-FS1023",
      status: "active",
      joined: "10 Jan 2021",
    },
    {
      id: "usr-7",
      name: "Prof. Michael Brown",
      email: "michael.brown@college.edu",
      phone: "+91 98765 43007",
      role: "lecturer",
      department: "Information Science",
      usn: null,
      employee_id: "EMP-FS1045",
      status: "active",
      joined: "05 Feb 2021",
    },
    {
      id: "usr-8",
      name: "Dr. Emily Davis",
      email: "emily.davis@college.edu",
      phone: "+91 98765 43008",
      role: "lecturer",
      department: "Electronics & Communication",
      usn: null,
      employee_id: "EMP-FS1067",
      status: "inactive",
      joined: "12 Mar 2021",
    },
    {
      id: "usr-9",
      name: "Prof. Ravi Kumar",
      email: "ravi.kumar@college.edu",
      phone: "+91 98765 43009",
      role: "lecturer",
      department: "Mechanical Engineering",
      usn: null,
      employee_id: "EMP-FS1089",
      status: "active",
      joined: "20 Apr 2021",
    },
    {
      id: "usr-10",
      name: "Dr. Anita Desai",
      email: "anita.desai@college.edu",
      phone: "+91 98765 43010",
      role: "lecturer",
      department: "Civil Engineering",
      usn: null,
      employee_id: "EMP-FS1101",
      status: "active",
      joined: "01 May 2021",
    },
    {
      id: "usr-11",
      name: "Dr. John Smith",
      email: "john.smith@college.edu",
      phone: "+91 98765 44001",
      role: "hod",
      department: "Computer Science",
      usn: null,
      employee_id: "HOD001",
      status: "active",
      joined: "01 Jan 2020",
    },
    {
      id: "usr-12",
      name: "Dr. Lisa Anderson",
      email: "lisa.anderson@college.edu",
      phone: "+91 98765 44002",
      role: "hod",
      department: "Information Science",
      usn: null,
      employee_id: "HOD002",
      status: "active",
      joined: "15 Jan 2020",
    },
    {
      id: "usr-13",
      name: "Dr. Suresh Babu",
      email: "suresh.babu@college.edu",
      phone: "+91 98765 44003",
      role: "hod",
      department: "Electronics & Communication",
      usn: null,
      employee_id: "HOD003",
      status: "active",
      joined: "20 Jan 2020",
    },
    {
      id: "usr-14",
      name: "Dr. Kavitha Menon",
      email: "kavitha.menon@college.edu",
      phone: "+91 98765 44004",
      role: "hod",
      department: "Mechanical Engineering",
      usn: null,
      employee_id: "HOD004",
      status: "inactive",
      joined: "25 Jan 2020",
    },
    {
      id: "usr-15",
      name: "Dr. Prakash Hegde",
      email: "prakash.hegde@college.edu",
      phone: "+91 98765 44005",
      role: "hod",
      department: "Civil Engineering",
      usn: null,
      employee_id: "HOD005",
      status: "active",
      joined: "30 Jan 2020",
    },
    {
      id: "usr-16",
      name: "Vikram Patel",
      email: "vikram.patel@college.edu",
      phone: "+91 98765 43011",
      role: "student",
      department: "Computer Science",
      usn: "1RN22CS011",
      employee_id: null,
      status: "active",
      joined: "10 Aug 2022",
    },
    {
      id: "usr-17",
      name: "Divya Kumar",
      email: "divya.kumar@college.edu",
      phone: "+91 98765 43012",
      role: "student",
      department: "Information Science",
      usn: "1RN22IS019",
      employee_id: null,
      status: "active",
      joined: "11 Aug 2022",
    },
    {
      id: "usr-18",
      name: "Rahul Gupta",
      email: "rahul.gupta@college.edu",
      phone: "+91 98765 43013",
      role: "admin",
      department: "Computer Science",
      usn: null,
      employee_id: null,
      status: "active",
      joined: "01 Jan 2019",
    },
    {
      id: "usr-19",
      name: "Meera Iyer",
      email: "meera.iyer@college.edu",
      phone: "+91 98765 43014",
      role: "admin",
      department: "Information Science",
      usn: null,
      employee_id: null,
      status: "active",
      joined: "15 Mar 2019",
    },
    {
      id: "usr-20",
      name: "Anjali Singh",
      email: "anjali.singh@college.edu",
      phone: "+91 98765 43015",
      role: "student",
      department: "Electronics & Communication",
      usn: "1RN22EC027",
      employee_id: null,
      status: "suspended",
      joined: "12 Aug 2022",
    },
  ];

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

      {/*Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 w-full">
        <MetricCard
          title="Students"
          value="1243"
          Icon={GraduationCap}
          loading={false}
        />
        <MetricCard
          title="Faculties"
          value="130"
          Icon={UserRoundPen}
          loading={false}
        />
        <MetricCard title="Hods" value="10" Icon={UserStar} loading={false} />
        <MetricCard
          title="Admins"
          value="3"
          Icon={ShieldUser}
          loading={false}
        />
      </div>

      {/* Tables */}
      <div
        className="w-full mt-3 h-screen"
        style={{
          border: `1px solid ${colors.border}`,
        }}
      >
        {allTabs.map((tab, index) => {
          return <Button key={index}>{tab.label}</Button>;
        })}

        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ALL_USERS.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{data.name}</TableCell>
                <TableCell>{data.role}</TableCell>
                <TableCell>{data.department}</TableCell>
                <TableCell>{data.phone}</TableCell>
                <TableCell>{data.status}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
