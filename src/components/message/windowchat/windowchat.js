import './windowchat.css'
import { useEffect, useRef, useState } from 'react'
import useAuth from '../../../hook/useAuth'
import {useSocket} from '../../../context/socketContext';
import VideoCall from './videoCall'
import Message from '../Message'
import EmojiPicker from 'emoji-picker-react';

export default function WindowChat(props)
{
    const {auth}=useAuth()
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket=useSocket()
    const [inputMess,setInputmess]=useState();
    const [userName,setUsername]=useState();
    const userConver=props.count.user1===auth.userID?props.count.user2:props.count.user1;
    const multiFile=useRef(null)
    const windowchat_input=useRef(null)
    const main_windowchat=useRef(null)
    const inputValue=useRef(null)
    const [emoji,setEmoji]=useState([])
    const [openEmojiPicker,setOpenEmojiPicker]=useState(false)
    const [call,setCall]=useState(false)
    const [imgView,setImgView]=useState([]);
    const [fileImg,setFileImg]=useState([])
     const image_message=useRef(null);
     const windowchat=useRef(null)
    const [userInfor,setUserInfo]=useState();
    const [messages,setMessages]=useState();
    async function studentInfo(data) {
      if (data) {
          const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${data}`;
          try {
              const studentApi = await fetch(URL2);
              const student = await studentApi.json();
              setUserInfo(student);
          } catch (error) {
              console.error(error);
          }
      }
  }
  async function getMessages () {
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
  function closeWindow(c){
    props.setCoutClicked((pre)=>{
        const data=[...pre]
        const existingIndex = data.findIndex((obj) => obj.id === c);
        data.splice(existingIndex,1)
        return data;
    })
}

function pick_imageMess (e) {
  const imgMessFile = e.target.files;
  for (let i = 0; i < imgMessFile.length; i++) {
    setFileImg((pre) => (Array.isArray(pre) ? [...pre, imgMessFile[i]] : [imgMessFile[i]]));
    setImgView((pre) => (Array.isArray(pre) ? [...pre, URL.createObjectURL(imgMessFile[i])] : [URL.createObjectURL(imgMessFile[i])]));
  }
};
function onClickEmoji(e){
  setEmoji((pre)=>pre+e.emoji)
  if(inputValue.current)
  {
    inputValue.current.value=emoji
    setFileImg((pre)=>[...pre,e.imageUrl+"TuanHiep"])
  }
}
async function handleSubmit(){
    try {
        const imgData=new FormData()
        imgData.append("sender_id",auth.userID);
        imgData.append("conversation_id",props.count.id);
        if(fileImg.length>0) 
        {
          for(const file of fileImg)
          {
            imgData.append("content",file) ;     
          }
          imgData.append("isFile",1);
        }
        else{
          imgData.append("isFile",0);
          imgData.append("content",inputMess);
        }
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message`, {
          method: 'POST',
          body: imgData,
        });
        const MessageDataRes = await res.json()
        console.log(MessageDataRes)
        if(socket)
        {
      socket.emit("sendMessage", {
          sender_id: MessageDataRes.sender_id,
          receiverId:userConver,
          content:MessageDataRes.content,
          isFile:MessageDataRes.isFile
        });
      } else{
        console.log("không có socket")
      }
        setMessages([...messages, MessageDataRes]);
        setEmtyImg()
        inputValue.current.value = "";
        inputValue.current.focus()
      } catch (err) {
        console.log(err);
      }
    }
function setEmtyImg(){
  setFileImg([]);
  setImgView([]);
}

