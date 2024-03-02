import React from 'react';
import './dangkihoc.css'
import { useState, useEffect, useRef } from "react"
import { useRefresh } from "../../hook/useRefresh";
import useAuth from '../../hook/useAuth'
import Header from "../Layout/header/header";
import { IsLoading } from "../Loading";
export default function DangKiLopHoc(props) {
    useEffect(()=>{
        if(props.arrivalMessage)
        {

            document.title=`${props.arrivalMessage.sender_id} đã gửi tin nhắn`
        }

    },[props.arrivalMessage])
    const { auth } = useAuth()
    const [isChecked, setIsChecked] = useState()
    const [loading, setLoading] = useState(true)
    const [monHoc, setMonHoc] = useState()
    const [ChooseMonHoc, setChooseMonHoc] = useState();
    const [classMonHoc, setClassMonHoc] = useState();
    const [chooseClass, setChooseClass] = useState();
    const [danhlopdadangky, setdsachlop] = useState();
    const host = process.env.REACT_APP_DB_HOST;
    const [lichhoc, setLichHoc] = useState();
    const [result, setResult] = useState()
    const findMonHoc = (father, son) => {
        if (father) {

            const foundElement = father.find((elementIncludes) =>
                elementIncludes.CaID === son.Ca[0]?.CaID || elementIncludes.CaID === son.Ca[1]?.CaID
            );

            if (foundElement) {
                return foundElement
            }
        }
    }
    const ChooseMonHocChange = (e) => {
        setChooseMonHoc(e.target.value)
        setChooseClass(null)
    }
    const getLichHocSV = async () => {
        try {
            const data = {
                MSSV: auth.username,
                KiHocID: 1,
            };
            const res = await fetch(
                `${process.env.REACT_APP_DB_HOST}/api/getLichHoc`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                },
            );
            const result = await res.json();
            setLichHoc(result);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const getApi = async () => {

            const getMonhocFetch = await fetch(`${host}/api/getMonHoc`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',

                    }
                })
            const getMonHoc = await getMonhocFetch.json();
            setMonHoc(getMonHoc);
            setLoading(false)
        }
        getLichHocSV()
        getApi()
    }, [danhlopdadangky]);
    const dataResult = [];
    useEffect(() => {

        // Sử dụng một đối tượng Map để tạo một nhóm các môn học theo CLASSID
        const groupedData = new Map();

        classMonHoc && classMonHoc.forEach(item => {
            const classId = item.CLASSID;
            const existingItem = groupedData.get(classId);

            if (existingItem) {
                // Nếu lớp học đã tồn tại, thêm CA vào mảng Ca
                existingItem.Ca.push({
                    "CaID": item.CaID,
                    "ThuTrongTuan": item.ThuTrongTuan,
                    "ThoiGianBatDau": item.ThoiGianBatDau,
                    "ThoiGianKetThuc": item.ThoiGianKetThuc
                });
            } else {
                const newClass = {
                    "CLASSID": item.CLASSID,
                    "MonHocTen": item.MonHocTen,
                    "SiSo": item.SiSo,
                    "TongSo": item.TongSo,
                    "TenKiHoc": item.TenKiHoc,
                    "Ca": [{
                        "CaID": item.CaID,
                        "ThuTrongTuan": item.ThuTrongTuan,
                        "ThoiGianBatDau": item.ThoiGianBatDau,
                        "ThoiGianKetThuc": item.ThoiGianKetThuc
                    }]
                };
                groupedData.set(classId, newClass);
            }
        });

        // Chuyển dữ liệu từ Map sang mảng kết quả
        groupedData.forEach(value => {
            dataResult.push(value);
        });
        setResult(dataResult)
    }, [classMonHoc]);

    useEffect(() => {
        const getApi = async () => {

            const getMonhocFetch = await fetch(`${host}/api/getClassMonHoc`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({
                        "MaMonHoc": ChooseMonHoc
                    })
                })
            const getMonHoc = await getMonhocFetch.json();
            setClassMonHoc(getMonHoc)
        }
        getApi()
    }, [ChooseMonHoc]);

    useEffect(() => {
        const sendDataApi = async () => {
            try {
                const URL = `${host}/api/lopdadangky`
                const sendToApi = await fetch(URL,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "MSSV": auth.username
                        })
                    })
                const data = await sendToApi.json()
                setdsachlop(data)
            } catch (error) {
                console.log(error)
            }

        }
        sendDataApi()
    }, [])
    // useEffect(() => {
    // console.log(check.current.value)
    //   });
    function handleDangKy(e) {
        const data = {
            "CLASSID": e.target.value,
            "MaMonHoc": ChooseMonHoc,
            "MSSV": auth.username
        }
        const sendDataApi = async () => {
            try {
                const URL = `${host}/api/dangkihoc`
                const sendToApi = await fetch(URL,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    })
                const respon = await sendToApi.json()
                if (sendToApi.status == 201) {
                    setdsachlop(pre => [...pre, { "CLASSID": respon.CLASSID, "MonHocID": respon.MonHocID }])
                }
                else if (sendToApi.status === 200) {
                    console.log(danhlopdadangky);
                    const newData = danhlopdadangky.filter((element) =>
                        element.CLASSID != e.target.value
                    )
                    setdsachlop(newData)
                }
            } catch (error) {
                console.log(error)
            }

        }
        sendDataApi()

    }
    useEffect(() => { console.log("Lichhoc", isChecked) }, [isChecked])
    useEffect(() => { console.log("LopDangKi", danhlopdadangky) }, [danhlopdadangky])
    const viewTrungLichHoc = (title) => {
        setIsChecked(monHoc.find(e => e.MonHocID == (danhlopdadangky.find(monhoc => monhoc.CLASSID == findMonHoc(lichhoc, title).CLASSID)?.MonHocID)))
    }
    return (
        <>
            <Header></Header>
            <div className="container_main">
                <div className='dangkihoc_layout'>
                <form>
                    <div className="MonHocCombobox_layout">
                        <div>

                        <h4>
                            <strong>
                                Môn học
                            </strong>
                        </h4>
                        </div>
                        {
                            loading ? <IsLoading></IsLoading> :
                                <div className='MonHoc_table' name="monhoc" id="monhoc" >
                                    <ul>

                                        {
                                            monHoc.map((title, index) => {
                                                return (
                                                    <li key={index}
                                                    >
                                                        <input
                                                            name={`${title.MonHocID}`}
                                                            type="checkbox"
                                                            id={`CLASS${title.MonHocID}`}
                                                            value={`${title.MonHocID}`}
                                                            checked={danhlopdadangky && danhlopdadangky.some(e => e.MonHocID == title.MonHocID)}
                                                            onChange={ChooseMonHocChange}
                                                        />
                                                        <label htmlFor={`CLASS${title.MonHocID}`}
                                                        >
                                                            {title.MonHocTen}
                                                        </label>
                                                        <br />
                                                        <hr />
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                        }
                    </div>
                    <div className='ChiTietLopHoc'>
                        {ChooseMonHoc &&
                            <>
                                <h4>
                                    <strong>
                                        Lớp học
                                    </strong>
                                </h4>
                                <table  style={{"width":"100%"}}>
                                    <thead>
                                    </thead>
                                    <tbody>
                                        {
                                            result && result.map((title, index) => {
                                                return (
                                                    <div key={index} >
                                                        <tr key={index} className={danhlopdadangky.some(monhoc => monhoc?.CLASSID !== title.CLASSID && monhoc?.CLASSID == findMonHoc(lichhoc, title)?.CLASSID) ? "head_table activeTrungLich" : "head_table"} >
                                                            <td colSpan={5}>


                                                                Lớp chính :
                                                                <strong>
                                                                    {title.MonHocTen} &nbsp;&nbsp;
                                                                    {title.CLASSID}
                                                                </strong>
                                                                {
                                                                    danhlopdadangky?.some((item) => item.CLASSID == title.CLASSID) ?
                                                                        <div style={{ display: "inline-block" }} >
                                                                            <input type="checkbox"
                                                                                name={`${title.CLASSID}`}
                                                                                id={`MONHOC${title.CLASSID}`}
                                                                                value={`${title.CLASSID}`}
                                                                                checked={true}
                                                                                onChange={handleDangKy}
                                                                            />
                                                                        </div> :
                                                                        lichhoc
                                                                            && lichhoc.some((elementIncludes) =>
                                                                                elementIncludes.CaID == title.Ca[0]?.CaID
                                                                                ||
                                                                                elementIncludes.CaID == title.Ca[1]?.CaID)
                                                                            ?
                                                                            <>
                                                                                <div style={{ display: "inline-block" }}>
                                                                                    <input type="checkbox"
                                                                                        name={`${title.CLASSID}`}
                                                                                        id={`MONHOC${title.CLASSID}`}
                                                                                        value={`${title.CLASSID}`}
                                                                                        checked={false}
                                                                                        readOnly={true}
                                                                                        className='trunglich_input'
                                                                                    />
                                                                                </div>
                                                                                <div style={{ display: "inline-block" }} className='Trunglich' onMouseOver={() => viewTrungLichHoc(title)} onMouseLeave={() => { setIsChecked(false) }}>

                                                                                    <p style={{ color: "white" }} > Đã trùng lịch</p>

                                                                                </div>
                                                                                {
                                                                                    <div className='monhoctrunglich' style={isChecked ? { opacity: 1 } : { opacity: 0 }}>{isChecked?.MonHocTen} {isChecked?.CLASSID} </div>
                                                                                }
                                                                            </> : (
                                                                                <div style={{ display: "inline-block" }}>

                                                                                    <input type="checkbox"
                                                                                        name={`${title.CLASSID}`}
                                                                                        id={`MONHOC${title.CLASSID}`}
                                                                                        value={`${title.CLASSID}`}
                                                                                        checked={false}
                                                                                        onChange={handleDangKy}

                                                                                    />
                                                                                </div>
                                                                            )

                                                                }
                                                                <span style={{ float: "right" }}>
                                                                    {title.TongSo}/{title.SiSo}
                                                                </span>
                                                            </td>

                                                        </tr>
                                                        <tr>
                                                            <th style={{ width: "5%" }} className='Column1'></th>
                                                            <th style={{ width: "35%" }} className='Column2'>Kì học</th>
                                                            <th style={{ width: "35%" }} className='Column3'>Thời gian học</th>
                                                            <th style={{ width: "15%" }} className='Column4'>Lớp học</th>
                                                            <th style={{ width: "10%" }} className='Column5'> Giảng viên</th>

                                                        </tr>

                                                        <tr>
                                                            <th></th>
                                                            <td>
                                                                {title.TenKiHoc}
                                                            </td>
                                                            <td>
                                                                {title.Ca.map((elementCa, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            <p key={index}>Thứ {elementCa.ThuTrongTuan} Ca {elementCa.CaID % 4 !== 0 ? elementCa.CaID % 4 : 4} ({elementCa.ThoiGianBatDau} đến {elementCa.ThoiGianKetThuc})</p><br />
                                                                        </div>
                                                                    )
                                                                })}
                                                            </td>
                                                            <td></td>
                                                            <td></td>

                                                        </tr>
                                                    </div>

                                                )
                                            }
                                            )
                                        }
                                    </tbody>
                                </table>

                            </>
                        }

                    </div>
                </form >
                </div>
            </div >
        </>
    )
}