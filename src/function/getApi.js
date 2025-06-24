import { Exception } from "sass";

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
export async function getStudentInfoByMSSV(data, options = {}) {
  if (data) {
    const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${data}`;
    try {
      const studentApi = await fetch(URL2, options);
      const student = await studentApi.json();
      return student;
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
      return null;
    }
  }
}
export async function getInforByUserID(data, options = {}) {
  if (data) {
    const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyUserID`;
    try {
      const studentApi = await fetch(
        URL2,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ UserID: data }),
        },
        options
      );
      const student = await studentApi.json();
      return student;
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
      return null;
    }
  }
}
export async function fetchApiRes(url, method, body, options = {}, token) {
  try {
    const urlApi = `${process.env.REACT_APP_DB_HOST}/api/${url}`;
    const finalToken = token || localStorage.getItem('AccessToken');
        const refresToken = token || localStorage.getItem('AccessToken');

    let requestOptions = {
      method,
      headers: {
        "Content-type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
                ...(finalToken ? { Authorization: `Bearer ${finalToken}` } : {}),

      },
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    };

    // Xóa "Content-type" nếu body là FormData
    if (body instanceof FormData) {
      delete requestOptions.headers["Content-type"];
    }

    // Xóa body nếu method là GET
    if (method === "GET") {
      delete requestOptions.body;
    }
    const res = await fetch(urlApi, requestOptions);

    // Xử lý lỗi HTTP
    if (!res.ok) {
     throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Parse response
    const data = await res.json();
    return data;
  } catch (error) {
    // Bỏ qua lỗi AbortError (nếu có AbortController)
    if (error.name !== "AbortError") {
      console.error("Error fetching API:", error);
    }
    return null;
  }
}

export async function TheMovieApi(url, method, body) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTMxMjY0M2U3MzQ5YjAyM2Q4YWE0NzViMzUyMzYwMSIsInN1YiI6IjY1ZTZkOGMzOGQxYjhlMDE4NzY3MjEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IhIe9_G8KXIFkM2bHAhWYkZy_uaOvUolfJrfI1YQZm4",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}
