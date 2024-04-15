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
function BellTable() {
  const socket = useSocket();
  const notificationRef = useRef();
  const { auth } = useAuth();
  const [notification, setNotification] = useState([]);
  const [users, setUsers] = useState([]);
  const data = async () => {
    const res = await fetchApiRes("message/getRequestFriends", "POST", {
      user2: auth.userID,
    });
    setNotification(res.result);
  };
  const getUsers = async () => {
    const promises = notification.map(async (element) => {
      const MSSV = await getUserinfobyID(element.user1);
      console.log(MSSV);
      const data = await getStudentInfoByMSSV(MSSV.username);
      return { ...element, name: data.Name, img: data.img };
    });

    const ListUsers = await Promise.all(promises);
    setUsers(ListUsers);
  };
  useEffect(() => {
    data();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receiveRequest", async (values) => {
        document.title = `Một thông báo mới`;
        data();
      });
    }
  }, [socket]);
  useEffect(() => {
    notification && getUsers();
  }, [notification]);

  const [showTable, setShowTable] = useState(false);
  const acceptHandle = async (id) => {
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
    const newUsers = users.filter((e) => e.id !== id);
    setUsers(newUsers);
    await fetchApiRes("message/updateConversation", "POST", {
      Requesting: false,
      id: id,
    });
  };
  return (
    <>
      <div
        className="circleButton notification"
        ref={notificationRef}
        onClick={() => {
          setShowTable(!showTable);
        }}
      >
        <div className="countNoti">
          <p>{users && users.length}</p>
        </div>
        <span>
          <FiBell></FiBell>
        </span>
        {showTable && (
          <div className="tableNotification">
            <div>
              {users &&
                users.map((e, i) => (
                  <div className="infoNofi">
                    <div
                      className="divCenterdiv"
                      style={{ marginLeft: "1rem" }}
                    >
                      <img src={`${e.img}`}></img>
                      <div>
                        <p>
                          <b>{e.name}</b> gửi lời mời kết bạn
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
                            <p>Từ chối</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default BellTable;
