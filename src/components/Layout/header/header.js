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

  useEffect(() => {
    if (socket && auth?.userID) {
      const handleMessage = async (data) => {
        if (data.sender_id !== auth?.userID) {
          const obj = { ...data?.conversation };
          setListHiddenBubble((prev) => prev.filter((e) => e.id !== obj.id));
          const conversationExists = listWindow.some(
            (item) => item.id === obj.id
          );
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
    document.documentElement.classList.toggle("dark");
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
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHeader(currentScrollY < lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const typeMoviesRef = useOutsideClick(() => setShowGenres(false));
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full flex justify-center py-3">
        <div className="relative w-[90%] bg-white text-black rounded-full shadow-lg px-8 py-3">
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center space-x-6">
              {Clock && city && (
                <div className="flex items-center space-x-4 text-sm">
                  <div>
                    <p className="text-xl">{Clock.day + ", " + Clock.month}</p>
                    <p className="uppercase font-semibold">{city}</p>
                  </div>
                  <div className="flex items-center justify-between text-2xl space-x-4">
                    <div>
                      {Clock?.h}:{Clock?.m}
                    </div>

                    <div className="flex items-center space-x-2 text-base">
                      <p>{weather.temp}°C</p>
                      <img
                        src={weather.icon}
                        alt={weather.weather || "weather"}
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Link */}
              <ul className="flex items-center space-x-6">
                {header_Student
                  .filter(
                    (element) =>
                      element.role.includes(auth.role) && element.return
                  )
                  .map((element, index) => (
                    <li key={index}>
                      <NavLink
                        to={element.hash}
                        className={`text-xl font-medium ${
                          element.hash === props.hash
                            ? "text-blue-600 underline"
                            : "text-gray-800 hover:underline"
                        }`}
                      >
                        {element.name}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </div>

            {/* CENTER */}
            <NavLink to="/">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
              >
                KiSocical
              </motion.p>
            </NavLink>

            {/* RIGHT */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Popover content={<p>Search</p>}>
                <div className="relative center" ref={refSearchButton}>
                  <input
                    onChange={debouncedHandleSearch}
                    placeholder="Search everything"
                    className="px-4 py-1 w-52 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  />
               
                  <div className="absolute left-0 top-full">
                    <Search query={SearchQuery} />
                  </div>
                </div>
              </Popover>

              {/* Theme Toggle */}
              <Popover content={<p>{themeColor ? "Light" : "Dark"}</p>}>
                <button
                  onClick={ChangeColorTheme}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                >
                  {themeColor ? <FiMoon /> : <FiSunrise />}
                </button>
              </Popover>

              {/* Message */}
              <Popover
                trigger="click"
                placement="bottomRight"
                content={
                  <div className="w-80 max-h-[60vh] overflow-y-auto p-2">
                    <h1 className="text-lg font-semibold mb-2">
                      Conversations
                    </h1>
                    <input
                      placeholder="Search for friends"
                      className="w-full px-2 py-1 mb-2 border rounded"
                    />
                    {Conversations?.length > 0 ? (
                      Conversations.map((c) => (
                        <div key={c.id} className="py-1">
                          <Conversation
                            conversation={c}
                            currentUser={auth.userID}
                          />
                        </div>
                      ))
                    ) : (
                      <p>Loading...</p>
                    )}
                    <div className="text-center mt-2">
                      <NavLink
                        to={`${process.env.REACT_APP_CLIENT_URL}/message`}
                        className="text-blue-600 hover:underline"
                      >
                        View more
                      </NavLink>
                    </div>
                  </div>
                }
              >
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                  <FiMessageCircle />
                </button>
              </Popover>

              {/* Friends */}
              <Popover trigger="click" content={<FriendList />}>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                  <FiUser />
                </button>
              </Popover>

              <BellTable />

              {/* Auth */}
              {isLoading ? (
                <IsLoading />
              ) : auth.userID ? (
                <Popover trigger="click" content={content}>
                  {myInfor?.avtUrl ? (
                    <img
                      src={myInfor.avtUrl}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 loader" />
                  )}
                </Popover>
              ) : (
                <div className="flex items-center space-x-2">
                  <NavLink
                    to="/login"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default memo(Header);
