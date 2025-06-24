import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { insertSearch } from "../../function/addIntoSearch";

const MediaGrid = ({ media, userID }) => {
  const [isFirstImageWide, setIsFirstImageWide] = useState(null);
  const location = useLocation();

  const ImageLink = ({ image, style }) => {
   console.log(image,"okeeeee")
    const isImage = image.type?.includes("image");
    const isVideo = image.type?.includes("video");

    const renderContent = () => {
      if (isImage) {
        return (
          <img
            onClick={() => insertSearch({ userId: userID, content: image.label })}
            className={style || "w-full object-cover rounded-2xl"}
            src={image.url}
            alt="Comment Media"
          />
        );
      }

      if (isVideo) {
        return (
          <ReactPlayer
            url={image.url}
            className={style || "w-full"}
            controls
          />
        );
      }

      return null;
    };

    return userID && image.id ? (
      <div className="w-full h-full">

      <Link
        to={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${userID}&hid=${image.id}`}
        state={{ background: location }}
        >
        {renderContent()}
      </Link>
        </div>
    ) : (
      renderContent()
    );
  };

  const renderMediaGrid = (data) => {
    const gridStyle = isFirstImageWide ? "grid-rows-2" : "grid-cols-2";
    const firstImageStyle = isFirstImageWide
      ? "object-cover h-full"
      : "h-full";

    return (
      <div className={`grid h-full ${gridStyle} gap-1`}>
        <div className="center">
          <ImageLink image={data[0]} style={`w-full ${firstImageStyle} object-cover`} />
        </div>
        <div className={`grid h-60vh ${isFirstImageWide ? "grid-cols-2" : "grid-rows-2"} gap-1`}>
          {data.slice(1, 3).map((e, index) => {
         

            return (
              <div key={index} className="relative w-full h-full">
                <ImageLink image={e} style={`object-cover w-full h-full`} />
                {index === 1 && data.length > 3 && (
                  <a href={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${userID}&hid=${e.id}`}>

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <span className="text-white text-xl font-semibold	 uppercase">+{data.length - 3} more</span>
                  </div>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (media?.length) {
      const img = new Image();
      img.src = media[0].url;
      img.onload = () => setIsFirstImageWide(img.width > img.height);
    }
  }, [media]);

  if (!media?.length) return null;

  switch (media.length) {
    case 1:
      return (
        <div className={`center w-full h-full ${isFirstImageWide ? "flex justify-center" : ""}`}>
          <ImageLink image={media[0]} />
        </div>
      );
    case 2:
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((e, index) => (
            <ImageLink
              key={index}
              image={e}
              style={`w-full h-full object-cover`}
            />
          ))}
        </div>
      );
    default:
      return renderMediaGrid(media);
  }
};

export default MediaGrid;
