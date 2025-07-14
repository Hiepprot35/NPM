import { Popover } from "antd";
import EmojiPicker from "emoji-picker-react";
import { default as React, useEffect, useRef, useState } from "react";
import { FiSend, FiSmile, FiX, FiXCircle } from "react-icons/fi";
import { fetchApiRes } from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
import MediaGrid from "../imageView/MediaGrid.js";
import Upload from "../imageView/Upload.js";
import { IsLoading } from "../Loading.js";
import Select from "../home/Select.js";
import useNoti from "../../hook/useNoti.js";
import { shareType } from "../../public/enum/enum.js";
export default function MyPost(props) {
  const { update,className } = props;
  const inputRef = useRef();
  const [FilterTag, setFilterTag] = useState();
  const [OpenTag, setOpenTag] = useState(false);
  const [myComment, setMyComment] = useState();
  const [myFriendList, setMyFriendList] = useState([]);
  const { auth, myInfor } = useAuth();

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
  const [ImgFile, setImgFile] = useState([]);
  const pastImg = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
        e.preventDefault();
        const file = items[i].getAsFile();
        setImgFile(file);
        setImgView([URL.createObjectURL(file)]);
      }
    }
  };
  const [VideosUpload, setVideosUpload] = useState([]);
  function pick_imageMess(e) {
    const imgMessFile = e.target.files;
    for (let i = 0; i < imgMessFile.length; i++) {
      console.log("type,", imgMessFile[i].type);
      if (imgMessFile[i].type === "video/mp4") {
        setVideosUpload((pre) => [...pre, URL.createObjectURL(imgMessFile[i])]);
      } else {
        setImgView((pre) => [...pre, URL.createObjectURL(imgMessFile[i])]);
      }
      setImgFile((pre) => [...pre, imgMessFile[i]]);
    }
  }
  const handleRemoveImage = () => {
    setImgFile([]);
    setImgView([]);
  };
  useEffect(() => {
    console.log(myComment);
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
  const [ShareType, setShareType] = useState(0);
  const { setNotiText } = useNoti();
  useEffect(() => {
    console.log(ShareType);
  }, [ShareType]);
  const sendComment = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      let content = myComment;
      let updateContent = content;
      if (Emoji) {
        Emoji.map(
          (e) =>
            (updateContent = content.replaceAll(
              e.emoji,
              `<img className="emoji" src="${e.imageUrl}"/>`
            ))
        );
      }
      const form = new FormData();
      form.append("userID", auth.userID);
      form.append("content", updateContent || "");
      if (props.movieID) {
        form.append("movieID", props.movieID);
      }
      form.append("replyID", props.reply || -1);
      form.append("share", ShareType);
      if (ImgFile) {
        for (const file of ImgFile) {
          form.append("images", file);
        }
      }
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/insertComment`,
        { method: "POST", body: form }
      );
      const newComment = await res.json();
      if (update) {
        update((pre) => [
          {
            ...newComment,
          },
          ...pre,
        ]);
      }
      setNotiText({
        message: "Post success",
        title: "Post Notificantion",
        type: "success",
      });
      inputRef.current.innerHTML = "";
      setCountText(0);
      setImgFile([]);
      setImgView([]);
      setVideosUpload([]);
      setMyComment("");
      if (props.setRender) {
        props.setRender((pre) => !pre);
      }
    } catch (error) {
      console.log(error);
      setNotiText({
        message: "Post error, someting is wrong. :((",
        title: "Post Notificantion",
        type: "error",
      });
    } finally {
      setisLoading(false);
    }
  };
  const [Emoji, setEmoji] = useState([]);
  useEffect(() => {
    console.log(
      ImgView.map((e, index) => ({ url: e, id: index, type: "image" }))
    );
  }, [ImgView]);
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
      {isLoading && <div className="bg-indigo-600 bg-opacity-25">Loading...</div>}

      <div
        className={`w-full h-full p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-md flex gap-4 ${className}`}
      >
        <img
          alt="avatar"
          className="rounded-full w-12 h-12 object-cover"
          src={myInfor?.avtUrl}
        />

        <div className="flex flex-col w-full gap-3">
          <div className="relative">
            {(!myComment || myComment === "<br>") && (
              <div
                className="absolute inset-0 flex items-center px-4 text-gray-400 cursor-text"
                onClick={() => inputRef.current.focus()}
              >
                {myInfor.Name} ơi đang nghĩ gì thế
              </div>
            )}
            <div
              ref={inputRef}
              onPaste={pastImg}
              onInput={handleInputChange}
              onClick={getPreviousCharacter}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[3rem] max-h-32 overflow-y-auto bg-slate-100 dark:bg-slate-700 rounded-3xl px-4 py-2 text-sm"
            />
          </div>

          {ImgView.length > 0 && (
            <div className="relative group">
              <button
                onClick={handleRemoveImage}
                className="absolute right-0 top-0 m-2 p-1 rounded-full bg-white/70 group-hover:opacity-100 opacity-0 transition"
              >
                <FiX />
              </button>
              <div className="w-full flex justify-center">
                <MediaGrid
                  isView={true}
                  media={ImgView.map((url) => ({ url, type: "image" }))}
                />
              </div>
            </div>
          )}

          <div className="flex items-center flex-wrap gap-2">
            <Popover
              trigger="click"
              content={
                <EmojiPicker
                  width={350}
                  height={450}
                  onEmojiClick={onClickEmoji}
                  emojiStyle="facebook"
                />
              }
            >
              <button className="circleButton">
                <FiSmile />
              </button>
            </Popover>

            <Upload pick_imageMess={pick_imageMess} />
            <Select options={shareType} onChange={setShareType} />

            <span
              style={{
                color: `rgb(${(255 * countText) / 200}, ${255 - (255 * countText) / 200}, ${255 - (255 * countText) / 200})`,
              }}
              className="text-sm"
            >
              {`${countText}/200`} {countText === 200 && `vượt quá kí tự quy định`}
            </span>

            {VideosUpload &&
              VideosUpload.map((e, i) => (
                <video
                  key={i}
                  src={typeof e === "string" ? e : URL.createObjectURL(e)}
                  controls
                  className="w-64 rounded"
                ></video>
              ))}

            {(myComment && myComment !== "<br>") || ImgFile ? (
              <button className="circleButton ml-auto" onClick={sendComment}>
                <FiSend />
              </button>
            ) : null}
          </div>

          {FilterTag && OpenTag && (
            <div className="flex flex-wrap gap-2 mt-2">
              {FilterTag.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 rounded-full px-3 py-1 cursor-pointer"
                  onClick={() => tagHandle(e)}
                >
                  <img
                    src={e.img}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <p className="text-sm">{e.Name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
