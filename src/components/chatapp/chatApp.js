import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../../context/socketContext";
import { getUserinfobyID } from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import Header from "../Layout/header/header";
import Conversation from "../conversation/conversations";
import { getConversation } from "../conversation/getConversation";
import WindowChat from "../message/windowchat";
import "./chatApp.css";
const ChatApp = ({ messageId }) => {
  document.title = "Message";
  const messageScroll = useRef(null);
  const inputMess = useRef();
  const { auth } = useAuth();
  useEffect(() => {
    console.log(auth);
  }, []);
  const [MSSVReceived, setMSSVReceived] = useState();
  const [data, setData] = useState([]);
  const [conversations, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userSeenAt, setuserSeenAt] = useState();
  const [clicked, setClicket] = useState(false);
  const [onlineUser, setOnlineUser] = useState();
  const [isSeen, setisSeen] = useState(false);
  useEffect(() => {
    if (messageId) {
      const senApi = async () => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_DB_HOST}/api/conversations/mess/${messageId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: auth.userID }),
            }
          );
          const data = await res.json();
          setCurrentChat(data);
        } catch (err) {
          console.log(err);
        }
      };
      senApi();
    }
  }, []);

  const socket = useSocket();
  let isCancel = false;
  // const ListusersOnline = onlineUser && onlineUser.map(item => item.userId) || [];
  const ClickChat = (data) => {
    setCurrentChat(data);
  };
  useEffect(() => {
    inputMess.current && inputMess.current.focus();
  }, [currentChat]);
  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          sender_id: data.sender_id,
          content: data.content,
          isFile: data.isFile,
          created_at: Date.now(),
        });
      });
      socket.on("getUserSeen", (data) => {
        setisSeen(data);
      });
      return () => {
        socket.off("disconnect");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (data) => {
        setOnlineUser(data);
      });
    }
    return () => {
      if (socket) {
        socket.off("disconnect");
      }
    };
  }, [socket]);

  useEffect(() => {
    async function AsyncGetCon() {
      const convers = await getConversation(auth);
      setConversation(convers);
      setData([convers]);
    }
    AsyncGetCon();
  }, [arrivalMessage]);
  const [sendMess, setsendMess] = useState(false);
  useEffect(() => {
    const receiverId = currentChat
      ? currentChat.user1 !== auth.userID
        ? currentChat.user1
        : currentChat.user2
      : null;

    const getUser = async () => {
      const data = await getUserinfobyID(receiverId);
      setMSSVReceived(data);
    };
    getUser();
  }, [currentChat]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    if (e.target.value != "") {
      setClicket(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/studentSearchBar`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: e.target.value }),
          }
        );
        const data = await res.json();
        setSearchTerm(data);
      } catch (err) {
        console.log(err);
      }
    }
    if (e.target.value == "") {
      setClicket(false);
    }
  };
  useEffect(() => {
    if (searchTerm) {
      const result = conversations.filter((conversation) => {
        return searchTerm?.some(
          (searchItem) =>
            searchItem.UserID === conversation.user1 ||
            searchItem.UserID === conversation.user2
        );
      });
      setSearchResults(result);
    }
  }, [searchTerm]);

  return (
    <>
      <Header hash={"/message"}></Header>
      {
        <>
          <div className="Container_ChatApp">
            <div className="Narbar_ChatApp">
              <h1>Đoạn chat</h1>
              <input
                placeholder="Search for friends"
                className="chatMenuInput"
                onChange={(e) => handleSearch(e)}
              />
              {clicked
                ? searchResults.map((c, index) => (
                    <div
                      onClick={() => {
                        ClickChat(c);
                      }}
                      key={index}
                      className="converrsation_chat"
                      style={
                        currentChat === c
                          ? { backgroundColor: "rgb(245, 243, 243)" }
                          : {}
                      }
                    >
                      <Conversation
                        conversation={c}
                        currentUser={auth.userID}
                        Arrivalmess={arrivalMessage}
                        sendMess={sendMess}
                        Online={onlineUser}
                        listSeen={isSeen}
                      />
                    </div>
                  ))
                : conversations &&
                  conversations.map((c, index) => (
                    <Link
                      key={index}
                      to={`/message/${
                        c.user1 === auth.userID ? c.user2 : c.user1
                      }`}
                    >
                      <div
                        onClick={() => {
                          ClickChat(c);
                        }}
                        key={index}
                        className="converrsation_chat"
                        style={
                          currentChat && currentChat?.id === c.id
                            ? { backgroundColor: "rgb(245, 243, 243)" }
                            : {}
                        }
                      >
                        <Conversation
                          conversation={c}
                          currentUser={auth.userID}
                          Arrivalmess={arrivalMessage}
                          sendMess={sendMess}
                          Online={onlineUser}
                          listSeen={isSeen}
                        />
                      </div>
                    </Link>
                  ))}
            </div>
            <div className="Main_ChatApp">
              {conversations.length === 0 ? (
                <div className="chatbox_res">
                  Kết bạn đi anh bạn{" "}
                  <a href="/home" className="play_in_cheo">
                    kết bạn
                  </a>
                </div>
              ) : (
                <>
                  {!currentChat ? (
                    <div className="chatbox_res">
                      Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới
                    </div>
                  ) : (
                    <>
                      <div className="Body_mainChatApp">
                        <div className="ChatApp">
                          <WindowChat
                            cc={setArrivalMessage}
                            count={currentChat}
                            Seen={userSeenAt}
                            setsendMess={setsendMess}
                            ListusersOnline={onlineUser}
                          ></WindowChat>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      }
    </>
  );
};

export default ChatApp;
