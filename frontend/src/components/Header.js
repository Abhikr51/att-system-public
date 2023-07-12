import React from 'react'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import {useSelector} from "react-redux"
import { public_url } from '../config/AppData';
const Header = () => {
    const auth = useSelector(s=>s.auth)
    return (
        <header className='header'>
            <form className="search-box">
                <input type="text" placeholder='Search for student or teacher .' />
                <button onClick={(e) => e.preventDefault()} type='submit'>
                    <SearchOutlined />
                </button>
            </form>
            <div style={{display:'flex' , marginLeft : "10px"}}  >
                <div style={{ backgroundImage: `url('${public_url}/avatar.jpeg')` }} className="avatar">
                </div>
                <div className="name d-none d-md-block">
                    Hey, {auth.user.details.first_name} &nbsp;
                    <ArrowDropDownOutlinedIcon />
                </div>
            </div>
        </header>
    )
}

export default Header