import React, { useEffect, useRef, useState } from "react";

import UseToken from "../../hook/useToken";
import UserProfile from "../UserProfile/userProfile";
import "./friend.css";
import { fetchApiRes } from "../../function/getApi";

export default function FriendList(props) {
  const [Users, setListUsers] = useState([]);
  const getData = async () => {
    try {
      const response = await fetchApiRes("getallstudent", "GET");
     console.log(response);
     console.log(response.result);
      setListUsers(response.result);
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
          Users.map((e) => <UserProfile User={e} MSSV={e.UserID} />)
        )}
      </div>
    </>
  );
}
