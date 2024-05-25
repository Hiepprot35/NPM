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
import { fetchApiRes } from "../../function/getApi";
import { useData } from "../../context/dataContext";
import { getConversation } from "../conversation/getConversation";
import { useSocket } from "../../context/socketContext";
import { IsLoading } from "../Loading";
const { Content, Footer } = Layout;

export default function UserProfile(props) {
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [Users, setUserInfo] = useState();
  const { listWindow, setListWindow, setListHiddenBubble, listHiddenBubble } =
    useData();
  const { auth } = useAuth();
  const host = process.env.REACT_APP_DB_HOST;
  const [myFriendList, setMyFriendList] = useState([]);
  const removeElement = (array, index) => {
    const newArray = array.filter((obj) => obj?.id !== index);
    return newArray;
  };
  const addToConverArray = (prev, id) => {
    const newClicked = prev.filter((obj) => obj.id !== id);
    const con = prev.find((e) => e.id === id);
    if (con) {
      newClicked.unshift(con);
    }

    return newClicked;
  };
  const sendRequestFriend = async (id) => {
    const converFound = await foundConversation(id, auth.userID);
    console.log(converFound);
    if (!converFound) {
      const data = await fetchApiRes("conversations", "POST", {
        user1: auth.userID,
        user2: id,
        Requesting: 1,
      });
      console.log(data);
    } else {
      const data = await fetchApiRes("message/updateConversation", "POST", {
        Requesting: 1,
        user1: auth.userID,
        user2: id,
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
  const [gerenalFriend, setgerenalFriend] = useState([]);
  const getUserFriendList = async () => {
    const result = await fetchApiRes("message/getFriendList", "POST", {
      userID: Users?.UserID,
    });
    const data = result.result.map((e) => checkID(e, Users?.UserID));
    setUserFriendList(data);
  };

  const handleAddChat = async (id) => {
    try {
      // setIsLoading(true)
      const converFound = await foundConversation(id, auth.userID);
      if (!converFound) {
        try {
          const res = await fetchApiRes("conversations", "POST", {
            user1: auth.userID,
            user2: id,
            created_at: Date.now(),
          });

          const data = res?.result;
          console.log(data, "ssss");
          setListWindow((pre) => [
            ...pre,
            { id: data, user1: auth.userID, user2: id, created_at: Date.now() },
          ]);
        } catch (error) {
          console.log(error);
        }
      } else {
        setListWindow((pre) => {
          const foundIndex = pre.findIndex((e) => e.id === converFound.id);
          if (foundIndex === -1) {
            // If converFound is not in the list, add it
            return [...pre, converFound];
          } else {
            // If converFound is already in the list, move it to the beginning
            const updatedList = pre.filter((e) => e.id !== converFound.id);
            updatedList.unshift(converFound);
            return updatedList;
          }
        });

        setListHiddenBubble(removeElement(listHiddenBubble, converFound.id));
      }
    } catch (error) {}
  };

  const foundConversation = async (user1, user2) => {
    const conversations = await Promise.all([
      fetchApiRes("message/getConversation", "POST", {
        user1: user1,
        user2: user2,
      }),
      fetchApiRes("message/getConversation", "POST", {
        user1: user2,
        user2: user1,
      }),
    ]);
    console.log("Côf,", conversations);
    const result = conversations.reduce((acc, curr) => {
      if (curr?.result?.length > 0) {
        acc = curr.result[0];
      }
      return acc;
    }, false);

    return result;
  };
  const [userFriendList, setUserFriendList] = useState([]);
  const checkID = (array, id) => {
    return array.user1 === id ? array.user2 : array.user1;
  };
  useEffect(() => {
    if (myFriendList && userFriendList) {
      const generalFriends = userFriendList.filter((userFriend) => {
        return myFriendList.some((e) => e === userFriend);
      });

      setgerenalFriend(generalFriends);
    }
  }, [myFriendList, userFriendList]);

  useEffect(() => {
    if (Users) {
      getFriendList();
      getUserFriendList();
    }
  }, [Users]);
  const getFriendList = async () => {
    const result = await fetchApiRes("message/getFriendList", "POST", {
      userID: auth.userID,
    });
    const data = result.result.map((e) => checkID(e, auth.userID));
    setMyFriendList(data);
  };
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

    getData();
  }, [props.MSSV]);

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
                          src={Users.img}
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
                  <div style={{ width: "40%" }}>
                    <Button
                      type="primary"
                      size="large"
                      className="sendButton"
                      onClick={() => {
                        handleAddChat(Users.UserID);
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
