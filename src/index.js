import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authProvider";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ActiveSectionContextProvider } from "./context/ActiveSectionContextProvider";
import { SocketProvider } from "./context/socketContext";
import { WindowChatProvider } from "./context/windowChatContext";
import { DataProvider } from "./context/dataContext";
import { SessionProvider } from "./context/sectionProvider";

document.title = "Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ActiveSectionContextProvider>
    <AuthProvider>
      <SessionProvider>
        <DataProvider>
          <SocketProvider>
            <BrowserRouter>
              <App></App>
            </BrowserRouter>
          </SocketProvider>
        </DataProvider>
      </SessionProvider>
    </AuthProvider>
  </ActiveSectionContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
