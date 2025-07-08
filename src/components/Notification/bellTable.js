import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useSocket } from "../../context/socketContext";
import "./belltable.css";
import useAuth from "../../hook/useAuth";
import {
  fetchApiRes,
  getStudentInfoByMSSV,
  getUserinfobyID,
} from "../../function/getApi";
import { Popover } from "antd";
function BellTable() {
  const socket = useSocket();
  const notificationRef = useRef();
  const { auth } = useAuth();
  const [Clicked, setClicked] = useState(false);
  const [notification, setNotification] = useState([]);
  const [users, setUsers] = useState([]);
  const getNoification = async () => {
    const res = await fetchApiRes("message/getRequestFriends", "POST", {
      user2: auth.userID,
    });
    setNotification(res.result);
  };
  const getUsers = async () => {
    const promises = notification.map(async (element) => {
      let user = element.user1 !== auth.userID ? element.user1 : element.user2;
      const data = await fetchApiRes("getStudentbyUserID", "POST", {
        UserID: parseInt(user),
      });

      return {
        ...element,
        name: data?.Name,
        img: data?.img,
        cutImg: data?.cutImg,
      };
    });

    const ListUsers = await Promise.all(promises);
    setUsers(ListUsers);
  };
  useEffect(() => {
    if (Object.keys(auth).length>0) {
      getNoification();
    }
    return () => {
      setUsers([]);
      setNotification([]);
    };
  }, [auth]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveRequest", async (values) => {
        document.title = `Một thông báo mới`;
        getNoification();
      });
    }
  }, [socket]);
  useEffect(() => {
    notification && getUsers();
  }, [notification]);

  const [showTable, setShowTable] = useState(false);
  const acceptHandle = async (id) => {
    setClicked(!Clicked);
    const newUsers = users.filter((e) => e.id !== id);
    setUsers(newUsers);
    await fetchApiRes("message/updateConversation", "POST", {
      Requesting: false,
      Accept: true,
      Friend: true,
      id: id,
    });
  };
  const deleteHandle = async (id) => {
    setClicked(!Clicked);

    const newUsers = users.filter((e) => e.id !== id);
    setUsers(newUsers);
    await fetchApiRes("message/updateConversation", "POST", {
      Requesting: false,
      id: id,
    });
  };
  return (
    <>
      <Popover
        trigger={"click"}
        placement="bottomRight"
        content={
            <div className="">
              <div>
                {users.length > 0 ? (
                  users.map((e, i) => (
                    <div className="infoNofi center">
                      <div className="divCenterdiv">
                        <div style={{ margin: ".5rem" }}>
                          <img
                            className="avatarImage"
                            src={`${e?.cutImg || e?.img}`}
                          ></img>
                        </div>
                        <div>
                          <p>
                            <strong>{e.name}</strong> gửi lời mời kết bạn
                          </p>
                          <div className="divCenterdiv">
                            <div
                              className="button AcceptButton"
                              onClick={() => acceptHandle(e.id)}
                            >
                              <p>Đồng ý</p>
                            </div>
                            <div
                              className="button"
                              onClick={() => deleteHandle(e.id)}
                            >
                              <p style={{ color: "black" }}>Từ chối</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="infoNofi center" style={{ height: "4rem" }}>
                    <p>Hiện tại không có thông báo mới</p>
                  </div>
                )}
              </div>
            </div>
        }
      >
        <div className="circleButton notification" ref={notificationRef}>
          {users?.length > 0 && (
            <div className="countNoti">
              <p>{users.length}</p>
            </div>
          )}
          <span>
            <FiBell></FiBell>
          </span>
        </div>
      </Popover>
    </>
  );
}
export default BellTable;
