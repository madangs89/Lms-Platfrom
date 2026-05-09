function SectionCard({ title, children, theme, style = {} }) {
  return (
    <div
      className="rounded-xl border"
      style={{ background: theme.surface, borderColor: theme.border, ...style }}
    >
      {title && (
        <div
          className="px-5 pt-4 pb-3"
          style={{ borderBottom: `1px solid ${theme.divider}` }}
        >
          <p
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: theme.textMuted }}
          >
            {title}
          </p>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export default SectionCard;
