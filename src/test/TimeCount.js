import { useEffect, useState } from "react";
function TimeCount() {
    const [avatar,setAvatar]=useState()
    const [time, setTime] = useState(180)
    if(time<=0)
    {
        setTime(180)
    }
    useEffect(() => {

        const timeId=setInterval(()=>setTime(pre=>pre-1),1000);

        // return(
        //    ()=>console.log('Clearup')
        // )
    }, []
    )
    useEffect(()=>
    {
        return( avatar && URL.revokeObjectURL(avatar.preview)
    
    )}
    ,[avatar])
    const pickAvatar=(e)=>
    {
        const file=e.target.files[0]
        file.preview=URL.createObjectURL(file);

        setAvatar(file)
    }
    return (
        <div>
        <input
        type="file"
        multiple
        onChange={pickAvatar}
        
        />
        {avatar&&(<img src={avatar.preview} width="10%"/>)}
        </div>
    )
}
export default TimeCount;