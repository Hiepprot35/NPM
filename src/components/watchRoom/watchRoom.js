import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import useAuth from "../../hook/useAuth";
import { fetchApiRes } from "../../function/getApi";
import useNoti from "../../hook/useNoti";
import { useSocket } from "../../context/socketContext";
import moment from "moment";
import { formatLiveTime } from "../../function/getTime";

const WatchParty = () => {
  const { setNotiText } = useNoti();
  const { id, user } = useParams();
  const { auth, myInfor } = useAuth();
  const socket = useSocket();
  const [chat, setChat] = useState([]);
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("");
  const [videoUrl, setVideoUrl] = useState();
  const [playing, setPlaying] = useState(true);
  const [roomDetail, setRoomDetail] = useState();
  const [movieLinks, setMovieLinks] = useState([]);
  const [ready, setReady] = useState(false);
  const [total, setTotal] = useState(0);
  const chatRef = useRef(null);
  const playerRef = useRef();
  const roomId = `${id}_${user}`;
  const limit = 20;

  const fetchMessages = async (pageNum = 1) => {
    const res = await fetchApiRes(
      `zoomroom/message?roomId=${roomId}&videoUrl=${videoUrl}&page=${pageNum}&limit=${limit}`
    );
    console.log(res.result, "kekekekekekekekek");
    setChat(res.result);
    setTotal(res.totalCount || res.result.length);
  };

  const fetchData = async () => {
    try {
      await fetchMessages(1);
      const data = await fetchApiRes(`zoomroom/roomDetail/${roomId}`);
      if (data.result) {
        console.log(data, "cekkkkkkk");
        setRoomDetail(data.result);
        document.title = data.result.roomName + " - " + " Watch party";
        setPlaying(data.isPlaying);
        watchMovieHandle(id);
      }
      if (data.message) {
        setNotiText({
          message: data.message,
          title: "Notification",
          type: "info",
        });
      }
    } catch (err) {
      console.error("Failed to fetch room detail:", err);
    }
  };

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
      if (data?.results?.length > 0) setMovieLinks(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roomId, videoUrl]);

  useEffect(() => {
    if (ready && roomDetail?.currentTime != null) {
      playerRef.current?.seekTo(roomDetail.currentTime, "seconds");
    }
  }, [ready, roomDetail]);

  useEffect(() => {
    socket.emit("join-room", {
      roomId,
      username: auth,
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
    socket.on("change-video", (newUrl) => setVideoUrl(newUrl));

    return () => {
      socket.emit("leave-room", roomId, auth.userID);
      socket.disconnect();
    };
  }, [auth]);

  const handlePlay = () => socket.emit("play");
  const handlePause = () => socket.emit("pause");
  const handleSeek = (progress) => socket.emit("seek", progress.playedSeconds);

  const sendMsg = () => {
    if (msg.trim()) socket.emit("chat", msg, myInfor);
    setMsg("");
  };

  const submitNewVideo = (url) => {
    if (ReactPlayer.canPlay(url)) {
      socket.emit("change-video", url);
      setVideoUrl(url);
    } else {
      alert("URL không hợp lệ!");
    }
  };

  const handleScrollChat = () => {
    const el = chatRef.current;
    if (!el) return;
    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10 &&
      chat.length < total
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) fetchMessages(page);
  }, [page]);

  return (
    <div className="p-4 h-screen box-border py-40">
      <div className="flex h-full gap-4">
        {/* LEFT: Video */}
        <div className="w-[70%] flex flex-col">
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
          <div className="mt-4 border-t pt-2">
            <h2 className="font-semibold mb-2">📼 List Play</h2>
            <div className="overflow-x-auto whitespace-nowrap space-x-4 flex pb-2">
              {movieLinks?.slice(0, 20).map((v, i) => (
                <div
                  key={i}
                  className="group cursor-pointer inline-block w-48 flex-shrink-0 p-2 rounded-lg border hover:shadow-md hover:scale-105 hover:border-purple-400 hover:bg-purple-50"
                  onClick={() =>
                    submitNewVideo(`https://www.youtube.com/watch?v=${v.key}`)
                  }
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.key}/0.jpg`}
                    alt={v.name}
                    className="w-full h-28 object-cover rounded"
                  />
                  <div className="mt-2 text-sm font-medium text-gray-800">
                    {v.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Chat */}
        <div className="w-[30%] flex flex-col border p-2">
          <h2 className="text-2xl font-semibold mb-2">💬 Chat</h2>
          <div
            className="overflow-y-auto flex-1 mb-2"
            onScroll={handleScrollChat}
            ref={chatRef}
          >
            {chat.map((m, i) => (
              <div className="flex items-start gap-2 mb-2" key={i}>
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={m.avatarUrl || "/default-avatar.png"}
                  alt="avatar"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/profile/${m.userId}`}
                      className="text-blue-600 font-semibold hover:underline text-sm"
                    >
                      {m.username || "Guest"}
                    </a>
                    <span className="text-gray-400 text-xs">
                      {formatLiveTime(m.sentAt)}
                    </span>
                  </div>
                  <div className="text-base">{m.message}</div>
                </div>
              </div>
            ))}

            {chat.length < total && (
              <div className="text-sm text-center text-gray-500 py-2">...</div>
            )}
          </div>
          <div className="w-full px-4 mt-4">
            <div className="relative w-full">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                placeholder="Type your message..."
                className="w-full pr-20 px-4 py-2 text-base border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                onClick={sendMsg}
                className="absolute right-1 top-1 bottom-1 bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-full text-sm shadow-sm transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchParty;
