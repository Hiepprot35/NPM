import React, { createContext, useState, useContext } from 'react';

// Tạo context
const CurrentCommentContext = createContext();

// Tạo provider để bao quanh các component
export function CurrentCommentProvider({ children }) {
  const [currentComment, setCurrentComment] = useState(null);

  return (
    <CurrentCommentContext.Provider value={{ currentComment, setCurrentComment }}>
      {children}
    </CurrentCommentContext.Provider>
  );
}

// Hook để sử dụng context dễ dàng hơn
export function useCurrentComment() {
  return useContext(CurrentCommentContext);
}
