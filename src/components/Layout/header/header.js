import { Controls, Player } from "@lottiefiles/react-lottie-player";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink } from "react-router-dom";
import { useSocket } from "../../../context/socketContext";
import { getStudentInfoByMSSV } from "../../../function/getApi";
import { IoLogoGoogle } from "react-icons/io";

import { getUserinfobyID } from "../../../function/getApi";
import useAuth from "../../../hook/useAuth";
import { header_Student } from "../../../lib/data";
import { IsLoading } from "../../Loading";
import BellTable from "../../Notification/bellTable";
import { LogOut } from "../../logout";
import { motion } from "framer-motion";
import "./header.css";
import {
  FiArrowDown,
  FiChevronDown,
  FiMoon,
  FiSearch,
  FiSettings,
  FiSun,
  FiSunrise,
  FiUser,
} from "react-icons/fi";
import SettingComponent from "../../setting/SettingComponent";
import { Button, Input, Popover } from "antd";
import { LoginGoolge } from "../../login/login";
import { useData } from "../../../context/dataContext";
import { genresList } from "../../home/MovieFilms";
import Search from "./Search";
import _, { debounce } from "lodash";
import { useOutsideClick } from "../../../hook/useOutsideClick";
import { TextAnimetion } from "../../home/Slide";
import { Span, Text } from "../../home/listPlay";
import FriendList from "../../home/friend";
function Header(props) {
  const socket = useSocket();
  const [weather, setWeather] = useState({
    city: "",
    weather: "clear",
    temp: "",
    icon: "",
    country: "",
  });
  const { setListWindow } = useData();
  const Menu_profile_header = useRef();
  const [city, setCity] = useState("hanoi");
  const { auth, setAuth } = useAuth();
  const [chooseHeader, setChooseHeader] = useState();
  const [GenresList, setGenresList] = useState();
  const [showGenres, setShowGenres] = useState(false);
  const data = async () => {
    const data2 = await genresList();
    setGenresList(data2);
  };
  useEffect(() => {
    data();
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();
  const apiKey = "5b629bb0f5f840b7965193241241704";
  const host = process.env.REACT_APP_DB_HOST;
  const sidebar = {
    open: {
      clipPath: "inset(0% 0% 0% 0% round 10px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.7,
        delayChildren: 0.03,
        staggerChildren: 0.05,
      },
    },
    closed: {
      clipPath: "inset(10% 50% 90% 50% round 10px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3,
      },
    },
  };
  useEffect(() => {
    if (socket) {
      socket.emit("addUser", auth?.userID);
    }
    return () => {
      if (socket) {
        socket.off("disconnect");
      }
    };
  }, [socket, auth]);
  const updateTitle = async (id) => {
    const username = await getUserinfobyID(parseInt(id));
    const nameSV = await getStudentInfoByMSSV(username?.username);
    document.title = `${nameSV.Name} gửi tin nhắn`;
  };

  const itemVariants = {
    open: {
      zIndex: 2,
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { zIndex: 0, opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    let isMounted = true;
    if (socket && isMounted) {
      socket.on("getMessage", (data) => {
        if (data.sender_id !== auth.userID) {
          setListWindow((prev) => {
            const exists = prev.some(
              (item) => item.id === data.conversation_id
            );

            if (!exists) {
              return [
                ...prev,
                {
                  id: data.conversation_id,
                  user1: data.sender_id,
                  user2: data.receiverId,
                },
              ];
            }
            return prev;
          });

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
          console.log(student);
          if (student) {
            setUser(student);
          }

          setIsLoading(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      };
      studentInfo();
    }
  }, [auth]);
  const [SearchQuery, setSearchQuery] = useState("");
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem("colorTheme") === "true"
  );

  const ChangeColorTheme = (event) => {
    setPrimaryColor(!primaryColor);
  };
  const refSearchButton = useRef();
  const searchHandle = () => {
    if (refSearchButton.current) {
      refSearchButton.current.classList.toggle("activeSearch");
    }
  };
  const searchQueryHandle = (e) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    console.log(SearchQuery);
  }, [SearchQuery]);
  const debouncedHandleSearch = useCallback(
    debounce(searchQueryHandle, 500),
    []
  );

  const content = () => {
    return (
      <div className="Menu_profile_header " ref={Menu_profile_header}>
        <div className="avatar_link">
          <NavLink
            className="Menu_a_link_profile "
            to={`/profile/${user?.MSSV}`}
          >
            <div className="avatar_name hover">
              <img
                src={`${auth.avtUrl}`}
                alt="User Avatar"
                className="avatarImage"
              />
              <span>
                <p className="hiddenEllipsis">{user?.Name}</p>
              </span>
            </div>
          </NavLink>

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

  const typeMoviesRef = useOutsideClick(() => setShowGenres(false));
  return (
    <>
      <div className="header_user center">
        <div className="header_container">
          <div className="rightHeader" style={{ width: "30%" }}>
            <ul className="list">
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
              <li>
                <div className="geresList">
                  <div
                    ref={typeMoviesRef}
                    onClick={() => setShowGenres((pre) => !pre)}
                    className="center"
                  >
                    <span>Thể loại</span>
                    {
                      <span
                        className="chevron"
                        style={
                          showGenres
                            ? {
                                transform: "rotate(180deg)",
                                marginTop: "-.2rem",
                              }
                            : {}
                        }
                      >
                        <FiChevronDown></FiChevronDown>
                      </span>
                    }
                  </div>
                  {
                    <motion.div
                      variants={sidebar}
                      animate={showGenres ? "open" : "closed"}
                      className="genres"
                    >
                      {GenresList &&
                        GenresList.map((e, i) => (
                          <a
                            key={i}
                            href={`${process.env.REACT_APP_CLIENT_URL}/films/?id=${e.id}&type=${e.name}`}
                            style={{ color: "white" }}
                          >
                            <motion.div
                              key={i}
                              variants={itemVariants}
                              className="Pergenres center hover"
                            >
                              {e.name}
                            </motion.div>
                          </a>
                        ))}
                    </motion.div>
                  }
                </div>
              </li>
            </ul>
          </div>
          <div className="center">
            <NavLink to="/">
              <motion.p
                initial={{ opacity: 0, x: -200, transition: { duration: 1 } }}
                animate={{ opacity: 1, x: 0, transition: { duration: 1 } }}
                className="homeText"
              >
                TuanHiep
              </motion.p>
            </NavLink>
          </div>
          <div className="header_home_user" style={{ width: "30%" }}>
            <div
              className=" searchInput"
              style={{ margin: "1rem" }}
              ref={refSearchButton}
            >
              <input
                onChange={debouncedHandleSearch}
                placeholder="Search everything"
              ></input>
              <div onClick={searchHandle} className="circleButton">
                <FiSearch></FiSearch>
              </div>
              {
                <div
                  style={{ position: "absolute", top: "100%", left: "1rem" }}
                >
                  <Search query={SearchQuery}></Search>
                </div>
              }
            </div>
            {
              <div className="h-8 w-8 overflow-hidden">
                <div
                  className="h-32 transition-all ease-linear duration-300"
                  style={
                    primaryColor
                      ? { transform: "translateY(-2rem)" }
                      : { transform: "translateY(0)" }
                  }
                >
                  <span
                    className="circleButton transition-all ease-linear duration-300 m-0"
                    style={primaryColor ? { opacity: 0 } : { opacity: 1 }}
                    onClick={ChangeColorTheme}
                  >
                    <FiSunrise></FiSunrise>
                  </span>
                  <span
                    className="circleButton transition-all ease-linear duration-300 m-0"
                    style={primaryColor ? { opacity: 1 } : { opacity: 0 }}
                    onClick={ChangeColorTheme}
                  >
                    <FiMoon></FiMoon>
                  </span>
                </div>
              </div>
            }
            <Popover
              trigger="click"
              title={<p>Users</p>}
              content={<FriendList></FriendList>}
            >
              <div className="circleButton">
                <FiUser></FiUser>
              </div>
            </Popover>
            <BellTable></BellTable>

            {isLoading ? (
              <IsLoading />
            ) : (
              <>
                {auth.userID ? (
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
                            src={`${auth.avtUrl}`}
                            alt="User Avatar"
                          />
                        </Popover>
                      }
                    </div>
                  </>
                ) : (
                  <>
                    <LoginGoolge>
                      <span className="circleButton">
                        <IoLogoGoogle />
                      </span>
                    </LoginGoolge>
                    <p>OR</p>
                    <span> </span>
                    <NavLink style={{ padding: "1rem" }} to="/login">
                      <p>Login</p>
                    </NavLink>
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
