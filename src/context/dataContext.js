import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "../hook/useAuth";
import { getConversation } from "../components/conversation/getConversation";
import { getInforByUserID } from "../function/getApi";
import UseToken from "../hook/useToken";

// Tạo context
export const DataContext = createContext();

// DataProvider component
export const DataProvider = ({ children }) => {
  const {AccessToken}=UseToken()
  const [listWindow, setListWindow] = useState([]);
  const [listHiddenBubble, setListHiddenBubble] = useState([]);
  const [ConversationContext, setConversationContext] = useState([]);
  const [Conversations, setConversations] = useState();
  const [Users, setUsers] = useState([]);
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("colorTheme") === "true"
  );
  const [LoadingConver, setLoading] = useState(false);
  const { auth } = useAuth();
  useEffect(() => {
    console.log(ConversationContext);
  }, [ConversationContext]);
  useEffect(() => {
    const storedHiddenBubble = JSON.parse(
      localStorage.getItem("hiddenCounter")
    );
    if (storedHiddenBubble) {
      setListHiddenBubble(storedHiddenBubble);
    }

    const storedWindow = JSON.parse(localStorage.getItem("counter"));
    if (storedWindow) {
      setListWindow(storedWindow);
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi listWindow thay đổi
  useEffect(() => {
    localStorage.setItem("counter", JSON.stringify(listWindow));
  }, [listWindow]);

  // Lưu dữ liệu vào localStorage khi listHiddenBubble thay đổi
  useEffect(() => {
    localStorage.setItem("hiddenCounter", JSON.stringify(listHiddenBubble));
  }, [listHiddenBubble]);
  useEffect(() => {
    console.log(auth);
    if (auth) {
      const res = async () => {
        setLoading(true);
        const data = await getConversation(auth,AccessToken);
        const storedHiddenBubble = JSON.parse(
          localStorage.getItem("hiddenCounter")
        );
        const storedWindow = JSON.parse(localStorage.getItem("counter"));
        const mergen = [...storedHiddenBubble, ...storedWindow];
        const update = data.map(async (e) => {
          let id = e.user1 === auth.userID ? e.user2 : e.user1;
          // const hehe = await getInforByUserID(id);
          return {
            ...e,
            img: e.cutImg ||e.img,
            Name: e.Name,
            MSSV: id,
          };
        });
        const promies = await Promise.all(update);
        if (mergen.length > 0) {
          const index = promies.filter((e) =>
            mergen.some((v) => v.id === e.id)
          );
          setConversationContext(index);
        }
        setConversations(promies);
        setLoading(false);
      };
      res();
    } else {
      setConversationContext([]);
      setConversations([]);
    }
  }, [auth]);
  return (
    <DataContext.Provider
      value={{
        listWindow,
        setListWindow,
        listHiddenBubble,
        setListHiddenBubble,
        ConversationContext,
        setConversationContext,
        Conversations,
        setConversations,
        Users,
        setUsers,
        LoadingConver,
        themeColor,
        setThemeColor,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook để sử dụng DataContext
export function useData() {
  return useContext(DataContext);
}
