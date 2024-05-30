import { default as React, useEffect, useRef, useState } from "react";
import "./myComment.scss";
import { FiSend, FiSmile } from "react-icons/fi";
import { fetchApiRes } from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
import EmojiPicker from "emoji-picker-react";
import parseUrl from "parse-url";
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
    const result = await fetchApiRes("getallstudent");
    setMyFriendList(result.result);
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
        setOpenTag(false);
      }
    }
  };
  const [TagName, setTagName] = useState([]);
  const [countText, setCountText] = useState(0);
  const handleInputChange = () => {
    if (inputRef.current) {
      if (inputRef.current.innerHTML.length >= 0) {
        setMyComment(inputRef.current.innerHTML);
        setCountText(inputRef.current.innerHTML.length);
      }
    } else {
      console.log(myComment);
    }
  };

  useEffect(() => {
    OpenTag && getFriendList();
  }, [OpenTag]);

  useEffect(() => {
    setFilterTag([...myFriendList]);
  }, [myFriendList]);

  const tagHandle = (e) => {
    if (inputRef.current) {
      const inputText = inputRef.current.innerHTML;

      setTagName((pre) => [...pre, e.Name]);
      inputRef.current.innerHTML = inputText.replace(
        "@",
        `<span class="tagNameHref"  data-lexical-text=${e.MSSV} >${e.Name}</span> `
      );
      handleInputChange();
      setOpenTag(false);
      setFilterTag();
    }
  };
  const [ImgView, setImgView] = useState([]);
      const pastImg=(e)=>
        {
          const clipboardData = e.clipboardData || window.clipboardData;
          const items = clipboardData.items;
          
          console.log(clipboardData)
          for (let i = 0; i < items.length; i++) {
            if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
              e.preventDefault();
              const file = items[i].getAsFile();
              // setMyComment(pre=>[p])
              setImgView(pre=>[...pre,URL.createObjectURL(file)])
              // Bạn có thể xử lý thêm tệp hình ảnh ở đây, chẳng hạn như hiển thị hoặc tải lên máy chủ
            }
        }
      
    }
  useEffect(() => {
    if (props.reply) {
      inputRef.current.focus();
    }
  }, [props.reply]);
  useEffect(() => {
    if (inputRef.current) {
      if (myComment) {
        if (myComment.includes("@")) {
          setOpenTag(true);
          const atIndex = myComment.indexOf("@");
          const charAfterAt = myComment.slice(atIndex + 1);
          const filterUpdate = myFriendList.filter((values) =>
            values.Name.includes(charAfterAt.replace("</span>", ""))
          );
          setFilterTag(filterUpdate);
        }

        if (myComment.includes("@&nbsp") && OpenTag) {
          setOpenTag(false);
        }
      } else {
        setOpenTag(false);
      }
    }
  }, [myComment]);

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
            (updateContent = content.replaceAll(
              e.emoji,
              `<img className="emoji" src="${e.imageUrl}"> <img/>`
            ))
        );
      }
      const youtubeRegex =/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      console.log("Test",youtubeRegex.test(myComment))
      const movieFilmsRegex = /\/movie\/moviedetail\/.+$/;
      if (youtubeRegex.test(myComment)) {
        const url = myComment.match(youtubeRegex);
        const videoId=parseUrl(url[0]).query.v||parseUrl(url[0]).pathname.replace("/","")
        const videoTitle = await fetchVideoTitle(videoId);
        const imgUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const newUrl=`<a href="${"https://youtube.com/watch?v="+videoId}">${"https://youtube.com/watch?v="+videoId}<div className="cardMess"><img className="commentImg" src=${imgUrl}></img><div className="titleMess"><p className="hiddenText">${videoTitle}</p></div></div></a>`
        console.log(url[0])
        const result=myComment.replace(url[0],newUrl)
        console.log(result)
        const data = `<div className="columnFlex">${result}</div>`;
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
      inputRef.current.innerHTML = "";
      setCountText(0);
      setMyComment("");
      props.setRender((pre) => !pre);
    } catch (error) {
      console.log(error);
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
              onPaste={pastImg}
              contentEditable="true"
              onInput={(e) => handleInputChange(e)}
              onClick={getPreviousCharacter}
              suppressContentEditableWarning={true}
            ></div>
            <div className="linear" style={{ width: "100%" }}></div>
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
                style={{ padding: ".3rem" }}
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
            <div className="tagList">
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
        {
            ImgView && ImgView.map(e=><img style={{width:"10rem",aspectRatio:1}} src={e}></img>)
          }
    </>
  );
}
