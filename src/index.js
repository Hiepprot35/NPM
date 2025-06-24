import * as process from "process";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authProvider";
import App from "./App";
import "./style.scss";
import reportWebVitals from "./reportWebVitals";
import { ActiveSectionContextProvider } from "./context/ActiveSectionContextProvider";
import { SocketProvider } from "./context/socketContext";
import { WindowChatProvider } from "./context/windowChatContext";
import { DataProvider } from "./context/dataContext";
import { SessionProvider } from "./context/sectionProvider";
import { WidthProvider } from "./context/widthProvider";
import { RealTimeContextProvider } from "./context/useRealTime";
import { CurrentCommentProvider } from "./context/CurrentComment";
import { NotiProvider } from "./hook/useNoti";

document.title = "Login";
window.global = window;
window.process = process;
window.Buffer = [];
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <NotiProvider>
      <DataProvider>
        <ActiveSectionContextProvider>
          <SessionProvider>
            <SocketProvider>
              <RealTimeContextProvider>
                <WidthProvider>
                  <CurrentCommentProvider>
                    <BrowserRouter>
                      <App></App>
                    </BrowserRouter>
                  </CurrentCommentProvider>
                </WidthProvider>
              </RealTimeContextProvider>
            </SocketProvider>
          </SessionProvider>
        </ActiveSectionContextProvider>
      </DataProvider>
    </NotiProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(throw))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
