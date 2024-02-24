export default function VerifyCodeEmail(props)
{
    return(
        
            <div className="dangnhap_input_div">
              {/* <p>Verify code sent to {infoToSendGmail?.to}</p> */}
              <div className='verifycode_div'>
              <p className="" id="labelPassword">
                  Đã gửi mã xác thực đến email: {props.infoToSendGmail?.to}
                </p>
              <input
                  type="password"
                  name="password"
                  className=""
                  defaultValue=""
                  id="input_code"
                  ref={props.verifyCodeInput}
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