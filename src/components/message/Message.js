import { useState, useEffect, useRef, memo } from "react";
import parse from "html-react-parser";
import "./message.css";
import * as timeUse from "../../function/getTime";
import { IsLoading } from "../Loading";
import useAuth from "../../hook/useAuth";
import { useSocket } from "../../context/socketContext";
import { Popover } from "antd";
export default memo(function Message({
  message,
  i,
  own,
  student,
  Online,
  listSeen,
  messages,
  userID,
  setImgMess,setShowImgMess,
  updateMess,
}) {
  const time = useRef(null);
  const { auth } = useAuth();
  const seen_text = useRef(null);
  const messageRef = useRef(null);
  const [listAnh, setListAnh] = useState();
  useEffect(() => {
    console.log(message.content);
  }, [message.content]);
  useEffect(() => {
    if (message.isFile === 1) {
      const data = message.content.split(",");
      setImgMess(pre=>[...pre,...data])
      setListAnh(data);
    }
  }, []);
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
  const ccc = () => {
    return (
      <>
        {message?.content.includes("https://cdn.jsdelivr.net") ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: ".4rem",
            }}
          >
            {message.content.split("emojiLink").map((e, index) =>
              e.includes("https://cdn.jsdelivr.net") ? (
                <span key={index}>
                  <img
                    alt="icon"
                    style={{ width: "1rem", height: "1rem", margin: ".1rem" }}
                    src={`${e}`}
                  />
                </span>
              ) : (
                e.length > 0 && (
                  <span style={{ marginBottom: ".4rem" }} key={index}>
                    {e}
                  </span>
                )
              )
            )}
          </div>
        ) : (
          <span>{parse(message.content)}</span>
        )}
      </>
    );
  };

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
                {!own && student?.img && message.content !== null && (
                  <>
                    {(ag() === 0 || ag() === 3) && (
                      <div className={`Avatar_status`}>
                        <img
                          className="avatarImage"
                          src={student.img ? `${student?.img}` : ""}
                          alt="sender"
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
                    <div className={`Mess_seen_text  `}>
                      {message.isFile ? (
                        <>
                          {listAnh &&
                            listAnh.map((e, i) => (
                              <img
                                key={i}
                                onClick={()=>setShowImgMess(e)}

                                className="listImg"
                                style={
                                  e.includes("emoji")
                                    ? { width: "1rem ", height: "1rem " }
                                    : {}
                                }
                                src={e}
                              ></img>
                            ))}
                        </>
                      ) : (
                        <div className="messageText">{ccc()}</div>
                      )}
                    </div>
                  </Popover>
                )}
              </div>

              {student &&
              parseInt(message?.created_at) ===
                parseInt(listSeen?.created_at) &&
              listSeen ? (
                <div className="Seen_field">
                  <img
                    className="avatarImage"
                    style={{ width: "20px", height: "20px" }}
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
                      {updateMess ? "Đang gửi" : "Đã gửi"}
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
