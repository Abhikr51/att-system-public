import React from 'react'
import Header from '../../components/Header'
import Sidebar from './Sidebar'

const Panel = ({children}) => {
  return (
    <div className='panel wrapper' >
        <Sidebar />
        <div className="main">
            <div className="main-area">
                <Header/>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Panel