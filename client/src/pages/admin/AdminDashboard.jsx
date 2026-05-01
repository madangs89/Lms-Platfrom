import MetricCard from "@/mycomponents/admin/MetricCard";
import Greeting from "@/mycomponents/shared/Greeting";
import { User } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const theme = useSelector((state) => state.theme);
  let colors = theme[theme.currentTheme];
  const isDark = theme.currentTheme === "dark";

  return (
    <div>
      {/* <h1
        className="text-xl font-semibold"
        style={{
          color: colors.textPrimary,
        }}
      >
        Dashboard
      </h1> */}

      <Greeting name="Admin" isAdmin={true} />

      <div className="flex flex-wrap w-full gap-2 mt-3">
        <MetricCard title="Users" value="123" Icon={User} />
        <MetricCard title="Departments" value="123" Icon={User} />
        <MetricCard title="Branches" value="123" Icon={User} />
        <MetricCard title="Specializations" value="123" Icon={User} />
        <MetricCard title="Batches" value="123" Icon={User} />
      </div>
    </div>
  );
};

export default AdminDashboard;
