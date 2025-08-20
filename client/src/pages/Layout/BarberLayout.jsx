import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { Loading } from "../../components/Loading";

export const BarberLayout = () => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <Loading/>
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "barber") {
    return <Navigate to="/user/dashboard" />;
  }

  return <Outlet />;
};
