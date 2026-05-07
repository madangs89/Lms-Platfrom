import { TableCell } from "@/components/ui/table";
import AddUser from "@/mycomponents/admin/AddUser";
import Header from "@/mycomponents/admin/Header";
import MetricCard from "@/mycomponents/admin/MetricCard";
import SearchBar from "@/mycomponents/admin/SearchBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  GraduationCap,
  ShieldUser,
  UserRoundPen,
  UserStar,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import TableTemplate from "@/mycomponents/admin/TableTemplate";
import PaginationHandler from "@/mycomponents/shared/PaginationHandler";
import { userColumns, userTemplate } from "@/configs/template";

const LIMIT = 5;

const ROLES = ["student", "faculty", "hod", "admin"];
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
  hod_department_id: "",
};
const ALL_TABS = [
  { id: "all", label: "All" },
  { id: "student", label: "Students" },
  { id: "faculty", label: "Lecturers" },
  { id: "hod", label: "HODs" },
  { id: "admin", label: "Admins" },
];

const inputStyle = (colors) => ({
  background: colors.inputBg,
  borderColor: colors.inputBorder,
  color: colors.inputText,
});

const AdminUserShow = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const queryClient = useQueryClient();
  // Table state
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  const [debounceSearch, setDebounceSearch] = useState("");

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

  const fetchSearchResults = async (query) => {
    const { debounceSearch } = query;

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/search/${encodeURIComponent(debounceSearch.trim())}`,
      { withCredentials: true },
    );
    return data.users ?? [];
  };

  const searchQuery = useQuery({
    queryKey: ["search_users", debounceSearch],
    queryFn: () => fetchSearchResults({ debounceSearch }),
    staleTime: 2 * 60 * 1000,
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to fetch users",
      );
    },
    refetchOnWindowFocus: false,
    retry: 5,
    retryDelay: 1000,
    enabled: !!debounceSearch.trim(),
  });

  const searchResults = searchQuery.data ?? [];
  const searching = searchQuery.isLoading;

  useEffect(() => {
    if (searchQuery.error) {
      toast.error(
        searchQuery.error?.response?.data?.message ||
          searchQuery.error.message ||
          "Failed to fetch users",
      );
    }
  }, [searchQuery.error]);

  const fetchAllUsersOnRole = async (payload) => {
    const { activeTab, page } = payload;

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/all/${page}/${LIMIT}/${activeTab}`,
      { withCredentials: true },
    );

    return {
      users: data?.users || [],
      total: data?.total || 0,
      totalPages: Math.ceil((data?.total || 0) / LIMIT),
    };
  };

  const userQuery = useQuery({
    queryKey: ["users", activeTab, page],
    queryFn: () => fetchAllUsersOnRole({ activeTab, page }),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
    enabled: !debounceSearch.trim(),
  });

  let loading = userQuery.isLoading;
  const total = userQuery?.data?.total || 0;

  useEffect(() => {
    if (userQuery.error) {
      toast.error(
        userQuery.error?.response?.data?.message ||
          userQuery.error.message ||
          "Failed to fetch users",
      );
    }
  }, [userQuery.error]);

  const fetchAllUserCountsPerRole = async () => {
    const data = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/get-role-user-count`,
      { withCredentials: true },
    );

    console.log("tanks");

    return data.data;
  };

  const countQuery = useQuery({
    queryKey: ["userCounts"],
    queryFn: fetchAllUserCountsPerRole,
    retry: false,
    refetchOnWindowFocus: false,
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch user counts",
      );
    },
  });
  let roleCounts = countQuery?.data
    ? countQuery.data.counts
    : {
        student: 0,
        faculty: 0,
        hod: 0,
        admin: 0,
      };

  useEffect(() => {
    if (countQuery.error) {
      toast.error(
        countQuery.error?.response?.data?.message ||
          countQuery.error.message ||
          "Failed to fetch user counts",
      );
    }
  }, [countQuery.error]);

  const displayRows = debounceSearch.trim()
    ? (searchResults ?? [])
    : (userQuery.data?.users ?? []);
  const isSearchMode = !!debounceSearch.trim();

  const getAllDepartments = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/active-departments`,
      { withCredentials: true },
    );

    return data.departments || [];
  };

  const departmentQuery = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
    retry: 3,
    refetchOnWindowFocus: false,
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch departments",
      );
    },
    staleTime: 5 * 60 * 1000,
  });

  const DEPARTMENTS = departmentQuery?.data ?? [];

  useEffect(() => {
    if (departmentQuery.error) {
      toast.error(
        departmentQuery.error?.response?.data?.message ||
          departmentQuery.error.message ||
          "Failed to fetch departments",
      );
    }
  }, [departmentQuery.error]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setDebounceSearch("");
  };

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

  const createUser = async (form) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/create-user`,
      form,
      { withCredentials: true },
    );

    return data;
  };

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast.success(data?.message || "User created successfully");
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["userCounts"]);
      queryClient.invalidateQueries(["available-hod-departments"]);
      queryClient.invalidateQueries(["departments-count"]);
      setOpen(false);
      setForm(INITIAL_FORM);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to create user",
      );
    },
  });

  const handleSubmit = () => {
    if (form.role === "student") {
      if (!form.usn) {
        toast.error("Please enter USN");
        return;
      }
    } else if (["faculty", "hod"].includes(form.role)) {
      if (!form.employee_id) {
        toast.error("Please enter Employee ID");
        return;
      }
    } else if (form.role === "hod") {
      if (!form.hod_department_id) {
        toast.error("Please select department for HOD");
        return;
      }
    }

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.role ||
      !form.department_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    createUserMutation.mutate(form);
  };
  const handleClose = () => {
    setOpen(false);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="w-full flex flex-col gap-4 overflow-scroll h-screen">
      <Header
        colors={colors}
        title="Users"
        bigScreenButtonText="Add User"
        smallScreenButtonText="Add"
        onClick={() => setOpen(true)}
      />

      {/* ── Metric Cards — always 4 in a row, shrink on small ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          title="Students"
          value={roleCounts.student}
          Icon={GraduationCap}
          loading={countQuery.isLoading}
        />
        <MetricCard
          title="Faculties"
          value={roleCounts.faculty}
          Icon={UserRoundPen}
          loading={countQuery.isLoading}
        />
        <MetricCard
          title="HODs"
          value={roleCounts.hod}
          Icon={UserStar}
          loading={countQuery.isLoading}
        />
        <MetricCard
          title="Admins"
          value={roleCounts.admin}
          Icon={ShieldUser}
          loading={countQuery.isLoading}
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
        <SearchBar
          searching={searching}
          debounceSearch={debounceSearch}
          setDebounceSearch={setDebounceSearch}
        />

        {/* Table */}
        <TableTemplate
          columns={userColumns}
          data={displayRows}
          isLoading={loading || (isSearchMode && searching)}
          template={userTemplate}
        />
        <PaginationHandler
          page={page}
          setPage={setPage}
          isSearchMode={isSearchMode}
          searching={searching}
          searchResults={searchResults}
          loading={loading}
          total={userQuery?.data?.total || 0}
          debounceSearch={debounceSearch}
          totalPages={userQuery?.data?.totalPages || 1}
        />
      </div>

      {/* Add User Modal */}
      <AddUser
        open={open}
        handleClose={handleClose}
        colors={colors}
        handleChange={handleChange}
        inputStyle={inputStyle}
        form={form}
        DEPARTMENTS={DEPARTMENTS}
        ROLES={ROLES}
        handleSubmit={handleSubmit}
        mutationLoading={createUserMutation.isPending}
      />
    </div>
  );
};

export default AdminUserShow;
