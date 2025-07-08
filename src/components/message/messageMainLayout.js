import { useData } from "../../context/dataContext";
import { useRealTime } from "../../context/useRealTime";
import { getInforByUserID } from "../../function/getApi";
import Conversation from "../conversation/conversations";
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
  const { LoadingConver, Conversations } = useData();

  const { Onlines } = useRealTime();

  return (
    <>
      <div className="main_layout25 linearBefore h-full ">
        {!props.isHidden && (
          <>
            <div className=" hover:overflow-y-scroll" style={{ height: "80%" }}>
              {
                <>
                  {Conversations && !LoadingConver ? (
                    Conversations.map((c, i) => (
                      <div key={c.id} className="converrsation_chat center">
                        <Conversation
                          count={props.counter}
                          conversation={c}
                          notSeen_field={true}
                          Online={Onlines}
                        ></Conversation>
                      </div>
                    ))
                  ) : (
                    <div className="w-full center">
                      <div className="loader"></div>
                    </div>
                  )}
                </>
              }
            </div>
          </>
        )}
      </div>
    </>
  );
}
