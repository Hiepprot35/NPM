import { useNavigate, useLocation } from 'react-router-dom';
import ChangeBackground from '../changeBackground';
import { useEffect, useState, useRef } from "react";
import { IsLoading } from '../Loading';
import useAuth from '../../hook/useAuth'
import UseRfLocal from '../../hook/useRFLocal';
import io from 'socket.io-client';
import './login.css'
import VerifyCodeEmail from '../sendEmail/verifyCodeEmail';
const host = process.env.REACT_APP_DB_HOST;
const imgLinkBasic =
{
  link: "https://pbs.twimg.com/media/EnOnhlSWEAEeYB3?format=jpg&name=large"
}
export default function Login({ setAccessToken }) {
  const input_username = useRef(null)
  const input_password = useRef(null)
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { setRefreshToken } = UseRfLocal()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState();
  const [loginImgBackground, setLoginImgBackground] = useState(imgLinkBasic);
  const [verifyCode, setverifyCode] = useState({code:"",SentTime:0});
  const [infoToSendGmail, setinfoToSendGmail] = useState();
  const [verifyCodeInput,setVerifyCodeInput]=useState();
  const [ResApi, setResApi] = useState()
  const [user, setUser] = useState('');
  const GoogleAuth= ()=>{
    window.location.href = `${process.env.REACT_APP_DB_HOST}/api/auth/google/callback`;


  }
  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_DB_HOST}/api/auth/login/success`;
      const res = await fetch(url, {
        credentials: 'include', // Đảm bảo gửi cookie
      });
      const dataRes=await res.json()
      if(dataRes.AccessToken)
      {
      setAccessToken(dataRes.AccessToken);
      setRefreshToken(dataRes.RefreshToken)
      const role = dataRes.Role
      const username = dataRes.Username
      const userID = dataRes.UserID
      const avtUrl=dataRes.avtUrl
    setAuth({ role, username, userID,avtUrl })
    setIsLoading(false)
    }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(()=>{getUser()},[])
  useEffect(() => {
    const data = {
      "to": infoToSendGmail?.to,
      "subject": 'Verify Tuanhiepprot3',
      "register":false
    }
  
    const sendEmail = async () => {
      const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const verifyCodeRes = await res.json()
      setverifyCode({code:verifyCodeRes.verifycode,SentTime:verifyCodeRes.SentTime})
    };
    ResApi?.isVerify && sendEmail();
  }, [infoToSendGmail])
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(false)
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const data = Array.from(e.target.elements)
      .filter((input) => input.name)
      .reduce((obj, input) => Object.assign(obj, { [input.name]: input.value }), {})
      const URL = `${host}/api/login`;

    const resoponse = await fetch(URL,
      {
        method: "POST",
        credentials: 'include',
        headers: headers,

        body: JSON.stringify(
          data
        )
      })

    const dataRes = await resoponse.json();
  
    if (dataRes.AccessToken) {
      const user = dataRes;
      setResApi(dataRes)
      const role = dataRes.Role
      const username = dataRes.Username
      const userID = dataRes.UserID
      if (dataRes?.isVerify === 0) {
        setAccessToken(dataRes.AccessToken);
        setRefreshToken(dataRes.RefreshToken)
      }
      else if (dataRes?.isVerify === 1) {
        setinfoToSendGmail({ to: dataRes.Email })
      }
      setAuth({ role, username, userID })
      setMessage("")
      // navigate('/home', { state: { user } });
    }
    else {
      setIsLoading(false)
      setMessage(dataRes.message)
    }
  }
  //-------------------------------------------------------------------------------//

  //-------------------------------------------------------------------------------//

  //-------------------------------------------------------------------------------//
  const submitVerifycode = () => {
    const currenttime=new Date().getTime();
    if(verifyCodeInput)
    {
    console.log(typeof(verifyCode.SentTime))
    if (verifyCodeInput === verifyCode.code.toString() && currenttime- verifyCode.SentTime<60*1000) {
      setAccessToken(ResApi.AccessToken);
      setRefreshToken(ResApi.RefreshToken)
    }
    if (verifyCodeInput=== verifyCode.code.toString() && currenttime- parseInt(verifyCode.SentTime)>60*1000) {
      setMessage("Code đã hết hạn");
    }
    if(verifyCodeInput !== verifyCode.code.toString() )
    {
      setMessage("Code sai");
    }
  }
  }

  // useEffect(console.log(infoToSendGmail?.to),[infoToSendGmail])
  //-------------------------------------------------------------------------------//
  const dangnhap_layer=useRef(null)
  const login_text=useRef(null)
  const back_login_layout=useRef(null);
  const forget_pass_text=useRef(null);
  const register_text=useRef(null);
  const save_pass_text=useRef(null);
  const applyStyles = (element, value,prop) => {

    if(dangnhap_layer.current)
    {
      dangnhap_layer.current.style.width="100%"
      dangnhap_layer.current.style.height="100%"
      dangnhap_layer.current.style.backgroundColor="black"
    if (element.current) {
      element.current.style[prop] = `${value}`;
     element.current.style.transition="500ms linear";
    }
  }
  };
  const elementsToStyle = [login_text, save_pass_text, forget_pass_text, register_text];

  const applyStylesToElements = (elements, value, prop) => {
  elements.forEach(element => {
    applyStyles(element, value, prop);
  });
};

const hover_dangnhap = () => {
  applyStylesToElements(elementsToStyle, 'white', 'color');
};

const leave_dangnhap = () => {
  applyStylesToElements(elementsToStyle, 'black', 'color');
};


  return (



    <>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>ĐĂNG NHẬP</title>
      <link rel="stylesheet" href="/css/login.css" />


      <div className="container login_layout" style={{ zIndex: -1, backgroundImage: `url(${loginImgBackground.link})` }}>
      <div className='back_login_layout' ref={back_login_layout}>

        <div className="dangnhap_layer" ref={dangnhap_layer}  onMouseEnter={hover_dangnhap} >
          <div className="dangnhap_text">
            <h1 ref={login_text} id="gsap_id">LOGIN</h1>
          </div>
          {infoToSendGmail ? (
          <VerifyCodeEmail infoToSendGmail={infoToSendGmail} setVerifyCodeInput={setVerifyCodeInput} submitVerifycode={submitVerifycode}></VerifyCodeEmail>
          )
            :
            <form className="form_dn" onSubmit={handleSubmit}>
                
              <div className='input_login'>
            <div style={{"width": "70%"}}>

              <div className="dangnhap_input_div taikhoan_input">
                <input
                  type="text"
                  name="username"
                  className="dangnhapinput 2"
                  id="input_tk"
                  required
                  ref={input_username}
                />
                <label
                  className="username"
                  id="labelUsername"
                  htmlFor='username'
                >
                  Username
                </label>
              </div>
              <div className="dangnhap_input_div">
              <input
                  type="password"
                  name="password"
                  className="dangnhapinput 1"
                  required
                  id="input_mk"
                  ref={input_password}
                />
                     <label
                  className="username"
                  id="labelPassword"
                  htmlFor='password'
                >
                  Password
                </label>
              </div>

              </div>

           
              </div>
              <div className="forget_save_div">
                <div className="forget_pass">
                  <a onClick={GoogleAuth} ref={forget_pass_text} className="forget_pass_text">
                    Forgot Password?
                  </a>
                </div>
                <div className="checkbox_div">
                  <input type="checkbox" />
                  <span className="checkbox_mk" ref={save_pass_text}>Lưu mật khẩu</span>
                </div>
              </div>
              <div className='forget_save_div'>
            
              <div className="sumbit_button">
                <button
                  type="submit"
                  className="sumbit"
                  id="sumbit_btn"
                  defaultValue="Đăng nhập"
                > Login </button>
              </div>
              <div className="forget_pass dangky_href">
              <a href="/create" className="forget_pass_text" ref={register_text}>
                Register
              </a>
              </div>
              </div>   

              <div className='login_google'onClick={GoogleAuth}>
                <div ><span style={{color:"white",margin:"1rem"}}>
                  OR
                  </span>
                  </div>
                <div className='login_google_button'>
                <div >
                <img style={{width:"2rem",height:"2rem"}} src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'></img>
                </div>
                <div className='button_google'>
                <span style={{color:"black"}}> Login with Google</span>
                </div>
                </div>
                 </div>   
            </form>
          }
          <div className='warning'>
            {message ? (
              <div>
                <h1 className='message'>{message}</h1>
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </div>
      {
        isLoading && <IsLoading></IsLoading>
      }
    </>
  )
}

