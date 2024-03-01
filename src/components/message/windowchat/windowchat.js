import './windowchat.css'
import { useEffect, useRef, useState } from 'react'
import useAuth from '../../../hook/useAuth'
import {useSocket} from '../../../context/socketContext';
import VideoCall from './videoCall'
import Message from '../Message'
export default function WindowChat(props)
{
    const {auth}=useAuth()
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket=useSocket()
    const [inputMess,setInputmess]=useState();
    const [userName,setUsername]=useState();
    const userConver=props.count.user1===auth.userID?props.count.user2:props.count.user1;
    useEffect(()=>{
        console.log("Ds online :",props.ListusersOnline.some((e)=>e.userId===userConver))
        console.log("Con",userConver)
    },[])
    const [userInfor,setUserInfo]=useState();
    const [messages,setMessages]=useState();
        useEffect(() => {
        const studentInfo = async (data) => {
            if (data) {
                const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${data}`;
                try {
                    const studentApi = await fetch(URL2);
                    const student = await studentApi.json();
                    setUserInfo(student);
                    // setGuestImg(student)
                } catch (error) {
                    console.error(error);
                }
            }
        }
    
        if (userName) {
            studentInfo(userName.username);
        }
    }, [props.count,userName]);
    useEffect(() => {
        if (arrivalMessage) {
          const data = [props.count?.user1, props.count?.user2];
          data.includes(arrivalMessage.sender_id) &&
            setMessages((prev) => [...prev, arrivalMessage]);
        }
      }, [arrivalMessage]);
    useEffect(() => {
        socket.on("getMessage", (data) => {
          setArrivalMessage({
            sender_id: data.sender_id,
            content: data.content,
            created_at: Date.now(),
          });
        });
        // socket.on("getUser")
        return () => {
            socket.disconnect();
        }
      }, [socket])
      useEffect(()=>{console.log(arrivalMessage)},[arrivalMessage])
    useEffect(() => {
                const getUser = async () => {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/username?id=${userConver}`);
                        const data2 = await res.json();
                        setUsername(data2[0])
                    } catch (err) {
                        console.log("Không có giá trí");
                    }
                };
                 getUser()
        
    }, [props.count])
    const windowchat=useRef(null)
    useEffect(()=>{
        if(windowchat.current )
        {
            if(props.index<3)
            {

                // windowchat.current.style.width = `${20 * (props.index)}%`;
            }
            else{
                windowchat.current.style.display = "none";

            }
            
        }
    },[props.count.id])
    //   const ListusersOnline = onlineUser && onlineUser.map(item => item.userId) || [];
    useEffect(() => {
        const getMessages = async () => {
          if (props.count?.id) {
    
    
            try {
              const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message/${props.count?.id}`,
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
      }, [props.count?.id]);
    const closeWindow=(c)=>{
        props.setCoutClicked((pre)=>{
            const data=[...pre]
            const existingIndex = data.findIndex((obj) => obj.id === c);

            data.splice(existingIndex,1)
            return data;
        })
    }
   const [call,setCall]=useState(false)
   const [imgView,setImgView]=useState();
   const [fileImg,setFileImg]=useState()
    const image_message=useRef(null);
    const pick_imageMess=(e)=>{
        const imgMessFile=e.target.files[0];
        console.log(imgMessFile)
        setFileImg(imgMessFile)
        const imgObject=URL.createObjectURL(imgMessFile);
        setImgView(imgObject)
    }
    const handleSubmit= async ()=>{
        try {
            const imgData=new FormData()
            imgData.append("sender_id",auth.userID)
            imgData.append("conversation_id",props.count.id)
            fileImg ? imgData.append("content",fileImg) : imgData.append("content",inputMess)
            imgData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
              });
            const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
              method: 'POST',
           
              body: imgData,
            });
            const MessageDataRes = await res.json()
            // setMessages([...messages, MessageDataRes]);
            // inputMess.current.value = "";
            // inputMess.current.focus()
          } catch (err) {
            console.log(err);
          }
        }
    const inputChange=(e)=>{
    setInputmess(e.target.value)
    }
    return(
        <>
        
        <div className='windowchat' ref={windowchat}>
            <div className='top_windowchat'>
                <div className='header_windowchat'>
                              {
                               props.count && userInfor &&
                                <>
                                  <div className='header_online'>
                                    <div className='avatar_dot'>
                                      <img className='avatarImage' alt='Avatar' src={userInfor.img ? `${(userInfor.img)}`:""}></img>
                                      <span className={`dot ${props.ListusersOnline.some((e)=>e.userId===userConver) ? "activeOnline" : {}}`}>  </span>
                                    </div>
                                    <div className='header_text'>
                                      <div style={{ fontSize: "1.5rem", color: "black", fontWeight: "bold" }}> {userInfor.Name}</div>
                                      {
                                        <span>{props.ListusersOnline.some((e)=>e.userId===userConver) ? <>Đang hoạt động</> : <>Không hoạt động</>}</span>
                                      }
                                    </div>
                                  </div>
                              
                                </>
                              }
                          </div>
                          <div className='button_windowchat'>
                                        <div className='close_windowchat'>
                                            <button onClick={(e)=>{closeWindow(props.count.id)}}>X</button>
                                        </div>
                                        <div className='hide_windowchat'>
                                            <button>-</button>
                                        </div>
                                        <div className='camera_window'>
                                            <button onClick={()=>{setCall(!call)}}>C</button>
                                        </div>
                                </div>
            </div>
            <div className='Body_Chatpp'>

                              <div className='main_windowchat'>
                              {messages && messages.map((message, index) => (
                                  <div className='message_content' key={index}>
                                    <Message key={index} message={message}
                                      my={auth.userID} own={message.sender_id === auth.userID} student={userInfor}  ></Message>
                                  </div>
                                ))}
                              </div>
                              <div className='inputValue windowchat_feature'>
                                <div className='feature_left'>
                                    <ul>
                                        <li>
                                            <input onChange={(e)=>{pick_imageMess(e)}} type='file' ref={image_message} hidden></input>
                                        <img onClick={()=>{image_message.current.click()}} src='./images/image.svg' style={{width:"1.5rem",height:"1.5rem"}}></img>
                                        </li>

                                        <li >                                            
                                            <img src='./images/sticker.svg' style={{width:"1.5rem",height:"1.5rem"}}></img></li>
                                        <li>
                                            <img src='./images/gif.png' style={{width:"1.5rem",height:"1.5rem"}}></img>
                                        </li>
                                    </ul>
                                </div>
                                <div className=' windowchat_input' >
                                {
                                         imgView && <img src={imgView} style={{width:"50px",height:"50px"}}></img>
                                    }
                                    <input type='
                                    text' id='send_window_input' onChange={inputChange}>
                                    </input>
                                  
                                </div>
                                <div>
                                <div>
                                    <div onClick={handleSubmit}>
                                    <img src='./images/send-2.svg' style={{width:"1.5rem",height:"1.5rem"}}></img>
                                    </div>
                                </div>
                                </div>
                              </div>
                              </div>

        </div>
      {/* <VideoCall></VideoCall> */}
      </>
    )
}