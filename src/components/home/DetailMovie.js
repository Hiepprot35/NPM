import { Popover, Rate } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  TheMovieApi,
  fetchApiRes,
  getStudentInfoByMSSV,
} from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
import Layout from "../Layout/layout.js";
import Comment from "./Comment.js";
import "./DetailMovie.js";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import MyComment from "./MyComment.js";
import { Image } from "./home.js";
import { motion, useAnimation } from "framer-motion";
import { getDate, getNameMonth } from "../../function/getTime.js";
import { Text } from "./listPlay.js";
import { useInView } from "react-intersection-observer";
import { IsLoading } from "../Loading.js";
import NotFoundFilms from "./NotFoundFilms.js";
import ReactPlayer from "react-player";
export function InViewAnimate({ children, variants }) {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("openSession");
    } else {
      controls.start("closeSession");
    }
  }, [inView, controls]);
  return (
    <motion.div animate={controls} ref={ref}>
      {children};
    </motion.div>
  );
}
export default function DetailMovie(props) {
  const { auth } = useAuth();
  const [Movies, setMovies] = useState([]);
  const url = "https://image.tmdb.org/t/p/original";
  const [Actors, setActors] = useState();
  const [myComment, setMyComment] = useState();
  const [Images,setImages]=useState()
  const [comments, setComment] = useState([]);
  const [me, setMe] = useState();
  const [Render, setRender] = useState(false);
  const [VideosMovie, setVideosMovie] = useState();
  const [CurrentVideo, setCurrentVideo] = useState(0);
  const [CurrentImage,setCurrenImage]=useState(0)
  const [Loading, setLoading] = useState(true);
  const getVideos = async (movie_id) => {
    const res = await TheMovieApi(
      `https://api.themoviedb.org/3/movie/${movie_id}/videos`
    );
    if (res.results) {
      return res.results;
    } else {
      return null;
    }
  };
  const getImages = async (movie_id) => {
    const res = await TheMovieApi(
      `https://api.themoviedb.org/3/movie/${movie_id}/images`
    );
    console.log(res,"okdaksdasd")
    if (res.posters) {
      return res.posters.slice(0,30);
    } else {
      return null;
    }
  };
  useEffect(() => {
    const getVideosUef = async () => {
      const data = await getVideos(props.movieID);
      const images=await getImages(props.movieID)
      setImages(images)
      setVideosMovie(data);
    };
    getVideosUef();
  }, []);
  useEffect(() => {
    console.log("Images",Images)
  }, [Images]);
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
    setComment(commentsRes);
    const data = await getStudentInfoByMSSV(auth.username);
    setMe(data);
  };
  useEffect(() => {
    getComment();
  }, [Render]);
  const [showComment, setshowComment] = useState(false);
  const [showActor, setShowActor] = useState(false);
  const variantSessionLeft = {
    openSession: { opacity: 1, x: 0, scale: 1, transition: { duration: 1 } },
    closeSession: {
      opacity: 0,
      x: -2000,
      scale: 0,
      transition: { duration: 1 },
    },
  };
  const variantOpacity = {
    openSession: { opacity: 1, transition: { duration: 1 } },
    closeSession: {
      opacity: 0,
      
    },
  };
  const videoVariant = {
    openSession: {
      transition: { staggerChildren: 0.5, delayChildren: 0.1},
    },
    closeSession: {
      transition: { staggerChildren: 0, staggerDirection: 1 },
    },
  };
  const variantSessionRight = {
    openSession: { opacity: 1, x: 0, scale: 1, transition: { duration: 1 } },
    closeSession: {
      opacity: 0,
      x: 2000,
      scale: 0,
      transition: { duration: 1 },
    },
  };
  const variants = {
    open: {
      transition: { staggerChildren: 0.5, delayChildren: 1 },
    },
    closed: {
      transition: { staggerChildren: 0.5, staggerDirection: -1 },
    },
  };
  useEffect(() => {
    if (videosSlideRef.current) {
      videosSlideRef.current.style.transform = `translateX(${
        -CurrentVideo * 40
      }vw)`;
    }
  }, [CurrentVideo]);
  useEffect(() => {
    if (ImagesSlideRef.current) {
      ImagesSlideRef.current.style.transform = `translateX(${
        -CurrentImage * 15
      }vw)`;
    }
  }, [CurrentImage]);
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
    try {
      setLoading(true);
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
      if (data.id) {
        setMovies(data);
        setLoading(false);
      } else {
        document.title = "Not found movie";
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const videosSlideRef = useRef();
  const ImagesSlideRef=useRef()
  useEffect(() => {
    if (VideosMovie && videosSlideRef.current && Images&&ImagesSlideRef.current) {
      videosSlideRef.current.style.width = VideosMovie.length * 40 + "vw";
      ImagesSlideRef.current.style.width = Images.length * 15 + "vw";

    }
  }, [VideosMovie,Images]);
  useEffect(() => {
    console.log("Movies", Movies);
    if (Movies.title || Movies.name) {
      document.title = ` ${Movies.title || Movies.name}`;
    }
  }, [Movies]);
  const getActors = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    data();
    getActors();
  }, []);

  const inputRef = useRef();
  const [tagName, settagName] = useState();

  const ref = useRef([]);
  const refTag = useRef();

  const deltailMovieRef = useRef();
  const variantsMovie = {
    open: {
      opacity: 1,

      scale: 1,
      transition: { duration: 1 }, // Duration in seconds
    },
    closed: {
      opacity: 0,
      scale: 2,
      transition: { duration: 1 }, // Duration in seconds
    },
  };
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(Movies !== undefined);
  }, [Movies]);
  return (
    <>
      {Loading ? (
        <IsLoading />
      ) : (
        <Layout>
          {Movies.id ? (
            <motion.div
              className="DetailMovie"
              variants={variants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
            >
              <motion.div className="HeaderDetail">
                <motion.div
                  variants={variantsMovie}
                  className="backgroundDetail"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original/${Movies.backdrop_path})`,
                  }}
                ></motion.div>
              </motion.div>
              <motion.div className="BodyDetail" variants={variants2}>
                <motion.div className="Poster">
                  <motion.div
                    variants={variantsMovie}
                    style={{ height: "100%" }}
                  >
                    <Image
                      src={`${
                        Movies.poster_path
                          ? "https://image.tmdb.org/t/p/original/" +
                            Movies.poster_path
                          : ""
                      }`}
                    ></Image>
                  </motion.div>
                  <div
                    className="DetailNameMovie"
                    style={{ width: "70%", height: "100%", marginTop: "20%" }}
                  >
                    <div style={{ display: "flex", overflow: "hidden" }}>
                      <motion.div className="" variants={variants2}>
                        <p>
                          <span style={{ fontSize: "3rem", fontWeight: "600" }}>
                            {Movies.name || Movies.title}{" "}
                          </span>
                          <span style={{ fontSize: "1.78rem" }}>
                            ({" "}
                            {Movies.release_date &&
                              Movies.release_date.split("-")[0]}{" "}
                            )
                          </span>
                        </p>
                      </motion.div>
                    </div>
                    <p style={{ marginLeft: "20%" }}>
                      {<span className="miniText">{Movies?.runtime}m | </span>}
                      {Movies?.genres &&
                        Movies?.genres.map((e, i) => (
                          <span className="miniText" key={i}>
                            {e.name}
                            {i < Movies.genres.length - 1 && ", "}
                          </span>
                        ))}
                      <span className="miniText">
                        {" "}
                        |{" "}
                        {Movies?.origin_country &&
                          Movies?.origin_country.map((e) => e)}
                      </span>
                    </p>
                    <div className=" ratingFilm">
                      <Rate
                        defaultValue={Math.floor(Movies.vote_average / 2)}
                        // disabled
                        // allowHalf
                      ></Rate>
                    </div>
                    <div style={{ marginLeft: "15%" }}>
                      {Movies.overview && (
                        <Text
                          text={Movies.overview}
                          style={{ fontSize: "1rem" }}
                        ></Text>
                      )}
                    </div>
                  </div>
                </motion.div>
                <InViewAnimate>
                  <motion.div className="sessionDetail">
                    <motion.div
                      variants={variantSessionLeft}
                      className="sessionChild"
                    >
                      <p
                        className="deltailMovieText"
                        style={{ fontSize: "3rem" }}
                      >
                        Cast&
                      </p>
                      <p
                        className="deltailMovieText"
                        style={{ fontSize: "3rem" }}
                      >
                        Crew
                      </p>
                    </motion.div>
                    {
                      <motion.div
                        variants={variantSessionRight}
                        className="actorsMovie sessionChild"
                      >
                        {Actors?.cast &&
                          Actors?.cast.map(
                            (actor, index) =>
                              actor?.profile_path && (
                                <div
                                  key={index}
                                  className="center actor hiddenText"
                                >
                                  <Popover
                                    content={
                                      <Image
                                        style={{ width: "3rem" }}
                                        src={`${url}/${actor.profile_path}`}
                                      ></Image>
                                    }
                                  >
                                    <div
                                      className="hiddenText"
                                      style={{ height: "8rem", width: "8rem" }}
                                    >
                                      <p
                                        style={{
                                          color: "gray",
                                          fontSize: ".9rem",
                                        }}
                                      >
                                        {actor.character}
                                      </p>
                                      <p
                                        className="deltailMovieText"
                                        style={{
                                          fontSize: "1.5rem",
                                          fontWeight: "500",
                                        }}
                                        key={index}
                                      >
                                        {actor.name}
                                      </p>
                                    </div>
                                  </Popover>
                                </div>
                              )
                          )}
                      </motion.div>
                    }
                  </motion.div>
                </InViewAnimate>
                <InViewAnimate>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        className="deltailMovieText"
                        style={{ fontSize: "3rem" }}
                      >
                        Videos
                      </p>
                      <div className="center" style={{ height: "5rem", width: "4rem" }}>
                        <span style={{fontSize:"2rem"}} onClick={() => setCurrentVideo((pre) => pre - 1)}>
                          <FiArrowLeft/>{" "}
                        </span>
                        <span style={{fontSize:"2rem"}} onClick={() => setCurrentVideo((pre) => pre + 1)}>
                          <FiArrowRight />{" "}
                        </span>
                      </div>
                    </div>
                    <motion.div
                    variants={videoVariant}
                      className="VideoSlide"
                      ref={videosSlideRef}
                    >
                      {VideosMovie && VideosMovie.length > 0 ? (
                        VideosMovie.map((video) => (
                          <motion.div
                            variants={variantOpacity}
                            className="VideoMovie"
                            key={video.id}
                          >
                            <ReactPlayer
                              playing
                              light={true}
                              url={`https://www.youtube.com/watch?v=${video.key}`}
                              width="40rem"
                              height="25rem"
                            />
                          </motion.div>
                        ))
                      ) : (
                        <p>No videos available</p>
                      )}
                  </motion.div>
                </InViewAnimate>
                <InViewAnimate>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        className="deltailMovieText"
                        style={{ fontSize: "3rem" }}
                      >
                        Photos
                      </p>
                      <div className="center" style={{ height: "5rem", width: "4rem" }}>
                        <span style={{fontSize:"2rem"}} onClick={() => setCurrenImage((pre) => pre - 1)}>
                          <FiArrowLeft/>{" "}
                        </span>
                        <span style={{fontSize:"2rem"}} onClick={() => setCurrenImage((pre) => pre + 1)}>
                          <FiArrowRight />{" "}
                        </span>
                      </div>
                    </div>
                    <motion.div
                    variants={videoVariant}
                      className="VideoSlide"
                      ref={ImagesSlideRef}
                    >
                      {Images && Images.length > 0 ? (
                        Images.map((image) => (
                          <motion.div
                            variants={variantOpacity}
                            style={{width:"15vw",height:"30vh"}}
                            key={image.id}
                          >
                            <img
          style={{objectFit:"contain",width:"100%",height:"100%"}}
                              src={`${url}/${image.file_path}`}
                             
                            />
                          </motion.div>
                        ))
                      ) : (
                        <p>No videos available</p>
                      )}
                  </motion.div>
                </InViewAnimate>
                {/* {
                  <InViewAnimate>
                    <motion.session className="">
                      <motion.div
                        variants={variantSessionRight}
                        className=" sessionChild"
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
                                  width: "1.4rem",
                                  height: "1.4rem",
                                  fontSize: ".8rem",
                                  backgroundColor: "gray",
                                  borderRadius: "50%",
                                }}
                              >
                                <p>{comments.length}</p>
                              </div>
                            </div>
                          </div>
                          {comments.map((e, i) =>
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
                    </motion.session>
                  </InViewAnimate>
                } */}
              </motion.div>
            </motion.div>
          ) : (
            <NotFoundFilms></NotFoundFilms>
          )}
        </Layout>
      )}
    </>
  );
}
