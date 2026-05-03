import React from "react";
import { useSelector } from "react-redux";

const shimmerKeyframe = `@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`;

if (typeof document !== "undefined") {
  const styleId = "metric-shimmer-style";
  if (!document.getElementById(styleId)) {
    const tag = document.createElement("style");
    tag.id = styleId;
    tag.innerHTML = shimmerKeyframe;
    document.head.appendChild(tag);
  }
}

const MetricCard = ({
  title = "Users",
  value = "1,234",
  Icon,
  loading = false,
  isRed = false,
}) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];
  const isDark = theme.currentTheme === "dark";

  const shimmerBg = isDark
    ? "linear-gradient(90deg, #1e2b25 25%, #2a3830 50%, #1e2b25 75%)"
    : "linear-gradient(90deg, #e8eeeb 25%, #f4f7f5 50%, #e8eeeb 75%)";

  const skeletonBase = {
    borderRadius: 5,
    backgroundSize: "600px 100%",
    animation: "shimmer 1.8s ease-in-out infinite",
    background: shimmerBg,
  };

  if (loading) {
    return (
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: "20px 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{ ...skeletonBase, width: 40, height: 40, borderRadius: 11 }}
        />
        <div>
          <div
            style={{ ...skeletonBase, width: 80, height: 12, marginBottom: 10 }}
          />
          <div style={{ ...skeletonBase, width: 56, height: 26 }} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: "20px 18px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "transform 0.15s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background:  isRed ? "#fae9e9" : colors.sidebarClr,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={18} color={isRed ? "red" : colors.sidebarText} />}
      </div>

      <div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: colors.textSecondary,
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </p>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: colors.textPrimary,
            marginTop: 3,
            lineHeight: 1,
          }}
        >
          {value}
        </h2>
      </div>
    </div>
  );
};

export default MetricCard;
