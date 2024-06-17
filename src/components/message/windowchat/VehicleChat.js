import React, { useEffect, useState } from "react";

export default function VehicleChat(props) {

  const clickImg = (e) => {
    {      props.setShowImgMess(e);
    }
  };
  return (
    <div className="VehicleChat mx-8 overflow-y-scroll " style={{ width: "50%",height:"100%" }}>
      <div className=" center flex-col">
        <img
          className="avatarImage "
          style={{ width: "40%" }}
          src={`${props.user?.cutImg || props.user?.img}`}
        ></img>
        <div className="p-3 font-semibold">
          <p className="text-3xl">{props?.mask}</p>
        </div>
      </div>
      <div>
        <p>Phương tiện</p>
        <div className="grid-cols-3 grid ">
          {props.imgs.map((e) => (
            <div
              className=""
              style={{ margin: ".2rem" }}
              onClick={() => clickImg(e)}
            >
              <img
                className="object-cover rounded-xl cursor-pointer"
                style={{ width: "100%", aspectRatio: "1" }}
                src={`${e}`}
              ></img>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
