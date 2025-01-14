import React, { useRef } from "react";
import { FiImage } from "react-icons/fi";

export default function Upload({ pick_imageMess, className, divChildren, setImage }) {
  const image_message = useRef(null);

  const handleImagePick = (e) => {
    const files = e.target.files; 
    if (files.length > 0) {
      const file = files[0]; 
      const imageUrl = URL.createObjectURL(file); 

      setImage({
        imageObject: file,
        imageUrl: imageUrl, 
      });
      if (pick_imageMess) {
        pick_imageMess(e);
      }
    }
  };

  return (
    <>
      <input
        onChange={handleImagePick}
        type="file"
        ref={image_message}
        multiple
        hidden
      ></input>
      <div
        className={className || "circleButton"}
        onClick={() => {
          image_message.current.click();
        }}
      >
        <span>
          <FiImage />
        </span>
        {divChildren}
      </div>
    </>
  );
}

