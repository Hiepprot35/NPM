import React, { memo, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSocket } from "../../context/socketContext";
import { getStudentInfoByMSSV, getUserinfobyID } from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import Header from "../Layout/header/header";
import Conversation from "../conversation/conversations";
import { getConversation } from "../conversation/getConversation";
import WindowChat from "../message/windowchat";
import "./chatApp.css";
import Layout from "../Layout/layout";
import { useRealTime } from "../../context/useRealTime";
import { useData } from "../../context/dataContext";
const ChatApp = ({ messageId }) => {
  document.title = "Message";
  const messageScroll = useRef(null);
  const inputMess = useRef();
  const { auth } = useAuth();

  const [MSSVReceived, setMSSVReceived] = useState();
  const {Conversations,ConversationContext}=useData()
  const [currentChat, setCurrentChat] = useState(null);
  const [userSeenAt, setuserSeenAt] = useState();
  const [clicked, setClicket] = useState(false);
  const [isSeen, setisSeen] = useState(false);
  useEffect(() => {
    if (messageId) {
      console.log("zoo mess");
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
          setCurrentChat({ ...data });
        } catch (err) {
          console.log(err);
        }
      };
      senApi();
    }
  }, []);
  const { Onlines } = useRealTime();
  const socket = useSocket();
  let isCancel = false;
  // const ListusersOnline = onlineUser && onlineUser.map(item => item.userId) || [];
  const navigate = useNavigate();

  const ClickChat = (data) => {
    navigate(
      `/message/${data.user1 === auth.userID ? data.user2 : data.user1}`,
      { replace: true }
    );
  };
  // useEffect(() => {
  //   inputMess.current && inputMess.current.focus();
  // }, [currentChat]);
  useEffect(() => {
    if (socket) {
      socket.on("getUserSeen", (data) => {
        setisSeen(data);
      });
      return () => {
        socket.off("disconnect");
      };
    }
  }, [socket]);

  const [sendMess, setsendMess] = useState(false);


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
      const result =Conversations && Conversations.filter((conversation) => {
        return searchTerm?.some(
          (searchItem) =>
            searchItem.UserID === conversation.user1 ||
            searchItem.UserID === conversation.user2
        );
      });
      setSearchResults(result);
    }
  }, [searchTerm]);
  const [CurrentUser, setCurrentUser] = useState();

  return (
    <>
      {
        <Layout nvarbar={true} link={"/message"}>
          <div className="Container_ChatApp">
            <div className="Narbar_ChatApp">
              <h1>Đoạn chat</h1>
              <input
                placeholder="Search for friends"
                className="chatMenuInput"
                onChange={(e) => handleSearch(e)}
              />
              {Conversations && Conversations.length > 0 ? (
                Conversations.map((c, index) => (
                  <div
                    onClick={() => {
                      ClickChat(c);
                    }}
                    key={c.id}
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
                      sendMess={sendMess}
                      setCurrentChat={setCurrentChat}

                      currentChat={currentChat?.id === c?.id}
                      Online={Onlines}
                      listSeen={isSeen}
                    />
                  </div>
                ))
              ) : (
                <div className="converrsation_chat">
                  <div className="loader"></div>
                </div>
              )}
            </div>
            <div className="Main_ChatApp  w-screen" style={{height:"93vh"}}>
              {Conversations && Conversations.length === 0 ? (
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
                      <div className="Body_mainChatApp h-full">
                        <div className="ChatApp h-full ">
                          <WindowChat
                            count={{
                              ...currentChat,
                            }}
                            setCurrentChat={setCurrentChat}
                            Seen={userSeenAt}
                            chatApp={true}
                            setsendMess={setsendMess}
                            ListusersOnline={Onlines}
                          ></WindowChat>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </Layout>
      }
    </>
  );
};

export default memo(ChatApp);
