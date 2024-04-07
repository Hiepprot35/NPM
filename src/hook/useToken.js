import { useState } from "react";
import useAuth from "./useAuth";

export default function UseToken() {
    const {setAuth}=useAuth()
    const getToken = () => {
        const tokenString = localStorage.getItem('AccessToken');
        const userToken = JSON?.parse(tokenString);
        return userToken
    }
    const [token, setToken] = useState(getToken())
    const saveToken = (userToken) => {
        localStorage.setItem('AccessToken', JSON.stringify(userToken));
        setToken(userToken)
    }
    const checkAccessToken = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_DB_HOST}/api/checkAccessToken`, {
            method: 'POST', 
            headers: {
              'Authorization': `Bearer ${token}`, 
            },
          });
      
          if (response.ok) {
            const data=await response.json();
            const user=data.user
            setAuth({ role: user.Role, userID: user.UserID, username: user.Username ,avtUrl:user.avtUrl});
            return data.valid
        } else {
            return false
        }
        } catch (error) {
            return false
        }
      };
    return{
        checkAccessToken:checkAccessToken,
        getToken:getToken,
        AccessToken: token,
        setAccessToken:saveToken,
  }
} 