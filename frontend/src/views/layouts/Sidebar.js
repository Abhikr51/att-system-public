import React from 'react'

import ExitToApp from '@mui/icons-material/ExitToApp';
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined';
import { NavLink } from 'react-router-dom'
import _routes from '../../_routes';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../store/actions/AuthActions';
const Sidebar = () => {
    const dispatch = useDispatch()
    return (
        <div className="sidebar">
            <h4 className='text-center' style={{ fontWeight: "900" }} > ATT - System</h4>
            <hr />
            <ul className='main-content' >
                {
                    _routes.app_sidebar.routes.map((r,index)=>(
                        <li key={index} >
                            <NavLink to={r.path} className='link' >{r.icon} &nbsp; {r.name}</NavLink>
                        </li>
                    ))
                }
            </ul>
            <hr />
            <ul className='footer-content'>
                <li >
                    <span onClick={()=>dispatch(setLogout())} className='link' ><ExitToApp style={{ color: "white" }} /> &nbsp; Logout</span>
                </li>
                <li >
                    <span  className='link' ><CopyrightOutlinedIcon style={{ color: "white" }} /> &nbsp; 2023 It'z Abhi</span>
                </li>
            </ul>
        </div>
    )
}
export default Sidebar;

