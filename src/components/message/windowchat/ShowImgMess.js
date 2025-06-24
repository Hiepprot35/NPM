import FileSaver from "file-saver";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./showImgMess.css";
export default function ShowImgDialog(props) {
  const nagative = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const [titles, setTitle] = useState();

  const img_layoutRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    throw(currentSlide);
  }, [currentSlide]);
  useEffect(() => {
    if (props.listImg && props.current) {
      const indexOfTerms = props.listImg.findIndex((e) => e === props.current);
      setCurrentSlide(indexOfTerms);
    }
  }, [props.listImg, props.current]);
  const clickSlideRight = () => {
    if (currentSlide < props.listImg.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  const clickImg = (i) => {
    if (slideBottom.current) {
      if (i > 4) {
        if (i > currentSlide) {
          slideBottom.current.style.left = `${(-i + currentSlide) * 10}%`;
        } else {
          slideBottom.current.style.right = `${(-i + currentSlide) * 10}%`;
        }
      } else {
        if (props.listImg.length > 10) {
          slideBottom.current.style.left = `${((4 - i) * 100) / 10}%`;
        }
      }
    }
    setCurrentSlide(i);
  };
  const clickSlideLeft = () => {
    if (currentSlide > 0) {
      if (currentSlide < 8) {
        slideBottom.current.style.left = `${(4 - currentSlide) * 5}rem`;
      }
      setCurrentSlide(currentSlide - 1);
    }
  };
  const slideBottom = useRef();
  useEffect(() => {
    if (props.listImg) {
      if (img_layoutRef.current && slideBottom.current) {
        slideBottom.current.style.width = `${
          (props.listImg.length * 100) / 10
        }%`;
        img_layoutRef.current.style.width = `${props.listImg.length * 100}%`;
      }
    }
  }, [props.listImg]);
  const hiddenImgDialog = () => {
    props.setShowImgMess(false);
  };
  useEffect(() => {
    let count;
    if (currentSlide >= 0) {
      if (img_layoutRef.current && slideBottom.current) {
        if (currentSlide > 4) {
          slideBottom.current.style.left = `${
            (-(currentSlide - 4) * 100) / 10
          }%`;
        }
        img_layoutRef.current.style.left = `${-currentSlide * 100}%`;
      }
    }
  }, [currentSlide]);
  throw(props.listImg)
  const saveImage = async () => {
    let imageUrl = props.isMovies
      ? `https://image.tmdb.org/t/p/original${props.current.file_path}`
      : props.current;
    FileSaver.saveAs(imageUrl, Date.now(), "image.jpg");
  };

  return (
    <div className="imgDialog z-9999">
      {
        <>
          <div className="container_Title">
            <div
              style={{
                position: "absolute",
                top: "2rem",
                left: "2rem",
                zIndex: "3",
              }}
            >
              <span className="circleButton" onClick={() => hiddenImgDialog()}>
                X
              </span>
              <span
                className="circleButton"
                onClick={(e) => {
                  saveImage();
                }}
              >
                <FiDownload />
              </span>
            </div>
            {currentSlide > 0 && (
              <div className="buttonSlide" onClick={() => clickSlideLeft()}>
                <span className="">
                  <FiArrowLeft></FiArrowLeft>{" "}
                </span>
              </div>
            )}
            <div className="image_container">
              <div className="image_layout" ref={img_layoutRef}>
                {props.listImg &&
                  props.listImg.map((e, i) => (
                    <div
                      key={i}
                      className="title_text"
                      onClick={() => clickImg(i)}
                    >
                      <img
                        alt="avatr"
                        src={
                          props.isMovies
                            ? `https://image.tmdb.org/t/p/original/${e.file_path}`
                            : `${e}`
                        }
                        style={{
                          opacity: `${i == currentSlide ? "1" : "0.2"}`,
                          borderRadius: "1rem",
                          transition: "opacity 500ms linear",
                        }}
                      ></img>
                    </div>
                  ))}
              </div>
            </div>
            {props.listImg && currentSlide < props.listImg.length - 1 && (
              <div
                className="buttonSlide"
                style={{ marginRight: "2rem" }}
                onClick={() => clickSlideRight()}
              >
                <span className="">
                  <FiArrowRight></FiArrowRight>
                </span>
              </div>
            )}
          </div>
          <div className="bottomTitleImg">
            <div style={{ width: "58rem" }}>
              <div className="slideBottom" ref={slideBottom}>
                {props.listImg &&
                  props.listImg.map((e, i) => (
                    <div
                      key={i}
                      className="imgBottomSingle"
                      onClick={() => clickImg(i)}
                      style={{ cursor: "pointer", marginLeft: "0.3rem" }}
                    >
                      <img
                        alt="avatar"
                        src={
                          props.isMovies
                            ? `https://image.tmdb.org/t/p/original/${e.file_path}`
                            : `${e}`
                        }
                        style={{
                          opacity: `${i === currentSlide ? "1" : "0.2"}`,
                          borderRadius: "1rem",
                          transition: "opacity 500ms linear",
                        }}
                      ></img>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
}
