import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiPlayCircle } from "react-icons/fi";
import useGenres from "../../hook/useGenres";
import "./slide.css";
import { TextAnimetion } from "./Slide";
export const CardSlide = ({ e, i, card, className }) => {
  const url = "https://image.tmdb.org/t/p/original";
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const { genres } = useGenres();
  const variants = {
    open: {
      opacity: 1,
      display: "block",
      borderTopRightRadius: "1rem",
      borderBottomRightRadius: "1rem",
      x: 0,
      transition: { duration: 0.5, stiffness: 2000 },
    },
    closed: {
      x: -100,
      display: "none",
      width: 0,
      opacity: 0,
      transition: { duration: 0.3, stiffness: 2000 },
    },
  };
  const variantsTag = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.5, stiffness: 2000 },
    },
    closed: {
      x: -200,
      opacity: 0,
      transition: { duration: 0.3, stiffness: 2000 },
    },
  };
  const [isHover, setisHover] = useState();
  useEffect(() => {}, []);
  return (
    <a href={`${process.env.REACT_APP_CLIENT_URL}/movie/moviedetail/${e.id}`}>
      <div>
        <div
          className="cardSlide"
          style={{
            width: `${isHover ? 2.5 * card.width : card.width}vw`,
            height: `${card.height}vh`,
            margin: `${card.width / 15}vw`,
            display: "flex",
            position: "relative", // Set position to relative
          }}
          onMouseEnter={() => setisHover(true)}
          onMouseLeave={() => setisHover(false)}
          key={e.id}
        >
          <div
            style={{
              borderRadius: "10rem",
              height: "100%",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "100%",
              }}
            >
              {isHover && (
                <div
                  className="center"
                  style={{
                    position: "absolute",
                    inset: "0",
                    flexDirection: "column",
                    zIndex: 2,
                  }}
                >
                  <FiPlayCircle fontSize={"2rem"} />
                  <span>Play</span>
                </div>
              )}
              <img
                className="imgSlide"
                style={{
                  height: `100%`,
                  width: `${card.width}vw`,
                  objectFit: "cover",
                  zIndex: "1",
                  borderTopLeftRadius: "1rem",
                  borderBottomLeftRadius: "1rem",
                  borderTopRightRadius: `${isHover ? 0 : "1rem"}`,
                  borderBottomRightRadius: `${isHover ? 0 : "1rem"}`,

                  filter: isHover ? "brightness(0.7) invert(0.19)" : "none",
                }}
                src={`${url}/${e.poster_path}`}
              ></img>
            </div>
            {
              <motion.div
                className="detailSlide"
                style={{ width: `${card.width*1.5}vw`, height: "100%" }}
                animate={isHover ? "open" : "closed"}
                variants={variants}
              >
                <motion.div className="hiddenText font-semibold">
                  <TextAnimetion
                    className="hiddenText"
                    isHover={isHover}
                    style={{
                      fontWeight: "600",
                      fontSize: `${1.5 * card.fontSize}rem`,
                    }}
                  >
                    {e.title
                      ? truncateText(e.title, 45)
                      : e.original_name
                      ? truncateText(e.original_name, 50)
                      : "No title available"}
                  </TextAnimetion>
                </motion.div>
                <div style={{ overflow: "hidden" }}>
                  <TextAnimetion
                    isHover={isHover}
                    style={{ fontSize: `${card.fontSize}rem` }}
                  >
                    {e.overview ? truncateText(e.overview, 70) : e.overview}
                  </TextAnimetion>
                </div>
                <motion.ul
                  animate={isHover ? "open" : "closed"}
                  variants={variantsTag}
                  style={{
                    width: "100%",
                    marginTop: ".3rem",
                    fontSize: `${card.fontSize}rem`,
                  }}
                >
                  {e.genre_ids && e.genre_ids.length > 0 && (
                    <>
                      {e.genre_ids.slice(0, 3).map((id, i) => {
                        const genre = genres.find((g) => g.id === id);
                        return (
                          <li key={id}>
                            <a
                              className="center"
                              style={{
                                padding: `0 ${card.fontSize}rem`,
                                fontSize: `${card.fontSize*0.8}rem`,
                              }}
                              href={`${process.env.REACT_APP_CLIENT_URL}/films/?id=${id}&type=${genre?.name}`}
                            >
                              {genre?.name}
                            </a>
                          </li>
                        );
                      })}
                      {e.genre_ids.length > 3 && (
                        <li style={{ fontSize: `${card.fontSize||1}rem` }}>...</li>
                      )}
                    </>
                  )}

                  {e.genres &&
                    e.genres.map((genre) => {
                      return (
                        <li>
                          <a
                          className="center"
                            style={{
                              padding: `0 ${card.fontSize}rem`,
                                fontSize: `${card.fontSize*.8}rem`,
                            }}
                            href={`${process.env.REACT_APP_CLIENT_URL}/films/?id=${genre.id}&type=${genre?.name}`}
                          >
                            {genre?.name}
                          </a>
                        </li>
                      );
                    })}
                </motion.ul>
                <ul style={{ flexDirection: "column", display: "flex" }}>
                  <li className="center">
                    <TextAnimetion
                      isHover={isHover}
                      style={{ fontSize: `${card.fontSize}rem` }}
                    >
                      <FiCalendar />: {e.release_date}
                    </TextAnimetion>
                  </li>
                  <li>
                    <TextAnimetion
                      isHover={isHover}
                      style={{ fontSize: `${card.fontSize}rem` }}
                    >
                      <FiClock /> {e.runtime}m
                    </TextAnimetion>
                  </li>
                </ul>
              </motion.div>
            }
          </div>
        </div>
        <div
          className="hiddenText "
          style={{ width: `${card.width}vw`, margin: `${card.width / 15}vw`, }}
        >
          <p className="text-2xl font-semibold">{e.title || e.original_name}</p>
        </div>
      </div>
    </a>
  );
};
