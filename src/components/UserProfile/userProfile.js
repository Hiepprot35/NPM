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
const { Content, Footer } = Layout;

export default function UserProfile(props) {
  const [Users, setUserInfo] = useState();
  const { auth } = useAuth();
  const host = process.env.REACT_APP_DB_HOST;
  const [myFriendList, setMyFriendList] = useState([]);

  const [gerenalFriend, setgerenalFriend] = useState([]);
  const getUserFriendList = async () => {
    const result = await fetchApiRes("message/getFriendList", "POST", {
      userID: Users?.UserID,
    });
    const data = result.result.map((e) => checkID(e, Users?.UserID));
    setUserFriendList(data);
  };

  useEffect(() => {
    console.log("MSSV", props?.MSSV);
  }, [props.MSSV]);
  const [userFriendList, setUserFriendList] = useState([]);
  const checkID = (array, id) => {
    return array.user1 === id ? array.user2 : array.user1;
  };
  useEffect(() => {
    if (myFriendList && userFriendList) {
      const generalFriends = userFriendList.filter((userFriend) => {
        return  myFriendList.some(e=>e===userFriend);
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
                  {/* <Popover
                    content={
                      <UserProfile
                        MSSV={Users.MSSV}
                        isHover={true}
                      ></UserProfile>
                    }
                  > */}
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
                  {/* </Popover> */}
                </div>
                <div className={props.hover ? "hoverProfile" : `article-body`}>
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
                    // onClick={() => {
                    //   handleAddChat(Users[0].UserID);
                    // }}
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
                    // onClick={() => sendRequestFriend(Users[0].UserID)}
                    icon={<FiUserPlus></FiUserPlus>}
                  ></Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
