import { memo, useEffect, useState } from "react";
import * as timeUse from "../../function/getTime";
import parse from "html-react-parser";

import useAuth from "../../hook/useAuth";
import "./conversation.css";
import { useSocket } from "../../context/socketContext";
import {
  fetchApiRes,
  getStudentInfoByMSSV,
  getUserinfobyID,
} from "../../function/getApi";
export const getMess = async (conversation) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_DB_HOST}/api/message/newest/${conversation.id}`
    );
    const data2 = await res.json();

    return data2;
  } catch (err) {
    console.log(err);
    console.log("Không có giá trí");
  }
};
export default memo(function Conversation({
  conversation,
  Online,
  notSeen_field,
  sendMess,
  setCurrentUser,
  currentChat,
}) {
  const [user, setUser] = useState();
  const { auth } = useAuth();
  const socket = useSocket();
  const [updateContent, setUpdateContent] = useState();
  const [NewestMess, setNewestMesst] = useState(conversation);
  const data = [conversation.user1, conversation.user2];
  useEffect(() => {
    if (conversation) {
      console.log(conversation);
    }
  }, [conversation]);

  const setOnlineUser = data.find((m) => m !== auth.userID);
  const ListusersOnline = (Online && Online.map((item) => item.userId)) || [];
  useEffect(() => {
    if (socket) {
      socket.on("getUserSeen", async (data) => {
        if (data) {
          await getNewestMess();
        }
      });
    }
  }, [socket]);
  const userID =
    conversation.user1 === auth.userID
      ? conversation.user2
      : conversation.user1;


  useEffect(() => {
    const studentInfo = async () => {
      const username = await getUserinfobyID(userID);
      const data = await getStudentInfoByMSSV(username?.username);
      setUser(data);
    };

    studentInfo();
  }, [conversation]);
  useEffect(() => {
    if (currentChat) {
      console.log(currentChat, "con");
      setCurrentUser(user);
    }
  }, [currentChat]);
  const checkMess=(mess)=>{
    const data = mess.split("emojiLink");

    const processedData = data.map((e) => {
      if (e.includes("https://cdn.jsdelivr.net")) {
        return `<span><img alt="icon" style="width: 1rem; height: 1rem; margin: .1rem;" src="${e}"/></span>`;
      }
      return e; // Trả về phần tử gốc nếu không phải là URL cần kiểm tra
    });
    return processedData.join("")
  }
  const getNewestMess = async () => {
    const data = await getMess(conversation);
    setNewestMesst(data);
  };

  useEffect(() => {
    if (sendMess) {
      if (sendMess.conversation_id === conversation.id) {
        console.log(sendMess);
        setNewestMesst(sendMess);
      }
    }
  }, [sendMess]);
  return (
    <>
      {user ? (
        <>
          <div className="conversation">
            <div className="Avatar_status">
              <img
                src={user.img ? `${user?.img}` : ""}
                className={`avatarImage`}
                style={{ width: "4rem" }}
                alt="uer avatar"
              ></img>
              <span
                className={`dot ${
                  ListusersOnline.includes(setOnlineUser) ? "activeOnline" : {}
                }`}
              >
                {" "}
              </span>
            </div>
            <div
              className="text_conversation hiddenEllipsis"
              style={{ width: "100%" }}
            >
              <span className="conversationName">
                {conversation.user1 === userID
                  ? conversation.user1_mask
                  : conversation.user2_mask}
              </span>
              {notSeen_field ? (
                <></>
              ) : (
                <div className="messConversation">
                  {NewestMess && (
                    <>
                      {
                        <>
                          {" "}
                          {NewestMess.content && (
                            <div>
                              <span>
                                {NewestMess.sender_id === auth.userID
                                  ? NewestMess.content.startsWith(
                                      "https://res.cloudinary.com"
                                    )
                                    ? "Bạn đã gửi một ảnh"
                                    : parse(checkMess(NewestMess.content))
                                  : NewestMess.content.startsWith(
                                      "https://res.cloudinary.com"
                                    )
                                  ? "Đã gửi một ảnh"
                                  : parse(checkMess(NewestMess.content))}
                              </span>

                              <span>
                                {timeUse.countTime(NewestMess.created_at)}
                              </span>
                            </div>
                          )}
                        </>
                      }
                    </>
                  )}
                  {NewestMess?.sender_id === auth.userID &&
                    NewestMess.isSeen === 1 &&
                    NewestMess && (
                      <div className="Seen_field">
                        <img
                          style={{ width: "1rem", height: "1rem" }}
                          src={`${user.img}`}
                          className={`avatarImage`}
                          alt="uer avatar"
                        ></img>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="conversation">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
});
