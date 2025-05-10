import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogOwner, setBlogOwner] = useState(null);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/homepage');
        const { blogOwner, featuredPosts, popularPosts } = response.data;
        
        setBlogOwner(blogOwner);
        setFeaturedPosts(featuredPosts || []);
        setPopularPosts(popularPosts || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        // Fallback data for development
        setBlogOwner({
          name: 'YOUNG',
          position: '软件工程专业研究生',
          university: '东华大学',
          researchDirection: 'RAG+LLM研究方向',
          bio: '我是朱子杨，目前是东华大学软件工程专业的研二在读。之前在喜马拉雅的P端产品研发部实习了三个月，参与了 MyClub 这款App 的多个核心模块开发工作。',
          skills: ['Java', 'Spring Boot', 'MyBatis Plus', 'Spring Cloud', 'Redis', 'RocketMQ', 'MySQL', 'Docker', 'Git', 'RAG', 'LLM']
        });
      }
    };

    fetchHomeData();
  }, []);

  if (loading && !blogOwner) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-image">
              <img src="/images/avatar0.jpg" alt={`${blogOwner?.name || 'YOUNG'}的头像`} />
            </div>
            <div className="hero-text">
              <h1>{blogOwner?.name || 'YOUNG'}</h1>
              <h2>{blogOwner?.position || '软件工程专业研究生'}</h2>
              <p>{blogOwner?.university || '东华大学'} | {blogOwner?.researchDirection || 'RAG+LLM研究方向'}</p>
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
        </div>
      </section>

      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">关于我</h2>
          <div className="about-content">
            <div className="about-text">
              <p>{blogOwner?.bio || '我是朱子杨，目前是东华大学软件工程专业的研二在读。'}</p>
              <p>我之前在<strong>喜马拉雅的P端产品研发部实习了三个月</strong>，参与了 MyClub 这款App 的多个核心模块开发工作。在这段实习中，我实现了多个业务需求，包括<strong>主页高光卡片推荐策略的优化、打赏正逆向履约链路的实现、以及跨平台 Banner 引流系统的优化</strong>。</p>
              <p>去年上半年在为上汽通用做了一个大模型 + RAG的落地项目。该项目主要是应用RAG技术让大模型在面对汽车企业里的规范文档时，能够配合外部知识库 + 大模型获取准确答案，减少员工在查找相关文档上所花费的时间。</p>
              <p>目前我已经发表了一片多行为推荐的论文以及一篇RAG相关的期刊，研究方向是 RAG + LLM，论文方面压力不大，所以可以尽快到岗。</p>
            </div>
            <div className="skills">
              <h3>技术栈</h3>
              <div className="skill-tags">
                {blogOwner?.skills ? (
                  blogOwner.skills.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))
                ) : (
                  <>
                    <span>Java</span>
                    <span>Spring Boot</span>
                    <span>MyBatis Plus</span>
                    <span>Spring Cloud</span>
                    <span>Redis</span>
                    <span>RocketMQ</span>
                    <span>MySQL</span>
                    <span>Docker</span>
                    <span>Git</span>
                    <span>RAG</span>
                    <span>LLM</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">项目经历</h2>
          <div className="project-grid">
            <div className="project-card">
              <div className="project-image">
                <img src="/images/xima.png" alt="喜马拉雅项目" />
              </div>
              <div className="project-content">
                <h3>喜马拉雅 MyClub App开发</h3>
                <p>在喜马拉雅P端产品研发部实习期间，参与了MyClub App的核心模块开发，包括主页高光卡片推荐策略优化、打赏正逆向履约链路实现以及跨平台Banner引流系统优化。</p>
                <div className="project-tags">
                  <span>Java</span>
                  <span>Spring Boot</span>
                  <span>RocketMQ</span>
                  <span>Redis</span>
                </div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/images/saic.png" alt="上汽通用RAG项目" />
              </div>
              <div className="project-content">
                <h3>上汽通用 RAG+LLM落地项目</h3>
                <p>为上汽通用开发的大模型+RAG落地项目，应用RAG技术使大模型能够在面对汽车企业规范文档时，配合外部知识库获取准确答案，减少员工查找文档的时间。</p>
                <div className="project-tags">
                  <span>RAG</span>
                  <span>LLM</span>
                  <span>知识库</span>
                </div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/images/dianping.png" alt="仿大众点评项目" />
              </div>
              <div className="project-content">
                <h3>仿大众点评项目</h3>
                <p>一个学习项目，仿制大众点评平台，主要使用Redis解决数据一致性以及高并发下可能存在的超卖问题等。</p>
                <div className="project-tags">
                  <span>Java</span>
                  <span>Spring Boot</span>
                  <span>Redis</span>
                  <span>MySQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section id="blog" className="blog-preview">
          <div className="container">
            <h2 className="section-title">最新文章</h2>
            <div className="blog-post-grid">
              {featuredPosts.map(post => (
                <div className="blog-post-card" key={post.id}>
                  <div className="blog-post-image">
                    <img src={post.coverImage || '/images/blog/default.jpg'} alt={post.title} />
                  </div>
                  <div className="blog-post-content">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-post-meta">
                      <span className="date">
                        <i className="far fa-calendar"></i>
                        {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                      </span>
                      <Link to={`/blog/${post.id}`} className="read-more">
                        阅读更多
                        <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="blog-view-all">
              <Link to="/blog" className="btn">查看全部文章</Link>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">联系我</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <p>example@email.com</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <p>+86 123 4567 8910</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <p>上海市松江区东华大学</p>
              </div>
            </div>
            <div className="contact-form">
              <form id="contactForm">
                <div className="form-group">
                  <input type="text" id="name" placeholder="您的姓名" required />
                </div>
                <div className="form-group">
                  <input type="email" id="email" placeholder="您的邮箱" required />
                </div>
                <div className="form-group">
                  <textarea id="message" placeholder="您的留言" required></textarea>
                </div>
                <button type="submit" className="btn">发送留言</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 