import React from 'react'

export default function Test(props) {
  return (
    <div className={`test${props.name}`}>
        <p>

        {props.name}
        </p>
    
    <button onClick={props.close}>Click</button>
    </div>
  )
}
