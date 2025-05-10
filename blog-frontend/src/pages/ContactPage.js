import React, { useState } from 'react';
import axios from 'axios';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    error: null
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 实际项目中使用后端API
      // await axios.post('/api/contact', formData);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormStatus({
        submitted: true,
        success: true,
        error: null
      });
      
      // 重置表单
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setFormStatus({
        submitted: true,
        success: false,
        error: err.message || '发送失败，请稍后再试'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1>联系我</h1>
          <p>如果您有任何问题或合作意向，请随时与我联系</p>
        </div>
      </section>
      
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-container">
              <h2>发送消息</h2>
              
              {formStatus.submitted && formStatus.success ? (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <h3>消息发送成功！</h3>
                  <p>感谢您的留言，我会尽快回复您。</p>
                  <button 
                    className="btn" 
                    onClick={() => setFormStatus(prev => ({ ...prev, submitted: false }))}
                  >
                    发送新消息
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">姓名</label>
                      <input 
                        type="text" 
                        id="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="您的姓名" 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">邮箱</label>
                      <input 
                        type="email" 
                        id="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="您的邮箱" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">主题</label>
                    <input 
                      type="text" 
                      id="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="消息主题" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">留言内容</label>
                    <textarea 
                      id="message" 
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="请输入您的留言内容..." 
                      rows="6" 
                      required
                    ></textarea>
                  </div>
                  
                  {formStatus.error && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i>
                      <p>{formStatus.error}</p>
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className={`btn submit-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>发送中...</span>
                      </>
                    ) : '发送消息'}
                  </button>
                </form>
              )}
            </div>
            
            <div className="contact-info-container">
              <div className="contact-info-card">
                <h2>联系方式</h2>
                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="details">
                      <h3>邮箱</h3>
                      <p>example@email.com</p>
                    </div>
                  </div>
                  
                  <div className="contact-info-item">
                    <div className="icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="details">
                      <h3>电话</h3>
                      <p>+86 123 4567 8910</p>
                    </div>
                  </div>
                  
                  <div className="contact-info-item">
                    <div className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="details">
                      <h3>地址</h3>
                      <p>上海市松江区东华大学</p>
                    </div>
                  </div>
                </div>
                
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
              
              <div className="map-container">
                <h3>位置</h3>
                <div className="map-placeholder">
                  <img src="/images/map-placeholder.jpg" alt="地图位置" />
                  <div className="map-overlay">
                    <p>地图加载中...</p>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn">
                      在 Google Maps 中查看
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 