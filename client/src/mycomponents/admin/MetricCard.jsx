import React from "react";
import { useSelector } from "react-redux";

const MetricCard = ({ title = "Users", value = "1,234", Icon }) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 6px 18px ${colors.shadow}`,
      }}
      className="w-52 h-36 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl"
    >
      {/* Top */}
      <div className="flex items-center gap-3">
        <div
          style={{
            background: colors.sidebarClr,
            color: colors.sidebarText,
          }}
          className="p-2.5 rounded-lg"
        >
          {Icon && <Icon size={18} />}
        </div>

        <p
          className="text-sm font-medium"
          style={{ color: colors.textSecondary }}
        >
          {title}
        </p>
      </div>

      {/* Value */}
      <h2
        className="text-2xl font-bold tracking-tight"
        style={{ color: colors.textPrimary }}
      >
        {value}
      </h2>
    </div>
  );
};

export default MetricCard;