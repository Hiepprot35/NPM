import React, { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiPlay,
  FiPlayCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import "./slide.css";
import { Text } from "./listPlay";
import useGenres from "../../hook/useGenres";
import { CardSlide } from "./CardSlide";
export const TextAnimetion = ({ children, isHover, style }) => {
  const variantsText = {
    open: {
      opacity: 1,

      y: 0,
      transition: { duration: 0.5, delay: 0.3 },
    },
    closed: {
      y: 200,
      opacity: 0,
      transition: { duration: 0.2, stiffness: 2000 },
    },
  };
  return (
    <motion.p
      variants={variantsText}
      style={style}
      animate={isHover ? "open" : "closed"}
    >
      {children}
    </motion.p>
  );
};
export default function SlideMovie({ list, perPage, card, isPage }) {
  const cardWidth = card?.width || 12.5;
  const fontSize = card?.fontSize || 1;
  const cardHeight = card?.height || 35;
  const refSlide = useRef();
  const url = "https://image.tmdb.org/t/p/original";
  const [Hover, setHover] = useState(-1);
  const [CurrentSlide, setCurrentSlide] = useState(0);
  const { genres } = useGenres();
  const ref = useRef();

  useEffect(() => {
    if (refSlide.current) {
      const data = refSlide.current.getBoundingClientRect();
    }
  }, []);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.width =
        list.length * cardWidth + cardWidth * 1.5 + "vw";
    }
  }, []);
  const handleClickRight = () => {
    setCurrentSlide((pre) => pre + 1);
  };
  const handleClickLeft = () => {
    setCurrentSlide((pre) => pre - 1);
  };
  const handleHover = (i) => {
    setHover(i);
  };
  const handleLeave = (i) => {
    setHover(-1);
  };

  useEffect(() => {
    if (ref.current) {
      const data = ref.current.style.transform;
      const match = data.match(/translateX\((-?\d+)(px|%)\)/);
      let currentX = 0;

      if (match) {
        currentX = parseFloat(match[1]);
      }
      ref.current.style.transform = `translateX(${
        -CurrentSlide * (cardWidth + (2 * cardWidth) / 15)
      }vw)`;
    }
  }, [CurrentSlide]);

  const variants = {
    open: {
      opacity: 1,
      borderTopRightRadius: "1rem",
      borderBottomRightRadius: "1rem",
      x: 0,
      transition: { duration: 0.5, stiffness: 2000 },
    },
    closed: {
      x: -100,
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
  return (
    <div
      ref={refSlide}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
      }}
      className="SlideComponent "
    >
      {CurrentSlide > 0 && !isPage && (
        <div
          className="center"
          onClick={handleClickLeft}
          style={{
            position: "absolute",
            left: "0",

            top: 0,
            bottom: 0,
            zIndex: 2,
          }}
        >
          <div className="circleButton" style={{ width: "3rem" }}>
            <FiArrowLeft></FiArrowLeft>
          </div>
        </div>
      )}
      <div
        ref={ref}
        className="SlideSession"
        style={{ justifyContent: isPage ? "center" : "flex-start" }}
      >
        {list &&
          list.map((e, i) => (
            <CardSlide
              e={e}
              i={i}
              card={{
                fontSize: fontSize,
                width: cardWidth,
                height: cardHeight,
              }}
            ></CardSlide>
          ))}
      </div>
      {CurrentSlide + 3 <= list.length - 1 && !isPage && (
        <div
          className="center"
          onClick={handleClickRight}
          style={{
            position: "absolute",
            right: "0",

            top: 0,
            bottom: 0,
            zIndex: 2,
          }}
        >
          <div className="circleButton" style={{ width: "3rem" }}>
            <FiArrowRight></FiArrowRight>
          </div>
        </div>
      )}
    </div>
  );
}
