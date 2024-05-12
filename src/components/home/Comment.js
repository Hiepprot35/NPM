import React, { useEffect, useState } from "react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import useAuth from "../../hook/useAuth";
import { fetchApiRes, getStudentInfoByMSSV } from "../../function/getApi";
import parse from "html-react-parser";
import { Popover } from "antd";
import UserProfile from "../UserProfile/userProfile";
import MyComment from "./MyComment";
import { countTime, getDate, getTime } from "../../function/getTime";

export default function Comment({ comment, users, isReply, className }) {
  const { auth } = useAuth();
  const [CommentsRep, setCommentsRep] = useState();
  const [ComemntDetail, setComemntDetail] = useState([]);
  const [Clicked, setClicked] = useState(false);
  const getCommentReply = async () => {
    const res = await fetchApiRes(
      `/gettAllCommentFilms/?movieID=${comment.movieID}&replyID=${comment.id}`
    );
    if(res?.result.length>0)
      {

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
  const checkComment = (e) => {
    const data = parse(e);
    const parser = new DOMParser();
    const doc = parser.parseFromString(e, "text/html");
    const aElement = doc.querySelector("a.tagNameHref");
    if (aElement) {
      const data = aElement.getAttribute("data-lexical-text");
      console.log("hover", data);
      return (
        <Popover content={<UserProfile MSSV={data}></UserProfile>}>
          {parse(e)}
        </Popover>
      );
    } else {
      return parse(e);
    }
  };
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
            {CommentsRep?.length > 0 && <div className="linearComment"></div>}
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
                {comment.content.split("_").map((e) => (
                  <span>{checkComment(e)}</span>
                ))}
              </div>
            </div>
            <div className="likedislike">
              <Popover content={<p>{getDate(comment.create_at)} lúc {getTime(comment.create_at)}</p>}>
                <span>{countTime(comment.create_at)}</span>
              </Popover>
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

              <span className="likeButton" onClick={ReplyHandle}>
                Phản hồi
              </span>
            </div>
          </div>
        </div>{" "}
        {!isReply && ReplyOpen && (
          <div className="MyReplyComment">
            <MyComment
              setRender={setClicked}
              movieID={comment.movieID}
              reply={comment.id}
              user={User?.Name}
            ></MyComment>
            <div className="linearComment"></div>
          </div>
        )}
        {CommentsRep && (
          <div className="CommentReply">
            {CommentsRep.map((e, i) =>
              i < CommentsRep.length - 1 ? (
                <Comment
                  comment={e}
                  className={"notLastComment"}
                  isReply={false}
                ></Comment>
              ) : (
                <Comment
                  comment={e}
                  className={"lastComment"}
                  isReply={false}
                ></Comment>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
