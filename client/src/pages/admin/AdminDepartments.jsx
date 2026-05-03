import { Button } from "@/components/ui/button";
import MetricCard from "@/mycomponents/admin/MetricCard";
import {
  Building2,
  Landmark,
  MonitorCheck,
  Plus,
  ShieldBan,
  UsersRound,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const AdminDepartments = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const [open, setOpen] = useState(false);

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
          value="5"
          Icon={Landmark}
          loading={false}
        />
        <MetricCard
          title="Active Departments"
          value="5"
          Icon={MonitorCheck}
          loading={false}
        />
        <MetricCard
          title="Inactive Departments"
          value="5"
          Icon={ShieldBan}
          loading={false}
          isRed={true}
        />
        <MetricCard
          title="Departments With Hods"
          value="5"
          Icon={UsersRound}
          loading={false}
        />
      </div>
    </div>
  );
};

export default AdminDepartments;
