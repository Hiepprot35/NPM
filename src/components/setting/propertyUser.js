import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getDate } from "../../function/getTime";
import useAuth from "../../hook/useAuth";
import { notification } from "antd";
import { fetchApiRes } from "../../function/getApi";

export default function PropertyUser(props) {
  const { auth } = useAuth();
  const [property, setProperty] = useState(props.propertyUser.value);
  const [cursor, setCursor] = useState("");
  const [noti, contextHolder] = notification.useNotification();
  const saveBtnRef = useRef();

  async function updateUser(proterty) {
    try {
      setCursor("wait");
      const resJson = await fetchApiRes(
        `UpdateUserID`,'POST',proterty)
        
      setCursor("");

      noti.open({
        message: "🥳 Update Successful",
        description: resJson.message,
        duration: 3,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function saveUserProperty() {
    let values = property;

    if (props.propertyUser.key === "Birthday") {
      const time = new Date(property);
      values = time.getTime();
    }

    await updateUser({ [props.propertyUser.key]: values, MSSV: parseInt(auth.username) });

    props.setUserInfo((pre) => ({
      ...pre,
      [props.propertyUser.key]: values,
    }));
  }

  useEffect(() => {
    if (saveBtnRef.current) {
      if (property !== props.propertyUser.value) {
        saveBtnRef.current.classList.remove("opacity-50");
      } else {
        saveBtnRef.current.classList.add("opacity-50");
      }
    }
  }, [property]);

  return (
    <>
      {contextHolder}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center" style={{ cursor }}>
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Close Button */}
          <button
            onClick={() => props.setClicked(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Change {props.propertyUser.key}
          </h2>

          {/* Input Field */}
          <label className="block text-sm text-gray-600 mb-1">
            {props.propertyUser.key}
          </label>
          <input
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Save Button */}
          <button
            ref={saveBtnRef}
            onClick={property !== props.propertyUser.value ? saveUserProperty : null}
            className={`mt-6 w-full py-2 rounded-lg text-white transition ${
              property !== props.propertyUser.value
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </motion.div>
      </div>
    </>
  );
}
