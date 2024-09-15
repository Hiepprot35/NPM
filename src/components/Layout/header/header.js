import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { IoLogoGoogle } from "react-icons/io";
import { NavLink, Outlet } from "react-router-dom";
import { useSocket } from "../../../context/socketContext";
import { fetchApiRes } from "../../../function/getApi";

import { Popover } from "antd";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import {
  FiChevronDown,
  FiMessageCircle,
  FiMoon,
  FiSearch,
  FiSettings,
  FiSun,
  FiSunrise,
  FiUser,
} from "react-icons/fi";
import { useData } from "../../../context/dataContext";
import { Month } from "../../../function/getTime";
import useAuth from "../../../hook/useAuth";
import { useOutsideClick } from "../../../hook/useOutsideClick";
import { header_Student } from "../../../lib/data";
import { IsLoading } from "../../Loading";
import BellTable from "../../Notification/bellTable";
import Conversation from "../../conversation/conversations";
import { genresList } from "../../home/MovieFilms";
import FriendList from "../../home/friend";
import { Image } from "../../home/home";
import { LoginGoolge } from "../../login/login";
import { LogOut } from "../../logout";
import SettingComponent from "../../setting/SettingComponent";
import Search from "./Search";
import "./header.css";
import { RouteLink } from "../../../lib/link";
function Header(props) {
  const socket = useSocket();
  const [weather, setWeather] = useState({
    city: "",
    weather: "clear",
    temp: "",
    icon: "",
    country: "",
  });
  const {
    setListWindow,
    setListHiddenBubble,
    listWindow,
    setConversationContext,
    Conversations,
    themeColor,
    setThemeColor,
  } = useData();
  const Menu_profile_header = useRef();
  const [city, setCity] = useState("hanoi");
  const { auth, setAuth, myInfor } = useAuth();
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
    if (socket && auth?.userID) {
      socket.emit("addUser", auth?.userID);
    }
    return () => {
      if (socket) {
        socket.off("disconnect");
      }
    };
  }, [socket, auth]);
  const updateTitle = async (id) => {
    console.log("id");
    document.title = `${id} gửi tin nhắn`;
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
  const foundConversation = async (user1, user2) => {
    const conversations = await fetchApiRes("message/getConversation", "POST", {
      user1: user1,
      user2: user2,
    });
    // const conversations=await getConversation(auth)
    if (conversations.result.length > 0) {
      return conversations.result[0];
    }
  };

  useEffect(() => {
    if (socket && auth?.userID) {
      const handleMessage = async (data) => {
        if (data.sender_id !== auth?.userID) {
          const obj = { ...data?.conversation };
          setListHiddenBubble((prev) => prev.filter((e) => e.id !== obj.id));
          console.log(obj);

          const conversationExists = listWindow.some(
            (item) => item.id === obj.id
          );
          console.log(conversationExists);

          if (!conversationExists) {
            setListWindow((prev) => [...prev, { id: obj.id }]);
          }

          setConversationContext((prev) => {
            const updatedConversations = prev.filter((e) => e.id !== obj.id);
            updatedConversations.push(obj);
            return updatedConversations;
          });

          updateTitle(
            obj.user1 === auth.userID ? obj.user2_mask : obj.user1_mask
          );
        }

        // Play notification sound after user interaction
        try {
          const playNotification = () => {
            const audio = new Audio("/notifi.mp3");
            audio.play().catch((error) => {
              console.error("Audio playback failed:", error);
            });
          };

          // Check if user has interacted with the document
          if (document.body.userHasInteracted) {
            playNotification();
          } else {
            // Add event listener for first interaction
            const enableAudio = () => {
              document.body.userHasInteracted = true;
              playNotification();
              document.removeEventListener("click", enableAudio); // Remove listener after interaction
            };
            document.addEventListener("click", enableAudio);
          }
        } catch (error) {
          console.log("Error playing notification sound:", error);
        }
      };

      socket.on("getMessage", handleMessage);

      return () => {
        socket.off("getMessage", handleMessage);
      };
    }
  }, [socket, auth]);

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
  const [SearchQuery, setSearchQuery] = useState("");

  const ChangeColorTheme = (event) => {
    setThemeColor((pre) => !pre);
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
            to={`${RouteLink.profileLink}/${myInfor?.UserID}`}
          >
            <div className="avatar_name hover">
              <Image
                loading={!myInfor?.avtUrl}
                src={`${myInfor?.avtUrl}`}
                alt="User Avatar"
                className="avatarImage"
              />
              <span>
                <p className="hiddenEllipsis">{myInfor?.Name}</p>
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
        {themeColor ? (
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
    localStorage.setItem("colorTheme", themeColor);
    document.documentElement.style.setProperty(
      "--themeColor",
      `${themeColor ? "rgb(24,25,26)" : "white"}`
    );
    document.documentElement.style.setProperty(
      "--textColor",
      `${!themeColor ? "rgb(24,25,26)" : "white"}`
    );
  }, [themeColor]);
  const [Clock, setClock] = useState();
  useEffect(() => {
    console.log(auth);
  }, [auth]);
  useEffect(() => {
    const intel = setInterval(() => {
      const showTime = new Date();
      const day = showTime.getDate();
      const month = showTime.getMonth();
      const h = showTime.getHours().toString().padStart(2, "0");
      const m = showTime.getMinutes().toString().padStart(2, "0");
      const s = showTime.getSeconds().toString().padStart(2, "0");
      setClock({ month: month + 1, day: day, h: h, m: m, s: s });
    }, [1000]);
    return () => {
      clearInterval(intel);
    };
  }, []);
  const typeMoviesRef = useOutsideClick(() => setShowGenres(false));
  return (
    <>
      <div className="header_user center">
        <div className="header_container">
          <div className="rightHeader" style={{ width: "30%" }}>
            <ul className="list">
              <li>
                {Clock && city && (
                  <div className="inline-flex TempText p-0 h-12 w-32 overflow-hidden">
                    <div className="w-64 center animationTemp">
                      <div className=" center w-32">
                        <div>
                          <p className="text-xs">
                            {Clock?.day + "," + Month(Clock?.month)}
                          </p>
                          <p className="uppercase font-semibold text-xs">
                            {city}
                          </p>
                        </div>
                        <div className=" h-full px-2">
                          <p>{Clock?.h + ":" + Clock?.m}</p>
                        </div>
                      </div>
                      <div className="center w-32">
                        <p className="City citytemp"> {weather.temp}°C</p>
                        <div className="w-8 h-8">
                          <img
                            className="w-full"
                            src={`${weather.icon}`}
                            alt={weather.weather}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
              {header_Student
                .filter(
                  (element) =>
                    element.role.includes(auth.role) && element.return
                )
                .map((element, index) => (
                  <li
                    key={index}
                    className={`hrefLink  ${
                      element.hash === props.hash ? "ActiveLink" : "notActive"
                    }`}
                  >
                    <NavLink
                      to={element.hash}
                      className="Link  font-semibold mx-4"
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
                    <span className=" font-semibold mx-4">Thể loại</span>
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
                          <NavLink
                            key={i}
                            to={`${process.env.REACT_APP_CLIENT_URL}/films/?id=${e.id}&type=${e.name}`}
                            style={{ color: "white" }}
                          >
                            <motion.div
                              key={i}
                              variants={itemVariants}
                              className="Pergenres center hover"
                            >
                              {e.name}
                            </motion.div>
                          </NavLink>
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
            <Popover content={<p>Search Films/Movies</p>}>
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
            </Popover>

            {
              <Popover
                content={
                  themeColor ? (
                    <p className="text-white">Light</p>
                  ) : (
                    <p className="text-black">Dark</p>
                  )
                }
              >
                <div className="h-8 w-8 mx-4 overflow-hidden">
                  <div
                    className="h-32 transition-all ease-linear duration-300"
                    style={
                      themeColor
                        ? { transform: "translateY(-2rem)" }
                        : { transform: "translateY(0)" }
                    }
                  >
                    <span
                      className="circleButton transition-all ease-linear duration-300 m-0"
                      style={themeColor ? { opacity: 0 } : { opacity: 1 }}
                      onClick={ChangeColorTheme}
                    >
                      <FiSunrise></FiSunrise>
                    </span>
                    <span
                      className="circleButton transition-all ease-linear duration-300 m-0"
                      style={themeColor ? { opacity: 1 } : { opacity: 0 }}
                      onClick={ChangeColorTheme}
                    >
                      <FiMoon></FiMoon>
                    </span>
                  </div>
                </div>
              </Popover>
            }

            <Popover content={<p>Message</p>}>
              <Popover
                trigger="click"
                placement="bottomRight"
                content={
                  <div className="w-30vw">
                    <h1>Đoạn chat</h1>
                    <input
                      placeholder="Search for friends"
                      className="chatMenuInput"
                    />
                    <div
                      className="overfolow-hidden  overflow-y-scroll"
                      style={{ height: "60vh" }}
                    >
                      {Conversations && Conversations.length > 0 ? (
                        Conversations.map((c, index) => (
                          <div key={c.id} className="converrsation_chat">
                            <Conversation
                              conversation={c}
                              currentUser={auth.userID}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="converrsation_chat">
                          <div className="loader"></div>
                        </div>
                      )}
                    </div>
                    <div className="center">
                      <NavLink
                        to={`${process.env.REACT_APP_CLIENT_URL}/message`}
                      >
                        <span>Xem thêm trong messages</span>
                      </NavLink>
                    </div>
                  </div>
                }
              >
                <div className="circleButton">
                  <FiMessageCircle />
                </div>
              </Popover>
            </Popover>
            <Popover content={<p>All Users</p>}>
              <Popover
                trigger={"click"}
                placement="bottomRight"
                content={<FriendList></FriendList>}
              >
                <span className="circleButton">
                  <FiUser />
                </span>
              </Popover>
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
                          align={{ offset: [-20, -10] }}
                          trigger={"click"}
                          content={content}
                        >
                          {!myInfor?.avtUrl ? (
                            <div className=" w-8 he-8 loader"></div>
                          ) : (
                            <img
                              className="avatarImage"
                              src={`${myInfor?.avtUrl}`}
                              alt="User Avatar"
                            />
                          )}
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
