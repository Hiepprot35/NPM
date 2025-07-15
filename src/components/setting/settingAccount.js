import Header from "../Layout/header/header";
import useAuth from "../../hook/useAuth";
import { useEffect, useState } from "react";
import FormInput from "../Layout/FormInput/FormInput";
import "./settingAccount.css";
import { motion } from "framer-motion";
import PropertyUser from "./propertyUser";
import { getDate } from "../../function/getTime";
import SuccessNotification from "../Notification/successNotifi";
import Home from "../home/home";
import Windowchat from "../message/windowchat";
import MessageMainLayout from "../message/messageMainLayout";
import { fetchApiRes } from "../../function/getApi";
export default function SettingAccount() {
  const [userInfo, setUserInfo] = useState();
  const [inputs, setInputs] = useState();
  const [saved, setSaved] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [choosenProperty, setChoosenProperty] = useState({
    key: "",
    value: "",
  });
  const [messRes, setMessRes] = useState();
  const { auth } = useAuth();
  useEffect(() => {
    const getData = async (data) => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${auth.username}`
        );

        const resJson = await res.json();
        const { MSSV, Name, Address, SDT, Birthday, Sex, img, introduce } =
          resJson;
        setUserInfo({
          MSSV,
          Name,
          Address,
          SDT,
          Birthday,
          Sex,
          img,
          introduce,
        });
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    getData();
  }, []);
  async function updateUser(proterty) {
    try {
      const resJson = await fetchApiRes(
        `UpdateUserID/`,'POST',proterty)
       
      setMessRes(resJson.message);
    } catch (error) {
     console.log(error);
    }
  }
  useEffect(() => {
    // saved && updateUser(userInfo);
    setSaved(false);
  }, [saved, userInfo]);
  useEffect(() => {
    if (userInfo) {
      const keys = Object.keys(userInfo);
      const map = keys.map((key) => ({ key, value: userInfo[key] }));
      setInputs(map);
    }
  }, [userInfo]);

  const clickProperty = (data) => {
    setClicked(true);
    setChoosenProperty({ key: data.key, value: data.value });
  };
  const checkIsVerify = () => {
    setUserInfo({ ...userInfo, isVerify: false });
  };
  return (
    <>
   <div className="w-full px-6 py-8 max-w-4xl mx-auto mt-[9vh]">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Account Settings
      </h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Basic Information
        </h3>

        {inputs &&
          inputs.map(
            (e, index) =>
              index < 5 && (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  onClick={() => clickProperty(e)}
                >
                  <div className="text-gray-600 dark:text-gray-300 font-medium w-1/3">
                    {e.key}
                  </div>
                  <div className="text-gray-900 dark:text-white w-2/3 text-right">
                    {e.key === "Birthday" ? getDate(e.value) : e.value}
                  </div>
                </div>
              )
          )}

        {/* Email Verification */}
        <div className="flex items-center gap-3 mt-6">
          <input
            type="checkbox"
            id="verifyEmail"
            onClick={checkIsVerify}
            className="accent-blue-600 w-4 h-4"
          />
          <label
            htmlFor="verifyEmail"
            className="text-gray-700 dark:text-gray-200"
          >
            Verify Email
          </label>
        </div>
      </div>

      {clicked && choosenProperty && (
        <PropertyUser
          propertyUser={choosenProperty}
          setUserInfo={setUserInfo}
          setClicked={setClicked}
        />
      )}
    </div>
  </div>
     
    </>
  );
}
