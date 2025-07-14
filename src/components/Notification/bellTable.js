import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useSocket } from "../../context/socketContext";
import "./belltable.css";
import useAuth from "../../hook/useAuth";
import { fetchApiRes } from "../../function/getApi";
import { Popover } from "antd";

function BellTable() {
  const socket = useSocket();
  const notificationRef = useRef();
  const containerRef = useRef();
  const { auth } = useAuth();

  const [Clicked, setClicked] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const loadMoreNotifications = async (reset = false) => {
    const res = await fetchApiRes(
      `message/getRequestFriends?limit=${limit}&page=${page}`,
      "GET"
    );
    const list = res.result || [];

    const usersMapped = await Promise.all(
      list.map(async (element) => {
        const user =
          element.user1 !== auth.userID ? element.user1 : element.user2;
        const data = await fetchApiRes("getStudentbyUserID", "POST", {
          UserID: parseInt(user),
        });

        return {
          ...element,
          name: data?.Name,
          img: data?.img,
          cutImg: data?.cutImg,
        };
      })
    );

    setUsers((prev) => (reset ? usersMapped : [...prev, ...usersMapped]));
    setHasMore(usersMapped.length === limit);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (Object.keys(auth).length > 0) {
      loadMoreNotifications(true); // reset khi auth có
    }
    return () => {
      setUsers([]);
      setPage(1);
    };
  }, [auth]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveRequest", () => {
        document.title = `Một thông báo mới`;
        setPage(1);
        loadMoreNotifications(true);
      });
    }
  }, [socket]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || !hasMore) return;

    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10
    ) {
      loadMoreNotifications();
    }
  };

  const handleAction = async (id, action) => {
    setClicked(!Clicked);
    const newUsers = users.filter((e) => e.id !== id);
    setUsers(newUsers);

    const payload = {
      Requesting: false,
      id,
    };

    if (action === "accept") {
      payload.Accept = true;
      payload.Friend = true;
    }

    await fetchApiRes("message/updateConversation", "POST", payload);
  };

  return (
    <>
      <Popover
        trigger={"click"}
        placement="bottomRight"
        content={
          <div
            className="scrollContainer"
            onScroll={handleScroll}
            ref={containerRef}
            style={{ maxHeight: "300px", overflowY: "auto", width: "300px" }}
          >
            {users.length > 0 ? (
              users.map((e) => (
                <div className="infoNofi center" key={e.id}>
                  <div className="divCenterdiv">
                    <div style={{ margin: ".5rem" }}>
                      <img
                        className="avatarImage"
                        src={`${e?.cutImg || e?.img}`}
                      />
                    </div>
                    <div>
                      <p>
                        <strong>{e.name}</strong> gửi lời mời kết bạn
                      </p>
                      <div className="divCenterdiv">
                        <div
                          className="button AcceptButton"
                          onClick={() => handleAction(e.id, "accept")}
                        >
                          <p>Đồng ý</p>
                        </div>
                        <div
                          className="button"
                          onClick={() => handleAction(e.id, "delete")}
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
        }
      >
        <div className="circleButton notification" ref={notificationRef}>
          {users?.length > 0 && (
            <div className="countNoti">
              <p>{users.length}</p>
            </div>
          )}
          <span>
            <FiBell />
          </span>
        </div>
      </Popover>
    </>
  );
}

export default BellTable;
