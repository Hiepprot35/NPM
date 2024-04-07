import Login from "./components/login/login";
import Home from "./components/home/home";
import CreateStudent from "./components/createStudent/createStudent";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useParams,
} from "react-router-dom";
import UseToken from "./hook/useToken";
import SettingAccount from "./components/setting/settingAccount";
import { useState } from "react";
import { useEffect } from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import { IsLoading } from "./components/Loading";
import DangKiLopHoc from "./components/dangkihoc/dangkilophoc";
import Chuongtrinhdaotao from "./chuongtrinhdaotao";
import { useRefresh } from "./hook/useRefresh";
import ChatApp from "./components/chatapp/chatApp";
import UserProfile from "./components/UserProfile/userProfile";
import UseRfLocal from "./hook/useRFLocal";
import Errorpage from "./components/Layout/Errorpage";
import ProPage from "./components/Homepage/proPage";
import ViewTimetable from "./components/xemlichhoc/viewTimetable";
import useAuth from "./hook/useAuth";
function App() {
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  // const socket=useSocket();
  const { auth,setAuth } = useAuth();
  const { RefreshToken } = UseRfLocal();
  const [arrivalMessage, setArrivalMessage] = useState();
  const { AccessToken, setAccessToken, checkAccessToken } = UseToken();
  const ROLES = [1, 2];
  const [login, setLogin] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, [AccessToken]);
  // useEffect(() => {
  //   if (socket && auth && auth.userID) {
  //     console.log(auth.userID);
  //     socket.emit("addUser", auth.userID);
  //     socket.on("getUsers", (data) => { console.log(data) })

  //   }
  // }, [socket, auth]);

  const refreshAccessToken = useRefresh();
  useEffect(() => {
    if (RefreshToken) {
      setIsLoading(true)
      async function fetchData() {
        try {
          const refreshedData = await refreshAccessToken();
         setIsLoading(false)
        } catch (error) {
          setIsLoading(false)

          console.log(error)
        }
      }
      fetchData();
    }
  }, []);
  useEffect(()=>{console.log("auth",auth)},[auth])
 
  if (!isLoading) {
    if (auth.userID) {
      if (auth.role === 1) {
        return (
          <Routes>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/home" element={<Home />} />
              <Route path="/message" element={<ChatApp />} />
              <Route path="/message/:id" element={<ChatApp />} />

              <Route path="/" element={<Navigate to="/home"></Navigate>} />
              <Route path="/create" element={<CreateStudent />} />
              <Route path="/*" element={<Navigate to="/"></Navigate>} />
          </Routes>
        );
      } else if (auth.role === 2) {
        return (
          <Routes>
            <Route
              path="/dangkilop"
              element={<DangKiLopHoc arrivalMessage={arrivalMessage} />}
            />
            {/* <Route path="/profile/:MSSV" element={<ProfileRoutes  />} /> */}
            <Route path="/chuongtrinhdaotao" element={<Chuongtrinhdaotao />} />
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/" element={<Home />} />
              <Route
                path="/message"
                element={<ChatApp />}
                arrivalMessage={arrivalMessage}
              />
              <Route path="*" element={<Home />} />
              <Route path="/message/:id" element={<MessageRoute />} />
              <Route path="/lichhoc" element={<ViewTimetable />} />
              <Route
                path="/setting"
                element={<SettingAccount arrivalMessage={arrivalMessage} />}
              />
          </Routes>
        );
      }
    } else {
      return (
        <Routes>
          {/* <Route path="*" element={<Navigate to="/"></Navigate>} /> */}
          {/* <Route path="*" element={<IsLoading />} /> */}
          <Route path="*" element={<Login />} />
          <Route path="/create" element={<CreateStudent />} />

          <Route
            path="/login"
            element={<Login setAccessToken={setAccessToken} />}
          />
          <Route path="/" element={<Login setAccessToken={setAccessToken} />} />
        </Routes>
      );
    }
  }
  else{
    return(
      <Routes>

      <Route path="*" element={<IsLoading />} />
      </Routes>

    )
  }
}

// function ProfileRoutes() {
//   const { MSSV } = useParams();

//   return <UserProfile MSSVParams={MSSV} />;
// }
function MessageRoute() {
  const { id } = useParams();

  return <ChatApp messageId={id} />;
}
export default App;
