import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>页面未找到</h1>
          <p>很抱歉，您访问的页面不存在或已被移除。</p>
          <div className="not-found-actions">
            <Link to="/" className="btn">
              返回首页
            </Link>
            <Link to="/blog" className="btn btn-outline">
              浏览博客
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 