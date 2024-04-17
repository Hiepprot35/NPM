import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiUserPlus } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../context/socketContext";
import { fetchApiRes } from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import UseToken from "../../hook/useToken";
import Header from "../Layout/header/header";
import { IsLoading } from "../Loading";
import { getConversation } from "../conversation/getConversation";
import MessageMainLayout from "../message/messageMainLayout";
import FriendList from "./friend";
import { useData } from "../../context/dataContext";
import MovieFilms from "./MovieFilms";
export default function Home(props) {
  const { listWindow, setListWindow, listHiddenBubble, setListHiddenBubble } =
    useData();
  const { AccessToken, setAccessToken } = UseToken();
  useEffect(() => {
    if (listWindow) {
      localStorage.setItem("counter", JSON.stringify(listWindow));
    }
  }, [listWindow]);
  useEffect(() => {
    if (listHiddenBubble)
      localStorage.setItem("hiddenCounter", JSON.stringify(listHiddenBubble));
  }, [listHiddenBubble]);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const getData = async () => {
    const URL = `${process.env.REACT_APP_DB_HOST}/api/getallstudent`;
    try {
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          setIsLoading(false);
          setPosts(data.result);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, [AccessToken]);

  document.title = "Home";

  return (
    <>
      <Header hash={"/home"} />
      <div className={props.isHidden ? "" : "container_main height_vh100"}>
        {isLoading ? (
          <IsLoading />
        ) : (
          !props.isHidden && <FriendList listUsers={posts} />
        )}
        {/* <div className="centerHome">
          <div className="statusPost">
            <div className="center">
              <img
                alt="tag"
                src={`${auth?.avtUrl}`}
                style={{ borderRadius: "50%", width: "70px" }}
              ></img>{" "}
              <span
                style={{
                  width: "90%",
                  margin: "1rem",
                  backgroundColor: "gray",
                  padding: "1rem",
                  borderRadius: "1rem",
                }}
              >
                mày nghĩ cc gì vậy ?
              </span>
            </div>
          </div>
          <div className="bodyPost">
            <div className="imgPost"></div>
            <div className="textPost"></div>
          </div>
        </div> */}
        <MovieFilms></MovieFilms>
        <MessageMainLayout isHidden={props.isHidden} />

        {/* <ChatApp user={auth} room={room} /> */}
      </div>
    </>
  );
}
