import { useRef,useEffect, useState } from "react";
import UseToken from "../../hook/useToken";
import { useRefresh } from "../../hook/useRefresh";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../Layout/header/header";
import { IsLoading } from "../Loading";
import useAuth from "../../hook/useAuth";
import io from 'socket.io-client';
import WindowChat from "../message/windowchat";
import MessageMainLayout from "../message/messageMainLayout";
export default function Home(props) {
    const navigate = useNavigate();
   
    const { AccessToken, setAccessToken } = UseToken();
    const { auth } = useAuth();
    const [listMess, setlistMess] = useState()
    const [listMSSV, setlistMSSV] = useState()
    const [isMounted, setIsMounted] = useState(true);

    const [isLoading, setIsLoading] = useState(true)
    const refreshAccessToken = useRefresh()
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [classInfo, setClass] = useState([]);
    const[click,setClick]=useState()
    const DataPerPage = 2;
    const startIndex = (currentPage - 1) * DataPerPage;
    const endIndex = startIndex + DataPerPage
    useEffect(() => {
        fetch(`${process.env.REACT_APP_DB_HOST}/api/getAllClass`)
            .then(res => res.json())
            .then(Classes => {
                setClass(Classes);
            });
    }, [AccessToken]);

    const getClassName = (classID) => {
        for (let i = 0; i < classInfo.length; i++) {
            if (classID === classInfo[i].CLASSID) {
                return (
                    <p>
                     Lớp:   {classInfo[i].CLASSNAME}
                    </p>
                );
            }
        }
        return (
            <p>Class Not Found</p>
        );
    };
    useEffect(() => {
        const senApi = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/findusersend`,{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        "id":auth.userID,         
                    })
                });
                const data = await res.json()
                setlistMSSV(data)
            }
            catch (err) {
                console.log(err);
            }
        }
        senApi()

    }, [])
    const LinkToMess = async (MSSV) => {
        const userID = await getUserID(MSSV)

        navigate(`/message/${userID[0].UserID}`)
    }
    const handleAddChat = async (MSSV) => {
        console.log(MSSV)
        const userID = await getUserID(MSSV)
        console.log(userID)
        try {

            const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user1": auth.userID,
                    "user2": userID[0].UserID
                })
            })
            const data = await res.json()
            console.log(data)
        } catch (error) {
            console.log(error)

        }
    }
    // Function để fetch danh sách sinh viên
    const location = useLocation();
    const URL = `${process.env.REACT_APP_DB_HOST}/api/getallstudent`;
    let isCancel = false
    const getData = async () => {

        try {
            const response = await fetch(URL, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${AccessToken}`
                }
            });
            if (response.ok) {
                const data = await response.json()
                setTimeout(()=>{
                    setIsLoading(false)
                    setPosts(data)
                },2000)
               
            }
        } catch (error) {
            console.log(error)
            // setIsLoading(true)

        }
    }
    const getUserID = async (MSSV) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/userID/${MSSV}`)
            const userID = await res.json()
            return userID

        } catch (error) {
            // setIsLoading(true)

            console.log(error)
        }
    }
    async function fetchData() {
        try {
            if(isMounted)
            {

                const refreshedData = await refreshAccessToken();
                refreshedData.AccessToken ? setAccessToken(refreshedData.AccessToken) : setIsLoading(true)
            }
        } catch (error) {
            // setIsLoading(true)
            console.log(error)
        }
    }
    useEffect(() => {
       

        fetchData();
        return()=>{
            setIsMounted(false)
        }
    }, []);
    useEffect(() => {
        getData()
    }, [AccessToken])
    
    document.title = "Home"
    const currentData = posts.slice(startIndex, endIndex)
    const totalPages = Math.ceil(posts.length / DataPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const myRef = useRef(null);

    return (

        <>
            <Header hash={'/home'} />
            <div className="container_main height_vh100" >
                {
                    isLoading ? <IsLoading /> :
                    <div style={{display:"flex"}}  >
                        <section className="articles"  ref={myRef}>
                            {

                                    posts && posts.map((element, index) => {
                                    return (

                                        <article key={index}>
                                            <div className="article-wrapper">
                                                <a href={`/profile/${element.MSSV}`}>

                                                <figure>
                                                    
                                                    <img src={element.img} alt="" />
                                                </figure>
                                                </a>
                                                <div className="article-body">
                                                    <h2>{element.Name}</h2>
                                                    
                                                    {
                                                        getClassName(element.Class)
                                                    }

                                                        <p><i>"{element.introduce}"</i></p>
                                                    
                                                    { listMSSV && listMSSV.some(item=>item.username===element.MSSV)?

                                                   <span onClick={() => LinkToMess(element.MSSV)} className="read-more">
                                                        Message <span className="sr-only">about this is some title</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>:
                                                <button className="play_in_cheo" onClick={() => { handleAddChat(element.MSSV) }}> add to message</button>
                                                    }
                                                </div>

                                            </div>
                                        </article>
                                    )
                                })
                            }
                        </section>
                        <div style={{width:"20%",}} >
                            <MessageMainLayout />
                        </div>
                        </div>

                }
                <div style={{display:"flex",justifyContent:"center"}}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button key={index} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                </div>
                {/* <ChatApp user={auth} room={room} /> */}
            </div>

        </>
    )
}
