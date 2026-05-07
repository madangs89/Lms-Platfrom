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
import {
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  Mail,
  Briefcase,
  BookOpen,
  ScrollText,
} from "lucide-react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { useSearchFaculty } from "@/hooks/useSearchFaculty";
import SearchBar from "../SearchBar";
import TableTemplate from "../TableTemplate";
import { userColumns, userTemplate } from "@/configs/template";
import { Button } from "@/components/ui/button";

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Av({ name, size = 36, green = false }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: green ? "#dcfce7" : "#f1f5f9",
        color: green ? "#16a34a" : "#475569",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.33,
        letterSpacing: "-0.5px",
      }}
    >
      {initials(name)}
    </div>
  );
}

function Pill({ label, green, yellow, red, blue }) {
  let bg = "#f1f5f9",
    color = "#475569";
  if (green) {
    bg = "#dcfce7";
    color = "#16a34a";
  }
  if (yellow) {
    bg = "#fef3c7";
    color = "#d97706";
  }
  if (red) {
    bg = "#fee2e2";
    color = "#dc2626";
  }
  if (blue) {
    bg = "#dbeafe";
    color = "#2563eb";
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  );
}

function InfoRow({ label, children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <span style={{ fontSize: 14, color: "#94a3b8" }}>{label}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#1e293b",
          textAlign: "right",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        padding: "22px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#94a3b8",
        margin: "0 0 18px 0",
      }}
    >
      {children}
    </p>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 16px",
        background: "#f8fafc",
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>
        {value}
      </span>
    </div>
  );
}

const btnStyle = (bg, color = "#fff") => ({
  padding: "10px 24px",
  borderRadius: 10,
  border: "none",
  background: bg,
  color,
  fontSize: 14,
  fontWeight: 700,
  cursor: bg === "#e2e8f0" ? "not-allowed" : "pointer",
  fontFamily: "inherit",
});

