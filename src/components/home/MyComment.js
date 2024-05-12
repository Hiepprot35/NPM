import { default as React, useEffect, useRef, useState } from "react";
import "./myComment.scss";
import { FiSend, FiSmile } from "react-icons/fi";
import { fetchApiRes } from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
import EmojiPicker from "emoji-picker-react";
import { each } from "jquery";
import { IsLoading } from "../Loading.js";
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
          console.log("câcc", previousCharacter);
          setOpenTag(true);
        }
      } else {
        console.log("câcc");

        setOpenTag(false);
      }
    }
  };
  const [TagName, setTagName] = useState([]);
  const handleInputChange = () => {
    if (inputRef.current) {
      setMyComment(inputRef.current.innerHTML);
      if (OpenTag) {
        setCountTag((pre) => pre + 1);
      }
    }
  };

  useEffect(() => {
    OpenTag && getFriendList();
  }, [OpenTag]);

  useEffect(() => {
    setFilterTag([...myFriendList]);
  }, [myFriendList]);

  const addSpan = (className, values) => {
    if (inputRef.current) {
      if (values.dataset) {
        return `<span dataset=${values.dataset} class=${className} >${values.Name}</span>`;
      } else {
        return`<span  class=${className} >${values.Name}</span>`;
      }
      
    }
  };
  const tagHandle = (e) => {
    setMyComment((pre) => pre + e.Name);
    if (inputRef.current) {
      const inputText = inputRef.current.innerHTML;

      setTagName((pre) => [...pre, e.Name]);
      inputRef.current.innerHTML = inputText.replace(
        "@",
        `<span data-lexical-text=${e.MSSV} class="tagNameHref" >${e.Name}</span><span class="spanComment"> </span>`
      );
      handleInputChange();
      setOpenTag(false);
      setCountTag(0);

    }

  };
  const [CountTag, setCountTag] = useState(0);
  useEffect(() => {
    console.log("My comment", myComment);
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
    e.preventDefault()
    let isSending=false
    setisLoading(true)
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(myComment, "text/html");
      let content = "";
      const spanElement = doc.querySelector(".tagNameHref");
      if (spanElement) {
        const name = spanElement.innerHTML;
        const dataValues = spanElement.dataset.lexicalText;
        console.log(dataValues)
        const data = myComment.replace(
          `<span`,
          `<a href="${process.env.REACT_APP_CLIENT_URL}/profile/${dataValues}"`
        );
        const data2 = data.replace("/span>", "/a>");
        content = data2;
      } else {
        content = myComment;
      }
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
      // console.log(updateContent)
      const res = await fetchApiRes("insertComment", "POST", {
        userID: auth.username,
        content: updateContent,
        movieID: props.movieID,
        replyID: props.reply,
        create_at:Date.now()
      });
      if(res)
        {
          setisLoading(false)
        }
      inputRef.current.innerHTML = "";
      setMyComment("");
      props.setRender((pre) => !pre);
    } catch (error) {
      setisLoading(false)

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
    <div className=" myCommentComponent">
      <div className="AvatarComment">
        <div className="AvatarComment2">
          <img className="avatarImage" src={`${auth.avtUrl}`}></img>
        </div>
        <div className="linearComment"></div>
      </div>

      <div className="inputDiv center">
        <div
          className="commentDiv"
          ref={refTag}
          contentEditable="true"
          onInput={(e) => handleInputChange(e)}
          onClick={getPreviousCharacter}
          suppressContentEditableWarning={true}
        >
          <p ref={inputRef}></p>
        </div>
        {(myComment === "<br>" || !myComment) && (
          <div className="placehoder">
            <p>
              {props.user
                ? `Đang trả lời bình luận của ${props.user}`
                : "Nội dung"}
            </p>
          </div>
        )}
        <div className="featureComment">
          <div
            className="center"
            style={{ margin: "1rem" }}
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
          </div>

          {myComment && myComment !== "<br>" && (
            <>
              <span className="circleButton" onClick={sendComment}>
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
    
    }</>

  );
}
