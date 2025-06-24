import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getDate } from "../../function/getTime";
import SuccessNotification from "../Notification/successNotifi";
import useAuth from "../../hook/useAuth";
import { notification } from "antd";
export default function PropertyUser(props) {
  const { auth } = useAuth();
  const [property, setProperty] = useState(props.propertyUser.value);
  const label_property = useRef(null);
  const [messRes, setMessRes] = useState();
  const button_save = useRef(null);
  function clickFocusProperty() {
    if (label_property.current) {
      label_property.current.classList.add("click_property");
    }
  }
  function outClick() {
    if (label_property.current) {
      label_property.current.classList.remove("click_property");
    }
  }
  const [noti,contextHolder]=notification.useNotification()
  const [Cursor,setCursor]=useState('')
  async function updateUser(proterty) {
    try {
      setCursor('wait')
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
      setCursor('')
      noti.open({
        message: ' 🥳 Notification update',
        description:
          `${resJson.message}`,
        duration: 0,
      });    } catch (error) {
     console.log(error);
    }
  }
  async function saveUserProperty(value) {
    let values = property;
    if(props.propertyUser.key==="Birthday")
      {
        const time=new Date(property)
        values=time.getTime()
      }
 
    await updateUser({ [props.propertyUser.key]: values, MSSV: parseInt(auth.username) });
    props.setUserInfo(pre=>({...pre, [props.propertyUser.key]: values}))
  }

  useEffect(() => {
    if (button_save.current) {
      if (property !== props.propertyUser.value) {
        button_save.current.classList.add("invaild_ButtonSave");
      } else button_save.current.classList.remove("invaild_ButtonSave");
    }
  }, [property]);
  return (
    <>
          {contextHolder}

      <div className="layout_filter" style={{cursor:Cursor}}>
        <motion.div
          className="setting_property"
          initial={{ opacity: 0, y: 500 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h4>
              Change {props.propertyUser.key}
              <br></br>
            </h4>
          </div>
          <div
            className="button_notifi"
            onClick={() => props.setClicked(false)}
          >
            <svg
              id="Layer_1"
              style={{ enableBackground: "new 0 0 512 512" }}
              version="1.1"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
            </svg>
          </div>
          <div className="div-label" ref={label_property}>
            <label className="Label_property">
              <span className="Span_property">
                <span className="span_left"></span>
                <span className="spanWithName">
                  <span className="spanChildWithName">
                    {props.propertyUser.key}
                  </span>
                </span>
                <span className="span2"></span>
              </span>
              <input
                style={{ width: "100%" }}
                onClick={(e) => {
                  clickFocusProperty();
                }}
                onBlur={(e) => {
                  outClick();
                }}
                className="input_property"
                type={props.propertyUser.key === "Birthday" ? "date" : "text"}
                defaultValue={
                  props.propertyUser.key === "Birthday"
                    ? getDate(property)
                    : property
                }
                onChange={
                  props.propertyUser.key === "MSSV"
                    ? null
                    : (e) => setProperty(e.target.value)
                }
              />
            </label>
          </div>

          <button ref={button_save} onClick={property!==props.propertyUser.value?saveUserProperty:null} style={{cursor:Cursor,background:property===props.propertyUser.value?"gray":"blue",color:"white"}}>
            Lưu
          </button>
        </motion.div>
        {messRes && (
          <SuccessNotification
            messRes={messRes}
            setMessRes={setMessRes}
          ></SuccessNotification>
        )}
      </div>
    </>
  );
}
