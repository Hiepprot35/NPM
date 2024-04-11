import { useRef, useEffect, useState } from "react";
import UseToken from "../../hook/useToken";
import { useRefresh } from "../../hook/useRefresh";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Layout/header/header";
import { IsLoading } from "../Loading";
import useAuth from "../../hook/useAuth";
import { useSocket } from "../../context/socketContext";
import MessageMainLayout from "../message/messageMainLayout";
import { FiMail, FiMessageCircle, FiUserPlus } from "react-icons/fi";
import { fetchApiRes } from "../../function/getApi";
export default function Home(props) {
  const navigate = useNavigate();
  const socket = useSocket();
  const { AccessToken, setAccessToken } = UseToken();
  const { auth } = useAuth();
  const [listMSSV, setlistMSSV] = useState();
  const [onlineUser, setOnlineUser] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [classInfo, setClass] = useState([]);
  const DataPerPage = 2;
  const startIndex = (currentPage - 1) * DataPerPage;
  const endIndex = startIndex + DataPerPage;
  useEffect(() => {
    fetch(`${process.env.REACT_APP_DB_HOST}/api/getAllClass`)
      .then((res) => res.json())
      .then((Classes) => {
        setClass(Classes);
      });
  }, [AccessToken]);

  const getClassName = (classID) => {
    for (let i = 0; i < classInfo.length; i++) {
      if (classID === classInfo[i].CLASSID) {
        return <p>Lớp: {classInfo[i].CLASSNAME}</p>;
      }
    }
    return <p>Class Not Found</p>;
  };
  useEffect(() => {
    const senApi = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/findusersend`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: auth.userID,
            }),
          }
        );
        const data = await res.json();
        setlistMSSV(data);
      } catch (err) {
        console.log(err);
      }
    };
    senApi();
  }, []);
  const LinkToMess = async (MSSV) => {
    const userID = await getUserID(MSSV);

    // navigate(`/message/${userID[0].UserID}`);
  };
  const handleAddChat = async (MSSV) => {
    try {
      const res = await fetchApiRes("conversations", "POST", {
        user1: auth.userID,
        user2: MSSV,
      });

      const data = res?.result;
    } catch (error) {
      console.log(error);
    }
  };
  const sendRequestFriend = async (id) => {
    const data = await fetchApiRes("message/getConversation", "POST", {
      user2: auth.userID,
      user1: id,
    });
    console.log(data);
    const data2 = await fetchApiRes("message/getConversation", "POST", {
      user1: auth.userID,
      user2: id,
    });
    if (data.result.length === 0 && data2.result.length === 0) {
      try {
        await fetchApiRes("conversations", "POST", {
          user1: auth.userID,
          user2: id,
          Requesting: 1,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        let idCon =
          data.result.length > 0 ? data.result[0].id : data2.result[0].id;
        console.log("IDCON", idCon);
        await fetchApiRes("message/updateConversation", "POST", {
          Requesting: true,
          id: idCon,
        });
      } catch (error) {}
    }
    if (socket) {
      socket.emit("SendRequestFriend", {
        sender: auth.userID,
        receiver: id,
      });
    }
  };

  // Function để fetch danh sách sinh viên
  const location = useLocation();
  const URL = `${process.env.REACT_APP_DB_HOST}/api/getallstudent`;
  let isCancel = false;
  const getData = async () => {
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
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      // setIsLoading(true)
    }
  };
  useEffect(() => {
    console.log(auth);
  }, [auth]);
  const getUserID = async (MSSV) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/userID/${MSSV}`
      );
      const userID = await res.json();
      return userID;
    } catch (error) {
      // setIsLoading(true)

      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [AccessToken]);

  document.title = "Home";
  const currentData = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / DataPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const myRef = useRef(null);

  return (
    <>
      <Header hash={"/home"} />
      <div className="container_main height_vh100">
        {isLoading ? (
          <IsLoading />
        ) : (
          <div style={{ display: "flex" }}>
            <section className="articles" ref={myRef}>
              {posts &&
                posts.map((element, index) => {
                  if (element.UserID !== auth.userID) {
                    return (
                      <article key={index}>
                        <div className="article-wrapper">
                          <figure>
                            {/* <a href={`/profile/${element.MSSV}`}> */}
                            <img src={element.img} alt="" />
                            {/* </a> */}
                          </figure>
                          <div className="article-body">
                            <h2>{element.Name}</h2>

                            {getClassName(element.Class)}

                            <p>
                              <i>"{element.introduce}"</i>
                            </p>

                            {listMSSV &&
                            listMSSV.some(
                              (item) => item.username === element.MSSV
                            ) ? (
                              <span
                                onClick={() => LinkToMess(element.MSSV)}
                                className="read-more"
                              >
                                <span className="button">
                                  {" "}
                                  {<FiMessageCircle></FiMessageCircle>}{" "}
                                </span>{" "}
                              </span>
                            ) : (
                              <div>
                                <span
                                  className="button"
                                  onClick={() => {
                                    handleAddChat(element.UserID);
                                  }}
                                >
                                  {" "}
                                  {<FiMessageCircle></FiMessageCircle>}{" "}
                                </span>
                                <span
                                  className="button"
                                  onClick={() =>
                                    sendRequestFriend(element.UserID)
                                  }
                                >
                                  <FiUserPlus></FiUserPlus>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  }
                })}
            </section>
            <div style={{ width: "20%" }}></div>
          </div>
        )}
        <MessageMainLayout />
        <div style={{ display: "flex", justifyContent: "center" }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
        {/* <ChatApp user={auth} room={room} /> */}
      </div>
    </>
  );
}
