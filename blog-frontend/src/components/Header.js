import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <nav>
          <div className="logo">
            <Link to="/" onClick={closeMenu}>YOUNG</Link>
          </div>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li>
              <NavLink to="/" onClick={closeMenu}>首页</NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMenu}>关于我</NavLink>
            </li>
            <li>
              <NavLink to="/blog" onClick={closeMenu}>技术分享</NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={closeMenu}>联系我</NavLink>
            </li>
          </ul>
          <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
