import React, { useState } from "react";
import { FiGrid, FiLayout } from "react-icons/fi";
import useAuth from "../../hook/useAuth";
import Comment from "../home/Comment";
import MyComment from "../home/MyComment";
import "./Posts.css";
export default function Posts(props) {
  const [gridView, setGridView] = useState(false);
  return (
    <>
      <div>
        <MyComment update={props.setPost} className="PostProfile w-full"></MyComment>
      </div>
      <div className="pl-12 w-full mt-8">
        <div className="w-full theme rounded-xl p-4 mb-8 flex center justify-between	">
          <div>
            <p className="font-semibold text-3xl">Bài viết</p>
          </div>
          <div>
            {/* <SharingScreen></SharingScreen> */}
          </div>
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

      <div
      
        className={`mb-8 pl-12 w-full    ${gridView && "grid grid-cols-2 gap-2"}	`}
      >
        {
          props.Posts.map((e) => (
            <Comment
              isPost={true}
              key={e.id}
              users={props.users}
              comment={e}
              className={"PostComponent p-4  mb-4 theme rounded-xl w-full"}
            ></Comment>
          ))}
      </div>
    </>
  );
}
