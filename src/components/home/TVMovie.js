import React, { useEffect, useRef, useState } from "react";
import { TheMovieApi } from "../../function/getApi";
import "./TVMovie.scss";
import useLoading from "../../hook/useLoading";
import { IsLoading } from "../Loading";
import SlideMovie from "./Slide";
const Session=({title,body})=>
  {
    return(
      <div  className="sessionTV">
      <div>
        <h1>{title}</h1>
      </div>
      <div
        className="center"
        style={{ marginTop: "2rem", width: "100%" }}
      >
        {body && (
          <SlideMovie
            list={body}
            perPage={5}
          ></SlideMovie>
        )}
      </div>
    </div>
    )
  }
export default function TVMovie() {
  const [ListTV, setListTV] = useState();
  const [ListMovies, setListMovies] = useState();
  const url = "https://image.tmdb.org/t/p/original";
  const [Loading, setLoading] = useState();
  const getDetailMovie = async (Movies) => {
    const Films = await Promise.all(
      Movies.map(async (movie) => {
        const response = await TheMovieApi(
          `https://api.themoviedb.org/3/movie/${movie.id}`
        );
        if (response.id) {
          return response;
        }
      })
    );
    const update = Movies.map((movie) => {
      const filmWithSameId = Films.find((film) => film?.id === movie.id);
      return filmWithSameId || movie;
    });
    return update;
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await TheMovieApi(
        "https://api.themoviedb.org/3/movie/popular"
      );
      const res2 = await TheMovieApi(
        "https://api.themoviedb.org/3/trending/tv/week"
      );
      console.log(res2);
      if (res.results) {
        const update = await getDetailMovie(res.results);
        setListTV(update);
      }
      if (res2.results) {
        const update = await getDetailMovie(res2.results);
        setListMovies(update);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const Sessions = [
    {
      title: "TV Movie",
    },
  ];

  const ref = useRef();
  const [WidthContainer, setWidthContainer] = useState();

  useEffect(() => {
    getData();
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setWidthContainer(rect.width);
    }
  }, []);
  return (
    <>
      {Loading ? (
        <IsLoading />
      ) : (
        <div className="TVMovieClass" id="tvseries">
          <div
            ref={ref}
            className="vangohPics"
            style={{
              height: "100%",
              width: "100%",
              // backgroundImage: `url(/vg2.jpg)`,
            }}
          >
          <Session title={"Populor"} body={ListTV}/>
          <Session title={"Movies Treding"} body={ListMovies}/>
            
          </div>
        </div>
      )}
    </>
  );
}
