import React, { useEffect, useState } from "react";
import Header from "./header/header";
import Nvarbar from "./nvarbar/Nvarbar";
import { useRealTime } from "../../context/useRealTime";
import { FiCheck } from "react-icons/fi";
import VideoPlayer from "../chatapp/VideoPlayer";
import { useSocket } from "../../context/socketContext";

export default function Layout({ link, children, nvarbar }) {
  const { requestCall,setRequestCall } = useRealTime();
  const socket=useSocket()
  const handleVideoCall = (userID) => {
    console.log("openchat");
    const url = `${process.env.REACT_APP_CLIENT_URL}/videocall/${userID}`;
    window.open(url, "_blank");
  };
  const answerCall = () => {
   
    setRequestCall()
    const width = 800; // Chiều rộng của cửa sổ tab nhỏ
    const height = 800*9/16; // Chiều cao của cửa sổ tab nhỏ
    
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    // Các thuộc tính của cửa sổ mới
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;
    const url = `${process.env.REACT_APP_CLIENT_URL}/videocall/?userID=${requestCall?.from}&converID=${requestCall.converID}&reply=${true}&senderSocket=${requestCall.senderSocket}`;
    window.open(url, "Video Call",windowFeatures);
  };
  const refuseCall = () => {
    if (socket) {
      socket.emit("leaveCall", {
        time: 0,
        out: requestCall.from,
        user: requestCall.to,
        isHost: false,
        content: `<div className="callMess">
          Cuộc gọi từ chối
          </div>
          `,

        converID: requestCall?.converID
      });
    }
    setRequestCall({});
  };
  return (
    <>
      <Header hash={link} />
      {!nvarbar && <Nvarbar></Nvarbar>}
      {requestCall?.isRequesting && (
        <div className="callComing center w-screen h-screen z-10 fixed">
          <div className="p-10 bg-black rounded-2xl	">
            <div className="flex center">
              <p className="text-white">Call from {requestCall?.name}</p>
              <img className="avatarImage" src={`${requestCall?.img}`}></img>
            </div>
            <div className="flex">
              <span className="circleButton" onClick={() => answerCall()}>
                <FiCheck></FiCheck>
              </span>
              <span className="circleButton" onClick={() =>refuseCall()}>
                X
              </span>
            </div>
          </div>
        </div>
      )}      {children}
    </>
  );
}
