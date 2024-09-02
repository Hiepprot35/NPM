import { Button, Layout, Popover } from "antd";
import { useEffect, useState } from "react";
import { FiMessageCircle, FiUserMinus, FiUserPlus } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useData } from "../../context/dataContext";
import { useSocket } from "../../context/socketContext";
import { fetchApiRes } from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import GerenalFriendComponent from "../home/gerenalFriendComponent";
import { IsLoading } from "../Loading";
import "./userProfile.css";
const getFriendList = async (userID) => {
  const checkID = (array, id) => {
    return array.user1 === id ? array.user2 : array.user1;
  };
  const result = await fetchApiRes("message/getFriendList", "POST", {
    userID: userID,
  });
  const data = result.result.map((e) => checkID(e, userID));
  return data;
};

export default function UserProfile(props) {
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const {
    setListWindow,
    setListHiddenBubble,
    setConversations,
    setConversationContext,
    Conversations,
  } = useData();
  const { auth, myInfor } = useAuth();
  const AddConver = async (id, request) => {
    try {
      const obj = {
        user1: auth.userID,
        user2: id,
        user1_mask: myInfor.Name,
        user2_mask: props.User.Name,
        Requesting: request ? 1 : 0,
        created_at: Date.now(),
      };
      const res = await fetchApiRes("conversations", "POST", { ...obj });
      console.log(res);
      if (res.result) {
        return {
          id: res.result,
          ...obj,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [Cursor, setCursor] = useState();
  const deleteRequestFriend = async (id) => {
    const converFound = Conversations.find(
      (e) => e.user1 === id || e.user2 === id
    );
    const data = await fetchApiRes("message/updateConversation", "POST", {
      Requesting: 0,

      id: converFound.id,
    });
  };
  const sendRequestFriend = async (id) => {
    // const converFound = await foundConversation(id, auth.userID);
    const converFound = Conversations.find(
      (e) => e.user1 === id || e.user2 === id
    );
    if (!converFound) {
      setCursor("wait");
      await AddConver(id, true);
      setCursor("");
    } else {
      const user1_mask =
        converFound.user1 === auth.userID
          ? converFound.user1_mask
          : converFound.user2_mask;
      const user2_mask =
        converFound.user1 === auth.userID
          ? converFound.user2_mask
          : converFound.user1_mask;

      const data = await fetchApiRes("message/updateConversation", "POST", {
        Requesting: 1,
        user1: auth.userID,
        user2: id,
        user1_mask: user1_mask,
        user2_mask: user2_mask,
        id: converFound.id,
      });
      console.log(data);
    }
    if (socket) {
      socket.emit("SendRequestFriend", {
        sender: auth.userID,
        receiver: id,
      });
    }
  };

  const replaceCover = (pre, data) => {
    const index = pre.findIndex(
      (e) =>
        (e.user1 === data.user1 && e.user2 === data.user2) ||
        (e.user2 === data.user1 && e.user1 === data.user2)
    );

    if (index !== -1) {
      const newPre = [...pre];
      newPre[index] = data;
      return newPre;
    }

    return pre;
  };
  const handleAddChat = async (id) => {
    try {
      const obj = {
        user1: auth.userID,
        user2: id,
        user1_mask: myInfor.Name,
        user2_mask: props.User.Name,
        img: props.User.cutImg || props.User.img,
        created_at: Date.now(),
      };
      const converFound = Conversations.find(
        (e) => e?.user1 === id || e?.user2 === id
      );

      if (!converFound) {
        try {
          setCursor("wait");
          const data = await AddConver(id);
          setCursor("");
          const newConver = { id: data.id, ...obj };
          setListWindow((prev) => {
            return [{ id: data.id }, ...prev];
          });
          setConversations((prev) => {
            return [newConver, ...prev];
          });

          setConversationContext((prev) => [newConver, ...prev]);
        } catch (error) {
          console.log(error);
        }
      } else {
        setConversationContext((prev) => [
          { ...converFound, img: props.User.cutImg || props.User.img },
          ...prev.filter((e) => e.id !== converFound.id),
        ]);
        setListHiddenBubble((pre) => [
          ...pre.filter((e) => e.id !== converFound.id),
        ]);
        setListWindow((prev) => [...prev, { id: converFound.id }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const foundConversation = async (user1, user2) => {
    const conversations = await fetchApiRes("message/getConversation", "POST", {
      user1: user1,
      user2: user2,
    });
    if (conversations.result.length > 0) {
      return conversations.result[0];
    } else {
      return false;
    }
  };
  const checkID = (array, id) => {
    return array.user1 === id ? array.user2 : array.user1;
  };

  const [gerenalFriend, setgerenalFriend] = useState([]);

  useEffect(() => {
    if (props.User) {
      const getUserFriend = async () => {
        const dataMyFriend = await getFriendList(auth?.userID);
        const dataUserFriend = await getFriendList(props.User?.UserID);
        const generalFriends = dataUserFriend.filter((userFriend) => {
          return dataMyFriend.some((e) => e === userFriend);
        });
        setgerenalFriend(generalFriends);
      };
      getUserFriend();
    }
  }, [props.User]);

  return (
    <>
      {
        <div className="UserProfile" style={{ width: "100%", cursor: Cursor }}>
          <div className="">
            {props.User && (
              <div>
                <div
                  className="center"
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    fontSize: `${props?.fontSize}`,
                  }}
                >
                  <div>
                    <Popover
                      content={
                        <UserProfile
                          User={props.User}
                          MSSV={props.User.MSSV}
                          isHover={true}
                        ></UserProfile>
                      }
                    >
                      <NavLink
                        to={`${process.env.REACT_APP_CLIENT_URL}/profile/${props.User.MSSV}`}
                      >
                        <img
                          className="avatarImage"
                          // style={{ width: "168px" }}
                          src={
                            props.User?.cutImg ||
                            props.User?.img ||
                            "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                          }
                          alt="avatar"
                        />
                      </NavLink>
                    </Popover>
                  </div>
                  <div
                    className={props.hover ? "hoverProfile" : `article-body`}
                  >
                    <div>
                      <b>
                        {props.User.Name} {auth.userID}
                      </b>
                      <p>Có {gerenalFriend.length} bạn chung</p>
                      {gerenalFriend && (
                        <GerenalFriendComponent
                          listGerenal={gerenalFriend}
                        ></GerenalFriendComponent>
                      )}
                    </div>
                  </div>
                  <div>
                    {Conversations && (
                      <Button
                        type="primary"
                        size="large"
                        className="sendButton"
                        onClick={() => {
                          if (auth.userID) {
                            handleAddChat(props.User.UserID);
                          } else {
                            window.open(
                              `${process.env.REACT_APP_CLIENT_URL}/login`,
                              "_blank"
                            );
                          }
                        }}
                        style={{
                          width: "3rem",
                          margin: ".2rem",
                          cursor: Cursor,
                        }}
                        icon={
                          <FiMessageCircle
                            style={{ stroke: "blue" }}
                          ></FiMessageCircle>
                        }
                      ></Button>
                    )}
                    {Conversations.some(
                      (e) =>
                        (e.user1 === props.User.UserID ||
                          e.user2 === props.User.UserID) &&
                        e.Friend
                    ) ? (
                      <Button
                        size="large"
                        style={{
                          width: "3rem",
                          margin: ".2rem",
                          cursor: Cursor,
                        }}
                        onClick={() => deleteRequestFriend(props.User.UserID)}
                        icon={<FiUserMinus></FiUserMinus>}
                      ></Button>
                    ) : (
                      <Button
                        size="large"
                        style={{
                          width: "3rem",
                          margin: ".2rem",
                          cursor: Cursor,
                        }}
                        onClick={() => sendRequestFriend(props.User.UserID)}
                        icon={<FiUserPlus></FiUserPlus>}
                      ></Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    </>
  );
}
