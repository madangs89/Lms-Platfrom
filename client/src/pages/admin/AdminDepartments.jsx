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
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import StatusCellTemplate from "@/mycomponents/shared/StatusCellTemplate";
import UserCellTemplate from "@/mycomponents/shared/UserCellTemplate";

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
        : {
            id: uuid(),
          };
    },
    renderer: (data) => {
      return <UserCellTemplate data={data} />;
    },
  },
  name: {
    getter: (data) => {
      return {
        name: data.name,
        id: uuid(),
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
        id: uuid(),
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
        id: uuid(),
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
        id: uuid(),
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
        id: uuid(),
      };
    },
    renderer: (data) => {
      return <TableCellTemplate data={data} />;
    },
  },
};

const fackeData = [
  {
    id: "baa7a012-0f45-4b64-8b85-dbc4ee9cbad5",
    name: "COMPUTER SCIENCE AND ENGINEERING",
    code: "CSE",
    is_active: true,
    hod_id: "830a409c-f2d3-4ca2-89e6-331597d7bc5f",
    hod: {
      name: "Suresh",
      email: "suresh@gmail.com",
      id: "830a409c-f2d3-4ca2-89e6-331597d7bc5f",
      roles: ["hod"],
    },
    branchCount: 0,
    studentCount: 1,
  },
  {
    id: "c253c4f8-535f-470f-b4c0-f369b5b3ff59",
    name: "ELECTRONIC AND COMMUNICATION ENGINEERING",
    code: "ECE",
    is_active: true,
    hod_id: null,
    hod: {
      roles: [],
    },
    branchCount: 0,
    studentCount: 0,
  },
  {
    id: "f106eb3b-61fd-44c2-9ced-cf5aa322aa8d",
    name: "ELECTRONIC AND ELECTRICAL ENGINEERING",
    code: "EEE",
    is_active: true,
    hod_id: null,
    hod: {
      roles: [],
    },
    branchCount: 0,
    studentCount: 1,
  },
];

const AdminDepartments = () => {
  const DepartmentTableColumns = [
    "Department Name",
    "Department Code",
    "Status",
    "Hod",
    "Total Branches",
    "Total Students",
    "Actions",
  ];

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

      {/* Tables */}
      <div
        className="rounded-lg border w-full "
        style={{ borderColor: colors.border, background: colors.card }}
      >
        <TableTemplate
          colors={colors}
          columns={DepartmentTableColumns}
          data={fackeData}
          template={template}
        />
      </div>
    </div>
  );
};

export default AdminDepartments;
