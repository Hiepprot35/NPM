import { FaUserCircle } from "react-icons/fa";
import { MdPrivateConnectivity, MdPublic } from "react-icons/md";

export const typeSharePost = {
  PRIVATE: 0,
  FRIEND: 1,
  PUBLIC: 2,
};


export const shareType = [
  {
    value: 2,
    name: "public",
    icon: <MdPublic />,
  },
  {
    value: 1,
    name: "friend",
    icon: <FaUserCircle />,
  },
  {
    value: 0,
    name: "private",
    icon: <MdPrivateConnectivity />,
  },
];