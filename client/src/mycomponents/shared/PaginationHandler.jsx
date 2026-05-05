import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const PageBtn = ({ children, onClick, active, disabled, colors }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-7 h-7 rounded flex items-center justify-center text-[12px] font-medium transition-colors"
    style={{
      background: active ? colors.primary : "transparent",
      color: active
        ? "#fff"
        : disabled
          ? colors.textMuted
          : colors.textSecondary,
      cursor: disabled ? "not-allowed" : "pointer",
      border: `1px solid ${active ? colors.primary : colors.border}`,
    }}
  >
    {children}
  </button>
);

const PaginationHandler = ({
  page,
  totalPages,
  setPage,
  isSearchMode,
  total,
  LIMIT = 10,
  loading,
  searching,
  searchResults,
  debounceSearch,
}) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const pages = getPageNumbers(page, totalPages || 1);

  return (
    <div>
      {/* Pagination */}
      {!isSearchMode && (
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-3 border-t gap-2"
          style={{ borderColor: colors.border }}
        >
          <p
            className="text-[11px] sm:text-[12px]"
            style={{ color: colors.textSecondary }}
          >
            {(total || 0) === 0
              ? "No results"
              : `Showing ${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} of ${total}`}
          </p>

          <div className="flex items-center gap-1 flex-wrap">
            <PageBtn
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              colors={colors}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </PageBtn>

            {pages.map((p, i) =>
              p === "..." ? (
                <span
                  key={`d-${i}`}
                  className="w-6 text-center text-[12px]"
                  style={{ color: colors.textSecondary }}
                >
                  …
                </span>
              ) : (
                <PageBtn
                  key={p}
                  onClick={() => setPage(p)}
                  active={page === p}
                  disabled={loading}
                  colors={colors}
                >
                  {p}
                </PageBtn>
              ),
            )}

            <PageBtn
              onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
              disabled={page === totalPages || loading}
              colors={colors}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </PageBtn>
          </div>
        </div>
      )}

      {isSearchMode && !searching && searchResults !== null && (
        <div
          className="px-3 sm:px-4 py-2.5 border-t"
          style={{ borderColor: colors.border }}
        >
          <p className="text-[12px]" style={{ color: colors.textSecondary }}>
            {searchResults.length} result
            {searchResults.length !== 1 ? "s" : ""} for "{debounceSearch}"
          </p>
        </div>
      )}
    </div>
  );
};

export default PaginationHandler;
