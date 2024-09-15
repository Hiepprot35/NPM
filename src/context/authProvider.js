import { createContext, useState } from "react";
import { getStudentInfoByMSSV } from "../function/getApi";
import { useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [myInfor,setMyInfor]=useState({})
    useEffect(() => {
        if(auth.username)
        {
            const data=async()=>
            {
                console.log(auth)
                const res=await getStudentInfoByMSSV(auth.username)
                setMyInfor({...res,avtUrl:res?.cutImg||res?.img})
            }
            data()
        }
    }, [auth]);
    return (
        <AuthContext.Provider value={{ auth, setAuth,myInfor ,setMyInfor}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;