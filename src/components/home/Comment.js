import React, { memo, useEffect, useState } from "react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import useAuth from "../../hook/useAuth";
import { fetchApiRes, getStudentInfoByMSSV } from "../../function/getApi";
import parse, { domToReact } from "html-react-parser";
import { Popover } from "antd";
import UserProfile from "../UserProfile/userProfile";
import MyComment from "./MyComment";
import { countTime, getDate, getTime } from "../../function/getTime";
import { fetchVideoTitle, movieApi } from "../message/windowchat";
import parseUrl from "parse-url";
function Comment({ comment, isReply, className,users }) {
  const { auth } = useAuth();
  const [CommentsRep, setCommentsRep] = useState();
  const [ComemntDetail, setComemntDetail] = useState([]);
  const [myReaction, setmyReaction] = useState();
  const countReactionHeight = 2.5;
  const [Clicked, setClicked] = useState(false);
  const getCommentReply = async () => {
    const url =
      comment.movieID > 0
        ? `/gettAllCommentFilms/?movieID=${comment.movieID}&replyID=${comment.id}`
        : `/getAllCommentPost/?replyID=${comment.id}`;
    const res = await fetchApiRes(url);
    if (res?.result.length > 0) {
      setCommentsRep(res.result);
    }
  };
  const findTrueProperties = (obj) => {
    const prop = ReactComment.find((e) => {
      if (obj[e.action] === 1) {
        return e.action;
      }
    });
    return prop;
  };

  const getComment = async () => {
    if (comment) {
      try {
        const res = await fetchApiRes(`getLike/${comment.id}`);
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
  }, [comment, Clicked]);
  const likeHandle = async (e) => {
    const res = await fetchApiRes("insertLike", "PUT", {
      commentID: e,
      disLike: false,
      Like: true,
      userID: auth.username,
    });
    setClicked(!Clicked);
  };

  const checkComment = async (e) => {
    let updatedComment = e;
    const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const movieFilmsRegex = /\/movie\/moviedetail\/.+$/;
    const data = e.split("imgSplitLink");
    if (data.length > 1) {
      updatedComment = data[0] + ` <img atl="comment" className="w-full h-full rounded-xl" src="${data[1]}" />`;
    }

    if (youtubeRegex.test(e)) {
      const url = e.match(youtubeRegex);
      const videoId =
        parseUrl(url[0]).query.v || parseUrl(url[0]).pathname.replace("/", "");
      const videoTitle = await fetchVideoTitle(videoId);
      const imgUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const newUrl = `<a href="${"https://youtube.com/watch?v=" + videoId}">${
        "https://youtube.com/watch?v=" + videoId
      }<div className="cardMess"><img className="commentImg" src=${imgUrl}></img><div className="titleMess"><p className="hiddenText">${videoTitle}</p></div></div></a>`;
      const result = updatedComment.replaceAll(url[0].split(" ")[0], newUrl);
      const data = `<div className="columnFlex">${result}</div>`;
      updatedComment = data;
    } else if (movieFilmsRegex.test(e)) {
      const paramUrl = e.split("movie/moviedetail/")[1];
      const pics = await movieApi(paramUrl);
      const data = `<div className="columnFlex"><a href="${e}">${e}<div className="cardMess"><img className="commentImg" src=https://image.tmdb.org/t/p/original/${pics.img}></img><div className="titleMess"><p className="hiddenText">${pics.title}</p></div></div></a></div>`;
      updatedComment = data;
    }
    return updatedComment;
  };

  const options = {
    replace: ({ name, attribs, children }) => {
      if (name === "span" && attribs && attribs.class === "tagNameHref") {
        const data = attribs["data-lexical-text"];
        return (
          <Popover content={<UserProfile MSSV={data} />}>
            <a
              href={`${process.env.REACT_APP_CLIENT_URL}/profile/${data}`}
              className="tagNameHref"
              data-lexical-text={data}
            >
              {domToReact(children)}
            </a>
          </Popover>
        );
      }
    },
  };

  const [processedComment, setProcessedComment] = useState("");
  const [hoverReaction, setHoverReaction] = useState(false);
  useEffect(() => {
    const processComment = async () => {
      try {
        const result = await checkComment(comment.content);
        setProcessedComment(result);
      } catch (error) {}
    };

    processComment();
  }, [comment.content]);
  const commentReactHandle = async (e, data) => {
    setmyReaction(data);
    const obj = {
      commentID: e,
      [data.action]: true,
      userID: auth.username,
    };
    const res = await fetchApiRes("insertLike", "PUT", obj);
    setClicked(!Clicked);
  };
  const ReactComment = [
    { action: "Like", icon: "👍", isLike: true, name: "Like" },
    { action: "isFavorite", icon: "❤️", isFavorite: true, name: "Favorite" },
    { action: "isHaha", icon: "😂", isHaha: true, name: "Haha" },
    { action: "isSad", icon: "😔", isSad: true, name: "Sad" },
    { action: "DisLike", icon: "👎", DisLike: true, name: "DisLike" },
  ];

  const [ReplyOpen, setReplyOpen] = useState(false);
  const ReplyHandle = () => {
    setReplyOpen(!ReplyOpen);
  };
  const [SeeMoreComment, setSeeMoreComment] = useState(false);
  const [CountReaction, setCountReaction] = useState();
  const [User, setUser] = useState();

  useEffect(() => {
    if (comment) {
      const fetchData = async () => {
    if(users)
        {setUser(users)}
        else{

          const userPromises = await getStudentInfoByMSSV(comment.userID);
          setUser(userPromises);
        }
      };
    
      fetchData();
      getCommentReply();
    }
  }, [comment]);

  return (
    <div className={`comment ${className}`}>
      <div className="containerComment">
        <div className="headerComment">
          <div className="AvatarComment">
            <Popover content={<UserProfile MSSV={User?.MSSV}></UserProfile>}>
              <div className="AvatarComment2">
                {
                  !User?<div className="loader w-1/2 h-1/2"></div>:
                <img
                  className="avatarImage shadow-lg"
                  style={{maxWidth:"unset"}}
                  src={`${(User && User?.cutImg) || User?.img}`}
                  ></img>
                }
              </div>
            </Popover>
            {((CommentsRep?.length > 0 && SeeMoreComment) || ReplyOpen) && (
              <div className="linearComment"></div>
            )}
          </div>
          <div className="bodyComment">
            <div className="NameAndContent">
              <div className="nameComment">
                <Popover
                  content={<UserProfile MSSV={User?.MSSV}></UserProfile>}
                >
                  <div className="NameComment" style={{ cursor: "pointer" }}>
                    <span style={{ fontWeight: 600 }}>{User?.Name}</span>
                  </div>
                </Popover>
              </div>
              <div className="contentComment">
                {[comment.content].map((e) => (
                  <span>{parse(processedComment, options)}</span>
                ))}
              </div>
            </div>
            <div
              className="likedislike center"
              style={{ justifyContent: "space-around" }}
            >
              <div>
                <Popover
                  content={
                    <p>
                      {getDate(comment.create_at)} lúc{" "}
                      {getTime(comment.create_at)}
                    </p>
                  }
                >
                  <span>{countTime(comment.create_at)}</span>
                </Popover>
                <span
                  className="likeButton replyButton"
                  style={{ margin: "0 1rem" }}
                  onClick={ReplyHandle}
                >
                  Reply to
                </span>
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
                                myReaction?.action === e.action
                                  ? "gray"
                                  : "none",
                            }}
                            className="reactionComment circleButton"
                            onClick={() => commentReactHandle(comment.id, e)}
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
                    onClick={() => (myReaction ? likeHandle(comment.id) : null)}
                  >
                    {myReaction?.icon || "👍"}
                  </span>
                </Popover>
              </div>

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
                            {
                              ReactComment.find((v) => v.action === e.action)
                                .icon
                            }
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
          </div>
        </div>
        {CommentsRep && SeeMoreComment && (
          <div className="CommentReply">
            {CommentsRep.map((e, i) =>
              i < CommentsRep.length - 1 ? (
                <Comment comment={e} className={"notLastComment"}></Comment>
              ) : (
                <Comment
                  comment={e}
                  className={ReplyOpen ? "notLastComment" : `lastComment`}
                ></Comment>
              )
            )}
          </div>
        )}

        {!isReply && ReplyOpen && (
          <>
            <div className="MyReplyComment CommentReply">
              <MyComment
                setRender={setClicked}
                movieID={comment.movieID}
                className={"LastComment"}
                style={{ margin: 0, padding: 0 }}
                reply={comment.id}
                user={User?.Name}
              ></MyComment>
            </div>
          </>
        )}
        {CommentsRep?.length > 0 && (
          <p
            className="textUnderline"
            style={{ margin: "0 0 2rem 4rem" }}
            onClick={() => setSeeMoreComment((pre) => !pre)}
          >
            
            <p className="font-semibold text-teal-300	">
{

!SeeMoreComment ?`Total ${CommentsRep.length} comments. Show all`:`Hidden`
}
            </p>
             
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(Comment);
