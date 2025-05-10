import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <p>&copy; {currentYear} YOUNG的个人博客. All Rights Reserved.</p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://weixin.qq.com" target="_blank" rel="noreferrer">
              <i className="fab fa-weixin"></i>
            </a>
            <a href="https://zhihu.com" target="_blank" rel="noreferrer">
              <i className="fab fa-zhihu"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 