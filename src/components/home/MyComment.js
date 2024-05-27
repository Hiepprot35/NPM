import { default as React, useEffect, useRef, useState } from "react";
import "./myComment.scss";
import { FiSend, FiSmile } from "react-icons/fi";
import { fetchApiRes } from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
import EmojiPicker from "emoji-picker-react";
import { each } from "jquery";
import { IsLoading } from "../Loading.js";
import { fetchVideoTitle, movieApi } from "../message/windowchat.js";
export default function MyComment(props) {
  const refTag = useRef();
  const inputRef = useRef();
  const [FilterTag, setFilterTag] = useState();
  const [OpenTag, setOpenTag] = useState(false);
  const [myComment, setMyComment] = useState();
  const [myFriendList, setMyFriendList] = useState([]);
  const { auth } = useAuth();
  const checkID = (array, id) => {
    return array.user1 === id ? array.user2 : array.user1;
  };
  const [isLoading, setisLoading] = useState(false);
  const getFriendList = async () => {
    const result = await fetchApiRes("message/getFriendList", "POST", {
      userID: auth.userID,
    });
    const data = result.result.map((e) => checkID(e, auth.userID));
    const users = await Promise.all(
      data.map(async (e) => {
        const data2 = await fetchApiRes(`username`, "POST", { UserID: e });
        const user = await fetchApiRes(`getStudentbyID/${data2[0]?.username}`);
        return user;
      })
    );
    console.log(users, "friend");
    setMyFriendList(users);
  };
  const getPreviousCharacter = () => {
    const selection = window.getSelection();
    if (
      selection.focusNode &&
      selection.focusNode.nodeType === Node.TEXT_NODE
    ) {
      const range = selection.getRangeAt(0);
      const offset = range.startOffset;
      const text = selection.focusNode.textContent;
      if (offset > 0) {
        const previousCharacter = text[offset - 1];
        if (previousCharacter === "@") {
          setOpenTag(true);
        }
      } else {
        console.log("câcc");

        setOpenTag(false);
      }
    }
  };
  const [TagName, setTagName] = useState([]);
  const [countText, setCountText] = useState(0);
  const handleInputChange = () => {
    if (inputRef.current) {
      if (inputRef.current.innerHTML.length <= 200) {
        setMyComment(inputRef.current.innerHTML);
        setCountText(inputRef.current.innerHTML.length);
        if (OpenTag) {
          setCountTag((pre) => pre + 1);
        }
      } else {
        // Nếu vượt quá 200 ký tự, giữ nguyên giá trị hiện tại
        inputRef.current.innerHTML = inputRef.current.innerHTML.substring(
          0,
          200
        );
      }
    } else {
    }
  };

  useEffect(() => {
    OpenTag && getFriendList();
  }, [OpenTag]);

  useEffect(() => {
    setFilterTag([...myFriendList]);
  }, [myFriendList]);

  const tagHandle = (e) => {
    setMyComment((pre) => pre + e.Name);
    if (inputRef.current) {
      const inputText = inputRef.current.innerHTML;

      setTagName((pre) => [...pre, e.Name]);
      inputRef.current.innerHTML = inputText.replace(
        "@",
        `<span class="tagNameHref"  data-lexical-text=${e.MSSV} >${e.Name}</span><span class="spanComment"> </span>`
      );
      handleInputChange();
      setOpenTag(false);
      setCountTag(0);
    }
  };
  useEffect(() => {
    if (props.reply) {
      inputRef.current.focus();
    }
  }, [props.reply]);
  const [CountTag, setCountTag] = useState(0);
  useEffect(() => {
    if (inputRef.current && myComment) {
      if (myComment.includes("@")) {
        setOpenTag(true);
        const atIndex = myComment.indexOf("@");
        const charAfterAt = myComment.slice(atIndex + 1);
        const filterUpdate = myFriendList.filter((values) =>
          values.Name.includes(charAfterAt.replace("</span>", ""))
        );
        setFilterTag(filterUpdate);
      } else {
        setOpenTag(false);
      }

      if (myComment.includes("@&nbsp") && OpenTag) {
        setOpenTag(false);
      }
      // if (!OpenTag && myComment && CountTag === 0) {
      //   addSpan("spanComment", {Name:" "});
      // }
    }
  }, [myComment, CountTag]);

  const sendComment = async (e) => {
    e.preventDefault();
    let isSending = false;
    setisLoading(true);
    try {
      let content = myComment;
      let updateContent = content;
      if (Emoji) {
        Emoji.map(
          (e) =>
            (updateContent = content.replace(
              e.emoji,
              `<img className="emoji" src="${e.imageUrl}"> <img/>`
            ))
        );
      }
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      const movieFilmsRegex = /\/movie\/moviedetail\/.+$/;
      if (youtubeRegex.test(myComment)) {
        const paramUrl = myComment.split("v=")[1];
        const videoId = paramUrl.split("&")[0];
        const videoTitle = await fetchVideoTitle(videoId);
        const videoUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const data = `<div className="columnFlex"><a href="${myComment}">${myComment}<div className="cardMess"><img className="commentImg" src=${videoUrl}></img><div className="titleMess"><p className="hiddenText">${videoTitle}</p></div></div></a></div>`;
        updateContent = data;
      } else if (movieFilmsRegex.test(myComment)) {
        const paramUrl = myComment.split("movie/moviedetail/")[1];
        const pics = await movieApi(paramUrl);
        const data = `<div className="columnFlex"><a href="${myComment}">${myComment}<div className="cardMess"><img className="commentImg" src=https://image.tmdb.org/t/p/original/${pics.img}></img><div className="titleMess"><p className="hiddenText">${pics.title}</p></div></div></a></div>`;
        updateContent = data;
      } 
      const res = await fetchApiRes("insertComment", "POST", {
        userID: auth.username,
        content: updateContent,
        movieID: props.movieID,
        replyID: props.reply,
        create_at: Date.now(),
      });
      if (res) {
        setisLoading(false);
      }
      inputRef.current.innerHTML = "";
      setMyComment("");
      props.setRender((pre) => !pre);
    } catch (error) {
      setisLoading(false);
    }
  };
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [Emoji, setEmoji] = useState([]);
  const onClickEmoji = (e) => {
    if (inputRef.current) {
      inputRef.current.innerHTML = inputRef.current.innerHTML + " " + e.emoji;
      handleInputChange();
    }
    setEmoji((prev) => {
      if (!prev.some((item) => item.emoji === e.emoji)) {
        return [...prev, { emoji: e.emoji, imageUrl: e.imageUrl }];
      }
      return prev;
    });
  };
  return (
    <>
      {
        <div
          className={` myCommentComponent ${props.className}`}
          style={props.style}
        >
          <div className="AvatarComment">
            <div className="AvatarComment2">
              <img className="avatarImage" src={`${auth.avtUrl}`}></img>
            </div>
          </div>

          <div
            className="inputDiv center"
            style={{ width: "90%", flexDirection: "column" }}
          >
            <div
              className="commentDiv"
              ref={inputRef}
              contentEditable="true"
              onInput={(e) => handleInputChange(e)}
              onClick={getPreviousCharacter}
              suppressContentEditableWarning={true}
            ></div>
            <div className="linear" style={{width:"100%"}} ></div>
            {(myComment === "<br>" || !myComment) && (
              <div className="placehoder">
                <p>
                  {props.user
                    ? `Đang trả lời bình luận của ${props.user}`
                    : "Write a comment"}
                </p>
              </div>
            )}
            <div className="featureComment">
              <div
                className=""
                style={{padding:".3rem"}}
                onClick={(e) => {
                  setOpenEmojiPicker(!openEmojiPicker);
                }}
              >
                <FiSmile></FiSmile>
                <div className="emojipick" style={{ zIndex: "6" }}>
                  <EmojiPicker
                    width={350}
                    height={450}
                    open={openEmojiPicker}
                    onEmojiClick={(e, i) => {
                      onClickEmoji(e);
                    }}
                    emojiStyle="facebook"
                  />
                </div>
                <span
                  style={{
                    color: `rgb(${(255 * countText) / 200},${
                      255 - (255 * countText) / 200
                    },${255 - (255 * countText) / 200}`,
                    marginLeft: "1rem",
                  }}
                >
                  {`${countText}/200`}{" "}
                  {countText === 200 && ` vượt quá kí tự quy định`}
                </span>
              </div>

              {myComment && myComment !== "<br>" && (
                <>
                  <span
                    className="circleButton"
                    style={{ margin: "0" }}
                    onClick={sendComment}
                  >
                    <FiSend />
                  </span>
                </>
              )}
            </div>
          </div>
          {FilterTag && OpenTag && (
            <div className="tagList ">
              {FilterTag.map((e) => (
                <div
                  className="tag"
                  style={{ margin: ".5rem" }}
                  onClick={() => tagHandle(e)}
                >
                  <img className="avatarImage" src={`${e.img}`}></img>
                  <p style={{ margin: ".3rem" }}>{e.Name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    </>
  );
}
