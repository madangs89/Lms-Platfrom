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

const template = {
  hod: {
    getter: (data) => {
      console.log("getter", data);

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
  const DepartmentTableColumns = [
    { key: "name", label: "Department Name" },
    { key: "code", label: "Department Code" },
    { key: "is_active", label: "Status" },
    { key: "hod", label: "HOD" },
    { key: "branchCount", label: "Branches" },
    { key: "studentCount", label: "Students" },
  ];

  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];
  const [page, setPage] = useState(1);

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
      return data.result;
    };

  const departmentsForTableQuery = useQuery({
    queryKey: ["departments-for-table", page, activeFilter],
    queryFn: () =>
      fetchDepartmentsForTableWithHodsBranchesStatusCountOfStudentsAndBranches({
        page,
        active: activeFilter,
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

  const departments = departmentsForTableQuery.data || [];
  const loading = departmentsForTableQuery.isLoading;

  return (
    <div className="w-full flex flex-col gap-4 overflow-scroll h-screen">
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
        className="rounded-lg border w-full h-full "
        style={{ borderColor: colors.border, background: colors.card }}
      >
        <SearchBar />

        <TableTemplate
          colors={colors}
          columns={DepartmentTableColumns}
          data={departments}
          template={template}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default AdminDepartments;
