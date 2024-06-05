import React, { useEffect, useState } from "react";
import Header from "./header/header";
import Nvarbar from "./nvarbar/Nvarbar";
import { useRealTime } from "../../context/useRealTime";
import { FiCheck } from "react-icons/fi";
import VideoPlayer from "../chatapp/VideoPlayer";

export default function Layout({ link, children, nvarbar }) {
  const { CallComing } = useRealTime();
  const handleVideoCall = (userID) => {
    console.log("openchat");
    const url = `${process.env.REACT_APP_CLIENT_URL}/videocall/${userID}`;
    window.open(url, "_blank");
  };
  return (
    <>
      <Header hash={link} />
      {!nvarbar && <Nvarbar></Nvarbar>}
      <VideoPlayer  />
      {children}
    </>
  );
}
