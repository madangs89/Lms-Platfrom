import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Avatar from "@/mycomponents/admin/Avatar";
import InfoRow from "@/mycomponents/admin/InfoRow";
import SectionCard from "@/mycomponents/admin/SectionCard";
import StatBox from "@/mycomponents/admin/StatBox";
import StatusBadge from "@/mycomponents/admin/StatusBadge";
import {
  
  Briefcase,
  Building2,
  GraduationCap,
  Mail,
  UserCheck,
  Users,
} from "lucide-react";


function OverviewTab({ department, theme }) {
  const {
    hod,
    hod_id,
    branches = [],
    name,
    code,
    is_active,
    created_at,
    updated_at,
    facultyCount,
    studentCount,
  } = department;

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Dept Info */}
        <SectionCard title="Department Info" theme={theme}>
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
        <SectionCard title="Head of Department" theme={theme}>
          {hod_id ? (
            <div className="flex flex-col items-center text-center gap-3">
              <Avatar name={hod.name} size={56} color="green" />
              <div>
                <p
                  className="text-[15px] font-bold"
                  style={{ color: theme.textPrimary }}
                >
                  {hod.name}
                </p>
                <Badge className="mt-1 bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-[11px]">
                  HOD
                </Badge>
              </div>
              <div className="w-full space-y-2 text-left mt-1">
                <div className="flex items-center gap-2">
                  <Mail size={13} color={theme.primary} />
                  <span
                    className="text-[12px] truncate"
                    style={{ color: theme.textSecondary }}
                  >
                    {hod.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={13} color={theme.primary} />
                  <span
                    className="text-[12px]"
                    style={{ color: theme.textSecondary }}
                  >
                    EMP: {hod.employee_id}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-6 gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: theme.primarySoft }}
              >
                <UserCheck size={20} color={theme.textMuted} />
              </div>
              <p
                className="text-[13px] text-center"
                style={{ color: theme.textMuted }}
              >
                No HOD assigned
              </p>
            </div>
          )}
        </SectionCard>

        {/* Stats */}
        <SectionCard title="Department Statistics" theme={theme}>
          <div className="flex flex-col gap-2">
            <StatBox
              icon={<Building2 size={14} color={theme.primary} />}
              label="Branches"
              value={branches.length}
              theme={theme}
            />
            <StatBox
              icon={<GraduationCap size={14} color={theme.primary} />}
              label="Specializations"
              value={branches.reduce((a, b) => a + b._count.specializations, 0)}
              theme={theme}
            />
            <StatBox
              icon={<Users size={14} color={theme.primary} />}
              label="Students"
              value={studentCount}
              theme={theme}
            />
            <StatBox
              icon={<UserCheck size={14} color={theme.primary} />}
              label="Faculty"
              value={facultyCount}
              theme={theme}
            />
          </div>
        </SectionCard>
      </div>

      {/* Branches Table */}
      <SectionCard title="Associated Branches" theme={theme}>
        {branches.length === 0 ? (
          <p
            className="text-[13px] text-center py-6"
            style={{ color: theme.textMuted }}
          >
            No branches found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow
                style={{
                  background: theme.primarySoft,
                  borderColor: theme.border,
                }}
              >
                {["Branch Name", "Code", "Specializations", "Status"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="text-[12px] font-bold uppercase tracking-wide"
                      style={{ color: theme.textMuted }}
                    >
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((b) => (
                <TableRow key={b.id} style={{ borderColor: theme.divider }}>
                  <TableCell
                    className="text-[13px] font-semibold"
                    style={{ color: theme.textPrimary }}
                  >
                    {b.name}
                  </TableCell>
                  <TableCell>
                    <code
                      className="text-[12px] px-2 py-0.5 rounded"
                      style={{
                        background: theme.primarySoft,
                        color: theme.primary,
                      }}
                    >
                      {b.code}
                    </code>
                  </TableCell>
                  <TableCell
                    className="text-[13px] font-semibold"
                    style={{ color: theme.textSecondary }}
                  >
                    {b._count.specializations}
                  </TableCell>
                  <TableCell>
                    <StatusBadge active={b.is_active} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}

export default OverviewTab;
