import { useContext, useRef, useState, useEffect } from "react";
import { useRealTime } from "../../context/useRealTime";
import Peer from "simple-peer";
import { useSocket } from "../../context/socketContext";
import useAuth from "../../hook/useAuth";
import { getStudentInfoByMSSV, getUserinfobyID } from "../../function/getApi";
import { FiCheck, FiPhone } from "react-icons/fi";
import { cauculatorTime } from "../../function/getTime";
import { useLocation } from "react-router-dom";

const VideoPlayer = (props) => {
  const { auth } = useAuth();
  const location = useLocation();

  // Utility function to parse query parameters
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const query = useQuery();
  const userID = query.get("userID");
  const converID = query.get("converID");
  const reply = query.get("reply");
  const senderSocket = query.get("senderSocket");
  useEffect(() => {
    if (userID && converID) {
      setCallComing({ calling: true, userID: userID, converID: converID });
    }
  }, [userID, converID]);
  const [stream, setStream] = useState(null);
  const {
    CallComing,
    setCallComing,
    CallInfor,
    setCallInfor,
    myVideo,
    callAccepted,
    setCallAccepted,
    setRequestCall,
  } = useRealTime();
  const [call, setCall] = useState({});
  const [User, setUser] = useState();
  const [CallEnded, setCallEnded] = useState(false);
  const [timeStart, setTimeStart] = useState(0);
  const [Accepted, setAccepted] = useState();
  const connectionRef = useRef();
  const userVideo = useRef();
  const socket = useSocket();
  useEffect(() => {
    const getInfo = async () => {
      const res = await getUserinfobyID(userID);
      if (res) {
        const data = res.username;
        const resUser = await getStudentInfoByMSSV(data);
        setUser(resUser);
      }
    };

    getInfo();
  }, []);
  useEffect(() => {
    if (socket) {
      // Kiểm tra xem socket đã kết nối chưa
      if (socket.connected) {
        socket.emit("addUser", auth?.userID);
      } else {
        // Nếu chưa kết nối, lắng nghe sự kiện connect để gửi addUser khi socket kết nối thành công
        socket.on("connect", () => {
          socket.emit("addUser", auth?.userID);
        });
      }
    }
    // Đảm bảo rằng khi component unmounts, event listener được gỡ bỏ để tránh memory leaks
    return () => {
      if (socket) {
        socket.off("disconnect");
      }
    };
  }, [socket, auth]);

  useEffect(() => {
    if (socket && !reply && socket.connected) {
      socket.emit("requestCall", {
        from: auth.userID,
        to: userID,
        converID: converID,
        senderSocket: socket.id,
      });
    } else {
      socket.on("connect", () => {
        if (!reply)
          socket.emit("requestCall", {
            from: auth.userID,
            to: userID,
            converID: converID,
            senderSocket: socket.id,
          });
        if (reply) {
          socket.emit("requestAnswer", {
            senderSocket: senderSocket,
            isAccept: true,
            recevieSocket: socket.id,
          });
        }
      });
    }
  }, [socket, auth, reply]);
  useEffect(() => {
    if (socket) {
    }
  }, [socket]);
  useEffect(() => {
    let currentStream;
    const getMedia = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (myVideo.current) {
          setStream(currentStream);
          myVideo.current.srcObject = currentStream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };
    getMedia();
  }, []);

  const callUser = ({ stream, signal, recevieSocket }) => {
    try {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });
      peer.on("signal", (data) => {
        socket.emit("callUser", {
          senderSocket: socket.id,
          recevieSocket: recevieSocket,
          userToCall: parseInt(userID),
          signalData: data,
          from: auth.userID,
          create: Date.now(),
          converID: converID,
        });
      });
      peer.on("stream", (currentStream) => {
        if (currentStream) userVideo.current.srcObject = currentStream;
      });
      socket.on("callAccepted", (data) => {
        setCallAccepted(true);

        peer.signal(data.signal);
      });

      peer.on("close", () => {
        console.log("peer closed");
        socket.off("callAccepted");
      });
      connectionRef.current = peer;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("requestAnswer", (data) => {
        if (data.isAccept && stream) {
          callUser({ recevieSocket: data.recevieSocket, stream: stream });
        }
      });
      socket.on("callUser", (data) => {
        setCallAccepted(true);

        setCall(data);
      });
    }
  }, [socket, stream]);
  const answerCall = () => {
    try {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (data) => {
        console.log("AnswerCall");
        socket.emit("answerCall", {
          signal: data,
          to: parseInt(userID),
          socketId: socket.id,
          senderSocket: senderSocket,
        });
      });
      peer.on("stream", (currentStream) => {
        if (currentStream) {
          userVideo.current.srcObject = currentStream;
        }
      });
      console.log(call);
      peer.signal(call.signal);

      connectionRef.current = peer;
    } catch (error) {
      console.error("Error answering call:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (call?.signal) {
      console.log(call);
      answerCall();
    }
  }, [stream, call]);
  let intervalId;
  useEffect(() => {
    if (callAccepted) {
      intervalId = setInterval(() => {
        setTimeStart((pre) => pre + 1);
      }, 1000);
    }
    if (CallEnded) {
      console.log("Callended", CallEnded);
      clearInterval(intervalId); // Hủy bỏ interval khi component unmounts hoặc callAccepted thay đổi
    }
    return () => {
      clearInterval(intervalId); // Hủy bỏ interval khi component unmounts hoặc callAccepted thay đổi
    };
  }, [callAccepted, CallEnded]);

  useEffect(() => {
    if (socket) {
      socket.on("leaveCall", (data) => {
        setCallEnded(true);
      });
    }
  }, [socket]);

  const turnOfCam = () => {
    if (myVideo.current) {
      myVideo.current.srcObject = null; // Ngừng hiển thị luồng
      const stream = myVideo.current.srcObject;
      const tracks = stream?.getTracks();

      if (tracks) {
        tracks.forEach((track) => track.stop());
      }
      setCallAccepted(false);
      setTimeStart(0);
      setCallEnded(false);
      setCallComing({});
      connectionRef.current.destroy();
    }
  };
  useEffect(() => {
    return()=>{
      leaveCall()
    }
  }, []);

  const leaveCall = async () => {
    try {
      if (socket) {
        socket.emit("leaveCall", {
          time: timeStart,
          out:parseInt(userID),
          user: auth.userID,
          content: `<div className="callMess">Cuộc gọi dài ${cauculatorTime(
            timeStart
          )}</div>`,

          isHost: true,
          converID: converID,
        });
      }
      setCallEnded(true)
      turnOfCam();
    } catch (error) {
      console.error("Error leaving the call:", error);
    }
  };

  return (
    <>
      {
        <div className="videoPlayer relative bg-black h-full w-full">
          {User && (
            <div className="w-100 center flex-col pt-14 absolute">
              <img className="w-40 h-40 rounded-full" src={`${User.img}`} />
              <h1 className="text-white">Call {User.Name}</h1>
              {!CallEnded ? (
                <span className="circleButton w-30 h-30 z-9999" onClick={()=>leaveCall()}>
                  <FiPhone></FiPhone>
                </span>
              ) : (
                <>
                <h1 className="text-white">

                  Cuộc gọi kết thúc
                 </h1>
                  <span className="circleButton" onClick={turnOfCam}>
                    X
                  </span>
                </>
              )}
            </div>
          )}
          <div className="w-100 mb-14 absolute right-10 bottom-10 ">
            {
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                width="100"
                style={{ aspectRatio: "16/9" }}
              />
            }
          </div>
          <>
            {call && (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                width="100%"
                style={{ aspectRatio: "16/9" }}
              />
            )}
            <div id="videoContainer"></div>
          </>
          <div className="px-8 py-2 rounded-lg bg-white absolute right-10 top-10">
            <h1 className="text-black ">{cauculatorTime(timeStart)}</h1>
          </div>
        </div>
      }
    </>
  );
};

export default VideoPlayer;
