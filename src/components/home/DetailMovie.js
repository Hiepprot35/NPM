import React, { useState, useEffect } from "react";
import "./DetailMovie.js";
import Layout from "../Layout/layout.js";
import { Image } from "./home.js";
import { Button, Rate } from "antd";
import useAuth from "../../hook/useAuth.js";
import { fetchApiRes, getStudentInfoByMSSV } from "../../function/getApi.js";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import Comment from "./Comment.js";
export default function DetailMovie(props) {
  const { auth } = useAuth();
  const [Movies, setMovies] = useState([]);
  const url = "https://image.tmdb.org/t/p/original";
  const [Actors, setActors] = useState();
  const [myComment, setMyComment] = useState();
  const [comments, setComment] = useState([]);
  const [me, setMe] = useState();
  const [Clicked, setClicked] = useState(false);

  const getComment = async () => {
    const res = await fetchApiRes(
      `/gettAllCommentFilms/${props.MovieID}`,
      "GET"
    );
    console.log(res);
    setComment(res.result);
    const data = await getStudentInfoByMSSV(auth.username);
    setMe(data);
  };
  useEffect(() => {
    getComment();
  }, [Clicked]);

  const sendComment = async () => {
    const res = await fetchApiRes("insertComment", "POST", {
      userID: auth.username,
      content: myComment,
      movieID: props.MovieID,
    });
    setMyComment("");
    setClicked(!Clicked);
  };
  const data = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${props.MovieID}?api_key=1a312643e7349b023d8aa475b3523601`,
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
      `https://api.themoviedb.org/3/movie/${props.MovieID}/credits?api_key=1a312643e7349b023d8aa475b3523601`,
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
                {Actors &&
                  Actors.cast.map(
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
                <div className="center">
                  <img className="avatarImage" src={`${auth.avtUrl}`}></img>
                  <input
                    placeholder={`Bình luận với vai trò ${me?.Name}`}
                    onChange={(e) => setMyComment(e.target.value)}
                    value={myComment}
                    type="text"
                  ></input>
                  {myComment && <Button onClick={sendComment}>Comment</Button>}
                </div>
                <div className="allComment">
                  {comments && comments.map((e, i) => <Comment comment={e} />)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
