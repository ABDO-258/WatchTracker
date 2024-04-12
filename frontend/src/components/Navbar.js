import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  const IsLoggedIn = () => {
    fetch('/is_logged_in')
      .then(response => response.json())
      .then(data => {
        if (data.is_logged_in) {
          setIsLoggedIn(true);
        }
      })
      .catch(error => console.error(error));
  };

  const handleClickLogout = () => {
    fetch('/logout') // Replace with your logout API endpoint
      .then(response => {
        if (response.ok) { // Check for successful logout response
          setIsLoggedIn(false); // Update state
          navigate('/'); // Redirect to login page
        } else {
          console.error('Logout failed'); // Handle errors
        }
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    showButton();
    IsLoggedIn();

    
  }, []);

  window.addEventListener('resize', showButton)

  return (
    <>
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to="/" className='navbar-logo' onClick={closeMobileMenu}>
                    WatchTracker <i className="fa-solid fa-city"/>
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                  <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
                </div>
                
                
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                  <li className='nav-item'>
                    <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                      Home
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/Dashboard' className='nav-links' onClick={closeMobileMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/Productes' className='nav-links' onClick={closeMobileMenu}>
                      Productes
                    </Link>
                  </li>
                  {isLoggedIn ? (
                    <>
                      <li>
                        <Link to="/logout"  className='nav-links-mobile' onClick={handleClickLogout} >
                      Logout
                    </Link>
                  </li>
                    </>
                  ) : (
                    <>

                  <li>
                    <Link to='/sign-in' className='nav-links-mobile' onClick={closeMobileMenu}>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                      Sign Up
                    </Link>
                  </li></>)}


                 </ul>
                 
                



                

                 {isLoggedIn ? button && (
  <Link to="/logout" className="btn-container" onClick={handleClickLogout}>
    <Button buttonStyle="btn--outline">LOG OUT</Button>
  </Link>
) : button && (
  <>
    <Link to="/sign-up" className="btn-container">
      <Button buttonStyle="btn--outline">SIGN UP</Button>
    </Link>
    <Link to="/sign-in" className="btn-container">
      <Button buttonStyle="btn--outline">SIGN IN</Button>
    </Link>
  </>
)}
            </div>
        </nav>
    </>
  )
}

export default Navbar
