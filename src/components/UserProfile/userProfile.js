import { useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import { useRefresh } from "../../hook/useRefresh";
import UseToken from "../../hook/useToken";
import Header from "../Layout/header/header";
import useAuth from "../../hook/useAuth";
import "./userProfile.css";
import BlobtoBase64 from "../../function/BlobtoBase64";

export default function UserProfile(props) {
  const khoaRef = useRef(1);
  const [currentChooseKhoa, setCurrentChooseKhoa] = useState();
  const { auth } = useAuth();
  const [khoa, setKhoa] = useState();
  const { AccessToken, setAccessToken } = UseToken();
  const [data, setData] = useState();
  const [isMounted, setIsMounted] = useState(false);
  const [classInfo, setClass] = useState([]);
  const [classFlowKhoa, setClassFlowKhoa] = useState();
  const [avatarURL, setAvatarURL] = useState();
  const [dataimg, setDataimg] = useState();
  const [UserInfo, setUserInfo] = useState();
  const host = process.env.REACT_APP_DB_HOST;

  const refreshAccessToken = useRefresh();
  const imgInput = (e) => {
    const img = e.target.files[0];
    const imgLink = URL.createObjectURL(img);
    setAvatarURL(imgLink);
    setDataimg(img);
  };
  const ResizeImg = (imgBlob, callback) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const newWidth = 100;
      const newHeight = 100;

      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          callback(blob);
        },
        "image/jpeg",
        0.7
      );
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.readAsDataURL(imgBlob);
  };



  useEffect(() => {
    const getData = async (data) => {
      try {
        const res = await fetch(
          `${host}/api/getStudentbyID/${props.MSSVParams}`
        );

        const resJson = await res.json();
        setUserInfo(resJson);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    getData();
  }, []);
  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const dataInput = Array.from(event.target.elements)
        .filter((input) => input.name)
        .reduce(
          (obj, input) => Object.assign(obj, { [input.name]: input.value }),
          {}
        );
      dataInput.create_by = auth.userID || 1;
      if (dataimg) {
    
        setIsMounted(!isMounted);

      }
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <>
      <Header></Header>
      <div className="CreateStudentForm">
        <div className="container_input">
          <div className="Introduce">
            <div className="right_introduce">
              <figure>
                <img
                  className="input_avatarShow"
                  src={UserInfo && `${BlobtoBase64(UserInfo?.backgroundimg)}`}
                />
              </figure>
            </div>
            <div className="right_introduce">
              <h3>{UserInfo?.Name}</h3>
              <p>
                {UserInfo?.Address}
                <br></br>"<i>{UserInfo?.introduce}"</i>
                <br></br>
              </p>
            </div>
          </div>
          <div className="text">Contact us Form</div>
          <form method="post" action="/create" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-data">
                <input type="text" required />
                <div className="underline"></div>
                <label for="">Name</label>
              </div>
              <div className="input-data">
                <input type="text" required />
                <div className="underline"></div>
                <label for="">Last Name</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data">
                <input type="text" required />
                <div className="underline"></div>
                <label for="">Email Address</label>
              </div>
              <div className="input-data">
                <input type="text" required />
                <div className="underline"></div>
                <label for="">Website Name</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data textarea">
                <textarea rows="8" cols="80" required></textarea>
                <br />
                <div className="underline"></div>
                <label for="">Write your message</label>
                <br />
                <div className="form-row submit-btn">
                  <div className="input-data">
                    <div className="inner"></div>
                    {/* <SendEmail></SendEmail> */}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* {
                                    isMounted &&
                             <SuccessNotification></SuccessNotification>
                            }    */}
    </>
  );
}
