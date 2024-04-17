import { memo, useEffect, useState } from "react";
import * as timeUse from "../../function/getTime";
import useAuth from "../../hook/useAuth";
import "./conversation.css";
import { useSocket } from "../../context/socketContext";
import { fetchApiRes } from "../../function/getApi";
export default memo(function Conversation({
  conversation,
  Online,
  notSeen_field,
  Arrivalmess,
  currentUser,
  sendMess,
  listSeen,
}) {
  const [user, setUser] = useState();
  const { auth } = useAuth();
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState();
  const [NewestMess, setNewestMesst] = useState();

  const data = [conversation.user1, conversation.user2];
  const setOnlineUser = data.find((m) => m !== auth.userID);
  const ListusersOnline = (Online && Online.map((item) => item.userId)) || [];

  useEffect(() => {
    if (socket) {
      socket.on("getUserSeen", (data) => {
        if (data) {
          getMess();
        }
      });
    }
  }, [socket]);
  useEffect(() => {
    const getUsername = () => {
      const userID =
        conversation.user1 === auth.userID
          ? conversation.user2
          : conversation.user1;
      const getUser = async () => {
        try {
          const res = await fetchApiRes("username", "POST", { UserID: userID });
          setUsername(res);
        } catch (error) {
          console.log("Không có giá trí");
        }
      };
      getUser();
    };
    getUsername();
  }, [conversation]);

  useEffect(() => {
    const studentInfo = async () => {
      if (username) {
        const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${username[0]?.username} `;
        try {
          const studentApi = await fetch(URL2);
          const student = await studentApi.json();
          setUser(student);
        } catch (error) {
          console.error(error);
        }
      }
    };

    studentInfo();
  }, [username]);

  const getMess = async () => {
    try {
      let friendId = conversation.user1;
      if (conversation.user1 != conversation.user2) {
        friendId = data.find((m) => m !== currentUser);
      }
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/message/newest/${conversation.id}`
      );
      const data2 = await res.json();
      setNewestMesst(data2);
    } catch (err) {
      console.log("Không có giá trí");
    }
  };

  useEffect(() => {
    getMess();
  }, [sendMess]);
  return (
    <>
      {user && (
        <>
          <div className="conversation">
            <div className="Avatar_status">
              <img
                src={user.img ? `${user?.img}` : ""}
                className={`avatarImage`}
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
            <div className="text_conversation hiddenEllipsis">
              <span className="conversationName">{user.Name}</span>
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
                              {NewestMess.sender_id === auth.userID ? (
                                <>
                                  <span>
                                    {NewestMess?.content.startsWith(
                                      "https://res.cloudinary.com"
                                    )
                                      ? "Bạn đã gửi một ảnh"
                                      : `Bạn: ${NewestMess?.content}`}
                                  </span>
                                </>
                              ) : (
                                <span>
                                  {NewestMess?.content.startsWith(
                                    "https://res.cloudinary.com"
                                  )
                                    ? "Đã gửi một ảnh"
                                    : `  ${NewestMess?.content}`}
                                </span>
                              )}

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
      )}
    </>
  );
});
