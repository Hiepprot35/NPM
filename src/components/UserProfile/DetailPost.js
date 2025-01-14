import React, { useState, useEffect } from "react";
import Comment from "../home/Comment";
import { fetchApiRes } from "../../function/getApi";
import { useParams, useSearchParams } from "react-router-dom";
import MediaGrid from "../imageView/MediaGrid";

export default function DetailPost() {
  const [Post, setPost] = useState();
  const PostCard = ({ post }) => {
    const { id, content, label, createdAt, media, Name, MSSV, cutImg, img } =
      post.result;

    return (
      <div
        className="border rounded-lg shadow-md p-4 h-full overflow-hidden "
        style={{ maxWidth: "50vw" }}
      >
        {/* Thẻ tiêu đề */}
        <div className="mb-4">
          <div className="flex">
            <img className="avatarImage" src={cutImg || img}></img>
            <div className="ml-3">
              <p className="font-bold">{Name}</p>
              <p className="text-sm text-gray-500">
                {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <h2 className="text-lg font-semibold">Bài viết #{id}</h2>
        </div>

        {/* Nội dung bài viết */}
        <p className="mb-4 text-gray-200 text-ellipsis">
          {content || "Không có nội dung."}
        </p>

        {/* Label */}
        <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-600 mb-4">
          {label}
        </span>

        {/* Media */}
        {media?.length > 0 && (
          <div className="w-full h-full">
            <div className="max-h-60vh overflow-hidden rounded-2xl">
              <MediaGrid media={media} userID={query.MSSV}></MediaGrid>
            </div>
          </div>
        )}
      </div>
    );
  };
  const query = useParams();
  const getPost = async () => {
    const res = await fetchApiRes(`comment/getPostByID/${query.id}`);
    if (res) {
      setPost(res);
    }
  };
  useEffect(() => {
    getPost();
  }, []);
  return <div className="center m-4">{Post && <PostCard post={Post} />}</div>;
}
