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
        { method: "POST", headers: { "Content-type": "application/json" },body:JSON.stringify({UserID:data}) },
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
export async function fetchApiRes(url, method, body, options = {}) {
  try {
    const urlApi = `${process.env.REACT_APP_DB_HOST}/api/${url}`;
    let requestOptions = {
      method: method,
      headers: { "Content-type": "application/json" },
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options, // Spread the options to include signal
    };

    // Remove body if method is GET
    if (method === "GET") {
      delete requestOptions.body;
    }

    const res = await fetch(urlApi, requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
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
    throw Exception;
  } catch (error) {
    return null;
  }
}
