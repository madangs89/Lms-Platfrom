import AdminLayout from "@/layouts/AdminLayout";
import AdminBranches from "@/pages/admin/AdminBranches";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminDepartments from "@/pages/admin/AdminDepartments";
import AdminUserShow from "@/pages/admin/AdminUserShow";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserShow />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="branches" element={<AdminBranches />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;
