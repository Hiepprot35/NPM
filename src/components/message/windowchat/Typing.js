import React from "react";
import "./typing.css";

export default function Typing({ style = {}, visible = false }) {
  return (
    <div
    
      style={{
        padding:visible?'1rem':0,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
        ...style,
      }}
    >
      <div className="typing__dot"></div>
      <div className="typing__dot"></div>
      <div className="typing__dot"></div>
    </div>
  );
}
