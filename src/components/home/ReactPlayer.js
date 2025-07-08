import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { Button } from 'antd';

export default function MyReactPlayer({ BackImg, MovieLink,setMovieLink }) {

  const RefReactPlayer = useRef(null);
  const closeWindowHandle = () => {
    setMovieLink();
  };
  console.log(MovieLink,"heheheh")
  return (
    BackImg && MovieLink && MovieLink.length>0 && (
      <motion.div
        className="Videoplayer center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          className="CloseWindowVideo"
          onClick={closeWindowHandle}
          icon={<FiX />}
        />
        <div className="ReactPlayer center">
          <ReactPlayer
            ref={RefReactPlayer}
            controls
            playing
            url={MovieLink.map((e) => `https://www.youtube.com/watch?v=${e.key}`)}
            width="80%"
            height="80%"
            // fullscreen={true} // Kích hoạt chế độ toàn màn hình
          />
        </div>
        <div
          style={{ backgroundImage: `${BackImg}` }}
          className="backgroundImage"
        />
      </motion.div>
    )
  );
}
