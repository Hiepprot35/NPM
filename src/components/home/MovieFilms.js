import React, { useEffect, useRef, useState } from "react";
import "./MovieFilms.css";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button, Popover, Rate } from "antd";
import ReactPlayer from "react-player";

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
export default function MovieFilms() {
  const [CurrentMovie, setCurrentMovie] = useState(0);
  const [Movies, setMovies] = useState([]);
  const [Actors, setActors] = useState();
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
  const watchMovieHandle = async (id) => {
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
      setMovieLink(data.results);
    } else {
      setReport("Xin lỗi. Hệ thông chưa cập nhập phim này");
    }
  };

  const RefReactPlayer = useRef(null);
  const RefScrollImage = useRef(null);
  const animeText = (i) => ({
    animate: CurrentMovie === i ? { opacity: 1, transform: "translateY(0%)" } : { opacity: 0, transform: "translateY(-100%)" },
    inherit: { opacity: 0, transform: "translateY(-100%)" },
    transition: { duration: 0.3, delay: 1 }
  });
  const closeWindowHandle = () => {
    setMovieLink([]);
  };
  return (
    <div
      className="MovieContainer"
      onWheel={(e) => {
        if (e.deltaY > 0) {
          clickNextMovie(); // Cuộn xuống
        } else {
          clickBackMovie(); // Cuộn lên
        }
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <div className="MovieFilms" ref={refMovieFilms}>
        <AnimatePresence>
          {Movies &&
            Movies.map((e, i) => (
              <motion.div
                key={i}
                className={`MovieCard ${
                  i === CurrentMovie ? "activeFilm" : ""
                }`}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original/${e.backdrop_path})`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  animate={{
                    opacity: CurrentMovie === i ? 1 : 0,
                    transform: `translateX(${
                      CurrentMovie === i ? "0%" : "-100%"
                    })`,
                  }}
                  className="leftMovieFilm center"
                  ref={(ref) => (refleftMovie.current[i] = ref)}
                >
                  {/* <NavLink to={`/movie/moviedetail/${e.id}`}> */}
                  <div className="leftContentMovie">
                    <div
                      className="center"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div className="" style={{ width: "80%" }}>
                        <div className="center">
                          <div>
                            <i>
                              <motion.p
                               {...animeText(i)}
                                style={{
                                  fontSize: "1.4rem",
                                  fontWeight: "600",
                                }}
                              >
                                {getNameMonth(e.release_date)}
                              </motion.p>
                            </i>
                          </div>
                          <div
                            className="linear"
                            style={{ width: "100%" }}
                          ></div>
                        </div>

                        <motion.h1
                         {...animeText(i)}
                        >
                          {e.name || e.title}
                        </motion.h1>
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
                    <motion.div
                      className="overViewText"
                      animate={
                        CurrentMovie === i && {
                          opacity: 1,
                          transform: "translateX(0%)",
                        }
                      }
                      inherit={{ opacity: 0, transform: "translateX(-100%)" }}
                      transition={{ duration: 1, delay: 1 }}
                    >
                      <div>
                        <motion.p
                          animate={
                            CurrentMovie === i
                              ? { opacity: 1, transform: "translateY(0%)" }
                              : { opacity: 0, transform: "translateY(100%)" }
                          }
                          inherit={{
                            opacity: 0,
                            transform: "translateY(-100%)",
                          }}
                          transition={{ duration: 0.3, delay: 1 }}
                        >
                          {e.overview}
                        </motion.p>
                      </div>
                    </motion.div>
                    <div
                      style={{ margin: "1rem", justifyContent: "space-around" }}
                      className="center filmHandle"
                    >
                      <div>
                        {!Report ? (
                          <Button
                            onClick={() => watchMovieHandle(e.id)}
                            className="buttonFilmHandle buttonFilm"
                            icon={<FiEye />}
                          >
                            <span>Watch</span>
                          </Button>
                        ) : (
                          <Popover content={Report}>
                            <Button
                              // onClick={() => watchMovieHandle(e.id)}
                              className="buttonFilmHandle buttonFilm"
                              icon={<FiEye />}
                            >
                              <span>Watch</span>
                            </Button>
                          </Popover>
                        )}
                      </div>
                      <Popover
                        trigger="click"
                        content={
                          <div>
                            <div className="center" style={{ margin: ".5rem" }}>
                              <NavLink to={`movie/moviedetail/${e.id}`}>
                                <FiInfo></FiInfo>
                                More detail
                              </NavLink>
                            </div>
                            <div
                              className="linear"
                              style={{ width: "100%" }}
                            ></div>
                            <div className="" style={{ margin: ".5rem" }}>
                              <Button
                                type="text"
                                icon={<FiHeart color="black"></FiHeart>}
                              >
                                <span style={{ color: "black" }}>
                                  Add to favorite
                                </span>
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
                  </div>

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
                  <motion.img
                    ref={(ref) => (miniImage.current[i] = ref)}
                    src={`https://image.tmdb.org/t/p/original/${e.backdrop_path}`}
                  ></motion.img>
                </div>
              ))}
          </div>
        </div>
      </div>
      {MovieLink && MovieLink.length > 0 && (
        <motion.div
          className="Videoplayer center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            className="CloseWindowVideo"
            onClick={closeWindowHandle}
            icon={<FiX></FiX>}
          ></Button>
          <ReactPlayer
            ref={RefReactPlayer}
            controls
            playing
            url={MovieLink.map(
              (e) => `https://www.youtube.com/watch?v=${e.key}`
            )}
            width="80%"
            height="80%"
            // fullscreen={true} // Kích hoạt chế độ toàn màn hình
          />
        </motion.div>
      )}
    </div>
  );
}
