
import Conversation from "../conversation/conversations"
import { getConversation } from "../conversation/getConversation";
import { useEffect,useState ,useRef} from "react";
import { IsLoading } from "../Loading";
import io from 'socket.io-client';
import WindowChat from "../message/windowchat/windowchat";
import useAuth from "../../hook/useAuth";
import { useSocket } from "../../context/socketContext";
export default function MessageMainLayout(){
    const [onlineUser, setOnlineUser] = useState()
    const [clicked,setClicked]=useState([0])
    const [counter,setCoutClicked]=useState([]);
    const socket = useSocket(); 
    const {auth}=useAuth();
    const [conversations,setConversation]=useState();
    
  
      
      const onClickConser = (c) => {
        setCoutClicked((prev) => {
          const newClicked = [...prev];
          const existingIndex = newClicked.findIndex((obj) => obj.id === c.id);
      
          if (existingIndex !== -1) {
            newClicked.splice(existingIndex, 1);
          }
      
          newClicked.unshift(c);
          return newClicked;
        });
      };
    useEffect(()=>{"Mount MessageMainLayout"},[])
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
        async function AsyncGetCon()
        {
          const convers= await getConversation(auth);
          setConversation(convers)
        }
        AsyncGetCon()
      }, [])
      return (
        <div className="25main_layout">
          {conversations ? (
            <>
            {
            conversations.map((c, i) => (
              <div key={i} className='converrsation_chat' onClick={()=>{onClickConser(c)}}>
                <Conversation  count={counter} conversation={c} notSeen_field={true} Online ={onlineUser}></Conversation>
              </div>

            ))}
            <div className="windowchat_container">

           {counter && counter.map((e, i) => (
             <WindowChat socket={socket} key={i} count={e} index={i} setCoutClicked={setCoutClicked}  ListusersOnline={onlineUser}/>
             ))}
             </div>
            </>

          ) : (
            <IsLoading/>
          )}
        </div>
      );
      
}