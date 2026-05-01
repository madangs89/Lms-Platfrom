import React from "react";
import { useSelector } from "react-redux";

const SideBar = ({ activeTab, setActiveTab, sidebarLinks }) => {
  const theme = useSelector((state) => state.theme);
  let colors = theme[theme.currentTheme];
  const isDark = theme.currentTheme === "dark";

  return (
    <aside
      style={{
        background: isDark ? colors.surface : colors.background,
        border: `1px solid ${colors.border}`,
      }}
      className="w-64 px-4 pt-4 h-full hidden md:block overflow-y-auto "
    >
      <h2
        style={{
          color: colors.textPrimary,
        }}
        className="text-lg font-bold mb-4"
      >
        Admin
      </h2>

      <nav className="flex flex-col gap-0.5">
        {sidebarLinks.map((link, index) => (
          <button
            key={index}
            style={{
              background: link.name === activeTab && colors.sidebarClr,
              color:
                link.name === activeTab
                  ? colors.sidebarText
                  : colors.textPrimary,
            }}
            className={`flex items-center gap-3 p-2 text-sm rounded-md transition-colors cursor-pointer `}
            onClick={() => setActiveTab(link.name)}
          >
            <link.icon size={20} />
            <span>{link.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
