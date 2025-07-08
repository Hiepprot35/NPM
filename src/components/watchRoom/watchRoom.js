import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ReactPlayer from "react-player";
import useAuth from "../../hook/useAuth";
import { fetchApiRes } from "../../function/getApi";

const socket = io("http://localhost:4000");

const WatchParty = () => {
  const { id, user } = useParams();
  const { auth } = useAuth();
  const [username, setUserName] = useState(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [videoUrl, setVideoUrl] = useState();
  const [playing, setPlaying] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef();
  const [movieLinks, setMovieLinks] = useState([]);
  const roomId = `${id}_${user}`;
  const watchMovieHandle = async (_id) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${_id}/videos`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTMxMjY0M2U3MzQ5YjAyM2Q4YWE0NzViMzUyMzYwMSIsIm5iZiI6MTcwOTYyNzU4Ny44ODQsInN1YiI6IjY1ZTZkOGMzOGQxYjhlMDE4NzY3MjEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E-lHmBEJfzOIKKhgLmhkTHJEo93Hty66USQqJeAsp60`,
          },
        }
      );
      const data = await res.json();
      if (data?.results?.length > 0) {
        setMovieLinks(data.results);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    watchMovieHandle(id);
  }, [id]);
  useEffect(() => {
    if (auth) setUserName(auth);
  }, [auth]);
  const [roomDetail, setroomDetail] = useState();
  const fetchData = async () => {
    try {
      const data = await fetchApiRes(`zoomroom/roomDetail/${roomId}`);
      console.log("hcange video", data);
      setroomDetail(data);
      setPlaying(data.isPlaying);
    } catch (err) {
      console.error("Failed to fetch room detail:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roomId, videoUrl]);
  const [ready, setReady] = useState(false); // để đánh dấu khi player sẵn sàng

  useEffect(() => {
    if (ready && roomDetail?.currentTime != null) {
      playerRef.current?.seekTo(roomDetail.currentTime, "seconds");
    }
  }, [ready, roomDetail]);
  useEffect(() => {
    if (!hasInteracted || !username) return;

    socket.emit("join-room", {
      roomId,
      username,
      roomName: "Room demo",
      movieId: id,
      userId: auth.userID,
    });

    socket.on("sync-video", ({ currentTime, isPlaying }) => {
      playerRef.current?.seekTo(currentTime, "seconds");
      setPlaying(isPlaying);
    });

    socket.on("play", () => setPlaying(true));
    socket.on("pause", () => setPlaying(false));
    socket.on("seek", (time) => playerRef.current?.seekTo(time, "seconds"));
    socket.on("chat", (m) => setChat((prev) => [...prev, m]));
    socket.on("change-video", (newUrl) => {
      console.log(newUrl);
      setVideoUrl(newUrl);
    });

    return () => {
    socket.emit("leave-room", roomId);
    socket.disconnect();
  };;
  }, [hasInteracted, username]);

  const handlePlay = () => socket.emit("play");
  const handlePause = () => socket.emit("pause");

  const handleSeek = (progress) => {
    socket.emit("seek", progress.playedSeconds);
  };

  const sendMsg = () => {
    if (msg.trim()) socket.emit("chat", msg);
    setMsg("");
  };
  const handleSelectVideo = () => {};
  const submitNewVideo = (url) => {
    if (ReactPlayer.canPlay(url)) {
      socket.emit("change-video", url);
      setVideoUrl(url);
    } else {
      alert("URL không hợp lệ!");
    }
  };

  if (!hasInteracted) {
    return (
      <div className="p-4 text-center">
        <h2 className="mb-4 text-xl">🎬 Bạn đã sẵn sàng xem cùng bạn bè?</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setHasInteracted(true)}
        >
          Tham gia phòng
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen box-border">
  <div className="flex h-full gap-4">
    {/* LEFT SIDE: Video + List Play (70%) */}
    <div className="w-[70%] flex flex-col">
      {/* Video player */}
      <div className="flex-1 flex flex-col items-center justify-start">
        <ReactPlayer
          ref={playerRef}
          url={roomDetail?.url}
          playing={playing}
          controls
          width="100%"
          height="100%"
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleSeek}
          onReady={() => setReady(true)}
        />
      </div>

      {/* List Play: scroll ngang */}
      <div className="mt-4 border-t pt-2">
        <h2 className="font-semibold mb-2">📼 List Play</h2>
        <div className="overflow-x-auto whitespace-nowrap space-x-4 flex pb-2">
          {movieLinks?.slice(0, 20).map((v, i) => (
            <div
              key={i}
              className="group cursor-pointer inline-block w-48 flex-shrink-0 p-2 rounded-lg border transition-all duration-200 hover:shadow-md hover:scale-[1.01] hover:border-purple-400 hover:bg-purple-50"
              onClick={() =>
                submitNewVideo(`https://www.youtube.com/watch?v=${v.key}`)
              }
            >
              <img
                src={`https://img.youtube.com/vi/${v.key}/0.jpg`}
                alt={v.name}
                className="w-full h-28 object-cover rounded group-hover:brightness-110 group-hover:scale-105 transition-transform duration-200"
              />
              <div className="mt-2 text-sm font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                {v.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* RIGHT SIDE: Chat (30%) */}
    <div className="w-[30%] flex flex-col border p-2">
      <h2 className="font-semibold mb-2">💬 Trò chuyện</h2>
      <div className="overflow-y-auto flex-1 mb-2">
        {chat.map((m, i) => (
          <div className="flex items-center gap-2 mb-1" key={i}>
            <img
              className="w-12 h-12 rounded-full"
              src={m.avtUrl}
              alt="avatar"
            />
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Nhắn gì đó..."
          className="border p-1 flex-1 mr-2"
        />
        <button
          onClick={sendMsg}
          className="bg-green-500 text-white px-3 py-1"
        >
          Gửi
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default WatchParty;
