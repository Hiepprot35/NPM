import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";


const MediaGrid = ({ media,userID }) => {
  const [firstImageSize, setFirstImageSize] = useState(null);
  const ImageLink = ({image , style}) => {
    return (
      <NavLink
        to={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${userID}&hid=${image.id}`}
      >
        {
         image.type&& image.type.includes('image') &&
          <img
          className={style?style:"w-full h-full object-contain"}
          src={image.url}
          alt={`Comment Media `}
          />
        }
        {
           image.type && image.type.includes('video') &&
           <video
           className="h-full w-full"
           alt={`Comment Media `}
           controls
           >
            <source src={image.url} type="video/mp4"></source>
           </video>
        }
      </NavLink>
    );
  };
  const renderMedia = (data) => {
    return (
      <div
        className={`grid h-full ${
          getFirstImageLayout() === "landscape"
            ? " grid-rows-2"
            : " grid-cols-2"
        } gap-2`}
      >
        <div className="bg-black">
          <NavLink
            to={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${userID}&hid=${data[0].id}`}
          >
            <img
              className={` ${
                getFirstImageLayout() === "landscape"
                  ? "object-cover h-full w-full"
                  : "object-scale-down  h-full w-full"
              }`}
              src={data[0].url}
              alt={`Comment Media 1`}
            />
          </NavLink>
        </div>
        <div
          className={`grid ${
            getFirstImageLayout() === "landscape"
              ? " grid-cols-2"
              : " grid-rows-2"
          } gap-2`}
        >
          {data.slice(1, 3).map((e, index) => (
            <div key={index} className="relative bg-black center">
              <ImageLink image={e} style={"w-full object-cover"} />
              {index === 1 && data.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <span className="text-white text-xl">
                    +{data.length - 3} more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  useEffect(() => {
    if (media && media.length > 0) {
      const img = new Image();
      img.src = media[0].url;
      img.onload = () => {
        setFirstImageSize({ width: img.width, height: img.height });
      };
    }
  }, [media]);

  const getFirstImageLayout = () => {
    if (firstImageSize) {
      return firstImageSize.width > firstImageSize.height
        ? "landscape"
        : "portrait";
    }
    return "portrait";
  };

  if (!media || media.length === 0) return null;

  if (media.length === 1) {
    const layout = getFirstImageLayout();
    return (
      <div
        className={`w-full h-full bg-black ${
          layout === "landscape" ? "flex justify-center" : ""
        }`}
      >
        <ImageLink image={media[0]} />
      </div>
    );
  } else if (media.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 ">
        {media.map((e, index) => (
          <div key={index} className="bg-black">
            <ImageLink image={e}   />
          </div>
        ))}
      </div>
    );
  } else {
    return renderMedia(media);
  }
};

export default MediaGrid;
