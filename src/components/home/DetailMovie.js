import { Rate } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { fetchApiRes, getStudentInfoByMSSV } from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
import Layout from "../Layout/layout.js";
import Comment from "./Comment.js";
import "./DetailMovie.js";
import MyComment from "./MyComment.js";
import { Image } from "./home.js";
import { motion } from "framer-motion";
export default function DetailMovie(props) {
  const { auth } = useAuth();
  const [Movies, setMovies] = useState([]);
  const url = "https://image.tmdb.org/t/p/original";
  const [Actors, setActors] = useState();
  const [myComment, setMyComment] = useState();
  const [comments, setComment] = useState([]);
  const [me, setMe] = useState();
  const [Reder, setRender] = useState(false);
  const [OpenTag, setOpenTag] = useState(false);
  const [FilterTag, setFilterTag] = useState([]);

  const getComment = async () => {
    const res = await fetchApiRes(
      `/gettAllCommentFilms/?movieID=${props.movieID}/`,
      "GET"
    );
    const commentsRes = res?.result.sort((a, b) => {
      const timeA = new Date(a.create_at).getTime();
      const timeB = new Date(b.create_at).getTime();
      return -timeA + timeB;
    });
    console.log(commentsRes, "comment");
    setComment(commentsRes);
    const data = await getStudentInfoByMSSV(auth.username);
    setMe(data);
  };
  useEffect(() => {
    getComment();
  }, [Reder]);
  const [showComment, setshowComment] = useState(false);
  const [showActor, setShowActor] = useState(false);
  const sendComment = async () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(myComment, "text/html");

    const spanElement = doc.querySelector(".tagNameHref");
    if (spanElement) {
      const dataValues = spanElement.dataset.values;
      const name = spanElement.innerHTML;
      console.log(name);
      const data = myComment.replace(
        `<span`,
        `<a href="${process.env.REACT_APP_CLIENT_URL}/profile/${dataValues}"`
      );
      const data2 = data.replace("/span>", "/a>");
      console.log(data2);
      const res = await fetchApiRes("insertComment", "POST", {
        userID: auth.username,
        content: data2,
        movieID: props.MovieID,
      });
      inputRef.current.innerHTML = "";
      setMyComment("");
      setRender(!Reder);
    }
  };
  const variants = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.03 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };
  const variants2 = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };
  const data = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${props.movieID}?api_key=1a312643e7349b023d8aa475b3523601`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTMxMjY0M2U3MzQ5YjAyM2Q4YWE0NzViMzUyMzYwMSIsInN1YiI6IjY1ZTZkOGMzOGQxYjhlMDE4NzY3MjEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IhIe9_G8KXIFkM2bHAhWYkZy_uaOvUolfJrfI1YQZm4",
        },
      }
    );
    const data = await res.json();
    setMovies(data);
  };

  useEffect(() => {
    document.title = ` ${Movies.title || Movies.name}`;
  }, [Movies]);
  const getActors = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${props.movieID}/credits?api_key=1a312643e7349b023d8aa475b3523601`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTMxMjY0M2U3MzQ5YjAyM2Q4YWE0NzViMzUyMzYwMSIsInN1YiI6IjY1ZTZkOGMzOGQxYjhlMDE4NzY3MjEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IhIe9_G8KXIFkM2bHAhWYkZy_uaOvUolfJrfI1YQZm4",
        },
      }
    );
    const data = await res.json();
    setActors(data);
    console.log(data);
  };
  useEffect(() => {
    data();
    getActors();
  }, []);

  const inputRef = useRef();
  const [tagName, settagName] = useState();
  const handleInputChange = () => {
    if (inputRef.current) {
      console.log("change", inputRef.current.innerHTML);
      setMyComment(inputRef.current.innerHTML);
    }
  };
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

  const ref = useRef([]);
  const refTag = useRef();
  const showActorHandle = () => {
    setShowActor(true);
    setshowComment(false);
  };
  const showCommentHandle = () => {
    setShowActor(false);
    setshowComment(true);
  };
  return (
    <>
      <Layout>
        {Movies && (
          <div className="DetailMovie">
            <div className="HeaderDetail">
              <div
                className="backgroundDetail"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original/${Movies.backdrop_path})`,
                }}
              ></div>
            </div>
            <div className="BodyDetail">
              <div className="Poster">
                <div style={{}}>
                  <Image
                    style={{ width: "12rem" }}
                    src={`${
                      Movies.poster_path
                        ? "https://image.tmdb.org/t/p/original/" +
                          Movies.poster_path
                        : ""
                    }`}
                  ></Image>
                </div>
                <div style={{ width: "70%", marginTop: "5rem" }}>
                  <h1>{Movies.name || Movies.title}</h1>
                  <span
                    style={{
                      display: "flex",
                      fontWeight: "600",
                      color: "gray",
                    }}
                  >
                    Thể loại:{"   "}
                    {Movies?.genres &&
                      Movies?.genres.map((e, i) => (
                        <p key={i}>
                          {e.name}
                          {i < Movies.genres.length - 1 && " | "}
                        </p>
                      ))}
                  </span>
                  <div className=" ratingFilm">
                    <Rate
                      defaultValue={Movies.vote_average / 2}
                      disabled
                      allowHalf
                    ></Rate>
                  </div>
                  <div style={{ margin: "1rem" }}>
                    <p style={{ fontSize: "1rem" }}>{Movies.overview}</p>
                  </div>
                </div>
              </div>
              <ul className="ulVerion">
                <li
                  className="center"
                  onClick={() => {
                    showActorHandle();
                  }}
                >
                  <p>Casting</p>
                </li>
                <li
                  className="center"
                  onClick={() => {
                    showCommentHandle();
                  }}
                >
                  <p>Comment</p>
                </li>
                <li className="center">
                  <p>Same type</p>
                </li>
              </ul>
              {showActor && (
                <div className="actorsMovie">
                  {Actors?.cast &&
                    Actors?.cast.map(
                      (actor, index) =>
                        actor?.profile_path && (
                          <div key={index} className="center actor hiddenText">
                            <Image
                              // className="avatarImage"
                              src={`${url}/${actor.profile_path}`}
                            ></Image>
                            <div
                              className="hiddenText"
                              style={{ height: "3rem" }}
                            >
                              <p key={index}>{actor.name}</p>
                            </div>
                          </div>
                        )
                    )}
                </div>
              )}
              {
                <motion.div
                  variants={variants}
                  animate={showComment ? "open" : "closed"}
                  className="commentMovie"
                >
                  {auth.userID && (
                    <motion.div variants={variants2}>
                      <MyComment
                        setRender={setRender}
                        movieID={props.movieID}
                      ></MyComment>
                    </motion.div>
                  )}
                  <div className="allComment">
                    <div style={{ display: "flex" }}>
                      <div style={{ margin: 0, position: "relative" }}>
                        <h1 style={{ margin: 0 }}>Comment</h1>
                        <div
                        className="center"
                          style={{
                            position: "absolute",
                            right: "-1.7rem",
                            top: "0",
                            width:"1.4rem",
                            height:"1.4rem",
                            fontSize: ".8rem",
                            backgroundColor: "gray",
                            borderRadius: "50%",
                          }}
                        >
                          <p>{comments.length}</p>
                        </div>
                      </div>
                    </div>
                    {comments &&
                      comments.map((e, i) =>
                        i < comments.length - 1 ? (
                          <motion.div variants={variants2}>
                            <Comment
                              key={i}
                              className={"notLastComment"}
                              comment={e}
                            />
                          </motion.div>
                        ) : (
                          <motion.div variants={variants2}>
                            <Comment
                              key={i}
                              className={"lastComment"}
                              comment={e}
                            />
                          </motion.div>
                        )
                      )}
                  </div>
                </motion.div>
              }
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
