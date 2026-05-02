import MetricCard from "@/mycomponents/admin/MetricCard";
import Greeting from "@/mycomponents/shared/Greeting";
import {
  Users,
  Building2,
  GitBranch,
  GraduationCap,
  CalendarDays,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const loading = false; // flip to true to see skeleton

  return (
    <div className="w-full h-full">
      <Greeting name="Admin" isAdmin={true} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 w-full">
        <MetricCard title="Users" value="123" Icon={Users} loading={loading} />
        <MetricCard
          title="Departments"
          value="123"
          Icon={Building2}
          loading={loading}
        />
        <MetricCard
          title="Branches"
          value="123"
          Icon={GitBranch}
          loading={loading}
        />
        <MetricCard
          title="Specializations"
          value="123"
          Icon={GraduationCap}
          loading={loading}
        />
        <MetricCard
          title="Batches"
          value="123"
          Icon={CalendarDays}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
