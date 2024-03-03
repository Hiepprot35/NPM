import { useEffect, useState, useRef } from "react";
import { IsLoading } from "../Loading";
import "./conversation.css";
import useAuth from "../../hook/useAuth";
import BlobtoBase64 from "../../function/BlobtoBase64";
import * as timeUse from "../../function/getTime";
import WindowChat from "../message/windowchat";
export default function Conversation({ conversation, Arrivalmess, mess, Online,notSeen_field,count }) {
    const [user, setUser] = useState();
    const { auth } = useAuth()
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState()
    const [NewestMess, setNewestMesst] = useState()
    // useEffect(()=>{console.log(conversation)},[])
    const data = [conversation.user1, conversation.user2];
    const setOnlineUser = data.find((m) => m !== auth.userID)
    const ListusersOnline = Online && Online.map(item => item.userId) || [];
    useEffect(() => {
        const getUsername = () => {
                const getUser = async () => {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/username?id=${conversation.user1 === auth.userID ? conversation.user2 : conversation.user1}`);
                        const data2 = await res.json();
                        setUsername(data2)
                    } catch (err) {
                        console.log("Không có giá trí");
                    }
                };
                getUser()
        }
        getUsername()
    }, [conversation, auth.userID])
    useEffect(() => {
        const getMess = () => {
            let friendId = conversation.user1;
            if (conversation.user1 != conversation.user2) {
                friendId = data.find((m) => m !== auth.userID);
            }
            const resApi = async () => {
                try {
                    const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/message/newest/${conversation.id}`);
                    const data2 = await res.json();
                    setNewestMesst(data2)
                } catch (err) {
                    console.log("Không có giá trí");
                }
            };
            resApi()
        }
        getMess()
    }, [conversation, auth.userID, Arrivalmess, mess])
    useEffect(() => {
        const studentInfo = async () => {
            if (username) {
                const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${username[0]?.username} `;
                try {
                    const studentApi = await fetch(URL2);
                    const student = await studentApi.json();
                    setUser(student)
                    setIsLoading(false)
                } catch (error) {
                    console.error(error);
                }

            }
        };

        studentInfo();
    }, [username]);
        const [ShowWindow,setShowWindow]=useState(false)
    const clickShowWindow=()=>
    {
        // setShowWindow((pre)=>[...pre,{
        //     name:setOnlineUser
        // }])
        setShowWindow(true)
    }
    useEffect(()=>{console.log(ShowWindow)},[ShowWindow])
    return (
        <>
            {isLoading ? <IsLoading /> :
                <>
                    <div className="conversation" onClick={clickShowWindow}>
                        <div className="Avatar_status">
                            <img src={user.img ?`${user?.img}`:""} className={`avatarImage`} alt="uer avatar"></img>
                            <span className={`dot ${ListusersOnline.includes(setOnlineUser) ? "activeOnline" : {}}`}> </span>
                        </div>
                        <div className="text_conversation">

                            <span className="conversationName">{user.Name}</span>
                           {notSeen_field ?<></>: <div className="messConversation">
                                {
                                    NewestMess &&
                                    <>
                                        {
                                            <> {
                                                NewestMess.content &&
                                                <div>
                                                    {NewestMess?.sender_id === auth.userID ?
                                                         <span>
                                                         {

                                                             NewestMess?.content.startsWith("https://res.cloudinary.com")?
                                                             "Bạn đã gửi một ảnh":NewestMess?.content
                                                         }
                                                     </span>
                                                        :
                                                        <span>
                                                            {

                                                                NewestMess?.content.startsWith("https://res.cloudinary.com")?
                                                                "Đã gửi một ảnh":NewestMess?.content
                                                            }
                                                        </span>
                                                    }
                                                    
                                                    <span>{timeUse.countTime(NewestMess.created_at)}</span>
                                                </div>
                                            }
                                            </>
                                        }
                                    </>
                                }
                                {
                                   conversation.sender_id === auth.userID && conversation.isSeen === 1 &&
                                    <div className="Seen_field">
                                        <img style={{ width: "1rem", height: "1rem" }} src={`${(user.img)}`} className={`avatarImage`} alt="uer avatar"></img>
                                    </div>
                                }
                            </div>
                                }
                        </div>
                            
                    </div>

                </>}
        </>
    );
}
