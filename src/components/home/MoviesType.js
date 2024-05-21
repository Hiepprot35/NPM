import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { TheMovieApi } from "../../function/getApi";
import { CardMovie, Slide } from "./listPlay";
import "./TVMovie.scss";
import Layout from "../Layout/layout";
import { CardSlide } from "./CardSlide";
import SlideMovie from "./Slide";
export default function MoviesType(props) {
  const queryParameters = new URLSearchParams(window.location.search);
  const type = queryParameters.get("type");
  const id = queryParameters.get("id");
  const page = queryParameters.get("page") || 1;
  document.title = type;
  const [Movies, setMovies] = useState([]);
  const [Loading, setLoading] = useState();
  const [filmData, setFilmData] = useState([]);
  const TotalPages = 30;
  const arrayCreate = (page) => {
    const data = [1, 2];
    if (page < 3) {
      return [1, 2, 3, "...", TotalPages - 2, TotalPages - 1, TotalPages];
    }
    if (page >= 3 && page < TotalPages - 2) {
      if (page < 6) {
        return [
          1,
          2,
          3,
          4,
          5,
          6,
          "...",
          TotalPages - 2,
          TotalPages - 1,
          TotalPages,
        ];
      } else if (page < TotalPages - 4) {
        return [
          1,
          2,
          "...",
          page - 1,
          page,
          page + 1,
          "...",
          TotalPages - 1,
          TotalPages,
        ];
      } else {
        return [
          1,
          2,
          "...",
          page - 1,
          page,
          TotalPages - 2,
          TotalPages - 1,
          TotalPages,
        ];
      }
    } else {
      return [
        1,
        2,
        "...",
        TotalPages - 3,
        TotalPages - 2,
        TotalPages - 1,
        TotalPages,
      ];
    }
  };
  const arr = arrayCreate(parseInt(page));
  const getMovie = async () => {
    setLoading(true);
    try {
      let tvs = [];
      let movies = [];
      const TvUrl = `https://api.themoviedb.org/3/discover/tv?with_genres=${id}&page=${page}`;
      const MovieUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&page=${page}`;

      const [tvRes, movieRes] = await Promise.all([
        TheMovieApi(TvUrl),
        TheMovieApi(MovieUrl),
      ]);

      // if (tvRes?.results?.length > 0) {
      //   const tvDetailsPromises = tvRes.results.map((tv) =>
      //     TheMovieApi(`https://api.themoviedb.org/3/tv/${tv.id}`)
      //   );
      //   tvs = (await Promise.all(tvDetailsPromises)).filter((tv) => tv && tv.id);
      // }

      // if (movieRes?.results?.length > 0) {
      //   const movieDetailsPromises = movieRes.results.map((movie) =>
      //     TheMovieApi(`https://api.themoviedb.org/3/movie/${movie.id}`)
      //   );
      //   movies = (await Promise.all(movieDetailsPromises)).filter((movie) => movie && movie.id);
      // }

      movies = movieRes.results;
      tvs = tvRes.results;
      setMovies([...movies, ...tvs]);
    } catch (error) {
      console.error("Error fetching movies or TV shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  useEffect(() => {
    if (Movies) {
      console.log(Movies);
    }
  }, [Movies]);
  return (
    <Layout>
      <div style={{ paddingTop: "10vh" }} className="containerMoviesType">
        <div style={{ display: "flex" }}>
          <h1>Home</h1> <h1>---</h1>
          <h1>Movies type: {type}</h1>
        </div>
        {Loading ? (
          <div className="center" style={{ width: "100%", height: "100%" }}>
            <div className="loader "></div>
          </div>
        ) : (
          <>
            <div className="MoviesType center">
              {/* {Movies.length > 0 &&
                Movies.map((e, i) => (                 
                    <CardSlide
                      className={"CardType"}
                      card={{width:15,height:20}}
                      fontSize={.65}
                      e={e}
                      i={i}
                    ></CardSlide>
                ))} */}
              {Movies.length > 0 && (
                <div  style={{}}>
                  {[0, 1, 2, 3, 4].map(
                    (e) =>
                      Movies.slice(e*5, 5+e*5).length > 0 && (
                        <SlideMovie
                          card={{ fontSize: 0.7, height: 25, width: 10 }}
                          isPage={true}
                          list={Movies.slice(e*5, 5+e*5)}
                        />
                      )
                  )}
                </div>
              )}
            </div>
            <div>
              <ul
                className="TextHidden center"
                style={{ flexDirection: "row", textDecoration: "none" }}
              >
                {arr.map((e, index) => (
                  <li className="pageText center" style={{ height: "2rem" }}>
                    {e > 0 ? (
                      <a
                        href={`${process.env.REACT_APP_CLIENT_URL}/films?id=${id}&type=${type}&page=${e}`}
                        key={index}
                      >
                        <span className="circleButton">{e}</span>
                      </a>
                    ) : (
                      <span>{e}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
