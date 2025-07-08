import { Popover, Rate } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";

import {
  TheMovieApi,
  fetchApiRes,
  getStudentInfoByMSSV,
} from "../../function/getApi.js";
import useAuth from "../../hook/useAuth.js";
import Layout from "../Layout/layout.js";
import Comment from "./Comment.js";
import "./DetailMovie.js";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiShare,
  FiShare2,
} from "react-icons/fi";

import MyComment from "./MyComment.js";
import { Image } from "./home.js";
import {
  animate,
  motion,
  useAnimation,
  useScroll,
  useTransform,
} from "framer-motion";
import { getDate, getNameMonth } from "../../function/getTime.js";
import { Text } from "./listPlay.js";
import { useInView } from "react-intersection-observer";
import { IsLoading } from "../Loading.js";
import NotFoundFilms from "./NotFoundFilms.js";
import ReactPlayer from "react-player";
import { delay } from "lodash";
import { fetchVideoTitle } from "../message/windowchat.js";
import MiniRp from "./MiniRp.js";
import ShowImgDialog from "../message/windowchat/ShowImgMess.js";
import { Link } from "react-router-dom";
const TitleVideo = ({ videoID, isCurrent }) => {
  const [Title, setTitle] = useState();
  const [ClickVideo, setClickVideo] = useState();
  useEffect(() => {
    const res = async () => {
      const data = await fetchVideoTitle(videoID);
      setTitle(data);
    };
    res();
  }, []);
  const videoUrl = `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`;

  return (
    <div style={{ width: "30rem" }}>
      <div
        className="filter"
        style={{
          width: "30rem",
          height: `${(30 * 9) / 16}rem`,
          opacity: `${isCurrent ? 1 : 0.4}`,
        }}
      >
        <ReactPlayer
          playing
          light={true}
          controls
          // style={{ aspectRatio: "16/9" }}
          url={`https://www.youtube.com/watch?v=${videoID}`}
          width={"100%"}
          height={"100%"}
        />
      </div>
      {}
      {/* <img className="imgMess" src={videoUrl}></img> */}
      <span>{Title}</span>
    </div>
  );
};
export function InViewAnimate({ children, variants, setCurrent }) {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      controls.start("openSection");
    } else {
      if (setCurrent) {
        setCurrent(0);
      }
      controls.start("closeSection");
    }
  }, [inView, controls]);
  return (
    <>
      <motion.div
        animate={controls}
        className="inviewElement"
        style={{
          margin: "10vh 0",
          width: "100%",
          overflow: "hidden",
        }}
        ref={ref}
      >
        {children}
      </motion.div>
    </>
  );
}
export default function DetailMovie(props) {
  const videoWidth = 30;

  const [Movies, setMovies] = useState([]);
  const url = "https://image.tmdb.org/t/p/original";
  const [Actors, setActors] = useState();
  const [myComment, setMyComment] = useState();
  const [Images, setImages] = useState();
  const [comments, setComment] = useState([]);
  const [me, setMe] = useState();
  const [Render, setRender] = useState(false);
  const [VideosMovie, setVideosMovie] = useState();
  const [CurrentVideo, setCurrentVideo] = useState(0);
  const [CurrentImage, setCurrenImage] = useState(0);
  const [Loading, setLoading] = useState(true);

  const getVideos = async (movie_id) => {
    try {
      setLoading(true);
      const res = await TheMovieApi(
        `https://api.themoviedb.org/3/movie/${movie_id}/videos`
      );
      if (res.results) {
        return res.results;
      } else {
        return null;
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getImages = async (movie_id) => {
    try {
      setLoading(true);
      const res = await TheMovieApi(
        `https://api.themoviedb.org/3/movie/${movie_id}/images`
      );
      if (res.backdrops) {
        return res.backdrops.slice(0, 30);
      } else {
        return null;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getComment = async () => {
    const res = await fetchApiRes(
      `/gettAllCommentFilms/?movieID=${props.movieID}&replyID=-1/`,
      "GET"
    );
    if (res?.result.length > 0) {
      const commentsRes = res?.result.sort((a, b) => {
        const timeA = new Date(a.create_at).getTime();
        const timeB = new Date(b.create_at).getTime();
        return -timeA + timeB;
      });
      setComment(commentsRes);
      const data = await getStudentInfoByMSSV(auth.username);
      setMe(data);
    }
  };
  useEffect(() => {
    getComment();
  }, [Render]);
  const [showComment, setshowComment] = useState(false);
  const [showActor, setShowActor] = useState(false);
  const variantSectionLeft = {
    openSection: { opacity: 1, y: 0, scale: 1, transition: { duration: 1 } },
    closeSection: {
      opacity: 0,
      y: 200,
      scale: 0,
      transition: { duration: 1 },
    },
  };
  const variantOpacity = {
    openSection: { opacity: 1, transition: { duration: 1 } },
    closeSection: {
      opacity: 0,
      transition: { duration: 1 },
    },
  };
  const videoVariant = {
    openSection: {
      transition: { staggerChildren: 0.5, delayChildren: 0.1 },
    },
    closeSection: {
      transition: { staggerChildren: 0, staggerDirection: 0 },
    },
  };
  const { auth } = useAuth();
  const [roomDetail, setroomDetail] = useState();
  const variantSectionRight = {
    openSection: {
      opacity: 1,
      y: 0,
      scale: 1,
      type: "spring",
      transition: { duration: 0.5 },
    },
    closeSection: {
      opacity: 0,
      y: 100,
      scale: 0,
      transition: { duration: 1, type: "spring" },
    },
  };
  const variants = {
    open: {
      transition: { staggerChildren: 0.5, delayChildren: 1.5 },
    },
    closed: {
      transition: { staggerChildren: 0.5, staggerDirection: -1 },
    },
  };
  useEffect(() => {
    if (videosSlideRef.current) {
      videosSlideRef.current.style.transform = `translateX(${
        -CurrentVideo * (videoWidth - 3)
      }vw)`;
    }
  }, [CurrentVideo]);
  useEffect(() => {
    if (ImagesSlideRef.current) {
      ImagesSlideRef.current.style.transform = `translateX(${
        -CurrentImage * videoWidth
      }vw)`;
    }
  }, [CurrentImage]);
  const variants2 = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, duration: 1 },
      },
    },
    closed: {
      y: "100%",
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };
  const variantClipath = {
    open: {
      clipPath: "polygon(100% 0, 100% 0, 0 100%, 0 100%)",
      transition: { duration: 1 },
    },
    closed: {
      clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)",
      transition: { duration: 1 },
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
  const [listRoom, setlistRoom] = useState([]);
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await fetchApiRes(
          `zoomroom/getRoom?movieId=${props.movieID}`,
          "GET"
        );
        setlistRoom(data.result);
      } catch (error) {
        console.error("Failed to fetch room list:", error);
      }
    };

    fetchRoom();
  }, [props.movieID]);

  const videosSlideRef = useRef();
  const ImagesSlideRef = useRef();
  useEffect(() => {
    if (
      VideosMovie &&
      videosSlideRef.current &&
      Images &&
      ImagesSlideRef.current
    ) {
      videosSlideRef.current.style.width =
        VideosMovie.length * (videoWidth + 2) + "rem";
      ImagesSlideRef.current.style.width =
        Images.length * (videoWidth + 2) + "rem";
    }
  }, [VideosMovie, Images]);
  const detailSection = (
    setCurrent,
    Current,
    Array,
    ref,
    IsVideo,
    setShowImg
  ) => {
    return (
      <InViewAnimate setCurrent={setCurrent}>
        <div
          style={{
            width: "100%",
            display: "flex",
            overflow: "hidden",
            justifyContent: "space-between",
          }}
        >
          <motion.p
            variants={variantSectionLeft}
            className="deltailMovieText"
            style={{ fontSize: "3rem" }}
          >
            {IsVideo ? "Videos" : "Photos"}
          </motion.p>
          <motion.p
            variants={variantSectionRight}
            className="center"
            style={{
              flexDirection: "column",
              height: "5rem",
              width: "4rem",
            }}
          >
            <span
              className="slideButton"
              style={Current > 0 ? {} : { color: "gray" }}
              onClick={Current > 0 ? () => setCurrent((pre) => pre - 1) : null}
            >
              <HiArrowNarrowLeft stroke="gray" />
            </span>
            <span
              className="slideButton"
              style={Current <= Array.length - 2 ? {} : { color: "gray" }}
              onClick={
                Current <= Array.length - 2
                  ? () => setCurrent((pre) => pre + 1)
                  : null
              }
            >
              <HiArrowNarrowRight />
            </span>
          </motion.p>{" "}
        </div>
        <motion.div variants={videoVariant} className="VideoSlide" ref={ref}>
          {Array && Array.length > 0 ? (
            Array.map((element, index) => (
              <motion.div
                variants={variantOpacity}
                className="VideoMovie"
                key={index}
              >
                {IsVideo ? (
                  <>
                    <TitleVideo
                      videoID={element.key}
                      isCurrent={index === Current}
                    />
                    <h1>Trailer {index + 1}</h1>
                  </>
                ) : (
                  <img
                    onClick={() => setShowImg(element)}
                    style={{
                      objectFit: "cover",
                      width: `${videoWidth}rem`,
                      cursor: "pointer",
                    }}
                    src={`${url}/${element.file_path}`}
                  />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div variants={variantOpacity}>
              No videos available
            </motion.div>
          )}
        </motion.div>
      </InViewAnimate>
    );
  };
  useEffect(() => {
    if (Movies.title || Movies.name) {
      document.title = ` ${Movies.title || Movies.name}`;
    }
  }, [Movies]);
  const [ShowImg, setShowImg] = useState();
  const checkScore = (score) => {
    if (score < 3.5) {
      return "red";
    } else if (score <= 5) {
      return "orange";
    } else if (score <= 7.5) {
      return "#FFE800";
    } else {
      return "#89FC05";
    }
  };
  const [sortCommentLastest, setsortCommentLastest] = useState();
  useEffect(() => {
    if (comments && comments?.length > 0) {
      const sortedComments = [...comments]; // Create a copy to avoid mutating the original state
      if (sortCommentLastest) {
        sortedComments.sort(
          (a, b) => parseInt(b.create_at) - parseInt(a.create_at)
        );
      } else {
        sortedComments.sort((a, b) => b.like_count - a.like_count);
      }
      setComment(sortedComments);
    }
  }, [sortCommentLastest]); // Add comments to dependency array to trigger effect when comments change
  const [ShowMiniRp, setShowMiniRp] = useState(false);
  const copyURLHandle = () => {
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_CLIENT_URL}/movie/moviedetail/${props.movieID}`
    );
    setShowMiniRp(true);
  };
  useEffect(() => {
    if (ShowMiniRp) {
      setTimeout(() => {
        setShowMiniRp(false);
      }, 2000);
    }
  }, [ShowMiniRp]);
  useEffect(() => {
    console.log(comments, "aaaaaaaaaaaaaaaaaaaaa");
  }, [comments]);
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
      console.log(data);
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
  useEffect(() => {
    const getVideosUef = async () => {
      const data = await getVideos(props.movieID);
      const images = await getImages(props.movieID);
      setImages(images);
      setVideosMovie(data);
    };
    getVideosUef();
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
      transition: { delayChildren: 1, staggerChildren: 0.5, duration: 1 },
    },
    closed: {
      opacity: 0,
      scale: 2,
      transition: { duration: 1 },
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
        <>
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
              <motion.div
                className="BodyDetail"
                variants={{}}
                style={{ scrollMarginTop: 2000 }}
              >
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
                    <motion.div
                      className=" ratingFilm center"
                      style={{ flexDirection: "column" }}
                    >
                      <motion.div style={{ position: "relative" }}>
                        <motion.div
                          variants={variantClipath}
                          style={{ position: "absolute" }}
                        >
                          <p
                            style={{
                              fontSize: "2rem",
                            }}
                          >
                            {Movies.vote_average.toFixed(2)}
                          </p>
                        </motion.div>
                        <div>
                          <p
                            style={{
                              fontSize: "2rem",
                              color: `${checkScore(Movies.vote_average)}`,
                            }}
                          >
                            {Movies.vote_average.toFixed(2).replace(".", ",")}
                            <span>/10</span>
                          </p>
                        </div>
                      </motion.div>
                      <p>Vote {Movies.vote_count}</p>
                      <span
                        className="circleButton"
                        onClick={() => {
                          copyURLHandle();
                        }}
                      >
                        <FiShare2></FiShare2>
                      </span>
                    </motion.div>
                  </motion.div>
                  <div
                    className="DetailNameMovie"
                    style={{ width: "70%", height: "100%", marginTop: "20%" }}
                  >
                    <div style={{ display: "flex" }}>
                      <motion.div>
                        <motion.div
                          style={{
                            overflow: "hidden",
                            display: "inline-block",
                          }}
                        >
                          <motion.p variants={variants2}>
                            <span
                              style={{ fontSize: "3rem", fontWeight: "600" }}
                            >
                              {Movies.name || Movies.title}{" "}
                            </span>
                            <span style={{ fontSize: "1.78rem" }}>
                              ({" "}
                              {Movies.release_date &&
                                Movies.release_date.split("-")[0]}{" "}
                              )
                            </span>
                          </motion.p>
                        </motion.div>
                        <motion.div
                          variants={variants2}
                          style={{ padding: "3rem 5rem", overflow: "hidden" }}
                        >
                          <motion.p style={{ marginBottom: "2rem" }}>
                            {
                              <span className="miniText">
                                {Movies?.runtime}m |{" "}
                              </span>
                            }
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
                          </motion.p>
                          <motion.p>
                            {Movies.overview && (
                              <Text
                                text={Movies.overview}
                                style={{ fontSize: "1.2rem" }}
                              ></Text>
                            )}
                          </motion.p>
                        </motion.div>
                        <p>ADD TO WATCHLIST</p>
                        <Link to={`./${auth.userID}/party`}>
                          <p className="cursor-pointer text-blue-500 hover:underline">
                            WATCH PARTY
                          </p>
                        </Link>{" "}
                        <p className="font-bold text-lg mb-2">Rooms</p>
                        <div className="space-y-2">
                          {listRoom && listRoom.length > 0 ? (
                            listRoom.map((room, index) => (
                              <Link
                                key={index}
                                to={`./${room.hostId}/party`}
                                className="block p-3 border rounded-md hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-medium">
                                    {room.roomName || `Phòng #${index + 1}`}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    ID: {room.roomId}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-600">
                                  👤 {room.viewers || 1} người
                                </div>{" "}
                              </Link>
                            ))
                          ) : (
                            <p className="text-gray-500 italic">
                              Không có phòng nào
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                <InViewAnimate>
                  <motion.div className="SectionDetail">
                    <motion.div
                      variants={variantSectionLeft}
                      className="SectionChild"
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
                      <motion.div className="actorsMovie SectionChild">
                        {Actors?.cast &&
                          Actors?.cast.map(
                            (actor, index) =>
                              actor?.profile_path && (
                                <motion.div
                                  variants={variantSectionRight}
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
                                </motion.div>
                              )
                          )}
                      </motion.div>
                    }
                  </motion.div>
                </InViewAnimate>
                {VideosMovie &&
                  detailSection(
                    setCurrentVideo,
                    CurrentVideo,
                    VideosMovie,
                    videosSlideRef,
                    true
                  )}
                {Images &&
                  detailSection(
                    setCurrenImage,
                    CurrentImage,
                    Images,
                    ImagesSlideRef,
                    false,
                    setShowImg
                  )}

                {
                  <motion.section className="inviewElement">
                    <motion.div variants={variantSectionRight} className=" ">
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          margin: "1rem",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ margin: 0, position: "relative" }}>
                          <h1 style={{ margin: 0 }}>Comment</h1>
                          <div className="center countText">
                            <p>{comments?.length || 0}</p>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            position: "relative",
                            borderRadius: ".4rem",
                          }}
                        >
                          <div
                            className="commentSort"
                            style={{
                              width: "50%",
                              height: "100%",
                              position: "absolute",
                              background: "#dada",
                              zIndex: "0",
                              transform: `translateX(${
                                sortCommentLastest ? 0 : 100
                              }%)`,
                            }}
                          ></div>
                          <p
                            className="hover commentSort"
                            style={{
                              width: "50%",
                              padding: ".3rem",
                              zIndex: "1",
                            }}
                            onClick={() => setsortCommentLastest(true)}
                          >
                            Lastest
                          </p>
                          <p
                            className="hover commentSort"
                            style={{
                              width: "50%",
                              padding: ".3rem",
                              zIndex: "1",
                            }}
                            onClick={() => setsortCommentLastest(false)}
                          >
                            Popular
                          </p>
                        </div>
                      </div>
                      {auth.userID && (
                        <motion.div style={{ zIndex: "2" }}>
                          <MyComment
                            setRender={setRender}
                            movieID={props.movieID}
                          ></MyComment>
                        </motion.div>
                      )}
                      {comments && comments?.length > 0 && (
                        <div className="allComment">
                          {comments.map((e, i) => (
                            <motion.div key={i} variants={variants2}>
                              <Comment
                                className={
                                  i < comments.length - 1 && e.replyID
                                    ? "notLastComment"
                                    : "lastComment"
                                }
                                comment={e}
                              />
                              <div
                                className="linear"
                                style={{ margin: "1rem" }}
                              ></div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.section>
                }
              </motion.div>
              {Images?.length > 0 && ShowImg && (
                <ShowImgDialog
                  listImg={Images}
                  current={ShowImg}
                  setShowImgMess={setShowImg}
                  isMovies={true}
                ></ShowImgDialog>
              )}
            </motion.div>
          ) : (
            <NotFoundFilms></NotFoundFilms>
          )}
          {ShowMiniRp && (
            <MiniRp>
              <FiCheck></FiCheck> Coypied URL
            </MiniRp>
          )}
        </>
      )}
    </>
  );
}
