import React, { createContext, useContext, useEffect, useState } from 'react';

// Tạo context
export const DataContext = createContext();

// DataProvider component
export const DataProvider = ({ children }) => {
  const [listWindow, setListWindow] = useState([]);
  const [listHiddenBubble, setListHiddenBubble] = useState([]);

  // Lấy dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const storedHiddenBubble = JSON.parse(localStorage.getItem("hiddenCounter"));
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

  return (
    <DataContext.Provider value={{ listWindow, setListWindow, listHiddenBubble, setListHiddenBubble }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook để sử dụng DataContext
export function useData() {
  return useContext(DataContext);
}
