import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  ScrollText,
} from "lucide-react";

// ─── Mock data matching Prisma schema ────────────────────────────────────────

const MOCK_DEPARTMENT = {
  id: "dept-01",
  name: "Computer Science Engineering",
  code: "CSE",
  is_active: true,
  created_at: "2023-01-15T10:30:00Z",
  updated_at: "2024-05-20T16:25:00Z",
  hod: {
    id: "usr-01",
    name: "Dr. John Smith",
    email: "john.smith@edulearn.com",
    employee_id: "FSI023",
    profile_photo_url: null,
    roles: [{ role: "hod" }],
    department: { name: "Computer Science Engineering" },
  },
  branches: [
    {
      id: "br-01",
      name: "Computer Science",
      code: "CS",
      is_active: true,
      specializations: [{}, {}],
    },
    {
      id: "br-02",
      name: "Information Technology",
      code: "IT",
      is_active: true,
      specializations: [{}, {}],
    },
    {
      id: "br-03",
      name: "Data Science",
      code: "DS",
      is_active: true,
      specializations: [{}, {}],
    },
  ],
  stats: {
    totalBranches: 3,
    totalSpecializations: 6,
    totalUsers: 248,
    totalCoordinators: 5,
  },
};

const MOCK_USERS = [
  {
    id: "u1",
    name: "Rahul Sharma",
    email: "rahul@edu.com",
    role: "student",
    status: "active",
    created_at: "2024-05-15",
  },
  {
    id: "u2",
    name: "Dr. Sarah Johnson",
    email: "sarah@edu.com",
    role: "faculty",
    status: "active",
    created_at: "2024-05-10",
  },
  {
    id: "u3",
    name: "Prof. Michael Brown",
    email: "michael@edu.com",
    role: "faculty",
    status: "active",
    created_at: "2024-05-08",
  },
  {
    id: "u4",
    name: "Amit Kumar",
    email: "amit@edu.com",
    role: "student",
    status: "active",
    created_at: "2024-05-05",
  },
  {
    id: "u5",
    name: "Priya Patel",
    email: "priya@edu.com",
    role: "student",
    status: "inactive",
    created_at: "2024-05-03",
  },
];

const MOCK_COORDINATORS = [
  {
    id: "c1",
    faculty: { name: "Dr. Sarah Johnson", email: "sarah@edu.com" },
    specialization: { name: "Computer Science", code: "CS" },
    year: 2,
    semester: 3,
    is_active: true,
    assigned_at: "2024-01-10",
  },
  {
    id: "c2",
    faculty: { name: "Prof. Michael Brown", email: "michael@edu.com" },
    specialization: { name: "Data Science", code: "DS" },
    year: 1,
    semester: 2,
    is_active: true,
    assigned_at: "2024-01-12",
  },
  {
    id: "c3",
    faculty: { name: "Dr. Asha Reddy", email: "asha@edu.com" },
    specialization: { name: "Information Technology", code: "IT" },
    year: 3,
    semester: 5,
    is_active: false,
    assigned_at: "2023-07-01",
  },
];

