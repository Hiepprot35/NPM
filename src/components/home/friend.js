import React, { useEffect, useRef, useState } from "react";
import "./friend.css";
import useAuth from "../../hook/useAuth";
import { FiMessageCircle, FiUserPlus, FiUserCheck, FiX } from "react-icons/fi";
import { List, Button, Popover } from "antd";
import { NavLink } from "react-router-dom";
import { useData } from "../../context/dataContext";
import { fetchApiRes } from "../../function/getApi";
import UseToken from "../../hook/useToken";
import { useSocket } from "../../context/socketContext";
import { getConversation } from "../conversation/getConversation";
import GerenalFriendComponent from "./gerenalFriendComponent";
import Header from "../Layout/header/header";
import Layout from "../Layout/layout";

export default function FriendList(props) {
  const { listWindow, setListWindow, listHiddenBubble, setListHiddenBubble } =
    useData();
  const socket = useSocket();

  const [clickNewCon, setClickNewCon] = useState(false);
  const [conversations, setConversation] = useState();
  const [myFriendList, setMyFriendList] = useState([]);
  const [gerenalFriend, setgerenalFriend] = useState([]);
  const { auth } = useAuth();
  const [userFriendList, setUserFriendList] = useState([]);
  const { AccessToken, setAccessToken } = UseToken();
  const [Users, setListUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    const URL = `${process.env.REACT_APP_DB_HOST}/api/getallstudent`;
    try {
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          setIsLoading(false);
          setListUsers(data.result);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, [AccessToken]);
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

    const result = conversations.reduce((acc, curr) => {
      if (curr.result.length > 0) {
        acc = curr.result[0].id;
      }
      return acc;
    }, false);

    return result;
  };
  const addToConverArray = (array, prev, id) => {
    const newClicked = prev.filter((obj) => obj.id !== id);
    const con = array.find((e) => e.id === id);
    if (con) {
      newClicked.unshift(con);
    }
    return newClicked;
  };
  useEffect(() => {
    if (clickNewCon && conversations) {
      setListWindow((pre) => addToConverArray(conversations, pre, clickNewCon));
    }
  }, [conversations]);
  const removeElement = (array, index) => {
    const newArray = array.filter((obj) => obj?.id !== index);
    return newArray;
  };
  const deleteFriend = async (id) => {
    const converFound = await foundConversation(id, auth.userID);
    try {
      const data = await fetchApiRes("message/updateConversation", "POST", {
        Friend: false,
        id: converFound,
      });
      if (data.result) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);

      console.log(error);
    }
  };
  const sendRequestFriend = async (id) => {
    const converFound = await foundConversation(id, auth.userID);
    setIsLoading(true);
    if (!converFound) {
      try {
        await fetchApiRes("conversations", "POST", {
          user1: auth.userID,
          user2: id,
          Requesting: 1,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = await fetchApiRes("message/updateConversation", "POST", {
          Requesting: true,
          user1: auth.userID,
          user2: id,
          id: converFound,
        });
        if (data.result) {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);

        console.log(error);
      }
    }
    if (socket) {
      socket.emit("SendRequestFriend", {
        sender: auth.userID,
        receiver: id,
      });
    }
  };

  useEffect(() => {
    async function AsyncGetCon() {
      const convers = await getConversation(auth);
      setConversation(convers);
    }
    AsyncGetCon();
  }, [clickNewCon]);
  useEffect(() => {
    if (myFriendList && userFriendList) {
      const generalFriends = userFriendList.map((userFriend) =>
        userFriend.filter((friend) => myFriendList.includes(friend))
      );
      setgerenalFriend(generalFriends);
    }
  }, [myFriendList, userFriendList]);

  useEffect(() => {
    getFriendList();
    getUserFriendList();
  }, []);
  const getFriendList = async () => {
    const result = await fetchApiRes("message/getFriendList", "POST", {
      userID: auth.userID,
    });
    const data = result.result.map((e) => checkID(e, auth.userID));
    setMyFriendList(data);
  };
  const getUserFriendList = async () => {
    const listFriend = [];
    for (let i = 0; i < Users.length; i++) {
      const result = await fetchApiRes("message/getFriendList", "POST", {
        userID: Users[i].UserID,
      });
      const data = result.result.map((e) => checkID(e, Users[i].UserID));
      listFriend.push(data);
    }
    setUserFriendList(listFriend);
  };

  const checkID = (array, id) => {
    return array.user1 === id ? array.user2 : array.user1;
  };

  const handleAddChat = async (id) => {
    const converFound = await foundConversation(id, auth.userID);
    if (!converFound) {
      try {
        const res = await fetchApiRes("conversations", "POST", {
          user1: auth.userID,
          user2: id,
        });

        const data = res?.result;
        setClickNewCon(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setListWindow(() =>
        addToConverArray(conversations, listWindow, converFound)
      );
      setListHiddenBubble(() => removeElement(listHiddenBubble, converFound));
    }
  };
  const refListFriend = useRef();
  const changeListDiv = (second) => {
    if (refListFriend.current) {
      refListFriend.current.classList.toggle("hidden");
    }
  };
  return (
    <>
        <div
          className={
            props.className ? props.className : `friendListDiv linearBefore`
          }
          ref={refListFriend}
          style={{ display: "flex" }}
        >
          {!props.profile && (
            <List
              itemLayout="horizontal"
              className="usersInfomation"
              header={
                <div>
                  <h1>Danh sách người dùng</h1>
                </div>
              }
              // <Content style={{ padding: 16, overflow: "auto" }}/>

              //   footer={<div>Sample FOOTER</div>}
              bordered
              dataSource={Object.values(Users)}
              renderItem={(student, index) => (
                <List.Item
                  style={{ width: "100%", height: "100px" }}
                  className="ListItem"
                >
                  <div
                    className="center"
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <div>
                      <NavLink
                        to={`${process.env.REACT_APP_CLIENT_URL}/profile/${student.MSSV}`}
                      >
                        <img className="avatarImage" src={student.img} alt="" />
                      </NavLink>
                    </div>
                    <div className="article-body" style={{ width: "50%" }}>
                      <div className="hiddenEllipsis">
                        <b className="">{student.Name}</b>
                        <p>Có {gerenalFriend[index]?.length ?? 0} bạn chung</p>
                        {gerenalFriend[index] && (
                          <GerenalFriendComponent
                            listGerenal={gerenalFriend[index]}
                          ></GerenalFriendComponent>
                        )}
                      </div>
                      {/* Thêm các thông tin khác tùy ý */}
                    </div>
                    <div style={{ width: "40%" }}>
                      <Button
                        type="primary"
                        size="large"
                        className="sendButton"
                        onClick={() => {
                          handleAddChat(student.UserID);
                        }}
                        style={{ width: "3rem", margin: ".2rem" }}
                        icon={
                          <FiMessageCircle
                            style={{ stroke: "blue" }}
                          ></FiMessageCircle>
                        }
                      ></Button>
                      {myFriendList &&
                        (!myFriendList.some((e) => e === student.UserID) ? (
                          <Button
                            size="large"
                            style={{ width: "3rem", margin: ".2rem" }}
                            onClick={() => sendRequestFriend(student.UserID)}
                            icon={<FiUserPlus></FiUserPlus>}
                          ></Button>
                        ) : (
                          <Button
                            size="large"
                            style={{ width: "3rem", margin: ".2rem" }}
                            onClick={() => deleteFriend(student.UserID)}
                            icon={<FiUserCheck></FiUserCheck>}
                          ></Button>
                        ))}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
          {props.profile && (
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
                  <NavLink
                    to={`${process.env.REACT_APP_CLIENT_URL}/profile/${Users[0].MSSV}`}
                  >
                    <img
                      className="avatarImage"
                      // style={{ width: "168px" }}
                      src={Users[0].img}
                      alt=""
                    />
                  </NavLink>
                </div>
                <div className={props.hover ? "hoverProfile" : `article-body`}>
                  <div>
                    <b>{Users[0].Name}</b>
                    <p>Có {gerenalFriend[0]?.length ?? 0} bạn chung</p>
                    {gerenalFriend[0] && (
                      <GerenalFriendComponent
                        listGerenal={gerenalFriend[0]}
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
                      handleAddChat(Users[0].UserID);
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
                    onClick={() => sendRequestFriend(Users[0].UserID)}
                    icon={<FiUserPlus></FiUserPlus>}
                  ></Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Button
          shape="circle"
          onClick={changeListDiv}
          style={{ position: "fixed", left: 0, bottom: "0", zIndex: "99" }}
          icon={<FiX color="black"></FiX>}
        ></Button>
    </>
  );
}
