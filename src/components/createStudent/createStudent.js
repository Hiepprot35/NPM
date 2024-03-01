import { useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import { ConfirmDialog } from "../confirmComponent/confirm";
import useAuth from '../../hook/useAuth'
import FormInput from "../Layout/FormInput/FormInput";
import SuccessNotification from "../Notification/successNotifi";
import './createStudent.css'
import { data } from "jquery";
import { huyen } from "../../lib/huyen";
import { cityname } from "../../lib/city";
export default function CreateStudent() {
    // const fs = require('fs');

    const fileInputRef = useRef(null)
    const khoaRef = useRef(1)
    const currentChooseClass = useRef(null)
    const currentChooseSex = useRef(null)
    const [currentChooseKhoa, setCurrentChooseKhoa] = useState(1);
    const { auth } = useAuth()
    const [messRes, setMessRes] = useState();
    const [khoa, setKhoa] = useState();
    const [isMounted, setIsMounted] = useState(false)
    const [classInfo, setClass] = useState([]);
    const [classFlowKhoa, setClassFlowKhoa] = useState();
    const [avatarURL, setAvatarURL] = useState();
    const [dataimg, setDataimg] = useState();
    const host = process.env.REACT_APP_DB_HOST;
    useEffect(()=>{console.log(auth)},[])

    const [values, setValues] = useState({
        Name: "",
        email: "",
        Birthday: "",
        password: "",
        Address: "",
        SDT: "",
        backgroundimg: "",
        create_by: "",
        image: "",
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
    const [CityName,setCityName]=useState();
    const getCity=async ()=>{
        const response = await fetch(
            'https://parseapi.back4app.com/classes/City?limit=63',
            {
              headers: {
                'X-Parse-Application-Id': 'kysTM8sxjGAzL9kRFu5SbI3zRSZgRvzj6Feb9CaI', // This is the fake app's application id
                'X-Parse-Master-Key': 'saeclF3NoaHo0ETX9uN88H85xT2KAY4QCHNp4n1F', // This is the fake app's readonly master key
              }
            }
          );
          const data = await response.json(); // Here you have the data that you
    setCityName(data)
    }
    useEffect(()=>{
       getCity() 
    },[])
    useEffect(()=>{
        console.log(CityName)
    },[CityName])
    const sendData = async (data) => {
        try {
            const formDataInfo = {};
            data.forEach((value, key) => {
                formDataInfo[key] = value;
            });
            const res = await fetch(`${host}/api/createStudent`, {
                method: 'POST',
                body: data,
               
            });
            const resJson = await res.json();
            if (resJson && resJson.status === 200) {
                setIsMounted(false);
                setMessRes(resJson.message);
            } else {
                setIsMounted(false);
                setMessRes(resJson.message || resJson);
                console.log(resJson)
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }
    async function handleSubmit(event) {
        try {
            event.preventDefault();
            if(dataimg)
            {
          setValues({
                ...values,
                Address:addresInfo,
                Khoa: currentChooseKhoa,
                Class: currentChooseClass.current.value,
                Sex: currentChooseSex.current.value,
                image: dataimg,
                backgroundimg: "dataimg"
            })
            
            setIsMounted(true)
        }
        }
        catch (error) {
            console.error(error);
        }
    }
    const confirmSubmit = () => {
        const formData = new FormData();
        if (values) {
            Object.entries(values).forEach(([key, value]) => {
                // console.log(`${key}: ${value}`);
                formData.append(key, value);
            });
       
        }
        sendData(formData);
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
    
        // {
        //     id: 6,
        //     name: "Address",
        //     type: "text",
        //     placeholder: "Address",
        //     label: "Address",
        //     // pattern: "^[A-Za-z0-9]{3,16}$",
        //     required: true,
        // },
        {
            id: 7,
            name: "SDT",
            type: "text",
            placeholder: "SDT",
            label: "SDT",
            // pattern: "^[0-9]{3,16}$",
            required: true,
        },
    ];
    const [addresInfo,setAddresInfo]=useState();

    const [HuyenFollowCity,setHuyenFollowCity]=useState();
    const setHuyen=(e)=>{
        console.log(e)
       const data= huyen.filter((v,m)=>v.CityCode===e);
       setHuyenFollowCity(data)
    }
    const onChangeHuyen=(e)=>
    {
      const data=  HuyenFollowCity.find((v)=>e===v.HuyenID)
      setAddresInfo(`${data.name},${data.TP}`)
    }    
    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }
    return (
        <>
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
                                        <span>Tên TP: </span>

                                        <select name="Class"onChange={(e)=>{setHuyen(e.target.value)}} >
                                        <option> Chọn giá trị</option>
                                            {
                                                 cityname.map((tab) => {
                                                    return (
                                                        <option key={tab.name} value={tab.CityCode}  >
                                                            {tab.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                      <div className="mb-3">
                                        <span>Tên huyện,quận: </span>
                                        <select name="Class" onChange={(e)=>{onChangeHuyen(e.target.value)}}>
                                        <option> Chọn giá trị</option>

                                            {
                                                HuyenFollowCity&& HuyenFollowCity.map((tab) => {
                                                    return (
                                                        <option key={tab.name} value={tab.HuyenID} >
                                                            {tab.name}
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
