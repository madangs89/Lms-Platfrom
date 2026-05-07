import { TableCell } from "@/components/ui/table";
import RoleCellTemplate from "@/mycomponents/shared/RolecellTemplate";
import StatusCellTemplate from "@/mycomponents/shared/StatusCellTemplate";
import TableCellTemplate from "@/mycomponents/shared/TableCellTemplate";
import UserCellTemplate from "@/mycomponents/shared/UserCellTemplate";

export const userTemplate = {
  user: {
    getter: (user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles || [],
      usn: user.usn,
      employee_id: user.employee_id,
    }),
    renderer: (data) => <UserCellTemplate data={data} />,
  },
  role: {
    getter: (user) => ({
      name: user.roles?.map((r) => r.role).join(", ") || user.role || "—",
      roles: user.roles || [],
    }),
    renderer: (data) => <RoleCellTemplate data={data} />,
  },
  department: {
    getter: (user) => ({
      name: user.department?.name || user.department || "—",
    }),
    renderer: (data) => <TableCellTemplate data={data} />,
  },
  contact: {
    getter: (user) => ({
      id: user.id + "_contact",
      email: user.email,
      phone: user.phone,
    }),
    renderer: (data) => (
      <TableCell className="px-4 py-2.5">
        <p className="text-[12px] truncate max-w-[160px]">{data.email}</p>
        <p className="text-[11px]">{data.phone || "—"}</p>
      </TableCell>
    ),
  },
  status: {
    getter: (user) => ({
      id: user.id + "_status",
      name: user.status,
    }),
    renderer: (data) => <StatusCellTemplate data={data} />,
  },
};

export const userColumns = [
  { key: "user", label: "User" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "contact", label: "Contact" },
  { key: "status", label: "Status" },
];

export const DepartmentTableColumns = [
  { key: "name", label: "Department Name" },
  { key: "code", label: "Department Code" },
  { key: "is_active", label: "Status" },
  { key: "hod", label: "HOD" },
  { key: "branchCount", label: "Branches" },
  { key: "studentCount", label: "Students" },
];
