import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { useState } from "react";
import SideBar from "@/mycomponents/shared/SideBar";
import { adminSideBar } from "@/configs/sidebarconfigs";

const AdminLayout = () => {
  const theme = useSelector((state) => state.theme);
  let colors = theme[theme.currentTheme];
  const isDark = theme.currentTheme === "dark";

  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div
      style={{ backgroundColor: colors.background, color: colors.textPrimary }}
      className="flex w-screen h-screen overflow-hidden"
    >
      {/* SideBar */}

      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarLinks={adminSideBar}
      />

      {/* Main content */}
      <main className="flex-1 md:pl-4 pt-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
