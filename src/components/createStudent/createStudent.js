import { useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "../confirmComponent/confirm";
import useAuth from "../../hook/useAuth";
import SuccessNotification from "../Notification/successNotifi";
import "./createStudent.css";
import { huyen } from "../../lib/huyen";
import { cityname } from "../../lib/city";

export default function CreateStudent() {
  const fileInputRef = useRef(null);
  const currentChooseSex = useRef(null);
  const { auth } = useAuth();

  const [messRes, setMessRes] = useState();
  const [isMounted, setIsMounted] = useState(false);
  const [avatarURL, setAvatarURL] = useState();
  const [dataimg, setDataimg] = useState(null);
  const [HuyenFollowCity, setHuyenFollowCity] = useState([]);
  const [addresInfo, setAddresInfo] = useState("");
  const [cursor, setCursor] = useState("");
  const host = process.env.REACT_APP_DB_HOST;

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
    Class: "",
  });

  const imgInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setAvatarURL(objectURL);
      setDataimg(file);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup object URL
      if (avatarURL) URL.revokeObjectURL(avatarURL);
    };
  }, [avatarURL]);

  const onChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const setHuyen = (cityCode) => {
    const data = huyen.filter((item) => item.CityCode === cityCode);
    setHuyenFollowCity(data);
  };

  const onChangeHuyen = (id) => {
    const found = HuyenFollowCity.find((item) => item.HuyenID === id);
    if (found) setAddresInfo(`${found.name},${found.TP}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsMounted(true);
  };

  const confirmSubmit = async () => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.set("Address", addresInfo);
    formData.set("Sex", currentChooseSex.current?.value || "");

    if (dataimg) {
      formData.append("image", dataimg); // 👈 file gửi đúng tên với BE multer
    }

    try {
      setCursor("wait");
      const res = await fetch(`${host}/api/createStudent`, {
        method: "POST",
        body: formData,
      });
      const resJson = await res.json();
      setCursor("");
      setMessRes(resJson.message || "Có lỗi xảy ra");
      setIsMounted(false);
    } catch (error) {
      setCursor("");
      setMessRes("Lỗi kết nối server");
      console.error("Submit error:", error);
    }
  };

  const onCancel = () => setIsMounted(false);

  return (
    <>
      <div
        className={`max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-200 ${
          cursor && "cursor-wait"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex justify-center md:w-1/3">
              <input
                type="file"
                name="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={imgInput}
                ref={fileInputRef}
                hidden
              />
              <img
                src={avatarURL || "./images/defaultAvatar.jpg"}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 cursor-pointer hover:shadow-md transition duration-200"
                onClick={() => fileInputRef.current?.click()}
              />
            </div>

            {/* Inputs */}
            <div className="md:w-2/3 w-full space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Họ tên", name: "Name", type: "text", placeholder: "Nhập họ tên" },
                  { label: "Email", name: "email", type: "email", placeholder: "Nhập email" },
                  { label: "Số điện thoại", name: "SDT", type: "text", placeholder: "Nhập SĐT" },
                  { label: "Ngày sinh", name: "Birthday", type: "date" },
                ].map((input) => (
                  <div key={input.name}>
                    <label className="block mb-1 font-medium text-gray-700">
                      {input.label}
                    </label>
                    <input
                      type={input.type}
                      name={input.name}
                      value={values[input.name]}
                      onChange={onChange}
                      placeholder={input.placeholder}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Tên TP</label>
                  <select
                    name="City"
                    onChange={(e) => setHuyen(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Chọn giá trị</option>
                    {cityname.map((tab) => (
                      <option key={tab.name} value={tab.CityCode}>
                        {tab.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Huyện/Quận</label>
                  <select
                    name="Address"
                    onChange={(e) => onChangeHuyen(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Chọn giá trị</option>
                    {HuyenFollowCity.map((tab) => (
                      <option key={tab.name} value={tab.HuyenID}>
                        {tab.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Giới tính</label>
                  <select
                    name="Sex"
                    ref={currentChooseSex}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nữ">Nữ</option>
                    <option value="Nam">Nam</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 hover:shadow-lg transition duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {isMounted && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn thực hiện hành động này?"
          onConfirm={confirmSubmit}
          onCancel={onCancel}
        />
      )}
      <SuccessNotification messRes={messRes} setMessRes={setMessRes} />
    </>
  );
}
