import './windowchat.css'
import { useEffect, useRef, useState } from 'react'
import useAuth from '../../hook/useAuth'
import {useSocket} from '../../context/socketContext';
import VideoCall from './windowchat/videoCall'
import Message from './Message'
import EmojiPicker from 'emoji-picker-react';
import { getUserinfobyID,getStudentInfoByMSSV } from '../../function/getApi';
const ClientURL = process.env.REACT_APP_CLIENT_URL;

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
    useEffect(()=>{console.log(props.ListusersOnline)},[props.ListusersOnline])
  
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
    setFileImg((pre)=>[...pre,e.imageUrl])
  
}
useEffect(()=>{
  setInputmess(emoji)
},[emoji])
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
        setInputmess("") ;
        inputValue.current.focus()
        props.cc(MessageDataRes)
       }catch (err) {
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
      async function fetchData(){

        if (userName) {
          const data=await getStudentInfoByMSSV(userName.username);
          setUserInfo(data);
        }
      }
      fetchData()
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
      const updateTitle = async () => {
        if (arrivalMessage) {
          const username = await getUserinfobyID(parseInt(arrivalMessage.sender_id));
          const nameSV=await getStudentInfoByMSSV(username.username)
          document.title = `${nameSV.Name} gửi tin nhắn`;
        }
      };
    
      updateTitle();
    }, [arrivalMessage]);
    
  
useEffect(() => {
  const getUsername=async()=>{
    const data=await getUserinfobyID(userConver)
    setUsername(data)
  }
   getUsername()             
        
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
   
    const checkMess = (i, array, authID, user, sender) => {
      let value;
    
      if (sender === authID) {
        value = user;
      }
    
      if (sender === user) {
        value = authID;
      }
    
      const l = array.length;
    
      if (i === 0 || i === l - 1) {
        return 0;
      }
    
      if (i > 0 && i < l - 1) {
        if (array[i - 1].sender_id === authID && array[i + 1].sender_id === authID) {
          return 0;
        }
    
        if (array[i - 1].sender_id !== value && array[i + 1].sender_id === value) {
          return 3;
        }
    
        if (array[i - 1].sender_id === value && array[i + 1].sender_id !== value) {
          return 1;
        }
    
        if (array[i - 1].sender_id !== value && array[i + 1].sender_id !== value) {
          return 2;
        }
      }
    
      return undefined;
    };
    

    
    const [rowCount,setRowcount]=useState(1)
    useEffect(()=>{
      inputMess && setRowcount(Math.ceil(inputMess.length / 20));
      !inputMess && setRowcount(1)
    },[inputMess])
    
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
                                      <div style={{ fontSize: "1rem", color: "black", fontWeight: "bold" }}> {userInfor.Name}</div>
                                      {
                                        <span>{props.ListusersOnline &&  props.ListusersOnline.some((e)=>e.userId===userConver) ? <>Online</> : <></>}</span>
                                      }
                                    </div>
                                  </div>
                              
                                </>
                              }
                          </div>
                          <div className='button_windowchat'>
                                            <div className='features_hover' onClick={(e)=>{closeWindow(props.count.id)}}>
                                              <img src={`${ClientURL}/images/close.svg`}></img>
                                            </div>
                                            <div  className='features_hover'>
                                            <img src={`${ClientURL}/images/hidden.svg`}></img>

                                            </div >
                                            <div  className='features_hover' onClick={()=>{setCall(!call)}}>
                                            <img src={`${ClientURL}/images/camera.svg`}></img>

                                              </div>
                                            <div  className='features_hover' onClick={()=>{setCall(!call)}}>
                                            <img src={`${ClientURL}/images/phone.svg`}></img>
                                              </div>
                                </div>
            </div>
            <div className='Body_Chatpp'>
                              <div className='main_windowchat' ref={main_windowchat}>
                              {messages && messages.map((message, index) => (
                                  <div className='message_content' key={index}>
                                    <Message key={index} message={message}
                                      my={auth.userID} 
                                      mid={checkMess(index,messages,auth.userID,userConver,message.sender_id)===2}
                                      alone={checkMess(index,messages,auth.userID,userConver,message.sender_id)===0}
                                      first={checkMess(index,messages,auth.userID,userConver,message.sender_id)===1} 
                                      end={checkMess(index,messages,auth.userID,userConver,message.sender_id)===3}
                                      own={message.sender_id === auth.userID} student={userInfor} userID={userConver} Online={props.ListusersOnline}  ></Message>
                                  </div>
                                ))}
                              </div>
                              <div className='inputValue windowchat_feature'>
                                <div className='feature_left'>
                                    { imgView.length>0 ?
                                    <>
                                    <div onClick={setEmtyImg} className='features_hover'>
                                      <img  src={`${ClientURL}/images/arrow-left.svg`} style={{width:"1.5rem",height:"1.5rem"}}>
                                    </img></div>
                                    </>
                                    :
                                    <ul>
                                        <li  className='features_hover'>
                                            <input onChange={(e)=>{pick_imageMess(e)}}  type='file' ref={image_message} multiple hidden></input>
                                        <img onClick={()=>{image_message.current.click()}} src={`${ClientURL}/images/image.svg`}></img>
                                        </li>

                                        <li  className='features_hover' >                                            
                                            <img src={`${ClientURL}/images/sticker.svg`}></img></li>
                                        <li  className='features_hover'>
                                            <img src={`${ClientURL}/images/emoji.svg`} onClick={(e)=>{setOpenEmojiPicker(!openEmojiPicker)}}></img>
                                          
                                        </li>
                                    </ul>}
                                </div>
                               
                                <div className=' windowchat_input ' ref={windowchat_input} >
                                {
                                         imgView.length>0 &&
                                         <div className='multiFile_layout '>
                                      <input type='file' hidden ref={multiFile} multiFile></input>
                                      <div className='features_hover'>

                                       <img  onClick={()=>{multiFile.current.click()}} src={`${process.env.REACT_APP_CLIENT_URL}/images/image.svg`} ></img>
                                      </div>
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
                                  <textarea
                                  cols="20"
                                  rows={rowCount||1}
                                  style={{ resize: 'none' }}
                                  id='send_window_input'
                                  onChange={inputChange}
                                  placeholder='Aa'
                                  value={inputMess}
                                  ref={inputValue}
                                />
                                  
                                </div>
                                <div>
                                <div>
                                <div className='features_hover' onClick={() => inputMess.length > 0 && handleSubmit()} style={{ cursor: "pointer" }}>
                                    <img src={`${ClientURL}/images/send-2.svg`}style={{width:"1.5rem",height:"1.5rem"}}></img>
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