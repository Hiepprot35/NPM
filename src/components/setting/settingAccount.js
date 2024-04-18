import Header from "../Layout/header/header";
import useAuth from "../../hook/useAuth";
import { useEffect, useState } from "react";
import FormInput from "../Layout/FormInput/FormInput";
import './settingAccount.css'
import { motion } from "framer-motion";
import PropertyUser from "./propertyUser";
import { getDate } from "../../function/getTime";
import SuccessNotification from "../Notification/successNotifi";
import Home from "../home/home";
import Windowchat from "../message/windowchat";
import MessageMainLayout from "../message/messageMainLayout";
export default function SettingAccount() {
    const [userInfo, setUserInfo] = useState();
    const [inputs, setInputs] = useState();
    const [saved,setSaved]=useState(false);
    const [clicked, setClicked] = useState(false);
    const [choosenProperty, setChoosenProperty] = useState({ key: "", value: "" })
    const [messRes,setMessRes]=useState();
    const { auth } = useAuth();
    useEffect(() => {
        const getData = async (data) => {
            try {
                const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${auth.username}`);

                const resJson = await res.json()
                setUserInfo(resJson)
            } catch (error) {

                console.error('Error occurred:', error);
            }
        }
        getData()
    }
        , [])
    async function updateUser(proterty)
    {
        try {
          const res=await fetch(`${process.env.REACT_APP_DB_HOST}/api/UpdateUserID/`,
          {
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(proterty)
          })
          const resJson=await res.json()
          setMessRes(resJson.message)
        } catch (error) {
         console.log(error)   
        }
    }
    useEffect(()=>{saved && updateUser(userInfo)
    setSaved(false);
    },[saved,userInfo])
    useEffect(() => {
        if (userInfo) {

            const keys = Object.keys(userInfo);
            const map = keys.map((key) => ({ key, value: userInfo[key] }));
            setInputs(map)
        }
    }, [userInfo])
    useEffect(() => { console.log(userInfo) }, [userInfo])
    const clickProperty = (data) => {
        setClicked(true)
        setChoosenProperty({ "key": data.key, "value": data.value });
    }
    const checkIsVerify=()=>{
        setUserInfo({...userInfo,isVerify:false})
    }
    return (

        <>
            <Header></Header>
            <MessageMainLayout isHidden={true} />
            <div className="column_form" style={{ width: "100%" }}>
                <div className="main_layout">
                    <h2>
                        Thông tin cá nhân
                    </h2>
                    <div className="thongtin_coban">
                        <h3>
                            Thông tin cơ bản
                        </h3>

                        {
                            inputs && inputs.map((e, index) => (
                                index < 5 && (
                                    <div className=" layout1" key={index} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                    }}>
                                        <div className="property_user" onClick={() => clickProperty(e)}>

                                            <div style={{ display: "flex" }}>
                                                <div>
                                                    {e.key}
                                                </div>

                                            </div>
                                            <div>
                                                <div>
                                                    {e.key==="Birthday" ?getDate(e.value):e.value}
                                                </div>                                       
                                                         </div>
                                        </div>

                                        <br></br>
                                    </div>
                                )
                            ))
                        }
                         <div className=" layout1" style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                    }}>
                                        <div className="property_user" >
                                        <div style={{ display: "flex" }}>
                                        <input type="checkbox" id="myCheck" onClick={checkIsVerify} ></input><p>Xác thực email</p>
                                        </div>
                                        </div>
                                    </div>
                      
                    </div>
                    {clicked && choosenProperty &&
                        <PropertyUser propertyUser={choosenProperty} setUserInfo={setUserInfo} setSaved={setSaved} setClicked={setClicked} userInfo={userInfo}></PropertyUser>
                    }
                </div>

            </div >
           <SuccessNotification messRes={messRes} setMessRes={setMessRes}></SuccessNotification>
        </>
    )
}