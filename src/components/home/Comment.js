import React, { useEffect, useState } from "react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import useAuth from "../../hook/useAuth";
import { fetchApiRes, getStudentInfoByMSSV } from "../../function/getApi";
export default function Comment({ comment, users }) {
  const { auth } = useAuth();
  const [ComemntDetail, setComemntDetail] = useState([]);
  const [Clicked, setClicked] = useState(false);
  const getComment = async () => {
    if (comment) {
      console.log(comment);
      try {
        const res = await fetchApiRes(`getLike/${comment.id}`);
        setComemntDetail(res.result);
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
  const disLikeHandle = async (e) => {
    const res = await fetchApiRes("insertLike", "PUT", {
      commentID: e,
      Like: false,
      disLike: true,
      userID: auth.username,
    });
    setClicked(!Clicked);
  };
  const [User, setUser] = useState();
  useEffect(() => {
    if (comment) {
      const fetchData = async () => {
        const userPromises = await getStudentInfoByMSSV(comment.userID);

        setUser(userPromises);
      };

      fetchData();
    }
  }, [comment]);
  return (
    <div className="comment">
      <div>
        <img
          className="avatarImage"
          src={`${User && User?.img}`}
          style={{ marginRight: "1rem" }}
        ></img>
      </div>
      <div>
        <p>{comment.content}</p>
        <div className="likedislike">
          <span
            className={
              ComemntDetail &&
              ComemntDetail.some((e) => e.Like && e.userID === auth.username)
                ? "activeLike"
                : ""
            }
            onClick={() => likeHandle(comment.id)}
          >
            <FiThumbsUp />
          </span>
          <p>{ComemntDetail && ComemntDetail.filter((e) => e.Like)?.length}</p>
          <span
            className={
              ComemntDetail &&
              ComemntDetail.some((e) => e.DisLike && e.userID === auth.username)
                ? "activeLike"
                : ""
            }
            onClick={() => disLikeHandle(comment.id)}
          >
            <FiThumbsDown />
          </span>
          <p>
            {ComemntDetail && ComemntDetail.filter((e) => e.DisLike)?.length}
          </p>
        </div>
      </div>
    </div>
  );
}
