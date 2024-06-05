import { useContext, useRef, useState, useEffect } from "react";
import { useRealTime } from "../../context/useRealTime";
import Peer from "simple-peer";
import { useSocket } from "../../context/socketContext";
import useAuth from "../../hook/useAuth";
import { getStudentInfoByMSSV, getUserinfobyID } from "../../function/getApi";
import { FiCheck, FiPhone } from "react-icons/fi";
import { cauculatorTime } from "../../function/getTime";
import { Modal } from "antd";

const VideoPlayer = (props) => {
  const { auth } = useAuth();
  const [stream, setStream] = useState(null);
  const { CallComing, setCallComing, CallInfor, setCallInfor } = useRealTime();
  const [call, setCall] = useState({});
  const [User, setUser] = useState();
  const [CallEnded, setCallEnded] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [timeStart, setTimeStart] = useState(0);
  const connectionRef = useRef();
  const myVideo = useRef();
  const userVideo = useRef();
  const socket = useSocket();
  useEffect(() => {
    const getInfo = async () => {
      if (CallInfor || CallComing) {
        const res = await getUserinfobyID(CallInfor?.from || CallComing.userID);
        if (res) {
          const data = res.username;
          const resUser = await getStudentInfoByMSSV(data);
          setUser(resUser);
        }
      }
    };
    getInfo();
  }, [CallInfor, CallComing]);
  const answerCall = () => {
    setCallComing(true);
    setCallInfor({ ...CallInfor, isReceivingCall: false });
    try {
      setCallAccepted(true);
      const peer = new Peer({ initiator: false, trickle: false });
      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data, to: CallInfor.from });
      });
      peer.on("stream", (currentStream) => {
        console.log(currentStream, "current");
        if (currentStream) {
          if (userVideo.current) {
            userVideo.current.srcObject = currentStream;
          }
        }
      });
      peer.signal(CallInfor.signal);
      connectionRef.current = peer;
    } catch (error) {
      console.log(error);
    }
  };

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

        console.log("currentStream", currentStream);
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
      setCallComing(false);
      setCallInfor({});
      connectionRef.current.destroy();
    }
  };
  const refuseCall = () => {
    if (socket) {
      socket.emit("leaveCall", {
        time: timeStart,
        out: User?.UserID,
        user: auth.userID,
        isHost: CallInfor?.from ? false : true,
        content: `<div className="callMess">
          Cuộc gọi từ chối
          </div>
          `,

        converID: CallComing?.converID || CallInfor?.converID,
      });
    }
    setCallInfor({});
  };
  const leaveCall = async () => {
    try {
      if (socket) {
        socket.emit("leaveCall", {
          time: timeStart,
          out: User?.UserID,
          user: auth.userID,
          content: `<div className="callMess">Cuộc gọi dài ${cauculatorTime(
            timeStart
          )}</div>`,

          isHost: CallInfor?.from ? false : true,
          converID: CallComing?.converID || CallInfor?.converID,
        });
      }
      turnOfCam();
      // Reset call state
    } catch (error) {
      console.error("Error leaving the call:", error);
    }
  };
  document.title = "Videoo call";
  return (
    <>
      <Modal
      onCancel={leaveCall}
      style={{width:"50vw"}}
      footer={<></>}
      open={CallInfor?.isReceivingCall|| CallComing}

      >
        {CallInfor?.isReceivingCall && (
          <div className="callComing center z-10 ">
            <div className="p-10 rounded-2xl	">
              <div className="flex center">
                <p>Call from {CallInfor?.name}</p>
                <img className="avatarImage" src={`${CallInfor?.img}`}></img>
              </div>
              <div className="flex">
                <span className="circleButton" onClick={() => answerCall()}>
                  <FiCheck></FiCheck>
                </span>
                <span className="circleButton" onClick={() => refuseCall()}>
                  X
                </span>
              </div>
            </div>
          </div>
        )}
        {CallComing && (
          <div className="videoPlayer bg-white w-100 z-9999">
            {User && (
              <div className="w-100 center flex-col pt-14">
                <img className="w-40 h-40 rounded-full" src={`${User.img}`} />
                <h1 className="text-black">Call {User.Name}</h1>
                <h1 className="text-black"> {cauculatorTime(timeStart)}</h1>

                {!CallEnded ? (
                  <span className="circleButton w-30 h-30" onClick={leaveCall}>
                    <FiPhone></FiPhone>
                  </span>
                ) : (
                  <>
                    Cuộc gọi kết thúc
                    <span className="circleButton" onClick={turnOfCam}>
                      X
                    </span>
                  </>
                )}
              </div>
            )}
            <div className="w-100 mb-14 absolute right-0 bottom-0 ">
              <video playsInline muted ref={myVideo} autoPlay width="30%" />
            </div>
            <>
              <video playsInline ref={userVideo} autoPlay width="600" />
              <div id="videoContainer"></div>
            </>
          </div>
        )}
      </Modal>
    </>
  );
};

export default VideoPlayer;
