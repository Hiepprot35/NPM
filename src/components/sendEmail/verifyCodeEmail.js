import { useEffect, useRef } from "react"


export default function VerifyCodeEmail(props)
{
    return(
        
            <div className="dangnhap_input_div">
              {/* <p>Verify code sent to {infoToSendGmail?.to}</p> */}
              <div className='verifycode_div'>
              <p className="report_text" >
                  Sent to: {props.infoToSendGmail?.to}
                </p>
              <input
                  type="password"
                  name="password"
                  style={{"margin":"1rem 0 1rem 0"}}
                  placeholder="Code"
                  className=""
                  defaultValue=""
                  onChange={(e)=>{props.setVerifyCodeInput(e.target.value)}}
/>
                <button
                  type="submit"
                  className="sumbit"
                  defaultValue="Đăng nhập"
                  onClick={props.submitVerifycode}
                  style={{ marginLeft: "1rem" }}
                > Submit </button>
              </div>
            </div>
    )  
}