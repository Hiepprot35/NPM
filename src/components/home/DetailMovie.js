import React,{useState,useEffect} from 'react'
import './DetailMovie.js'
export default function DetailMovie(props) {
    const [Movies, setMovies] = useState([]);
    const [Actors, setActors] = useState();
    const data = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${props.MovieID}?api_key=1a312643e7349b023d8aa475b3523601`,
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
    const getActors = async () => {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${props.MovieID}/credits?api_key=1a312643e7349b023d8aa475b3523601`,
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
        setActors(data.results);
        console.log(data);
      };
    useEffect(() => {
      data();
      getActors()
    }, []);
    useEffect(() => {
        if(Movies)
        {
            console.log(Movies)
        }
    }, [Movies]);
  return (
    <div></div>
  )
}
