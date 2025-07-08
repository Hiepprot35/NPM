import React from "react";
import { FiMessageCircle, FiHome } from "react-icons/fi";
import { IconsManifest } from "react-icons/lib";
import { MdOutlinePrivateConnectivity, MdOutlinePublic } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
export const debounce = (fn, delay) => {
  let timeId;
  return () => {
    if (timeId) {
      clearTimeout(timeId);
      timeId = null;
    }
    timeId = setTimeout(() => {
      fn();
    }, delay);
  };
};