function inputChange(e){
setInputmess(e.target.value)}

    useEffect(() => {
       
    
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
        let isMounted = true;
    
        if (socket && isMounted) {
            socket.on("getMessage", (data) => {
                setArrivalMessage({
                    sender_id: data.sender_id,
                    content: data.content,
                    isFile:parseInt(data.isFile),
                    created_at: Date.now(),
                });
            });
        }
    
        return () => {
            isMounted = false;
            if (socket && isMounted) {
                socket.disconnect();
            }
        };
    }, [socket]);
  
    useEffect(() => {
      if (arrivalMessage) {
         document.title ="Đa gửi tin"
      }
  }, [arrivalMessage]);
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
    useEffect(()=>{
        if(windowchat.current )
        {
            if(props.index>3){
                windowchat.current.style.display = "none";}
        }
    },[props.count.id])
    useEffect(() => {
        getMessages();
      }, [props.count?.id]);

    
    useEffect(() => {
      if (main_windowchat.current) {
        const container = main_windowchat.current;
        container.scrollTop = container.scrollHeight;
      }
    }, [messages]);
   
   
    useEffect(()=>{
      if(windowchat_input.current && main_windowchat.current && imgView.length>0)
      {
        main_windowchat.current.style.height="40vh";
        windowchat_input.current.style.width="80% !important";
      }
      if(imgView.length===0)
      {
        main_windowchat.current.style.height="50vh";
      }
    },[imgView])
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
                                      <span className={`dot ${props.ListusersOnline && props.ListusersOnline.some((e)=>e.userId===userConver) ? "activeOnline" : {}}`}>  </span>
                                    </div>
                                    <div className='header_text'>
                                      <div style={{ fontSize: "1.5rem", color: "black", fontWeight: "bold" }}> {userInfor.Name}</div>
                                      {
                                        <span>{props.ListusersOnline &&  props.ListusersOnline.some((e)=>e.userId===userConver) ? <>Đang hoạt động</> : <>Không hoạt động</>}</span>
                                      }
                                    </div>
                                  </div>
                              
                                </>
                              }
                          </div>
                          <div className='button_windowchat'>
                                            <div onClick={(e)=>{closeWindow(props.count.id)}}>
                                              <img src='./images/close.svg'></img>
                                            </div>
                                            <div>
                                            <img src='./images/hidden.svg'></img>

                                            </div>
                                            <div onClick={()=>{setCall(!call)}}>
                                            <img src='./images/camera.svg'></img>

                                              </div>
                                            <div onClick={()=>{setCall(!call)}}>
                                            <img src='./images/phone.svg'></img>

                                              </div>
                                </div>
            </div>
            <div className='Body_Chatpp'>
                              <div className='main_windowchat' ref={main_windowchat}>
                              {messages && messages.map((message, index) => (
                                  <div className='message_content' key={index}>
                                    <Message key={index} message={message}
                                      my={auth.userID} own={message.sender_id === auth.userID} student={userInfor} Online={props.ListusersOnline ? props.ListusersOnline:auth.userId}  ></Message>
                                  </div>
                                ))}
                              </div>
                              <div className='inputValue windowchat_feature'>
                                <div className='feature_left'>
                                    { imgView.length>0 ?
                                    <>
                                    <div onClick={setEmtyImg}>
                                      <img src='./images/arrow-left.svg' style={{width:"1.5rem",height:"1.5rem"}}>
                                    </img></div>
                                    </>
                                    :
                                    <ul>
                                        <li>
                                            <input onChange={(e)=>{pick_imageMess(e)}}  type='file' ref={image_message} multiple hidden></input>
                                        <img onClick={()=>{image_message.current.click()}} src='./images/image.svg' style={{width:"1.5rem",height:"1.5rem"}}></img>
                                        </li>

                                        <li >                                            
                                            <img src='./images/sticker.svg' style={{width:"1.5rem",height:"1.5rem"}}></img></li>
                                        <li>
                                            <img src='./images/emoji.svg' onClick={(e)=>{setOpenEmojiPicker(!openEmojiPicker)}} style={{width:"1.5rem",height:"1.5rem"}}></img>
                                          
                                        </li>
                                    </ul>}
                                </div>
                               
                                <div className=' windowchat_input' ref={windowchat_input} >
                                {
                                         imgView.length>0 &&
                                         <div className='multiFile_layout'>
                                      <input type='file' hidden ref={multiFile} multiFile></input>
                                       <img onClick={()=>{multiFile.current.click()}} src='./images/image.svg' style={{width:"1.5rem",height:"1.5rem"}}></img>
                                           {
                                          imgView.map((e)=>
                                            (

                                              <>
                                           <img src={e } style={{width:"50px",height:"50px",margin:"1rem",borderRadius:"0.6rem"}}></img>
                                           
                                           </>
                                              ))
                                           }
                                      </div>

                                    
                                    }
                                    <input type='
                                    text' id='send_window_input' onChange={inputChange} placeholder='Aa' ref={inputValue} >
                                    </input>
                                  
                                </div>
                                <div>
                                <div>
                                    <div onClick={handleSubmit} style={{cursor:"pointer"}} onInvalid={inputValue ? true : false}>
                                    <img src='./images/send-2.svg' style={{width:"1.5rem",height:"1.5rem"}}></img>
                                    </div>
                                </div>
                                </div>
                              </div>
                              </div>
                              <div className='emojipick'>
                                <EmojiPicker width={350}
                                height={450}
                                open={openEmojiPicker}
                                onEmojiClick={(e,i)=>{onClickEmoji(e)}}
                                emojiStyle="facebook"
                                />
                                </div>

        </div>
      {/* <VideoCall></VideoCall> */}
      </>
    )
}