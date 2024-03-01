import React, { useEffect, useRef, useState, memo } from 'react';
import { Buffer } from 'buffer';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import useAuth from '../../../hook/useAuth';
import { LogOut } from "../../logout";
import BlobtoBase64 from '../../../function/BlobtoBase64';
import './header.css'
import { motion } from "framer-motion";
import { IsLoading } from '../../Loading';
import { header_Student } from '../../../lib/data';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

function Header(props) {
    const [weather, setWeather] = useState({
        city: "",
        weather: "clear",
        temp: "",
        country: "",
    });
    const Menu_profile_header = useRef()
    const [city, setCity] = useState("hanoi");
    const { auth } = useAuth();
    const [chooseHeader, setChooseHeader] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState()
    const apiKey = "e9f7e8aac0662b6cfe1bb2d11bbb7042";
    // const bufferString = user2 ? Buffer.from(user2.img).toString('base64') : "11111";
    const cityInputRef = useRef(null); // Tạo một tham chiếu useRef
    const host = process.env.REACT_APP_DB_HOST;

    const handleSumbit = () => {
        setCity(cityInputRef.current.value);
    };
    const [avt,setAvt]=useState()
    useEffect(() => {
        let isMounted = true;
        const tempApi = async (city) => {
            const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            try {
                const temRes = await fetch(URL);
                if (temRes.ok && isMounted) {
                    const tem = await temRes.json();
                    setWeather({
                        city: tem.name,
                        weather: tem.weather[0].main,
                        temp: tem.main.temp,
                        country: tem.sys.country,
                    });
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
        tempApi(city);
        return () => {
            isMounted = false;
        };
    }, [city]);
    useEffect(() => {
        let isAlivew = true;

        const studentInfo = async () => {
            const URL = `${host}/api/getStudentbyID/${auth.username}`;
            try {
                const studentApi = await fetch(URL);

                const student = await studentApi.json();

                setUser(student)
                setIsLoading(false)

            } catch (error) {
                console.error(error);
                setIsLoading(false)

            }
        };
        studentInfo();
        return () => {
            isAlivew = false
        }
    }, []);
    useEffect(() => {
        setAvt(auth.avtUrl)
    }, [])
    return (
        <>
            <div className="header_user">
                <div className='header_container'>
                    <div>
                        <ul className='list'>
                        <li>
                            <a href='/'>

                            <Player
                            autoplay
                            speed={1}	
                            src="https://lottie.host/c775397d-d0b4-434c-b084-489acbe2d17b/CpkFsQb8HX.json"
                            style={{ height: '60px', width: '60px' }}
                            >
                            <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
                            </Player>
                            </a>
                            </li>
                            <li>
                                <div style={{ display: "flex" }}>
                                    <p className='City cityname'> {weather.city}     </p>
                                    <p className='City citytemp'> {weather.temp}*C</p>
                                    <img src={`/images/${weather.weather}.png`} alt={weather.weather} />
                                </div>
                            </li>
                            {
                                header_Student.map((element, index) => (
                                    <li key={index}>
                                        {
                                            element.role.includes(auth.role) &&
                                            <Link to={element.hash} className={`Link ${element.hash == props.hash ? "ActiveLink" : "notActive"}`} onClick={() => setChooseHeader(element.name)}>{element.name}</Link>
                                        }
                                    </li>
                                ))
                            } 
                        </ul>
                    </div>
                    <div className="header_home_user">
                        {isLoading ? (
                            <IsLoading/>
                        ) : (
                            <>
                                { user ?
                                    <>
                                        <div >
                                    
                                            {user.img && <img onClick={(e) => {
                                                Menu_profile_header.current.classList.toggle("show_menu_profile");
                                                e.target.classList.toggle('click_avatar');

                                            }} src={`${user.img}`} alt='User Avatar' />}
                                        </div>
                                        <div className='Menu_profile_header' ref={Menu_profile_header}>
                                            <div className='avatar_link'>
                                                <div >
                                                    <a className='Menu_a_link_profile' href={`/profile/${user.MSSV}`}>
                                                        <div className='avatar_name'>
                                                            <img src={user.img && `${(user.img)}`} alt='User Avatar' />
                                                            <span>{user.Name }</span>
                                                        </div>
                                                    </a>
                                                </div>
                                                <hr style={{ borderColor: "black" }}></hr>
                                                <div className='ShowAll_User'>
                                                  <a href='/setting'>
                                                        <span>Cài đặt thông tin cá nhân</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <LogOut />
                                        </div>
                                    </> :<> <div>
                                          <img onClick={(e) => {
                                              Menu_profile_header.current.classList.toggle("show_menu_profile");
                                              e.target.classList.toggle('click_avatar');
                                          }} src={ avt} alt='User Avatar' />
                                      </div>
                                      <div className='Menu_profile_header' ref={Menu_profile_header}>
                                          <div className='avatar_link'>
                                              <div >
                                                  <a className='Menu_a_link_profile'>
                                                      <div className='avatar_name'>
                                                          <img src={`${auth.avtUrl}`} alt='User Avatar' />
                                                          <span>{auth.username }</span>
                                                      </div>
                                                  </a>
                                              </div>
                                              <hr style={{ borderColor: "black" }}></hr>
                                              <div className='ShowAll_User'>
                                                <a href='/setting'>
                                                      <span>Cài đặt thông tin cá nhân</span>
                                                  </a>
                                              </div>
                                          </div>
                                          <LogOut />

                                      </div></>
                                }
                            </>
                        )}

                    </div>
                </div>
            </div>


        </>
    );
}
export default memo(Header)
