import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useParams,
  useLocation,
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
import { IsLoading } from "./components/Loading";
import MoviesType from "./components/home/MoviesType";
import VideoPlayer from "./components/chatapp/VideoPlayer";
import Profile from "./components/UserProfile/Profile";
import PhotoPost from "./components/UserProfile/PhotoPost";
import NewFeed from "./components/newfeed/NewFeed";
import { RouteLink } from "./lib/link";
import Blog from "./components/blog/Blog";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  let location = useLocation();
  const background = location.state && location.state.background;
  const { auth, setAuth } = useAuth();
  const { RefreshToken } = UseRfLocal();
  const { AccessToken, checkAccessToken } = UseToken();
  useEffect(() => {
    setIsLoading(false);
  }, [AccessToken]);
  useEffect(() => {
    if (AccessToken && !RefreshToken) {
      checkAccessToken();
    }
  }, []);
  const refreshAccessToken = useRefresh();
  useEffect(() => {
    if (RefreshToken) {
      setIsLoading(true);
      async function fetchData() {
        try {
          await refreshAccessToken();
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
            <Route path="/" element={<Layout></Layout>}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route index element={<Home />} />
              <Route path="/message" element={<ChatApp />} />
              <Route path="/message/:id" element={<ChatApp />} />

              <Route path="/" element={<Navigate to="/home"></Navigate>} />
              <Route path="/create" element={<CreateStudent />} />
            </Route>
          </Routes>
        );
      } else if (auth.role === 2) {
        return (
          <div>
            <Routes location={background || location}>
              <Route path="/" element={<Layout />}>
                <Route index element={<NewFeed />} />
                <Route path="dangkilop" element={<DangKiLopHoc />} />
                <Route path="blog" element={<Blog />}/>
                <Route
                  path="chuongtrinhdaotao"
                  element={<Chuongtrinhdaotao />}
                />
                <Route
                  path="movie/moviedetail/:id"
                  element={<DeltailMovieFilms />}
                />
                <Route path="*" element={<NewFeed />}></Route>

                <Route path="friends" element={<FriendList />} />
                <Route path="films" element={<MoviesType />} />
                <Route path="videocall" element={<VideoCall />} />
                <Route path="message" element={<MessageRoute />} />
                <Route path="lichhoc" element={<ViewTimetable />} />
                <Route path="/message/:id" element={<ChatApp />} />

                <Route path="setting" element={<SettingAccount />} />
                <Route path="photo" element={<PhotoPost />} />
                <Route path={RouteLink.homeFilmLink} element={<Home />} />

                <Route
                  path={`${RouteLink.profileLink}/:MSSV`}
                  element={<Profile />}
                ></Route>
              </Route>
            </Routes>

            {background && (
              <Routes>
                <Route path="/photo" element={<PhotoPost />} />
              </Routes>
            )}
          </div>
        );
      }
    } else {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<Home />} />
            <Route path="/photo" element={<PhotoPost />} />
            <Route path="/profile/:MSSV" element={<Profile />} />
            <Route path="*" element={<Home />}></Route>
            <Route path="/create" element={<CreateStudent />} />

            <Route
              path="/movie/moviedetail/:id"
              element={<DeltailMovieFilms />}
            />
          </Route>
        </Routes>
      );
    }
  } else {
    return <IsLoading></IsLoading>;
  }
}

function VideoCall() {
  const { userID } = useParams();

  return <VideoPlayer userID={userID} />;
}
function DeltailMovieFilms() {
  const { id } = useParams();

  return <DetailMovie movieID={id} />;
}
function MessageRoute() {
  const { messageId } = useParams();

  return <ChatApp messageId={messageId} />;
}
export default App;
