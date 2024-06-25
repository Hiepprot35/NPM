import React, { useEffect, useState } from "react";
import { fetchApiRes } from "../../function/getApi";
import useAuth from "../../hook/useAuth";
import Comment from "../home/Comment";
import "./Posts.css";
import MyComment from "../home/MyComment";
import { FiGrid, FiLayout } from "react-icons/fi";
import { useRealTime } from "../../context/useRealTime";
import SharingScreen from "./SharingScreen";
export default function Posts(props) {
  const { auth } = useAuth();
  
  //       .filter((e) => e.content.includes("imgSplitLink"))
  //       .map((e) => ({
  //         userID: e.userID,
  //         img: e.content.split("imgSplitLink")[1],
  //         id: e.id, // Keep the id
  //         create_at: e.create_at,
  //       }));
  //     props.setImgContent(dataImg);
  //     setPost(dataUpdate);
  //   };
  //   getPost();
  //   return () => {
  //     props.setImgContent();
  //     setPost();
  //   };
  // }, [props.username]);

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
        className={`mb-8 pl-12 w-full  ${gridView && "grid grid-cols-2 gap-2"}	`}
      >
        {
          props.Posts.map((e) => (
            <Comment
              key={e.id}
              users={props.users}
              comment={e}
              setCurrentImg={props.setCurrentImg}
              className={"PostComponent p-4  mb-8 theme rounded-xl w-full"}
            ></Comment>
          ))}
      </div>
    </>
  );
}
