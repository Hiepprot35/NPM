import React, { memo, useCallback, useEffect, useState } from "react";
import { FiCheck, FiMoreHorizontal, FiPenTool, FiX } from "react-icons/fi";
import useAuth from "../../hook/useAuth";
import { fetchApiRes } from "../../function/getApi";
import parse, { domToReact } from "html-react-parser";
import { notification, Popconfirm, Popover } from "antd";
import UserProfile from "../UserProfile/userProfile";
import { ReactComment } from "../../lib/useObject";
import MyComment from "./MyComment";
import {
  countTime,
  getDate,
  getTime,
  getWeekdays,
} from "../../function/getTime";
import { fetchVideoTitle, movieApi } from "../message/windowchat";
import parseUrl from "parse-url";
import { Link, NavLink } from "react-router-dom";
import { useRealTime } from "../../context/useRealTime";
import MediaGrid from "../imageView/MediaGrid";
import Select from "./Select";
import useNoti from "../../hook/useNoti";
import { shareType } from "../../public/enum/enum.js";
function Comment({
  comment,
  isReply,
  className,
  users,
  setCurrentImg,
  isPost,
  setRefeshPost,
}) {
  const { auth } = useAuth();
  const [CommentsRep, setCommentsRep] = useState([]);
  const [myReaction, setmyReaction] = useState();
  const countReactionHeight = 2.5;
  const [Clicked, setClicked] = useState(false);
  const getCommentReply = async () => {
    console.log('getreppp')
    const url =
      comment.movieID > 0
        ? `/gettAllCommentFilms/?movieID=${comment.movieID}&replyID=${comment.id}`
        : `comment/getAllCommentPostByID/?replyID=${comment.id}`;
        const res = await fetchApiRes(url);
        console.log(res,"dßkdkaskdasd")
        if (res?.result.length > 0) {
      setCommentsRep(res.result);
    }
  };
  useEffect(() => {
    getCommentReply();
  }, [comment]);
  const findTrueProperties = (obj) => {
    const prop = ReactComment.find((e) => {
      if (obj[e.action] === 1) {
        return e.action;
      }
    });
    return prop;
  };

  const getComment = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    getComment();
  }, [comment, Clicked, getComment]);
  const likeHandle = async (e) => {
    const res = await fetchApiRes("comments/updateCommentDetail", "PUT", {
      commentID: e,
      disLike: false,
      Like: true,
      userID: auth.username,
    });
    setClicked(!Clicked);
  };

  const checkComment = useCallback(async (e) => {
    let updatedComment = e;
    const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const movieFilmsRegex = /\/movie\/moviedetail\/.+$/;
    const data = e.split("imgSplitLink");
    if (data[1].length > 0) {
      updatedComment = `
      <div className="flex">
        ${data[0]}
      </div>
      ${data[1]
        .split(",")
        .map(
          (e) =>
            e &&
            `
        <img alt="comment" className="${
          isPost ? "shadow-lg" : ""
        } w-full h-full rounded-xl" src="${e.trim()}" />
      `
        )
        .join("")}
    `;
    } else {
      updatedComment = `<div className="flex">
      ${data[0]}
      </div>`;
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
  }, []);

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
  }, [comment.content, checkComment]);
  const [IsUpdating, setIsUpdating] = useState(false);
  const commentReactHandle = async (e, data) => {
    setmyReaction(data);
    const obj = {
      commentID: e,
      [data.action]: true,
      userID: auth.username,
    };
    await fetchApiRes("comments/updateCommentDetail", "PUT", obj);
    setClicked(!Clicked);
  };
  useEffect(() => {
    console.log(comment)
  }, [comment]);
  const [ReplyOpen, setReplyOpen] = useState(false);
  const ReplyHandle = () => {
    setReplyOpen(!ReplyOpen);
  };
  const [SeeMoreComment, setSeeMoreComment] = useState(false);
  const [CountReaction, setCountReaction] = useState();
  const { Onlines } = useRealTime();
  const [share, setShareTypeUpdate] = useState();
  const foundShare = shareType.find((e) => e.value === Number(comment?.share));
  const { setNotiText } = useNoti();
  const deletePost = async (id) => {
    const url = `comment/delete/${id}`;
    const message = await fetchApiRes(url, 'DELETE');
    const type = message.result ? "success" : "error";
    setNotiText({
      message: message.message,
      title: "Delete notification",
      type: type,
    });
    setRefeshPost((pre) => !pre);
  };
    const updatePost = async (id) => {
    const url = `comment/updateComment/${id}`;
    const message = await fetchApiRes(url,'PUT',{share});
    const type = message.result ? "success" : "error";
    setNotiText({
      message: message.message,
      title: "Update notification",
      type: type,
    });
    setRefeshPost((pre) => !pre);
  };
  return (
    <>
      <div
        className={`comment ${className} ${
          isPost ? "shadow-xl" : "bg-white"
        } cursor-pointer `}
      >
        <div className={`containerComment mr-10`}>
          <div className="headerComment">
            <div className="AvatarComment w-10">
              <Popover
                content={<UserProfile MSSV={comment?.userID}></UserProfile>}
              >
                <div className="AvatarComment2">
                  {!comment?.img && !comment?.cutImg ? (
                    <div className="loader w-1/2 h-1/2"></div>
                  ) : (
                    <div>
                      <img
                        alt="commentImg"
                        className="avatarImage shadow-lg"
                        style={{ maxWidth: "unset" }}
                        src={`${comment?.cutImg || comment?.img}`}
                      ></img>
                      <span
                        className={`dot ${
                          Onlines &&
                          Onlines.some((e) => e.userId === comment?.UserID)
                            ? "activeOnline"
                            : {}
                        }`}
                      ></span>
                    </div>
                  )}
                </div>
              </Popover>
              {((CommentsRep?.length > 0 && SeeMoreComment) || ReplyOpen) && (
                <div className="linearComment"></div>
              )}
            </div>
            <div className={`bodyComment w-full ${!isPost && "rounded-xl"}`}>
              <div className="px-2">
                <div className={`nameComment ${!isPost && "p-2"}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {comment && (
                        <Popover content={<UserProfile MSSV={comment.MSSV} />}>
                          {/* Apply consistent vertical alignment */}
                          <p style={{ fontWeight: 600 }}>{comment.Name}</p>
                        </Popover>
                      )}
                      {comment.media.length > 0 && comment.typePost === 1 && (
                        <>
                          <span>đã thay đổi ảnh đại diện </span>
                        </>
                      )}
                      {comment.media.length > 0 && comment.typePost === 2 && (
                        <>
                          <span>đã thay đổi ảnh bìa </span>
                        </>
                      )}
                      {foundShare && (
                        <Popover
                          trigger="hover"
                          content={<>{foundShare.name}</>}
                        >
                          {/* Vertically align the share icon */}
                          <div>{foundShare.icon}</div>
                        </Popover>
                      )}
                      {IsUpdating && (
                        <Select
                          options={shareType}
                          onChange={setShareTypeUpdate}
                        ></Select>
                      )}
                      <Popover
                        content={
                          <p>
                            {getDate(comment?.createdAt)} lúc{" "}
                            {getTime(comment?.createdAt)},{" "}
                            {getWeekdays(comment?.createdAt)}
                          </p>
                        }
                      >
                        <Link
                          to={`${process.env.REACT_APP_CLIENT_URL}/profile/${comment?.userID}/post/${comment?.id}`}
                        >
                          <span className="cursor-pointer text-slate-500 hover:underline">
                            {countTime(comment?.createdAt)}
                          </span>
                        </Link>
                      </Popover>
                    </div>
                    {isPost && comment?.userID === auth?.userID && (
                      <div className="featPost">
                        <ul className="flex">
                          <Popover
                            trigger={"click"}
                            title={<p>Setting comment</p>}
                            content={
                              <div className="flex">
                                <ul>
                                  <li
                                    className="flex center"
                                    onClick={() => setIsUpdating(!IsUpdating)}
                                  >
                                    <FiPenTool /> Chỉnh sửa bài viết
                                  </li>
                                </ul>
                              </div>
                            }
                          >
                            <li>
                              <span className="circleButton m-0">
                                <FiMoreHorizontal />
                              </span>
                            </li>
                          </Popover>
                          {!IsUpdating && (
                            <li className="mx-2">
                              <Popconfirm
                                title="Delete this post"
                                description="Are you sure to delete this task?"
                                okText="Yes"
                                onConfirm={() => deletePost(comment.id)}
                                cancelText="No"
                              >
                                <span className="circleButton m-0">
                                  <FiX />
                                </span>
                              </Popconfirm>
                            </li>
                          )}
                          {IsUpdating && (
                            <li className="mx-2">
                              <Popconfirm
                                title="Update this post"
                                description="Are you sure to update this task?"
                                okText="Yes"
                                onConfirm={() => updatePost(comment.id)}
                                cancelText="No"
                              >
                                <span className="circleButton m-0">
                                  <FiCheck />
                                </span>
                              </Popconfirm>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="contentComment shadow-indigo-500/40">
                  <div className="pb-4">
                    <span className="text-lg">
                      {parse(comment.content || "", options)}
                    </span>
                  </div>

                  {comment.typePost === 1 && comment.media.length > 0 && (
                    <div className="w-full center h-30vh relative">
                      <div className="bg-cover  w-full h-1/2 absolute top-0 z-0">
                        {comment.backgroundimg && (
                          <img
                            alt="background"
                            className="w-full h-full"
                            style={{
                              transform: `translateY(${
                                comment.backgroundimg.split("%hiep%")[1]
                              })`,
                            }}
                            src={comment.backgroundimg.split("%hiep%")[0]}
                          ></img>
                        )}
                      </div>
                      <Link
                        className="z-10"
                        to={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${comment?.MSSV}&hid=${comment.media[0].id}`}
                      >
                        <img
                          className="rounded-full  object-cover z-3 border-4	border-solid border-#0a0a0a"
                          src={comment.media[0].url}
                          alt="Media Preview"
                        />
                      </Link>
                    </div>
                  )}

                  {Array.isArray(comment.media) &&
                    comment.typePost !== 1 &&
                    comment.media.length > 0 && (
                      <div
                        className={
                          isPost
                            ? "rounded-2xl overflow-hidden"
                            : isReply
                            ? "h-30vh w-1/2"
                            : "rounded-xl"
                        }
                      >
                        <MediaGrid
                          userID={comment.userID}
                          media={comment.media}
                        />
                      </div>
                    )}
                </div>
              </div>

              <div className="likedislike items-center">
                <div>
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
                      onClick={() =>
                        myReaction ? likeHandle(comment.id) : null
                      }
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
              {CommentsRep.map((e, i) => (
                <React.Fragment key={i}>
                  {i < CommentsRep.length - 1 ? (
                    <Comment
                      comment={e}
                      isReply={true}
                      className="notLastComment"
                    />
                  ) : (
                    <Comment
                      comment={e}
                      isReply={true}
                      className={ReplyOpen ? "notLastComment" : "lastComment"}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {!isReply && ReplyOpen && comment && (
            <>
              <div className="MyReplyComment CommentReply ">
                <MyComment
                  setRender={setClicked}
                  movieID={comment.movieID}
                  className={"LastComment"}
                  style={{ margin: 0, padding: 0 }}
                  reply={comment.id}
                  user={comment?.Name}
                  update={setCommentsRep}
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
              <p className="font-semibold 	">
                {!SeeMoreComment
                  ? `Total ${CommentsRep.length} comments. Show all`
                  : `Hidden`}
              </p>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(Comment);
