import { useState, useEffect, useRef, memo } from "react";
import BlobtoBase64 from "../../function/BlobtoBase64";
import "./message.css";
import * as timeUse from "../../function/getTime";
import { IsLoading } from "../Loading";
import useAuth from "../../hook/useAuth";
import { useSocket } from "../../context/socketContext";
export default memo(function Message({
  message,
  own,
  student,
  Online,
  listSeen,
  userID,
  first,
  end,
  mid,
  alone,
}) {
  const time = useRef(null);
  const { auth } = useAuth();
  const socket = useSocket();
  const seen_text = useRef(null);
  const messageRef = useRef(null);
  const [listAnh, setListAnh] = useState();

  useEffect(() => {
    if (message.isFile === 1) {
      const data = message.content.split(",");
      setListAnh(data);
    }
  }, []);
  function checkMess() {
    if (first) {
      return "firstMessage";
    }
    if (mid) {
      return "midMessage";
    }
    if (end) {
      return "endMessage";
    } else {
      return "";
    }
  }
  return (
    <>
      <div className="containerMessage" ref={messageRef}>
        {message ? (
          <div
            className={
              own ? `message own ${checkMess()}` : `message ${checkMess()}`
            }
          >
            {}
            <div className="Mess_seen_container">
              <div className="messageTop">
                {!own && student?.img && message.content !== null && (
                  <>
                    {(alone || end) && (
                      <div className={`avatar_dot`}>
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
                {message.content != null ? (
                  <div className={`Mess_seen_text  `}>
                    {message.isFile ? (
                      <>
                        {listAnh &&
                          listAnh.map((e) => (
                            <img
                              className={listAnh.length > 1 ? "listImg" : ""}
                              src={e}
                            ></img>
                          ))}
                      </>
                    ) : (
                      <p className={`messageText `}>{message.content}</p>
                    )}
                    <div className="messageBottom">
                      <p ref={time}>{timeUse.getTime(message.created_at)}</p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {student && message?.id === listSeen?.id && listSeen && (
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
