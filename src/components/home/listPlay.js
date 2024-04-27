import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../hook/useAuth";
import { fetchApiRes } from "../../function/getApi";
import { Card } from "antd";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import Meta from "antd/es/card/Meta";
import { useSession } from "../../context/sectionProvider";
import WatchFilms from "./watchFilms";
import MyReactPlayer from "./ReactPlayer";
import "./DetailMovie.scss";
import { timeFilm } from "../../function/getTime";
function useParallax(value, dis) {
  return useTransform(value, [0, 1], [-dis, dis]);
}
export function Slide({ children, className }) {
  const ref = useRef();
  const { session, setSession } = useSession();
  const inView = useInView(ref);
  const controls = useAnimation();
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.set("hidden");
    }
  }, [inView]);
  const animeSpan = {
    initial: "hidden",
    animate: controls,

    variants: {
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          duration: 1,
        },
      },
      hidden: {
        x: "-100%",
        opacity: 0,
      },
    },
  };
  return (
    <motion.div className={className} ref={ref} {...animeSpan}>
      {children}
    </motion.div>
  );
}
export function Span({ e, i }) {
  const ref = useRef();
  const inView = useInView(ref);
  const controls = useAnimation();
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.set("hidden");
    }
  }, [inView]);
  const animeSpan = {
    initial: "hidden",
    animate: controls,

    variants: {
      visible: {
        opacity: 1,
        transition: {
          duration: 0.3,
          delay: i / 10,
        },
      },
      hidden: {
        opacity: 0,
      },
    },
  };
  return (
    <motion.span ref={ref} {...animeSpan}>
      {e}{" "}
    </motion.span>
  );
}
export default function ListPlay() {
  const { auth } = useAuth();
  const [ListFilm, setListFilm] = useState([]);
  const [MovieLink, setMovieLink] = useState();
  const [BackImg, setBackImg] = useState();
  useEffect(() => {
    const getFilmList = async () => {
      const res = await fetchApiRes("getAllFilm", "POST", {
        UserID: auth.userID,
      });
      setListFilm(res.result);
    };
    getFilmList();
  }, [auth.userID]);
  useEffect(() => {
    console.log("auth", auth);
  }, []);
  const token = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTMxMjY0M2U3MzQ5YjAyM2Q4YWE0NzViMzUyMzYwMSIsInN1YiI6IjY1ZTZkOGMzOGQxYjhlMDE4NzY3MjEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IhIe9_G8KXIFkM2bHAhWYkZy_uaOvUolfJrfI1YQZm4`;

  const fetchData = async (id) => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  };

  const [filmData, setFilmData] = useState([]);

  useEffect(() => {
    const fetchDataForList = async () => {
      const dataPromises = ListFilm.map((e) => fetchData(e.filmID));
      const filmData = await Promise.all(dataPromises);
      setFilmData(filmData);
    };
    fetchDataForList();
  }, [ListFilm]);
  const scrollBarRef = useRef();
  const circleScrollRef = useRef();
  const listMovieRef = useRef();
  const [CircleLeft, setCircleLeft] = useState();
  useEffect(() => {
    if (listMovieRef.current && filmData.length > 0) {
      const widthContent =
        document.documentElement.style.getPropertyValue("--widthContentHome");
      const value = Math.floor(parseInt(widthContent.split("vw")[0]) / 8);
      console.log(value, "width");
      listMovieRef.current.style.width = filmData.length * value + "vw";
    }
  }, [filmData]);
  const [TransitionMovieList, setTransitionMovieList] = useState();
  const scrollMovie = (e) => {
    e.preventDefault();
    if (
      circleScrollRef.current &&
      scrollBarRef.current &&
      listMovieRef.current
    ) {
      const scrollBarRect = scrollBarRef.current.getBoundingClientRect();
      const circleWidth = circleScrollRef.current.offsetWidth;
      const mouseX = e.clientX;
      let left = mouseX - scrollBarRect.left - circleWidth / 2;
      const widthContent =
        document.documentElement.style.getPropertyValue("--widthContentHome");
      const value = Math.floor(parseInt(widthContent.split("vw")[0]) / 4);
      console.log(value, "width");
      // Xác định phạm vi của thanh cuộn
      const maxLeft = scrollBarRect.width - circleWidth;
      const ccc = (filmData.length - 4) / filmData.length;
      // Giới hạn giá trị left trong phạm vi của thanh cuộn
      left = Math.min(Math.max(left, 0), maxLeft);
      setCircleLeft(left);
      // scrollBarRef.current.style.transform = `scaleX(${left / scrollBarRect.width})`;
      listMovieRef.current.style.transition = "transform 0.5s ease-in-out";
      listMovieRef.current.style.transform = `translateX(-${
        ccc * 100 * (left / scrollBarRect.width)
      }%)`;
      setTransitionMovieList(ccc * 100 * (left / scrollBarRect.width));
      // Cập nhật vị trí của thanh cuộn
      circleScrollRef.current.style.left = left + "px";
    }
  };
  const dragOver = () => {
    console.log(CircleLeft);
    if (
      circleScrollRef.current &&
      CircleLeft >= 0 &&
      TransitionMovieList >= 0 &&
      listMovieRef.current
    ) {
      circleScrollRef.current.style.left = CircleLeft + "px";
      listMovieRef.current.style.transform = `translateX(-${TransitionMovieList}%)`;
    }
  };
  const animeSpan = (e) => ({
    initial: "hidden",
    animate: "visible",
    variants: {
      visible: {
        opacity: 1,
        transition: {
          duration: 0.3,
          delay: e / 10,
        },
      },
      hidden: {
        opacity: 0,
      },
    },
  });
  const playlistRef = useRef();
  const [Element, setElement] = useState();
  useEffect(() => {
    if (playlistRef.current) {
      const rect = playlistRef.current.getBoundingClientRect();
      setElement(rect);
    }
  }, []);
  const { scrollYProgress, scrollXProgress } = useScroll({
    target: playlistRef,
    offset: ["start center", "end center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "-180deg"]);
  const y = useParallax(scrollYProgress, Element?.height / 2 + 36);

  const text = `"There is no blue without yellow and without orange." `;
  return (
    <>
      <motion.div
        className="userMovie"
        id="playlist"
        ref={playlistRef}
        style={{ opacity: opacity, backgroundImage: `url(/vg2.jpg)` }}
      >
        <motion.div className="sunanimation" style={{ rotate: rotate }}>
          <motion.h1 style={{ fontSize: "8rem"}}>⭐</motion.h1>
        </motion.div>

        <div className="textList center" >
          <motion.p style={{ y, padding: "1rem", fontSize: "3rem" }}>
            {text.split(" ").map((e, i) => (
              <Span e={e} i={i}></Span>
            ))}
            <br></br>
            <span style={{fontSize:"2rem"}}> {"    "}Vincent Van Gogh</span>
          </motion.p>
        </div>
        <Slide className={"abcdef"}>
          <div className="MyScrollBar" ref={scrollBarRef}>
            <div
              className="circleScroll"
              ref={circleScrollRef}
              draggable
              onDragEnd={dragOver}
              onDrag={scrollMovie}
            ></div>
          </div>
          <div className="listMovies" ref={listMovieRef}>
            {filmData.map((film, index) => (
              <div className="CardMovie" key={index}>
                <article>
                  <header>
                    <div
                      className="cardBackGround"
                      style={{
                        backgroundImage: `url('https://image.tmdb.org/t/p/original/${film.poster_path}')`,
                      }}
                    ></div>
                  </header>
                  <div style={{ marginLeft: "1rem" }}>
                    <div style={{ height: "4rem" }}>
                      <h1>{film.original_title}</h1>
                    </div>
                    <div
                      className="detailMovieCard"
                      style={{ height: "5vh", overflow: "hidden" }}
                    >
                      <p
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          wordWrap: "break-word",
                        }}
                      >
                        {timeFilm(film.runtime)}/{" "}
                        {film?.production_companies[0]?.name}/{" "}
                        {film.genres.map((e, index) => (
                          <span key={index}>
                            <>
                              {" "}
                              {e.name}
                              {index < film.genres.length - 1 && ","}
                            </>
                          </span>
                        ))}
                      </p>
                    </div>

                    <div className="center" style={{ margin: "1rem" }}>
                      <div className="linear"></div>
                    </div>
                    <footer>
                      <WatchFilms
                        id={film.id}
                        setMovieLink={setMovieLink}
                        setBackImg={setBackImg}
                      ></WatchFilms>
                    </footer>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </Slide>

        {MovieLink && BackImg && MovieLink.length > 0 && (
          <MyReactPlayer
            BackImg={BackImg}
            MovieLink={MovieLink}
            setMovieLink={setMovieLink}
          ></MyReactPlayer>
        )}
      </motion.div>
      <div
        className="vangohPics"
        style={{
          height: "100vh",
          width: "100%",
          backgroundImage: `url(/vg1.jpg)`,
        }}
      ></div>
    </>
  );
}
