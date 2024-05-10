import { default as React, useEffect, useRef, useState } from "react";
import "./myComment.scss";
import { FiSend } from "react-icons/fi";
import { fetchApiRes } from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
export default function MyComment(props) {
  const refTag = useRef();
  const inputRef = useRef();
  const [FilterTag, setFilterTag] = useState();
  const [OpenTag, setOpenTag] = useState();
  const [myComment, setMyComment] = useState();
  const [myFriendList, setMyFriendList] = useState([]);
  const { auth } = useAuth();
  const checkID = (array, id) => {
    return array.user1 === id ? array.user2 : array.user1;
  };

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
    console.log(users,"friend")
    setMyFriendList(users);
  };
  const handleInputChange = (props) => {
    if (inputRef.current) {
      console.log("change", inputRef.current.innerHTML);
      setMyComment(inputRef.current.innerHTML);
    }
  };
  useEffect(() => {
    OpenTag && getFriendList();
  }, [OpenTag]);

  useEffect(() => {
    if (!OpenTag && myComment) {
      addSpan("spanComment");
    }
  }, [OpenTag]);

  useEffect(() => {
    setFilterTag([...myFriendList]);
  }, [myFriendList]);

  const addSpan = (className, values) => {
    if (inputRef.current) {
      const span = document.createElement("span");
      span.className = className;
      span.innerHTML = `&nbsp;`;
      inputRef.current.appendChild(span);
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(span);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  const tagHandle = (e) => {
    setMyComment((pre) => pre + e.Name);
    if (inputRef.current) {
      const span = document.createElement("span");
      span.className = "tagNameHref";
      span.innerHTML = e.Name;
      span.dataset.values = e.MSSV;
      inputRef.current.appendChild(span);
      const selection = window.getSelection();
      const range = document.createRange();
      inputRef.current.innerHTML = inputRef.current.innerHTML.replace("@", "");
      setMyComment(inputRef.current.innerHTML);
      setOpenTag(false);
      range.selectNodeContents(span);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  useEffect(() => {
    console.log(myComment);
    if (myComment && inputRef.current) {
      if (myComment.includes("@")) {
        console.log("tim thay @")
        setOpenTag(true);
        if (myComment.includes("@&nbsp") && OpenTag) {
          setOpenTag(false);
        }
      } else {
        setOpenTag(false);
      }
    }
  }, [myComment]);
  const sendComment = async () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(myComment, "text/html");
    let content = "";
    const spanElement = doc.querySelector(".tagNameHref");
    if (spanElement) {
      const dataValues = spanElement.dataset.values;
      const name = spanElement.innerHTML;
      const data = myComment.replace(
        `<span`,
        `<a href="${process.env.REACT_APP_CLIENT_URL}/profile/${dataValues}"`
      );
      const data2 = data.replace("/span>", "/a>");
      content = data2;
    } else {
      content = myComment;
    }
    const res = await fetchApiRes("insertComment", "POST", {
      userID: auth.username,
      content: content,
      movieID: props.movieID,
      replyID: props.reply,
    });
    inputRef.current.innerHTML = "";
    setMyComment("");
    props.setRender((pre) => !pre);
  };
  return (
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
        {myComment && myComment !== "<br>" && (
          <span className="circleButton" onClick={sendComment}>
            <FiSend />
          </span>
        )}
      </div>
      {FilterTag && OpenTag && (
        <div className="tagList center">
          {FilterTag.map((e) => (
            <div className="tag center" style={{margin:".5rem"}} onClick={() => tagHandle(e)}>
              <img className="avatarImage" src={`${e.img}`}></img>
              <p>{e.Name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
