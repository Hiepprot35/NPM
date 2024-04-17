import React, { useEffect, useState } from "react";
import { fetchApiRes } from "../../function/getApi";
import { Avatar, List, Popover } from "antd";
import { NavLink } from "react-router-dom";
import UserProfile from "../UserProfile/userProfile";
import HoverProfile from "../UserProfile/hoverProfile";

export default function GerenalFriendComponent(props) {
  const [Users, setUsers] = useState();
  const getUser = async () => {
    let ListInfo = [];
    if (props.listGerenal) {
      const result = await Promise.all(
        props.listGerenal.map(async (e) => {
          const data = await fetchApiRes(`username`, "POST", { UserID: e });
          const user = await fetchApiRes(`getStudentbyID/${data[0].username}`);
          return user;
        })
      );
      setUsers(result);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="GerenalFriend">
      <Avatar.Group
        maxCount={2}
        maxStyle={{
          color: "blue",
          backgroundColor: "white",
        }}
      >
        {Users &&
          Users.map((e,i) => 
          <Popover key={i} content={<HoverProfile MSSV={e.MSSV} isHover={true}></HoverProfile>}>

          {/* <NavLink to={`${process.env.REACT_APP_CLIENT_URL}/profile/${e.MSSV}`}> */}

          <Avatar shape="circle" src={`${e.img}`}></Avatar>
          {/* </NavLink> */}
          </Popover>
        )
          }
      </Avatar.Group>
    </div>
  );
}
