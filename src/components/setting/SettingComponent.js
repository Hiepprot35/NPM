import React from 'react'

const SettingComponent = ({icon,text,onClick}) => {
    return (
        <div className="center settingComopent hover" onClick={onClick}>
          <span className="center buttonSpan">
        {icon}
          </span>
          <span style={{marginLeft:'0.7rem',fontWeight:"500"}}>{text}</span>
        </div>
      );
}

export default SettingComponent