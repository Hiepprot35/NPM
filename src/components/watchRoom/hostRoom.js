import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { io } from "socket.io-client";
import useAuth from "../../hook/useAuth";
import { fetchApiRes } from "../../function/getApi";
import useNoti from "../../hook/useNoti";


export default function HostRoom() {
  const { id, user } = useParams();
  const { auth } = useAuth();
  const { setNotiText } = useNoti();
  const [roomDetail, setRoomDetail] = useState(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef();

  const roomId = `${id}_${user}`;

  useEffect(() => {
    const fetchRoom = async () => {
      const data = await fetchApiRes(`zoomroom/roomDetail/${roomId}`);
      if (data?.result) {
        setRoomDetail(data.result);
        setPlaying(data.result.isPlaying);
      } else {
        setNotiText({ title: "Error", message: data.message, type: "error" });
      }
    };

    fetchRoom();
  }, []);

  const handlePlay = () => {
    socket.emit("play");
    setPlaying(true);
  };

  const handlePause = () => {
    socket.emit("pause");
    setPlaying(false);
  };

  const handleSeek = (progress) => {
    socket.emit("seek", progress.playedSeconds);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">🎬 Host Room Control</h1>

      {roomDetail && (
        <>
          <ReactPlayer
            ref={playerRef}
            url={roomDetail.url}
            playing={playing}
            controls
            width="100%"
            height="auto"
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleSeek}
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={handlePlay}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ▶️ Play
            </button>
            <button
              onClick={handlePause}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              ⏸️ Pause
            </button>
          </div>
        </>
      )}
    </div>
  );
}
