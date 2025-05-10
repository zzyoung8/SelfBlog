import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BlogPage.css';

const BlogPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 获取博客文章
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // 构建请求URL
        let url = `/api/posts?page=${currentPage - 1}&size=6`;
        if (activeCategory !== 'all') {
          url += `&category=${activeCategory}`;
        }
        if (searchQuery) {
          url += `&search=${searchQuery}`;
        }
        
        const response = await axios.get(url);
        setPosts(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        // 开发时的模拟数据
        setPosts([
          {
            id: 1,
            title: 'Redis 缓存穿透、击穿与雪崩问题的解决方案',
            excerpt: '在高并发系统中，缓存是提高系统性能的重要手段。但是，缓存也带来了一些问题，如缓存穿透、缓存击穿和缓存雪崩。本文将介绍这些问题及其解决方案。',
            coverImage: '/images/blog/redis-small.jpg',
            author: { name: 'YOUNG' },
            categories: [{ name: 'Redis应用' }],
            tags: ['Redis', '缓存', '高并发'],
            publishedAt: '2023-09-22T10:30:00',
            viewCount: 231
          },
          {
            id: 2,
            title: 'RAG系统在企业知识库中的实践与优化',
            excerpt: '随着大语言模型的发展，RAG(Retrieval-Augmented Generation)技术在企业知识库中的应用越来越广泛。本文分享我在上汽通用项目中使用RAG技术的实践经验和优化方法。',
            coverImage: '/images/blog/rag-small.jpg',
            author: { name: 'YOUNG' },
            categories: [{ name: 'RAG/LLM' }],
            tags: ['RAG', 'LLM', '知识库', '大模型'],
            publishedAt: '2023-11-05T14:15:00',
            viewCount: 186
          },
          {
            id: 3,
            title: 'Java并发编程：从JUC到线程池的深入剖析',
            excerpt: '并发编程是Java开发中的重要内容，而JUC(java.util.concurrent)包为我们提供了强大的并发工具。本文将深入剖析JUC包中的核心类和线程池的实现原理。',
            coverImage: '/images/blog/java-small.jpg',
            author: { name: 'YOUNG' },
            categories: [{ name: 'Java开发' }],
            tags: ['Java', 'JUC', '并发编程', '线程池'],
            publishedAt: '2023-08-10T09:45:00',
            viewCount: 152
          }
        ]);
        setTotalPages(3);
      }
    };

    fetchPosts();
  }, [currentPage, activeCategory, searchQuery]);

  // 获取分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error('获取分类失败:', err);
        
        // 开发时的模拟数据
        setCategories([
          { id: 1, name: 'Java开发', postCount: 12 },
          { id: 2, name: 'Spring生态', postCount: 9 },
          { id: 3, name: 'Redis应用', postCount: 7 },
          { id: 4, name: 'RAG/LLM', postCount: 5 },
          { id: 5, name: '数据库优化', postCount: 6 },
          { id: 6, name: '系统架构', postCount: 4 }
        ]);
      }
    };

    fetchCategories();
  }, []);

  // 处理分类切换
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // 重置页码
  };

  // 处理搜索
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 重置页码
  };

  // 处理翻页
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="blog-page">
      <section className="page-header">
        <div className="container">
          <h1>技术博客</h1>
          <p>分享技术文章、编程经验和学习心得</p>
        </div>
      </section>

      <section className="blog-content">
        <div className="container">
          <div className="blog-grid">
            <main className="blog-main">
              <div className="blog-filter">
                <form className="blog-search" onSubmit={handleSearch}>
                  <input 
                    type="text" 
                    placeholder="搜索文章..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit"><i className="fas fa-search"></i></button>
                </form>

                <div className="blog-categories">
                  <button 
                    className={activeCategory === 'all' ? 'active' : ''}
                    onClick={() => handleCategoryChange('all')}
                  >
                    全部
                  </button>
                  {categories.map(category => (
                    <button 
                      key={category.id}
                      className={activeCategory === category.name ? 'active' : ''}
                      onClick={() => handleCategoryChange(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>加载中...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <p>加载失败: {error}</p>
                  <button className="btn" onClick={() => window.location.reload()}>
                    重试
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>没有找到相关文章</p>
                  {searchQuery && (
                    <button className="btn" onClick={() => setSearchQuery('')}>
                      清除搜索
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="post-list">
                    {posts.map(post => (
                      <div className="post-card" key={post.id}>
                        <div className="post-image">
                          <Link to={`/blog/${post.id}`}>
                            <img src={post.coverImage || '/images/blog/default.jpg'} alt={post.title} />
                          </Link>
                        </div>
                        <div className="post-content">
                          <div className="post-meta">
                            <span className="post-date">
                              <i className="far fa-calendar-alt"></i>
                              {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                            </span>
                            <span className="post-views">
                              <i className="far fa-eye"></i>
                              {post.viewCount || 0}
                            </span>
                          </div>
                          <h2 className="post-title">
                            <Link to={`/blog/${post.id}`}>{post.title}</Link>
                          </h2>
                          <p className="post-excerpt">{post.excerpt}</p>
                          <div className="post-footer">
                            <div className="post-tags">
                              {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                                <span key={index}>{tag}</span>
                              ))}
                            </div>
                            <Link to={`/blog/${post.id}`} className="read-more">
                              阅读全文
                              <i className="fas fa-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        className="prev-page"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>

                      {[...Array(totalPages).keys()].map(number => (
                        <button
                          key={number + 1}
                          className={currentPage === number + 1 ? 'active' : ''}
                          onClick={() => handlePageChange(number + 1)}
                        >
                          {number + 1}
                        </button>
                      ))}

                      <button 
                        className="next-page"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>

            <aside className="blog-sidebar">
              <div className="sidebar-widget about-widget">
                <h3>关于我</h3>
                <div className="widget-content">
                  <img src="/images/avatar0.jpg" alt="YOUNG" />
                  <p>软件工程专业研究生，专注于分布式系统、缓存优化与RAG应用研究，乐于分享技术经验。</p>
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

              <div className="sidebar-widget categories-widget">
                <h3>文章分类</h3>
                <div className="widget-content">
                  <ul>
                    {categories.map(category => (
                      <li key={category.id}>
                        <a 
                          href="#!" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategoryChange(category.name);
                          }}
                          className={activeCategory === category.name ? 'active' : ''}
                        >
                          {category.name}
                          <span>{category.postCount}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="sidebar-widget tags-widget">
                <h3>热门标签</h3>
                <div className="widget-content">
                  <div className="tag-cloud">
                    <a href="#!" className="tag-lg">Java</a>
                    <a href="#!" className="tag-md">Spring Boot</a>
                    <a href="#!" className="tag-sm">MyBatis</a>
                    <a href="#!" className="tag-lg">Redis</a>
                    <a href="#!" className="tag-md">RAG</a>
                    <a href="#!" className="tag-lg">LLM</a>
                    <a href="#!" className="tag-sm">Docker</a>
                    <a href="#!" className="tag-md">微服务</a>
                    <a href="#!" className="tag-sm">RocketMQ</a>
                    <a href="#!" className="tag-md">MySQL</a>
                    <a href="#!" className="tag-sm">JUC</a>
                    <a href="#!" className="tag-md">缓存</a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage; 