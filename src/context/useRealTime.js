// SocketContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useSocket } from "./socketContext";
import { getStudentInfoByMSSV, getUserinfobyID } from "../function/getApi";
import useAuth from "../hook/useAuth";
const RealTimeContext = createContext();

export const useRealTime = () => {
  return useContext(RealTimeContext);
};

export const RealTimeContextProvider = ({ children }) => {
  const {auth}=useAuth()
    const socket=useSocket()
  const [Onlines, setUserOnline] = useState();
  const [CallComing, setCallComing] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [requestCall,setRequestCall]=useState()
  const [CallInfor,setCallInfor]=useState()
  const myVideo = useRef();
  const connectionRef=useRef()
  const userVideo = useRef();


  useEffect(() => {
    const handleCallUser =async ({ from, to,converID,senderSocket }) => {
      const getInfo = async () => {
        const res = await getUserinfobyID(from);
        if (res) {
          const data = res.username;
          const resUser = await getStudentInfoByMSSV(data);
          return resUser
        }
      };
      const data=await getInfo()
      setRequestCall({from,to,isRequesting:true,converID,name:data.Name,img:data.img,senderSocket:senderSocket})
    };
    if (socket) {
      socket.on("getUsers", (data) => {
        setUserOnline(data);
      });
      socket.on("requestCall",handleCallUser
)
    }
  
    return () => {
      if (socket) {
        socket.off("disconnect");
      }
    };
  }, [socket]);
  return (
    <RealTimeContext.Provider value={{ Onlines,CallComing,setCallComing,CallInfor,setCallInfor,myVideo,userVideo,callAccepted,setCallAccepted,requestCall,setRequestCall}}>
      {children}
    </RealTimeContext.Provider>
  );
};
