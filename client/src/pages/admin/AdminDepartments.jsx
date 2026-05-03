import { Button } from "@/components/ui/button";
import Header from "@/mycomponents/admin/Header";
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
    </div>
  );
};

export default AdminDepartments;
