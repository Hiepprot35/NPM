import { useState } from "react";
import useAuth from "./useAuth";

export default function UseToken() {
    const {setAuth,auth}=useAuth()
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
            console.log("token")
            if(user)
            {

              setAuth({username:user.Username,avtUrl:auth.avtUrl,userID:user.UserID,role:user.Role}) 
            }
           
            
            return data.valid
        } else {
          setAuth({})
            return 
        }
        } catch (error) {
          setAuth({})
            return 
        }
      };
    return{
        checkAccessToken:checkAccessToken,
        getToken:getToken,
        AccessToken: token,
        setAccessToken:saveToken,
  }
} 