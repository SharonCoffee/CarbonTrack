import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Navbar = () => {
  const { currentUser } = useAuth(); // Temporarily ignoring userRole for demonstration

  // Function to dynamically set NavLink className based on isActive parameter
  const getNavLinkClass = (isActive) => isActive ? 'active' : '';

  return (
        <>
            <header className="navbar-header">
                <span className="carbon">Carbon</span><span className="track">Track</span>
            </header>
            <nav className="navbar">
                <ul className="navbar-nav">
                    <li><NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)}>Home</NavLink></li>
                    <li><NavLink to="/about" className={({ isActive }) => getNavLinkClass(isActive)}>About</NavLink></li>
                    <li><NavLink to="/contact" className={({ isActive }) => getNavLinkClass(isActive)}>Contact</NavLink></li>
                    <li><NavLink to="/faq" className={({ isActive }) => getNavLinkClass(isActive)}>FAQ</NavLink></li>
                    {currentUser && (
                        <>
                            <li><NavLink to="/BerRatingForm"
                                         className={({ isActive }) => getNavLinkClass(isActive)}>BerRating</NavLink>
                            </li>
                            <li><NavLink to="/suggestions"
                                         className={({ isActive }) => getNavLinkClass(isActive)}>Suggestions</NavLink>
                            </li>
                            <li><NavLink to="/countymap"
                                         className={({ isActive }) => getNavLinkClass(isActive)}>County Map</NavLink>
                            </li>
                            <li><NavLink to="/dashboard"
                                            className={({ isActive }) => getNavLinkClass(isActive)}>Residential Retrofitting Dashboard</NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
  );
};

export default Navbar;
