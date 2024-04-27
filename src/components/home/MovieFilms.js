import React, { useEffect, useRef, useState } from "react";
import "./MovieFilms.css";
import {
  motion,
  AnimatePresence,
  Variants,
  delay,
  easeOut,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button, Popover, Rate } from "antd";
import ReactPlayer from "react-player";
import useAuth from "../../hook/useAuth";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiHeart,
  FiInfo,
  FiMoreHorizontal,
  FiStar,
  FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { getNameMonth } from "../../function/getTime";
import { fetchApiRes } from "../../function/getApi";
import MyReactPlayer from "./ReactPlayer";
import WatchFilms from "./watchFilms";
export default function MovieFilms(props) {
  const [CurrentMovie, setCurrentMovie] = useState(0);
  const [Movies, setMovies] = useState([]);
  const [Actors, setActors] = useState();
  const { auth } = useAuth();
  const [BackImg, setBackImg] = useState();
  const refleftMovie = useRef([]);
  const refSmallSlide = useRef();
  const data = async () => {
    const res = await fetch(
      "https://api.themoviedb.org/3/trending/all/day?language=en-US",
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
    setMovies(data.results);
    console.log(data);
  };

  useEffect(() => {
    data();
  }, []);
  const refMovieFilms = useRef();
  useEffect(() => {
    if (refMovieFilms.current && Movies && refSmallSlide.current) {
      refMovieFilms.current.style.width = `${Movies.length * 100}%`;
      refSmallSlide.current.style.width = `${Movies.length * 100}%`;
    }
  }, [Movies]);
  useEffect(() => {
    if (refMovieFilms.current && refSmallSlide.current) {
      refMovieFilms.current.style.transform = `translateX(-${
        (CurrentMovie * 100) / Movies.length
      }%)`;
      refSmallSlide.current.style.transform = `translateX(-${
        ((CurrentMovie - 1) * 100) / Movies.length
      }%)`;
      if (CurrentMovie === 0) {
        RefScrollImage.current.style.marginLeft = "100px";
        refSmallSlide.current.style.transform = `translateX(0%)`;
      } else {
        RefScrollImage.current.style.marginLeft = "0";
      }
    }

    if (RefScrollImage.current) {
      RefScrollImage.current.style.width =
        CurrentMovie >= 1 ? "300px" : "200px";
    }
  }, [CurrentMovie]);

  const miniImage = useRef([]);
  const largeImg = useRef([]);
  const clickNextMovie = () => {
    setReport();

    if (Movies.length > 0) {
      if (CurrentMovie === Movies.length - 1) {
        setCurrentMovie(0);
      } else {
        setCurrentMovie((pre) => pre + 1);
      }
    }
    // setMovies(moveFirstElementToEnd(m))
  };
  const clickBackMovie = () => {
    setReport();
    if (CurrentMovie === 0) {
      setCurrentMovie(Movies.length - 1);
    } else {
      setCurrentMovie((pre) => pre - 1);
    }
  };
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft") {
        clickBackMovie();
      } else if (event.key === "ArrowRight") {
        clickNextMovie();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [CurrentMovie, Movies]);

  // const anime=(i)=>{
  //   if()
  // }
  const [MovieLink, setMovieLink] = useState([]);
  const [Report, setReport] = useState(false);
  const watchMovieHandle = async (id, background) => {
    console.log(id);
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTMxMjY0M2U3MzQ5YjAyM2Q4YWE0NzViMzUyMzYwMSIsInN1YiI6IjY1ZTZkOGMzOGQxYjhlMDE4NzY3MjEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IhIe9_G8KXIFkM2bHAhWYkZy_uaOvUolfJrfI1YQZm4",
      },
    });
    const data = await res.json();
    if (data.results) {
      setBackImg(`url(https://image.tmdb.org/t/p/original/${background}})`);
      setMovieLink(data.results);
    } else {
      setReport("Xin lỗi. Hệ thông chưa cập nhập phim này");
    }
  };
  const animeSlideFilm = (i) => ({
    initial: "hidden",
    animate: i === CurrentMovie ? "visible" : "hidden",
    // transition: { duration: 0.5, delay: 0 },
    variants: {
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          delay: 0.5,
        },
      },
      hidden: {
        x: i !== CurrentMovie && "-100%",
        opacity: 0,
        transition: {
          x: { stiffness: 1000 },
        },
      },
    },
  });
  const animeSpan = (i, e) => ({
    initial: "hidden",
    animate: i === CurrentMovie ? "visible" : "hidden",
    transition: { duration: 0.2, delay: e / 10 },
    variants: {
      visible: {
        x: 0,
        opacity: 1,
      },
      hidden: {
        // x: i < CurrentMovie ? "-100%" : "100%",
        opacity: 0,
        transition: {},
      },
    },
  });
  const animeText = (i) => ({
    initial: "hidden",
    animate: i === CurrentMovie ? "visible" : "hidden",
    transition: { duration: 0.5, delay: 1 },
    variants: {
      visible: {
        y: 0,
        opacity: 1,
      },
      hidden: {
        y: i !== CurrentMovie && 75,
        // x: i < CurrentMovie ? "-100%" : "100%",
        opacity: 0,
        transition: {
          x: { stiffness: 1000 },
        },
      },
    },
  });
  const RefReactPlayer = useRef(null);
  const RefScrollImage = useRef(null);

  const closeWindowHandle = () => {
    setMovieLink([]);
  };
  const addListFilmHandle = async (e) => {
    const res = await fetchApiRes("/getInsertFilm", "POST", {
      UserID: auth.userID,
      filmID: e,
    });
    alert(res.message);
  };
  const ref=useRef()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset:["start start","end end"]
  });
  return (
    <>
    <div
      id="trending"
      className="MovieContainer"
      ref={ref}
      style={{opacity:scrollYProgress }}
    >
      <div
        className="MovieFilms"
        ref={refMovieFilms}
      >
        <AnimatePresence>
          {Movies &&
            Movies.map((e, i) => (
              <motion.div
                key={i}
                className={`MovieCard ${
                  i === CurrentMovie ? "activeFilm" : ""
                }`}
                style={{
                  backgroundAttachment: "fixed",
                  backgroundImage: `url(https://image.tmdb.org/t/p/original/${e.backdrop_path})`,
                }}
              >
                <motion.div
                  {...animeSlideFilm(i)}
                  className="leftMovieFilm center"
                  style={{ overflow: "hidden" }}
                  ref={(ref) => (refleftMovie.current[i] = ref)}
                >
                  <motion.div className="leftContentMovie">
                    <div
                      className="center"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div className="" style={{ width: "80%" }}>
                        <div className="center" style={{ overflow: "hidden" }}>
                          <motion.div {...animeText(i)}>
                            <i>
                              <motion.p
                                style={{
                                  fontSize: "1.4rem",
                                  fontWeight: "600",
                                }}
                              >
                                {getNameMonth(e.release_date)}
                              </motion.p>
                            </i>
                          </motion.div>
                          <div
                            className="linear"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                        <div
                          style={{
                            position: "relative",
                            margin: "2rem",
                            overflow: "hidden",
                          }}
                        >
                          <motion.h1 style={{ margin: 0 }} {...animeText(i)}>
                            {e.name || e.title}
                          </motion.h1>
                        </div>
                        <div className="linear"></div>
                        <h2>Type: {e.media_type} </h2>
                      </div>
                      <div
                        className="center"
                        style={{ flexDirection: "column" }}
                      >
                        <img
                          style={{ width: "100px" }}
                          src={`https://image.tmdb.org/t/p/original/${e.poster_path}`}
                        ></img>
                        <div className="scoreFilm">
                          <p>Score: {e.vote_average}/10</p>
                        </div>
                        <div className="center ratingFilm">
                          <Rate
                            defaultValue={e.vote_average / 2}
                            disabled
                            allowHalf
                          />
                        </div>
                      </div>
                    </div>
                    <div className="overViewText">
                      <div>
                        <motion.p>
                          {e.overview.split(" ").map((value, index) => (
                            <motion.span {...animeSpan(i, index)} key={index}>
                              {value}{" "}
                            </motion.span>
                          ))}
                        </motion.p>
                      </div>
                    </div>
                    <div
                      style={{ margin: "1rem", justifyContent: "space-around" }}
                      className="center filmHandle"
                    >
                      <div>
                        <WatchFilms
                          id={e.id}
                          background={e.backdrop_path}
                          setBackImg={setBackImg}
                          setMovieLink={setMovieLink}
                        ></WatchFilms>
                      </div>
                      <Popover
                        trigger="click"
                        className="popover"
                        content={
                          <div>
                            <div className="center" style={{ margin: ".5rem" }}>
                              <NavLink to={`movie/moviedetail/${e.id}`}>
                                <FiInfo></FiInfo>
                                <span>More detail</span>
                              </NavLink>
                            </div>
                            <div
                              className="linear"
                              style={{ width: "100%" }}
                            ></div>
                            <div className="center" style={{ margin: ".5rem" }}>
                              <Button
                                onClick={() => addListFilmHandle(e.id)}
                                type="text"
                                icon={<FiHeart color="black"></FiHeart>}
                              >
                                <span>Add to favorite</span>
                              </Button>
                            </div>
                          </div>
                        }
                      >
                        <Button
                          className=" buttonFilmHandle buttonFilm2"
                          icon={<FiMoreHorizontal></FiMoreHorizontal>}
                        >
                          <span>More information</span>
                        </Button>
                      </Popover>
                    </div>{" "}
                  </motion.div>

                  {/* </NavLink> */}
                </motion.div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <div
        className="center"
        style={{
          width: "100%",
          position: "absolute",
          bottom: "0",
        }}
      >
        <div className="slideScrollMovie" ref={RefScrollImage}>
          <div className="MovieFilms" ref={refSmallSlide}>
            {Movies &&
              Movies.map((e, i) => (
                <div
                  key={i}
                  className={`imageSlide ${
                    CurrentMovie === i ? "ActiveImage" : "notActiveImage"
                  }`}
                >
                  <img
                    ref={(ref) => (miniImage.current[i] = ref)}
                    src={`https://image.tmdb.org/t/p/original/${e.backdrop_path}`}
                  ></img>
                </div>
              ))}
          </div>
        </div>
      </div>
      {MovieLink && BackImg && MovieLink.length > 0 && (
        <MyReactPlayer
          BackImg={BackImg}
          MovieLink={MovieLink}
          setMovieLink={setMovieLink}
        ></MyReactPlayer>
      )}
    </div>
    <div className="vangohPics" style={{height:"100vh",width:"100%",backgroundImage:`url(/vg1.jpg)`}}>

    </div>
    </>
 
);
}
