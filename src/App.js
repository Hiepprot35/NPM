import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useParams
} from "react-router-dom";
import Chuongtrinhdaotao from "./chuongtrinhdaotao";
import Dashboard from "./components/Dashboard/Dashboard";
import ChatApp from "./components/chatapp/chatApp";
import CreateStudent from "./components/createStudent/createStudent";
import DangKiLopHoc from "./components/dangkihoc/dangkilophoc";
import Home from "./components/home/home";
import Login from "./components/login/login";
import UserProfile from "./components/UserProfile/userProfile";
import SettingAccount from "./components/setting/settingAccount";
import ViewTimetable from "./components/xemlichhoc/viewTimetable";
import useAuth from "./hook/useAuth";
import UseRfLocal from "./hook/useRFLocal";
import { useRefresh } from "./hook/useRefresh";
import UseToken from "./hook/useToken";
import DetailMovie from "./components/home/DetailMovie";
import FriendList from "./components/home/friend";
import Layout from "./components/Layout/layout";
function App() {
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  // const socket=useSocket();
  const { auth, setAuth } = useAuth();
  const { RefreshToken } = UseRfLocal();
  const { AccessToken, setAccessToken, checkAccessToken } = UseToken();
  const ROLES = [1, 2];
  const [login, setLogin] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, [AccessToken]);


  const refreshAccessToken = useRefresh();
  useEffect(() => {
    if (RefreshToken) {
      setIsLoading(true);
      async function fetchData() {
        try {
          const refreshedData = await refreshAccessToken();
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);

          console.log(error);
        }
      }
      fetchData();
    }
  }, []);


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
              element={<DangKiLopHoc  />}
            />
            <Route path="/profile/:MSSV" element={<ProfileRoutes  />} />
            <Route path="/chuongtrinhdaotao" element={<Chuongtrinhdaotao />} />
            <Route path="/movie/moviedetail/:id" element={<MovieFilm/>}/>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/friends" element={<FriendList />} />

            <Route
              path="/message"
              element={<ChatApp />}
            />
            <Route path="*" element={<Home />} />
            <Route path="/message/:id" element={<MessageRoute />} />
            <Route path="/lichhoc" element={<ViewTimetable />} />
            <Route
              path="/setting"
              element={<SettingAccount  />}
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
  
}

function ProfileRoutes() {
  const { MSSV } = useParams();

  return <UserProfile MSSVParams={MSSV} />;
}
function MovieFilm() {
  const { id } = useParams();

  return <DetailMovie MovieID={id} />;
}
function MessageRoute() {
  const { id } = useParams();

  return <ChatApp messageId={id} />;
}
export default App;
