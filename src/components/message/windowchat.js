import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FiImage,
  FiMinus,
  FiPhone,
  FiSmile,
  FiVideo,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { useSocket } from "../../context/socketContext";
import useAuth from "../../hook/useAuth";
import "./windowchat.css";
import { useData } from "../../context/dataContext";
import EmojiPicker from "emoji-picker-react";
import { getStudentInfoByMSSV, getUserinfobyID } from "../../function/getApi";
import Message from "./Message";
import { data } from "jquery";
const ClientURL = process.env.REACT_APP_CLIENT_URL;

export default memo(function WindowChat(props) {
  const { auth } = useAuth();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useSocket();
  const [inputMess, setInputmess] = useState();
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
  const { listWindow, setListWindow, listHiddenBubble, setListHiddenBubble } =
    useData();

  async function getMessages() {
    if (props.count?.id) {
      try {
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
      }
    }
  }
  function closeWindow(c) {
    setListWindow((pre) => {
      const newData = pre.filter((obj) => obj.id !== c);
      return newData;
    });
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
    setListHiddenBubble((pre) => {
      const data = [...pre];
      data.push(c);
      return data;
    });
    closeWindow(c.id);
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
    setEmoji((pre) => pre + e.emoji);
    setFileImg((pre) => [...pre, e.imageUrl]);
  }
  useEffect(() => {
    setInputmess(emoji);
  }, [emoji]);
  async function handleSubmit() {
    try {
      const imgData = new FormData();
      imgData.append("sender_id", auth.userID);
      imgData.append("conversation_id", props.count.id);
      if (fileImg.length > 0) {
        for (const file of fileImg) {
          imgData.append("content", file);
        }
        imgData.append("isFile", 1);
      } else {
        imgData.append("isFile", 0);
        imgData.append("content", inputMess);
      }

      const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
        method: "POST",
        body: imgData,
      });
      const MessageDataRes = await res.json();
      if (socket) {
        socket.emit("sendMessage", {
          conversation_id: MessageDataRes.conversation_id,
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
      props.setsendMess((pre) => !pre);
      setInputmess("");
      inputValue.current.focus();
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
        const data = await getStudentInfoByMSSV(userName.username);
        setUserInfo(data);
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
    let isMounted = true;
    if (socket && isMounted) {
      socket.on("getMessage", (data) => {
        if (data.sender_id !== auth.userID) {
          setArrivalMessage({
            sender_id: data.sender_id,
            content: data.content,
            isFile: parseInt(data.isFile),
            created_at: Date.now(),
            conversation_id: data.conversation_id,
          });
        }
      });
    }

    return () => {
      isMounted = false;
      if (socket && isMounted) {
        socket.disconnect();
      }
    };
  }, [socket]);

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
    if (windowchat.current) {
      if (props.index > 3) {
        windowchat.current.style.display = "none";
      }
    }
  }, [props.count?.id]);
  useEffect(() => {
    getMessages();
  }, [props.count?.id]);

  useEffect(() => {
    if (main_windowchat.current) {
      const container = main_windowchat.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const checkMess = useCallback((i, array, authID, user, sender) => {
    let value;
    if (sender === authID) {
      value = user;
    }
    if (sender === user) {
      value = authID;
    }
    const l = array.length;
    if (i === 0 || i === l - 1) {
      return 0;
    }
    if (i > 0 && i < l - 1) {
      if (
        array[i - 1].sender_id === authID &&
        array[i + 1].sender_id === authID
      ) {
        return 0;
      }
      if (
        array[i - 1].sender_id !== value &&
        array[i + 1].sender_id === value
      ) {
        return 3;
      }
      if (
        array[i - 1].sender_id === value &&
        array[i + 1].sender_id !== value
      ) {
        return 1;
      }
      if (
        array[i - 1].sender_id !== value &&
        array[i + 1].sender_id !== value
      ) {
        return 2;
      }
    }

    return undefined;
  }, []);
  const clickConversation = async (data) => {
    const user12 = [data?.user1, data?.user2];
    const receiverId = user12.find((member) => member !== auth.userID);
    const sentToApi = {
      conversation_id: data?.id,
      sender_id: receiverId,
    };
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
        converid: data?.id,
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
        setuserSeenAt(getMess);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNewstMess(props?.count.id);
  }, []);
  useEffect(() => {
    getMessages(props?.count);
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("getUserSeen", (data) => {
        if (data) {
          getNewstMess(data.converid);
        }
      });
    }
  }, [socket]);
  return (
    <>
      {!props.isHidden ? (
        <div className="windowchat" ref={windowchat}>
          <div
            className="top_windowchat"
            style={
              props?.count.id === arrivalMessage?.conversation_id
                ? { backgroundColor: "black" }
                : {}
            }
          >
            <div className="header_windowchat">
              {props.count && userInfor && (
                <>
                  <div className="header_online">
                    <div className="avatar_dot">
                      <img
                        className="avatarImage"
                        alt="Avatar"
                        src={userInfor.img ? `${userInfor.img}` : ""}
                      ></img>
                      <span
                        className={`dot ${
                          props.ListusersOnline &&
                          props.ListusersOnline.some(
                            (e) => e.userId === userConver
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
                        <p className="hiddenEllipsis">{userInfor.Name}</p>
                      </div>
                      {
                        <span>
                          {props.ListusersOnline &&
                          props.ListusersOnline.some(
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
              )}
            </div>
            <div className="button_windowchat">
              <div
                className="features_hover"
                onClick={(e) => {
                  closeWindow(props.count.id);
                }}
              >
                <FiX></FiX>
              </div>
              <div
                className="features_hover"
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
              {messages &&
                messages.map((message, index) => (
                  <div className="message_content" key={index}>
                    <Message
                      key={index}
                      message={message}
                      my={auth.userID}
                      mid={
                        checkMess(
                          index,
                          messages,
                          auth.userID,
                          userConver,
                          message.sender_id
                        ) === 2
                      }
                      alone={
                        checkMess(
                          index,
                          messages,
                          auth.userID,
                          userConver,
                          message.sender_id
                        ) === 0
                      }
                      first={
                        checkMess(
                          index,
                          messages,
                          auth.userID,
                          userConver,
                          message.sender_id
                        ) === 1
                      }
                      end={
                        checkMess(
                          index,
                          messages,
                          auth.userID,
                          userConver,
                          message.sender_id
                        ) === 3
                      }
                      own={message.sender_id === auth.userID}
                      student={userInfor}
                      userID={userConver}
                      listSeen={userSeenAt}
                      Online={props.ListusersOnline}
                    ></Message>
                  </div>
                ))}
            </div>
            <div className="inputValue windowchat_feature">
              <div className="feature_left">
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
                  <ul>
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

                    <li className="features_hover stokeTheme">
                      <img src={`${ClientURL}/images/sticker.svg`}></img>
                    </li>
                    <li className="features_hover stokeTheme">
                      <FiSmile
                        onClick={(e) => {
                          setOpenEmojiPicker(!openEmojiPicker);
                        }}
                      ></FiSmile>
                    </li>
                  </ul>
                )}
              </div>

              <div className=" windowchat_input " ref={windowchat_input}>
                {imgView.length > 0 && (
                  <div className="multiFile_layout ">
                    <input type="file" hidden ref={multiFile} multiFile></input>
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
                  style={{ resize: "none" }}
                  id="send_window_input"
                  onClick={() => clickConversation(props?.count)}
                  onChange={inputChange}
                  placeholder="Aa"
                  value={inputMess}
                  ref={inputValue}
                />
              </div>
              <div>
                <div>
                  <div
                    className="features_hover"
                    onClick={() => inputMess.length > 0 && handleSubmit()}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={`${ClientURL}/images/send-2.svg`}
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    ></img>
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
      ) : (
        <div className="hiddenBubble">
          <div
            className="closeButton"
            onClick={() => closeHiddenWindow(props.count)}
          >
            <FiXCircle></FiXCircle>
          </div>
          <div>
            <img
              onClick={() => showHiddenConver(props.count)}
              style={{ width: "50px" }}
              className="avatarImage"
              alt="Avatar"
              src={userInfor?.img}
            ></img>{" "}
          </div>
        </div>
      )}
    </>
  );
});
