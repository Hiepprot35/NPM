import Login from './components/login/login';
import Home from './components/home';
import CreateStudent from './components/createStudent/createStudent';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import UseToken from './hook/useToken';
import SettingAccount from './components/setting/settingAccount';
import { useState } from 'react';
import useLogin from './hook/useLogin';
import { useEffect } from 'react';
import RequireAuth from './components/requireAuth';
import useAuth from './hook/useAuth';
import Dashboard from './components/Dashboard/Dashboard'
import { IsLoading } from './components/Loading';
import DangKiLopHoc from './components/dangkihoc/dangkilophoc';
import Chuongtrinhdaotao from './chuongtrinhdaotao';
import { useRefresh } from './hook/useRefresh';
import ChatApp from './components/chatapp/chatApp';
import UserProfile from './components/UserProfile/userProfile';
import UseRfLocal from './hook/useRFLocal';
import Errorpage from './components/Layout/Errorpage';
import ProPage from './components/Homepage/proPage';
import ViewTimetable from './components/xemlichhoc/viewTimetable';
function App() {

  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const { isLogin, setIsLogin } = useLogin(); // Sử dụng hook và nhận trạng thái và hàm cập nhật trạng thái
  const [user, setUser] = useState('');
  const { auth } = useAuth()
  const { RefreshToken } = UseRfLocal()
  const { AccessToken, setAccessToken } = UseToken();
  const ROLES = [1, 2]
  const [login, setLogin] = useState(false)
  useEffect(() => {
    setIsLoading(false);
  }, [AccessToken]);

  const refreshAccessToken = useRefresh()
  useEffect(() => {
    async function fetchData() {
      try {
        const refreshedData = await refreshAccessToken();
        refreshedData.AccessToken ? setAccessToken(refreshedData.AccessToken)  : setAccessToken()

      } catch (error) {
        // Xử lý lỗi nếu cần
      }
    }
    fetchData();
  }, []);
  if (isLoading) {
    return <IsLoading></IsLoading>
  }
  if (!isLoading) {
  
  
    if (AccessToken) {
      if (auth.role === 1) {

        return (
          <Routes>
            <Route element={<RequireAuth allowedRoles={ROLES} />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/chat" element={<ChatApp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/message" element={<ChatApp />} />
              <Route path="/message/:id" element={<MessageRoute />} />

              <Route path="/" element={<Navigate to="/home"></Navigate>} />
              <Route path="/create" element={<CreateStudent />} />
              <Route path="/*" element={<Navigate to="/"></Navigate>} />

            </Route>
          </Routes>
        );
      }
      else if (auth.role === 2) {
        return (
          <Routes>
            <Route path="/dangkilop" element={<DangKiLopHoc />} />
            <Route path="/profile/:MSSV" element={<ProfileRoutes />} />
            <Route path="/chuongtrinhdaotao" element={<Chuongtrinhdaotao />} />
            <Route element={<RequireAuth allowedRoles={ROLES} />}>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/message" element={<ChatApp />} />
              <Route path="*" element={<Home />} />
              <Route path="/message/:id" element={<MessageRoute />} />
              <Route path="/lichhoc" element={<ViewTimetable />} />
              <Route path="/setting" element={<SettingAccount />} />

            </Route>
          </Routes>
        )
      }
      
    }
    else {
        return (
          <Routes>
            {/* <Route path="*" element={<Navigate to="/"></Navigate>} /> */}
            {/* <Route path="*" element={<IsLoading />} /> */}
            <Route path="*" element={<Errorpage/>} />
            <Route path="/create" element={<CreateStudent />} />

            <Route path="/login" element={<Login setAccessToken={setAccessToken} setIsLogin={setIsLogin} />} />
            <Route path="/" element={<Login setAccessToken={setAccessToken} setIsLogin={setIsLogin} />} />
          </Routes>
        )

    }

  }
}

function ProfileRoutes() {
  const { MSSV } = useParams();

  return <UserProfile MSSVParams={MSSV} />;
}
function MessageRoute() {
  const { id } = useParams();

  return <ChatApp messageId={id} />;
}
export default App;
