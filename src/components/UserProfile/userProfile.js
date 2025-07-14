import { Button, Layout, Popover } from "antd";
import { useEffect, useState } from "react";
import { FiMessageCircle, FiUserMinus, FiUserPlus } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useData } from "../../context/dataContext";
import { useSocket } from "../../context/socketContext";
import { fetchApiRes, getStudentInfoByMSSV } from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import GerenalFriendComponent from "../home/gerenalFriendComponent";
import { IsLoading } from "../Loading";
import "./userProfile.css";
import { RouteLink } from "../../lib/link";
const getFriendList = async (userID) => {
  const checkID = (array, id) => {
    return array.user1 === id ? array.user2 : array.user1;
  };
  const result = await fetchApiRes(`message/getFriendList?user=${userID}`, "GET");

  return result?.result || [];
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
  const [UserProfileState, setUserProfileState] = useState();
  useEffect(() => {
    const getUserInfo = async (e) => {
      const res = await getStudentInfoByMSSV(e);
      setUserProfileState(res);
    };
    if (props.MSSV) {
      getUserInfo(props.MSSV);
    }
  }, [props.MSSV]);
  const AddConver = async (id, request) => {
    try {
      const obj = {
        user1: auth.userID,
        user2: id,
        user1_mask: myInfor.Name,
        user2_mask: UserProfileState.Name,
        Requesting: request ? 1 : 0,
      };
      const res = await fetchApiRes("conversations", "POST", { ...obj });
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
    await fetchApiRes("message/updateConversation", "POST", {
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

  const handleAddChat = async (id) => {
    try {
      const obj = {
        user1: auth.userID,
        user2: id,
        user1_mask: myInfor.Name,
        user2_mask: UserProfileState.Name,
        img: UserProfileState.cutImg || UserProfileState.img,
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
          {
            ...converFound,
            img: UserProfileState.cutImg || UserProfileState.img,
          },
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

  const [gerenalFriend, setgerenalFriend] = useState({result:[],mutualFriends:0});
 
  useEffect(() => {
    if (UserProfileState?.UserID) {
      const getUserFriend = async () => {
        const dataUserFriend = await fetchApiRes(`message/getFriendList?user=${UserProfileState?.UserID}`, "GET");;
     
        setgerenalFriend(dataUserFriend);
      };
      getUserFriend();
    }
  }, [UserProfileState, auth]);

  return (
    <>
      {
        <div className="UserProfile" style={{ width: "100%", cursor: Cursor }}>
          <div className="">
            {UserProfileState && (
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
                        <>
                          <UserProfile
                            User={UserProfileState}
                            MSSV={UserProfileState.MSSV}
                            isHover={true}
                          ></UserProfile>
                        </>
                      }
                    >
                      <NavLink
                        to={`${RouteLink.profileLink}/${UserProfileState.UserID}`}
                      >
                        <img
                          className="avatarImage"
                          src={
                            UserProfileState?.cutImg ||
                            UserProfileState?.img ||
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
                        {UserProfileState.Name}
                      </b>
                      <p>Có {gerenalFriend.mutualFriends} bạn chung</p>
                      {gerenalFriend && (
                        <GerenalFriendComponent
                          listGerenal={gerenalFriend.result}
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
                            handleAddChat(UserProfileState.UserID);
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
                        (e.user1 === UserProfileState.UserID ||
                          e.user2 === UserProfileState.UserID) &&
                        e.Friend
                    ) ? (
                      <Button
                        size="large"
                        style={{
                          width: "3rem",
                          margin: ".2rem",
                          cursor: Cursor,
                        }}
                        onClick={() =>
                          deleteRequestFriend(UserProfileState.UserID)
                        }
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
                        onClick={() =>
                          sendRequestFriend(UserProfileState.UserID)
                        }
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
