import { message, Modal, Popover } from "antd";
import EmojiPicker from "emoji-picker-react";
import { LuSticker } from "react-icons/lu";

import { memo, useCallback, useEffect, useRef, useState } from "react";
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
import { Link, NavLink } from "react-router-dom";
import { useData } from "../../context/dataContext";
import { useSocket } from "../../context/socketContext";
import { useRealTime } from "../../context/useRealTime";
import { TheMovieApi, fetchApiRes } from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import UseRfLocal from "../../hook/useRFLocal";
import UseToken from "../../hook/useToken";
import { Image } from "../home/home";
import Message from "./Message";
import "./windowchat.css";
import ShowImgDialog from "./windowchat/ShowImgMess";
import VehicleChat from "./windowchat/VehicleChat";
import { RouteLink } from "../../lib/link";
import Upload from "../imageView/Upload";
import useNoti from "../../hook/useNoti";
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
  const {setNotiText}=useNoti()
  const { auth, myInfor } = useAuth();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useSocket();
  const [inputMess, setInputmess] = useState("");
  const conversation = props?.count;
  const [OpenMask, setOpenMask] = useState(false);
  const [OpenIcon, setOpenIcon] = useState(false);
  const [host, setHost] = useState();
  const [mask1, setMask1] = useState(null);
  const [mask2, setMask2] = useState(null);
  const [imgBackGroundConversation, setImgBackGroundConversation] = useState();
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
          content: `<div className="maskUserChange">${myInfor.Name} đã đổi biệt danh thành ${mask1}</div>`,
          sender_id: auth.userID,
          createdAt: Date.now(),
          isFile: 0,
        };
        await fetchApiRes("message", "POST", Mes);
      }
      if (mask2) {
        const Mes2 = {
          conversation_id: conversation.id,
          content: `<div className="maskUserChange">${myInfor.Name} đã đổi biệt danh thành ${mask2}</div>`,
          sender_id: auth.userID,
          createdAt: Date.now(),
          isFile: 0,
        };
        await fetchApiRes("message", "POST", Mes2);
      }
    }
  };
  useEffect(() => {
    if (imgBackGroundConversation) {
      const updateConversationBackground = async () => {
        try {
          const data=new FormData()
          data.append('image',imgBackGroundConversation.imageObject)
          data.append('id',conversation.id)
          const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message/updateConversation`, {
            method: "POST",
            body: data, // FormData is used directly as the body
          });
          const resJson=await res.json()
          conversation.background=resJson.url
          setNotiText({message:'Update thành công',title:'Update Success',type:'success'})
        } catch (error) {
          console.error("Failed to update background:", error);
        }
      };
  
      updateConversationBackground();
    }
  }, [imgBackGroundConversation]);
  
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
      createdAt: Date.now(),
      isFile: 0,
    };
    await fetchApiRes("message", "POST", Mes);
    socketSend(Mes);
    setOpenIcon(false);
  };
  const SettingConversation = ({ conversation, user }) => {
    const updateIcon={}
    return (
      <ul>
        <li>
          <div
            className="flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() => {
              setOpenMask(true);
            }}
          >
            <FiEdit></FiEdit>
            <p className="pl-2">Cài đặt biệt danh</p>
          </div>
          <Modal
            open={OpenMask}
            onCancel={() => setOpenMask(false)}
            title={"Biệt danh"}
            onOk={updateConver}
          >
            <div className="flex m-2">
              <div className="center">
                <img
                  alt="Avatar"
                  className="avatarImage"
                  src={`${myInfor?.cutImg || myInfor?.img}`}
                ></img>
              </div>
              <div className="m-4">
                <p>{myInfor?.Name}</p>
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
                <img
                  alt="Avatar"
                  className="avatarImage"
                  src={`${user?.cutImg || user?.img}`}
                ></img>
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
            className="flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() => setOpenIcon(true)}
          >
            <FiSmile></FiSmile>
            <p className="pl-2">Cài đặt biểu tượng</p>
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
        <li>
          <Upload
            divChildren={<p className="pl-2">Cài đặt hình nền</p>}
            className={
              "flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-200"
            }
            setImage={setImgBackGroundConversation}
          ></Upload>
        </li>
      </ul>
    );
  };
  const {
    listWindow,
    setListWindow,
    setListHiddenBubble,
    listHiddenBubble,
    setConversationContext,
  } = useData();
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
  const [messages, setMessages] = useState([]);
  const [IsMore, setIsMore] = useState(true);
  const [isGettingScroll, setisGettingScroll] = useState(false);
  const { Onlines, CallComing, setCallComing } = useRealTime();

  const [Sending, setSending] = useState(false);
  const [ErrorMess, setErrorMess] = useState();
  const [ShowImgMess, setShowImgMess] = useState();
  const { AccessToken, setAccessToken } = UseToken();
  const { RefreshToken } = UseRfLocal();
  const channel = new BroadcastChannel("message_channel");
  const [offset, setOffset] = useState(1);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadMessages = useCallback(async () => {
    if (isGettingScroll && !IsMore) return;
    try {
      setisGettingScroll(true);
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/message/conversation/${conversation?.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AccessToken}`,
            "Content-Type": "application/json",
            RefreshToken: RefreshToken,
          },
          body: JSON.stringify({
            userID: auth.userID,
            offset: offset * 10 ,
          }),
        }
      );

      const { result, totalCount } = await res.json();
      
      const loadMess = [...messages, ...result];
      if(loadMess.length<=totalCount)
        {
        setOffset((pre) => pre + 1);
        setIsMore(loadMess.length < totalCount);
        setMessages(loadMess);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setisGettingScroll(false);
    }
  }, [offset, isGettingScroll, messages]);
  useEffect(() => {
    if (main_windowchat.current) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } =
          main_windowchat.current;
        if (
          scrollHeight / 20 > scrollHeight - clientHeight + scrollTop &&
          !isGettingScroll &&
          IsMore
        ) {
          loadMessages();
        }
      };
      const chatWindow = main_windowchat.current;
      chatWindow.addEventListener("scroll", handleScroll);

      // Dọn dẹp sự kiện khi component bị unmount
      return () => {
        chatWindow.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loadMessages]);
  useEffect(() => {
    console.log(isGettingScroll);
  }, [isGettingScroll]);

  async function getMessages(signal) {
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
            signal: signal,
          }
        );
        const data = await res.json();
        if (data.error) {
          setErrorMess("Vui lòng đăng nhập để thực hiện");
          setListHiddenBubble([]);
          setListWindow([]);
        } else {
          console.log(data.result, "adadasdasadaaaaaaaaaaaaaaaaaa");
          setMessages(data.result);
          setIsMore(data.result.length <= data.totalCount);
        }
      } catch (err) {}
    }
  }
  useEffect(() => {
    if (messages) {
      console.log(messages);
      const hehe = messages.reduce((acc, e) => {
        if (e.isFile) {
          acc.push(...e.content.split(","));
        }
        return acc;
      }, []);
      setImgMess(hehe);
    }
  }, [messages]);
  function pasteImg(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
        e.preventDefault();
        const file = items[i].getAsFile();
        setFileImg((pre) => [...pre, file]);
        setImgView((pre) => [...pre, URL.createObjectURL(file)]);
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
      data.push({ id: e.id });
      return data;
    });
    closeHiddenWindow(e);
  };
  function hiddenWindowHandle(c) {
    setListWindow(listWindow.filter((item) => item.id !== c.id));
    setListHiddenBubble((pre) => [...pre, { id: c.id }]);
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
      data.splice(index, 1);
      data2.splice(index, 1);

      setImgView(data);
      setFileImg(data2);
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
          conversation: { ...conversation, img: myInfor.avtUrl },
          id: data.id,
          conversation_id: conversation.id,
          sender_id: Number(data.sender_id),
          receiverId: Number(userConver),
          content: data.content,
          isFile: data.isFile,
          createdAt: data.createdAt,
        };
        // channel.postMessage(mess);

        socket.emit("sendMessage", mess);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      isSetting = false;
    }
  };
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  const sendFastHandle = async () => {
    const data = new FormData();
    const messObj = {
      sender_id: auth.userID,
      createdAt: Date.now(),
      conversation_id: conversation.id,
    };
    const content = conversation.iconConver
      ? conversation.iconConver
      : "emojiLinkhttps://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/1f606.pngemojiLink";
    data.set("isFile", 0);
    data.set("sender_id", auth.userID);
    data.set("conversation_id", conversation.id);
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
  const sendMessRes = async (imgData) => {
    const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
      method: "POST",
      body: imgData,
    });
    return res;
  };
  async function handleSubmit(e) {
    e.preventDefault();
    inputValue.current.focus();
    try {
      const messagesText = inputMess;
      const emojiText = emoji;
      const ImageFile = fileImg;
      const viewImg = imgView;
      const messObj = {
        sender_id: auth.userID,
        createdAt: Date.now(),
        conversation_id: conversation.id,
      };
      const update = [...messages];
      if (ImageFile.length > 0) {
        const imgMess = {
          ...messObj,
          content: viewImg.toString(),
          isFile: 1,
        };
        channel.postMessage(imgMess);
        setImgMess((pre) => [viewImg.toString(), ...pre]);
      }
      if (messagesText.length > 0 && emojiText.length === 0) {
        channel.postMessage({
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
      if (ImageFile.length > 0) {
        for (const file of ImageFile) {
          imgData.append("content", file);
        }
        imgData.set("isFile", 1);
        const res = await sendMessRes(imgData);
        const newMessage = await res.json();
        console.log(newMessage, "newmesss");
        socketSend(newMessage);
      }
      if (messagesText.length > 0 && emojiText.length === 0) {
        imgData.set("isFile", 0);
        imgData.set("content", messagesText);
        const res = await sendMessRes(imgData);

        const newMessage = await res.json();
        console.log(newMessage, "newmesss");
        socketSend(newMessage);
      }
      if (emojiText.length > 0) {
        imgData.set("isFile", 0);
        imgData.set("content", updatedInputMess);
        const res = await sendMessRes(imgData);
        const newMessage = await res.json();
        promises.push(newMessage);
        socketSend(newMessage);
      }
    } catch (err) {
      console.log(err);
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
      let currentHTML = inputValue.current.innerHTML;
      if (currentHTML === "<br>" || currentHTML.trim() === "") {
        setInputmess("");
        inputValue.current.innerHTML = ""; // Xóa <br> khỏi DOM
      } else {
        setInputmess(currentHTML.replace(/<br\s*\/?>/gi, "\n")); // Chuyển đổi <br> thành \n nếu cần
      }
    } else {
      console.log("Input element is not available:", inputMess);
    }
  }

  useEffect(() => {
    async function fetchData() {
      // const data= await getInforByUserID(userConver)
      // setUserInfo(data);
    }
    fetchData();
    return () => setUserInfo();
  }, [conversation]);

  useEffect(() => {
    const updateMessages = () => {
      if (
        arrivalMessage &&
        conversation &&
        parseInt(arrivalMessage.conversation_id) === conversation.id
      ) {
        setMessages((prev) => [arrivalMessage, ...prev]);
      }
    };

    updateMessages();
  }, [arrivalMessage, conversation]);

  useEffect(() => {
    if (windowchat.current) {
      if (props.index > 3) {
        windowchat.current.style.display = "none";
      }
    }
  }, [props.index]);
  useEffect(() => {
    setMessages([]);
    setImgMess([]);
    const controller = new AbortController();
    const signal = controller.signal;
    getMessages(signal);
    return () => {
      controller.abort();
    };
  }, [conversation?.id]);

  const closeWindow = () => {
    setConversationContext((pre) =>
      pre.filter((item) => item.id !== conversation.id)
    );
    setListWindow(listWindow.filter((item) => item.id !== conversation.id));
  };
  const clickConversation = async (data) => {
    if (arrivalMessage) {
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

      if (socket) {
        const sendSocket = {
          converid: data?.conver.id,
          sender_id: auth.userID,
          receiverId,
          isSeen: true,
        };
        socket.emit("UserSeen", sendSocket);
      }
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

  useEffect(() => {
    if (auth?.userID) {
      getNewstMess(props.count.id);
    }
  }, [props.count?.id, auth]);
  const [IsTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleUpdateNewSend = (data) => {
        if (props.chatApp === true) {
          props.setsendMess({ ...data, createdAt: Date.now() });
        }
        setArrivalMessage({ ...data, createdAt: Date.now() });
      };
      const updateMess = (data) => {
        console.log(data, "messsarrive");
        if (props.chatApp === true) {
          props.setsendMess({ ...data, createdAt: Date.now() });
        }

        setArrivalMessage({ ...data, createdAt: Date.now() });
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
          }
        });
        socket.off("getMessages", (data) => updateMess(data));

        socket.off("updateNewSend", handleUpdateNewSend);
      };
    }
  }, [socket]);
  const handleVideoCall = () => {
    const width = 800; // Chiều rộng của cửa sổ tab nhỏ
    const height = (800 * 9) / 16; // Chiều cao của cửa sổ tab nhỏ

    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // Các thuộc tính của cửa sổ mới
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;
    const url = `${process.env.REACT_APP_CLIENT_URL}/videocall/?userID=${userConver}&converID=${conversation.id}`;
    window.open(url, "Call Video", windowFeatures);
  };

  return (
    <>
      {!ErrorMess && auth.userID ? (
        <>
          {(listWindow.some((e) => e.id === conversation.id) ||
            props.chatApp) && (
            <div className="flex  h-full">
              <div
                className={`h-full windowchat`}
                ref={windowchat}
                style={props.chatApp ? { width: "100%" } : {}}
              >
                <div
                  className={`top_windowchat  h-16 center  ${
                    arrivalMessage &&
                    conversation.id === arrivalMessage?.conversation_id &&
                    arrivalMessage?.sender_id !== auth.userID &&
                    "arrviedMess"
                  }`}
                >
                  <div className="header_windowchat h-full p-1 ">
                    {
                      <>
                        <div
                          className="header_online center h-full"
                          // style={{ margin: ".3rem" }}
                        >
                          <Popover
                            content={
                              <p>{conversation?.Name || userInfor?.Name}</p>
                            }
                          >
                            <div className=" center h-full px-2  hover:bg-gray-200 rounded-xl">
                              <div className="Avatar_status">
                                <Link
                                  to={`${RouteLink.profileLink}/${
                                    conversation.MSSV || userInfor?.UserID
                                  }`}
                                >
                                  <Image
                                    className="avatarImage liner"
                                    alt="Avatar"
                                    src={
                                      conversation.img ||
                                      userInfor?.cutImg ||
                                      userInfor?.img
                                    }
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
                                </Link>
                              </div>
                            </div>
                          </Popover>
                          <Popover
                            className="h-full"
                            content={<p>Cài đặt đoạn chat</p>}
                          >
                            <Popover
                              title={<p>Cài đặt đoạn chat</p>}
                              placement="left"
                              content={
                                <SettingConversation
                                  user={userInfor}
                                  conversation={conversation}
                                />
                              }
                              trigger={"click"}
                            >
                              <div className="h-full flex center py-2 hover:bg-gray-200 rounded-xl">
                                <div className="header_text h-full center ">
                                  <p
                                    className="hiddenEllipsis "
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
                                        ) &&
                                        "Online"}
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

                <div
                  className="Body_Chatpp relative flex flex-col justify-evenly relative	  "
                  style={props.chatApp ? { height: "93%" } : { height: "45vh" }}
                >
                     <div className="w-full absolute inset-0 z-0 bg-contain"
                     style={{
                      height:'90%',
                      background: `url(${conversation.background})`,
                      filter: " blur(1px)",
                    }}
                     >
                      </div>
                      <div className="w-full h-full z-10 flex-col	justify-between	">

                  <div
                    className="z-10 overflow-y-auto  flex flex-col-reverse p-4 border border-gray-300 	"
                    ref={main_windowchat}
                    style={{height:'90%'}}
                  >
                 
                    {messages.length > 0 ? (
                      <>
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
                                  conversation?.img ||
                                  userInfor?.cutImg ||
                                  userInfor?.img,
                              }}
                              messages={messages}
                              userID={userConver}
                              listSeen={userSeenAt}
                              Online={Onlines}
                              setShowImgMess={setShowImgMess}
                            ></Message>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="w-full h-full center">
                        <div className="loader"></div>
                      </div>
                    )}
                    {isGettingScroll && IsMore && (
                      <div className="center ">
                        <div className="loader "></div>
                      </div>
                    )}
                  </div>
                  <div className="inputValue windowchat_feature center" style={{height:'10%'}}>
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
                              alt="Arrow"
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
                                trigger="click"
                                emojiStyle="facebook"
                              />
                            }
                          >
                            <li className="features_hover stokeTheme">
                              <FiSmile />
                            </li>
                          </Popover>
                        </ul>
                      )}
                    </div>

                    <div
                      className=" windowchat_input  "
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
                                className="listImgDiv"
                                style={{ position: "relative" }}
                              >
                                <div key={i} className="listImgMess w-16 h-16">
                                  <img
                                    alt="Hello"
                                    className="rounded-xl  w-full h-full object-cover"
                                    src={e}
                                  ></img>
                                </div>
                                <span
                                  onClick={() => remove_imageMess(e)}
                                  className="circleButton buttonImgView w-4 m-0 "
                                >
                                  <FiX />
                                </span>
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
                          onKeyDown={handleKeyDown}
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
                    {inputMess.trim().length > 0 || fileImg.length > 0 ? (
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
              </div>
              {props.chatApp && (
                <VehicleChat
                  setShowImgMess={setShowImgMess}
                  imgs={ImgMess}
                  current={ShowImgMess}
                  user={conversation}
                  mask={userMask}
                ></VehicleChat>
              )}
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
                    <p>{userMask || userInfor?.Name}</p>
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
                  style={{
                    bottom: `${
                      4.4 +
                      3.2 *
                        listHiddenBubble.findIndex(
                          (e) => e.id === conversation.id
                        )
                    }rem`,
                  }}
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
                      src={
                        props.currentUser?.cutImg ||
                        props.currentUser?.img ||
                        conversation.img ||
                        userInfor?.cutImg ||
                        userInfor?.img
                      }
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
