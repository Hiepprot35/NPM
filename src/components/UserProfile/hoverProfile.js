import { useEffect, useState } from "react";

import { Layout } from "antd";
import UserProfile from "./userProfile";
import "./userProfile.css";

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
            <UserProfile
              className="userProfile"
              fontSize="1rem"
              // MSSV={UserInfo.MSSV}
              hover={true}
            ></UserProfile>
          )}
        </div>
      </div>

    </>
  );
}
