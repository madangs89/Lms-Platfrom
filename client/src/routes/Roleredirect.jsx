import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  console.log(isAuthenticated, user);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (user.roles.includes("admin"))
    return <Navigate to="/admin" replace key="admin" />;

  if (user.roles.includes("faculty"))
    return <Navigate to="/faculty" replace key="faculty" />;

  if (user.roles.includes("student"))
    return <Navigate to="/student" replace key="student" />;

  return <Navigate to="/login" replace />;
};

export default RoleRedirect;
