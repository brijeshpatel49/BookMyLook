import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const Logout = () => {
  const { LogoutUser ,API} = useAuth();
  const [logout, setLogout] = useState(false);
  useEffect(() => {
    LogoutUser();
    setLogout(true);
    if (logout) {
      toast.info("Logged Out Successfully", {
        theme: "dark",
      });
    }
  }, [LogoutUser]);

  return <Navigate to="/" />;
};
