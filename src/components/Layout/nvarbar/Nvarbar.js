import { Player } from "@lottiefiles/react-lottie-player";
import React, { useEffect, useRef, useState } from "react";
import {
  FiCoffee,
  FiTag,
  FiTrendingUp,
  FiUsers
} from "react-icons/fi";
import { useData } from "../../../context/dataContext";
import { useSession } from "../../../context/sectionProvider";
import { useSocket } from "../../../context/socketContext";
import BubbleConver from "../../conversation/bubbleConver";
import MessageMainLayout from "../../message/messageMainLayout";
import Windowchat from "../../message/windowchat";
import "./nvarbar.css";
export default function Nvarbar() {
  const { session, setSession } = useSession();
  const {socket}=useSocket()
  const { listWindow,listHiddenBubble } = useData();
  const [Conver, setConver] = useState(listHiddenBubble.concat(listWindow));
  useEffect(() => {
    setConver(listHiddenBubble.concat(listWindow))
  }, [listHiddenBubble,listWindow]);
  const newFeed = [
    {
      title: "Trending",
      href: `${process.env.REACT_APP_CLIENT_URL}/home#trending`,
      icon: <FiTrendingUp></FiTrendingUp>,
    },

    {
      title: "Playlist",
      icon: <FiTag></FiTag>,
      href: `${process.env.REACT_APP_CLIENT_URL}/home#playlist`,
    },
    {
      title: "TV Series",
      href: `${process.env.REACT_APP_CLIENT_URL}/home#tvseries`,
      icon: <FiCoffee></FiCoffee>,
    },
    {
      title: "Following",
      href: `${process.env.REACT_APP_CLIENT_URL}/home#following`,

      icon: <FiUsers></FiUsers>,
    },
  ];
  const [ShowNvaBar, setShowNvaBar] = useState(true);
  const playerClose = useRef(null);
  const hiddenNvaBarRef = useRef(null);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--widthContentHome",
      `${ShowNvaBar ? "85vw" : "100vw"}`
    );
    document.documentElement.style.setProperty(
      "--opacityShow",
      `${ShowNvaBar ? "1" : "0"}`
    );
  }, [ShowNvaBar]);

  const hiddenNavBarHandle = (e) => {
    setShowNvaBar(!ShowNvaBar);
    if (playerClose.current && hiddenNvaBarRef.current) {
      hiddenNvaBarRef.current.classList.toggle("hiddenSideBar");
      playerClose.current.play();
    }
  };
  return (
    <>
      <div
        className="hiddenNvaBar circleButton  "
        onClick={(e) => hiddenNavBarHandle(e)}
        ref={hiddenNvaBarRef}
      >
        <Player
          ref={playerClose}
          autoplay
          keepLastFrame={ShowNvaBar ? true : false}
          // speed={ShowNvaBar ? -1 : 1}
          loop={false}
          src="https://lottie.host/3f0d5ae3-677f-4ccb-b291-09a9819c7dc7/Et5VQMKLZZ.json"
          style={{ height: "2rem", width: "2rem" }}
        />
      </div>
      <div className="leftHome">
        <div className="newFeed">
          <span>
            <p className="weightFont">New feed</p>
          </span>
          {newFeed.map((e, i) => (
            <a href={`${e.href}`} key={i}>
              <div
                key={i}
                className={`newFeedList ${
                  session === e.href ? "activeSection" : ""
                }`}
              >
                <span style={{ marginRight: "1rem" }}>{e.icon}</span>
                <p className="weightFont" style={{ fontSize: "1rem" }}>
                  {e.title}
                </p>
              </div>
            </a>
          ))}
        </div>
        <div className="center" style={{ margin: "1rem" }}>
          <div className="linear"></div>
        </div>
        <MessageMainLayout />
      </div>
      <div className="windowchat_container">
        {Conver &&
          Conver.map((e, i) => (
            <Windowchat
              key={e.id}
              count={e}
              index={i}
              isHidden={false}
            />
          ))}
      </div>
      <BubbleConver></BubbleConver>
    </>
  );
}
