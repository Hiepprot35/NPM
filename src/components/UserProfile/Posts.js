import React, { useEffect, useState } from "react";
import { FiGrid, FiLayout } from "react-icons/fi";
import Comment from "../home/Comment";
import "./Posts.css";
import { fetchApiRes } from "../../function/getApi";
import UseToken from "../../hook/useToken";
import useAuth from "../../hook/useAuth";
import MyPost from '../blog/myPost'


export default function Posts(props) {
  const [gridView, setGridView] = useState(false);
  const { AccessToken } = UseToken();
  const [Post, setPost] = useState([]);
  const [refreshPost,setRefeshPost]=useState(false)
  const { auth } = useAuth();
  const getPost = async () => {
    try {
      const data = await fetchApiRes(
        `getAllCommentPost/?userID=${props.username}&replyID=-1`,
        "GET",
        null,
        null,
        AccessToken
      );
      console.log(data, "dataaaaaaaa");
      if (data && data.result) {
        const dataUpdate = data.result.sort(
          (a, b) => b.createdAt - a.createdAt
        );

        setPost(dataUpdate);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error occurred:", error);
      }
    }
  };
  useEffect(() => {
    getPost();
  }, [refreshPost]);
  return (
    <>
      {auth && auth.userID === Number(props.username) && (
        <div>
          <MyPost update={setPost}></MyPost>
        </div>
      )}
      <div className=" w-full mt-8">
        <div className="w-full theme rounded-xl p-4 mb-8 flex center justify-between	">
          <div>
            <p className="font-semibold text-3xl">Bài viết</p>
          </div>
          <div>{/* <SharingScreen></SharingScreen> */}</div>
          <div className="flex">
            <span className="circleButton" onClick={() => setGridView(true)}>
              <FiGrid />
            </span>
            <span className="circleButton" onClick={() => setGridView(false)}>
              <FiLayout></FiLayout>
            </span>
          </div>
        </div>
      </div>

      <div className={`mb-8 w-full   ${gridView && "grid grid-cols-2 gap-2"}	`}>
        {Post &&
          Post.map((e) => (
            <Comment
              isPost={true}
              key={e.id}
              setRefeshPost={setRefeshPost}
              users={props.users}
              comment={e}
              className={"PostComponent p-4  mb-4 theme rounded-xl w-full"}
            ></Comment>
          ))}
      </div>
    </>
  );
}
