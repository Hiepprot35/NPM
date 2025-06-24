import { Card, Popover } from "antd";
import parse, { domToReact } from "html-react-parser";
import { memo, useEffect, useRef, useState } from "react";
import { FiVideo } from "react-icons/fi";
import * as timeUse from "../../function/getTime";
import useAuth from "../../hook/useAuth";
import { Image } from "../home/home";
import { IsLoading } from "../Loading";
import "./message.css";
import { fetchVideoTitle, movieApi } from "./windowchat";
import Meta from "antd/es/card/Meta";
export default memo(function Message({
  message,
  i,
  own,
  student,
  Online,
  messages,
  userID,
  setShowImgMess,
  updateMess,
}) {
  const time = useRef(null);
  const seen_text = useRef(null);
  const messageRef = useRef(null);
  const [listAnh, setListAnh] = useState([]);
  useEffect(() => {
    if (Number(message.isFile) === 1) {
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
  const checkMessage = async (msg) => {
    const youtubeRegex =
      /http(?:s)?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})(?:&[\w;=]*)*/;
    const movieFilmsRegex = /\/movie\/moviedetail\/.+$/;

    let updatedMessage = { ...msg };

    if (youtubeRegex.test(msg.content)) {
      const url = msg.content.match(youtubeRegex);
      const videoId = url[1];
      updatedMessage.linkTitle = await fetchVideoTitle(videoId);
      updatedMessage.linkImg = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      updatedMessage.url = url[0];
    } else if (movieFilmsRegex.test(msg.text)) {
      const paramUrl = msg.text.split("movie/moviedetail/")[1];
      const pics = await movieApi(paramUrl);
      updatedMessage.linkTitle = pics.title;
      updatedMessage.linkImg = pics.img;
      updatedMessage.url = msg.content;
    }

    setupdateMessage(updatedMessage);
  };
  const [updateMessage, setupdateMessage] = useState(message);
  useEffect(() => {
    if (message) {
      checkMessage(message);
    }
  }, [message]);

  // const checkComment = async (e) => {
  //   let updatedComment = e;
  //   const youtubeRegex =
  //     /http(?:s)?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})(?:&[\w;=]*)*/;

  //   const movieFilmsRegex = /\/movie\/moviedetail\/.+$/;
  //   if (youtubeRegex.test(e)) {
  //     const url = e.match(youtubeRegex);
  //     const videoId = url[1];
  //     const videoTitle = await fetchVideoTitle(videoId);
  //     const imgUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  //     const newUrl = `
  //     <div className="flex-column ">
  //       <a href=${url[0]}">
  //       <p className="text-white underline py-3 font-bold">
  //       ${url[0]}
  //       </p>
  //         <div className="cardMess">
  //           <img className="w-full aspect-[16/9] rounded object-cover" src="${imgUrl}"></img>
  //           <div className="titleMess">
  //             <p className="hiddenText font-bold text-lg hover:underline">${videoTitle}</p>
  //           </div>
  //         </div>
  //         </a>
  //         </div>
  //       `;
  //     updatedComment = `

  //     ${newUrl}
  //     `;
  //   } else if (movieFilmsRegex.test(e)) {
  //     const paramUrl = e.split("movie/moviedetail/")[1];
  //     const pics = await movieApi(paramUrl);
  //     const data = `
  //       <div className="columnFlex">
  //         <a href="${e}">
  //         <p className="white ">
  //         ${e}
  //         </p>
  //           <div className="cardMess">
  //             <img className="commentImg" src="https://image.tmdb.org/t/p/original/${pics.img}"></img>
  //             <div className="titleMess">
  //               <p className="hiddenText">${pics.title}</p>
  //             </div>
  //           </div>
  //         </a>
  //       </div>`;
  //     updatedComment = data;
  //   }
  //   return updatedComment;
  // };
  const [processedComment, setProcessedComment] = useState("");
  // const options = {
  //   replace: ({ name, attribs, children }) => {
  //     if (name === "div" && attribs && attribs.classname === "callMess") {
  //       return (
  //         <div className="callMess bg-gray pr-4 flex center">
  //           <div className="circleButton center">
  //             <FiVideo></FiVideo>
  //           </div>
  //           {domToReact(children)}
  //         </div>
  //       );
  //     }
  //   },
  // };

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
        const heasdsad = processedData.join("");
        // Hợp nhất kết quả thành một chuỗi
        setProcessedComment(heasdsad);
      }
    };

    processComment();
  }, [message]);

  return (
    <>
      <div className="containerMessage" ref={messageRef}>
       
        {message ? (
          <div
            className={
              own ? `message own own_${messName()}` : `message ${messName()}`
            }
          >
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
                {message.content && (
                  <Popover
                    trigger={"hover"}
                    placement={own ? "left" : "right"}
                    overlayStyle={{ padding: 0 }}
                    content={
                      <p style={{ padding: 0 }} ref={time}>
                        {timeUse.formatDate(message.createdAt)}
                      </p>
                    }
                  >
                    <div
                      className={`Mess_seen_text flex ${
                        listAnh?.length > 3
                          ? `gridMessImg grid grid-cols-3`
                          : listAnh?.length === 2
                          ? ` gridMessImg grid grid-cols-${listAnh?.length}`
                          : ""
                      }`}
                      style={
                        message.content.includes(`className="maskUserChange"`)
                          ? { width: "100%" }
                          : {}
                      }
                    >
                      {Number(message.isFile) === 1 ? (
                        <>
                          {listAnh &&
                            listAnh.map((e, i) => (
                              <img
                                alt="avatar"
                                key={i}
                                onClick={() => setShowImgMess(e)}
                                className={`cursor-pointer rounded ${
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
                        <div>{parse(message.content)}</div>
                      ) : updateMessage.linkImg ? (
                        <div className="m-3">
                          <a href={`${updateMessage.url}`}>
                            <Card
                              hoverable
                              headStyle={{
                                backgroundColor: "##0084FF",
                              }}
                              bodyStyle={{ backgroundColor: "##0084FF" }}
                              bordered={false}
                              style={{ width: 300 }}
                              cover={
                                <img
                                  alt="ok"
                                  className="w-full object-contain	h-full	"
                                  src={`${updateMessage.linkImg}`}
                                ></img>
                              }
                            >
                              <Meta
                                title={updateMessage.linkTitle}
                                description={updateMessage.url}
                              ></Meta>
                            </Card>
                          </a>
                        </div>
                      ) : (
                        <div className="messageText center text-wrap break-all px-4 py-2">
                          {parse(processedComment)}
                        </div>
                      )}
                    </div>
                  </Popover>
                )}
              </div>

              {message.isSeen === 1 && i === 0 && own ? (
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
                    Seen at {timeUse.getTime(message.Seen_at)}
                  </p>
                </div>
              ) : (
                messages.indexOf(message) === 0 &&
                own && (
                  <div className="Seen_field">
                    <span
                      ref={seen_text}
                      style={{ fontSize: "0.9rem", color: "gray" }}
                    >
                      {
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
