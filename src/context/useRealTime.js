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

  const [CallInfor,setCallInfor]=useState()
  const myVideo = useRef();
  const connectionRef=useRef()
  const userVideo = useRef();
  const callUser = (stream) => {
    try {
      if (socket && stream) {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on("signal", (data) => {
          socket.emit("callUser", {
            userToCall: parseInt(CallComing.userID),
            signalData: data,
            from: auth.userID,
            create: Date.now(),
            converID: CallComing.converID,
          });
        });
        peer.on("stream", (currentStream) => {
          userVideo.current.srcObject = currentStream;
        });
        socket.on("callAccepted", (signal) => {
          setCallAccepted(true);
          peer.signal(signal);
        });
        peer.on("close", () => {
          console.log("peer closed");
          socket.off("callAccepted");
        });
        connectionRef.current = peer;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let currentStream;

    const handleCallUser = ({ from, signal }) => {
      console.log("Getcall", from);
    };
    const getMedia = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        callUser(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    if (CallComing || CallInfor?.isReceivingCall) {
      getMedia();
    }

    return () => {
      if (socket) {
        socket.off("callUser", handleCallUser);
      }
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [socket, CallComing]);
  useEffect(() => {
    const handleCallUser =async ({ from, signal,converID }) => {
      const getInfo = async () => {
        const res = await getUserinfobyID(from);
        if (res) {
          const data = res.username;
          const resUser = await getStudentInfoByMSSV(data);
          return resUser
        }
      };
      const data=await getInfo()
      setCallInfor({ isReceivingCall: true, from: from,name:data.Name,img:data.img, signal: signal,converID:converID });
    };
      console.log("calling")
    if (socket) {
      socket.on("callUser", handleCallUser);
    }

 
      
  
  }, [socket]);
  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (data) => {
        setUserOnline(data);
      });
    }
    return () => {
      if (socket) {
        socket.off("disconnect");
      }
    };
  }, [socket]);
  return (
    <RealTimeContext.Provider value={{ Onlines,CallComing,setCallComing,CallInfor,setCallInfor,myVideo,userVideo}}>
      {children}
    </RealTimeContext.Provider>
  );
};
