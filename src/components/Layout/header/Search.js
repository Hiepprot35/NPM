import React, { memo, useEffect, useState } from "react";
import { TheMovieApi } from "../../../function/getApi";
import { Span, Text } from "../../home/listPlay";
import { motion } from "framer-motion";
function Search({ query }) {
  const sidebar = {
    open: {
      clipPath: "inset(0% 0% 0% 0% round 10px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.7,
        delayChildren: 0.3,
        staggerChildren: 0.5,
      },
    },
    closed: {
      clipPath: "inset(10% 50% 90% 50% round 10px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3,
      },
    },
  };
  const itemVariants = (e) => ({
    open: {
      display: "flex",
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: e / 10,
      },
    },
    closed: {
      display: "none",
      x: 200,
      transition: { duration: 0.2 },
    },
  });

  const [Movies, setMovies] = useState();
  const [Loading, setLoading] = useState(false);
  const getMovies = async () => {
    setLoading(true);
    const res = await TheMovieApi(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );
    if (res.results) {
      setLoading(false);
      setMovies(res.results);
    }
  };
  const [Show, setShow] = useState(false);
  useEffect(() => {
    if (Movies?.length > 0)
      setTimeout(() => {
        setShow(true);
      }, 500);
  }, [Movies]);
  useEffect(() => {
    if (query) {
      getMovies();
      setShow(true);
    } else {
      setMovies()
      setShow(false);
    }
  }, [query]);
  useEffect(() => {
    if (Movies?.length > 0) {
      setShow(false);
      setTimeout(() => {
        if (Movies.length > 0) {
          setShow(true);
        }
      }, 1000);
    } else {
      setShow(false);
    }
  }, [Movies]);

  return (
    <motion.div className="SearchResults" variants={sidebar}>
      {Movies &&Movies.length > 0 &&
        !Loading &&
        Movies.map(
          (e, i) =>
            i < 5 && (
              <motion.div
                className="result "
                variants={itemVariants(i)}
                animate={Show ? "open" : "closed"}
              >
                <>
                  {Movies[i] ? (
                    <>
                      <div className="">
                        <a
                          href={`${process.env.REACT_APP_CLIENT_URL}/movie/moviedetail/${e.id}`}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/original/${
                              Movies[i]?.poster_path || Movies[i]?.backdrop_path
                            }`}
                            alt="Poster"
                          />
                        </a>
                      </div>
                      <div className="contentSearch">
                        <span>
                          {Movies[i]?.original_title || Movies[i]?.title}
                        </span>
                        <span>{Movies[i]?.release_date}</span>
                      </div>
                    </>
                  ) : (
                    <span>Loading</span>
                  )}
                </>
              </motion.div>
            )
        )}
      {/* {Movies.length === 0 && query&& (
        <div className="result">
          <span>Không có phim</span>
        </div>
      )} */}
      {Loading && (
        <div className="result center" style={{width:"100%"}}>
          <div className="loader"></div>
        </div>
      )}
        {!Loading&&Movies&&Movies.length===0&& (
        <div className="result center" style={{width:"100%"}}>
          <Text text={`Hông có phim "${query}"`}> </Text>
        </div>
      )}
    </motion.div>
  );
}
export default memo(Search)