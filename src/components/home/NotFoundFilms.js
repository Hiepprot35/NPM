import React from "react";
export default function NotFoundFilms() {
  return (
    <div
      style={{ padding: "7vh", width: "100%", height: "100vh" }}
      className="center"
    >
      <h1>Sorry :( , this movies is not updated. Back to</h1>
      <a href={`${process.env.REACT_APP_CLIENT_URL}/`} >
        <h1 className="HomeHover" style={{padding:"1rem",backgroundColor:"white",color:"black", borderRadius:".4rem"}} >Home</h1>
      </a>
    </div>
  );
}
