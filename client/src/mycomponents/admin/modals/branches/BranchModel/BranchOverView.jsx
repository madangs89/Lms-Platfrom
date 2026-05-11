import InfoRow from "@/mycomponents/admin/InfoRow";
import SectionCard from "@/mycomponents/admin/SectionCard";
import StatBox from "@/mycomponents/admin/StatBox";
import StatusBadge from "@/mycomponents/admin/StatusBadge";
import {
  Activity,
  Building2,
  GraduationCap,
  UserCheck,
  Users,
} from "lucide-react";
import React from "react";

const BranchOverView = ({ branchData, theme }) => {
  const { name, code, created_at, updated_at, department, is_active } =
    branchData || {};

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Dept Info */}
        <SectionCard title="Branch Info" theme={theme}>
          <div
            className="flex flex-col divide-y"
            style={{ divideColor: theme.divider }}
          >
            <InfoRow label="Name" theme={theme}>
              {name}
            </InfoRow>
            <InfoRow label="Code" theme={theme}>
              <code
                className="px-2 py-0.5 rounded text-[12px]"
                style={{ background: theme.primarySoft, color: theme.primary }}
              >
                {code}
              </code>
            </InfoRow>
            <InfoRow label="Status" theme={theme}>
              <StatusBadge active={is_active} />
            </InfoRow>
            <InfoRow label="Created" theme={theme}>
              {created_at?.split("T")[0]}
            </InfoRow>
            <InfoRow label="Updated" theme={theme}>
              {updated_at?.split("T")[0]}
            </InfoRow>
          </div>
        </SectionCard>

        {/* HOD Card */}
        <SectionCard title="Department Info" theme={theme}>
          <div
            className="flex flex-col divide-y"
            style={{ divideColor: theme.divider }}
          >
            <InfoRow label="Name" theme={theme}>
              {department?.name || "N/A"}
            </InfoRow>
            <InfoRow label="Code" theme={theme}>
              <code
                className="px-2 py-0.5 rounded text-[12px]"
                style={{ background: theme.primarySoft, color: theme.primary }}
              >
                {department?.code || "N/A"}
              </code>
            </InfoRow>
            <InfoRow label="Status" theme={theme}>
              <StatusBadge active={department?.is_active} />
            </InfoRow>
            <InfoRow label="Created" theme={theme}>
              {department?.created_at?.split("T")[0]}
            </InfoRow>
            <InfoRow label="Updated" theme={theme}>
              {department?.updated_at?.split("T")[0]}
            </InfoRow>
          </div>
        </SectionCard>

        {/* Stats */}
        <SectionCard title="Branch Statistics" theme={theme}>
          <div className="flex flex-col gap-2">
            <StatBox
              icon={<Building2 size={14} color={theme.primary} />}
              label="Total Specializations"
              value={branchData?.totalSpecializations || 0}
              theme={theme}
            />
            <StatBox
              icon={<GraduationCap size={14} color={theme.primary} />}
              label="Total Subjects"
              value={branchData?.totalSubjects || 0}
              theme={theme}
            />
            <StatBox
              icon={<Activity size={14} color={theme.primary} />}
              label="Active Batches"
              value={branchData?.activeBatches || 0}
              theme={theme}
            />
            <StatBox
              icon={<Activity size={14} color={theme.primary} />}
              label="Total Sections"
              value={branchData?.totalSections || 0}
              theme={theme}
            />
            <StatBox
              icon={<Users size={14} color={theme.primary} />}
              label="Students"
              value={branchData?.totalStudents || 0}
              theme={theme}
            />
            <StatBox
              icon={<UserCheck size={14} color={theme.primary} />}
              label="Faculty"
              value={branchData?.totalFaculty || 0}
              theme={theme}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default BranchOverView;
