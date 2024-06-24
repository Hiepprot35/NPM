import { useState, useEffect, useRef, memo } from "react";
import parse, { domToReact } from "html-react-parser";
import "./message.css";
import * as timeUse from "../../function/getTime";
import { IsLoading } from "../Loading";
import useAuth from "../../hook/useAuth";
import { useSocket } from "../../context/socketContext";
import { Popover } from "antd";
import parseUrl from "parse-url";
import { fetchVideoTitle, movieApi } from "./windowchat";
import { FiCamera, FiVideo } from "react-icons/fi";
import { Image } from "../home/home";
export default memo(function Message({
  message,
  i,
  own,
  student,
  Online,
  listSeen,
  messages,
  userID,
  setShowImgMess,
  updateMess,
}) {
  const time = useRef(null);
  const { auth } = useAuth();
  const seen_text = useRef(null);
  const messageRef = useRef(null);
  const [listAnh, setListAnh] = useState();

  useEffect(() => {
    if (message.isFile === 1) {
      const data = message.content.split(",");
      setListAnh(data);
    }
  }, [message]);
  const ag = () => {
    const l = messages.length;
    const sender = message.sender_id;
    if (i === l - 1) {
      return 3;
    }
    if (i > 0 && i < l - 1) {
      const prevSender = messages[i - 1].sender_id;
      const nextSender = messages[i + 1].sender_id;
      if (prevSender === sender && nextSender === sender) {
        return 2;
      }
      if (prevSender !== sender && nextSender === sender) {
        return 1;
      }
      if (prevSender === sender && nextSender !== sender) {
        return 3;
      } else {
        return 0;
      }
    }
    return 3;
  };
  function messName() {
    if (ag() === 1) {
      return "firstMessage";
    }
    if (ag() === 2) {
      return "midMessage";
    }
    if (ag() === 3) {
      return "endMessage";
    } else {
      return "aloneMessage";
    }
  }

  const checkComment = async (e) => {
    let updatedComment = e;
    const youtubeRegex =
      /http(?:s)?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})(?:&[\w;=]*)*/;

    const movieFilmsRegex = /\/movie\/moviedetail\/.+$/;
    if (youtubeRegex.test(e)) {
      const url = e.match(youtubeRegex);
      const videoId = url[1];
      const videoTitle = await fetchVideoTitle(videoId);
      const imgUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const newUrl = `
        <a href=${url[0]}">
        <p className="text-white underline py-3">
        ${url[0]}
        </p>
          <div className="cardMess">
            <img className="w-full aspect-[16/9] rounded object-cover" src="${imgUrl}"></img>
            <div className="titleMess">
              <p className="hiddenText font-bold text-lg hover:underline">${videoTitle}</p>
            </div>
          </div>
        </a>`;
      const result = e.replaceAll(url[0], ``);
      updatedComment = `
      <div className="flex-column">
      <div className="flex">
      ${result}
      </div>
      ${newUrl}
      </div>
      `;
    } else if (movieFilmsRegex.test(e)) {
      const paramUrl = e.split("movie/moviedetail/")[1];
      const pics = await movieApi(paramUrl);
      const data = `
        <div className="columnFlex">
          <a href="${e}">
          <p className="white">
          ${e}
          </p>
            <div className="cardMess">
              <img className="commentImg" src="https://image.tmdb.org/t/p/original/${pics.img}"></img>
              <div className="titleMess">
                <p className="hiddenText">${pics.title}</p>
              </div>
            </div>
          </a>
        </div>`;
      updatedComment = data;
    }
    return updatedComment;
  };
  const [processedComment, setProcessedComment] = useState("");
  const options = {
    replace: ({ name, attribs, children }) => {
      if (name === "div" && attribs && attribs.classname === "callMess") {
        return (
          <div className="callMess bg-gray pr-4 flex center">
            <div className="circleButton center">
              <FiVideo></FiVideo>
            </div>
            {domToReact(children)}
          </div>
        );
      }
    },
  };

  useEffect(() => {
    const processComment = async () => {
      if (message.content) {
        const data = message.content.split("emojiLink");

        const processedData = data.map((e) => {
          if (e.includes("https://cdn.jsdelivr.net")) {
            return `<span><img alt="icon" style="width: 1rem; height: 1rem; margin: .1rem;" src="${e}"/></span>`;
          }
          return e; // Trả về phần tử gốc nếu không phải là URL cần kiểm tra
        });

        // Hợp nhất kết quả thành một chuỗi
        setProcessedComment(await checkComment(processedData.join("")));
      }
    };

    processComment();
  }, [message.content]);

  return (
    <>
      <div className="containerMessage" ref={messageRef}>
        {message ? (
          <div
            className={
              own ? `message own own_${messName()}` : `message ${messName()}`
            }
          >
            {}
            <div className="Mess_seen_container">
              <div className="messageTop">
                {!own && student && message.content !== null && (
                  <>
                    {(ag() === 0 || ag() === 3) && (
                      <div className="Avatar_status">
                        <Image
                          className="avatarImage max-w-none"
                          src={student?.img}
                        />
                        <span
                          className={`dot ${
                            Online && Online.some((e) => e.userId === userID)
                              ? "activeOnline"
                              : ""
                          }`}
                        ></span>
                      </div>
                    )}
                  </>
                )}
                {message.content != null && (
                  <Popover
                    placement={own ? "left" : "right"}
                    overlayStyle={{ padding: 0 }}
                    content={
                      <p style={{ padding: 0 }} ref={time}>
                        {timeUse.getTime(message.created_at)}
                      </p>
                    }
                  >
                    <div
                      className={`Mess_seen_text flex ${
                        listAnh?.length > 1 && "grid grid-cols-3"
                      }  `}
                      style={
                        message.content.includes(`className="maskUserChange"`)
                          ? { width: "100%" }
                          : {}
                      }
                    >
                      {message.isFile ? (
                        <>
                          {listAnh &&
                            listAnh.map((e, i) => (
                              <img
                                key={i}
                                alt="Image"
                                onClick={() => setShowImgMess(e)}
                                className={`cursor-pointer ${
                                  listAnh?.length > 1 && "listImg"
                                }`}
                                style={
                                  e.includes("emoji")
                                    ? { width: "1rem ", height: "1rem " }
                                    : {}
                                }
                                src={e}
                              ></img>
                            ))}
                        </>
                      ) : message.content &&
                        message.content.includes(
                          `className="maskUserChange"`
                        ) ? (
                        parse(message.content)
                      ) : (
                        <div className="messageText center text-wrap break-all px-4 py-2">
                          {parse(processedComment, options)}
                        </div>
                      )}
                    </div>
                  </Popover>
                )}
              </div>

              {(student && listSeen&&
                parseInt(message?.created_at) ===
                  parseInt(listSeen?.created_at) &&
                listSeen?.Seen_at) ||
              parseInt(message.id) === parseInt(listSeen?.id) ? (
                <div className="Seen_field">
                  <img
                    className="avatarImage"
                    style={{ width: "1rem", height: "1rem" }}
                    src={student.img ? `${student?.img}` : ""}
                    alt="sender"
                  />
                  <p
                    ref={seen_text}
                    style={{ fontSize: "0.9rem", color: "gray" }}
                  >
                    Seen at {timeUse.getTime(listSeen?.Seen_at)}
                  </p>
                </div>
              ) : (
                messages.indexOf(message) === messages.length - 1 &&
                own && (
                  <div className="Seen_field">
                    <span
                      ref={seen_text}
                      style={{ fontSize: "0.9rem", color: "gray" }}
                    >
                      {!message.Seen_at &&
                        message.content &&
                        !message.content.includes(
                          `className="maskUserChange"`
                        ) &&
                        (updateMess ? "Đang gửi" : "Đã gửi")}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <IsLoading />
        )}
      </div>
    </>
  );
});
