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
function Comment({ comment, isReply, className }) {
  const { auth } = useAuth();
  const [CommentsRep, setCommentsRep] = useState();
  const [ComemntDetail, setComemntDetail] = useState([]);
  const [Clicked, setClicked] = useState(false);
  const getCommentReply = async () => {
    const res = await fetchApiRes(
      `/gettAllCommentFilms/?movieID=${comment.movieID}&replyID=${comment.id}`
    );
    if (res?.result.length > 0) {
      setCommentsRep(res.result);
    }
  };
  const getComment = async () => {
    if (comment) {
      try {
        const res = await fetchApiRes(`getLike/${comment.id}`);
        if (res.result) {
          setComemntDetail(res.result);
        }
      } catch (error) {
        console.log("ero");
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
  const checkComment =async (e) => {
    let updatedComment = e;
    const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const movieFilmsRegex = /\/movie\/moviedetail\/.+$/;
    if (youtubeRegex.test(e)) {
        const url = e.match(youtubeRegex);
        const videoId=parseUrl(url[0]).query.v||parseUrl(url[0]).pathname.replace("/","")
        const videoTitle = await fetchVideoTitle(videoId);
        const imgUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const newUrl=`<a href="${"https://youtube.com/watch?v="+videoId}">${"https://youtube.com/watch?v="+videoId}<div className="cardMess"><img className="commentImg" src=${imgUrl}></img><div className="titleMess"><p className="hiddenText">${videoTitle}</p></div></div></a>`
        console.log(e,"-----------",url)
        const result=e.replaceAll(url[0].split(" ")[0],newUrl)
        console.log(result)
        const data = `<div className="columnFlex">${result}</div>`;
        updatedComment = data;
      } else if (movieFilmsRegex.test(e)) {
        const paramUrl = e.split("movie/moviedetail/")[1];
        const pics = await movieApi(paramUrl);
        const data = `<div className="columnFlex"><a href="${e}">${e}<div className="cardMess"><img className="commentImg" src=https://image.tmdb.org/t/p/original/${pics.img}></img><div className="titleMess"><p className="hiddenText">${pics.title}</p></div></div></a></div>`;
        updatedComment = data;
      }
      return updatedComment
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

  const [processedComment, setProcessedComment] = useState('');

  useEffect(() => {
    const processComment = async () => {
      const result = await checkComment(comment.content);
      setProcessedComment(result);
    };

    processComment();
  }, [comment.content]);
  


  const disLikeHandle = async (e) => {
    const res = await fetchApiRes("insertLike", "PUT", {
      commentID: e,
      Like: false,
      disLike: true,
      userID: auth.username,
    });
    setClicked(!Clicked);
  };
  const [ReplyOpen, setReplyOpen] = useState(false);
  const ReplyHandle = () => {
    setReplyOpen(!ReplyOpen);
  };
  const [SeeMoreComment, setSeeMoreComment] = useState(false);
  const [User, setUser] = useState();
  useEffect(() => {
    if (comment) {
      const fetchData = async () => {
        const userPromises = await getStudentInfoByMSSV(comment.userID);

        setUser(userPromises);
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
                <img className="avatarImage" src={`${User && User?.img}`}></img>
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
              style={{ justifyContent: "flex-start" }}
            >
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
              <span
                className={
                  ComemntDetail &&
                  ComemntDetail.some(
                    (e) => e.Like && e.userID === auth.username
                  )
                    ? "likeButton activeLike"
                    : "likeButton"
                }
                onClick={() => likeHandle(comment.id)}
              >
                <FiThumbsUp />
                <p>
                  {ComemntDetail && ComemntDetail.filter((e) => e.Like)?.length}
                </p>
              </span>
              <span
                className={
                  ComemntDetail &&
                  ComemntDetail.some(
                    (e) => e.DisLike && e.userID === auth.username
                  )
                    ? "likeButton activeLike"
                    : "likeButton"
                }
                onClick={() => disLikeHandle(comment.id)}
              >
                <FiThumbsDown />
                <p>
                  {ComemntDetail &&
                    ComemntDetail.filter((e) => e.DisLike)?.length}
                </p>
              </span>
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
            {!SeeMoreComment ? "See more" : "Hidden"}
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(Comment);
