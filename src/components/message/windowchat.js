import { Modal, Popover } from "antd";
import EmojiPicker from "emoji-picker-react";
import { LuSticker } from "react-icons/lu";

import { memo, useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiEdit,
  FiImage,
  FiMinus,
  FiPhone,
  FiSend,
  FiSmile,
  FiVideo,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { useData } from "../../context/dataContext";
import { useSocket } from "../../context/socketContext";
import {
  TheMovieApi,
  fetchApiRes,
  getStudentInfoByMSSV,
  getUserinfobyID,
} from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import { Image } from "../home/home";
import Message from "./Message";
import "./windowchat.css";
import { data } from "jquery";
import { IsLoading } from "../Loading";
import UserProfile from "../UserProfile/userProfile";
import ShowImgDialog from "./windowchat/ShowImgMess";
import { useRealTime } from "../../context/useRealTime";
import VideoPlayer from "../chatapp/VideoPlayer";
import UseToken from "../../hook/useToken";
import UseRfLocal from "../../hook/useRFLocal";
const ClientURL = process.env.REACT_APP_CLIENT_URL;
export const movieApi = async (videoID) => {
  const url = `https://api.themoviedb.org/3/movie/${videoID}`;
  const data = await TheMovieApi(url);
  if (data.id) {
    return { img: data.backdrop_path, title: data.name || data.title };
  } else {
    return "cccc";
  }
};
export const fetchVideoTitle = async (videoID) => {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${process.env.REACT_APP_YTB_KEY}&part=snippet`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].snippet.title;
  } else {
    return null;
  }
};

export default memo(function WindowChat(props) {
  const { auth } = useAuth();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useSocket();
  const [inputMess, setInputmess] = useState("");
  const conversation = props?.count;
  const SettingConversation = ({ conversation, user }) => {
    const { auth } = useAuth();
    const [OpenMask, setOpenMask] = useState(false);
    const [OpenIcon, setOpenIcon] = useState(false);
    const [host, setHost] = useState();
    const [mask1, setMask1] = useState(null);
    const [mask2, setMask2] = useState(null);
    const { setListWindow } = useData();
    const updateConver = async () => {
      if (mask1 || mask2) {
        const obj =
          conversation.user1 === auth.userID
            ? {
                id: conversation.id,
                user1_mask: mask1 || conversation.user1_mask,
                user2_mask: mask2 || conversation.user2_mask,
              }
            : {
                id: conversation.id,
                user1_mask: mask2 || conversation.user1_mask,
                user2_mask: mask1 || conversation.user2_mask,
              };
        setListWindow((pre) =>
          pre.map((e) =>
            e.id === conversation.id ? { ...e, ...obj } : { ...e }
          )
        );
        setOpenMask(false);
        const res = await fetchApiRes(
          "message/updateConversation",
          "POST",
          obj
        );
        if (mask1) {
          const Mes = {
            conversation_id: conversation.id,
            content: `<div className="maskUserChange">${host.Name} đã đổi biệt danh thành ${mask1}</div>`,
            sender_id: auth.userID,
            created_at: Date.now(),
            isFile: 0,
          };
          await fetchApiRes("message", "POST", Mes);
        }
        if (mask2) {
          const Mes2 = {
            conversation_id: conversation.id,
            content: `<div className="maskUserChange">${host.Name} đã đổi biệt danh thành ${mask2}</div>`,
            sender_id: auth.userID,
            created_at: Date.now(),
            isFile: 0,
          };
          await fetchApiRes("message", "POST", Mes2);
        }
      }
    };

    useEffect(() => {
      const getData = async () => {
        const data = await getStudentInfoByMSSV(auth?.username);
        setHost(data);
      };
      getData();
    }, []);
    useEffect(() => {
      if (!OpenMask) {
        setMask1();
        setMask2();
      }
    }, [OpenMask]);
    const clickEmoji = async (e) => {
      setListWindow((pre) =>
        pre.map((v) =>
          v.id === conversation.id ? { ...v, iconConver: e.imageUrl } : { ...v }
        )
      );
      const res = await fetchApiRes("message/updateConversation", "POST", {
        id: conversation.id,
        iconConver: e.imageUrl,
      });
      const Mes = {
        conversation_id: conversation.id,
        content: `<div className="center">${host.Name} đã đổi icon emojiLink${e.imageUrl}emojiLink </div>`,
        sender_id: auth.userID,
        created_at: Date.now(),
        isFile: 0,
      };
      await fetchApiRes("message", "POST", Mes);
      socketSend(Mes);
      setOpenIcon(false);
    };
    const updateIcon = (second) => {};
    return (
      <ul>
        <li>
          <div
            className="center p-4 rounded-lg cursor-pointer hover:bg-gray-700"
            onClick={() => {
              setOpenMask(true);
            }}
          >
            <FiEdit></FiEdit>
            Cài đặt biệt danh
          </div>
          <Modal
            open={OpenMask}
            onCancel={() => setOpenMask(false)}
            title={"Biệt danh"}
            onOk={updateConver}
          >
            <div className="flex m-2">
              <div className="center">
                <img className="avatarImage" src={`${host?.img}`}></img>
              </div>
              <div className="m-4">
                <p>{host?.Name}</p>
                <input
                  value={mask1}
                  onChange={(e) => setMask1(e.target.value)}
                  placeholder={`${
                    conversation.user1 === auth.userID
                      ? conversation.user1_mask
                      : conversation.user2_mask
                  }`}
                ></input>
              </div>
            </div>
            <div className="flex m-2">
              <div className="center">
                <img className="avatarImage" src={`${user?.img}`}></img>
              </div>
              <div className="m-4">
                <p>{user?.Name}</p>
                <input
                  value={mask2}
                  onChange={(e) => setMask2(e.target.value)}
                  placeholder={`${
                    conversation.user1 === auth.userID
                      ? conversation.user2_mask
                      : conversation.user1_mask
                  }`}
                ></input>
              </div>
            </div>
          </Modal>
        </li>
        <li>
          <div
            className="center p-4 rounded-lg cursor-pointer hover:bg-gray-700"
            onClick={() => setOpenIcon(true)}
          >
            <FiSmile></FiSmile>
            Cài đặt biểu tượng
          </div>
          <Modal
            open={OpenIcon}
            onCancel={() => setOpenIcon(false)}
            title={"Icon"}
            onOk={updateIcon}
          >
            <EmojiPicker
              onEmojiClick={(e) => clickEmoji(e)}
              className="w-full"
            />
          </Modal>
        </li>
      </ul>
    );
  };
  const { listWindow, setListWindow, setListHiddenBubble, listHiddenBubble } =
    useData();
  const userConver =
    conversation?.user1 === auth.userID
      ? conversation?.user2
      : conversation?.user1;
  const myMask =
    conversation.user1 === auth?.userID
      ? conversation.user1_mask
      : conversation.user2_mask;
  const userMask =
    conversation.user1 === auth?.userID
      ? conversation.user2_mask
      : conversation.user1_mask;
  const windowchat_input = useRef(null);
  const main_windowchat = useRef(null);
  const inputValue = useRef(null);
  const [emoji, setEmoji] = useState([]);
  const [imgView, setImgView] = useState([]);
  const [fileImg, setFileImg] = useState([]);
  const image_message = useRef(null);
  const windowchat = useRef(null);
  const [userInfor, setUserInfo] = useState();
  const [messages, setMessages] = useState(props.messages);

  const { Onlines, CallComing, setCallComing } = useRealTime();

  const [Sending, setSending] = useState(false);
  const [ErrorMess, setErrorMess] = useState();
  const [ShowImgMess, setShowImgMess] = useState();
  const { AccessToken, setAccessToken } = UseToken();
  const { RefreshToken } = UseRfLocal();
  const channel = new BroadcastChannel("message_channel");

  async function getMessages() {
    if (conversation?.id) {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/message/conversation/${conversation?.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${AccessToken}`,
              "Content-Type": "application/json",
              RefreshToken: RefreshToken,
            },
            body: JSON.stringify({ userID: auth.userID }),
          }
        );
        const data = await res.json();
        if (data.error) {
          setErrorMess("Vui lòng đăng nhập để thực hiện");
          setListHiddenBubble([]);
          setListWindow([]);
        } else {
          setMessages(data);
        }
      } catch (err) {}
    }
  }
  function pasteImg(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
        e.preventDefault();
        const file = items[i].getAsFile();
        setFileImg((pre) => [...pre, file]);
        setImgView((pre) => [...pre, URL.createObjectURL(file)]);
        // Bạn có thể xử lý thêm tệp hình ảnh ở đây, chẳng hạn như hiển thị hoặc tải lên máy chủ
      }
    }
  }
  function closeHiddenWindow(e) {
    setListHiddenBubble((pre) => {
      const newData = pre.filter((obj) => obj.id !== e.id);
      return newData;
    });
  }

  const showHiddenConver = (e) => {
    setListWindow((pre) => {
      const data = [...pre];
      data.push(e);
      return data;
    });
    closeHiddenWindow(e);
  };
  function hiddenWindowHandle(c) {
    setListHiddenBubble((pre) => [...pre, c]);
    closeWindow();
  }
  function pick_imageMess(e) {
    const imgMessFile = e.target.files;
    for (let i = 0; i < imgMessFile.length; i++) {
      setFileImg((pre) => [...pre, imgMessFile[i]]);
      setImgView((pre) => [...pre, URL.createObjectURL(imgMessFile[i])]);
    }
  }

  function remove_imageMess(e) {
    const data = [...imgView];
    const data2 = [...fileImg];
    const index = data.findIndex((v) => v.toString() === e.toString());

    if (index !== -1) {
      data.splice(index, 1); // Xóa phần tử tại chỉ số index trong mảng data
      data2.splice(index, 1); // Xóa phần tử tương ứng tại chỉ số index trong mảng data2

      setImgView(data); // Cập nhật trạng thái imgView với mảng đã thay đổi
      setFileImg(data2); // Cập nhật trạng thái fileImg với mảng đã thay đổi
    }
  }
  function onClickEmoji(e) {
    setEmoji((prev) => [
      ...prev,
      { id: inputMess.length, emoji: e.emoji, imageUrl: e.imageUrl },
    ]);
    if (inputValue.current) {
      inputValue.current.innerHTML =
        inputValue.current.innerHTML + " " + e.emoji;
      inputChange();
    }
  }
  useEffect(() => {
    if (socket) {
      socket.emit("isTyping", {
        isTyping: inputMess ? true : false,
        receiverId: userConver,
      });
    }
  }, [inputMess]);
  const [detailConver, setdetailConver] = useState();
  let isSetting = false;
  useEffect(() => {
    // Lắng nghe thông điệp từ các tab khác
    channel.onmessage = (event) => {
      if (event.data.conversation_id === conversation.id) {
        setArrivalMessage(event.data);
      }
    };

    return () => {
      channel.close();
    };
  }, [conversation]);

  const socketSend = async (data) => {
    try {
      if (socket && !isSetting) {
        isSetting = true;
        const mess = {
          conversation_id: conversation.id,
          sender_id: data.sender_id,
          receiverId: userConver,
          content: data.content,
          isFile: data.isFile,
          nameUser: myMask,
          created_at: Date.now(),
        };
        // channel.postMessage(mess);

        socket.emit("sendMessage", mess);
        if (props.chatApp === true) {
          props.setsendMess(mess);
        }
      }
      console.log(data);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      isSetting = false;
    }
  };

  useEffect(() => {
    console.log(emoji);
  }, [emoji]);

  const sendFastHandle = async () => {
    const data = new FormData();
    const messObj = {
      sender_id: auth.userID,
      created_at: Date.now(),
      conversation_id: conversation.id,
    };
    const content = conversation.iconConver
      ? conversation.iconConver
      : "emojiLinkhttps://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/1f606.pngemojiLink";
    data.set("isFile", 0);
    data.set("sender_id", auth.userID);
    data.set("conversation_id", conversation.id);
    data.set("created_at", Date.now());
    data.set("content", content);
    channel.postMessage({ ...messObj, content: content, isFile: 0 });
    const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    socketSend(result);
  };
  const [ImgMess, setImgMess] = useState([]);
  async function handleSubmit(e) {
    e.preventDefault();
    inputValue.current.focus();
    try {
      const messagesText = inputMess;
      const emojiText = emoji;
      const ImageFile = fileImg;
      const viewImg = imgView;
      let socketMess = [];
      const messObj = {
        sender_id: auth.userID,
        created_at: Date.now(),
        conversation_id: conversation.id,
      };
      const update = [...messages];
      if (ImageFile.length > 0) {
        channel.postMessage({
          ...messObj,
          content: viewImg.toString(),
          isFile: 1,
        });
        update.push({
          ...messObj,
          content: viewImg.toString(),
          isFile: 1,
        });
      }
      if (messagesText.length > 0 && emojiText.length === 0) {
        channel.postMessage({
          ...messObj,
          content: messagesText,
          isFile: 0,
        });
        update.push({
          ...messObj,
          content: messagesText,
          isFile: 0,
        });
      }
      let updatedInputMess;
      if (emojiText.length > 0) {
        emojiText.forEach((e, i) => {
          updatedInputMess = messagesText.replaceAll(
            e.emoji,
            "emojiLink" + e.imageUrl + "emojiLink"
          );
        });
        channel.postMessage({
          ...messObj,
          content: updatedInputMess,
          isFile: 0,
        });

        update.push({
          ...messObj,
          content: updatedInputMess,
          isFile: 0,
        });
      }
      // setMessages(update);
      setSending(true);
      setEmtyImg();
      setEmoji([]);
      setInputmess("");
      inputValue.current.innerHTML = "";
      const promises = [];
      const imgData = new FormData();
      imgData.append("sender_id", auth.userID);
      imgData.append("conversation_id", conversation.id);
      imgData.append("created_at", Date.now());
      if (ImageFile.length > 0) {
        for (const file of ImageFile) {
          imgData.append("content", file);
        }
        imgData.set("isFile", 1);
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/message`,
          {
            method: "POST",
            body: imgData,
          }
        );
        const newMessage = await res.json();
        socketSend(newMessage);
      }
      if (messagesText.length > 0 && emojiText.length === 0) {
        imgData.set("isFile", 0);
        imgData.set("content", messagesText);
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/message`,
          {
            method: "POST",
            body: imgData,
          }
        );
        const newMessage = await res.json();
        socketSend(newMessage);
      }
      if (emojiText.length > 0) {
        imgData.set("isFile", 0);
        imgData.set("content", updatedInputMess);
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/message`,
          {
            method: "POST",
            body: imgData,
          }
        );
        const newMessage = await res.json();
        promises.push(newMessage);
        socketSend(newMessage);
      }

      // setMessages(prevMessages => [...prevMessages, ...promises]);
    } catch (err) {
      setSending(true);
    } finally {
      setSending(false);
    }
  }
  function setEmtyImg() {
    setFileImg([]);
    setImgView([]);
  }

  function inputChange(e) {
    if (inputValue.current) {
      if (inputValue.current.innerHTML.length >= 0) {
        setInputmess(inputValue.current.innerHTML);
      }
    } else {
      console.log(inputMess);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const username = await getUserinfobyID(parseInt(userConver));
      const data = await getStudentInfoByMSSV(username?.username);
      setUserInfo(data);
    }
    fetchData();
  }, [conversation]);

  useEffect(() => {
    const updateTitle = async () => {
      if (arrivalMessage) {
        const data = [conversation?.user1, conversation?.user2];
        data.includes(arrivalMessage.sender_id) &&
          parseInt(arrivalMessage.conversation_id) === conversation.id &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }
    };
    updateTitle();
  }, [arrivalMessage]);

  useEffect(() => {
    if (windowchat.current) {
      if (props.index > 3) {
        windowchat.current.style.display = "none";
      }
    }
  }, [conversation?.id]);
  useEffect(() => {
    setMessages();
    getMessages();
  }, [conversation?.id]);
  const messagesRef = useRef();

  const closeWindow = () => {
    setListWindow(listWindow.filter((item) => item.id !== conversation.id));
  };
  const clickConversation = async (data) => {
    const user12 = [data?.conver?.user1, data?.conver?.user2];
    const receiverId = user12.find((member) => member !== auth.userID);
    const sentToApi = {
      Seen_at: Date.now(),
      conversation_id: data?.conver.id,
      sender_id: receiverId,
    };
    if (document.title.includes(data.name)) {
      document.title = "Xin chàooo";
    }
    setArrivalMessage();
    const resFunctiongetNewestMessSeen = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/message/seen`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sentToApi),
          }
        );
      } catch (err) {
        console.log(err);
      }
    };
    resFunctiongetNewestMessSeen();
    if (socket) {
      const sendSocket = {
        converid: data?.conver.id,
        sender_id: auth.userID,
        receiverId,
        isSeen: true,
      };
      socket.emit("UserSeen", sendSocket);
    }
  };
  const [rowCount, setRowcount] = useState(1);

  useEffect(() => {
    inputMess && setRowcount(Math.ceil(inputMess.length / 20));
    !inputMess && setRowcount(1);
  }, [inputMess]);
  const [userSeenAt, setuserSeenAt] = useState();
  const getNewstMess = async (data) => {
    try {
      if (data) {
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/message/newest/seen/${data}/${auth?.userID}`
        );
        const getMess = await res.json();
        if (getMess) {
          setuserSeenAt(getMess);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [IsTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleUpdateNewSend = (data) => {
        if (props.chatApp === true) {
          props.setsendMess({ ...data, created_at: Date.now() });
        }
        setArrivalMessage({ ...data, created_at: Date.now() });
      };
      const updateMess = (data) => {
        if (props.chatApp === true) {
          props.setsendMess({ ...data, created_at: Date.now() });
        }

        setArrivalMessage({ ...data, created_at: Date.now() });
      };
      socket.on("isTyping", (data) => {
        setIsTyping(data.isTyping);
      });
      socket.on("getMessage", (data) => updateMess(data));
      // socket.on("updateNewSend", handleUpdateNewSend);
      socket.on("getUserSeen", (data) => {
        if (data) {
          getNewstMess(data.converid);
        }
      });
      return () => {
        socket.off("getUserSeen", (data) => {
          if (data) {
            getNewstMess(data.converid);
          }
        });
        socket.off("getMessages", (data) => updateMess(data));

        socket.off("updateNewSend", handleUpdateNewSend);
      };
    }
  }, [socket, conversation]);
  const handleVideoCall = () => {
    const width = 800; // Chiều rộng của cửa sổ tab nhỏ
    const height = (800 * 9) / 16; // Chiều cao của cửa sổ tab nhỏ

    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // Các thuộc tính của cửa sổ mới
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;
    const url = `${process.env.REACT_APP_CLIENT_URL}/videocall/?userID=${userInfor?.UserID}&converID=${conversation.id}`;
    window.open(url, "Call Video", windowFeatures);
  };

  return (
    <>
      {!ErrorMess && auth.userID ? (
        <>
          {(listWindow.some((e) => e.id === conversation.id) ||
            props.chatApp) && (
            <div className={`windowchat ${conversation.id}`} ref={windowchat}>
              <div
                className={`top_windowchat ${
                  arrivalMessage &&
                  conversation.id === arrivalMessage?.conversation_id &&
                  arrivalMessage?.sender_id !== auth.userID &&
                  "arrviedMess"
                }`}
              >
                <div className="header_windowchat">
                  {
                    <>
                      <div
                        className="header_online"
                        // style={{ margin: ".3rem" }}
                      >
                        <Popover content={<p>{userInfor?.Name}</p>}>
                          <div className=" p-2 hover:bg-gray-200 rounded-xl">
                            <div className="Avatar_status">
                              <a
                                href={`${process.env.REACT_APP_CLIENT_URL}/profile/${userInfor?.MSSV}`}
                              >
                                <Image
                                  className="avatarImage"
                                  alt="Avatar"
                                  src={conversation.img || userInfor?.cutImg}
                                ></Image>

                                <span
                                  className={`dot ${
                                    Onlines &&
                                    Onlines.some(
                                      (online) => online.userId === userConver
                                    )
                                      ? "activeOnline"
                                      : ""
                                  }`}
                                ></span>
                              </a>
                            </div>
                          </div>
                        </Popover>
                        <Popover content={<p>Cài đặt đoạn chat</p>}>
                          <Popover
                            title={"Cài đặt đoạn chat"}
                            placement="left"
                            content={
                              <SettingConversation
                                user={userInfor}
                                conversation={conversation}
                              />
                            }
                            trigger={"click"}
                          >
                            <div className="flex center py-2 hover:bg-gray-200 rounded-xl">
                              <div className="header_text ">
                                <p
                                  className="hiddenEllipsis"
                                  style={{ fontWeight: "600" }}
                                >
                                  {userMask}
                                  <span>{IsTyping && " is typing...."}</span>
                                </p>
                                {
                                  <p style={{ fontSize: ".7rem" }}>
                                    {Onlines &&
                                      Onlines.some(
                                        (e) => e.userId === userConver
                                      ) && "Online"}
                                  </p>
                                }
                              </div>
                              <div className="settingHeader">
                                <FiArrowDown></FiArrowDown>
                              </div>
                            </div>
                          </Popover>
                        </Popover>
                      </div>
                    </>
                  }
                </div>
                <div className="button_windowchat">
                  <div
                    className="features_hover"
                    style={props.ChatApp ? { display: "none" } : {}}
                    onClick={() => {
                      closeWindow();
                    }}
                  >
                    <FiX></FiX>
                  </div>
                  <div
                    className="features_hover"
                    style={props.ChatApp ? { display: "none" } : {}}
                    onClick={() => {
                      hiddenWindowHandle(conversation);
                    }}
                  >
                    <FiMinus></FiMinus>
                  </div>
                  <div className="features_hover" onClick={handleVideoCall}>
                    <FiVideo></FiVideo>
                  </div>
                  <div className="features_hover" onClick={() => {}}>
                    <FiPhone></FiPhone>
                  </div>
                </div>
              </div>
              <div className="Body_Chatpp relative">
                <div className="main_windowchat" ref={main_windowchat}>
                  {messages ? (
                    <div className="messages" ref={messagesRef}>
                      {messages.map((message, index) => (
                        <div className="message_content" key={message.id}>
                          <Message
                            i={index}
                            key={message.id}
                            message={message}
                            updateMess={Sending}
                            own={message.sender_id === auth.userID}
                            student={{
                              img:
                                conversation.img ||
                                userInfor?.cutImg ||
                                userInfor?.img,
                            }}
                            messages={messages}
                            userID={userConver}
                            listSeen={userSeenAt}
                            Online={Onlines}
                            setImgMess={setImgMess}
                            setShowImgMess={setShowImgMess}
                          ></Message>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full center">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
                <div className="inputValue windowchat_feature center">
                  <div className="feature_left center">
                    <input
                      onChange={(e) => {
                        pick_imageMess(e);
                      }}
                      type="file"
                      ref={image_message}
                      multiple
                      hidden
                    ></input>
                    {imgView.length > 0 ? (
                      <>
                        <div onClick={setEmtyImg} className="features_hover">
                          <img
                            src={`${ClientURL}/images/arrow-left.svg`}
                            style={{ width: "1.5rem", height: "1.5rem" }}
                          ></img>
                        </div>
                      </>
                    ) : (
                      <ul
                        style={{ display: "flex", padding: "0", margin: "0" }}
                      >
                        <li className="features_hover stokeTheme">
                          <FiImage
                            onClick={() => {
                              image_message.current.click();
                            }}
                          />
                        </li>

                        <li
                          className="features_hover stokeTheme"
                          style={
                            inputMess?.length > 0
                              ? { display: "none" }
                              : { opacity: 1 }
                          }
                        >
                          <LuSticker></LuSticker>
                        </li>
                        <Popover
                          content={
                            <EmojiPicker
                              width={350}
                              height={450}
                              onEmojiClick={(e, i) => {
                                onClickEmoji(e);
                              }}
                              emojiStyle="facebook"
                            />
                          }
                        >
                          <li className="features_hover stokeTheme">
                            <FiSmile></FiSmile>
                          </li>
                        </Popover>
                      </ul>
                    )}
                  </div>

                  <div
                    className=" windowchat_input "
                    style={imgView?.length > 0 ? { width: "75%" } : {}}
                    ref={windowchat_input}
                  >
                    {imgView.length > 0 && (
                      <div className={`multiFile_layout`}>
                        <div className="circleButton">
                          <FiImage
                            style={{ fontSize: "1.3rem" }}
                            onClick={() => {
                              image_message.current.click();
                            }}
                          />
                        </div>
                        <div
                          className={`flex ${
                            imgView.length >= 3 &&
                            "overflow-x-scroll overflow-y-hidden"
                          }`}
                        >
                          {imgView.map((e, i) => (
                            <div
                              className="listImgDiv mx-2"
                              style={{ position: "relative" }}
                            >
                              <div key={i} className="listImgMess w-16">
                                <img className="rounded-xl  w-16" src={e}></img>
                              </div>
                              <div
                                onClick={() => remove_imageMess(e)}
                                className="circleButton buttonImgView"
                              >
                                X
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ position: "relative", width: "100%" }}>
                      <div
                        style={{ resize: "none", paddingLeft: ".8rem" }}
                        id="send_window_input"
                        ref={inputValue}
                        contentEditable="true"
                        onPaste={pasteImg}
                        onInput={(e) => inputChange(e)}
                        onClick={() =>
                          clickConversation({
                            conver: props?.count,
                            name: userInfor?.Name,
                          })
                        }
                        suppressContentEditableWarning={true}
                      ></div>
                      {!inputMess && (
                        <div
                          className="placehoder"
                          style={{ top: ".4rem", left: "1rem" }}
                        >
                          <p>Aa</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {inputMess.length > 0 || fileImg.length > 0 ? (
                    <div>
                      <div>
                        <div
                          className="features_hover"
                          onClick={(e) => handleSubmit(e)}
                          style={{ cursor: "pointer" }}
                        >
                          <FiSend></FiSend>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="features_hover"
                      onClick={(e) => sendFastHandle(e)}
                      style={{ cursor: "pointer" }}
                    >
                      {(conversation.iconConver && (
                        <img src={`${conversation.iconConver}`} />
                      )) ||
                        "😆"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {listHiddenBubble.some((e) => e.id === props?.count.id) &&
            !props.chatApp && (
              <Popover
                placement="left"
                title={
                  <div
                    style={{
                      overflow: "hidden",
                      whiteSpace: "wrap",
                      textOverflow: "ellipsis",
                      maxWidth: "10rem",
                      // height: "1rem",
                    }}
                  >
                    <p>{userInfor?.Name}</p>
                  </div>
                }
                content={
                  <div
                    className="hiddenText"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "wrap",
                      maxWidth: "10rem",
                      maxHeight: "3rem",
                    }}
                  >
                    <p style={{ color: "gray" }}>
                      {messages?.length > 1 &&
                        messages[messages?.length - 1]?.sender_id ===
                          auth?.userID &&
                        "Bạn: "}{" "}
                      {messages && messages[messages.length - 1]?.content}{" "}
                    </p>
                  </div>
                }
              >
                <div
                  className="hiddenBubble"
                  style={{ bottom: `${4.4 + 3.2 * props.index}rem` }}
                >
                  <div
                    className="closeButton"
                    onClick={() => closeHiddenWindow(conversation)}
                  >
                    <FiXCircle></FiXCircle>
                  </div>
                  <div
                    style={{ position: "relative" }}
                    onClick={() => showHiddenConver(conversation)}
                  >
                    <Image
                      style={{ width: "3rem" }}
                      className="avatarImage"
                      alt="Avatar"
                      loading="lazy"
                      src={userInfor?.cutImg || userInfor?.img}
                    ></Image>
                    <span
                      className={`dot ${
                        Onlines && Onlines.some((e) => e.userId === userConver)
                          ? "activeOnline"
                          : {}
                      }`}
                    ></span>
                  </div>
                </div>
              </Popover>
            )}
          {ImgMess.length > 0 && ShowImgMess && (
            <ShowImgDialog
              listImg={ImgMess}
              current={ShowImgMess}
              setShowImgMess={setShowImgMess}
            ></ShowImgDialog>
          )}
        </>
      ) : (
        <Modal open={ErrorMess ? true : false}>{ErrorMess}</Modal>
      )}
    </>
  );
});
