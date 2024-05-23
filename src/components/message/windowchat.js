import { Popover } from "antd";
import EmojiPicker from "emoji-picker-react";
import { memo, useEffect, useRef, useState } from "react";
import {
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
import { getStudentInfoByMSSV, getUserinfobyID } from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import { Image } from "../home/home";
import Message from "./Message";
import "./windowchat.css";
import { data } from "jquery";
import { IsLoading } from "../Loading";
const ClientURL = process.env.REACT_APP_CLIENT_URL;

export default memo(function WindowChat(props) {
  const { auth } = useAuth();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useSocket();
  const [inputMess, setInputmess] = useState("");
  const [Loading, setLoading] = useState(false);
  const [userName, setUsername] = useState();
  const userConver =
    props.count?.user1 === auth.userID
      ? props.count?.user2
      : props.count?.user1;
  const multiFile = useRef(null);
  const windowchat_input = useRef(null);
  const main_windowchat = useRef(null);
  const inputValue = useRef(null);
  const [emoji, setEmoji] = useState([]);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [call, setCall] = useState(false);
  const [imgView, setImgView] = useState([]);
  const [fileImg, setFileImg] = useState([]);
  const image_message = useRef(null);
  const windowchat = useRef(null);
  const [userInfor, setUserInfo] = useState();
  const [messages, setMessages] = useState(props.messages);
  const { listWindow, setListWindow, setListHiddenBubble, listHiddenBubble } =
    useData();
  const [onlineUser, setOnlineUser] = useState();

  useEffect(() => {
    if (socket) {
      socket.emit("getUsers");
      socket.on("sendUsers", (data) => {
        setOnlineUser(data);
      });
    }
  }, [socket]);
  useEffect(() => {
    console.log(props.count.id);
  }, [props.count.id]);
  async function getMessages() {
    if (props.count?.id) {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/message/conversation/${props.count?.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
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
      setFileImg((pre) =>
        Array.isArray(pre) ? [...pre, imgMessFile[i]] : [imgMessFile[i]]
      );
      setImgView((pre) =>
        Array.isArray(pre)
          ? [...pre, URL.createObjectURL(imgMessFile[i])]
          : [URL.createObjectURL(imgMessFile[i])]
      );
    }
  }

  function onClickEmoji(e) {
    setEmoji((prev) => [
      ...prev,
      { id: inputMess.length, emoji: e.emoji, imageUrl: e.imageUrl },
    ]);
    setFileImg((pre) => [...pre, e.imageUrl]);
  }

  useEffect(() => {
    if (emoji.length > 0 && emoji[emoji.length - 1].emoji !== undefined) {
      setInputmess(
        (prevInputMess) => prevInputMess + emoji[emoji.length - 1].emoji
      );
    }
  }, [emoji]);

  async function handleSubmit(e) {
    e.preventDefault();
    setEmoji([]);
    setFileImg([]);
    setInputmess("");
    inputValue.current.focus();
    try {
      const imgData = new FormData();
      imgData.append("sender_id", auth.userID);
      imgData.append("conversation_id", props.count.id);
      if (fileImg.length > 0 && inputMess?.length && emoji.length === 0) {
        for (const file of fileImg) {
          imgData.append("content", file);
        }
        imgData.append("isFile", 1);
        imgData.append("created_at", Date.now());
      }
      if (fileImg.length === 0 && inputMess.length > 0) {
        imgData.append("isFile", 0);
        imgData.append("content", inputMess);
        imgData.append("created_at", Date.now());
      } else {
        let updatedInputMess = inputMess;
        emoji.forEach((e, i) => {
          updatedInputMess = updatedInputMess.replace(
            e.emoji,
            "emojiLink" + e.imageUrl + "emojiLink"
          );
        });
        imgData.append("isFile", 0);
        imgData.append("content", updatedInputMess);
        imgData.append("created_at", Date.now());
      }

      const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
        method: "POST",
        body: imgData,
      });
      const MessageDataRes = await res.json();
      if (socket) {
        socket.emit("sendMessage", {
          conversation_id: props.count.id,
          sender_id: MessageDataRes.sender_id,
          receiverId: userConver,
          content: MessageDataRes.content,
          isFile: MessageDataRes.isFile,
        });
      } else {
        console.log("không có socket");
      }

      setMessages([...messages, MessageDataRes]);
      setEmtyImg();
      // if (props.chatApp) {
      //   props.setsendMess((pre) => !pre);
      // }
      // props.cc(MessageDataRes);
    } catch (err) {
      console.log(err);
    }
  }
  function setEmtyImg() {
    setFileImg([]);
    setImgView([]);
  }

  function inputChange(e) {
    setInputmess(e.target.value);
  }

  useEffect(() => {
    async function fetchData() {
      if (userName) {
        try {
          setLoading(true);
          const data = await getStudentInfoByMSSV(userName.username);
          setUserInfo(data);
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [props.count, userName]);
  useEffect(() => {
    if (arrivalMessage) {
      const data = [props.count?.user1, props.count?.user2];
      data.includes(arrivalMessage.sender_id) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    const updateTitle = async () => {
      if (arrivalMessage) {
        const username = await getUserinfobyID(
          parseInt(arrivalMessage.sender_id)
        );
        const nameSV = await getStudentInfoByMSSV(username.username);
        document.title = `${nameSV.Name} gửi tin nhắn`;
      }
    };
    updateTitle();
  }, [arrivalMessage]);

  useEffect(() => {
    const getUsername = async () => {
      const data = await getUserinfobyID(userConver);
      setUsername(data);
    };
    getUsername();
  }, [props.count]);
  useEffect(() => {
    console.log("props");
  }, [props]);
  useEffect(() => {
    if (windowchat.current) {
      if (props.index > 3) {
        windowchat.current.style.display = "none";
      }
    }
  }, [props.count?.id]);
  useEffect(() => {
    getMessages();
  }, [props.count?.id]);
  const messagesRef = useRef();

  const closeWindow = () => {
    setListWindow(listWindow.filter((item) => item.id !== props.count.id));
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
  useEffect(() => {
    console.log("render", props.count);
  }, []);
  // console.log("render",props.count)
  useEffect(() => {
    getNewstMess(props?.count.id);
  }, [props?.count.id]);

  useEffect(() => {
    if (socket) {
      const handleUpdateNewSend = (data) => {
        getMessages();
        if (props.chatApp) {
          props.setsendMess((pre) => !pre);
        }
      };
      const updateMess = (data) => {
        setArrivalMessage({
          sender_id: data.sender_id,
          content: data.content,
          isFile: parseInt(data.isFile),
          created_at: Date.now(),
          conversation_id: data.conversation_id,
        });
      };
      socket.on("getMessage", (data) => updateMess(data));
      socket.on("updateNewSend", handleUpdateNewSend);
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
  }, [socket, props.count.id]);
  return (
    <>
      {Loading ? (
        <IsLoading></IsLoading>
      ) : (
        <>
          {(listWindow.some((e) => e.id === props?.count.id) ||
            props.chatApp) && (
            <div className={`windowchat ${props.count.id}`} ref={windowchat}>
              <div
                className={`top_windowchat ${
                  props?.count.id === arrivalMessage?.conversation_id &&
                  "arrviedMess"
                }`}
              >
                <div className="header_windowchat">
                  {
                    <>
                      <div className="header_online">
                        <div className="Avatar_status">
                          <Image
                            className="avatarImage"
                            alt="Avatar"
                            src={userInfor?.img}
                          ></Image>
                          <span
                            className={`dot ${
                              onlineUser &&
                              onlineUser.some(
                                (online) => online.userId === userConver
                              )
                                ? "activeOnline"
                                : {}
                            }`}
                          >
                            {" "}
                          </span>
                        </div>
                        <div className="header_text">
                          <div
                            style={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                            }}
                          >
                            {" "}
                            <p className="hiddenEllipsis">{userInfor?.Name}</p>
                          </div>
                          {
                            <span>
                              {onlineUser &&
                              onlineUser.some(
                                (e) => e.userId === userConver
                              ) ? (
                                <>Online</>
                              ) : (
                                <></>
                              )}
                            </span>
                          }
                        </div>
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
                      hiddenWindowHandle(props.count);
                    }}
                  >
                    <FiMinus></FiMinus>
                  </div>
                  <div
                    className="features_hover"
                    onClick={() => {
                      setCall(!call);
                    }}
                  >
                    <FiVideo></FiVideo>
                  </div>
                  <div
                    className="features_hover"
                    onClick={() => {
                      setCall(!call);
                    }}
                  >
                    <FiPhone></FiPhone>
                  </div>
                </div>
              </div>
              <div className="Body_Chatpp">
                <div className="main_windowchat" ref={main_windowchat}>
                  <div className="messages" ref={messagesRef}>
                    {" "}
                    {messages &&
                      messages.map((message, index) => (
                        <div className="message_content" key={index}>
                          <Message
                            i={index}
                            key={index}
                            message={message}
                            my={auth.userID}
                            own={message.sender_id === auth.userID}
                            student={userInfor}
                            messages={messages}
                            userID={userConver}
                            listSeen={userSeenAt}
                            Online={onlineUser}
                          ></Message>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="inputValue windowchat_feature center">
                  <div className="feature_left center">
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
                          <input
                            onChange={(e) => {
                              pick_imageMess(e);
                            }}
                            type="file"
                            ref={image_message}
                            multiple
                            hidden
                          ></input>
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
                          <img src={`${ClientURL}/images/sticker.svg`}></img>
                        </li>
                        <li
                          className="features_hover stokeTheme"
                          // style={
                          //   inputMess?.length > 0
                          //     ? { display: "none" }
                          //     : { opacity: 1 }
                          // }
                        >
                          <FiSmile
                            onClick={(e) => {
                              setOpenEmojiPicker(!openEmojiPicker);
                            }}
                          ></FiSmile>
                        </li>
                      </ul>
                    )}
                  </div>

                  <div
                    className=" windowchat_input "
                    style={inputMess?.length > 0 ? { width: "75%" } : {}}
                    ref={windowchat_input}
                  >
                    {imgView.length > 0 && (
                      <div className="multiFile_layout ">
                        <input
                          type="file"
                          hidden
                          ref={multiFile}
                          multiFile
                        ></input>
                        <div className="features_hover">
                          <img
                            onClick={() => {
                              multiFile.current.click();
                            }}
                            src={`${process.env.REACT_APP_CLIENT_URL}/images/image.svg`}
                          ></img>
                        </div>
                        {imgView.map((e) => (
                          <>
                            <img
                              src={e}
                              style={{
                                width: "50px",
                                height: "50px",
                                margin: "1rem",
                                borderRadius: "0.6rem",
                              }}
                            ></img>
                          </>
                        ))}
                      </div>
                    )}
                    <textarea
                      cols="20"
                      rows={rowCount || 1}
                      style={{ resize: "none", paddingLeft: ".8rem" }}
                      id="send_window_input"
                      onClick={() =>
                        clickConversation({
                          conver: props?.count,
                          name: userInfor?.Name,
                        })
                      }
                      onChange={inputChange}
                      placeholder="Aa"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          inputMess.length > 0 && handleSubmit(e);
                        }
                      }}
                      value={inputMess}
                      ref={inputValue}
                    />
                  </div>
                  <div>
                    <div>
                      <div
                        className="features_hover"
                        onClick={(e) => inputMess.length > 0 && handleSubmit(e)}
                        style={{ cursor: "pointer" }}
                      >
                        <FiSend></FiSend>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="emojipick">
                <EmojiPicker
                  width={350}
                  height={450}
                  open={openEmojiPicker}
                  onEmojiClick={(e, i) => {
                    onClickEmoji(e);
                  }}
                  emojiStyle="facebook"
                />
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
                    onClick={() => closeHiddenWindow(props.count)}
                  >
                    <FiXCircle></FiXCircle>
                  </div>
                  <div
                    style={{ position: "relative" }}
                    onClick={() => showHiddenConver(props.count)}
                  >
                    <Image
                      style={{ width: "3rem" }}
                      className="avatarImage"
                      alt="Avatar"
                      loading="lazy"
                      src={userInfor?.img}
                    ></Image>{" "}
                    <span
                      className={`dot ${
                        onlineUser &&
                        onlineUser.some((e) => e.userId === userConver)
                          ? "activeOnline"
                          : {}
                      }`}
                    >
                      {" "}
                    </span>
                  </div>
                </div>
              </Popover>
            )}
        </>
      )}
    </>
  );
});
