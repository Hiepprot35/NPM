import React, { useRef } from "react";
import { FiImage } from "react-icons/fi";

export default function Upload({ pick_imageMess }) {
  const image_message = useRef(null);
  return (
    <div>
      <input
        onChange={(e) => {
          pick_imageMess(e);
        }}
        type="file"
        ref={image_message}
        multiple
        hidden
      ></input>
      <span className="circleButton">
        <FiImage
          onClick={() => {
            image_message.current.click();
          }}
        />
      </span>
    </div>
  );
}
