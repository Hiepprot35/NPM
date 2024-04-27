import { createContext, useState,useContext } from "react";

const SessionContext = createContext({});

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState();

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    )
}
export const useSession = () => {
    return useContext(SessionContext);
}

// export default SessionContext;