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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MetricCard from "@/mycomponents/admin/MetricCard";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  ShieldUser,
  UserRoundPen,
  UserStar,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// ── Constants ─────────────────────────────────────────────────────────────────
const LIMIT = 5;

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
const ALL_TABS = [
  { id: "all", label: "All" },
  { id: "student", label: "Students" },
  { id: "lecturer", label: "Lecturers" },
  { id: "hod", label: "HODs" },
  { id: "admin", label: "Admins" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const roleBadge = (role) =>
  ({
    student: { bg: "#e8f5e9", color: "#2e7d32" },
    lecturer: { bg: "#e3f2fd", color: "#1565c0" },
    hod: { bg: "#fff8e1", color: "#f57f17" },
    admin: { bg: "#fce4ec", color: "#c62828" },
  })[role] ?? { bg: "#f0f0f0", color: "#555" };

const statusBadge = (status) =>
  ({
    active: { bg: "#e8f5e9", color: "#2e7d32" },
    inactive: { bg: "#fce4ec", color: "#c62828" },
    suspended: { bg: "#fff3e0", color: "#e65100" },
  })[status] ?? { bg: "#f0f0f0", color: "#555" };

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

// ── Sub-components ────────────────────────────────────────────────────────────
const SkeletonRow = ({ colors, cols }) => (
  <TableRow>
    {Array.from({ length: cols }).map((_, i) => (
      <TableCell key={i}>
        <div
          className="h-4 rounded animate-pulse"
          style={{
            background: colors.border,
            width: i === 0 ? "120px" : "70px",
          }}
        />
      </TableCell>
    ))}
  </TableRow>
);

const PageBtn = ({ children, onClick, active, disabled, colors }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-7 h-7 rounded flex items-center justify-center text-[12px] font-medium transition-colors"
    style={{
      background: active ? colors.primary : "transparent",
      color: active
        ? "#fff"
        : disabled
          ? colors.textMuted
          : colors.textSecondary,
      cursor: disabled ? "not-allowed" : "pointer",
      border: `1px solid ${active ? colors.primary : colors.border}`,
    }}
  >
    {children}
  </button>
);

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

const inputStyle = (colors) => ({
  background: colors.inputBg,
  borderColor: colors.inputBorder,
  color: colors.inputText,
});

// ─────────────────────────────────────────────────────────────────────────────
const AdminUserShow = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  // Table state
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [countLoading, setCountLoading] = useState(false);

  const [roleCounts, setRoleCounts] = useState({
    student: 0,
    faculty: 0,
    hod: 0,
    admin: 0,
  });

  // Search
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef(null);

  // Modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  // Responsive: hide some columns on small screens
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (tab, pg) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/all/${pg}/${LIMIT}/${tab}`,
        { withCredentials: true },
      );
      if (data.success) {
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(Math.ceil(data.total / LIMIT));
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!search) fetchUsers(activeTab, page);
  }, [activeTab, page, fetchUsers, search]);

  // ── Search debounce ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/search/${encodeURIComponent(search.trim())}`,
          { withCredentials: true },
        );
        if (data.success) setSearchResults(data.users ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  useEffect(() => {
    (async () => {
      try {
        setCountLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/get-role-user-count`,
          { withCredentials: true },
        );
        if (data.data.success) {
          setCountLoading(false);
          setRoleCounts(data.data.counts);
        }
      } catch (error) {
        console.log(error);

        toast.error("Failed to fetch user counts");
      } finally {
        setCountLoading(false);
      }
    })();
  }, []);

  const displayRows = search.trim() ? (searchResults ?? []) : users;
  const isSearchMode = !!search.trim();
  const showSkeleton = loading || (isSearchMode && searching);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setSearchResults(null);
  };

  // ── Form ──────────────────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "role") {
        next.usn = "";
        next.employee_id = "";
      }
      return next;
    });
  };
  const handleSubmit = () => {
    console.log(form);
    setOpen(false);
    setForm(INITIAL_FORM);
  };
  const handleClose = () => {
    setOpen(false);
    setForm(INITIAL_FORM);
  };
  const isStudent = form.role === "student";
  const isLecturer = ["lecturer", "hod"].includes(form.role);
  const pages = getPageNumbers(page, totalPages);

  // Columns shown at each breakpoint
  // mobile: User + Role + Status
  // desktop: all 6
  const desktopCols = [
    "User",
    "Role",
    "Department",
    "Contact",
    "Status",
    "Actions",
  ];
  const mobileCols = ["User", "Role", "Status", "Actions"];
  const cols = isMobile ? mobileCols : desktopCols;

  return (
    <div className="w-full flex flex-col gap-4 overflow-scroll h-screen">
      {/* ── Header ── */}
      <div className="flex w-full justify-between items-center mt-3">
        <div className="flex flex-col gap-0.5">
          <h1
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
            Users
          </h1>
          <p
            className="text-[12px] sm:text-[13px]"
            style={{ color: colors.textSecondary }}
          >
            Dashboard &gt; Users
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 px-3 h-9 text-[13px] rounded-md flex-shrink-0"
          style={{ background: colors.primaryHover, color: colors.sidebarText }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* ── Metric Cards — always 4 in a row, shrink on small ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          title="Students"
          value={roleCounts.student}
          Icon={GraduationCap}
          loading={countLoading}
        />
        <MetricCard
          title="Faculties"
          value={roleCounts.faculty}
          Icon={UserRoundPen}
          loading={countLoading}
        />
        <MetricCard
          title="HODs"
          value={roleCounts.hod}
          Icon={UserStar}
          loading={countLoading}
        />
        <MetricCard
          title="Admins"
          value={roleCounts.admin}
          Icon={ShieldUser}
          loading={countLoading}
        />
      </div>

      {/* ── Table Card ── */}
      <div
        className="rounded-lg border w-full "
        style={{ borderColor: colors.border, background: colors.card }}
      >
        {/* Tabs row */}
        <div
          className="border-b overflow-x-auto"
          style={{ borderColor: colors.border }}
        >
          <div className="flex min-w-max px-2 pt-1">
            {ALL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className="px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap"
                style={{
                  borderColor:
                    activeTab === tab.id ? colors.primary : "transparent",
                  color:
                    activeTab === tab.id
                      ? colors.primary
                      : colors.textSecondary,
                  background: "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div
          className="px-3 sm:px-4 py-2.5 border-b"
          style={{ borderColor: colors.border }}
        >
          <div
            className="flex items-center gap-2 px-3 h-8 rounded-md border w-full sm:w-64"
            style={{
              background: colors.inputBg,
              borderColor: colors.inputBorder,
            }}
          >
            {searching ? (
              <div
                className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                style={{
                  borderColor: colors.primary,
                  borderTopColor: "transparent",
                }}
              />
            ) : (
              <Search
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: colors.textMuted }}
              />
            )}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="outline-none bg-transparent flex-1 text-[13px] min-w-0"
              style={{ color: colors.inputText }}
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setSearchResults(null);
                }}
                className="text-[11px] flex-shrink-0"
                style={{ color: colors.textMuted }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto w-full ">
          <Table className="w-full">
            <TableHeader>
              <TableRow style={{ borderBottom: `1px solid ${colors.border}` }}>
                {cols.map((h) => (
                  <TableHead
                    key={h}
                    className="text-[11px] sm:text-[12px] font-medium whitespace-nowrap px-3 sm:px-4"
                    style={{ color: colors.textSecondary }}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {showSkeleton &&
                Array.from({ length: LIMIT }).map((_, i) => (
                  <SkeletonRow key={i} colors={colors} cols={cols.length} />
                ))}

              {!showSkeleton && displayRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={cols.length}
                    className="text-center py-10 text-[13px]"
                    style={{ color: colors.textMuted }}
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}

              {!showSkeleton &&
                displayRows.map((user) => {
                  const roleStr =
                    user.roles?.map((r) => r.role).join(", ") ??
                    user.role ??
                    "—";
                  const firstRole = user.roles?.[0]?.role ?? user.role;
                  const rb = roleBadge(firstRole);
                  const sb = statusBadge(user.status);
                  const identifier = user.roles?.some(
                    (r) => r.role === "student",
                  )
                    ? `USN: ${user.usn ?? "—"}`
                    : user.roles?.some((r) =>
                          ["lecturer", "hod"].includes(r.role),
                        )
                      ? `EMP: ${user.employee_id ?? "—"}`
                      : null;
                  const deptName =
                    user.department?.name ?? user.department ?? "—";

                  return (
                    <TableRow
                      key={user.id}
                      style={{ borderBottom: `1px solid ${colors.divider}` }}
                    >
                      {/* User — always shown */}
                      <TableCell className="px-3 sm:px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[11px] sm:text-[12px] font-semibold flex-shrink-0"
                            style={{ background: colors.primary }}
                          >
                            {user.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="text-[12px] sm:text-[13px] font-medium leading-tight truncate"
                              style={{ color: colors.textPrimary }}
                            >
                              {user.name}
                            </p>
                            {identifier && (
                              <p
                                className="text-[10px] sm:text-[11px] truncate"
                                style={{ color: colors.textSecondary }}
                              >
                                {identifier}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Role — always shown */}
                      <TableCell className="px-3 sm:px-4 py-2.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium capitalize whitespace-nowrap"
                          style={{ background: rb.bg, color: rb.color }}
                        >
                          {roleStr}
                        </span>
                      </TableCell>

                      {/* Department — desktop only */}
                      {!isMobile && (
                        <TableCell
                          className="px-4 py-2.5 text-[13px] max-w-[160px]"
                          style={{ color: colors.textPrimary }}
                        >
                          <span className="truncate block">{deptName}</span>
                        </TableCell>
                      )}

                      {/* Contact — desktop only */}
                      {!isMobile && (
                        <TableCell className="px-4 py-2.5">
                          <p
                            className="text-[12px] truncate max-w-[160px]"
                            style={{ color: colors.textPrimary }}
                          >
                            {user.email}
                          </p>
                          <p
                            className="text-[11px]"
                            style={{ color: colors.textSecondary }}
                          >
                            {user.phone ?? "—"}
                          </p>
                        </TableCell>
                      )}

                      {/* Status — always shown */}
                      <TableCell className="px-3 sm:px-4 py-2.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium capitalize whitespace-nowrap"
                          style={{ background: sb.bg, color: sb.color }}
                        >
                          {user.status}
                        </span>
                      </TableCell>

                      {/* Actions — always shown */}
                      <TableCell className="px-3 sm:px-4 py-2.5">
                        <button
                          className="p-1 sm:p-1.5 rounded hover:opacity-70 transition-opacity"
                          style={{ color: colors.textSecondary }}
                        >
                          <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isSearchMode && (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-3 border-t gap-2"
            style={{ borderColor: colors.border }}
          >
            <p
              className="text-[11px] sm:text-[12px]"
              style={{ color: colors.textSecondary }}
            >
              {total === 0
                ? "No results"
                : `Showing ${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} of ${total}`}
            </p>

            <div className="flex items-center gap-1 flex-wrap">
              <PageBtn
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                colors={colors}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </PageBtn>

              {pages.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`d-${i}`}
                    className="w-6 text-center text-[12px]"
                    style={{ color: colors.textSecondary }}
                  >
                    …
                  </span>
                ) : (
                  <PageBtn
                    key={p}
                    onClick={() => setPage(p)}
                    active={page === p}
                    disabled={loading}
                    colors={colors}
                  >
                    {p}
                  </PageBtn>
                ),
              )}

              <PageBtn
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                colors={colors}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </PageBtn>
            </div>
          </div>
        )}

        {/* Search footer */}
        {isSearchMode && !searching && searchResults !== null && (
          <div
            className="px-3 sm:px-4 py-2.5 border-t"
            style={{ borderColor: colors.border }}
          >
            <p className="text-[12px]" style={{ color: colors.textSecondary }}>
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} for "{search}"
            </p>
          </div>
        )}
      </div>

      {/* ── Add User Modal ── */}
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

export default AdminUserShow;
