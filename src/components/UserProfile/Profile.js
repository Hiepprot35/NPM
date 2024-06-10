import React, { useEffect, useRef, useState } from "react";
import UserProfile from "./userProfile";
import Layout from "../Layout/layout";
import { useParams } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import {
  fetchApiRes,
  getStudentInfoByMSSV,
  getUserinfobyID,
} from "../../function/getApi";

export default function Profile() {
  const { MSSV } = useParams();

  const [gerenalFriend, setgerenalFriend] = useState([]);
  const { auth } = useAuth();
  const [Users, setUserInfo] = useState();
  console.log(MSSV);
  const getData = async () => {
    try {
      setIsLoading(true)
      const data = await getStudentInfoByMSSV(MSSV);
      if(data)
        {
setIsLoading(false)
          setUserInfo(data);
          }
    } catch (error) {
      setIsLoading(false)

      console.error("Error occurred:", error);
    }
  };
  useEffect(() => {


    getData();
  }, [MSSV]);
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
    if (Users) {
      const getUserFriend = async () => {
        const dataMyFriend = await getFriendList(auth?.userID);
        const dataUserFriend = await getFriendList(Users.UserID);
        const data = await Promise.all(
          dataUserFriend.map(async (e) => {
            const username = await getUserinfobyID(e);
            const info = await getStudentInfoByMSSV(username.username);
            return info;
          })
        );
        console.log(data);
        setFriend(data);
        const generalFriends = dataUserFriend.filter((userFriend) => {
          return dataMyFriend.some((e) => e === userFriend);
        });
        setgerenalFriend(generalFriends);
      };
      getUserFriend();
    }
  }, [Users]);
  const introduceRef = useRef();
  const [ChangeIntroduce, setChangeIntroduce] = useState();
  const [IntroduceInput, setIntroduceInput] = useState();
  const [isLoading,setIsLoading]=useState(false)
  const showIntroduceHandle = () => {
    setChangeIntroduce(true);
  };
  async function updateUser(proterty)
  {
      try {
        setIsLoading(true)
        const res=await fetch(`${process.env.REACT_APP_DB_HOST}/api/UpdateUserID/`,
        {
          method:"POST",
          headers:{
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(proterty)
        })
        const resJson=await res.json()
        if(resJson)
          {
            getData()
            setChangeIntroduce(false)
          
          }
      } catch (error) {
       console.log(error)   
       setIsLoading(false)

      }
  }
    useEffect(() => {
    if (ChangeIntroduce && introduceRef.current) {
      introduceRef.current.focus();
    }
  }, [ChangeIntroduce]);
  useEffect(() => {
    if(Users)
      {
        setIntroduceInput(Users.introduce)
      }
  }, [Users]);
  return (
    <Layout>
      <div className="center content">
        <div className="w-full px-32 bg-gray-200">
          {Users && (
            <>
              <UserProfile MSSV={Users.MSSV}></UserProfile>
              <div className="w-full flex">
                <div className="h-screen " style={{ width: "40%" }}>
                  <div className="p-16 bg-white rounded-xl my-8 shadow-md">
                    <p className="font-bold text-3xl">Giới thiệu</p>
                    {!ChangeIntroduce &&!isLoading  && (
                      <>
                        <p className="m-8">{Users.introduce}</p>
                        {
                          Users.MSSV ===parseInt(auth.username) &&
                          <p
                        onClick={() => {
                          showIntroduceHandle();
                        }}
                      className="p-4 w-full bg-gray-200 center rounded-xl my-2 cursor-pointer hover:bg-gray-100"
                    >
                          Chỉnh sửa mục đáng chú ý
                        </p>
                        }
                      </>
                    )}
                    {ChangeIntroduce &&!isLoading && (
                      <>
                        <textarea
                          ref={introduceRef}
                          className="w-full"
                          onChange={(e)=>setIntroduceInput(e.target.value)}
                          value={IntroduceInput}
                          placeholder={`${Users.introduce}`}
                        ></textarea>
                        <div className="flex">
                          <span
                            onClick={() => setChangeIntroduce(false)}
                            className="cursor-pointer px-4 font-semibold py-2 rounded-xl m-2 center bg-gray-200"
                          >
                            Hủy
                          </span>
                          <span onClick={()=>updateUser({introduce:IntroduceInput,MSSV:Users.MSSV})} className="cursor-pointer px-4 font-semibold py-2 rounded-xl m-2 center bg-gray-200">
                            Lưu
                          </span>
                        </div>
                      </>
                    )}
            {isLoading && <div className="">...............</div>}

                    <p>Tham gia vào {Users.create_at}</p>
                  </div>
                  <div className="p-16 bg-white rounded-xl my-8 shadow-md">
                    <p className="font-bold text-3xl">Ảnh</p>
                  </div>
                  <div className="p-16 bg-white rounded-xl my-8 shadow-md">
                    <p className="font-bold text-3xl">Bạn bè</p>
                    <p>
                      {friends.length} bạn bè ({gerenalFriend.length} bạn chung)
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
                <div className=" h-screen" style={{ width: "60%" }}></div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
