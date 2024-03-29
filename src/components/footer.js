import React from 'react';

const Footer = () => {
  return (
        <footer className="footer">
            <div className="footer-content">
                <p>© 2024 CarbonTrack. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/about">About Us</a> |
                    <a href="/contact">Contact</a> |
                    <a href="/faq">Frequently Asked Questions</a> |
                    <a href="/privacy">Privacy Policy</a>
                </div>
                <div className="social-media">
                    <a href="https://twitter.com/CarbonTrack" target="_blank" rel="noopener noreferrer">Twitter</a> |
                    <a href="https://facebook.com/CarbonTrack" target="_blank" rel="noopener noreferrer">Facebook</a> |
                    <a href="https://linkedin.com/company/CarbonTrack" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
            </div>
        </footer>
  );
};

export default Footer;
