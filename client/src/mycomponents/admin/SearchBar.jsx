import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const SearchBar = ({
  searching = false,
  debounceSearch,
  setDebounceSearch,
  handleClose,
}) => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const [search, setSearch] = useState("");

  const searchTimeout = useRef(null);
  const handleOnClick = () => {
    setSearch("");
    setDebounceSearch("");
    handleClose?.();
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search, setDebounceSearch]);

  return (
    <div
      className="px-3 sm:px-4 py-2.5 border-b"
      style={{ borderColor: colors.border }}
    >
      <div
        className="flex items-center gap-2 px-3 h-8 rounded-md border w-full sm:w-64"
        style={{
          background: colors.inputBg,
          borderColor: colors.inputBorder,
        }}
      >
        {searching ? (
          <div
            className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
            style={{
              borderColor: colors.primary,
              borderTopColor: "transparent",
            }}
          />
        ) : (
          <Search
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: colors.textMuted }}
          />
        )}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="outline-none bg-transparent flex-1 text-[13px] min-w-0"
          style={{ color: colors.inputText }}
        />
        {search && (
          <button
            onClick={handleOnClick}
            className="text-[11px] flex-shrink-0"
            style={{ color: colors.textMuted }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
