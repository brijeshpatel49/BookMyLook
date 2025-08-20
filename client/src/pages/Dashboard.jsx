import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useEffect } from "react";
import { Loading } from "../components/Loading";

export const Dashboard = () => {
  const { user, loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [loading, isLoggedIn, navigate]);

  if (loading) {
    return <Loading/>;
  }

  if (user.role === "barber") {
    return <Navigate to="/barber/dashboard" replace />;
  }

  if (user.role === "user") {
    return <Navigate to="/user/dashboard" replace />;
  }
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
};
