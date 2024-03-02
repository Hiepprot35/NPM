import { useState, useEffect, useRef } from "react";
import BlobtoBase64 from "../../function/BlobtoBase64";
import './message.css';
import * as timeUse from "../../function/getTime";
import { IsLoading } from "../Loading";
export default function Message({ message, own, student, Online, listSeen }) {
    const time = useRef(null)
    const seen_text = useRef(null)
    const messageRef = useRef(null)
    const [listAnh,setListAnh]=useState()
   useEffect(()=>{
    if(message.isFile)
    {
        const data=message.content.split("TuanHiep");
        setListAnh(data)
    }
   },[])
    return (
        <>
            <div className="containerMessage" ref={messageRef}>

                {
                    message ?
                        <div className={own ? "message own" : "message"}>
                            { }
                            <div className="Mess_seen_container">
                                <div className="messageTop">
                                    {
                                        !own &&
                                        student?.img && message.content !== null &&
                                        <>
                                            <div className='avatar_dot'>

                                                <img
                                                    className="avatarImage"

                                                    src={student.img ?`${(student?.img)}`:""} alt="sender" />
                                      <span className={`dot ${Online&& Online.some((e)=>e.userId===student.userID) ? "activeOnline" : {}}`}>  </span>

                                            </div>
                                        </>
                                    }
                                    {
                                        message.content != null ?
                                            <div className="Mess_seen_text">
                                                {
                                                    message.isFile?
                                                    <>
                                                    {

                                                     listAnh&& listAnh.map((e)=>(

                                                         <img src={e} style={{width:"10%",height:"10%",borderRadius:"1rem",margin:"0.3rem"}}></img>
                                                     ))
                                                    }   
                                                        </>
                                                    
                                                    :
                                                <p className="messageText">{message.content}</p>
                                                }
                                                <p className="messageBottom" ref={time}>{timeUse.getTime(message.created_at)}</p>

                                            </div>
                                            : <></>

                                    }
                                </div>
                                {
                                    student && message?.id === listSeen?.id && listSeen &&

                                        <div className="Seen_field">
                                            <img
                                                className="avatarImage"
                                                style={{ width: "20px", height: "20px" }}
                                                src={student.img ?`${(student?.img)}`:""} alt="sender" />
                                            <p ref={seen_text} style={{ fontSize: "0.9rem", color: "gray" }} >
                                                Seen at {timeUse.getTime(listSeen?.Seen_at)}
                                            </p>


                                        </div>
                                        
                                }
                            </div>

                        </div> : <IsLoading />
                }
            </div >
        </>
    );
}
