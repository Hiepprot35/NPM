import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useSocket } from "../../context/socketContext";
import useAuth from "../../hook/useAuth";
import Conversation from "../conversation/conversations";
import WindowChat from "./windowchat";
import { useWindowChat } from "../../context/windowChatContext";
import { useData } from "../../context/dataContext";
import { getConversation } from "../conversation/getConversation";
export default function MessageMainLayout(props) {
  const [onlineUser, setOnlineUser] = useState();
  const socket = useSocket();
  const { auth } = useAuth();
  const [conversations, setConversation] = useState();

  const { listWindow, setListWindow, listHiddenBubble, setListHiddenBubble } =
    useData();
  useEffect(() => {
    async function AsyncGetCon() {
      const convers = await getConversation(auth);
      setConversation(convers);
    }
    AsyncGetCon();
  }, []);
  const onClickConser = (c) => {
    setListWindow((prev) => {
      const newClicked = [...prev];
      const existingIndex = newClicked.findIndex((obj) => obj.id === c);
      if (existingIndex !== -1) {
        newClicked.splice(existingIndex, 1);
      }
      if (conversations) {
        const con = conversations.filter((e) => e.id === c);
        newClicked.unshift(con[0]);
      }
      return newClicked;
    });
    setListHiddenBubble((pre) => {
      const data = pre.filter((e) => e.id !== c);
      return data;
    });
  };

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

  return (
    <div className="main_layout25 linearBefore">
      {!props.isHidden && (
        <>
          <h1> Tin nhắn </h1>
          {conversations && (
            <>
              {conversations.map(
                (c, i) =>
                  c.Friend === 1 && ( // Kiểm tra xem conversation có thuộc tính Friend không
                    <div
                      key={i}
                      className="converrsation_chat"
                      onClick={() => {
                        onClickConser(c.id);
                      }}
                    >
                      <Conversation
                        count={props.counter}
                        conversation={c}
                        notSeen_field={true}
                        Online={onlineUser}
                      ></Conversation>
                    </div>
                  )
              )}
            </>
          )}
        </>
      )}
      <div className="windowchat_container">
        {listWindow &&
          listWindow.map((e, i) => (
            <WindowChat
              key={i}
              count={e}
              index={i}
              isHidden={false}
              ListusersOnline={onlineUser}
            />
          ))}
      </div>
    

    </div>
  );
}
