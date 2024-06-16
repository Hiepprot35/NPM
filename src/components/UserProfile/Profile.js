import React, { useEffect, useRef, useState } from "react";
import UserProfile from "./userProfile";
import Layout from "../Layout/layout";
import { NavLink, useParams } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import {
  fetchApiRes,
  getStudentInfoByMSSV,
  getUserinfobyID,
} from "../../function/getApi";
import { FiCamera, FiSave, FiUpload } from "react-icons/fi";
import { Modal, Popover } from "antd";
import ReactCrop from "react-image-crop";
import MyComment from "../home/MyComment";
import Posts from "./Posts";
import PhotoPost from "./PhotoPost";
import { useRealTime } from "../../context/useRealTime";
const ChangeImg = ({ img, MSSV, setUsers }) => {
  const [OpenModal, setOpenModal] = useState(false);
  const [ImageUpload, setImageUpload] = useState();
  const [ImageSend, setImageSend] = useState();
  const [imageDimensions, setImageDimensions] = useState();
  const [Scale, setScale] = useState(1);
  const imgUploadRef = useRef();
  const { setAuth } = useAuth();
  const uploadImageHandle = (e) => {
    const imgMessFile = e.target.files[0];
    const imgLink = URL.createObjectURL(imgMessFile);
    setImageUpload(imgLink);
    setImageSend(imgMessFile);
  };
  useEffect(() => {
    console.log(ImageSend);
  }, [ImageSend]);
  const urlToObject = async (link) => {
    const response = await fetch(link);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
  };
  const openHandle = async () => {
    setOpenModal(true);
    setImageUpload(img);
  };

  const closeHandle = () => {
    setDistanceX(0);
    setDistanceY(0);
    setImageUpload();
    setImageSend();
    setScale(1);
    setXTrans(0);
    setYTrans(0);
    setPosition({});
    setOpenModal(false);
    setImageDimensions({ width: 0, height: 0 });
  };

  useEffect(() => {
    if (ImageUpload) {
      const img = new Image();
      img.src = ImageUpload;
      console.log(ImageUpload);
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
    }
    return () => {
      if (ImageUpload && ImageUpload !== img) {
        URL.revokeObjectURL(ImageUpload);
      }
    };
  }, [ImageUpload]);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const pointRef = useRef();
  const divRef = useRef();
  const dragStartHandle = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    e.dataTransfer.setData("text/plain", JSON.stringify({ offsetX, offsetY }));
  };

  const dragHandle = (e) => {
    const { clientX } = e;
    const rect = divRef.current.getBoundingClientRect();
    const point = pointRef.current.getBoundingClientRect();
    let newLeft = clientX - rect.left;

    // Giới hạn phạm vi kéo trong div
    if (newLeft < 0) newLeft = 0;
    if (newLeft > rect.width) newLeft = rect.width - point.width;
    setScale((2 * newLeft + rect.width) / rect.width);
    setPosition({ left: newLeft });
  };

  const [Output, setOutput] = useState();
  const cutImageRef = useRef();
  const canvasRef = useRef(null);
  const canvasFullRef = useRef(null);
  const divCutRef = useRef(null);
  const divFullRef = useRef(null);
  const [croppedImage, setCroppedImage] = useState(null);
  // useEffect(() => {
  //   if(img)
  // }, [img]);
  const cropImage = async () => {
    const imgCanvas = new Image();

    imgCanvas.crossOrigin = "anonymous";

    imgCanvas.src = ImageUpload || img;

    await new Promise((resolve, reject) => {
      imgCanvas.onload = () => {
        resolve(); // Khi hình ảnh được tải hoàn tất, resolve promise
      };

      imgCanvas.onerror = (error) => {
        reject(new Error("Failed to load image")); // Nếu xảy ra lỗi, reject promise với thông báo lỗi
      };
    });

    const rectCut = divCutRef.current.getBoundingClientRect();
    const rectFull = divFullRef.current.getBoundingClientRect();

    const zoomX = imgCanvas.width / rectFull.width;
    const zoomY = imgCanvas.height / rectFull.height;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const offsetX = rectCut.left - rectFull.left;
    const offsetY = rectCut.top - rectFull.top;
    const scaledWidth = rectCut.width * zoomX;
    const scaledHeight = rectCut.height * zoomY;

    canvas.width = 300;
    canvas.height = 300;

    ctx.drawImage(
      imgCanvas,
      offsetX * zoomX,
      offsetY * zoomY,
      scaledWidth,
      scaledHeight,
      0,
      0,
      300,
      300
    );

    const dataUrl = canvas.toDataURL("image/png");
    const blobBin = atob(dataUrl.split(",")[1]);
    let array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    const file = new Blob([new Uint8Array(array)], { type: "image/png" });
    return { fileBuffer: file, view: dataUrl };
  };

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [distanceX, setDistanceX] = useState(0);
  const [distanceY, setDistanceY] = useState(0);
  const [XTrans, setXTrans] = useState(0);
  const [YTrans, setYTrans] = useState(0);
  const handleMouseDown = (event) => {
    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const handleMouseMove = (event) => {
    event.preventDefault();

    let disX = XTrans + event.clientX - startX;
    const rectFull = divFullRef.current.getBoundingClientRect();
    const rectCut = divCutRef.current.getBoundingClientRect();

    console.log(disX, "= ", rectCut.left, rectFull.left);
    let disY = YTrans + event.clientY - startY;
    if (startX !== null && startY !== null) {
      setDistanceX(disX);
      setDistanceY(disY);
    }
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    let disX = XTrans + event.clientX - startX;
    const rectFull = divFullRef.current.getBoundingClientRect();
    const rectCut = divCutRef.current.getBoundingClientRect();
    let disY = YTrans + event.clientY - startY;

    setXTrans(disX);
    setYTrans(disY);
    // setDistanceX(0)
    // setDistanceY(0)
  };

  const style =
    imageDimensions && imageDimensions.width >= imageDimensions.height
      ? {
          height: "300px",
          width: "auto",
          transform: `translate(${distanceX}px, ${distanceY}px) scale(${Scale})`,
        }
      : {
          width: "300px",
          height: "auto",
          transform: `translate(${distanceX}px, ${distanceY}px) scale(${Scale})`,
        };

  const updateAvatar = async () => {
    const data = await cropImage();
    const img = new FormData();
    if (ImageSend) {
      img.append("images", ImageSend);
    }
    img.append("images", data.fileBuffer);
    img.append("MSSV", MSSV);
    const obj = { img: ImageUpload, MSSV: MSSV };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/UpdateUserID`,
        { method: "POST", body: img }
      );
      closeHandle();
      setAuth((pre) => ({ ...pre, avtUrl: data.view }));
      setUsers((pre) => ({ ...pre, cutImg: data.view }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <span
        className="circleButton text-xl absolute bottom-0 right-0 z-2"
        onClick={() => openHandle(true)}
      >
        <FiCamera />
      </span>

      <Modal
        onOk={updateAvatar}
        width={1000}
        destroyOnClose
        title={
          <p className="center text-3xl font-semibold">Thay đổi ảnh đại diện</p>
        }
        open={OpenModal}
        onCancel={closeHandle}
      >
        <div className="w-full h-auto center flex-col ">
          <div className="m-4 z-20">
            <span
              className="circleButton"
              onClick={() => imgUploadRef.current.click()}
            >
              <FiUpload />
            </span>
            <input
              type="file"
              onChange={uploadImageHandle}
              hidden
              ref={imgUploadRef}
            />
          </div>
          <div
            className="center  relative overflow-hidden"
            style={
              imageDimensions &&
              imageDimensions?.width >= imageDimensions.height
                ? { height: "500px", width: "100%" }
                : { width: "100%", height: "500px" }
            }
          >
            <div className="w-full h-full center">
              <div
                className=" z-10"
                style={{
                  width: "300px",
                  height: "300px",
                }}
              >
                <div
                  className=" overflow-hidden center relative cursor-move rounded-full z-20"
                  draggable
                  onDragStart={handleMouseDown}
                  onDrag={handleMouseMove}
                  onDragEnd={handleMouseUp}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  ref={divCutRef}
                  style={{
                    height: "300px",
                    width: "300px",
                    borderRadius: "50%",
                  }}
                >
                  <div
                    className="relative center"
                    style={
                      imageDimensions &&
                      imageDimensions?.width >= imageDimensions.height
                        ? { height: "300px", width: "700px" }
                        : { width: "300px", height: "700px" }
                    }
                  >
                    <div className="relative center" style={style}>
                      <img
                        className="object-fill  h-full "
                        ref={cutImageRef}
                        src={ImageUpload}
                        alt="Uploaded"
                        style={
                          imageDimensions &&
                          imageDimensions?.width >= imageDimensions.height
                            ? { height: "100%", maxWidth: "none" }
                            : { width: "100%", maxWidth: "none" }
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="center absolute  cursor-move w-full h-full inset-0  "
                  draggable
                  onDragStart={handleMouseDown}
                  onDrag={handleMouseMove}
                  onDragEnd={handleMouseUp}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div
                    className=""
                    style={{
                      ...style,
                    }}
                  >
                    <img
                      className="= object-fill opacity-30 "
                      src={ImageUpload}
                      ref={divFullRef}
                      style={
                        imageDimensions &&
                        imageDimensions?.width >= imageDimensions.height
                          ? { height: "100%", maxWidth: "none" }
                          : { width: "100%", maxWidth: "none" }
                      }
                      alt="Uploaded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="m-12 relative z-20"
            ref={divRef}
            style={{
              borderRadius: "3px",
              width: "300px",
              borderBottom: "6px solid black",
            }}
          >
            <span
              style={{
                background: "blue",
                top: `-.25rem`,
                left: `${position.left}px`,
              }}
              ref={pointRef}
              draggable
              onDragStart={dragStartHandle}
              onDrag={dragHandle}
              onDragEnd={dragHandle}
              className="w-4 h-4 rounded-full    absolute"
            ></span>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <canvas ref={canvasFullRef} style={{ display: "none" }}></canvas>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default function Profile() {
  const { MSSV } = useParams();
  const queryParameters = new URLSearchParams(window.location.search);
  const commentID = queryParameters.get("commentID");
  const MSSVparam = queryParameters.get("MSSV");
  const MSSVInput = MSSV || MSSVparam;
  const [gerenalFriend, setgerenalFriend] = useState([]);
  const { auth, myInfor } = useAuth();
  const [Users, setUserInfo] = useState();
  const getData = async () => {
    try {
      setIsLoading(true);
      const data = await getStudentInfoByMSSV(MSSVInput);
      if (data) {
        setIsLoading(false);
        setUserInfo(data);
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Error occurred:", error);
    }
  };
  useEffect(() => {
    if (parseInt(auth.username) === parseInt(MSSVInput)) {
      console.log(myInfor);
      setUserInfo(myInfor);
      setIsLoading(false);
    } else {
      getData();
    }
    return () => {
      setUserInfo();
    };
  }, [MSSVInput, myInfor, auth]);
  const getFriendList = async (userID) => {
    const checkID = (array, id) => {
      return array.user1 === id ? array.user2 : array.user1;
    };
    const result = await fetchApiRes("message/getFriendList", "POST", {
      userID: userID,
    });
    const data = result.result.map((e) => checkID(e, userID));
    return data;
  };
  const [friends, setFriend] = useState([]);
  useEffect(() => {
    if(auth)
      {
        const getUserFriend = async () => {
          const dataMyFriend = await getFriendList(auth?.userID);
          let dataUserFriend;
    
          const data = await Promise.all(
            dataMyFriend.map(async (e) => {
              const info = await fetchApiRes('getStudentbyUserID',"POST",{UserID:e});
              return info;
            })
          );
          setFriend(data);
        
        };
        getUserFriend();
      }
  }, [auth]);
  useEffect(() => {
    if (Users?.UserID ) {
      const getUserFriend = async () => {
       let dataUserFriend;
        if (Users.UserID !== auth.userID) {
          dataUserFriend = await getFriendList(Users.UserID);
        
          const generalFriends = dataUserFriend.filter((userFriend) => {
            return friends.some((e) => e === userFriend);
          });
          setgerenalFriend(generalFriends);
        }
   
      
      };
      getUserFriend();
    }
  }, [Users,friends]);
  const introduceRef = useRef();
  const [ChangeIntroduce, setChangeIntroduce] = useState();
  const [IntroduceInput, setIntroduceInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const showIntroduceHandle = () => {
    setChangeIntroduce(true);
  };
  async function updateUser(proterty) {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/UpdateUserID/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(proterty),
        }
      );
      const resJson = await res.json();
      if (resJson) {
        // setIntroduceInput(proterty.introduce)
        setUserInfo((pre) => ({ ...pre, introduce: proterty.introduce }));
        setChangeIntroduce(false);
      }
    } catch (error) {}
  }
  const { Online } = useRealTime();
  useEffect(() => {
    if (ChangeIntroduce && introduceRef.current) {
      introduceRef.current.focus();
    }
  }, [ChangeIntroduce]);
  useEffect(() => {
    if (Users?.UserID) {
      setIntroduceInput(Users.introduce);
    }
  }, [Users]);
  const [ImgContent, setImgContent] = useState();
  const [CurrentImg, setCurrentImg] = useState();
  return (
    <Layout>
      {
        <div
          className="center content flex-col"
          style={commentID && { opacity: 0 }}
        >
          <div style={{ height: "50vh" }} className="w-full bg-black shadow91">
            <img
              className="object-contain 	"
              src={`${Users?.backgroundimg}`}
            ></img>
          </div>
          <div className="w-full px-32 bg-gray-200 shadow91">
            {
              <>
                <div className="flex">
                  <div style={{ marginTop: "-3rem" }}>
                    <div className="flex">
                      <div className="relative">
                        <div class=" relative overflow-hidden rounded-full border-4 border-neutral-50 ">
                          {isLoading ? (
                            <div
                              className="center bg-white"
                              style={{ width: "15rem", aspectRatio: "1" }}
                            >
                              <div className="loader"></div>
                            </div>
                          ) : (
                            <img
                              alt="avatar"
                              className="cursor-pointer  relative z-0 rounded-full w-52 h-52 transition-all duration-300 hover:scale-110	"
                              src={`${Users?.cutImg || Users?.img}`}
                            ></img>
                          )}
                        </div>
                        <ChangeImg
                          img={`${Users?.img}`}
                          MSSV={Users?.MSSV}
                          setUsers={setUserInfo}
                        ></ChangeImg>
                      </div>
                    </div>
                  </div>
                  <div className=" mx-4 flex-col content-center">
                    <p className="text-4xl font-bold ">{Users?.Name}</p>
                    <p>Bạn bè {friends.length}</p>
                  </div>
                </div>
                <div className="w-full flex">
                  <div className="h-screen " style={{ width: "40%" }}>
                    <div className="p-16 bg-white rounded-xl my-8 shadow-md">
                      <p className="font-bold text-3xl">Giới thiệu</p>

                      {!ChangeIntroduce && !isLoading && (
                        <>
                          <div className="center">
                            <p className="m-3">{Users?.introduce}</p>
                          </div>
                          {Users?.MSSV === parseInt(auth.username) && (
                            <p
                              onClick={() => {
                                showIntroduceHandle();
                              }}
                              className="p-2 w-full bg-gray-200 font-semibold center rounded-xl my-2 cursor-pointer hover:bg-gray-100"
                            >
                              Chỉnh sửa mục đáng chú ý
                            </p>
                          )}
                        </>
                      )}
                      {ChangeIntroduce && !isLoading && (
                        <>
                          <textarea
                            ref={introduceRef}
                            className="w-full"
                            onChange={(e) => setIntroduceInput(e.target.value)}
                            value={IntroduceInput}
                            placeholder={`${Users?.introduce}`}
                          ></textarea>
                          <div className="flex flex-row-reverse">
                            <span
                              onClick={() =>
                                updateUser({
                                  introduce: IntroduceInput,
                                  MSSV: Users?.MSSV,
                                })
                              }
                              className="circleButton cursor-pointer  font-semiboldrounded-xl m-2 center"
                            >
                              <FiSave />
                            </span>
                            <span
                              onClick={() => setChangeIntroduce(false)}
                              className="circleButton cursor-pointer  font-semibold   m-2 center"
                            >
                              X
                            </span>
                          </div>
                        </>
                      )}
                      {isLoading && <div className="">...............</div>}

                      <p>Tham gia vào {Users?.create_at}</p>
                    </div>
                    <div className="p-8 bg-white rounded-xl my-8 shadow-md">
                      <p className="font-bold text-3xl">Ảnh</p>
                      <div className="grid grid-cols-3 gap-2">
                        {ImgContent &&
                          ImgContent.map((e) => (
                            <div onClick={() => setCurrentImg(e)}>
                              <NavLink
                                to={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${e.userID}&commentID=${e.id}`}
                              >
                                <img
                                  className="object-cover rounded-xl"
                                  style={{ aspectRatio: "1" }}
                                  src={`${e.img}`}
                                />
                              </NavLink>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="p-16 bg-white rounded-xl my-8 shadow-md">
                      <p className="font-bold text-3xl">Bạn bè</p>
                      <p>
                        {friends.length} bạn bè ({gerenalFriend.length} bạn
                        chung)
                      </p>
                      <div className="grid grid-cols-3	">
                        {friends.map((e) => (
                          <div className="flex-col  center">
                            <img
                              className="rounded-xl"
                              style={{ aspectRatio: 1 }}
                              src={`${e.img}`}
                            ></img>
                            <p className="font-semibold">{e.Name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="" style={{ width: "60%" }}>
                    <Posts
                      setCurrentImg={setCurrentImg}
                      setImgContent={setImgContent}
                      users={Users}
                      username={Users && Users?.MSSV}
                    ></Posts>
                  </div>
                </div>
              </>
            }
          </div>
        </div>
      }
      {commentID && (
        <PhotoPost
          CurrentImg={CurrentImg}
          UsersProfile={Users}
          commentID={commentID}
        ></PhotoPost>
      )}
    </Layout>
  );
}
