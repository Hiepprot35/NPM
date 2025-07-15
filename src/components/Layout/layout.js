import React, { useEffect, useState } from "react";
import Header from "./header/header";
import Nvarbar from "./nvarbar/Nvarbar";
import { useRealTime } from "../../context/useRealTime";
import { FiCheck } from "react-icons/fi";
import VideoPlayer from "../chatapp/VideoPlayer";
import { useSocket } from "../../context/socketContext";
import { Outlet } from "react-router-dom";
import ConversationList from "../conversation/conversationList";

export default function Layout({ link, children, nvarbar }) {
  const { requestCall, setRequestCall } = useRealTime();
  const socket = useSocket();
  const handleVideoCall = (userID) => {
    console.log("openchat");
    const url = `${process.env.REACT_APP_CLIENT_URL}/videocall/${userID}`;
    window.open(url, "_blank");
  };
  const answerCall = () => {
    setRequestCall();
    const width = 800; // Chiều rộng của cửa sổ tab nhỏ
    const height = (800 * 9) / 16; // Chiều cao của cửa sổ tab nhỏ

    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // Các thuộc tính của cửa sổ mới
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;
    const url = `${process.env.REACT_APP_CLIENT_URL}/videocall/?userID=${
      requestCall?.from
    }&converID=${requestCall.converID}&reply=${true}&senderSocket=${
      requestCall.senderSocket
    }`;
    window.open(url, "Video Call", windowFeatures);
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

        converID: requestCall?.converID,
      });
    }
    setRequestCall({});
  };
  return (
    <div>
      <Header />
      <ConversationList />
      {requestCall?.isRequesting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg w-[90%] max-w-md text-center space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <img
                src={requestCall?.img}
                alt="Caller Avatar"
                className="w-20 h-20 rounded-full object-cover shadow"
              />
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Incoming call from {requestCall?.name}
              </p>
            </div>

            <div className="flex justify-center gap-6 pt-2">
              <button
                onClick={answerCall}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white text-2xl flex items-center justify-center shadow-md transition"
              >
                <FiCheck />
              </button>
              <button
                onClick={refuseCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white text-xl font-bold flex items-center justify-center shadow-md transition"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
