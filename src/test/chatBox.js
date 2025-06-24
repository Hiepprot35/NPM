import { useState } from "react";

function ChatBox() {

    const [avatar, setAvatar] = useState([]);
    function printFileName(e) {
        const fileAvatar = e.target.files[0];
        const localAvatar = URL.createObjectURL(fileAvatar)
        setAvatar(localAvatar);
       console.log(fileAvatar);
    }
    const lessons = [{
        id: '1',
        name: 'Js'
    }
        ,
    {
        id: '2',
        name: 'CSS'
    },
    {
        id: '3',
        name: 'HTML'
    }

    ]
    return (

        <div>
            <form method="GET">

                {
                    lessons.map((lesson) => {
                        return (<h1>{lesson.name}</h1>
                        )
                    })
                }
                <input
                    type="file"
                    onChange={printFileName}
                ></input>
                <img
                    src={avatar}
                    style={{
                        width: "40%"
                    }}

                ></img>
                <button
                    type="submit"
                >Save Picture</button>
            </form>

        </div>
    )
}
export default ChatBox;