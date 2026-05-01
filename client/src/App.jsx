import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import { Route, Routes, useNavigate } from "react-router-dom";
import RoleRedirect from "./routes/Roleredirect";
import Login from "./pages/shared/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoutes from "./routes/AdminRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "./redux/slices/auth.slice";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  useEffect(() => {
    (async () => {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/me`,
          {
            withCredentials: true,
          },
        );
        if (data.data.success) {
          console.log("inside if");
          
          const { user } = data.data;
          dispatch(login(user));

          navigate("/");
        }

        console.log("User data fetched on RoleRedirect:", data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);

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
