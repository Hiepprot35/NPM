import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  fetchApiRes,
  getStudentInfoByMSSV,
  getUserinfobyID,
} from "../../function/getApi";
import { cauculatorTime, countTime } from "../../function/getTime";
import MyComment from "../home/MyComment";
import { Popover } from "antd";
import useAuth from "../../hook/useAuth";

export default function PhotoPost({ CurrentImg, commentID, UsersProfile }) {
  const findTrueProperties = (obj) => {
    const prop = ReactComment.find((e) => {
      if (obj[e.action] === 1) {
        return e.action;
      }
    });
    return prop;
  };
  const [Comment, setComment] = useState(CurrentImg);
  const [CountReaction, setCountReaction] = useState();
  const countReactionHeight = 2.5;
  const [hoverReaction, setHoverReaction] = useState(false);

  const { auth } = useAuth();
  const [Users, setUsers] = useState(UsersProfile);
  const ReactComment = [
    { action: "Like", icon: "👍", isLike: true, name: "Like" },
    { action: "isFavorite", icon: "❤️", isFavorite: true, name: "Favorite" },
    { action: "isHaha", icon: "😂", isHaha: true, name: "Haha" },
    { action: "isSad", icon: "😔", isSad: true, name: "Sad" },
    { action: "DisLike", icon: "👎", DisLike: true, name: "DisLike" },
  ];
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
    console.log(CountReaction);
  }, [CountReaction]);
  const [myReaction, setmyReaction] = useState();
  const likeHandle = async (e) => {
    const res = await fetchApiRes("insertLike", "PUT", {
      commentID: e,
      disLike: false,
      Like: true,
      userID: auth.username,
    });
  };

  const navigator = (step) => {

    window.history.go(step);
  };

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
      const data = await fetchApiRes(`getAllCommentPost/?id=${commentID}`);
      const users = await getStudentInfoByMSSV(data.result[0].userID);
      setUsers(users);
      const comment = data.result[0].content.split("imgSplitLink");
      setComment({
        content: comment[0],
        img: comment[1],
        create_at: data.result[0].create_at,
      });
    };
    if (!CurrentImg) {
      getPost();
    }
    return () => {
      setComment();
    };
  }, [commentID]);
  return (
    <div className="w-screen h-screen flex fixed inset-0 center">
      <div className="h-full" style={{ width: "70%" }}>
        <div className="bg-black w-full center h-full relative ">
          {!Comment ? (
            <div className="loader"></div>
          ) : (
            <>
              <img
                className="object-contain w-full h-full"
                style={{width:"auto",height:"auto"}}
                src={`${ Comment?.img}`}
              />
              <div className="absolute right-3" style={{ top: "8vh" }}>
                <span className="circleButton" onClick={() => navigator(-1)}>
                  X
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
                    className="avatarImage"
                    src={`${Users?.cutImg || Users?.img}`}
                  />
                </>
              )}
              <div className="flex-col m-2">
                <p className="font-semibold">{Users?.Name}</p>
                <p>{countTime(Comment?.create_at)}</p>
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
              <div style={{width:"70%"}}>

        <MyComment className="w-full"></MyComment>
              </div>
      </div>
    </div>
  );
}
