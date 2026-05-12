function InfoRow({ label, children, theme }) {
  return (
    <div
      className="flex justify-between items-center py-2.5"
      style={{ borderBottom: `1px solid ${theme.divider}` }}
    >
      <span className="text-[13px]" style={{ color: theme.textSecondary }}>
        {label}
      </span>
      <span
        className="text-[13px] ml-3 font-semibold"
        style={{ color: theme.textPrimary }}
      >
        {children}
      </span>
    </div>
  );
}

export default InfoRow;
