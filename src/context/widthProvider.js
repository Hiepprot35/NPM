import { createContext, useState ,useContext} from "react";

const WidthContext = createContext({});
export const useWidth = () => {
    return useContext(WidthContext);
  };
export const WidthProvider = ({ children }) => {
    const [width, setWidth] = useState({});

    return (
        <WidthContext.Provider value={{ width, setWidth }}>
            {children}
        </WidthContext.Provider>
    )
}

export default WidthContext;