function OverviewTab({ department }) {
  const {
    hod,
    hod_id,
    branches,
    name,
    code,
    is_active,
    created_at,
    updated_at,
    facultyCount,
    studentCount,
  } = department;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        {/* Dept Info */}
        <Card>
          <CardTitle>Department Info</CardTitle>
          <InfoRow label="Name">{name}</InfoRow>
          <InfoRow label="Code">
            <span
              style={{
                background: "#f1f5f9",
                padding: "2px 10px",
                borderRadius: 6,
                fontFamily: "monospace",
              }}
            >
              {code}
            </span>
          </InfoRow>
          <InfoRow label="Status">
            <Pill
              label={is_active ? "Active" : "Inactive"}
              green={is_active}
              red={!is_active}
            />
          </InfoRow>
          <InfoRow label="Created">{created_at}</InfoRow>
          <InfoRow label="Updated">{updated_at}</InfoRow>
        </Card>

        {/* HOD */}
        {!hod_id ? (
          <h1>No Hod</h1>
        ) : (
          <Card
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <CardTitle>Head of Department</CardTitle>
            <Av name={hod.name} size={60} green />
            <p
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#1e293b",
                margin: "14px 0 6px",
              }}
            >
              {hod.name}
            </p>
            <Pill label="HOD" green />
            <div
              style={{
                width: "100%",
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={14} color="#16a34a" />
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  {hod.email}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Briefcase size={14} color="#16a34a" />
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  EMP ID: {hod.employee_id}
                </span>
              </div>
            </div>
          
          </Card>
        )}

        {/* Stats */}
        <Card>
          <CardTitle>Department Statistics</CardTitle>
          <StatBox
            icon={<Building2 size={15} color="#16a34a" />}
            label="Total Branches"
            value={branches.length}
          />
          <StatBox
            icon={<GraduationCap size={15} color="#16a34a" />}
            label="Specializations"
            value={branches.reduce(
              (acc, b) => acc + b._count.specializations,
              0,
            )}
          />
          <StatBox
            icon={<Users size={15} color="#16a34a" />}
            label="Total Students"
            value={studentCount}
          />
          <StatBox
            icon={<UserCheck size={15} color="#16a34a" />}
            label="Total Faculty"
            value={facultyCount}
          />
        </Card>
      </div>

      {/* Branches */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            }}
          >
            Associated Branches
          </p>
          <button
            style={{
              fontSize: 13,
              color: "#16a34a",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View All
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow style={{ background: "#f8fafc" }}>
              {["Branch Name", "Branch Code", "Specializations", "Status"].map(
                (h) => (
                  <TableHead
                    key={h}
                    style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((b) => (
              <TableRow key={b.id} style={{ borderColor: "#f1f5f9" }}>
                <TableCell
                  style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}
                >
                  {b.name}
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      fontSize: 13,
                      background: "#f1f5f9",
                      color: "#475569",
                      padding: "3px 10px",
                      borderRadius: 6,
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    {b.code}
                  </span>
                </TableCell>
                <TableCell
                  style={{ fontSize: 14, color: "#475569", fontWeight: 600 }}
                >
                  {b._count.specializations}
                </TableCell>
                <TableCell>
                  <Pill
                    label={b.is_active ? "Active" : "Inactive"}
                    green={b.is_active}
                    red={!b.is_active}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ─── TAB: Edit ────────────────────────────────────────────────────────────────

function EditTab({ department }) {
  const [name, setName] = useState(department?.name || "");
  const [code, setCode] = useState(department?.code || "");
  const [active, setActive] = useState(department?.is_active);

  const queryClient = useQueryClient();

  const [initialData, setInitialData] = useState({
    name: department?.name,
    code: department?.code,
    active: department?.is_active,
  });

  const inp = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    color: "#1e293b",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const updateDepartment = async (payload) => {
    const { deptName, deptCode, deptIs_active } = payload;
    const { data } = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/update/info/${department.id}`,
      {
        name: deptName,
        code: deptCode,
        is_active: deptIs_active,
      },
      {
        withCredentials: true,
      },
    );
    return data.department;
  };

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: (data) => {
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

  const handleOnClickSave = () => {
    if (name.trim() === "" || code.trim() === "") {
      toast.error("Department name and code cannot be empty");
      return;
    }

    if (
      name === initialData.name &&
      code === initialData.code &&
      active === initialData.active
    ) {
      toast.error("Please Update The Details Before Saving");
      return;
    }
    updateDepartmentMutation.mutate({
      deptName: name,
      deptCode: code,
      deptIs_active: active,
    });
  };

  return (
    <Card style={{ maxWidth: 540 }}>
      <CardTitle>Edit Department Details</CardTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[
          ["Department Name", name, setName],
          ["Department Code", code, setCode],
        ].map(([label, val, set]) => (
          <div key={label}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                display: "block",
                marginBottom: 7,
              }}
            >
              {label}
            </label>
            <input
              value={val}
              onChange={(e) => set(e.target.value)}
              style={inp}
            />
          </div>
        ))}
        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              display: "block",
              marginBottom: 8,
            }}
          >
            Status
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setActive(v)}
                style={{
                  padding: "9px 24px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.12s",
                  border: `2px solid ${active === v ? "#16a34a" : "#e2e8f0"}`,
                  background: active === v ? "#f0fdf4" : "#fff",
                  color: active === v ? "#16a34a" : "#94a3b8",
                }}
              >
                {v ? "Active" : "Inactive"}
              </button>
            ))}
          </div>
        </div>
        <div onClick={handleOnClickSave} style={{ paddingTop: 4 }}>
          <button style={btnStyle("#16a34a")}>
            {updateDepartmentMutation.isLoading ? <Spinner /> : "Save Changes"}
          </button>
        </div>
      </div>
    </Card>
  );
}

// ─── TAB: HOD Management ──────────────────────────────────────────────────────

function HODTab({ department }) {
  const { hod, hod_id } = department;
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const queryClient = useQueryClient();
  const [debounceSearch, setDebounceSearch] = useState("");

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

  const updateOrAssignHod = async (payload) => {
    const { departmentId, oldHod_id, newHod_id } = payload;

    const { data } = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/update/hod`,
      {
        oldHod_id: oldHod_id,
        newHod_id: newHod_id,
        departmentId: departmentId,
      },
      {
        withCredentials: true,
      },
    );
    return data;
  };

  const updateHodMutation = useMutation({
    mutationFn: updateOrAssignHod,
    onSuccess: (data) => {
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
        err.response?.data?.message ||
          err.message ||
          "Failed to update HOD. Try again.",
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

    let oldHodId = department.hod_id;
    if (!department.hod_id) {
      oldHodId = false;
    }
    let newHodId = selectedUser;
    updateHodMutation.mutate({
      departmentId: department.id,
      oldHod_id: oldHodId,
      newHod_id: newHodId,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <CardTitle>Current Head of Department</CardTitle>
        {hod_id ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 18px",
              background: "#f0fdf4",
              border: "1.5px solid #bbf7d0",
              borderRadius: 12,
            }}
          >
            <Av name={hod.name} size={52} green />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                {hod.name}
              </p>
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0" }}>
                {hod.email}
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                EMP ID: {hod.employee_id} · {hod.designation}
              </p>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 14, color: "#64748b" }}>
            No HOD assigned to this department
          </p>
        )}
      </Card>

      <Card>
        <CardTitle>Search Faculty And Select To Assign As HOD</CardTitle>
        <div className="rounded-lg border w-full overflow-hidden">
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
      </Card>
      <Button
        style={{ background: colors.primaryHover, color: colors.sidebarText }}
        className="cursor-pointer"
        onClick={handleUpdateHod}
        disabled={
          !selectedUser ||
          selectedUser.id === hod_id ||
          updateHodMutation.isPending
        }
      >
        {updateHodMutation.isPending ? <Spinner /> : "Assign as HOD"}
      </Button>
    </div>
  );
}

// ─── TAB: Branches ────────────────────────────────────────────────────────────

function BranchesTab({ department }) {
  return (
    <Card>
      <CardTitle>All Branches</CardTitle>
      <Table>
        <TableHeader>
          <TableRow style={{ background: "#f8fafc" }}>
            {["Branch Name", "Code", "Specializations", "Status"].map((h) => (
              <TableHead
                key={h}
                style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {department?.branches?.map((b) => (
            <TableRow key={b.id} style={{ borderColor: "#f1f5f9" }}>
              <TableCell
                style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}
              >
                {b?.name}
              </TableCell>
              <TableCell>
                <span
                  style={{
                    fontSize: 13,
                    background: "#f1f5f9",
                    color: "#475569",
                    padding: "3px 10px",
                    borderRadius: 6,
                    fontFamily: "monospace",
                    fontWeight: 700,
                  }}
                >
                  {b?.code}
                </span>
              </TableCell>
              <TableCell
                style={{ fontSize: 14, color: "#475569", fontWeight: 600 }}
              >
                {b?._count?.specializations}
              </TableCell>
              <TableCell>
                <Pill
                  label={b.is_active ? "Active" : "Inactive"}
                  green={b.is_active}
                  red={!b.is_active}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "edit", label: "Edit Department", icon: ScrollText },
  { id: "hod", label: "HOD Management", icon: UserCheck },
  { id: "branches", label: "Branches", icon: BookOpen },
  // { id: "users", label: "Users", icon: Users },
  // { id: "coordinators", label: "Coordinators", icon: GraduationCap },
  // { id: "logs", label: "Activity Log", icon: CalendarDays },
];

export default function DepartmentModal({
  open,
  onClose,
  currentSelectedId,
  setCurrentSelectedId,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  console.log({ currentSelectedId });

  const fetchDepartmentDetailsOnId = async (payload) => {
    const { id } = payload;
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/single-department/info/${id}`,
      {
        withCredentials: true,
      },
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
          "Failed to fetch department details. Please try again.",
      );
    }
  }, [singleDepartmentQuery.error]);

  console.log(departmentData);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          onClose && onClose();
        }}
      >
        <DialogContent
          style={{
            background: "#f8fafc",
            borderRadius: 18,
            maxWidth: 940,
            width: "96vw",
            maxHeight: "92vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: 0,
            boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
            border: "1px solid #e2e8f0",
            gap: 0,
          }}
        >
          {singleDepartmentQuery.isLoading ? (
            <div>loading</div>
          ) : (
            <>
              <div
                style={{
                  background: "#fff",
                  padding: "24px 28px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 22,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "#dcfce7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={26} color="#16a34a" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <DialogTitle>{departmentData?.name}</DialogTitle>
                      <Pill
                        label={
                          departmentData?.is_active ? "Active" : "Inactive"
                        }
                        green={departmentData?.is_active}
                        red={departmentData && !departmentData.is_active}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#94a3b8",
                        margin: "5px 0 0",
                      }}
                    >
                      Code:{" "}
                      <strong style={{ color: "#64748b" }}>
                        {departmentData?.code}
                      </strong>
                      &nbsp;·&nbsp; Created:{" "}
                      {departmentData?.created_at?.split("T")[0]} &nbsp;·&nbsp;
                      Updated: {departmentData?.updated_at?.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
                  {TABS.map(({ id, label, icon: Icon }) => {
                    const active = activeTab === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "11px 16px",
                          fontSize: 13,
                          fontWeight: active ? 700 : 500,
                          color: active ? "#16a34a" : "#94a3b8",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          borderBottom: `2.5px solid ${active ? "#16a34a" : "transparent"}`,
                          whiteSpace: "nowrap",
                          fontFamily: "inherit",
                          transition: "all 0.12s",
                        }}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  overflowY: "auto",
                  flex: 1,
                  padding: "24px 28px 32px",
                }}
              >
                {activeTab === "overview" && (
                  <OverviewTab department={departmentData} />
                )}
                {activeTab === "edit" && (
                  <EditTab department={departmentData} activeTab={activeTab} />
                )}
                {activeTab === "hod" && <HODTab department={departmentData} />}
                {activeTab === "branches" && (
                  <BranchesTab department={departmentData} />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
