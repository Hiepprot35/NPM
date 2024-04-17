import { bool } from "prop-types";

export const getUserinfobyID = async (data) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/username`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ UserID: data }),
    });
    const data2 = await res.json();
    return data2[0];
  } catch (err) {
    console.log("Không có giá trí");
  }
};
export async function getStudentInfoByMSSV(data) {
  if (data) {
    const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${data}`;
    try {
      const studentApi = await fetch(URL2);
      const student = await studentApi.json();
      return student;
    } catch (error) {
      console.error(error);
    }
  }
}
export async function fetchApiRes(url, method, body) {
  try {
    const urlApi = `${process.env.REACT_APP_DB_HOST}/api/${url}`;
    let requestOptions = {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(body),
    };

    // Kiểm tra nếu method là "GET" thì không cần truyền body
    if (method === "GET") {
      delete requestOptions.body;
    }
    const res = await fetch(urlApi, requestOptions);

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
