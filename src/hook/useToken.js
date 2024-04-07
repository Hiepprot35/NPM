import { useState } from "react";

export default function UseToken() {
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
    
    return{
        getToken:getToken,
        AccessToken: token,
        setAccessToken:saveToken,
  }
} 