import React, { useRef } from "react";
import { FiImage } from "react-icons/fi";

export default function Upload({ pick_imageMess, className, divChildren }) {
  const image_message = useRef(null);
  return (
    <>
      <input
        onChange={(e) => {
          pick_imageMess(e);
        }}
        type="file"
        ref={image_message}
        multiple
        hidden
      ></input>
      <div  className={className || "circleButton"}  onClick={() => {
              image_message.current.click();
            }}>
        <span>
          <FiImage
           
          />
        </span>
          {divChildren}
      </div>
    </>
  );
}
