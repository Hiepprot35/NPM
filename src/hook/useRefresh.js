import { useState, useEffect } from "react";
import UseToken from "./useToken";
import useAuth from "./useAuth";
import Cookies from "js-cookie";
import UseRfLocal from "./useRFLocal";
import { useNavigate } from "react-router-dom";
export const useRefresh = () => {
  const { auth, setAuth ,setMyInfor} = useAuth();
  const { AccessToken, setAccessToken } = UseToken();
  const { RefreshToken } = UseRfLocal();
  const host = process.env.REACT_APP_DB_HOST;
  const navigate = useNavigate();
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${host}/api/rfAccessToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`,
          RefreshToken: RefreshToken,
        },
        body: JSON.stringify({
          RefreshToken: RefreshToken,
        }),
      });

      if (response.status !== 200) {
        localStorage.removeItem("AccessToken");
        localStorage.removeItem("RefreshToken");
        navigate("/");
      } else {
        if (response.status === 200) {
          const data = await response.json();
          const { Role, UserID, Username, avtUrl } = data;
     
          setAccessToken(data.AccessToken);
         setAuth({role:Role,userID:UserID,username:Username,avtUrl:avtUrl})
        }
      }
    } catch (error) {
      localStorage.removeItem("AccessToken");

      navigate("/");
    }
  };
  return refreshAccessToken;
};
