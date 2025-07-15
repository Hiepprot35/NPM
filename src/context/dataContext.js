import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "../hook/useAuth";
import { fetchApiRes, getInforByUserID } from "../function/getApi";
import { isArray } from "lodash";

// Tạo context
export const DataContext = createContext();

// DataProvider component
export const DataProvider = ({ children }) => {
  const [listWindow, setListWindow] = useState([]);
  const [listHiddenBubble, setListHiddenBubble] = useState([]);
  const [ConversationContext, setConversationContext] = useState([]);
  const [Conversations, setConversations] = useState([]);
  const [Users, setUsers] = useState([]);
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("colorTheme") === "true"
  );
  const [LoadingConver, setLoading] = useState(false);
  const { auth } = useAuth();

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

  useEffect(() => {
    localStorage.setItem("counter", JSON.stringify(listWindow));
  }, [listWindow]);

  useEffect(() => {
    localStorage.setItem("hiddenCounter", JSON.stringify(listHiddenBubble));
  }, [listHiddenBubble]);

  useEffect(() => {
    if (Object.keys(auth).length > 0) {
      const res = async () => {
        setLoading(true);

        const storedHiddenBubble = JSON.parse(
          localStorage.getItem("hiddenCounter")
        );
        const storedWindow = JSON.parse(localStorage.getItem("counter")) || [];
        const merged = [...storedHiddenBubble, ...storedWindow];

        const mergedIds = merged.map((e) => e.id);

        const params = new URLSearchParams();
        mergedIds.forEach((id) => params.append("id", id));

        const { result: data } = await fetchApiRes(
          `conversations?${params.toString()}`,
          "GET"
        );

        if (isArray(data)) {
          const update = data.map(async (e) => {
            let id = e.user1 === auth.userID ? e.user2 : e.user1;
            // const hehe = await getInforByUserID(id);
            return {
              ...e,
              img: e.cutImg || e.img,
              Name: e.Name,
              MSSV: id,
            };
          });
          const promies = await Promise.all(update);
          if (merged.length > 0) {
            const index = promies.filter((e) =>
              merged.some((v) => v.id === e.id)
            );
            setConversationContext(index);
          }
          setConversations(promies);
        }
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
