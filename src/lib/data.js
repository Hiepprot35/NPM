import React from "react";
import { FiMessageCircle,FiHome } from "react-icons/fi";
import { IconsManifest } from "react-icons/lib";
export const   links = [
    {
        name: "Home",
        hash: "#home"
    },
    {
        name: "About",
        hash: "#about"
    },
    {
        name: "Project",
        hash: "#project"
    },
    {
        name: "Skill",
        hash: "#skill"
    },
    // {
    //     name: "Contact",
    //     hash: "#contact"
    // },
    // {
    //     name: "Experience",
    //     hash: "#experience"
    // },
]
export const myproject=[
    {
        title:"Student Manager",
        description:"Student management application and includes realtime chat using NodeJS, ReactJS and MySQL",
        tags:["ReactJS","NodeJS","MySQL","CSS","HTML","Express"],
        link:"https://tuanhiepprot3.netlify.app/",
        img:"https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/375476631_123836707457477_5358004110519219270_n.png?_nc_cat=109&ccb=1-7&_nc_sid=ae9488&_nc_ohc=zp68zpD158gAX84DgO5&_nc_ht=scontent.fsgn2-4.fna&oh=03_AdRgcjf2ye1YN_jH2EetH7yQOJ5nBTVa1_SmrpSxl8BJ_A&oe=65240403"
    }
]
export const header_Student=[
    
        {
            name: "Home",
            hash: "/home",
            role:[1,2],
            return:<FiHome></FiHome>

        },
        
        {
            name: "Đăng kí học",
            hash: "/dangkilop",
            role:[2],
            
        },
        {
            name: "Message",
            hash: "/message",
            role:[1,2],
            return:<FiMessageCircle></FiMessageCircle>
        },
        {
            name:"Xem lịch học",
            hash:"/lichhoc",
            role:[2]
        }
        ,{
            name:"Thêm sinh viên",
            hash:"/create",
            role:[1]

        }
    
]