import React from "react";
import Header from "./header/header";
import Nvarbar from "./nvarbar/Nvarbar";

export default function Layout({ link,children }) {
  return (
    <>
      <Header hash={link} />
      <Nvarbar></Nvarbar>
      <div className="container_main height_vh100">{children}</div>
    </>
  );
}
