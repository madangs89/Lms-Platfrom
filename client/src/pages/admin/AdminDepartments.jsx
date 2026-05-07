import { Button } from "@/components/ui/button";
import Header from "@/mycomponents/admin/Header";
import MetricCard from "@/mycomponents/admin/MetricCard";
import TableTemplate from "@/mycomponents/admin/TableTemplate";
import TableCellTemplate from "@/mycomponents/shared/TableCellTemplate";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuid } from "uuid";
import {
  Building2,
  Landmark,
  MonitorCheck,
  Plus,
  ShieldBan,
  UsersRound,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import StatusCellTemplate from "@/mycomponents/shared/StatusCellTemplate";
import UserCellTemplate from "@/mycomponents/shared/UserCellTemplate";
import SearchBar from "@/mycomponents/admin/SearchBar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationHandler from "@/mycomponents/shared/PaginationHandler";
import DepartmentModal from "@/mycomponents/admin/modals/DepartmentModal";
import CreateDepartmentModal from "@/mycomponents/admin/modals/CreateDepartmentModal";
import { DepartmentTableColumns } from "@/configs/template";

const template = {
  hod: {
    getter: (data) => {
      return data.hod && data.hod_id
        ? {
            name: data?.hod?.name,
            email: data?.hod?.email || "",
            id: data?.hod?.id || uuid(),
            roles: data?.hod?.roles || [],
            usn: data?.hod?.usn || null,
            employee_id: data?.hod?.employee_id || null,
          }
        : null;
    },
    renderer: (data) => {
      return <UserCellTemplate data={data} />;
    },
  },
  name: {
    getter: (data) => {
      return {
        name: data.name,
      };
    },
    renderer: (data) => {
      return <TableCellTemplate data={data} />;
    },
  },
  code: {
    getter: (data) => {
      return {
        name: data.code,
      };
    },
    renderer: (data) => {
      return <TableCellTemplate data={data} />;
    },
  },
  is_active: {
    getter: (data) => {
      return {
        name: data.is_active ? "active" : "inactive",
      };
    },
    renderer: (data) => {
      return <StatusCellTemplate data={data} />;
    },
  },
  branchCount: {
    getter: (data) => {
      return {
        name: data.branchCount,
      };
    },
    renderer: (data) => {
      return <TableCellTemplate data={data} />;
    },
  },
  studentCount: {
    getter: (data) => {
      return {
        name: data.studentCount,
      };
    },
    renderer: (data) => {
      return <TableCellTemplate data={data} />;
    },
  },
};

const AdminDepartments = () => {
  const LIMIT = 10;

  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentSelectedId, setCurrentSelectedId] = useState(null);

  const [debounceSearch, setDebounceSearch] = useState("");
  // Filter
  const [activeFilter, setActiveFilter] = useState("all");

  const [open, setOpen] = useState(false);

  const fetchDepartmentsCountTotalActiveInactiveWithHods = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/department-counts-total-active-inactive-with-hods`,
      {
        withCredentials: true,
      },
    );
    return data;
  };

  const departmentsCountQuery = useQuery({
    queryKey: ["departments-count"],
    queryFn: fetchDepartmentsCountTotalActiveInactiveWithHods,
    refetchOnWindowFocus: false,

    refetchOnReconnect: true,
    retry: 3,
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to fetch department counts",
      );
    },
  });

  useEffect(() => {
    if (departmentsCountQuery.error) {
      toast.error(
        departmentsCountQuery.error?.response?.data?.message ||
          departmentsCountQuery.error.message ||
          "Failed to fetch department counts",
      );
    }
  }, [departmentsCountQuery.error]);

  const fetchDepartmentsForTableWithHodsBranchesStatusCountOfStudentsAndBranches =
    async (payload) => {
      const { page, active, limit = 10 } = payload;
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/active-departments-hods-students-branches/${active}/${page}/${limit}`,
        {
          withCredentials: true,
        },
      );
      return data;
    };

  const departmentsForTableQuery = useQuery({
    queryKey: ["departments-for-table", page, activeFilter],
    queryFn: () =>
      fetchDepartmentsForTableWithHodsBranchesStatusCountOfStudentsAndBranches({
        page,
        active: activeFilter,
        limit: LIMIT,
      }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to fetch departments",
      );
    },
  });

  useEffect(() => {
    if (departmentsForTableQuery.error) {
      toast.error(
        departmentsForTableQuery.error?.response?.data?.message ||
          departmentsForTableQuery.error.message ||
          "Failed to fetch departments",
      );
    }
  }, [departmentsForTableQuery.error]);

  const fetchSearchResults = async (query) => {
    const { debounceSearch } = query;

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/search/departments/${encodeURIComponent(debounceSearch.trim())}`,
      { withCredentials: true },
    );
    return data.result ?? [];
  };

  const searchQuery = useQuery({
    queryKey: ["search_departments", debounceSearch],
    queryFn: () => fetchSearchResults({ debounceSearch }),
    staleTime: 2 * 60 * 1000,
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch departments",
      );
    },
    refetchOnWindowFocus: false,
    retry: 5,
    retryDelay: 1000,
    enabled: !!debounceSearch.trim(),
  });

  const departments = debounceSearch.trim()
    ? (searchQuery.data ?? [])
    : (departmentsForTableQuery.data?.result ?? []);
  const loading = departmentsForTableQuery.isLoading;

  const isSearchMode = !!debounceSearch.trim();

  return (
    <div className="w-full flex flex-col gap-4 h-screen overflow-y-auto ">
      {/* ── Header ── */}

      <Header
        colors={colors}
        title="Departments"
        bigScreenButtonText="Add Department"
        smallScreenButtonText="Add"
        onClick={() => setOpen(true)}
      />

      {/* ── Metric Cards — always 4 in a row, shrink on small ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          title="Total Departments"
          value={departmentsCountQuery.data?.totalCount || "0"}
          Icon={Landmark}
          loading={departmentsCountQuery.isLoading}
        />
        <MetricCard
          title="Active Departments"
          value={departmentsCountQuery.data?.activeCount || "0"}
          Icon={MonitorCheck}
          loading={departmentsCountQuery.isLoading}
        />
        <MetricCard
          title="Inactive Departments"
          value={departmentsCountQuery.data?.inactiveCount || "0"}
          Icon={ShieldBan}
          loading={departmentsCountQuery.isLoading}
          isRed={true}
        />
        <MetricCard
          title="Departments With Hods"
          value={departmentsCountQuery.data?.withHodCount || "0"}
          Icon={UsersRound}
          loading={departmentsCountQuery.isLoading}
        />
      </div>

      {/* Tables */}
      <div
        className="rounded-lg border  flex-1 overflow-y-auto min-h-0 "
        style={{ borderColor: colors.border, background: colors.card }}
      >
        <div className="rounded-lg border w-full   ">
          <div className="w-full py-2 flex justify-between items-center flex-col md:flex-row gap-2 px-3">
            <SearchBar
              debounceSearch={debounceSearch}
              setDebounceSearch={setDebounceSearch}
              searching={searchQuery.isLoading}
            />

            <Select
              onValueChange={(value) => {
                setActiveFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <TableTemplate
            colors={colors}
            columns={DepartmentTableColumns}
            data={departments}
            template={template}
            isLoading={loading}
            isActionRequired={true}
            setModalOpen={setModalOpen}
            setCurrentId={setCurrentSelectedId}
          />
        </div>
        <PaginationHandler
          page={page}
          isSearchMode={isSearchMode}
          setPage={setPage}
          totalPages={departmentsForTableQuery.data?.totalPages || 1}
          total={departmentsForTableQuery.data?.total || 0}
          LIMIT={LIMIT}
          loading={loading}
          searching={searchQuery.isLoading}
          searchResults={searchQuery.data}
          debounceSearch={debounceSearch}
        />
      </div>

      {/* Department Info Modal */}
      <DepartmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        currentSelectedId={currentSelectedId}
        setCurrentSelectedId={setCurrentSelectedId}
      />

      {/* Create Department Modal */}
      <CreateDepartmentModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AdminDepartments;
