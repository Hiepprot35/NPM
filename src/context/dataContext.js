import React, { createContext, useContext, useEffect, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [listWindow, setListWindow] = useState([]);
  const [listHiddenBubble, setListHiddenBubble] = useState([]);
  useEffect(() => {
    if (listWindow) {
      localStorage.setItem("counter", JSON.stringify(listWindow));
    }
  }, [listWindow]);
  useEffect(() => {
    if (listHiddenBubble)
      localStorage.setItem("hiddenCounter", JSON.stringify(listHiddenBubble));
  }, [listHiddenBubble]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("hiddenCounter"));
    if (data !== null) {
      setListHiddenBubble(data);
    }
  }, []);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("counter"));
    if (data !== null) {
      setListWindow(data);
    }
  }, []);
  return (
    <DataContext.Provider value={{ listWindow, setListWindow, listHiddenBubble, setListHiddenBubble }}>
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  return useContext(DataContext);
}