const MOCK_LOGS = [
  {
    id: "l1",
    action: "HOD Changed",
    user: "Admin",
    detail: "HOD updated to Dr. John Smith",
    timestamp: "2024-05-20T16:25:00Z",
  },
  {
    id: "l2",
    action: "Branch Added",
    user: "Admin",
    detail: "Branch 'Data Science' added",
    timestamp: "2024-03-10T09:00:00Z",
  },
  {
    id: "l3",
    action: "Status Updated",
    user: "Admin",
    detail: "Department marked Active",
    timestamp: "2023-06-01T11:15:00Z",
  },
  {
    id: "l4",
    action: "Department Created",
    user: "System",
    detail: "Department CSE created",
    timestamp: "2023-01-15T10:30:00Z",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function StatusBadge({ active }) {
  return (
    <Badge
      style={{
        backgroundColor: active ? "#e4f4e9" : "#fde8e8",
        color: active ? "#2a7a3f" : "#c53030",
        border: "none",
        fontWeight: 500,
        fontSize: 12,
      }}
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

function RoleBadge({ role }) {
  const map = {
    student: { bg: "#e8f0fe", color: "#3B82F6" },
    faculty: { bg: "#fef3c7", color: "#d97706" },
    hod: { bg: "#ede9fe", color: "#7c3aed" },
    coordinator: { bg: "#e4f4e9", color: "#2a7a3f" },
  };
  const s = map[role] || map.student;
  return (
    <Badge
      style={{
        backgroundColor: s.bg,
        color: s.color,
        border: "none",
        fontSize: 11,
      }}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
}

function InitialsAvatar({ name, size = 40 }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#e4f4e9",
        color: "#2a7a3f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.34,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ department, theme }) {
  const t = theme;
  const { stats, hod, branches } = department;

  const statCards = [
    {
      label: "Total Branches",
      value: stats.totalBranches,
      icon: <Building2 size={16} />,
    },
    {
      label: "Total Specializations",
      value: stats.totalSpecializations,
      icon: <GraduationCap size={16} />,
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={16} />,
    },
    {
      label: "Total Coordinators",
      value: stats.totalCoordinators,
      icon: <UserCheck size={16} />,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        {/* Dept Info */}
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: t.textMuted,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Department Info
          </p>
          {[
            ["Department Name", department.name],
            ["Department Code", department.code],
            ["Status", null],
            ["Created At", fmt(department.created_at)],
            ["Updated At", fmt(department.updated_at)],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom: `1px solid ${t.divider}`,
              }}
            >
              <span style={{ fontSize: 12, color: t.textSecondary }}>
                {label}
              </span>
              {label === "Status" ? (
                <StatusBadge active={department.is_active} />
              ) : (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: t.textPrimary,
                  }}
                >
                  {val}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* HOD */}
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: t.textMuted,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Head of Department
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              paddingBottom: 12,
            }}
          >
            <InitialsAvatar name={hod.name} size={52} />
            <div style={{ textAlign: "center" }}>
              <p
                style={{ fontWeight: 600, color: t.textPrimary, fontSize: 14 }}
              >
                {hod.name}
              </p>
              <RoleBadge role="hod" />
            </div>
            <div
              style={{ width: "100%", fontSize: 12, color: t.textSecondary }}
            >
              {[
                [<Mail size={12} />, hod.email],
                [<Briefcase size={12} />, `EMP ID: ${hod.employee_id}`],
              ].map(([icon, text], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 0",
                  }}
                >
                  <span style={{ color: t.primary }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            style={{
              width: "100%",
              borderColor: t.primary,
              color: t.primary,
              fontSize: 12,
            }}
          >
            Change HOD
          </Button>
        </div>

        {/* Stats */}
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: t.textMuted,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Department Statistics
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {statCards.map(({ label, value, icon }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 10px",
                  background: t.surface,
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: t.primary }}>{icon}</span>
                  <span style={{ fontSize: 12, color: t.textSecondary }}>
                    {label}
                  </span>
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    color: t.textPrimary,
                    fontSize: 15,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branches */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 10,
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <p style={{ fontWeight: 600, color: t.textPrimary, fontSize: 14 }}>
            Associated Branches
          </p>
          <Button
            variant="ghost"
            size="sm"
            style={{ color: t.primary, fontSize: 12 }}
          >
            View All
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: t.divider }}>
              {["Branch Name", "Branch Code", "Specializations", "Status"].map(
                (h) => (
                  <TableHead
                    key={h}
                    style={{ fontSize: 12, color: t.textMuted }}
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((b) => (
              <TableRow key={b.id} style={{ borderColor: t.divider }}>
                <TableCell style={{ fontSize: 13, color: t.textPrimary }}>
                  {b.name}
                </TableCell>
                <TableCell style={{ fontSize: 13, color: t.textSecondary }}>
                  {b.code}
                </TableCell>
                <TableCell style={{ fontSize: 13, color: t.textPrimary }}>
                  {b.specializations.length}
                </TableCell>
                <TableCell>
                  <StatusBadge active={b.is_active} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Tab: Branches ────────────────────────────────────────────────────────────

function BranchesTab({ branches, theme: t }) {
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: 16,
      }}
    >
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: t.divider }}>
            {[
              "Branch Name",
              "Code",
              "Specializations",
              "Status",
              "Created",
            ].map((h) => (
              <TableHead key={h} style={{ fontSize: 12, color: t.textMuted }}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((b) => (
            <TableRow key={b.id} style={{ borderColor: t.divider }}>
              <TableCell
                style={{ fontWeight: 500, color: t.textPrimary, fontSize: 13 }}
              >
                {b.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: t.border,
                    color: t.textSecondary,
                    fontSize: 11,
                  }}
                >
                  {b.code}
                </Badge>
              </TableCell>
              <TableCell style={{ fontSize: 13, color: t.textPrimary }}>
                {b.specializations.length}
              </TableCell>
              <TableCell>
                <StatusBadge active={b.is_active} />
              </TableCell>
              <TableCell style={{ fontSize: 12, color: t.textSecondary }}>
                —
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Tab: Users ───────────────────────────────────────────────────────────────

function UsersTab({ theme: t }) {
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: 16,
      }}
    >
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: t.divider }}>
            {["User", "Email", "Role", "Status", "Joined"].map((h) => (
              <TableHead key={h} style={{ fontSize: 12, color: t.textMuted }}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_USERS.map((u) => (
            <TableRow key={u.id} style={{ borderColor: t.divider }}>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <InitialsAvatar name={u.name} size={30} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: t.textPrimary,
                    }}
                  >
                    {u.name}
                  </span>
                </div>
              </TableCell>
              <TableCell style={{ fontSize: 12, color: t.textSecondary }}>
                {u.email}
              </TableCell>
              <TableCell>
                <RoleBadge role={u.role} />
              </TableCell>
              <TableCell>
                <StatusBadge active={u.status === "active"} />
              </TableCell>
              <TableCell style={{ fontSize: 12, color: t.textSecondary }}>
                {fmt(u.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Tab: Coordinators ────────────────────────────────────────────────────────

function CoordinatorsTab({ theme: t }) {
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: 16,
      }}
    >
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: t.divider }}>
            {[
              "Faculty",
              "Specialization",
              "Year / Sem",
              "Status",
              "Assigned",
            ].map((h) => (
              <TableHead key={h} style={{ fontSize: 12, color: t.textMuted }}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_COORDINATORS.map((c) => (
            <TableRow key={c.id} style={{ borderColor: t.divider }}>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <InitialsAvatar name={c.faculty.name} size={30} />
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: t.textPrimary,
                        margin: 0,
                      }}
                    >
                      {c.faculty.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: t.textSecondary,
                        margin: 0,
                      }}
                    >
                      {c.faculty.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: t.border,
                    color: t.textSecondary,
                    fontSize: 11,
                  }}
                >
                  {c.specialization.code}
                </Badge>
                <span
                  style={{
                    fontSize: 12,
                    color: t.textSecondary,
                    marginLeft: 6,
                  }}
                >
                  {c.specialization.name}
                </span>
              </TableCell>
              <TableCell style={{ fontSize: 13, color: t.textPrimary }}>
                Y{c.year} / S{c.semester}
              </TableCell>
              <TableCell>
                <StatusBadge active={c.is_active} />
              </TableCell>
              <TableCell style={{ fontSize: 12, color: t.textSecondary }}>
                {fmt(c.assigned_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Tab: Activity Log ────────────────────────────────────────────────────────

function ActivityLogTab({ theme: t }) {
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {MOCK_LOGS.map((log, i) => (
          <div
            key={log.id}
            style={{
              display: "flex",
              gap: 14,
              padding: "12px 0",
              borderBottom:
                i < MOCK_LOGS.length - 1 ? `1px solid ${t.divider}` : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: t.primary,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              {i < MOCK_LOGS.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    background: t.divider,
                    marginTop: 4,
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: t.textPrimary,
                    margin: 0,
                  }}
                >
                  {log.action}
                </p>
                <span style={{ fontSize: 11, color: t.textMuted }}>
                  {fmt(log.timestamp)}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: t.textSecondary,
                  margin: "2px 0 0",
                }}
              >
                {log.detail}
              </p>
              <p
                style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0" }}
              >
                By: {log.user}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Edit Department ─────────────────────────────────────────────────────

function EditDepartmentTab({ department, theme: t }) {
  const [name, setName] = useState(department.name);
  const [code, setCode] = useState(department.code);
  const [active, setActive] = useState(department.is_active);

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${t.inputBorder}`,
    background: t.inputBg,
    color: t.inputText,
    fontSize: 13,
    outline: "none",
  };

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: 20,
        maxWidth: 480,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          ["Department Name", name, setName, "text"],
          ["Department Code", code, setCode, "text"],
        ].map(([label, val, setter, type]) => (
          <div key={label}>
            <label
              style={{
                fontSize: 12,
                color: t.textSecondary,
                display: "block",
                marginBottom: 6,
              }}
            >
              {label}
            </label>
            <input
              type={type}
              value={val}
              onChange={(e) => setter(e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}

        <div>
          <label
            style={{
              fontSize: 12,
              color: t.textSecondary,
              display: "block",
              marginBottom: 8,
            }}
          >
            Status
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {[true, false].map((val) => (
              <button
                key={String(val)}
                onClick={() => setActive(val)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 6,
                  border: `1px solid ${active === val ? t.primary : t.inputBorder}`,
                  background: active === val ? t.primarySoft : t.inputBg,
                  color: active === val ? t.primary : t.textSecondary,
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: active === val ? 600 : 400,
                }}
              >
                {val ? "Active" : "Inactive"}
              </button>
            ))}
          </div>
        </div>

        <Button
          style={{
            background: t.primary,
            color: "#fff",
            marginTop: 4,
            width: "fit-content",
          }}
          size="sm"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function DepartmentModal({ open, onClose }) {
  const themeState = useSelector((state) => state.theme);
  const t = themeState[themeState.currentTheme];
  const dept = MOCK_DEPARTMENT;

  const tabs = [
    { value: "overview", label: "Overview", icon: <Building2 size={13} /> },
    { value: "edit", label: "Edit Department", icon: <ScrollText size={13} /> },
    { value: "hod", label: "HOD Management", icon: <UserCheck size={13} /> },
    { value: "branches", label: "Branches", icon: <BookOpen size={13} /> },
    { value: "users", label: "Users", icon: <Users size={13} /> },
    {
      value: "coordinators",
      label: "Coordinators",
      icon: <GraduationCap size={13} />,
    },
    { value: "logs", label: "Activity Log", icon: <Calendar size={13} /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          maxWidth: 860,
          width: "95vw",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 0",
            borderBottom: `1px solid ${t.divider}`,
          }}
        >
          <DialogHeader>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: t.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Building2 size={22} color={t.primary} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <DialogTitle
                    style={{
                      color: t.textPrimary,
                      fontSize: 18,
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {dept.name}
                  </DialogTitle>
                  <StatusBadge active={dept.is_active} />
                </div>
                <p style={{ fontSize: 12, color: t.textSecondary, margin: 0 }}>
                  Code: {dept.code} &nbsp;·&nbsp; Created on:{" "}
                  {fmt(dept.created_at)} &nbsp;·&nbsp; Updated on:{" "}
                  {fmt(dept.updated_at)}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Tabs bar */}
          <Tabs defaultValue="overview">
            <TabsList
              style={{
                background: "transparent",
                gap: 0,
                padding: 0,
                height: "auto",
                borderBottom: "none",
                flexWrap: "wrap",
              }}
            >
              {tabs.map(({ value, label, icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "8px 14px",
                    borderRadius: 0,
                    background: "transparent",
                    color: t.textSecondary,
                    borderBottom: "2px solid transparent",
                  }}
                >
                  {icon} {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Scrollable content */}
            <div
              style={{
                overflowY: "auto",
                maxHeight: "calc(90vh - 180px)",
                padding: "20px 24px 24px",
              }}
            >
              <TabsContent value="overview">
                <OverviewTab department={dept} theme={t} />
              </TabsContent>
              <TabsContent value="edit">
                <EditDepartmentTab department={dept} theme={t} />
              </TabsContent>
              <TabsContent value="hod">
                <div
                  style={{
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <p style={{ fontSize: 13, color: t.textSecondary }}>
                    HOD management panel — assign or change the Head of
                    Department.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginTop: 16,
                      padding: 16,
                      background: t.surface,
                      borderRadius: 10,
                    }}
                  >
                    <InitialsAvatar name={dept.hod.name} size={48} />
                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          color: t.textPrimary,
                          margin: 0,
                        }}
                      >
                        {dept.hod.name}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: t.textSecondary,
                          margin: 0,
                        }}
                      >
                        {dept.hod.email}
                      </p>
                      <p
                        style={{ fontSize: 12, color: t.textMuted, margin: 0 }}
                      >
                        EMP ID: {dept.hod.employee_id}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{
                        marginLeft: "auto",
                        borderColor: t.primary,
                        color: t.primary,
                      }}
                    >
                      Change HOD
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="branches">
                <BranchesTab branches={dept.branches} theme={t} />
              </TabsContent>
              <TabsContent value="users">
                <UsersTab theme={t} />
              </TabsContent>
              <TabsContent value="coordinators">
                <CoordinatorsTab theme={t} />
              </TabsContent>
              <TabsContent value="logs">
                <ActivityLogTab theme={t} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
