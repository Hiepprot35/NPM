import { useEffect, useState } from "react";
import { useData } from "../../context/dataContext";
import { useSocket } from "../../context/socketContext";
import useAuth from "../../hook/useAuth";
import Conversation from "../conversation/conversations";
import { getConversation } from "../conversation/getConversation";
import { useRealTime } from "../../context/useRealTime";
import { getInforByUserID } from "../../function/getApi";
export const findUserConversation = async (conversation, auth) => {
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
  const data = await getInforByUserID(userMask);
  return {
    userConver: userConver,
    myMask: myMask,
    userMask: userMask,
    username: data.Name,
    avtUrl: data?.cutImg || data?.img,
  };
};
export default function MessageMainLayout(props) {
  const [onlineUser, setOnlineUser] = useState();
  const socket = useSocket();
  const { auth } = useAuth();
  const [conversations, setConversation] = useState([]);

  const {
    listWindow,
    setListWindow,
    setListHiddenBubble,
    Conversations,
    ConversationContex,
  } = useData();

  const { Onlines } = useRealTime();

  return (
    <>
      <div className="main_layout25 linearBefore h-full ">
        {!props.isHidden && (
          <>
            <h1 className="text-4xl font-semibold"> Tin nhắn </h1>
            <div className=" hover:overflow-y-scroll" style={{height:"80%"}}>
              {
                <>
                  {Conversations &&
                    Conversations.map((c, i) => (
                      <div key={c.id} className="converrsation_chat center">
                        <Conversation
                          count={props.counter}
                          conversation={c}
                          notSeen_field={true}
                          Online={Onlines}
                        ></Conversation>
                      </div>
                    ))}
                </>
              }
            </div>
          </>
        )}
      </div>
    </>
  );
}
