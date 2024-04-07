import UseToken from "../hook/useToken";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { IsLoading } from "./Loading";
export const LogOut = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const LogoutClick = async () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");

    setAuth({});

    try {
      const response = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {}    window.location.reload(true);
  };
  return (
    <div>
      <button className="login_button" onClick={LogoutClick}>
        Logout
      </button>
    </div>
  );
};
