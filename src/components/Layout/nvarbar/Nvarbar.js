import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FiCoffee, FiEdit, FiTag, FiTrendingUp, FiUsers } from "react-icons/fi";
import { useData } from "../../../context/dataContext";
import { useSession } from "../../../context/sectionProvider";
import MessageMainLayout from "../../message/messageMainLayout";
import Windowchat from "../../message/windowchat";
import "./nvarbar.css";
export default function Nvarbar(props) {
  const { session } = useSession();
  const { ConversationContext } = useData();

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const sidebar = {
    open: {
      clipPath: "inset(0% 0% 0% 0% round 1rem)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.1,
        delayChildren: 0.3,
        staggerChildren: 0.05,
      },
    },
    closed: {
      clipPath: "inset(10% 50% 90% 50% round 1rem)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.1,
      },
    },
  };
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
      `${ShowNvaBar ? "80vw" : "100vw"}`
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
  useEffect(() => {
    console.log(ConversationContext);
  }, [ConversationContext]);

  return (
    <div className="w-full">
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
      <motion.div
        animate={ShowNvaBar ? "open" : "closed"}
        variants={sidebar}
        className="leftHome"
      >
        <div className="newFeed h-auto">
          <span>
            <p className="text-4xl font-semibold">New feed</p>
          </span>
          {newFeed.map((e, i) => (
            <motion.a variants={itemVariants} href={`${e.href}`} key={i}>
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
            </motion.a>
          ))}
        </div>

        <div className="h-3/4">
          <div className="center" style={{ margin: "1rem" }}>
            <div className="linear"></div>
          </div>
          {/* <MessageMainLayout /> */}
        </div>
      </motion.div>
   
      <div className="newMessage center">
        <span>
          <FiEdit></FiEdit>
        </span>
      </div>
    </div>
  );
}
