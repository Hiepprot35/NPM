import { useState } from "react";


export default function UseRfLocal() {
    const getRfToken = () => {
        const tokenString = localStorage.getItem('RefreshToken');
        if(tokenString)
        {
            const userToken = JSON.parse(tokenString);
            return userToken
        }
        return null
    }
    const [token, setToken] = useState(getRfToken())
    const saveToken = (userToken) => {
        localStorage.setItem('RefreshToken', JSON.stringify(userToken));
        setToken(userToken)
    }
    return{
        getRfToken:getRfToken,
        RefreshToken: token,
        setRefreshToken:saveToken,
  }
} 