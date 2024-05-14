import { Button, Popover } from "antd";
import React, { memo } from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiEye, FiX } from "react-icons/fi";
 function WatchFilms({setBackImg,setMovieLink,id,background}) {
  const token = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTMxMjY0M2U3MzQ5YjAyM2Q4YWE0NzViMzUyMzYwMSIsInN1YiI6IjY1ZTZkOGMzOGQxYjhlMDE4NzY3MjEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IhIe9_G8KXIFkM2bHAhWYkZy_uaOvUolfJrfI1YQZm4`;
  const [Report, setReport] = useState(false);
  const watchMovieHandle = async () => {
    try {
      console.log("click")
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        {
          method: "GET",
          headers: {
            accept:"application/json",
            'Content-type':"application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data?.results?.length>0) {
        console.log(data)
        setBackImg(
          `url(https://image.tmdb.org/t/p/original/${background}})`
        );
        setMovieLink(data.results);
      } else {
        setReport("Xin lỗi. Hệ thông chưa cập nhập phim này");
      }
    } catch (error) {
      console.log(error)
    }
  
  };

  return (
    <>
      <div>
        {!Report ? (
          <Button
            onClick={() => watchMovieHandle(id,background)}
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
     
    </>
  );
}
export default memo(WatchFilms)