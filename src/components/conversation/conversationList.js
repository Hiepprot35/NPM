import React, { useEffect, useRef, useState } from "react";
import { getConversation } from "../../function/getApi";
import { FaFacebookMessenger } from "react-icons/fa";
import moment from "moment";
import useAuth from "../../hook/useAuth";
import { parseMessage } from "../../function/getTime";
import { useData } from "../../context/dataContext";
import parse from "html-react-parser";
import Windowchat from "../message/windowchat";
import { useSocket } from "../../context/socketContext";

export default function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const {
    setConversationContext,
    setListWindow,
    setListHiddenBubble,
    ConversationContext,
  } = useData();
  const { auth } = useAuth();
  const limit = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const socket = useSocket();

  const listRef = useRef();

  const onClickConser = (c) => {
    setListWindow((prev) => {
      const exists = prev.some((e) => e.id === c.id);

      if (exists) return prev;

      const newList = [...prev, c];

      if (newList.length > 3) {
        const removed = newList.shift();
        setListHiddenBubble((prevHidden) => [
          ...prevHidden.filter((e) => e.id !== c.id),
          removed,
        ]);
      }

      return newList;
    });

    setListHiddenBubble((prev) => prev.filter((e) => e.id !== c.id));
  };

  useEffect(() => {
    console.log(
      ConversationContext,
      "ConversationContextConversationContextConversationContext"
    );
  }, [ConversationContext]);
  // useEffect(() => {
  //   if (socket && auth?.userID) {
  //     const handleMessage = async (data) => {
  //       if (data.sender_id !== auth?.userID) {
  //         const obj = { ...data?.conversation };
  //         // setListHiddenBubble((prev) => prev.filter((e) => e.id !== obj.id));
  //         // const conversationExists = listWindow.some(
  //         //   (item) => item.id === obj.id
  //         // );
  //         // if (!conversationExists) {
  //         //   setListWindow((prev) => [...prev, { id: obj.id }]);
  //         // }

  //         // setConversationContext((prev) => {
  //         //   const updatedConversations = prev.filter((e) => e.id !== obj.id);
  //         //   updatedConversations.push(obj);
  //         //   return updatedConversations;
  //         // });
  //         document.title = `${
  //           obj.user1 === auth.userID ? obj.user2_mask : obj.user1_mask
  //         } gửi tin nhắn`;

  //       }

  //       // Play notification sound after user interaction
  //       try {
  //         const playNotification = () => {
  //           const audio = new Audio("/notifi.mp3");
  //           audio.play().catch((error) => {
  //             console.error("Audio playback failed:", error);
  //           });
  //         };

  //         // Check if user has interacted with the document
  //         if (document.body.userHasInteracted) {
  //           playNotification();
  //         } else {
  //           // Add event listener for first interaction
  //           const enableAudio = () => {
  //             document.body.userHasInteracted = true;
  //             playNotification();
  //             document.removeEventListener("click", enableAudio); // Remove listener after interaction
  //           };
  //           document.addEventListener("click", enableAudio);
  //         }
  //       } catch (error) {
  //         console.log("Error playing notification sound:", error);
  //       }
  //     };

  //     socket.on("getMessage", handleMessage);

  //     return () => {
  //       socket.off("getMessage", handleMessage);
  //     };
  //   }
  // }, [socket, auth]);
  const ClickConversationHandle = (conversation) => {
    onClickConser({ id: conversation.id });
    setConversationContext((pre) => {
      const filtered = pre.filter((e) => e.id !== conversation.id);
      return [...filtered, conversation];
    });
  };
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await getConversation({ page, limit });
      const data = res?.result?.result || [];
      setConversations((prev) => [...prev, ...data]);
      if (data.length < limit) setHasMore(false);
    } catch (err) {
      console.error("Lỗi khi lấy conversations:", err);
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, [page]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || loading || !hasMore) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setPage((prev) => prev + 1);
    }
  };

  const formatTimeAgo = (date) => {
    return moment(date).fromNow(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end">
      {/* Nút popup và danh sách */}
      <div className="flex flex-row">
        {ConversationContext.map((e, i) => (
          <div className='w-[400px]'>

          <Windowchat key={e.id} count={e} index={i} isHidden={false} bubbleHeight={openPopup ? 42 : 6} />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end space-y-4">
        {!openPopup && (
          <div
            className="flex items-center justify-between bg-white rounded-full px-4 py-3 shadow-2xl w-[220px]  h-16 hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpenPopup(true)}
          >
            <div className="flex items-center space-x-2">
              <FaFacebookMessenger className="text-black text-xl" />
              <span className="font-semibold text-black">Messages</span>
            </div>
            <div className="flex -space-x-2">
              {conversations.slice(0, 3).map((e, i) => (
                <img
                  key={i}
                  src={e.cutImg || e.img}
                  alt={`img-${i}`}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>
        )}

        {openPopup && (
          <div className="w-[350px] h-[40rem] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Messages</h2>
              <button
                onClick={() => setOpenPopup(false)}
                className="text-xl hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* Danh sách tin nhắn */}
            <div
              ref={listRef}
              onScroll={handleScroll}
              className="flex-1 px-4 py-2 space-y-3 overflow-y-auto"
            >
              {conversations.map((conv, index) => (
                <div
                  key={index}
                  onClick={() => ClickConversationHandle(conv)}
                  className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 cursor-pointer"
                >
                  <img
                    src={conv.cutImg || conv.img}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-base">
                      {conv.nameConver}
                    </div>
                    <div className="text-sm text-gray-500 truncate overflow-hidden max-w-[250px] flex">
                      {conv.sender_id === auth.userID
                        ? "You: "
                        : `${conv.nameConver}: `}
                      {parse(parseMessage(conv.content))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatTimeAgo(conv.mesCreatedAt)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-center text-sm text-gray-400 py-2">
                  Đang tải...
                </div>
              )}

              {!conversations.length && !loading && (
                <div className="text-center text-sm text-gray-400 py-4">
                  Không có cuộc trò chuyện nào
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
