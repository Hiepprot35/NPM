import React, { useEffect, useState } from "react";
import Layout from "../Layout/layout";
import { fetchApiRes } from "../../function/getApi";
import UseToken from "../../hook/useToken";
import Comment from "../home/Comment";
import { Outlet, useNavigate } from "react-router-dom";
import MyComment from "../home/MyComment";
import MyPost from "../blog/myPost";

export default function NewFeed() {
  const { AccessToken } = UseToken();
  const [newFeedPost, setNewFeedPost] = useState([]);
  const navigate = useNavigate();
  window.document.title = "New Feed";
  const handleImageClick = (imageId) => {
    navigate(`/photo/${imageId}`); // Thay thế useHistory bằng useNavigate
  };
  const getNewfeed = async () => {
    try {
      const res = await fetchApiRes('/getNewfeed')
      if (!res.ok) {
        throw new Error("Failed to fetch new feed");
      }

      const { result } = await res.json();
      
      // Fetch media for each comment
      const mediaPromises = result.map(async (e) => {
        try {
          const data = await fetchApiRes(`comment/getMedia/?commentId=${e.id}`);
          return data.result;
        } catch (error) {
          //   console.error(`Failed to fetch media for comment ${e.id}:`, error);
          return null;
        }
      });

      // Wait for all media promises to resolve
      const medias = await Promise.all(mediaPromises);

      // Combine the results (if needed) and set the state
      setNewFeedPost(
        result.map((post, index) => ({
          ...post,
          media: medias[index], // Attach media to the corresponding post
        }))
      );
    } catch (error) {
      console.error("Error fetching new feed:", error);
    }
  };

  useEffect(() => {
    getNewfeed();
  }, []); // Add AccessToken to dependencies if it can change

  return (
    <>
      <div className=" w-full center flex-col">
        <div className="w-50vw ">
        <div className="mb-4 w-full ">
      <div className="w-full center  ">

        <MyPost></MyPost>
      </div>
        </div>
          <div className={`mb-8  w-full 	`}>
            {newFeedPost.map((e) => (
              <Comment
                key={e.id}
                comment={e}
                isPost={true}
                className={"PostComponent p-4  mb-4 theme rounded-xl w-full"}
              />
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
