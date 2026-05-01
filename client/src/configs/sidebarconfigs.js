import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  Layers,
  CalendarRange,
  GraduationCap,
  School,
  BookOpen,
  ClipboardList,
  UserCheck,
  UserCog,
  BarChart3,
  Settings,
} from "lucide-react";

export const adminSideBar = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/admin",
  },
  {
    name: "Users",
    icon: Users,
    link: "/admin/users",
  },
  {
    name: "Departments",
    icon: Building2,
    link: "/admin/departments",
  },
  {
    name: "Branches",
    icon: GitBranch,
    link: "/admin/branches",
  },
  {
    name: "Specializations",
    icon: Layers,
    link: "/admin/specializations",
  },
  {
    name: "Academic Cycles",
    icon: CalendarRange,
    link: "/admin/academic-cycles",
  },
  {
    name: "Batches",
    icon: GraduationCap,
    link: "/admin/batches",
  },
  {
    name: "Sections",
    icon: School,
    link: "/admin/sections",
  },
  {
    name: "Subjects",
    icon: BookOpen,
    link: "/admin/subjects",
  },
  {
    name: "Curriculum",
    icon: ClipboardList,
    link: "/admin/curriculum",
  },
  {
    name: "Enrollments",
    icon: UserCheck,
    link: "/admin/enrollments",
  },
  {
    name: "Teaching Assignments",
    icon: UserCog,
    link: "/admin/teaching-assignments",
  },
  {
    name: "Coordinator Assignments",
    icon: UserCog,
    link: "/admin/coordinator-assignments",
  },
  {
    name: "Reports",
    icon: BarChart3,
    link: "/admin/reports",
  },
  {
    name: "Settings",
    icon: Settings,
    link: "/admin/settings",
  },
];
