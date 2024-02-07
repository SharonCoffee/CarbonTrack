import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Navbar = () => {
  const { currentUser, userRole } = useAuth();

  return (
        <>
            <header className="navbar-header">
                CarbonTrack
            </header>
            <nav className="navbar">
                <ul className="navbar-nav">
                    <li><NavLink to="/" exact activeClassName="active">Home</NavLink></li>
                    <li><NavLink to="/about" activeClassName="active">About</NavLink></li>
                    <li><NavLink to="/contact" activeClassName="active">Contact</NavLink></li>
                    <li><NavLink to="/faq" activeClassName="active">FAQ</NavLink></li>
                    {currentUser && userRole === 'PolicyMaker' && (
                        <li><NavLink to="/graphquery" activeClassName="active">GraphQuery</NavLink></li>
                    )}
                    {currentUser && userRole === 'Homeowner' && (
                        <li><NavLink to="/ber" activeClassName="active">BerRating</NavLink></li>
                    )}
                </ul>
            </nav>
        </>
  );
};

export default Navbar;
