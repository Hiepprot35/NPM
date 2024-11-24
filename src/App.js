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
import { notification } from "antd";
import useNoti from "./hook/useNoti";
import DetailPost from "./components/UserProfile/DetailPost";
import CreateBlog from "./components/blog/CreateBlog";
function App() {
  const [isLoading, setIsLoading] = useState(false);
  let location = useLocation();
  const background = location.state && location.state.background;
  const { auth } = useAuth();
  const { RefreshToken } = UseRfLocal();
  const { AccessToken, checkAccessToken } = UseToken();


  const refreshAccessToken = useRefresh();
  useEffect(() => {
    console.log(RefreshToken,AccessToken,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
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
    if (AccessToken && !RefreshToken) {
      setIsLoading(true)
      checkAccessToken();
      setIsLoading(false)
    }
  }, []);
  const {NotiText}=useNoti()
  const [api,contextHolder]=notification.useNotification()
  useEffect(() => {
    if(NotiText?.message)
    {

      api[NotiText.type]({
        message:NotiText?.title || 'Notification',
        description:NotiText.message,
        duration: 3,
      });
    }
  }, [NotiText]);
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
          <>
              {contextHolder}
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
                  <Route
                  path={`${RouteLink.profileLink}/:MSSV/post/:id`}
                  element={<DetailPost />}
                ></Route>
                <Route path={'/createPost'} element={<CreateBlog/>}></Route>
              </Route>
            </Routes>

            {background && (
              <Routes>
                <Route path="/photo" element={<PhotoPost />} />
              </Routes>
            )}
          </div>
          </>
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
    return <IsLoading className={'top-0'} text="Please wait, the data may take a moment to load for the first time."></IsLoading>;
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
