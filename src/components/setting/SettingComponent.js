import React from "react";
import { motion } from "framer-motion";
const SettingComponent = ({ icon, text, onClick }) => {
  return (
    <motion.div
      inherit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // exit={{opacity:0}}
      transition={{ duration: 1 }}
      className="center settingComopent hover"
      onClick={onClick}
    >
      <span className="center buttonSpan">{icon}</span>
      <span style={{ marginLeft: "0.7rem", fontWeight: "500" }}>{text}</span>
    </motion.div>
  );
};

export default SettingComponent;
