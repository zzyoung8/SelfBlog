import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './BlogPostPage.css';

const BlogPostPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        // 获取文章详情
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
        
        // 增加浏览量
        await axios.post(`/api/posts/${id}/view`);
        
        // 获取相关文章
        const relatedResponse = await axios.get(`/api/posts/${id}/related`);
        setRelatedPosts(relatedResponse.data || []);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        // 开发时模拟数据
        if (id === '1') {
          setPost({
            id: 1,
            title: 'Redis 缓存穿透、击穿与雪崩问题的解决方案',
            content: `<p>在高并发系统中，缓存是提高系统性能的重要手段。但是，缓存也带来了一些问题，如缓存穿透、缓存击穿和缓存雪崩。本文将介绍这些问题及其解决方案。</p>
            <h2>一、缓存穿透</h2>
            <p><strong>问题描述：</strong>缓存穿透是指查询一个不存在的数据，由于缓存是不命中时需要从数据库查询，查不到数据则不写入缓存，这将导致这个不存在的数据每次请求都要到数据库去查询，造成数据库压力过大。</p>
            <p><strong>解决方案：</strong></p>
            <ol>
              <li><strong>布隆过滤器：</strong>布隆过滤器是一种数据结构，用于判断一个元素是否在一个集合中。把所有可能存在的数据哈希到一个足够大的bitmap中，一个一定不存在的数据会被这个bitmap拦截掉，从而避免了对底层存储系统的查询压力。</li>
              <li><strong>缓存空值：</strong>如果一个查询返回的数据为空（不管是数据不存在，还是系统故障），我们仍然把这个空结果进行缓存，但它的过期时间会很短，最长不超过五分钟。</li>
            </ol>
            <h2>二、缓存击穿</h2>
            <p><strong>问题描述：</strong>缓存击穿是指某个热点key在过期的瞬间，同时有大量的请求打在这个key上，由于缓存过期，这些请求都会直接打到数据库上，就像是在一瞬间击穿了缓存一样。</p>
            <p><strong>解决方案：</strong></p>
            <ol>
              <li><strong>互斥锁：</strong>在缓存失效的时候，不是立即去load数据库，而是先使用分布式锁，保证只有一个线程去查询数据库，其他线程等待。</li>
              <li><strong>永不过期：</strong>从缓存层面来看，没有设置过期时间，所以不会出现缓存过期。而是为每个key设置一个逻辑过期时间，当发现过期时，通过一个后台线程进行缓存的构建。</li>
            </ol>
            <h2>三、缓存雪崩</h2>
            <p><strong>问题描述：</strong>缓存雪崩是指在某一个时间段，缓存集中过期或者缓存服务宕机，导致大量的请求都直接落到数据库上，造成数据库瞬时压力过大而崩溃。</p>
            <p><strong>解决方案：</strong></p>
            <ol>
              <li><strong>缓存失效时间分散：</strong>在原有的失效时间基础上增加一个随机值，比如1-5分钟随机，这样每一个缓存的过期时间的重复率就会降低，就很难引发集体失效的事件。</li>
              <li><strong>热点数据永不过期：</strong>对于一些热点数据，可以设置永不过期，然后通过后台异步更新缓存。</li>
              <li><strong>服务熔断降级：</strong>当检测到系统负载过高时，临时降低服务质量或停止服务，等待系统恢复正常后再继续提供服务。</li>
              <li><strong>多级缓存：</strong>设置多级缓存，例如本地缓存+Redis缓存，即使Redis宕机，本地缓存仍然可以提供服务。</li>
              <li><strong>Redis高可用：</strong>采用Redis集群，避免单机Redis服务不可用造成的缓存雪崩。</li>
            </ol>
            <h2>总结</h2>
            <p>缓存穿透、缓存击穿和缓存雪崩都是高并发系统中常见的问题，了解这些问题并采取对应的解决方案可以有效提高系统的稳定性和性能。在实际系统设计中，应该根据业务特点和系统需求选择合适的解决方案。</p>`,
            coverImage: '/images/blog/redis-small.jpg',
            author: { name: 'YOUNG', profileImage: '/images/avatar0.jpg' },
            categories: [{ id: 3, name: 'Redis应用' }],
            tags: ['Redis', '缓存', '高并发'],
            publishedAt: '2023-09-22T10:30:00',
            updatedAt: '2023-09-25T15:20:00',
            viewCount: 231
          });
          
          setRelatedPosts([
            {
              id: 4,
              title: 'Redis实现分布式锁的最佳实践',
              excerpt: '在分布式系统中，锁是一种重要的同步机制。本文介绍如何使用Redis实现一个高效、可靠的分布式锁。',
              coverImage: '/images/blog/redis2-small.jpg',
              publishedAt: '2023-10-15T09:30:00'
            },
            {
              id: 5,
              title: '使用Redis优化数据库查询性能',
              excerpt: '数据库是系统性能的瓶颈之一，本文分享如何使用Redis缓存策略来优化数据库查询性能。',
              coverImage: '/images/blog/redis3-small.jpg',
              publishedAt: '2023-08-05T14:20:00'
            }
          ]);
        }
      }
    };

    fetchPost();
    
    // 滚动到页面顶部
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <div className="error-container">
            <h2>文章加载失败</h2>
            <p>{error || '未找到该文章'}</p>
            <Link to="/blog" className="btn">返回博客列表</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="post-header" style={{ backgroundImage: `url(${post.coverImage || '/images/blog/default.jpg'})` }}>
        <div className="container">
          <div className="post-header-content">
            <div className="post-categories">
              {post.categories && post.categories.map(category => (
                <Link to={`/blog?category=${category.name}`} key={category.id}>
                  {category.name}
                </Link>
              ))}
            </div>
            <h1>{post.title}</h1>
            <div className="post-meta">
              <div className="post-author">
                <img src={post.author?.profileImage || '/images/avatar0.jpg'} alt={post.author?.name} />
                <span>{post.author?.name}</span>
              </div>
              <div className="post-info">
                <span className="post-date">
                  <i className="far fa-calendar-alt"></i>
                  {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                </span>
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <span className="post-updated">
                    <i className="far fa-edit"></i>
                    更新于 {new Date(post.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                )}
                <span className="post-views">
                  <i className="far fa-eye"></i>
                  {post.viewCount || 0} 阅读
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="post-content">
        <div className="container">
          <div className="post-grid">
            <main className="post-main">
              <article className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></article>
              
              <div className="post-tags">
                <span className="tags-title">标签：</span>
                {post.tags && post.tags.map((tag, index) => (
                  <Link to={`/blog?search=${tag}`} key={index} className="tag">
                    {tag}
                  </Link>
                ))}
              </div>
              
              <div className="post-nav">
                <Link to="/blog" className="btn back-btn">
                  <i className="fas fa-arrow-left"></i> 返回博客列表
                </Link>
              </div>
              
              {relatedPosts.length > 0 && (
                <div className="related-posts">
                  <h3>相关文章</h3>
                  <div className="related-posts-grid">
                    {relatedPosts.map(relatedPost => (
                      <div className="related-post-card" key={relatedPost.id}>
                        <Link to={`/blog/${relatedPost.id}`}>
                          <div className="related-post-image">
                            <img src={relatedPost.coverImage || '/images/blog/default.jpg'} alt={relatedPost.title} />
                          </div>
                          <div className="related-post-content">
                            <h4>{relatedPost.title}</h4>
                            <p>{relatedPost.excerpt}</p>
                            <span className="related-post-date">
                              {new Date(relatedPost.publishedAt).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
            
            <aside className="post-sidebar">
              <div className="sidebar-widget about-author-widget">
                <h3>关于作者</h3>
                <div className="author-card">
                  <img src={post.author?.profileImage || '/images/avatar0.jpg'} alt={post.author?.name} />
                  <h4>{post.author?.name || 'YOUNG'}</h4>
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
              
              <div className="sidebar-widget toc-widget">
                <h3>目录</h3>
                <div className="toc-content">
                  <ul>
                    <li><a href="#一、缓存穿透">一、缓存穿透</a></li>
                    <li><a href="#二、缓存击穿">二、缓存击穿</a></li>
                    <li><a href="#三、缓存雪崩">三、缓存雪崩</a></li>
                    <li><a href="#总结">总结</a></li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage; 