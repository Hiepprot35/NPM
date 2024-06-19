import { useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import { useRefresh } from "../../hook/useRefresh";
import UseToken from "../../hook/useToken";
import Header from "../Layout/header/header";
import useAuth from "../../hook/useAuth";
import "./userProfile.css";
import BlobtoBase64 from "../../function/BlobtoBase64";
import Home from "../home/home";
import FriendList from "../home/friend";
import MessageMainLayout from "../message/messageMainLayout";
import { Button, Layout, Popover } from "antd";
import GerenalFriendComponent from "../home/gerenalFriendComponent";
import { FiMessageCircle, FiUserPlus } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import {
  fetchApiRes,
  getStudentInfoByMSSV,
  getUserinfobyID,
} from "../../function/getApi";
import { useData } from "../../context/dataContext";
import { getConversation } from "../conversation/getConversation";
import { useSocket } from "../../context/socketContext";
import { IsLoading } from "../Loading";
const { Content, Footer } = Layout;
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
  const [Users, setUserInfo] = useState();
  const { listWindow, setListWindow, setListHiddenBubble, listHiddenBubble } =
    useData();
  const { auth, myInfor } = useAuth();
  const host = process.env.REACT_APP_DB_HOST;
  const removeElement = (array, index) => {
    const newArray = array.filter((obj) => obj?.id !== index);
    return newArray;
  };
  const AddConver = async (id, request) => {
    try {
      const obj = {
        user1: auth.userID,
        user2: id,
        user1_mask: myInfor.Name,
        user2_mask: Users.Name,
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

  const sendRequestFriend = async (id) => {
    const converFound = await foundConversation(id, auth.userID);
    if (!converFound) {
      await AddConver(id, true);
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
      const conver = {
        user1: auth.userID,
        user2: id,
        created_at: Date.now(),
        img: Users?.cutImg || Users?.img,
      };

      const foundIndex = listWindow.findIndex(
        (e) =>
          (e.user1 === conver.user1 && e.user2 === conver.user2) ||
          (e.user2 === conver.user1 && e.user1 === conver.user2)
      );
      const inHiddent = listHiddenBubble.find(
        (e) =>
          (e.user1 === conver.user1 && e.user2 === conver.user2) ||
          (e.user2 === conver.user1 && e.user1 === conver.user2)
      );
      if (foundIndex === -1 && !inHiddent) {
        setListWindow((pre) => [...pre, conver]);
      } else {
        let updatedList = [...listWindow];
        if (inHiddent) {
          setListHiddenBubble((pre) => pre.filter((e) => e !== inHiddent));
          updatedList.unshift(inHiddent);
        }
        if (foundIndex) {
          const element = updatedList.splice(foundIndex, 1)[0];
          updatedList.unshift(element);
        }

        setListWindow(updatedList);
      }

      const converFound = await foundConversation(id, auth.userID);

      if (!converFound) {
        try {
          const obj = {
            user1: auth.userID,
            user2: id,
            user2_mask: Users.Name,
            created_at: Date.now(),
          };
          setListWindow((prev) => replaceCover(prev, { ...obj }));
          const data = await AddConver(id);
          setListWindow((prev) => replaceCover(prev, { ...data }));
        } catch (error) {
          console.log(error);
        }
      } else {
        setListWindow((prev) =>
          replaceCover(prev, { ...converFound, ...conver })
        );
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
    if (Users) {
      const getUserFriend = async () => {
        const dataMyFriend = await getFriendList(auth?.userID);
        const dataUserFriend = await getFriendList(Users?.UserID);
        const generalFriends = dataUserFriend.filter((userFriend) => {
          return dataMyFriend.some((e) => e === userFriend);
        });
        setgerenalFriend(generalFriends);
      };
      getUserFriend();
    }
  }, [Users]);
  // useEffect(() => {
  //   if (myFriendList && userFriendList) {
  //     const generalFriends = userFriendList.filter((userFriend) => {
  //       return myFriendList.some((e) => e === userFriend);
  //     });

  //     setgerenalFriend(generalFriends);
  //   }
  // }, [myFriendList, userFriendList]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(`${host}/api/getStudentbyID/${props.MSSV}`);
        const resJson = await res.json();
        setUserInfo(resJson);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    console.log(props.User)
    if (!props.User) {
      getData();
    }
    else{
      setUserInfo(props.User)
    }
  }, [props.MSSV,props.User]);

  return (
    <>
      {isLoading ? (
        <IsLoading></IsLoading>
      ) : (
        <div className="UserProfile" style={{ width: "100%" }}>
          <div className="">
            {Users && (
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
                        User={Users}
                          MSSV={Users.MSSV}
                          isHover={true}
                        ></UserProfile>
                      }
                    >
                      <NavLink
                        to={`${process.env.REACT_APP_CLIENT_URL}/profile/${Users.MSSV}`}
                      >
                        <img
                          className="avatarImage"
                          // style={{ width: "168px" }}
                          src={Users?.cutImg || Users?.img}
                          alt=""
                        />
                      </NavLink>
                    </Popover>
                  </div>
                  <div
                    className={props.hover ? "hoverProfile" : `article-body`}
                  >
                    <div>
                      <b>{Users.Name}</b>
                      <p>Có {gerenalFriend.length} bạn chung</p>
                      {gerenalFriend && (
                        <GerenalFriendComponent
                          listGerenal={gerenalFriend}
                        ></GerenalFriendComponent>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      size="large"
                      className="sendButton"
                      onClick={() => {
                        if (auth.userID) {
                          handleAddChat(Users.UserID);
                        } else {
                          window.open(
                            `${process.env.REACT_APP_CLIENT_URL}/login`,
                            "_blank"
                          );
                        }
                      }}
                      style={{ width: "3rem", margin: ".2rem" }}
                      icon={
                        <FiMessageCircle
                          style={{ stroke: "blue" }}
                        ></FiMessageCircle>
                      }
                    ></Button>
                    <Button
                      size="large"
                      style={{ width: "3rem", margin: ".2rem" }}
                      onClick={() => sendRequestFriend(Users.UserID)}
                      icon={<FiUserPlus></FiUserPlus>}
                    ></Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
