import React, { useEffect, useState } from "react";
import { fetchApiRes } from "../../function/getApi";
import { Avatar, List, Popover } from "antd";
import { NavLink } from "react-router-dom";
import UserProfile from "../UserProfile/userProfile";
import HoverProfile from "../UserProfile/hoverProfile";

export default function GerenalFriendComponent(props) {
  const [Users, setUsers] = useState(props.listGerenal);
  useEffect(() => {
    
    console.log(props)
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
          Users.map((e, i) => (
            <Popover
              key={i}
              content={
                <>
               <UserProfile MSSV={e.MSSV} isHover={true}></UserProfile>
                </>
              }
            >
              {e.user2_mask}
              <Avatar shape="circle" src={`${e.img}`}></Avatar>
            </Popover>
          ))}
      </Avatar.Group>
    </div>
  );
}
