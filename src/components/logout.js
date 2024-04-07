import UseToken from "../hook/useToken";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
export const LogOut = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const LogoutClick = () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    window.location.href = `${process.env.REACT_APP_DB_HOST}/api/auth/logout`;
    setAuth();
    //  window.location.reload();
    //  navigate("/login", { replace: true });
  };
  return (
    <div>
      <button className="login_button" onClick={LogoutClick}>
        Logout
      </button>
    </div>
  );
};
