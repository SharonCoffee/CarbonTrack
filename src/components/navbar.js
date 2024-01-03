import React from 'react';
import { NavLink } from 'react-router-dom';

// link with navbar.css
import './css/navbar.css';


const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">CarbonTrack</div>
            <ul className="navbar-nav">
                <li><NavLink to="/" exact activeClassName="active">Home</NavLink></li>
                <li><NavLink to="/about" activeClassName="active">About</NavLink></li>
                <li><NavLink to="/contact" activeClassName="active">Contact</NavLink></li>
                {/* Add more navigation links here as needed */}
            </ul>
        </nav>
    );
};

export default Navbar;
