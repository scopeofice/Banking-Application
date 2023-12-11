import React, { useEffect, useState } from 'react';
import '../Styles/Navbar.css';
import { Link } from 'react-router-dom';
import avatar from '../../public/profile.svg';

export default function Navbar() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [userDetails, setUserDetails] = useState(user?.accountInfo);
  const [status, setStatus] = useState(user ? 'Logout' : 'Login');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    if (user) {
      setStatus('Login');
      sessionStorage.removeItem('user');
      setUser(null);
      setUserDetails(null);
    } else {
      setStatus('Logout');
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')));
    setUserDetails(user?.accountInfo);
    setStatus(user ? 'Logout' : 'Login');
  }, [user]);

  return (
    <div className='navbar'>
      <Link to={'/'} className='logo'>
        ITC <span className='l2'>Bank</span>
      </Link>

      <div className={`mobile-menu-icon ${isMobileMenuOpen ? 'open' : ''}`} onClick={handleMobileMenuToggle}>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
      </div>

      <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        {user ? (
          <>
            <li className='nav-menu-item'>
              <Link to={'/user'} className='nav-link' onClick={closeMobileMenu}>
                Hy, {userDetails?.accountName}
              </Link>
            </li>
          </>
        ) : (
          <></>
        )}
        <li className='nav-menu-item'>
          <Link to='/' className='nav-link' onClick={closeMobileMenu}>
            Home
          </Link>
        </li>
        {user ? (
          <li className='nav-menu-item'>
            <Link to='/login' onClick={handleLogin} className='nav-link' onClick={closeMobileMenu}>
              Logout
            </Link>
          </li>
        ) : (
          <li className='nav-menu-item'>
            <Link to='/login' onClick={handleLogin} className='nav-link' onClick={closeMobileMenu}>
              Login
            </Link>
          </li>
        )}
        <li className='nav-menu-item'>
          <Link to='/services' className='nav-link' onClick={closeMobileMenu}>
            Services
          </Link>
        </li>
        <li className='nav-menu-item'>
          <Link to='/about' className='nav-link' onClick={closeMobileMenu}>
            About
          </Link>
        </li>
      </ul>
    </div>
  );
}
