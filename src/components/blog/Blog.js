import React from "react";

export default function Blog() {
  const blog = {
    title: "Turn on your device from distraction into time saver either",
    background:
      "https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/468096955_3818599325021801_70167998306230317_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=_KPpOO7vD3MQ7kNvgHIsVRx&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AI63Zcf4V7GRunrPCcrgrB4&oh=00_AYAnERm-1IFIfXBI1WnW86ySaeB2nz7UE2G3kit7zidAEw&oe=674761A1",
    body: [
      {
        content: "Xin chào các bạn heheheheheheh, img",
        line_num: 1,
        type: "text",
      },
      {
        content:
          "https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/468096955_3818599325021801_70167998306230317_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=_KPpOO7vD3MQ7kNvgHIsVRx&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AI63Zcf4V7GRunrPCcrgrB4&oh=00_AYAnERm-1IFIfXBI1WnW86ySaeB2nz7UE2G3kit7zidAEw&oe=674761A1",
        line_num: 2,
        description: "Xin chào mọi người",
        type: "img",
      },
      {
        content: "Xin chào các bạn heheheheheheh, img",
        line_num: 1,
        type: "text",
      },
    ],
    user: {
      name: "Tuấn Hiệp",
      avt: "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/405813645_3546932775521792_6032231012759654691_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=jrT3vVprDTwQ7kNvgGjnDC0&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AQVhHXS4HuV4M1i4TWcJERm&oh=00_AYBJfw8HMMldoX3j-_zM9D02hlzKZ1QvuHv5-hLnYyRpHA&oe=67475EDE",
    },
    timeRead: "10 minutes",
  };
  return (
    <div className=" w-screen text-wrap	 ">
      <div
        className="headerBlog h-50vh"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: `url(${blog.background})`,
        }}
      >
        <div
          className="text-6xl w-full h-full  flex justify-between items-end "
          style={{ backgroundColor: "#00000070" }}
        >
          <div className="titleBlog w-1/3 m-12">
            <h1 className="text-white	">{blog.title}</h1>
          </div>
          <div className="userBlog w-1/3 m-12 flex justify-end">
            <div>
              <h1 className="text-white">{blog.user.name}</h1>
              <img
                alt="ok"
                className="avatarImage w-16"
                src={blog.user.avt}
              ></img>
            </div>
            <p>{blog.timeRead}</p>
          </div>
        </div>
      </div>
      <div className="contentBlog center">
        <div className="w-3/4" style={{ margin: "0" }}>
          {blog.body.map((e) => {
            return (
              <div>
                {e.type === "text" && e.content}
                {e.type === "img" && (
                  <div className="w-full center my-6">
                    <div className="w-1/2">
                      <img src={e.content}></img>
                      <div className="center">
                        <span className="italic ">{e.description}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="footerBlog">Footer</div>
    </div>
  );
}
