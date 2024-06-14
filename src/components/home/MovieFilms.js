import { Button, Popover, Rate } from "antd";
import {
  AnimatePresence,
  color,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import useLoading from "../../hook/useLoading";
import React, { useEffect, useRef, useState } from "react";
import { FiHeart, FiInfo, FiMoreHorizontal } from "react-icons/fi";
import { Span, Slide, Text } from "./listPlay";
import { NavLink } from "react-router-dom";
import { TheMovieApi, fetchApiRes } from "../../function/getApi";
import { getNameMonth, timeFilm } from "../../function/getTime";
import useAuth from "../../hook/useAuth";
import "./MovieFilms.css";
import MyReactPlayer from "./ReactPlayer";
import WatchFilms from "./watchFilms";
import { Image } from "./home";
import { countries, countrys } from "../../lib/data";
import { IsLoading } from "../Loading";
export const genresList = async () => {
  const MOVIE = await TheMovieApi(
    `https://api.themoviedb.org/3/genre/movie/list`
  );
  const data1 = MOVIE?.genres;
  const TV = await TheMovieApi(`https://api.themoviedb.org/3/genre/tv/list  `);
  const data2 = TV?.genres;
  return data1.concat(data2);
};
export default function MovieFilms(props) {
  const [Loading, setIsLoading] = useState(true);
  const [CurrentMovie, setCurrentMovie] = useState(0);
  const [Movies, setMovies] = useState([]);
  const { auth } = useAuth();
  const [BackImg, setBackImg] = useState();
  const refleftMovie = useRef([]);
  const refSmallSlide = useRef();
  const [GenresList, setGenresList] = useState();
  const data = async () => {
    try {
      setIsLoading(true);
      const data = await TheMovieApi(
        "https://api.themoviedb.org/3/trending/all/week?language=en-US"
      );
      if (data.results) {
        const MoviesRes = data.results;
        const Films = await Promise.all(
          MoviesRes.map(async (movie) => {
            const response = await TheMovieApi(
              `https://api.themoviedb.org/3/movie/${movie.id}`
            );
            if (response.id) {
              return response;
            }
          })
        );
        const update = MoviesRes.map((movie) => {
          const filmWithSameId = Films.find((film) => film?.id === movie.id);
          return filmWithSameId || movie;
        });
        setMovies(update);
      }
      const data2 = await genresList();
      setGenresList(data2);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
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
  }, [Movies, Loading]);

  const miniImage = useRef([]);
  const clickNextMovie = () => {
    setReport();

    if (Movies.length > 0) {
      if (CurrentMovie === Movies.length - 1) {
        setCurrentMovie(0);
      } else {
        setCurrentMovie((pre) => pre + 1);
      }
    }
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
    const moviePercent = (CurrentMovie * 100) / Movies?.length;
    const smallSlidePercent = (CurrentMovie * 100) / Movies?.length;
    if (refMovieFilms.current && refSmallSlide.current) {
      refMovieFilms.current.style.transform = `translateX(-${moviePercent}%)`;
      refSmallSlide.current.style.transform = `translateX(-${smallSlidePercent}%)`;
    }
    if (CurrentMovie === 0 && Movies && RefScrollImage.current) {
      RefScrollImage.current.style.paddingLeft = "40%";
    }
    if (ref.current) {
      ref.current.addEventListener("keydown", handleKeyPress);
      ref.current.tabIndex = 0;

      if (CurrentMovie >= 0 && Movies) {
        setBackImg(
          `url(https://image.tmdb.org/t/p/original/${Movies[CurrentMovie]?.backdrop_path})`
        );
        props.setImg(
          `url(https://image.tmdb.org/t/p/original/${Movies[CurrentMovie]?.backdrop_path})`
        );
      }
      return () => {
        ref?.current?.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [CurrentMovie, Movies, Loading]);

  const [MovieLink, setMovieLink] = useState([]);
  const [Report, setReport] = useState(false);

  const animeSlideFilm = (i) => ({
    initial: "hidden",
    animate: i === CurrentMovie ? "visible" : "hidden",
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
        opacity: 0,
        transition: {
          x: { stiffness: 1000 },
        },
      },
    },
  });
  const RefScrollImage = useRef(null);
  const addListFilmHandle = async (e) => {
    if (auth.userID) {
      const res = await fetchApiRes("/getInsertFilm", "POST", {
        UserID: auth.userID,
        filmID: e,
      });
      alert(res.message);
    } else {
      alert("Bạn cần đăng nhập để thêm vào playlist. ");
    }
  };
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  return (
    <>
      {
        <motion.div id="trending" className="MovieContainer" ref={ref}>
          {Loading ? (
            <IsLoading />
          ) : (
            <>
              <div
                className="circleShadow"
                style={{
                  transition:"500ms linear",
                  opacity:`${BackImg?1:0}`,
                  backgroundImage: `${BackImg?BackImg:""}`,
                }}
              ></div>
              <div className="MovieFilms" ref={refMovieFilms}>
                <AnimatePresence>
                  {Movies &&
                    Movies.map((e, i) => (
                      <motion.div
                        key={i}
                        className={`MovieCard ${
                          i === CurrentMovie ? "activeFilm" : ""
                        }`}
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
                              <div className="" style={{ width: "40vw" }}>
                                <div
                                  className="center"
                                  style={{ overflow: "hidden" }}
                                >
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
                                  <motion.h1
                                    style={{ margin: 0 }}
                                    {...animeText(i)}
                                  >
                                    {e.name || e.title}
                                  </motion.h1>
                                </div>
                                <div className="linear"></div>
                                <div
                                  className="center"
                                  style={{ margin: "1rem" }}
                                >
                                  {e?.runtime && (
                                    <Text className={`font-semibold`}
                                      text={`${timeFilm(e?.runtime)} | `}
                                    ></Text>
                                  )}

                                  <Text className={`font-semibold`}
                                    text={`${e?.origin_country.map(
                                      (country) => {
                                        const data = countries.find(
                                          (ac) => ac.iso_3166_1 === country
                                        );
                                        return data
                                          ? data.english_name
                                          : country;
                                      }
                                    )} | `}
                                  />

                                  {GenresList && e.genre_ids && (
                                    <Text className={`font-semibold`}
                                      style={{ fontSize: "1rem" }}
                                      text={`${e.genre_ids.map(
                                        (e) =>
                                          GenresList.find(
                                            (values) => values.id === e
                                          )?.name
                                      )}`}
                                    />
                                  )}
                                  {e.genres && (
                                    <Text className={`font-semibold`}
                                      style={{ fontSize: "1rem" }}
                                      text={`${e.genres.map((e) => e.name)}`}
                                    />
                                  )}
                                </div>
                              </div>
                              <div
                                className="center"
                                style={{ flexDirection: "column" }}
                              >
                                <div className="">Play</div>

                                <Image
                                  style={{ width: "6rem" }}
                                  src={
                                    e.poster_path &&
                                    `https://image.tmdb.org/t/p/original/${e.poster_path}`
                                  }
                                ></Image>
                                <div
                                  className="scoreFilm center"
                                  style={{ margin: ".3rem" }}
                                >
                                  <span>
                                    <img
                                      style={{
                                        width: "2rem",
                                        marginRight: ".6rem",
                                      }}
                                      src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
                                    ></img>
                                  </span>
                                  <p style={{ fontWeight: "600" }}>
                                    {e.vote_average}/10
                                  </p>
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
                                <Text hiddenText={true} text={e.overview} />
                              </div>
                            </div>
                            <div
                              style={{
                                margin: "1rem",
                                justifyContent: "space-around",
                              }}
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
                                    <div
                                      className="center"
                                      style={{ margin: ".5rem" }}
                                    >
                                      <NavLink to={`movie/moviedetail/${e.id}`}>
                                        <FiInfo></FiInfo>
                                        <span>More detail</span>
                                      </NavLink>
                                    </div>
                                    <div
                                      className="linear"
                                      style={{ width: "100%" }}
                                    ></div>
                                    <div
                                      className="center"
                                      style={{ margin: ".5rem" }}
                                    >
                                      <Button
                                        onClick={() => addListFilmHandle(e.id)}
                                        type="text"
                                        icon={<FiHeart color="black"></FiHeart>}
                                      >
                                        <span>Add to Playlist</span>
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
                  height: "15%",
                  position: "absolute",
                  bottom: "0",
                }}
              >
                <div className="slideScrollMovie " ref={RefScrollImage}>
                  <div className="MovieFilms" ref={refSmallSlide}>
                    {Movies &&
                      Movies.map((e, i) => (
                        <div
                          className={`MovieFilms2 center  ${
                            CurrentMovie === i
                              ? "ActiveImage"
                              : "notActiveImage"
                          } `}
                          key={i}
                        >
                          <div
                            onClick={() => setCurrentMovie(i)}
                            className={`imageSlide  center `}
                          >
                            <Image
                              src={
                                e.poster_path &&
                                `https://image.tmdb.org/t/p/original/${e.poster_path}`
                              }
                            ></Image>
                          </div>
                          <div
                            className="textImageSlide"
                            style={{
                              flexDirection: "column",
                              width: "50%",
                              transition: "500ms ease",
                            }}
                          >
                            <Text
                              style={{ fontSize: "1rem", color: "white" }}
                              text={`${e?.title || e?.name}`}
                            ></Text>
                            {e?.runtime && (
                              <Text
                                style={{ fontSize: ".6rem", color: "white" }}
                                text={`Time: ${e.runtime}m`}
                              ></Text>
                            )}
                            {GenresList && e.genre_ids && (
                              <Text
                                style={{ fontSize: ".6rem", color: "gray" }}
                                text={`${e.genre_ids.map(
                                  (e) =>
                                    GenresList.find((values) => values.id === e)
                                      ?.name
                                )}`}
                              />
                            )}
                            {e.genres && (
                              <Text
                                style={{ fontSize: ".6rem", color: "gray" }}
                                text={`${e.genres.map((e) => e.name)}`}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      }
    </>
  );
}
