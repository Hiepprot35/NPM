import { useEffect, useState } from "react";
import { useData } from "../../context/dataContext";
import { useSocket } from "../../context/socketContext";
import useAuth from "../../hook/useAuth";
import Conversation from "../conversation/conversations";
import { getConversation } from "../conversation/getConversation";

export default function MessageMainLayout(props) {
  const [onlineUser, setOnlineUser] = useState();
  const socket = useSocket();
  const { auth } = useAuth();
  const [conversations, setConversation] = useState([]);

  const { listWindow, setListWindow, setListHiddenBubble, listHiddenBubble } =
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
        const con = [];
        for (const e of conversations) {
          if (e?.id === c) {
            con.push(e);
          }
        }
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
    <>
      <div className="main_layout25 linearBefore">
        {!props.isHidden && (
          <>
            <h1> Tin nhắn </h1>
            {conversations.length>0 && (
              <>
                {conversations.map(
                  (c, i) =>
                    c.Friend === 1 && (
                      <div
                        key={c.id}
                        className="converrsation_chat center"
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
      </div>
     
    </>
  );
}
