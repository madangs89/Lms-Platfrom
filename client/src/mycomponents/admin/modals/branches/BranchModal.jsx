import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Building2, ScrollText, UserCheck } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import StatusBadge from "../../StatusBadge";

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "edit", label: "Edit Department", icon: ScrollText },
  { id: "hod", label: "HOD Management", icon: UserCheck },
  { id: "branches", label: "Branches", icon: BookOpen },
];

const BranchModal = ({ open, onClose, currentSelectedId }) => {
  const currentTheme = useSelector((s) => s.theme.currentTheme);
  const theme = useSelector((s) => s.theme[currentTheme]);
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="flex flex-col gap-0 p-0 overflow-hidden"
        style={{
          maxWidth: 960,
          width: "calc(100vw - 32px)",
          maxHeight: "92vh",
          background: theme.background,
          borderColor: theme.border,
          borderRadius: 18,
          boxShadow: `0 32px 80px ${theme.shadow}`,
        }}
      >
        <div
          className="shrink-0 px-7 pt-6 pb-0"
          style={{
            background: theme.surface,
            borderBottom: `1px solid ${theme.divider}`,
          }}
        >
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: theme.primarySoft }}
            >
              <Building2 size={26} color={theme.primary} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <DialogTitle
                  className="text-[20px] font-bold leading-tight"
                  style={{ color: theme.textPrimary }}
                >
                  {"name"}
                </DialogTitle>
                <StatusBadge active={true} />
              </div>
              <p
                className="text-[13px] mt-1"
                style={{ color: theme.textMuted }}
              >
                Code:{" "}
                <code
                  className="px-1.5 py-0.5 rounded text-[12px]"
                  style={{
                    background: theme.primarySoft,
                    color: theme.primary,
                  }}
                >
                  {"CC"}
                </code>
                &nbsp;·&nbsp;Created: {}
                &nbsp;·&nbsp;Updated: {}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold whitespace-nowrap transition-all"
                  style={{
                    color: isActive ? theme.primary : theme.textMuted,
                    background: "none",
                    border: "none",
                    borderBottom: `2.5px solid ${isActive ? theme.primary : "transparent"}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BranchModal;
