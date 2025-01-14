import { memo, useEffect, useState } from "react";
import * as timeUse from "../../function/getTime";
import parse from "html-react-parser";

import useAuth from "../../hook/useAuth";
import "./conversation.css";
import { useSocket } from "../../context/socketContext";

import { useData } from "../../context/dataContext";
import UseToken from "../../hook/useToken";
export const getMess = async (conversation, token) => {
  try {
    const url = `${process.env.REACT_APP_DB_HOST}/api/message/newest/${conversation.id}`;
    const res = await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
  setCurrentChat,
  currentChat,
}) {
  const {
    setConversationContext,
    Conversations,
    setListHiddenBubble,
    setListWindow,
  } = useData();
  const [user, setUser] = useState(conversation);
  const { auth } = useAuth();
  const socket = useSocket();
  const [updateContent, setUpdateContent] = useState();
  const [NewestMess, setNewestMesst] = useState(conversation);
  const data = [conversation.user1, conversation.user2];
  const { AccessToken } = UseToken();
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

  const checkMess = (mess) => {
    const data = mess.split("emojiLink");

    const processedData = data.map((e) => {
      if (e.includes("https://cdn.jsdelivr.net")) {
        return `<span><img alt="icon" style="width: 1rem; height: 1rem; margin: .1rem;" src="${e}"/></span>`;
      }
      return e; // Trả về phần tử gốc nếu không phải là URL cần kiểm tra
    });
    return processedData.join("");
  };
  const getNewestMess = async () => {
    const data = await getMess(conversation, AccessToken);
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
  const onClickConser = (c) => {
    setListWindow((prev) => {
      const newClicked = prev.filter((obj) => obj.id !== c);

      if (Conversations) {
        const conversation = Conversations.find((e) => e?.id === c);
        if (conversation) {
          newClicked.unshift({ id: conversation.id });
        }
      }

      return newClicked;
    });
    setListHiddenBubble((pre) => {
      const data = pre.filter((e) => e.id !== c);
      return data;
    });
  };
  const ClickConversationHandle = () => {
    const obj = {
      ...conversation,
      img: user?.cutImg || user?.img,
      Name: user?.Name,
      MSSV: user.MSSV,
    };
    if (setCurrentChat) {
      setCurrentChat({ ...obj });
    } else {
      onClickConser(conversation.id);
      setConversationContext((pre) => {
        const data = pre.filter((e) => e.id !== obj.id);
        data.push(obj);
        return data;
      });
    }
  };

  return (
    <>
      {user ? (
        <>
          <div
            className="conversation"
            onClick={() => ClickConversationHandle()}
          >
            <div className="Avatar_status">
              <img
                src={user?.cutImg ? `${user?.cutImg}` : `${user?.img}`}
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
                <div className="messConversation flex ">
                  {conversation && (
                    <>
                      {
                        <>
                          {conversation.content && (
                            <div className="w-full">
                              <div className="w-3/4  ">
                                <span
                               className="truncate">
                                  {conversation.sender_id === auth.userID
                                    ? conversation.content.startsWith(
                                        "https://res.cloudinary.com"
                                      )
                                      ? "Bạn đã gửi một ảnh"
                                      : parse(checkMess(conversation.content))
                                    : conversation.content.startsWith(
                                        "https://res.cloudinary.com"
                                      )
                                    ? "Đã gửi một ảnh"
                                    : parse(checkMess(conversation.content))}
                                </span>
                              </div>

                              <span>
                                {timeUse.countTime(conversation.mesCreatedAt)}
                              </span>
                            </div>
                          )}
                        </>
                      }
                    </>
                  )}
                  {conversation?.sender_id === auth.userID &&
                    conversation.isSeen === 1 &&
                    conversation && (
                      <div className="Seen_field ml-4">
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
