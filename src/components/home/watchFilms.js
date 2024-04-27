import { Button, Popover } from "antd";
import React from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiEye, FiX } from "react-icons/fi";
export default function WatchFilms({setBackImg,setMovieLink,id,background}) {
  const token = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTMxMjY0M2U3MzQ5YjAyM2Q4YWE0NzViMzUyMzYwMSIsInN1YiI6IjY1ZTZkOGMzOGQxYjhlMDE4NzY3MjEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IhIe9_G8KXIFkM2bHAhWYkZy_uaOvUolfJrfI1YQZm4`;
  const [Report, setReport] = useState(false);
  const watchMovieHandle = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (data.results) {
      setBackImg(
        `url(https://image.tmdb.org/t/p/original/${background}})`
      );
      setMovieLink(data.results);
    } else {
      setReport("Xin lỗi. Hệ thông chưa cập nhập phim này");
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
