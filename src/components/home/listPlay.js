import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../hook/useAuth";
import { TheMovieApi, fetchApiRes } from "../../function/getApi";
import { Card } from "antd";
import {
  color,
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
        x: "100%",
        opacity: 0,
      },
    },
  };
  return (
    <motion.div  className={className} ref={ref} {...animeSpan}>
      {children}
    </motion.div>
  );
}
export function Span({ e, i, style, onClick }) {
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
    <motion.span key={i} onClick={onClick} style={style} ref={ref} {...animeSpan}>
      {e}{" "}
    </motion.span>
  );
}

export const Text = (props) => {
  const [seeMore, setSeeMore] = useState(false);
  const countSee = 20;
  const [CountSeeMore, setCountSeeMore] = useState(20);
  const splitText = props.text.split(" ");
  const truncatedText = splitText.slice(0, countSee);
  const remainingText = splitText.slice(countSee);

  const handleSeeMoreClick = () => {
    setSeeMore(true);
    setCountSeeMore(20);
  };
  const handleNotSeeMoreClick = () => {
    setCountSeeMore(1);
    setSeeMore(false);
  };
  return (
    <motion.p
      className="SeeMoreText"
      onClick={seeMore ? handleNotSeeMoreClick : null}
      ref={props.ref}
    >
      <>
        {!props.hiddenText ? (
          splitText.map((e, i) => <Span style={props.style}  key={i} e={e} i={i} />)
        ) : (
          <>
            {truncatedText.map((e, i) => (
              <Span style={props.style} key={i} e={e} i={i} />
            ))}
            {seeMore ? (
              remainingText.map((e, i) => <Span e={e} i={i} />)
            ) : (
              <>
                <Span key={CountSeeMore} i={CountSeeMore} e={"..."} />
                <Span
                  onClick={handleSeeMoreClick}
                  i={CountSeeMore + 1}
                  key={CountSeeMore + 1}
                  style={{ color: "#faff2f", cursor: "pointer" }}
                  e={"Xem thêm"}
                />
              </>
            )}
          </>
        )}
      </>
    </motion.p>
  );
};

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

  const [filmData, setFilmData] = useState([]);
  useEffect(() => {
    const fetchDataForList = async () => {
      const dataPromises = ListFilm.map((e) =>
        TheMovieApi(`https://api.themoviedb.org/3/movie/${e.filmID}`)
      );
      const filmData = await Promise.all(dataPromises);
      setFilmData(filmData);
    };
    fetchDataForList();
    if (filmData) {
      console.log(filmData);
    }
  }, [ListFilm]);
  const listMovieRef = useRef();
  const playlistRef = useRef();
  const textRef = useRef();

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
  useEffect(() => {}, []);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "180deg"]);
  const y = useParallax(
    scrollYProgress,
    Element?.height / 2 + textRef?.current?.getBoundingClientRect()?.height / 2
  );
  const text = `"There is no blue without yellow and without orange."`;
  return (
    <>
      <motion.div
        className="userMovie"
        id="playlist"
        ref={playlistRef}
        style={{ opacity: opacity, backgroundImage: `url(/vg2.jpg)` }}
      >
        <motion.div className="sunanimation" style={{ rotate: rotate }}>
          <motion.h1 style={{ fontSize: "5rem" }}>⭐</motion.h1>
        </motion.div>

        <div className="textList center">
          <motion.div className="parrallaxText" style={{ y }} ref={textRef}>
            <Text text={text} style={{fontSize:'2.5rem'}}></Text>
            {/* <br></br> */}
            <Text text={"-------------------------"} />
            <Text text="Vincent Van Gogh"></Text>
          </motion.div>
        </div>
        <Slide className={"abcdef"}>
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
                    <div style={{ height: "4rem", overflow: "hidden" }}>
                      <h1
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {film.original_title}
                      </h1>
                    </div>

                    <div
                      className="detailMovieCard center"
                      style={{ height: "5vh" }}
                    >
                      <p>
                        {timeFilm(film.runtime)}/{" "}
                        {film?.production_companies[0]?.name}/{" "}
                        {film.genres.map((e, index) => (
                          <i key={index}>
                            <>
                              {" "}
                              {e.name}
                              {index < film.genres.length - 1 && ","}
                            </>
                          </i>
                        ))}
                      </p>
                    </div>

                    <div className="center" style={{ margin: "1rem" }}>
                      <div className="linear"></div>
                    </div>
                    <footer>
                      <div className="center">
                        <WatchFilms
                          id={film.id}
                          setMovieLink={setMovieLink}
                          setBackImg={setBackImg}
                        ></WatchFilms>
                      </div>
                    </footer>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </Slide>
      </motion.div>
      {MovieLink && BackImg && MovieLink.length > 0 && (
        <MyReactPlayer
          BackImg={BackImg}
          MovieLink={MovieLink}
          setMovieLink={setMovieLink}
        ></MyReactPlayer>
      )}
    </>
  );
}
