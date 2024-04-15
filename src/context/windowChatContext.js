// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const WindowChatContext = createContext();

export function WindowChatProvider({ children }) {
  const [windowChat, setWindowChat] = useState([]);

  return (
    <WindowChatContext.Provider value={{ windowChat, setWindowChat }}>
      {children}
    </WindowChatContext.Provider>
  );
}

export function useWindowChat() {
  return useContext(WindowChatContext);
}
