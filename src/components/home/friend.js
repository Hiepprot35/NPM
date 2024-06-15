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
import { data } from "jquery";
import UserProfile from "../UserProfile/userProfile";

export default function FriendList(props) {
  const { listWindow, setListWindow, setListHiddenBubble, listHiddenBubble } =
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
        console.log(data.result);
        setListUsers(data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const refListFriend = useRef();

  return (
    <>
      {/* <Layout></Layout> */}
      <div
        className={
          props.className
            ? props.className
            : `friendListDiv linearBefore overflow-scroll h-80`
        }
        ref={refListFriend}
        style={{ display: "flex center" }}
      >
        {!Users.length > 0 ? (
          <div className="w-ful h-full center">
            <div className="loader"></div>
          </div>
        ) : (
          Users.map((e) => <UserProfile User={e} MSSV={e.MSSV} />)
        )}
      </div>
    </>
  );
}
