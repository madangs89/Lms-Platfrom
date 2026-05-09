function StatBox({ icon, label, value, theme }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: theme.primarySoft }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: theme.primary + "22" }}
        >
          {icon}
        </div>
        <span
          className="text-[13px] font-medium"
          style={{ color: theme.textSecondary }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-xl font-extrabold"
        style={{ color: theme.textPrimary }}
      >
        {value}
      </span>
    </div>
  );
}

export default StatBox;
