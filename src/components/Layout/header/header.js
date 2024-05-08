import { Controls, Player } from "@lottiefiles/react-lottie-player";
import React, { memo, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSocket } from "../../../context/socketContext";
import { getStudentInfoByMSSV } from "../../../function/getApi";
import { getUserinfobyID } from "../../../function/getApi";
import useAuth from "../../../hook/useAuth";
import { header_Student } from "../../../lib/data";
import { IsLoading } from "../../Loading";
import BellTable from "../../Notification/bellTable";
import { LogOut } from "../../logout";
import "./header.css";
import { FiMoon, FiSearch, FiSettings, FiSun } from "react-icons/fi";
import SettingComponent from "../../setting/SettingComponent";
import { Button, Input, Popover } from "antd";
function Header(props) {
  const socket = useSocket();
  const [weather, setWeather] = useState({
    city: "",
    weather: "clear",
    temp: "",
    icon: "",
    country: "",
  });
  const Menu_profile_header = useRef();
  const [city, setCity] = useState("hanoi");
  const { auth, setAuth } = useAuth();
  const [chooseHeader, setChooseHeader] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();
  const apiKey = "5b629bb0f5f840b7965193241241704";
  // const bufferString = user2 ? Buffer.from(user2.img).toString('base64') : "11111";
  const cityInputRef = useRef(null); // Tạo một tham chiếu useRef
  const host = process.env.REACT_APP_DB_HOST;

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", auth.userID);
    }
    return () => {
      if (socket) {
        socket.off("disconnect");
      }
    };
  }, [socket]);
  const updateTitle = async (id) => {
    const username = await getUserinfobyID(parseInt(id));
    const nameSV = await getStudentInfoByMSSV(username.username);
    document.title = `${nameSV.Name} gửi tin nhắn`;
  };
  useEffect(() => {
    let isMounted = true;
    if (socket && isMounted) {
      socket.on("getMessage", (data) => {
        if (data.sender_id !== auth.userID) {
          updateTitle(data.sender_id);
        }
      });
    }

    return () => {
      isMounted = false;
      if (socket && isMounted) {
        socket.disconnect();
      }
    };
  }, [socket]);
  const [avt, setAvt] = useState();
  useEffect(() => {
    let isMounted = true;
    const tempApi = async (city) => {
      const URL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=HaNoi&aqi=no
      `;
      try {
        const temRes = await fetch(URL);
        if (temRes.ok && isMounted) {
          const tem = await temRes.json();
          setWeather({
            city: tem.location.name,
            weather: tem.current.condition.text,
            temp: tem.current.temp_c,
            icon: tem.current.condition.icon,

            country: tem.location.country,
          });
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    tempApi(city);
    return () => {
      isMounted = false;
    };
  }, [city]);
  useEffect(() => {
    if (auth) {
      const studentInfo = async () => {
        const URL = `${host}/api/getStudentbyID/${auth.username}`;
        try {
          const studentApi = await fetch(URL);

          const student = await studentApi.json();
          if (student) {
            setUser(student);
            // setAuth({ ...auth });
          }

          setIsLoading(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      };
      studentInfo();
    }
  }, []);
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem("colorTheme") === "true"
  );

  const ChangeColorTheme = (event) => {
    setPrimaryColor(!primaryColor);
  };
  const refSearchButton = useRef();
  const searchHnadleShow = () => {
    if (refSearchButton.current) {
      refSearchButton.current.classList.toggle("activeSearch");
    }
  };
  const content = () => {
    return (
      <div className="Menu_profile_header " ref={Menu_profile_header}>
        <div className="avatar_link">
          <div className="hover" style={{ borderRadius: "1rem" }}>
            <a className="Menu_a_link_profile " href={`/profile/${user.MSSV}`}>
              <div className="avatar_name">
                <img
                  src={user?.img ? `${user.img}` : `${auth.avtUrl}`}
                  alt="User Avatar"
                  className="avatarImage"
                />
                <span>
                  <p className="hiddenEllipsis">
                    {user?.Name || auth.username}
                  </p>
                </span>
              </div>
            </a>
          </div>

          <div className="ShowAll_User"></div>
        </div>
        <NavLink to={`/setting`}>
          <SettingComponent
            icon={<FiSettings></FiSettings>}
            text={"Cài đặt thông tin"}
          />
        </NavLink>
        {primaryColor ? (
          <SettingComponent
            icon={<FiSun></FiSun>}
            text={"Light"}
            onClick={ChangeColorTheme}
          ></SettingComponent>
        ) : (
          <SettingComponent
            icon={<FiMoon></FiMoon>}
            text={"Dark"}
            onClick={ChangeColorTheme}
          ></SettingComponent>
        )}
        <LogOut />
      </div>
    );
  };
  useEffect(() => {
    localStorage.setItem("colorTheme", primaryColor);
    document.documentElement.style.setProperty(
      "--themeColor",
      `${primaryColor ? "rgb(24,25,26)" : "white"}`
    );
    document.documentElement.style.setProperty(
      "--textColor",
      `${!primaryColor ? "rgb(24,25,26)" : "white"}`
    );
  }, [primaryColor]);

  useEffect(() => {
    setAvt(auth.avtUrl);
  }, []);
  return (
    <>
      <div className="header_user center">
        <div className="header_container">
          <div>
            <ul className="list">
              <li>
                <NavLink to="/">
                  <Player
                    autoplay
                    speed={1}
                    src="https://lottie.host/c775397d-d0b4-434c-b084-489acbe2d17b/CpkFsQb8HX.json"
                    style={{ height: "60px", width: "60px" }}
                  >
                    <Controls
                      visible={false}
                      buttons={["play", "repeat", "frame", "debug"]}
                    />
                  </Player>
                </NavLink>
              </li>
              <li>
                <div className="center TempText">
                  <img
                    style={{ width: "2rem", height: "2rem" }}
                    src={`${weather.icon}`}
                    alt={weather.weather}
                  />
                  <p className="City citytemp"> {weather.temp}°C</p>
                </div>
              </li>
              {header_Student
                .filter(
                  (element) =>
                    element.role.includes(auth.role) && element.return
                )
                .map((element, index) => (
                  <li
                    key={index}
                    className={`hrefLink ${
                      element.hash === props.hash ? "ActiveLink" : "notActive"
                    }`}
                  >
                    <NavLink
                      to={element.hash}
                      className="Link"
                      onClick={() => setChooseHeader(element.name)}
                    >
                      {element.name}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
          <div className="header_home_user">
            <div className=" searchInput" ref={refSearchButton}>
          
                {/* <Input size="large"></Input> */}
                <input placeholder="Search everything"></input>
                <div onClick={searchHnadleShow} className="circleButton">
                <FiSearch></FiSearch>
              </div>
            </div>
            <BellTable></BellTable>
            {isLoading ? (
              <IsLoading />
            ) : (
              <>
                {user && (
                  <>
                    <div className="">
                      {
                        <Popover
                          color="none"
                          trigger={"click"}
                          content={content}
                        >
                          <img
                            className="avatarImage"
                            src={user?.img ? `${user.img}` : `${auth.avtUrl}`}
                            alt="User Avatar"
                          />
                        </Popover>
                      }
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default memo(Header);
