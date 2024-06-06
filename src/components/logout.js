import UseToken from "../hook/useToken";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { IsLoading } from "./Loading";
import { Button } from "antd";
import { FiLogOut } from "react-icons/fi";
import SettingComponent from "./setting/SettingComponent";

export const LogOut = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const LogoutClick = async () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    localStorage.removeItem("counter");
    localStorage.removeItem("hiddenCounter");

    setAuth({});

    try {
      const response = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {}
  };
  
  return (
    <SettingComponent onClick={LogoutClick} icon={<FiLogOut/>} text={'Đăng xuất'}></SettingComponent>
  );
};
