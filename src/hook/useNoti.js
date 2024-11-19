import { useContext,createContext, useState  } from "react";


const NotiContext = createContext();

export const NotiProvider = ({children}) => {
  const [NotiText, setNotiText] = useState({});
  return <NotiContext.Provider value={{NotiText,setNotiText}}>{children}</NotiContext.Provider>;
};
const useNoti = () => {
  return useContext(NotiContext);
};
export default useNoti;
