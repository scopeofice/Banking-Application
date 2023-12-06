import React, { useEffect, useState } from 'react'
import '../Styles/Navbar.css'
import { Link } from 'react-router-dom'

import avatar from '../../public/profile.svg' 

export default function Navbar() {
  const [user,setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [userDetails, setUserDetails] = useState(user?.accountInfo);
  const [status,setStatus] = useState(user ? "Logout" : "Login");

  const handleLogin=()=>{
    
    if(user){
      setStatus("Login");
      sessionStorage.removeItem("user");
      setUser(null);
      setUserDetails(null);
    }else{
      setStatus("Logout");
    }
  }
  useEffect(()=>{
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setUserDetails(user?.accountInfo);
    setStatus(user ? "Logout" : "Login");
  }, [user])
  return (
    <div className='navbar'>
    <Link to={"/"} className='logo'>ITC <span className='l2'>Bank</span></Link>
      <ul className='nav-menu'>
        {user ?<>
          <li className='nav-menu-item'>
          <Link to={"/user"}  className="nav-link"> <img src={avatar} style={{width: "25px"}} alt="profile" /></Link>
        </li>
        <li className='nav-menu-item'>
          <Link to={"/user"}  className="nav-link">Hy, {userDetails?.accountName}</Link>
        </li>
        <li className='nav-menu-item' style={{color:"grey"}}>|</li></>
        : <></>}
        <li className='nav-menu-item'>
            <Link to='/' className="nav-link">Home</Link>
        </li>
        {user ? 
          <li className='nav-menu-item'>
            <Link to='/login' onClick={handleLogin} className="nav-link">Logout</Link>
        </li>
        :
          <li className='nav-menu-item'>
            <Link to='/login' onClick={handleLogin} className="nav-link">Login</Link>
        </li>
        }
        <li className='nav-menu-item'>
            <Link to='/services' className="nav-link">Services</Link>
        </li>
        <li className='nav-menu-item'>
            <Link to='/about' className="nav-link">About</Link>
        </li>
      </ul>
    </div>
  )
}
