import { useEffect } from "react";
import { useState } from "react";
import { IsLoading } from "../Loading";
import useAuth from "../../hook/useAuth";
import Header from "../Layout/header/header";
import "./xemlichhoc.css";
export default function ViewTimetable() {
  const { auth } = useAuth();
  const [isLoading,setIsLoading]=useState(true);
  const [kiHoc, setKihoc] = useState(1);
  const [listKiHoc, setListKiHoc] = useState();
  const [AllMonHoc, setAllMonHoc] = useState();
  const [lichhoc, setLichHoc] = useState();
  const dayOfWeek = [
    {
      day: "Thứ 2",
    },
    {
      day: "Thứ 3",
    },
    {
      day: "Thứ 4",
    },
    {
      day: "Thứ 5",
    },
    {
      day: "Thứ 6",
    },
    {
      day: "Thứ 7",
    },
    {
      day: "Chủ nhật",
    },
  ];
  const caTrongNgay = [
    {
      ca: "1",
      ThoiGianBatDau: "07:00",
      ThoiGianKetThuc: "10:00",
    },
    {
      ca: "2",
      ThoiGianBatDau: "10:00",
      ThoiGianKetThuc: "13:00",
    },
    {
      ca: "3",
      ThoiGianBatDau: "13:00",
      ThoiGianKetThuc: "16:00",
    },
    {
      ca: "4",
      ThoiGianBatDau: "16:00",
      ThoiGianKetThuc: "19:00",
    },
  ];

  const getListKihoc = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/getListKiHoc`,
      );
      const result = await res.json();
      setListKiHoc(result);

    } catch (error) {
     console.log(error);
    }
  };
  const getAllMonHoc = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DB_HOST}/api/getMonHoc`,
      );
      const result = await res.json();
      setAllMonHoc(result);
      setIsLoading(false)
    } catch (error) {
     console.log(error);
    }
  };

const getLichHocSV = async () => {
  try {
    const data = {
      MSSV: auth.username,
      KiHocID: kiHoc,
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
  getListKihoc();
  getAllMonHoc();
}, []);
useEffect(() => {
  getLichHocSV();
 console.log(kiHoc);
}, [kiHoc]);
useEffect
(()=>{
 console.log(lichhoc)
},[AllMonHoc])
return (
  <>
    <Header ></Header>
   {isLoading? <IsLoading></IsLoading>:
    <div className="container_main">
      <div className="TableTime_Schedule">
        <table>
          <thead>
            <tr>
              <th>
                <select onChange={(e) => setKihoc(e.target.value)}>
                  {listKiHoc &&
                    listKiHoc.map((e, i) => {
                      return <option value={e.KiHocID}>{e.TenKiHoc}</option>;
                    })}
                </select>
              </th>
              {dayOfWeek.map((e, i) => {
                return <th>{e.day}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {caTrongNgay.map((e, i) => {
              return (
                <tr>
                  <td>
                    {e.ca}
                    <br></br>( {e.ThoiGianBatDau} : {e.ThoiGianKetThuc} )
                  </td>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <td key={index}>
                      {lichhoc &&
                        lichhoc.map((elementLichHoc, i) => {
                          return elementLichHoc.ThuTrongTuan === index + 2 ? (
                            `${e.ca}` ==
                              elementLichHoc.CaID % 4 || e.ca - 4 ==
                              elementLichHoc.CaID % 4 ? (
                              <>{elementLichHoc.CLASSID} {AllMonHoc&& AllMonHoc.find(monhoc=>monhoc.MonHocID==elementLichHoc.MonHocID).MonHocTen}</>
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          );
                        })}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
}
  </>
);
}
