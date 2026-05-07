import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  Mail,
  Briefcase,
  BookOpen,
  ScrollText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { useSearchFaculty } from "@/hooks/useSearchFaculty";
import SearchBar from "../SearchBar";
import TableTemplate from "../TableTemplate";
import { userColumns, userTemplate } from "@/configs/template";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Avatar({ name, size = 36, color = "green" }) {
  const palettes = {
    green: { bg: "bg-green-100", text: "text-green-700" },
    slate: { bg: "bg-slate-100", text: "text-slate-600" },
  };
  const p = palettes[color] ?? palettes.slate;
  return (
    <div
      className={`${p.bg} ${p.text} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.33 }}
    >
      {initials(name)}
    </div>
  );
}

function StatusBadge({ active }) {
  return active ? (
    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
      Active
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-600 border-red-200 hover:bg-red-100">
      Inactive
    </Badge>
  );
}

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────

function HeaderSkeleton({ theme }) {
  return (
    <div
      className="px-7 pt-6 pb-0"
      style={{
        background: theme.surface,
        borderBottom: `1px solid ${theme.divider}`,
      }}
    >
      <div className="flex items-center gap-4 mb-5">
        <Skeleton
          className="w-14 h-14 rounded-2xl"
          style={{ background: theme.divider }}
        />
        <div className="flex-1 space-y-2">
          <Skeleton
            className="h-6 w-48 rounded-md"
            style={{ background: theme.divider }}
          />
          <Skeleton
            className="h-4 w-72 rounded-md"
            style={{ background: theme.divider }}
          />
        </div>
      </div>
      <div className="flex gap-2 pb-0">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-10 w-28 rounded-none rounded-t-md"
            style={{ background: theme.divider }}
          />
        ))}
      </div>
    </div>
  );
}

function OverviewSkeleton({ theme }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-5 space-y-4"
          style={{ background: theme.surface, borderColor: theme.border }}
        >
          <Skeleton
            className="h-4 w-24 rounded"
            style={{ background: theme.divider }}
          />
          {[1, 2, 3, 4].map((j) => (
            <div
              key={j}
              className="flex justify-between items-center py-2"
              style={{ borderBottom: `1px solid ${theme.divider}` }}
            >
              <Skeleton
                className="h-3.5 w-20 rounded"
                style={{ background: theme.divider }}
              />
              <Skeleton
                className="h-3.5 w-24 rounded"
                style={{ background: theme.divider }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry, theme }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: theme.danger + "18" }}
      >
        <AlertCircle size={26} color={theme.danger} />
      </div>
      <div className="text-center space-y-1">
        <p
          className="text-[15px] font-bold"
          style={{ color: theme.textPrimary }}
        >
          Failed to load department
        </p>
        <p className="text-[13px]" style={{ color: theme.textSecondary }}>
          {message || "Something went wrong. Please try again."}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-2 text-[13px] font-semibold"
        style={{
          borderColor: theme.border,
          color: theme.textPrimary,
          background: theme.surface,
        }}
      >
        <RefreshCw size={14} />
        Try Again
      </Button>
    </div>
  );
}

// ─── Shared Section Card ──────────────────────────────────────────────────────

function SectionCard({ title, children, theme, style = {} }) {
  return (
    <div
      className="rounded-xl border"
      style={{ background: theme.surface, borderColor: theme.border, ...style }}
    >
      {title && (
        <div
          className="px-5 pt-4 pb-3"
          style={{ borderBottom: `1px solid ${theme.divider}` }}
        >
          <p
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: theme.textMuted }}
          >
            {title}
          </p>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, children, theme }) {
  return (
    <div
      className="flex justify-between items-center py-2.5"
      style={{ borderBottom: `1px solid ${theme.divider}` }}
    >
      <span className="text-[13px]" style={{ color: theme.textSecondary }}>
        {label}
      </span>
      <span
        className="text-[13px] font-semibold"
        style={{ color: theme.textPrimary }}
      >
        {children}
      </span>
    </div>
  );
}

function StatBox({ icon, label, value, theme }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: theme.primarySoft }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: theme.primary + "22" }}
        >
          {icon}
        </div>
        <span
          className="text-[13px] font-medium"
          style={{ color: theme.textSecondary }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-xl font-extrabold"
        style={{ color: theme.textPrimary }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── TAB: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ department, theme }) {
  const {
    hod,
    hod_id,
    branches = [],
    name,
    code,
    is_active,
    created_at,
    updated_at,
    facultyCount,
    studentCount,
  } = department;

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Dept Info */}
        <SectionCard title="Department Info" theme={theme}>
          <div
            className="flex flex-col divide-y"
            style={{ divideColor: theme.divider }}
          >
            <InfoRow label="Name" theme={theme}>
              {name}
            </InfoRow>
            <InfoRow label="Code" theme={theme}>
              <code
                className="px-2 py-0.5 rounded text-[12px]"
                style={{ background: theme.primarySoft, color: theme.primary }}
              >
                {code}
              </code>
            </InfoRow>
            <InfoRow label="Status" theme={theme}>
              <StatusBadge active={is_active} />
            </InfoRow>
            <InfoRow label="Created" theme={theme}>
              {created_at?.split("T")[0]}
            </InfoRow>
            <InfoRow label="Updated" theme={theme}>
              {updated_at?.split("T")[0]}
            </InfoRow>
          </div>
        </SectionCard>

        {/* HOD Card */}
        <SectionCard title="Head of Department" theme={theme}>
          {hod_id ? (
            <div className="flex flex-col items-center text-center gap-3">
              <Avatar name={hod.name} size={56} color="green" />
              <div>
                <p
                  className="text-[15px] font-bold"
                  style={{ color: theme.textPrimary }}
                >
                  {hod.name}
                </p>
                <Badge className="mt-1 bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-[11px]">
                  HOD
                </Badge>
              </div>
              <div className="w-full space-y-2 text-left mt-1">
                <div className="flex items-center gap-2">
                  <Mail size={13} color={theme.primary} />
                  <span
                    className="text-[12px] truncate"
                    style={{ color: theme.textSecondary }}
                  >
                    {hod.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={13} color={theme.primary} />
                  <span
                    className="text-[12px]"
                    style={{ color: theme.textSecondary }}
                  >
                    EMP: {hod.employee_id}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-6 gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: theme.primarySoft }}
              >
                <UserCheck size={20} color={theme.textMuted} />
              </div>
              <p
                className="text-[13px] text-center"
                style={{ color: theme.textMuted }}
              >
                No HOD assigned
              </p>
            </div>
          )}
        </SectionCard>

        {/* Stats */}
        <SectionCard title="Department Statistics" theme={theme}>
          <div className="flex flex-col gap-2">
            <StatBox
              icon={<Building2 size={14} color={theme.primary} />}
              label="Branches"
              value={branches.length}
              theme={theme}
            />
            <StatBox
              icon={<GraduationCap size={14} color={theme.primary} />}
              label="Specializations"
              value={branches.reduce((a, b) => a + b._count.specializations, 0)}
              theme={theme}
            />
            <StatBox
              icon={<Users size={14} color={theme.primary} />}
              label="Students"
              value={studentCount}
              theme={theme}
            />
            <StatBox
              icon={<UserCheck size={14} color={theme.primary} />}
              label="Faculty"
              value={facultyCount}
              theme={theme}
            />
          </div>
        </SectionCard>
      </div>

      {/* Branches Table */}
      <SectionCard title="Associated Branches" theme={theme}>
        {branches.length === 0 ? (
          <p
            className="text-[13px] text-center py-6"
            style={{ color: theme.textMuted }}
          >
            No branches found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow
                style={{
                  background: theme.primarySoft,
                  borderColor: theme.border,
                }}
              >
                {["Branch Name", "Code", "Specializations", "Status"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="text-[12px] font-bold uppercase tracking-wide"
                      style={{ color: theme.textMuted }}
                    >
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((b) => (
                <TableRow key={b.id} style={{ borderColor: theme.divider }}>
                  <TableCell
                    className="text-[13px] font-semibold"
                    style={{ color: theme.textPrimary }}
                  >
                    {b.name}
                  </TableCell>
                  <TableCell>
                    <code
                      className="text-[12px] px-2 py-0.5 rounded"
                      style={{
                        background: theme.primarySoft,
                        color: theme.primary,
                      }}
                    >
                      {b.code}
                    </code>
                  </TableCell>
                  <TableCell
                    className="text-[13px] font-semibold"
                    style={{ color: theme.textSecondary }}
                  >
                    {b._count.specializations}
                  </TableCell>
                  <TableCell>
                    <StatusBadge active={b.is_active} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}

// ─── TAB: Edit ────────────────────────────────────────────────────────────────

function EditTab({ department, theme }) {
  const [name, setName] = useState(department?.name || "");
  const [code, setCode] = useState(department?.code || "");
  const [active, setActive] = useState(department?.is_active);
  const [initialData, setInitialData] = useState({
    name: department?.name,
    code: department?.code,
    active: department?.is_active,
  });
  const queryClient = useQueryClient();

  const updateDepartment = async (payload) => {
    const { deptName, deptCode, deptIs_active } = payload;
    const { data } = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/update/info/${department.id}`,
      { name: deptName, code: deptCode, is_active: deptIs_active },
      { withCredentials: true },
    );
    return data.department;
  };

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      toast.success("Department updated successfully");
      queryClient.invalidateQueries(["singleDepartment"]);
      queryClient.invalidateQueries(["search-faculty"]);
      queryClient.invalidateQueries(["departments-count"]);
      queryClient.invalidateQueries(["departments-for-table"]);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["userCounts"]);
      queryClient.invalidateQueries(["available-hod-departments"]);
      queryClient.invalidateQueries(["search_departments"]);
      setInitialData({ name, code, active });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to update department. Try again.",
      );
    },
  });

  const hasChanges =
    name !== initialData.name ||
    code !== initialData.code ||
    active !== initialData.active;

  const handleSave = () => {
    if (!name.trim() || !code.trim()) {
      toast.error("Department name and code cannot be empty");
      return;
    }
    if (!hasChanges) {
      toast.error("No changes detected");
      return;
    }
    updateDepartmentMutation.mutate({
      deptName: name,
      deptCode: code,
      deptIs_active: active,
    });
  };

  return (
    <div className="max-w-lg">
      <SectionCard title="Edit Department Details" theme={theme}>
        <div className="flex flex-col gap-5">
          {[
            { label: "Department Name", value: name, set: setName },
            { label: "Department Code", value: code, set: setCode },
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

          {updateDepartmentMutation.isError && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-[12px]">
                {updateDepartmentMutation.error?.response?.data?.message ||
                  "Failed to save changes."}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSave}
            disabled={updateDepartmentMutation.isPending || !hasChanges}
            className="h-9 text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: theme.primary, color: "#fff", border: "none" }}
          >
            {updateDepartmentMutation.isPending ? <Spinner /> : "Save Changes"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── TAB: HOD Management ──────────────────────────────────────────────────────

function HODTab({ department, theme }) {
  const { hod, hod_id } = department;
  const queryClient = useQueryClient();
  const [debounceSearch, setDebounceSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const searchFacultyQuery = useSearchFaculty({ searchQuery: debounceSearch });

  useEffect(() => {
    if (searchFacultyQuery.error) {
      toast.error(
        searchFacultyQuery.error.response?.data?.message ||
          searchFacultyQuery.error.message ||
          "Unable to search faculty",
      );
    }
  }, [searchFacultyQuery.error]);

  const facultyData = searchFacultyQuery.data ?? [];

  const updateOrAssignHod = async (payload) => {
    const { departmentId, oldHod_id, newHod_id } = payload;
    const { data } = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/update/hod`,
      { oldHod_id, newHod_id, departmentId },
      { withCredentials: true },
    );
    return data;
  };

  const updateHodMutation = useMutation({
    mutationFn: updateOrAssignHod,
    onSuccess: () => {
      toast.success("HOD updated successfully");
      queryClient.invalidateQueries(["singleDepartment"]);
      queryClient.invalidateQueries(["search-faculty"]);
      queryClient.invalidateQueries(["departments-count"]);
      queryClient.invalidateQueries(["departments-for-table"]);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["userCounts"]);
      queryClient.invalidateQueries(["available-hod-departments"]);
      queryClient.invalidateQueries(["search_departments"]);
      setSelectedUser(null);
      setDebounceSearch("");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update HOD.",
      );
    },
  });

  const handleUpdateHod = () => {
    if (!selectedUser) {
      toast.error("Please select a faculty to assign as HOD");
      return;
    }
    if (selectedUser == hod_id) {
      toast.error("Selected faculty is already the current HOD");
      return;
    }
    updateHodMutation.mutate({
      departmentId: department.id,
      oldHod_id: department.hod_id || false,
      newHod_id: selectedUser,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Current HOD */}
      <SectionCard title="Current Head of Department" theme={theme}>
        {hod_id ? (
          <div
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{
              background: theme.primarySoft,
              border: `1.5px solid ${theme.primary}33`,
            }}
          >
            <Avatar name={hod.name} size={52} color="green" />
            <div className="flex-1">
              <p
                className="text-[15px] font-bold"
                style={{ color: theme.textPrimary }}
              >
                {hod.name}
              </p>
              <p
                className="text-[12px] mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                {hod.email}
              </p>
              <p
                className="text-[12px] mt-0.5"
                style={{ color: theme.textMuted }}
              >
                EMP ID: {hod.employee_id} · {hod.designation}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
              Current HOD
            </Badge>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: theme.warning + "12",
              border: `1px solid ${theme.warning}44`,
            }}
          >
            <AlertCircle size={18} color={theme.warning} />
            <p
              className="text-[13px] font-medium"
              style={{ color: theme.textSecondary }}
            >
              No HOD assigned to this department
            </p>
          </div>
        )}
      </SectionCard>

      {/* Search & Assign */}
      <SectionCard title="Search Faculty to Assign as HOD" theme={theme}>
        <div
          className="rounded-lg border overflow-hidden"
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

        {updateHodMutation.isError && (
          <Alert variant="destructive" className="mt-3 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-[12px]">
              {updateHodMutation.error?.response?.data?.message ||
                "Failed to assign HOD."}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
          <Button
            onClick={handleUpdateHod}
            disabled={
              !selectedUser ||
              selectedUser == hod_id ||
              updateHodMutation.isPending
            }
            className="h-9 text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: theme.primary, color: "#fff", border: "none" }}
          >
            {updateHodMutation.isPending ? <Spinner /> : "Assign as HOD"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── TAB: Branches ────────────────────────────────────────────────────────────

function BranchesTab({ department, theme }) {
  const branches = department?.branches ?? [];
  return (
    <SectionCard title="All Branches" theme={theme}>
      {branches.length === 0 ? (
        <div className="flex flex-col items-center py-10 gap-2">
          <BookOpen size={28} color={theme.textMuted} />
          <p className="text-[13px]" style={{ color: theme.textMuted }}>
            No branches found for this department
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow
              style={{
                background: theme.primarySoft,
                borderColor: theme.border,
              }}
            >
              {["Branch Name", "Code", "Specializations", "Status"].map((h) => (
                <TableHead
                  key={h}
                  className="text-[12px] font-bold uppercase tracking-wide"
                  style={{ color: theme.textMuted }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((b) => (
              <TableRow key={b.id} style={{ borderColor: theme.divider }}>
                <TableCell
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {b?.name}
                </TableCell>
                <TableCell>
                  <code
                    className="text-[12px] px-2 py-0.5 rounded"
                    style={{
                      background: theme.primarySoft,
                      color: theme.primary,
                    }}
                  >
                    {b?.code}
                  </code>
                </TableCell>
                <TableCell
                  className="text-[13px] font-semibold"
                  style={{ color: theme.textSecondary }}
                >
                  {b?._count?.specializations}
                </TableCell>
                <TableCell>
                  <StatusBadge active={b.is_active} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
}

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "edit", label: "Edit Department", icon: ScrollText },
  { id: "hod", label: "HOD Management", icon: UserCheck },
  { id: "branches", label: "Branches", icon: BookOpen },
];

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function DepartmentModal({ open, onClose, currentSelectedId }) {
  const currentTheme = useSelector((s) => s.theme.currentTheme);
  const theme = useSelector((s) => s.theme[currentTheme]);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDepartmentDetailsOnId = async ({ id }) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/single-department/info/${id}`,
      { withCredentials: true },
    );
    return data.department;
  };

  const singleDepartmentQuery = useQuery({
    queryKey: ["singleDepartment", currentSelectedId],
    queryFn: () => fetchDepartmentDetailsOnId({ id: currentSelectedId }),
    enabled: !!currentSelectedId,
  });

  const departmentData = singleDepartmentQuery.data;

  useEffect(() => {
    if (singleDepartmentQuery.error) {
      toast.error(
        singleDepartmentQuery.error?.response?.data?.message ||
          singleDepartmentQuery.error?.message ||
          "Failed to fetch department details.",
      );
    }
  }, [singleDepartmentQuery.error]);

  const handleOpenChange = (v) => {
    if (!v) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex flex-col gap-0 p-0 overflow-hidden"
        style={{
          maxWidth: 960,
          width: "calc(100vw - 32px)",
          maxHeight: "92vh",
          background: theme.background,
          borderColor: theme.border,
          borderRadius: 18,
          boxShadow: `0 32px 80px ${theme.shadow}`,
        }}
      >
        {/* ── Loading State ── */}
        {singleDepartmentQuery.isLoading && (
          <>
            <HeaderSkeleton theme={theme} />
            <div className="flex-1 overflow-y-auto p-7">
              <OverviewSkeleton theme={theme} />
            </div>
          </>
        )}

        {/* ── Error State ── */}
        {singleDepartmentQuery.isError && !singleDepartmentQuery.isLoading && (
          <div className="flex-1 flex items-center justify-center px-7">
            <ErrorState
              message={
                singleDepartmentQuery.error?.response?.data?.message ||
                singleDepartmentQuery.error?.message
              }
              onRetry={() => singleDepartmentQuery.refetch()}
              theme={theme}
            />
          </div>
        )}

        {/* ── Loaded State ── */}
        {!singleDepartmentQuery.isLoading &&
          !singleDepartmentQuery.isError &&
          departmentData && (
            <>
              {/* Header */}
              <div
                className="shrink-0 px-7 pt-6 pb-0"
                style={{
                  background: theme.surface,
                  borderBottom: `1px solid ${theme.divider}`,
                }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: theme.primarySoft }}
                  >
                    <Building2 size={26} color={theme.primary} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <DialogTitle
                        className="text-[20px] font-bold leading-tight"
                        style={{ color: theme.textPrimary }}
                      >
                        {departmentData.name}
                      </DialogTitle>
                      <StatusBadge active={departmentData.is_active} />
                    </div>
                    <p
                      className="text-[13px] mt-1"
                      style={{ color: theme.textMuted }}
                    >
                      Code:{" "}
                      <code
                        className="px-1.5 py-0.5 rounded text-[12px]"
                        style={{
                          background: theme.primarySoft,
                          color: theme.primary,
                        }}
                      >
                        {departmentData.code}
                      </code>
                      &nbsp;·&nbsp;Created:{" "}
                      {departmentData.created_at?.split("T")[0]}
                      &nbsp;·&nbsp;Updated:{" "}
                      {departmentData.updated_at?.split("T")[0]}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 overflow-x-auto">
                  {TABS.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold whitespace-nowrap transition-all"
                        style={{
                          color: isActive ? theme.primary : theme.textMuted,
                          background: "none",
                          border: "none",
                          borderBottom: `2.5px solid ${isActive ? theme.primary : "transparent"}`,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div
                className="flex-1 overflow-y-auto"
                style={{ padding: "24px 28px 32px" }}
              >
                {activeTab === "overview" && (
                  <OverviewTab department={departmentData} theme={theme} />
                )}
                {activeTab === "edit" && (
                  <EditTab department={departmentData} theme={theme} />
                )}
                {activeTab === "hod" && (
                  <HODTab department={departmentData} theme={theme} />
                )}
                {activeTab === "branches" && (
                  <BranchesTab department={departmentData} theme={theme} />
                )}
              </div>
            </>
          )}
      </DialogContent>
    </Dialog>
  );
}
