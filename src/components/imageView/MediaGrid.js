import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { insertSearch } from "../../function/addIntoSearch";
import ReactPlayer from "react-player";

const MediaGrid = ({ media, userID }) => {
  const [firstImageSize, setFirstImageSize] = useState(null);
  const location = useLocation();

  const ImageLink = ({ image, style }) => {
    return (
      <Link
        to={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${userID}&hid=${image.id}`}
        state={{ background: location }}
      >
        {image.type && image.type.includes("image") && (
          <img
            onClick={() =>
              insertSearch({ userId: userID, content: image.label })
            }
            className={`${style ? style : "h-60vh w-full object-cover rounded-2xl"}`} // Thêm lớp rounded-lg
            src={image.url}
            alt={`Comment Media`}
          />
        )}
        {image.type && image.type.includes("video") && (
          <ReactPlayer url={image?.url} className={` ${style} h-60vh w-full`} alt={`Comment Media`} controls>
            {/* <source src={image.url} type="video/mp4"></source> */}
          </ReactPlayer>
        )}
      </Link>
    );
  };
  const renderMedia = (data) => {
    return (
      <div
        className={`grid h-full ${
          firstImageSize ? " grid-rows-2" : " grid-cols-2"
        } gap-1`}
      >
        <div className="center">
          <Link
            to={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${userID}&hid=${data[0].id}`}
            state={{ background: location }}
          >
            <img
              className={`w-full ${
                firstImageSize
                  ? "object-cover h-full rounded-t-2xl	 "
                  : " h-full rounded-l-2xl "
              }`}
              src={data[0].url}
              alt={`Comment Media 1`}
            />
          </Link>
        </div>
        <div
          className={`grid ${
            firstImageSize ? " grid-cols-2" : " grid-rows-2"
          } gap-1`}
        >
          {data.slice(1, 3).map((e, index) => (
            <div key={index} className="relative w-full h-full  ">
              <ImageLink
                image={e}
                style={` object-cover w-full h-full ${
                  !firstImageSize
                    ? (index === 0 && "rounded-tr-2xl") ||
                      (index === 1 && "rounded-br-2xl")
                    : (index === 0 && "rounded-bl-2xl") ||
                      (index === 1 && "rounded-br-2xl")
                } `}
              />
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
        setFirstImageSize(img.width > img.height);
      };
    }
  }, [media]);

  if (!media || media.length === 0) return null;

  if (media.length === 1) {
    return (
      <div
        className={`center w-full h-full ${
          firstImageSize ? "flex justify-center" : ""
        }`}
      >
        <ImageLink image={media[0]}  />
      </div>
    );
  } else if (media.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 ">
        {media.map((e, index) => (
          <div key={index} className="">
            <ImageLink
              image={e}
              style={`w-full h-full object-cover ${index === 1 ? "rounded-r-2xl" : "rounded-l-2xl"}`}
            />
          </div>
        ))}
      </div>
    );
  } else {
    return renderMedia(media);
  }
};

export default MediaGrid;
