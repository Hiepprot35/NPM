import { useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import { useRefresh } from "../../hook/useRefresh";
import UseToken from "../../hook/useToken";
import { ConfirmDialog } from "../confirmComponent/confirm";
import Header from "../Layout/header/header";
import useAuth from '../../hook/useAuth'
import FormInput from "../Layout/FormInput/FormInput";
import { ResizeImg } from "../../function/ResizeImg";
import SuccessNotification from "../Notification/successNotifi";
import './createStudent.css'
function blobToBuffer(blob) {

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = Buffer.from(reader.result);
            resolve(buffer);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(blob);
    });
}
export default function CreateStudent() {

    const fileInputRef = useRef(null)

    const khoaRef = useRef(1)
    const password = useRef()
    const currentChooseClass = useRef(null)
    const currentChooseSex = useRef(null)
    const [currentChooseKhoa, setCurrentChooseKhoa] = useState(1);
    const { auth } = useAuth()
    const [messRes, setMessRes] = useState();
    const [khoa, setKhoa] = useState();
    const { AccessToken, setAccessToken } = UseToken();
    const [isMounted, setIsMounted] = useState(false)
    const [classInfo, setClass] = useState([]);
    const [classFlowKhoa, setClassFlowKhoa] = useState();
    const [avatarURL, setAvatarURL] = useState();
    const [dataimg, setDataimg] = useState();
    const host = process.env.REACT_APP_DB_HOST;
    useEffect(()=>{console.log(auth)},[])
    const getUser = async () => {
		try {
			const url = `${process.env.REACT_APP_DB_HOST}/api/auth/login/success`;
            const res = await fetch(url, {
                credentials: 'include', // Đảm bảo gửi cookie
              });
      const resApi=await res.json();
			console.log(resApi.user);


		} catch (err) {
			console.log(err);
		}
	};
  useEffect(()=>{getUser()},[])
    const [values, setValues] = useState({
        Name: "",
        email: "",
        Birthday: "",
        password: "",
        Address: "",
        SDT: "",
        backgroundimg: "",
        create_by: "",
        img: "",
        Khoa: "",
        Sex: "",
        Class: ""
    });
    const imgInput = (e) => {
        const img = e.target.files[0];
        const imgLink = URL.createObjectURL(img);
        setAvatarURL(imgLink);
        setDataimg(img);
    };

    useEffect(() => {
        fetch(`${host}/api/getAllClass`)
            .then(res => res.json())
            .then(contents => {
                setClass(contents);
            });
    }, []);
    useEffect(() => {
        fetch(`${host}/api/getAllKhoa`)
            .then(res => res.json())
            .then(contents => {
                setKhoa(contents);
            })

    }, []);

    const sendData = async (data) => {
        try {
            console.log("join")
            const res = await fetch(`${host}/api/createStudent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AccessToken}`,
                },
                body: JSON.stringify(data)
            });

            const resJson = await res.json();
            if (resJson.status == 200) {
                setIsMounted(false);
                setMessRes(resJson.message);
            }
            setIsMounted(false);
            setMessRes(resJson.message);


        } catch (error) {

            console.error('Error occurred:', error);
        }
    }
    useEffect(() => { console.log(values) }, [values])
    async function handleSubmit(event) {
        try {
            event.preventDefault();
            const imgBigger = await blobToBuffer(dataimg)
            ResizeImg(dataimg, async (newBlob) => {
                const imgBufer = await blobToBuffer(newBlob)
                setValues({
                    ...values, Khoa: currentChooseKhoa,
                    Class: currentChooseClass.current.value,
                    Sex: currentChooseSex.current.value,
                    img: imgBufer,
                    backgroundimg: imgBigger
                })
            })
            setIsMounted(true)
        }
        catch (error) {
            console.error(error);
        }
    }

    const confirmSubmit = () => {
        values && sendData(values);
    }
    const onCancel = () => {
        setIsMounted(false);
    }
    const handleChooseKhoa = (e) => {
        setCurrentChooseKhoa(e.target.value)
    }
    useEffect(() => {
        setClassFlowKhoa(classInfo && classInfo.filter((tab) => tab.KhoaID === parseInt(currentChooseKhoa || 1)));
    }, [classInfo, currentChooseKhoa]);    
    const inputs = [
        {
            id: 1,
            name: "Name",
            type: "text",
            placeholder: "Username",
            errorMessage:
                "Username should be 3-16 characters and shouldn't include any special character!",
            label: "Username",
            // pattern: "^[A-Za-z]{3,16}$",
            required: true,
        },
        {
            id: 2,
            name: "email",
            type: "email",
            placeholder: "Email",
            errorMessage: "It should be a valid email address!",
            label: "Email",
            required: true,
        },
        {
            id: 3,
            name: "Birthday",
            type: "date",
            placeholder: "Birthday",
            label: "Birthday",
        },
        {
            id: 4,
            name: "password",
            type: "password",
            placeholder: "Password",
            errorMessage:
                "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
            label: "Password",
            // pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
            required: true,
            title: "Eight or more characters"
        },

        {
            id: 6,
            name: "Address",
            type: "text",
            placeholder: "Address",
            errorMessage: "SDT don't match!",
            label: "Address",
            // pattern: "^[A-Za-z0-9]{3,16}$",
            required: true,
        },
        {
            id: 7,
            name: "SDT",
            type: "text",
            placeholder: "SDT",
            errorMessage: "PasswSords don't match!",
            label: "SDT",
            // pattern: "^[0-9]{3,16}$",
            required: true,
        },
    ];
    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }
    return (
        <>
            <Header></Header>
            <div className="CreateStudentForm">
                <div className="column_form">
                    <h2>Thêm sinh viên</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <div className="iputForm_colum2">
                                <div className="avatar_field"
                                    style={{ height: "200px" }}
                                >
                                    <input
                                        type="file"
                                        name="HinhAnh"
                                        onChange={imgInput}
                                        ref={fileInputRef}
                                        accept="image/png, image/jpeg, image/webp"
                                        hidden
                                    >
                                    </input>
                                    <img onClick={() => { fileInputRef.current.click() }} className="avatarImage" src={avatarURL ? avatarURL : "./images/defaultAvatar.jpg"} style={{ width: "100px", height: "100px" }} alt="Avatar"></img>
                                </div>
                            </div>
                            <div className="inputForm_colum1">
                                <div className="inputForm_row1">
                                    {inputs.map((input, index) => (
                                        index < 3 &&
                                        <FormInput
                                            key={input.id}
                                            {...input}
                                            value={values[input.name]}
                                            onChange={onChange}
                                        />
                                    ))}
                                </div>
                                <div className="inputForm_row2">
                                    {inputs.map((input, index) => (
                                        index > 2 &&
                                        <FormInput
                                            key={input.id}
                                            {...input}
                                            value={values[input.name]}
                                            onChange={onChange}
                                        />
                                    ))}
                                </div>
                                <div className="inputForm_row3">
                                    <div className="mb-3">
                                        <span>Tên khoa: </span>
                                        <select name="Khoa" ref={khoaRef} value={currentChooseKhoa} onChange={handleChooseKhoa} >
                                            {
                                                khoa ? khoa.map((tab) => {
                                                    return (
                                                        <option key={tab.KhoaID} value={tab.KhoaID} >
                                                            {tab.KhoaName}
                                                        </option>
                                                    )
                                                }) : <div> ok</div>
                                            }
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <span>Tên lớp: </span>
                                        <select name="Class" ref={currentChooseClass}>
                                            {
                                                classFlowKhoa && classFlowKhoa.map((tab) => {
                                                    return (
                                                        <option key={tab.CLASSID} value={tab.CLASSID} >
                                                            {tab.CLASSNAME}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <span>Giới tính: </span>
                                        <select id="sex" name="Sex" ref={currentChooseSex} >
                                            <option value={"Nữ"}>Nữ</option>
                                            <option value={"Nam"}>Nam</option>
                                        </select>
                                    </div>
                                    <button type="submit"
                                    className="sumbit">
                                        Submit
                                    </button>

                                </div>
                            </div>


                        </div>


                    </form>
                </div >
            </div >

            {
                isMounted &&
                <ConfirmDialog
                    message="Bạn có chắc chắn muốn thực hiện hành động này?"
                    onConfirm={confirmSubmit}
                    onCancel={onCancel}
                ></ConfirmDialog>
            }
              <SuccessNotification messRes={messRes} setMessRes={setMessRes}> 
        </SuccessNotification>
        </>
    )
}
