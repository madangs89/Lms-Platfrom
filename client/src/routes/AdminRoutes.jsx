import AdminLayout from "@/layouts/AdminLayout";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<h1>Dashboard</h1>} />
          {/* <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;
