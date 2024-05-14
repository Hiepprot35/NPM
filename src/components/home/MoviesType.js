import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { TheMovieApi } from "../../function/getApi";
import { CardMovie } from "./listPlay";
import "./TVMovie.scss";
import Layout from "../Layout/layout";
export default function MoviesType(props) {
  const queryParameters = new URLSearchParams(window.location.search);
  const type = queryParameters.get("type");
  const id = queryParameters.get("id");
  const page = queryParameters.get("page");

  const [Movies, setMovies] = useState();
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

  useEffect(() => {
    const getMovie = async () => {
      let url = "";
      if (page) {
        url = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}`;
      }
      const res = await TheMovieApi(url);
      setMovies(res.results);
    };
    getMovie();
  }, []);
  useEffect(() => {
    const fetchDataForList = async () => {
      if (Movies) {
        const dataPromises = Movies.map((e) =>
          TheMovieApi(`https://api.themoviedb.org/3/movie/${e.id}`)
        );
        const filmData = await Promise.all(dataPromises);
        setFilmData(filmData);
      }
    };
    fetchDataForList();
  }, [Movies]);
  useEffect(() => {
    if (filmData) {
      console.log(filmData);
    }
  }, [filmData]);
  return (
    <Layout>
      <div style={{ paddingTop: "10vh" }} className="containerMoviesType">
        <div style={{ display: "flex" }}>
          <h1>Home</h1> <h1>---</h1>
          <h1>Movies type: {type}</h1>
        </div>
        <div className="MoviesType">
          {filmData.length > 0 ? (
            filmData.map((e, i) => (
              <a
                href={`${process.env.REACT_APP_CLIENT_URL}/movie/moviedetail/${e.id}`}
              >
                <CardMovie
                  className={"CardType"}
                  film={e}
                  index={i}
                ></CardMovie>
                
              </a>
            ))
          ) : (
            <span>Loading</span>
          )}
        </div>
        <div>
          <ul className="TextHidden center" style={{ flexDirection: "row",textDecoration:"none" }}>
            {arr.map((e, index) => (
              <li className="pageText center" style={{ height: "2rem" }} >
                {e > 0 ? (
                  <a
                    href={`${process.env.REACT_APP_CLIENT_URL}/films?id=${id}&type=${type}&page=${e}`}
                    key={index}
                  >
                    <span className="circleButton">{e}</span>
                  </a>
                ) : (
                  <span>
                    {e}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
