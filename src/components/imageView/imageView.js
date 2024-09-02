import { FiX } from "react-icons/fi";

export default function ImageView({
  imgView,
  setImgView,
  setFileImg,
  FileImg,
}) {
  function remove_imageMess(e) {
    const data = [...imgView];
    const index = data.findIndex((v) => v.toString() === e.toString());

    if (index !== -1) {
      data.splice(index, 1);
      setImgView(data);
    }
  }
  return (
    <div
      className={`flex ${
        imgView.length >= 3 && "overflow-x-scroll overflow-y-hidden"
      }`}
    >
      {imgView.map((e, i) => (
        <div className="listImgDiv" style={{ position: "relative" }}>
          <div key={i} className="listImgMess w-16 h-16">
            <img
              alt="Hello"
              className="rounded-xl  w-full h-full object-cover"
              src={e}
            ></img>
          </div>
          <span
            onClick={() => remove_imageMess(e)}
            className="circleButton buttonImgView w-6 m-0 "
          >
            <FiX />
          </span>
        </div>
      ))}
    </div>
  );
}
