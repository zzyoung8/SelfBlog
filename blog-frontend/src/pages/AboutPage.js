import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <h1>关于我</h1>
          <p>了解更多关于我的信息、技能和经历</p>
        </div>
      </section>
      
      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>个人简介</h2>
              <p>我是朱子杨，目前是东华大学软件工程专业的研二在读。</p>
              <p>我之前在<strong>喜马拉雅的P端产品研发部实习了三个月</strong>，参与了 MyClub 这款App 的多个核心模块开发工作。在这段实习中，我实现了多个业务需求，包括<strong>主页高光卡片推荐策略的优化、打赏正逆向履约链路的实现、以及跨平台 Banner 引流系统的优化</strong>。</p>
              <p>去年上半年在为上汽通用做了一个大模型 + RAG的落地项目。该项目主要是应用RAG技术让大模型在面对汽车企业里的规范文档时，能够配合外部知识库 + 大模型获取准确答案，减少员工在查找相关文档上所花费的时间。</p>
              <p>目前我已经发表了一片多行为推荐的论文以及一篇RAG相关的期刊，研究方向是 RAG + LLM，论文方面压力不大，所以可以尽快到岗。</p>
              
              <h2>教育背景</h2>
              <div className="education-item">
                <h3>东华大学</h3>
                <p className="education-period">2022年9月 - 至今</p>
                <p>软件工程专业 | 硕士研究生</p>
                <p>研究方向：RAG+LLM应用研究</p>
              </div>
              
              <div className="education-item">
                <h3>某某大学</h3>
                <p className="education-period">2018年9月 - 2022年6月</p>
                <p>计算机科学与技术 | 学士学位</p>
              </div>
            </div>
            
            <div className="about-sidebar">
              <div className="about-card">
                <img src="/images/avatar0.jpg" alt="个人照片" className="about-avatar" />
                <h3>YOUNG</h3>
                <p className="about-title">软件工程专业研究生</p>
                <div className="about-info">
                  <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <p>上海市松江区东华大学</p>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-envelope"></i>
                    <p>example@email.com</p>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-phone"></i>
                    <p>+86 123 4567 8910</p>
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
              
              <div className="skills-card">
                <h3>技术栈</h3>
                <div className="skill-tags">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 