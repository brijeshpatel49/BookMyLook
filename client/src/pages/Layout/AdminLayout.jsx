import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { Loading } from "../../components/Loading";
export const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
