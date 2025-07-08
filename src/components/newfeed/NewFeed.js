import React, { useEffect, useRef, useState } from "react";
import Layout from "../Layout/layout";
import { fetchApiRes } from "../../function/getApi";
import UseToken from "../../hook/useToken";
import Comment from "../home/Comment";
import { Outlet, useNavigate } from "react-router-dom";
import MyPost from "../blog/myPost";

export default function NewFeed() {
  const { AccessToken } = UseToken();
  const [newFeedPost, setNewFeedPost] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();
  const navigate = useNavigate();

  const handleImageClick = (imageId) => {
    navigate(`/photo/${imageId}`);
  };

  const getNewfeed = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { result } = await fetchApiRes(`getNewfeed?page=${pageNumber}&limit=2`, "GET");

      const mediaPromises = result.map(async (e) => {
        try {
          const data = await fetchApiRes(`comment/getMedia/?commentId=${e.id}`);
          return data.result;
        } catch {
          return null;
        }
      });

      const medias = await Promise.all(mediaPromises);

      const newData = result.map((post, index) => ({
        ...post,
        media: medias[index],
      }));

      setNewFeedPost((prev) => [...prev, ...newData]);
      setHasMore(result.length > 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching new feed:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getNewfeed(page);
  }, [page]);

  // IntersectionObserver để auto load khi cuộn xuống
  const lastPostRef = useRef();
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1,
      }
    );

    if (lastPostRef.current) observer.observe(lastPostRef.current);
    return () => {
      if (lastPostRef.current) observer.unobserve(lastPostRef.current);
    };
  }, [loading, hasMore]);

  return (
    <>
      <div className="w-full center flex-col">
        <div className="w-50vw">
          <div className="mb-4 w-full center">
            <MyPost />
          </div>

          <div className="mb-8 w-full">
            {newFeedPost.map((e, i) => {
              const isLast = i === newFeedPost.length - 1;
              return (
                <div ref={isLast ? lastPostRef : null} key={e.id}>
                  <Comment
                    comment={e}
                    isPost={true}
                    className="PostComponent p-4 mb-4 theme rounded-xl w-full"
                    setRefeshPost={setLoading}
                  />
                </div>
              );
            })}

            {loading && <p className="text-center text-sm text-gray-500">Đang tải thêm...</p>}
            {!hasMore && <p className="text-center text-sm text-gray-400">Đã hết bài viết.</p>}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
