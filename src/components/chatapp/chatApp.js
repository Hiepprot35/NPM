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
const ChatApp = ({ messageId }) => {
  document.title = "Message"
  const messageScroll = useRef(null)
  const inputMess = useRef()
  const [guestImg, setGuestImg] = useState();
  const { auth } = useAuth()
  useEffect(()=>{console.log(auth)},[])
  const chatboxRef = useRef(null)
  const [MSSVReceived, setMSSVReceived] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [conversations, setConversation] = useState([])
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userSeenAt, setuserSeenAt] = useState()
  const [clicked, setClicket] = useState(false)
  const [onlineUser, setOnlineUser] = useState()
  const [messages, setMessages] = useState([]);
  const [seenMess, setSeenMess] = useState([])
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [getMessScroll, setGetMessScroll] = useState(1)
  const [isSeen, setisSeen] = useState(false)

  // const handleScroll = () => {
  //   if (messageScroll.current) {
  //     const element = messageScroll.current;
  //     const scrollTop = element.scrollTop;
  //     const scrollHeight = element.scrollHeight;
  //     const clientHeight = element.clientHeight;
  //     const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  //     setScrollPercentage(percentage);
  //   }
  // };
  // useEffect(() => {
  //   // Hiển thị 10 tin nhắn mới nhất ban đầu
  //   setVisibleMessages(messages.slice(messages.length-15, messages.length));
  // }, [messages]);
  // useEffect(() => {
  //   const element = messageScroll.current;
  //   if (element) {
  //     element.addEventListener('scroll', handleScroll);

  //     return () => {
  //       element.removeEventListener('scroll', handleScroll);
  //     };
  //   }
  // }, [currentChat, messages]);
  // useEffect(() => {

  // }, [])

  // useEffect(() => {
  //   if ( messageScroll.current) {
  //     const element = messageScroll.current;
  //     const scrollHeight = element.scrollHeight;
  //     const clientHeight = element.clientHeight;
  //     console.log(clientHeight)
  //     element.scrollTop = scrollHeight;
  //   }
  // }, [messages]);
  // const loadMoreMessages = () => {
  //   const currentlyVisibleCount = visibleMessages.length;
  //   const messagesToLoad = 1;
  //   const startIndex = messages.length - currentlyVisibleCount;
  //   const endIndex = startIndex - messagesToLoad;
  //   console.log(endIndex,"-",startIndex)
  //   if (endIndex >= 0) {
      
  //     const newVisibleMessages = messages.slice(endIndex, startIndex);
  //     setVisibleMessages([...newVisibleMessages, ...visibleMessages]);
  //   }
  // };
  // useEffect(() => {
  //   if (scrollPercentage < 10) {
  //     console.log("oke")
  //     loadMoreMessages();
  //   }
  // }, [scrollPercentage])
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

  const socket = useRef(); // Replace with your server URL
  let isCancel = false
  const ListusersOnline = onlineUser && onlineUser.map(item => item.userId) || [];
  const ClickChat = (data) => {
    setCurrentChat(data);
  }
  useEffect(() => {
    inputMess.current && inputMess.current.focus()
  }, [currentChat])
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      const message = {
        sender_id: auth.userID,
        content: inputMess.current.value,
        conversation_id: currentChat.id,
      };
      const user12 = [currentChat?.user1, currentChat?.user2]
      const receiverId = user12.find(
        (member) => member !== auth.userID
      );
      socket.current.emit("sendMessage", {
        sender_id: auth.userID,
        receiverId,
        content: inputMess.current.value,
      });
      try {
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        });
        const data = await res.json()
        setMessages([...messages, data]);
        inputMess.current.value = "";
      } catch (err) {
        console.log(err);
      }
    }
  }
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
    const sendSocket = {
      sender_id: auth.userID,
      receiverId,
      isSeen: true,
    }
    socket.current.emit("UserSeen", sendSocket)
  }
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_DB_HOST);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender_id: data.sender_id,
        content: data.content,
        created_at: Date.now(),
      });
    });
    return () => {
      socket.current.disconnect();
    }
  }, []
  )
  useEffect(() => {
    socket.current.emit("addUser", auth.userID);
    socket.current.on("getUsers", (data) => {
      setOnlineUser(data)
    })
    socket.current.on("getUserSeen", (data) => {
      setisSeen(
        data
      )
    })
  }, [auth]);
  useEffect(() => {
    if (arrivalMessage) {
      const data = [currentChat?.user1, currentChat?.user2];
      data.includes(arrivalMessage.sender_id) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);
  const data = []
  useEffect(() => {
    const getConversation = async () => {
      const URL = `${process.env.REACT_APP_DB_HOST}/api/conversations/${auth.userID}`
      try {

        const res = await fetch(URL,
          {
            method: "get",
            headers: {
              'Content-Type': 'application/json',
            },
          })

        const respon = await res.json();
        setConversation(respon)
        data = [respon]
      } catch (error) {

      }
    }
    getConversation()
  }, [messages, arrivalMessage, isSeen])

  useEffect(() => {


    const getNewstMess = async () => {
      try {

        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message/newest/seen/${currentChat?.id}/${auth?.userID}`)
        const getMess = await res.json();
        setuserSeenAt(getMess)
      } catch (error) {
      }

    }
    getNewstMess()

  }, [currentChat, messages, isSeen])

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
    if (inputMess.current.value) {


      const message = {
        sender_id: auth.userID,
        content: inputMess.current.value,
        conversation_id: currentChat.id,
      };
      const user12 = [currentChat?.user1, currentChat?.user2]
      const receiverId = user12.find(
        (member) => member !== auth.userID
      );
      socket.current.emit("sendMessage", {
        sender_id: auth.userID,
        receiverId,
        content: inputMess.current.value,
      });
      try {
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        });
        const data = await res.json()
        setMessages([...messages, data]);
        inputMess.current.value = "";
        inputMess.current.focus()
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    console.log(getMessScroll)

  }, [getMessScroll])
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
              body: JSON.stringify({ "count": getMessScroll })
            }
          );
          const data = await res.json()
          console.log(data)
          setMessages(data);

        } catch (err) {
          console.log(err);
        }
      };
    }
    getMessages();
  }, [currentChat, getMessScroll]);
  useEffect(() => {
    let receiverId;
    const user12 = [currentChat?.user1, currentChat?.user2];
    currentChat?.user1 !== currentChat?.user2 ? receiverId = user12.find((member) => member !== auth.userID) : receiverId = auth.userID;
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
  // useEffect(()=>{console.log(currentChat)},[currentChat])
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
                          <div className='Header_ChatApp'>
                            <a href='cac'>
                              {
                                guestImg &&
                                <>
                                  <div className='header_online'>
                                    <div className='avatar_dot'>
                                      <img className='avatarImage' alt='Avatar' src={`${BlobtoBase64(guestImg.img)}`}></img>
                                      <span className={`dot ${ListusersOnline.includes(guestImg.userID) ? "activeOnline" : {}}`}>  </span>
                                    </div>
                                    <div className='header_text'>
                                      <div style={{ fontSize: "1.5rem", color: "black", fontWeight: "bold" }}> {guestImg.Name}</div>
                                      {
                                        <>{ListusersOnline.includes(guestImg.userID) ? <>Đang hoạt động</> : <>Không hoạt động</>}</>
                                      }
                                    </div>
                                  </div>
                                </>
                              }
                            </a>
                          </div>
                          <div className='Body_Chatpp' >
                            <div className='ChatApp' >
                              <div className='ChatApp_text' ref={messageScroll}>
                                {messages.map((message, index) => (
                                  <div className='message_content' key={index}>
                                    <Message key={index} message={message}
                                      my={auth.userID} own={message.sender_id === auth.userID} student={guestImg} Online={onlineUser} seen={seenMess} listSeen={userSeenAt} ></Message>
                                  </div>
                                ))}
                              </div>
                              <div className='inputValue'>
                                <div className='feature_field'>
                                  <input
                                    type='file'></input>
                                </div>
                                <div className='text_field'>
                                  <input
                                    onKeyPress={handleKeyPress}
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

                          </div>
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
