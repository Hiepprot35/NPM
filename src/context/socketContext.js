// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [UsersOnline,setUserOnline]=useState()
  useEffect(() => {
    const url=`${process.env.REACT_APP_DB_HOST}`
    const newSocket = io(url);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (data) => {
        setUserOnline(data);
      });
    }
    return () => {
      if (socket) {
        socket.off("disconnect");
      }
    };
  }, [socket]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
