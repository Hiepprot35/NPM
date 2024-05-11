import React, { useState, useEffect } from "react";
import "./DetailMovie.js";
import Layout from "../Layout/layout.js";
import { Image } from "./home.js";
import parse from "html-react-parser";
import { Button, Rate } from "antd";
import useAuth from "../../hook/useAuth.js";
import { fetchApiRes, getStudentInfoByMSSV } from "../../function/getApi.js";
import { FiSend, FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import Comment from "./Comment.js";
import UserProfile from "../UserProfile/userProfile.js";
import { useRef } from "react";
import MyComment from "./MyComment.js";

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
    console.log(res);
    setComment(res?.result);
    const data = await getStudentInfoByMSSV(auth.username);
    setMe(data);
  };
  useEffect(() => {
    getComment();
  }, [Reder]);

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
                </div>
              </div>
              <div style={{ margin: "1rem" }}>
                <p style={{ fontSize: "1rem" }}>{Movies.overview}</p>
              </div>
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
              <div className="commentMovie">
                {auth.userID && (
                  <MyComment
                    setRender={setRender}
                    movieID={props.movieID}
                  ></MyComment>
                )}
                <div className="allComment">
                  {comments &&
                    comments.map((e, i) =>
                      i < comments.length - 1 ? (
                        <Comment
                          key={i}
                          className={"notLastComment"}
                          comment={e}
                        />
                      ) : (
                        <Comment
                          key={i}
                          className={"lastComment"}
                          comment={e}
                        />
                      )
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
