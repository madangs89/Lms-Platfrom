import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Building2,
  UserCheck,
  BookOpen,
  ScrollText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import HeaderSkeleton from "../../HeaderSkeleton";
import OverviewSkeleton from "../../OverviewSkeleton";
import StatusBadge from "../../StatusBadge";
import EditTab from "./DepartmentModal/EditTab";
import HODTab from "./DepartmentModal/HODTab";
import BranchesTab from "./DepartmentModal/BranchesTab";
import OverviewTab from "./DepartmentModal/OverviewTab";
function ErrorState({ message, onRetry, theme }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: theme.danger + "18" }}
      >
        <AlertCircle size={26} color={theme.danger} />
      </div>
      <div className="text-center space-y-1">
        <p
          className="text-[15px] font-bold"
          style={{ color: theme.textPrimary }}
        >
          Failed to load department
        </p>
        <p className="text-[13px]" style={{ color: theme.textSecondary }}>
          {message || "Something went wrong. Please try again."}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-2 text-[13px] font-semibold"
        style={{
          borderColor: theme.border,
          color: theme.textPrimary,
          background: theme.surface,
        }}
      >
        <RefreshCw size={14} />
        Try Again
      </Button>
    </div>
  );
}

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "edit", label: "Edit Department", icon: ScrollText },
  { id: "hod", label: "HOD Management", icon: UserCheck },
  { id: "branches", label: "Branches", icon: BookOpen },
];

export default function DepartmentModal({ open, onClose, currentSelectedId }) {
  const currentTheme = useSelector((s) => s.theme.currentTheme);
  const theme = useSelector((s) => s.theme[currentTheme]);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDepartmentDetailsOnId = async ({ id }) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/single-department/info/${id}`,
      { withCredentials: true },
    );
    return data.department;
  };

  const singleDepartmentQuery = useQuery({
    queryKey: ["singleDepartment", currentSelectedId],
    queryFn: () => fetchDepartmentDetailsOnId({ id: currentSelectedId }),
    enabled: !!currentSelectedId,
  });

  const departmentData = singleDepartmentQuery.data;

  useEffect(() => {
    if (singleDepartmentQuery.error) {
      toast.error(
        singleDepartmentQuery.error?.response?.data?.message ||
          singleDepartmentQuery.error?.message ||
          "Failed to fetch department details.",
      );
    }
  }, [singleDepartmentQuery.error]);

  const handleOpenChange = (v) => {
    if (!v) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
        {/* ── Loading State ── */}
        {singleDepartmentQuery.isLoading && (
          <>
            <HeaderSkeleton theme={theme} />
            <div className="flex-1 overflow-y-auto p-7">
              <OverviewSkeleton theme={theme} />
            </div>
          </>
        )}

        {/* ── Error State ── */}
        {singleDepartmentQuery.isError && !singleDepartmentQuery.isLoading && (
          <div className="flex-1 flex items-center justify-center px-7">
            <ErrorState
              message={
                singleDepartmentQuery.error?.response?.data?.message ||
                singleDepartmentQuery.error?.message
              }
              onRetry={() => singleDepartmentQuery.refetch()}
              theme={theme}
            />
          </div>
        )}

        {/* ── Loaded State ── */}
        {!singleDepartmentQuery.isLoading &&
          !singleDepartmentQuery.isError &&
          departmentData && (
            <>
              {/* Header */}
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
                        {departmentData.name}
                      </DialogTitle>
                      <StatusBadge active={departmentData.is_active} />
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
                        {departmentData.code}
                      </code>
                      &nbsp;·&nbsp;Created:{" "}
                      {departmentData.created_at?.split("T")[0]}
                      &nbsp;·&nbsp;Updated:{" "}
                      {departmentData.updated_at?.split("T")[0]}
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

              {/* Tab Content */}
              <div
                className="flex-1 overflow-y-auto"
                style={{ padding: "24px 28px 32px" }}
              >
                {activeTab === "overview" && (
                  <OverviewTab department={departmentData} theme={theme} />
                )}
                {activeTab === "edit" && (
                  <EditTab department={departmentData} theme={theme} />
                )}
                {activeTab === "hod" && (
                  <HODTab department={departmentData} theme={theme} />
                )}
                {activeTab === "branches" && (
                  <BranchesTab department={departmentData} theme={theme} />
                )}
              </div>
            </>
          )}
      </DialogContent>
    </Dialog>
  );
}
