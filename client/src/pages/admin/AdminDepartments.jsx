import { Button } from "@/components/ui/button";
import MetricCard from "@/mycomponents/admin/MetricCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Building2,
  Landmark,
  MonitorCheck,
  Plus,
  ShieldBan,
  UsersRound,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminDepartments = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

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

  return (
    <div className="w-full flex flex-col gap-4 overflow-scroll h-screen">
      {/* ── Header ── */}
      <div className="flex w-full justify-between items-center mt-3">
        <div className="flex flex-col gap-0.5">
          <h1
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
            Departments
          </h1>
          <p
            className="text-[12px] sm:text-[13px]"
            style={{ color: colors.textSecondary }}
          >
            Dashboard &gt; Departments
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 px-3 h-9 text-[13px] rounded-md flex-shrink-0"
          style={{ background: colors.primaryHover, color: colors.sidebarText }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Department</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

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
    </div>
  );
};

export default AdminDepartments;
