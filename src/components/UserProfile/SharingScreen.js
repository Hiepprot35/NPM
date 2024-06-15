import React, { useRef } from "react";
import { FiCamera } from "react-icons/fi";
import ReactPlayer from "react-player";
import Peer from "simple-peer";
import useAuth from "../../hook/useAuth";
import { useSocket } from "../../context/socketContext";

export default function SharingScreen() {
  const streamingScreenRef = useRef();
  const {auth}=useAuth()
  const socket=useSocket()
  const getScreen = async () => {
    try {
      
      const options = { audio: true, video: true };
      // Sử dụng async/await để đợi kết quả của getDisplayMedia
      const stream = await navigator.mediaDevices.getDisplayMedia(options);
      const peer =new Peer({ initiator: true,
        trickle: false,
        stream: stream,})
        peer.on("signal", (data) => {
          socket.emit("StreamingReport", {
            streamer: auth?.userID,
            signalData: data,
            create: Date.now(),
          });
        });
      if (streamingScreenRef.current) {
        streamingScreenRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Lỗi khi truy cập màn hình:", error);
    }
  };

  return (
    <>
      <div className="circleButton" onClick={getScreen}>
        <FiCamera />
      </div>
      <video
        ref={streamingScreenRef}
        controls
        width="300"
        style={{ aspectRatio: "16/9" }}
      ></video>
    </>
  );
}
