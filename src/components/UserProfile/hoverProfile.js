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
import { Layout } from "antd";
const { Content, Footer } = Layout;

export default function HoverProfile(props) {
  const [UserInfo, setUserInfo] = useState();
  const host = process.env.REACT_APP_DB_HOST;

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
  }, []);
  useEffect(() => {
    console.log("userinfo",UserInfo);
  }, [UserInfo]);

  return (
    <>
      <div className="hoverProfile">
        <div className="">
          {UserInfo && (
            <FriendList
              className="userProfile"
              fontSize="1rem"
              profile={true}
              hover={true}
              listUsers={[{ ...UserInfo }]}
            ></FriendList>
          )}
        </div>
      </div>

    </>
  );
}
