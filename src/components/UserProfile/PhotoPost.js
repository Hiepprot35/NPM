import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  fetchApiRes,
  getStudentInfoByMSSV,
  getUserinfobyID,
} from "../../function/getApi";
import { cauculatorTime, countTime, getTime } from "../../function/getTime";
import MyComment from "../home/MyComment";
import { Popover } from "antd";
import useAuth from "../../hook/useAuth";
import { ReactComment } from "../../lib/useObject";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
export default function PhotoPost({ UsersProfile }) {
  const findTrueProperties = (obj) => {
    const prop = ReactComment.find((e) => {
      if (obj[e.action] === 1) {
        return e.action;
      }
    });
    return prop;
  };

  const [Comment, setComment] = useState();
  const [CountReaction, setCountReaction] = useState();
  const countReactionHeight = 2.5;
  const [hoverReaction, setHoverReaction] = useState(false);
  const queryParameters = new URLSearchParams(window.location.search);

  const commentID = queryParameters.get("hid");
  const MSSVparam = queryParameters.get("MSSV");
  const { auth } = useAuth();
  const [Users, setUsers] = useState(UsersProfile);

  useEffect(() => {
    const getMediaRes = async () => {
      const res = await fetchApiRes(`getMediaById/?id=${commentID}`, "GET");
      if (res.result) {
        const { url, createdAt, id, type ,prev,next} = res.result[0];
        setComment({ img: url, create_at: createdAt, id: id, type: type ,prev,next});
      }
    };
    if (commentID) {
      getMediaRes();
    }
  }, [commentID, MSSVparam]);
  const getComment = async () => {
    if (commentID) {
      try {
        const res = await fetchApiRes(`getLike/${parseInt(commentID)}`);
        if (res.result) {
          const data = ReactComment.map((e) => ({
            action: e.action,
            count: 0,
            users: [],
          }));

          res.result.forEach((reaction) => {
            const prop = findTrueProperties(reaction);
            if (prop) {
              const item = data.find((d) => d.action === prop.action);
              if (parseInt(reaction.userID) === parseInt(auth.username)) {
                setmyReaction(prop);
              }
              if (item) {
                item.count += 1;
                item.users.push(reaction.userID);
              }
            }
          });
          setCountReaction(data.sort((a, b) => b.count - a.count));
        }
      } catch (error) {
        console.log("ero", error);
      }
    }
  };
  useEffect(() => {
    getComment();
  }, [commentID]);
  useEffect(() => {
    console.log(Comment);
  }, [Comment]);
  const [myReaction, setmyReaction] = useState();
  const likeHandle = async (e) => {
    const res = await fetchApiRes("insertLike", "PUT", {
      commentID: e,
      disLike: false,
      Like: true,
      userID: auth.username,
    });
  };

  const navigate = useNavigate();

  const commentReactHandle = async (e, data) => {
    setmyReaction(data);
    const obj = {
      commentID: e,
      [data.action]: true,
      userID: auth.username,
    };
    const res = await fetchApiRes("insertLike", "PUT", obj);
  };
  useEffect(() => {
    const getPost = async () => {
      // const data = await fetchApiRes(`getAllCommentPost/?id=${commentID}`);
      const users = await getUserinfobyID(MSSVparam);
      setUsers(users);
      // const comment = data.result[0].content.split("imgSplitLink");
      // setComment({
      //   content: comment[0],
      //   img: comment[1],
      //   create_at: data.result[0].create_at,
      // });
    };
    getPost();
    return () => {
      setComment();
    };
  }, [MSSVparam]);
  const location = useLocation();

  const close = () => {
    console.log(location.state,"ehehehehehasaaaaaaaaaa")
    navigate(-1, { state: { backgroundLocation: location } });
  };
  return (
    <div className="z-50 w-50 h-50  flex fixed inset-0 center">
      <div className="h-full" style={{ width: "70%" }}>
        <div className="bg-black w-full center h-full relative ">
          {!Comment ? (
            <div className="loader"></div>
          ) : (
            <>
              {Comment.type.includes("image") && (
                <>

                {
                Comment.prev &&
                <Link to={`./?MSSV=${MSSVparam}&hid=${Comment.prev}`}>

                <span className="circleButton"><FiArrowLeft></FiArrowLeft></span>
                </Link>
                }
                <img
                  alt="imageAvatar"
                  className="object-contain w-70"
                  style={{ width: "auto", height: "auto" }}
                  src={`${Comment?.img}`}
                />
                  {
                Comment.next &&
                <Link to={`./?MSSV=${MSSVparam}&hid=${Comment.next}`}>
                <span className="circleButton"><FiArrowRight/></span>
                </Link>
                }
                </>
              )}
              {Comment.type && Comment.type.includes("video") && (
                <video className="h-full" alt={`Comment Media `} controls>
                  <source src={Comment?.img} type="video/mp4"></source>
                </video>
              )}
              <div className="absolute left-3" style={{ top: "8vh" }}>
                <span className="circleButton" onClick={() => close()}>
                  x
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="h-full flex-col bg-white" style={{ width: "30%" }}>
        {
          <div className="flex " style={{ margin: "7vh 3rem 0 " }}>
            <div className="flex center">
              {!Users ? (
                <div className="loader"></div>
              ) : (
                <>
                  <img
                    alt="avatar"
                    className="avatarImage"
                    src={`${Users?.cutImg || Users?.img}`}
                  />
                </>
              )}
              <div className="flex-col m-2">
                <p className="font-semibold">{Users?.Name}</p>
                {
                  Comment &&
                  <Popover content={<p>{ moment(Comment.create_at).format('LLL')}</p>}>

                <p>{ countTime(Comment.create_at)}</p>
                </Popover>
                }
              </div>
            </div>
          </div>
        }
        <div style={{ margin: "2rem 3rem 2rem " }}>
          <p className="font-3xl">{Comment?.content}</p>
        </div>

        <div className="flex" style={{ margin: "2rem 3rem 2rem " }}>
          <Popover
            content={
              <div
                className="center"
                style={{ display: "flex", listStyleType: "none" }}
              >
                {ReactComment.map((e, i) => (
                  <Popover content={e.name}>
                    <span
                      key={i}
                      style={{
                        background:
                          myReaction?.action === e.action ? "gray" : "none",
                      }}
                      className="reactionComment circleButton"
                      onClick={() => commentReactHandle(Comment.id, e)}
                    >
                      {e.icon}
                    </span>
                  </Popover>
                ))}
              </div>
            }
          >
            <span
              className=""
              style={{
                fontSize: "1.1rem",
                borderRadius: "50%",
                padding: ".5rem",
                background: myReaction ? "gray" : "none",
              }}
              onClick={() => (myReaction ? likeHandle(Comment.id) : null)}
            >
              {myReaction?.icon || "👍"}
            </span>
          </Popover>
          <div
            className="reactionCountComment"
            style={{ display: "flex" }}
            onMouseEnter={() => setHoverReaction(true)}
            onMouseLeave={() => setHoverReaction(false)}
          >
            {CountReaction &&
              CountReaction.map((e, i) => {
                return (
                  e.count > 0 && (
                    <div
                      className=" countReaction"
                      style={{
                        position: "absolute",
                        left: hoverReaction
                          ? `${i * countReactionHeight + 0.5}rem`
                          : `${(i * countReactionHeight) / 2}rem`,
                        zIndex: `${5 - i}`,
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>
                        {ReactComment.find((v) => v.action === e.action).icon}
                      </span>

                      {hoverReaction && (
                        <span style={{ color: "black" }}>{e.count}</span>
                      )}
                    </div>
                  )
                );
              })}{" "}
          </div>
        </div>
        <div className="" style={{ width: "70%" }}>
          <MyComment className="w-full"></MyComment>
        </div>
      </div>
    </div>
  );
}
