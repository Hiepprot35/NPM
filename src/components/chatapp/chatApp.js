import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import useAuth from '../../hook/useAuth';
import BlobtoBase64 from '../../function/BlobtoBase64';
import Header from '../Layout/header/header';
import './chatApp.css'
import Conversation from '../conversation/conversations';
import Message from '../message/Message';
import getTime from '../../function/getTime';
// import SocketManager from '../../hook/useSocket';
import { useSocket } from '../../context/socketContext';

import { getConversation } from '../conversation/getConversation';
import WindowChat from '../message/windowchat';
const ChatApp = ({ messageId }) => {
  document.title = "Message"
  const messageScroll = useRef(null)
  const inputMess = useRef()
  const [guestImg, setGuestImg] = useState();
  const { auth } = useAuth()
  useEffect(()=>{console.log(auth)},[])
  const [MSSVReceived, setMSSVReceived] = useState()
  const [data, setData] = useState([]);
  const [conversations, setConversation] = useState([])
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userSeenAt, setuserSeenAt] = useState()
  const [clicked, setClicket] = useState(false)
  const [onlineUser, setOnlineUser] = useState()
  const [messages, setMessages] = useState([]);
  const [isSeen, setisSeen] = useState(false)
  useEffect(() => {
    if (messageId) {
      const senApi = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/conversations/mess/${messageId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "id": auth.userID })
          });
          const data = await res.json()
          setCurrentChat(data)
        } catch (err) {
          console.log(err);
        }
      }
      senApi()
    }
  }, [])

  const socket = useSocket();
  let isCancel = false
  // const ListusersOnline = onlineUser && onlineUser.map(item => item.userId) || [];
  const ClickChat = (data) => {
    setCurrentChat(data);
  }
  useEffect(() => {
    inputMess.current && inputMess.current.focus()
  }, [currentChat])
  // const handleKeyPress = async (event) => {
  //   if (event.key === 'Enter') {
  //     const message = {
  //       sender_id: auth.userID,
  //       content: inputMess.current.value,
  //       conversation_id: currentChat.id,
  //     };
  //     const user12 = [currentChat?.user1, currentChat?.user2]
  //     const receiverId = user12.find(
  //       (member) => member !== auth.userID
  //     );
  //     socket.current.emit("sendMessage", {
  //       sender_id: auth.userID,
  //       receiverId,
  //       content: inputMess.current.value,
  //     });
  //     try {
  //       const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(message)
  //       });
  //       const data = await res.json()
  //       setMessages([...messages, data]);
  //       inputMess.current.value = "";
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }
  const clickConversation = async (data) => {
    const user12 = [data?.user1, data?.user2]
    const receiverId = user12.find(
      (member) => member !== auth.userID
    );
    const sentToApi = {
      conversation_id: data?.id,
      sender_id: receiverId
    }
    const resFunctiongetNewestMessSeen = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message/seen`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sentToApi)
        });
      } catch (err) {
        console.log(err);
      }
    }
    resFunctiongetNewestMessSeen()
    if(socket)
    {
    const sendSocket = {
      sender_id: auth.userID,
      receiverId,
      isSeen: true,
    }
    socket.emit("UserSeen", sendSocket)
  }
}
  useEffect(() => {
    if(socket)
    {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender_id: data.sender_id,
        content: data.content,
        isFile:data.isFile,
        created_at: Date.now(),
      });
    });
    return () => {
      socket.off("disconnect");
    }
  }
  }, [socket]
  )
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {


        try {
          const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message/${currentChat?.id}`,
            {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await res.json()
          setMessages(data);

        } catch (err) {
          console.log(err);
        }
      };
    }
    getMessages();
  }, [currentChat]);
  useEffect(() => {
    if(socket)
    {

      socket.emit("addUser", auth.userID);
      socket.on("getUsers", (data) => { setOnlineUser(data) })
      // socket.current.on("getUserSeen", (data) => {setisSeen( data) })
    }
    return()=>{
      if (socket) {
        socket.off("disconnect");
      }
    }
                    }, [socket]);
  useEffect(() => {
    if (arrivalMessage) {
        setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);
  useEffect(() => {
    async function AsyncGetCon()
    {
      const convers= await getConversation(auth);
      setConversation(convers)
      setData([convers])
    }
    AsyncGetCon()
  }, [messages, arrivalMessage, isSeen])
  useEffect(() => {
    const getNewstMess = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message/newest/seen/${currentChat?.id}/${auth?.userID}`)
        const getMess = await res.json();
        setuserSeenAt(getMess)
      } catch (error) { console.log(error)
      }
    }
    getNewstMess()

  }, [currentChat, messages, isSeen])
  useEffect(()=>{console.log("Mount Chatap")
  return()=>{
    console.log("unMountChataap")
  }
},[])

  useEffect(() => {
    const studentInfo = async (data, userID) => {
      if (data) {

        const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${data} `;
        try {
          const studentApi = await fetch(URL2);
          const student = await studentApi.json();
          student.userID = userID
          setGuestImg(student)
        } catch (error) {
          console.error(error);
        }
      };
    }
    if (MSSVReceived) {
      const data = MSSVReceived[0]?.username;
      const userid = MSSVReceived[0]?.UserID;
      studentInfo(data, userid);
    }
  }, [MSSVReceived, currentChat]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMess.current.value && socket) {
      const message = {
        sender_id: auth.userID,
        content: inputMess.current.value,
        conversation_id: currentChat.id,
      };
      const user12 = [currentChat?.user1, currentChat?.user2]
      const receiverId = user12.find(
        (member) => member !== auth.userID
      );
        if(socket)
        {
          console.log(socket)
      socket.emit("sendMessage", {
          sender_id: auth.userID,
          receiverId,
          content: inputMess.current.value,
        });
      } else{
        console.log("không có socket")
      }
     
      try {
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        });
        const MessageDataRes = await res.json()
        setMessages([...messages, MessageDataRes]);
        inputMess.current.value = "";
        inputMess.current.focus()
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    const receiverId = currentChat ? (currentChat.user1 !== auth.userID ? currentChat.user1 : currentChat.user2) : null;

    const getUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/username?id=${receiverId}`);
        const data2 = await res.json();
        setMSSVReceived(data2);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentChat]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    if (e.target.value != "") {
      setClicket(true)
      try {
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/studentSearchBar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "data": e.target.value })
        });
        const data = await res.json()
        setSearchTerm(data);

      } catch (err) {
        console.log(err);
      }
    }
    if (e.target.value == "") {
      setClicket(false)
    }
  };
  useEffect(() => {
    if (searchTerm) {

      const result = conversations.filter(conversation => {
        return searchTerm?.some(searchItem => searchItem.UserID === conversation.user1 || searchItem.UserID === conversation.user2);
      });
      setSearchResults(result)
    }
  }, [searchTerm])

  return (
    <>
      <Header hash={"/message"}></Header>
      {
        <>
          <div className='Container_ChatApp'>
            <div className='Narbar_ChatApp'>
              <input
                placeholder="Search for friends"
                className="chatMenuInput"
                onChange={(e) => handleSearch(e)}
              />
              {clicked ? 
                (
                searchResults.map((c, index) => (
                  <div
                    onClick={() => {
                      ClickChat(c);
                    }}
                    key={index}
                    className='converrsation_chat'
                    style={currentChat === c ? { backgroundColor: "rgb(245, 243, 243)" } : {}}
                  >
                    
                    <Conversation
                      conversation={c}
                      currentUser={auth.userID}
                      Arrivalmess={arrivalMessage}
                      mess={messages.length}
                      Online={onlineUser}
                      listSeen={isSeen}
                    />
                  </div>
                ))
              ) : (
                conversations &&
                conversations.map((c, index) => (
                  <Link key={index} to={`/message/${c.user1 === auth.userID ? c.user2 : c.user1}`}>
                    <div
                      onClick={() => {
                        ClickChat(c);
                      }}
                      key={index}
                      className='converrsation_chat'
                      style={currentChat && currentChat?.id === c.id ? { backgroundColor: "rgb(245, 243, 243)" } : {}}
                    >
                      <Conversation
                        conversation={c}
                        currentUser={auth.userID}
                        Arrivalmess={arrivalMessage}
                        mess={messages.length}
                        Online={onlineUser}
                        listSeen={isSeen}
                      />
                    </div>
                  </Link>

                ))
              )}

            </div>
            <div className='Main_ChatApp'>

              {
                conversations.length === 0 ? <div className='chatbox_res'>Kết bạn đi anh bạn <a href='/home' className='play_in_cheo'>kết bạn</a></div> :
                  <>
                    {
                      !currentChat ? <div className='chatbox_res'>Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới</div> :
                        <>
                      <div className='Body_mainChatApp'>
                          <div className='ChatApp'>

                          <WindowChat count={currentChat} ListusersOnline={onlineUser}></WindowChat>
                          </div>
                      </div>
                          {/* <div className='Body_Chatpp' >
                            <div className='ChatApp' >
                              <div className='ChatApp_text'>
                                {messages.map((message, index) => (
                                  <div className='message_content' key={index}>
                                    <Message key={index} message={message}
                                      my={auth.userID} own={message.sender_id === auth.userID} student={guestImg} Online={onlineUser} listSeen={userSeenAt} ></Message>
                                  </div>
                                ))}
                              </div>
                              <div className='inputValue'>
                                  <div className='feature_left'>
                                    <ul>
                                        <li>
                                        <img src='/images/image.svg' style={{width:"1.5rem",height:"1.5rem"}}></img>
                                        </li>

                                        <li>                                            
                                            <img src='/images/sticker.svg' style={{width:"1.5rem",height:"1.5rem"}}></img></li>
                                        <li>
                                            <img src='/images/gif.png' style={{width:"1.5rem",height:"1.5rem"}}></img>
                                        </li>
                                    </ul>
                                </div>
                                <div className='text_field'>
                                  <input
                                    // onKeyPress={handleKeyPress}
                                    onClick={() => clickConversation(currentChat)}
                                    onFocus={() => clickConversation(currentChat)}
                                    ref={inputMess}
                                    placeholder='Send a messsage'
                                    type="text"
                                    required
                                  />
                                </div>
                                <div className='button_field'>
                                  {
                                    <button className='play_in_cheo' onInvalid={inputMess?true:false} onClick={handleSubmit} >Send</button>
                                  }
                                </div>
                              </div>
                            </div>

                          </div> */}
                        </>
                    }
                  </>
              }
            </div>
          </div>
        </>
      }
    </>
  );
};

export default ChatApp;
