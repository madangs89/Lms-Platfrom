import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;
