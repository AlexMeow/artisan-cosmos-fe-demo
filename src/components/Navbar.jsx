import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../assets/css/templatemo-cyborg-gaming.css';
import '../assets/css/animate.css';
import LOGO from '../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        setMenuActive(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('jwt');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // 新增監聽器
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [])


  return (
    <header className="header-area header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              {/* LOGO */}
              <Link to="/" className="logo">
                <img src={LOGO} alt="Cyborg Template" />
              </Link>
              {/* SEARCH BAR */}
              <div className="search-input">
                <form id="search" action="#">
                  <input
                    type="text"
                    placeholder="Search Artworks..."
                    id="searchText"
                    name="searchKeyword"
                    onKeyUp={(event) => {
                      // TBD
                      // Just focus on artworks search.
                    }}
                  />
                  <i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
                </form>
              </div>
              {/* NAVIGATION MENU */}
              <ul className={`nav ${menuActive ? 'show' : ''}`}>
                <li className="nav-item">
                  <NavLink exact to="/" className="nav-link" activeClassName="active">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/browse" className="nav-link" activeClassName="active">
                    Browse
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/artists" className="nav-link" activeClassName="active">
                    Artists
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/profile" className="nav-link" activeClassName="active">
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  {!isLoggedIn ? (<NavLink to="/login" className="nav-link" activeClassName="active">
                    Sign In / Sign Up
                  </NavLink>) : (<a className="nav-link" activeClassName="active" onClick={logout}>
                    Log out
                  </a>)}
                </li>
              </ul>
              {/* MENU TRIGGER */}
              <span className={`menu-trigger ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
                <span>Menu</span>
              </span>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;