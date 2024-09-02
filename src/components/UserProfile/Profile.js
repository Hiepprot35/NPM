import { Avatar, Modal, Popover } from "antd";
import React, { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { FiCamera, FiDelete, FiMove, FiSave, FiUpload } from "react-icons/fi";
import { NavLink, useParams } from "react-router-dom";
import { useData } from "../../context/dataContext";
import { useRealTime } from "../../context/useRealTime";
import { fetchApiRes, getStudentInfoByMSSV } from "../../function/getApi";
import { formatDate } from "../../function/getTime";
import useAuth from "../../hook/useAuth";
import Layout from "../Layout/layout";
import PhotoPost from "./PhotoPost";
import Posts from "./Posts";
import UserProfile from "./userProfile";
import NotFoundPage from "../Layout/NotFound/NotFoundPage";
import { IsLoading } from "../Loading";
const ChangeImg = ({ img, MSSV, setUsers }) => {
  const [OpenModal, setOpenModal] = useState(false);
  const [ImageUpload, setImageUpload] = useState(img);
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
  const openHandle = async () => {
    setOpenModal(true);
    setImageUpload(img);
  };

  const closeHandle = () => {
    setImageUpload();
    setImageSend();
    setScale(1);
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

  const cutImageRef = useRef();
  const [Loading, setLoading] = useState(false);

  const updateAvatar = async () => {
    // const data = await cropImage();
    setLoading(true);
    let imgCropped, imageURL;
    if (cutImageRef.current) {
      const canvas = await fetch(cutImageRef.current.getImage().toDataURL());
      imgCropped = await canvas.blob();
      imageURL = window.URL.createObjectURL(imgCropped);
    }
    const img = new FormData();
    if (ImageSend) {
      img.append("images", ImageSend);
    }
    img.append("images", imgCropped);
    img.append("MSSV", MSSV);
    const obj = { img: ImageUpload, MSSV: MSSV };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/UpdateUserID`,
        { method: "POST", body: img }
      );
      closeHandle();
      setAuth((pre) => ({ ...pre, avtUrl: imageURL }));
      setUsers((pre) => ({ ...pre, cutImg: imageURL }));
      setLoading(false);
    } catch (error) {
      setLoading(false);

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
        onOk={!Loading ? updateAvatar : null}
        okText={!Loading ? "Save" : ` Saving`}
        loading={Loading}
        className={`${Loading ? "LoadingModel" : ""}`}
        width={1000}
        destroyOnClose
        title={
          <p className="center text-3xl font-semibold">Thay đổi ảnh đại diện</p>
        }
        open={OpenModal}
        onCancel={!Loading ? closeHandle : null}
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
            className="center  relative "
            style={
              imageDimensions &&
              imageDimensions?.width >= imageDimensions.height
                ? { height: "300px", width: "800px" }
                : { width: "800px", height: "300px" }
            }
          >
            <AvatarEditor
              ref={cutImageRef}
              image={`${ImageUpload}`}
              crossOrigin="anonymous"
              borderRadius={100}
              border={30}
              className="object-contain w-full h-full"
              color={[255, 255, 255, 0.6]} // RGBA
              scale={Scale}
              rotate={0}
            />
          </div>
          <input
            className=""
            value={Scale}
            type="range"
            min="1"
            max="3"
            defaultValue={1}
            step={0.2}
            onChange={(e) => setScale(e.target.value)}
          ></input>

          {/* <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          <canvas ref={canvasFullRef} style={{ display: "none" }}></canvas> */}
        </div>
      </Modal>
    </>
  );
};

export default function Profile() {
  const { MSSV } = useParams();
  const queryParameters = new URLSearchParams(window.location.search);
  const commentID = queryParameters.get("hid");
  const MSSVparam = queryParameters.get("MSSV");
  const MSSVInput = MSSV || MSSVparam;
  const [gerenalFriend, setgerenalFriend] = useState([]);
  const { auth, myInfor } = useAuth();
  const [Users, setUserInfo] = useState();

  const getData = async (signal, currentRequestVersion) => {
    try {
      console.log("send res");
      const data = await getStudentInfoByMSSV(MSSVInput, { signal });
      if (signal.aborted) return;
      if (data) {
        document.title = data?.Name + " | Profile";
        setUserInfo(data);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error occurred:", error);
      }
    }
  };

  const getPost = async (signal, currentRequestVersion) => {
    try {
      setIsLoading(true);
      const data = await fetchApiRes(
        `getAllCommentPost/?userID=${MSSVInput}&replyID=-1`,
        "GET",
        null,
        { signal }
      );
      if (signal.aborted) return;
      setImgContent([]);
      setPost([]);
      if (data && data.result) {
        const dataUpdate = data.result.sort(
          (a, b) => b.create_at - a.create_at
        );
        setIsLoading(false);
        const userId = data.result[0].userID;
        const imgs = data.result.flatMap((post) =>
          post.media.map((e) => ({
            userID: userId,
            img: e.url,
            id: e.id,
            type: e.type,
            create_at: e.createdAt,
          }))
        );
        setImgContent(imgs);
        setPost(dataUpdate);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error occurred:", error);
      }
    }
  };
  useEffect(() => {
    unMountComponent();
    const controller = new AbortController();
    const { signal } = controller;

    getData(signal);
    getPost(signal);
    return () => {
      controller.abort();

      unMountComponent();
    };
  }, [MSSVInput]);
  const unMountComponent = () => {
    setPost();
    setFriend([]);
    setUserInfo(null);
    setImgContent();
  };
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
  const [friends, setFriend] = useState();
  useEffect(() => {
    if (Users?.UserID) {
      const getUserFriend = async () => {
        const dataMyFriend = await getFriendList(Users?.UserID);

        const data = await Promise.all(
          dataMyFriend.map(async (e) => {
            const info = await fetchApiRes("getStudentbyUserID", "POST", {
              UserID: e,
            });
            return info;
          })
        );
        setFriend(data);
      };

      getUserFriend();
    }
    console.log(Users);
    return () => setFriend();
  }, [Users]);
  useEffect(() => {
    if (friends && Users) {
      const getUserFriend = async () => {
        let dataUserFriend;
        dataUserFriend = await getFriendList(auth.userID);

        const generalFriends = dataUserFriend.filter((userFriend) => {
          return friends.some((e) => e === userFriend);
        });
        setgerenalFriend(generalFriends);
      };
      getUserFriend();
    }
  }, [friends]);
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

  useEffect(() => {
    if (ChangeIntroduce && introduceRef.current) {
      introduceRef.current.focus();
    }
  }, [ChangeIntroduce]);
  const dragBackRef = useRef();
  useEffect(() => {
    if (Users?.UserID) {
      setIntroduceInput(Users.introduce);
    }
  }, [Users]);
  const [PostsData, setPost] = useState();

  const [ImgContent, setImgContent] = useState();
  const [CurrentImg, setCurrentImg] = useState();
  const [BackgroundUpdate, setBackgroundUpdate] = useState();
  const backgroundImg = useRef();
  const changeBackImg = (e) => {
    const backgroundImg = URL.createObjectURL(e.target.files[0]);
    setBackgroundUpdate({ view: backgroundImg, src: e.target.files[0] });
  };
  const containerBackRef = useRef();
  const [startY, setStartY] = useState();
  const [isDragging, setIsDragging] = useState(false);

  const dragStartHandle = (e) => {
    e.preventDefault();
    setStartY(e.clientY);
    setIsDragging(true);
  };

  // Usage example:

  // Usage example:
  const [cursor, setCursor] = useState();
  const dragBackHandle = (e) => {
    if (isDragging && dragBackRef.current && containerBackRef.current) {
      console.log("ok");
      const ref = dragBackRef.current;
      const container = containerBackRef.current;
      const clientY = e.clientY;
      const offsetY = clientY - startY;
      const newTop = ref.offsetTop + offsetY;
      // Calculate the maximum top value
      const maxTop = container.clientHeight - ref.clientHeight;
      let finaltop;
      // Set the new top value with boundaries
      if (newTop > 0) {
        finaltop = 0;
        ref.style.top = "0px";
      } else if (newTop < maxTop) {
        finaltop = maxTop;
        ref.style.top = `${maxTop}px`;
      } else {
        finaltop = newTop;
        ref.style.top = `${newTop}px`;
      }
      console.log(finaltop / ref.height);
      setStartY(clientY); // Up
    }
  };

  const dragEndHandle = (e) => {
    setIsDragging(false);
  };
  const saveMovingHandle = async () => {
    if (containerBackRef.current && dragBackRef.current) {
      const full = containerBackRef.current.getBoundingClientRect();
      const cut = dragBackRef.current.getBoundingClientRect();
      const tinhtoan = (-cut.top + full.top) / cut.height;
      const update =
        Users.backgroundimg.split("%hiep%")[0] + "%hiep%" + tinhtoan;
      setUserInfo((pre) => ({ ...pre, backgroundimg: update }));
      setMovingSetting(false);
      const res = await fetchApiRes("UpdateUserID", "POST", {
        backgroundimg: update,
        MSSV: Users?.MSSV,
      });
    }
  };
  const saveBackHandle = async () => {
    if (containerBackRef.current && dragBackRef.current) {
      try {
        setIsLoading(true);
        const full = containerBackRef.current.getBoundingClientRect();
        const cut = dragBackRef.current.getBoundingClientRect();
        const persent = full.height / cut.height;
        const tinhtoan = (-cut.top + full.top) / cut.height;
        const img = new FormData();
        if (BackgroundUpdate) {
          img.append("images", BackgroundUpdate.src);
          img.append("back", 1);
          img.append("top", tinhtoan);
          img.append("MSSV", Users?.MSSV);
        }
        setUserInfo((pre) => ({
          ...pre,
          backgroundimg: `${BackgroundUpdate.view + "%hiep%" + tinhtoan}`,
        }));
        setBackgroundUpdate();
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/UpdateUserID/`,
          {
            method: "POST",

            body: img,
          }
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    const getMediaRes = async () => {
      const res = await fetchApiRes(`comment/getMedia/${commentID}`, "GET");
      if (res.result.length > 0) {
        const { url, createdAt, id,type } = res.result[0];
        setCurrentImg({ img: url, create_at: createdAt, id: id,type:type });
      }
    };
    if (commentID) {
      getMediaRes();
    }
  }, [commentID, MSSVparam]);
  const backChange = (e) => {
    if (backgroundImg.current) {
      setMovingSetting(false);
      backgroundImg.current.click();
    }
  };

  const [MovingSetting, setMovingSetting] = useState(false);
  const MovingHandle = () => {
    setMovingSetting(true);
  };
  const handleChange = [
    { text: ` Moving`, icon: <FiMove />, click: MovingHandle },
    { text: ` Change`, icon: <FiUpload />, click: backChange },
    { text: ` Delete`, icon: <FiDelete />, click: MovingHandle },
  ];
  const Setting = BackgroundUpdate || MovingSetting;
  const { themeColor } = useData();

  const backGroundHandle = (data) => {
    return (
      <button
        className="flex px-4 rounded-xl items-center hover:bg-gray-200"
        onClick={data.click}
      >
        {data.icon}
        <p className="p-4">{data.text}</p>
      </button>
    );
  };
  return (
    <Layout>
      {
        <div
          className="center content flex-col"
          style={commentID ? { opacity: 0 } : { cursor: `${cursor}` }}
        >
          <div
            style={{
              cursor: cursor,
              width: "100%",
              height: "60vh",
              backgroundImage: `url("${
                BackgroundUpdate?.view ||
                (Users?.backgroundimg &&
                  Users?.backgroundimg.split("%hiep%")[0])
              }")`,
            }}
            ref={containerBackRef}
            onMouseDown={Setting ? dragStartHandle : null}
            onMouseMove={Setting ? dragBackHandle : null}
            onMouseUp={Setting ? dragEndHandle : null}
            onMouseLeave={dragEndHandle}
            className={`relative overflow-hidden  bg-cover ${
              Setting && "cursor-move"
            }	`}
          >
            <div className="w-full h-full absolute inset-0 backdrop-blur-xl  bg-white/30 z-0"></div>
            <div
              className={`w-full h-1/2 absolute bottom-0 ${
                !themeColor ? "blurwhiteback " : "blurblackback"
              }`}
            ></div>
            <div className="w-full h-full center relative">
              <div
                className="h-full center relative overflow-hidden  rounded-b-lg "
                style={{ width: "80%" }}
              >
                <div className="absolute right-10 bottom-20 z-10 rounded-b-lg">
                  {BackgroundUpdate && (
                    <>
                      <span className="circleButton" onClick={saveBackHandle}>
                        <FiSave />
                      </span>
                      <span
                        className="circleButton"
                        onClick={() => setBackgroundUpdate()}
                      >
                        X
                      </span>
                    </>
                  )}
                  {MovingSetting && (
                    <span className="circleButton" onClick={saveMovingHandle}>
                      <FiSave />
                    </span>
                  )}
                </div>
                {Users?.UserID === auth.userID && (
                  <Popover
                    trigger={"click"}
                    content={
                      <div className="">
                        {handleChange.map((e) => backGroundHandle(e))}
                      </div>
                    }
                  >
                    <div className="p-2 bg-white center z-10 rounded cursor-pointer shadow-md absolute right-10 bottom-10 hover:bg-gray-200">
                      <FiCamera stroke="black" />
                      <p className="px-2 text-black	font-semibold">
                        Change Background Image
                      </p>
                    </div>
                  </Popover>
                )}
                {isLoading && (
                  <div className=" center w-full h-full absolute inset-0 z-50 bg-white-500/50">
                    <p className="text-4xl">Uploading . . . . </p>
                  </div>
                )}
                {Users?.backgroundimg || BackgroundUpdate ? (
                  <img
                    alt="background"
                    ref={dragBackRef}
                    style={
                      Setting
                        ? {}
                        : {
                            top: 0,
                            transform: `translateY(${
                              -Users?.backgroundimg.split("%hiep%")[1] * 100
                            }%)`,
                          }
                    }
                    className="object-fill w-full absolute z-1"
                    src={`${
                      BackgroundUpdate?.view ||
                      Users?.backgroundimg.split("%hiep%")[0]
                    }`}
                  ></img>
                ) : (
                  <div className="w-full h-full bg-black"></div>
                )}
              </div>
            </div>
            <input
              ref={backgroundImg}
              type="file"
              hidden
              onChange={(e) => changeBackImg(e)}
            ></input>
          </div>
          <div
            className={`w-full ${themeColor ? "bg-black" : " bg-gray-200"} `}
          >
            {
              <>
                <div
                  className={`flex  px-52 pb-16 mb-8 ${
                    themeColor ? "bg-black" : "theme"
                  }`}
                >
                  <div style={{ marginTop: "-3rem" }}>
                    <div className="flex">
                      <div className="relative">
                        <div class=" relative overflow-hidden rounded-full border-4 border-neutral-50 ">
                          {!Users ? (
                            <div
                              className="center theme"
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
                        {parseInt(auth?.username) === Users?.MSSV && (
                          <ChangeImg
                            img={`${Users?.img}`}
                            MSSV={Users?.MSSV}
                            setUsers={setUserInfo}
                          ></ChangeImg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" mx-4 flex-col content-center">
                    <p className="text-4xl font-bold ">{Users?.Name}</p>
                    <p>Bạn bè {friends?.length}</p>
                    <Avatar.Group>
                      {friends &&
                        friends.map((e) => (
                          <Avatar src={`${e.cutImg || e.img}`} />
                        ))}
                    </Avatar.Group>
                  </div>
                </div>
                <div className="w-full flex px-52 ">
                  <div className="h-screen " style={{ width: "40%" }}>
                    <div className="p-16 theme rounded-xl mb-8 ">
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
                              className="p-2 w-full bg-gray-200 text-black	 font-semibold center rounded-xl my-2 cursor-pointer hover:bg-gray-100"
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

                      <p>
                        Tham gia vào:{" "}
                        <span className="text-2xl font-semibold">
                          {formatDate(Users?.create_at)}
                        </span>
                      </p>
                    </div>
                    <div className="p-8 theme rounded-xl my-8">
                      <p className="font-bold text-3xl">Ảnh</p>
                      <div className="grid grid-cols-3 gap-2">
                        {ImgContent ? (
                          ImgContent.map(
                            (e) =>
                              e.img && e.type.includes('image')&& (
                                <div onClick={() => setCurrentImg(e)}>
                                  <NavLink
                                    to={`${process.env.REACT_APP_CLIENT_URL}/photo/?MSSV=${e.userID}&hid=${e.id}`}
                                  >
                                    <img
                                      alt="ImageProfile"
                                      className="object-cover rounded-xl"
                                      style={{ aspectRatio: "1" }}
                                      src={`${e.img}`}
                                    />
                                  </NavLink>
                                </div>
                              )
                          )
                        ) : (
                          <div className="loader"></div>
                        )}
                      </div>
                    </div>
                    <div className="p-16 theme rounded-xl my-8 shadow-md">
                      <p className="font-bold text-3xl">Bạn bè</p>
                      <p>
                        {friends?.length} bạn bè ({gerenalFriend.length} bạn
                        chung)
                      </p>
                      <div className="grid grid-cols-3 gap-3	">
                        {friends ? (
                          friends.map((e) => (
                            <Popover content={<UserProfile User={e} />}>
                              <NavLink
                                to={`${process.env.REACT_APP_CLIENT_URL}/profile/${e.MSSV}`}
                              >
                                <div className="flex-col w-full center">
                                  <img
                                    alt="ImageProfile"
                                    className="rounded-xl w-full  "
                                    style={{ aspectRatio: 1 }}
                                    src={`${e.cutImg || e.img}`}
                                  ></img>
                                  <p className="font-semibold">{e.Name}</p>
                                </div>
                              </NavLink>
                            </Popover>
                          ))
                        ) : (
                          <div className="loader"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="" style={{ width: "60%" }}>
                    {PostsData ? (
                      <Posts
                        setCurrentImg={setCurrentImg}
                        setImgContent={setImgContent}
                        Posts={PostsData}
                        setPost={setPost}
                        users={Users}
                        username={Users && Users?.MSSV}
                      />
                    ) : (
                      <div className=" w-full center">
                        <div className="loader"></div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            }
          </div>
        </div>
      }
      {CurrentImg && (
        <PhotoPost
          CurrentImg={CurrentImg}
          setCurrentImg={setCurrentImg}
          UsersProfile={Users}
          commentID={commentID}
        ></PhotoPost>
      )}
    </Layout>
  );
}
