import { Popover } from "antd";
import EmojiPicker from "emoji-picker-react";
import { default as React, useEffect, useRef, useState } from "react";
import { FiSend, FiSmile } from "react-icons/fi";
import { fetchApiRes } from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
import MediaGrid from "../imageView/MediaGrid.js";
import Upload from "../imageView/Upload.js";
import "./myComment.scss";
import { IsLoading } from "../Loading.js";
import Select from "./Select.js";
import useNoti from "../../hook/useNoti.js";
import { shareType } from "../../public/enum/enum.js";
export default function MyComment(props) {
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
      if (imgMessFile[i].type.includes('video')) {
        setVideosUpload((pre) => [...pre, URL.createObjectURL(imgMessFile[i])]);
      } else {
        setImgView((pre) => [...pre, URL.createObjectURL(imgMessFile[i])]);
      }
      setImgFile((pre) => [...pre, imgMessFile[i]]);
    }
  }

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
  const {setNotiText} = useNoti()
  const [ShareType, setShareType] = useState(0);
  useEffect(() => {
   console.log(ShareType)
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
      setNotiText({message:'Post success',title:'Post Notificantion',type:'success'})
   
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
      {isLoading && (
        <IsLoading className={"bg-indigo-600 bg-opacity-25"}></IsLoading>
      )}
      {
        <div
          className={` myCommentComponent ${props.className}`}
          style={props.style}
        >
          <div className="AvatarComment">
            <div className="AvatarComment2">
              <img
                alt="avatar"
                className="avatarImage"
                src={`${myInfor?.avtUrl}`}
              ></img>
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
            {ImgView && (
              <div className="w-30vh">
                <MediaGrid
                  media={ImgView.map((e, index) => ({
                    url: e,
                    id: index,
                    type: "image",
                  }))}
                ></MediaGrid>
              </div>
            )}
            <div className="featureComment">
              <div className="flex items-center">
                <Popover
                  trigger={"click"}
                  content={
                    <EmojiPicker
                      width={350}
                      height={450}
                      onEmojiClick={(e, i) => {
                        onClickEmoji(e);
                      }}
                      emojiStyle="facebook"
                    />
                  }
                >
                  <div>
                    <span className="circleButton">
                      <FiSmile></FiSmile>
                    </span>
                  </div>
                </Popover>
                <Upload pick_imageMess={pick_imageMess} />
                <Select options={shareType} onChange={setShareType} />
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
                {/* <div className="multiFile_layout w-48">
                  <ImageView imgView={ImgView} setImgView={setImgView} />
                </div> */}
                <div>
                  {VideosUpload &&
                    VideosUpload.map((e, index) => {
                      return (
                        <video
                          key={index}
                          src={
                            typeof e === "string" ? e : URL.createObjectURL(e)
                          }
                          controls
                          width="500"
                        ></video>
                      );
                    })}
                </div>
              </div>

              {((myComment && myComment !== "<br>") || ImgFile) && (
                <div className="center">
                  <span className="circleButton" onClick={sendComment}>
                    <FiSend />
                  </span>
                </div>
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
                  <img
                    alt="avatar"
                    className="avatarImage"
                    src={`${e.img}`}
                  ></img>
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
