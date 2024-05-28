import React from 'react'

export default function MiniRp({children}) {
  return (
    <div className='center minirp' style={{position:"fixed",left:"2rem",bottom:"2rem",display:"inline"}}>
        <p>

        {children}
        </p>
    </div>
  )
}
