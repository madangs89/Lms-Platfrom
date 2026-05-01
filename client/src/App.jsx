import React from "react";
import { Button } from "./components/ui/button";
import { Route, Routes } from "react-router-dom";
import RoleRedirect from "./routes/Roleredirect";
import Login from "./pages/shared/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoutes from "./routes/AdminRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import StudentRoutes from "./routes/StudentRoutes";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/*"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
