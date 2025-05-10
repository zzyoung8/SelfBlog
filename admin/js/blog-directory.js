// Blog Directory Generator
// 这个脚本用于自动扫描blog-posts目录，并在技术博客页面显示文章列表

document.addEventListener('DOMContentLoaded', function() {
    // 博客文章容器
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return; // 如果不在博客页面，直接返回
    
    // 模拟文章数据 (实际应用中这部分应该由后端提供或通过AJAX从json文件加载)
    // 在静态网站中，我们可以在此维护手动更新的文章列表
    const blogPosts = [
        {
            id: 'redis-cache-issues',
            title: 'Redis 缓存穿透、击穿与雪崩问题的解决方案',
            excerpt: '本文详细介绍了Redis缓存面临的三大问题：缓存穿透、缓存击穿和缓存雪崩，分析了各种场景下的解决方案和最佳实践。',
            category: 'redis',
            tags: ['Redis', '缓存', '高并发'],
            date: '2023-09-22',
            readTime: 8,
            featuredImage: '../images/blog/redis.jpg',
            url: '../blog-posts/redis-cache-issues.html'
        }
        // 添加更多文章...
    ];
    
    // 动态加载已保存的已发布文章（如果有）
    loadSavedPublishedPosts();
    
    // 渲染文章网格
    renderBlogPosts(blogPosts);
    
    // 添加分类过滤功能
    setupCategoryFilters(blogPosts);
    
    // 添加文章搜索功能
    setupSearch(blogPosts);
});

// 加载保存在localStorage中的已发布文章
function loadSavedPublishedPosts() {
    try {
        const drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
        // 只获取已发布状态的文章
        const publishedPosts = drafts.filter(draft => draft.status === 'published');
        
        if (publishedPosts.length > 0) {
            // 更新全局文章数组
            publishedPosts.forEach(post => {
                // 生成URL (在真实环境中，这应该指向实际生成的HTML文件)
                const fileName = post.title
                    .toLowerCase()
                    .replace(/[^\w\s]/gi, '')
                    .replace(/\s+/g, '-') + '.html';
                
                // 将文章添加到数组中（避免重复）
                const exists = blogPosts.some(existingPost => existingPost.id === post.id);
                if (!exists) {
                    blogPosts.push({
                        id: post.id,
                        title: post.title,
                        excerpt: post.excerpt,
                        category: post.category,
                        tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : [],
                        date: new Date(post.lastSaved).toISOString().slice(0, 10),
                        readTime: post.readTime,
                        featuredImage: post.featuredImage || '../images/blog/placeholder.jpg',
                        url: '../blog-posts/' + fileName
                    });
                }
            });
        }
    } catch (error) {
        console.error('加载已发布文章时出错:', error);
    }
}

// 渲染博客文章列表
function renderBlogPosts(posts, filterCategory = null, searchQuery = null) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    // 清空当前内容
    blogGrid.innerHTML = '';
    
    // 过滤文章
    let filteredPosts = posts;
    
    // 按分类过滤
    if (filterCategory && filterCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === filterCategory);
    }
    
    // 按搜索关键词过滤
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.excerpt.toLowerCase().includes(query) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
        );
    }
    
    // 显示过滤结果数量
    const resultCount = document.querySelector('.result-count');
    if (resultCount) {
        if (filterCategory || searchQuery) {
            resultCount.textContent = `找到 ${filteredPosts.length} 篇文章`;
            resultCount.style.display = 'block';
        } else {
            resultCount.style.display = 'none';
        }
    }
    
    // 如果没有匹配的文章
    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>未找到匹配的文章</h3>
                <p>尝试使用不同的关键词或浏览所有文章</p>
                <button class="btn btn-primary clear-filters">查看所有文章</button>
            </div>
        `;
        
        // 添加清除过滤器按钮的事件监听
        const clearBtn = blogGrid.querySelector('.clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                // 重置分类选择
                const categoryLinks = document.querySelectorAll('.category-item');
                categoryLinks.forEach(link => link.classList.remove('active'));
                document.querySelector('.category-item[data-category="all"]').classList.add('active');
                
                // 清空搜索框
                const searchInput = document.querySelector('#blog-search');
                if (searchInput) searchInput.value = '';
                
                // 重新渲染所有文章
                renderBlogPosts(posts);
            });
        }
        
        return;
    }
    
    // 渲染文章卡片
    filteredPosts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-card';
        
        // 格式化标签
        const tagsHtml = post.tags && post.tags.length > 0 
            ? post.tags.map(tag => `<a href="#" class="post-tag">${tag}</a>`).join('') 
            : '';
        
        article.innerHTML = `
            <div class="blog-card-image">
                <a href="${post.url}">
                    <img src="${post.featuredImage}" alt="${post.title}">
                </a>
                <div class="blog-category ${post.category}">${getCategoryName(post.category)}</div>
            </div>
            <div class="blog-card-content">
                <h3 class="blog-title"><a href="${post.url}">${post.title}</a></h3>
                <div class="blog-meta">
                    <span class="blog-date"><i class="far fa-calendar-alt"></i> ${post.date}</span>
                    <span class="blog-read-time"><i class="far fa-clock"></i> ${post.readTime} 分钟阅读</span>
                </div>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-tags">
                    ${tagsHtml}
                </div>
                <a href="${post.url}" class="read-more">阅读全文 <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        blogGrid.appendChild(article);
    });
}

// 设置分类过滤器
function setupCategoryFilters(posts) {
    const categoryLinks = document.querySelectorAll('.category-item');
    if (!categoryLinks.length) return;
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            categoryLinks.forEach(item => item.classList.remove('active'));
            
            // 添加active类到当前项
            this.classList.add('active');
            
            // 获取分类值
            const category = this.getAttribute('data-category');
            
            // 获取当前搜索框值
            const searchInput = document.querySelector('#blog-search');
            const searchQuery = searchInput && searchInput.value.trim() ? searchInput.value.trim() : null;
            
            // 重新渲染基于分类的文章
            renderBlogPosts(posts, category === 'all' ? null : category, searchQuery);
        });
    });
}

// 设置搜索功能
function setupSearch(posts) {
    const searchForm = document.querySelector('.blog-search-form');
    const searchInput = document.querySelector('#blog-search');
    
    if (!searchForm || !searchInput) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const query = searchInput.value.trim();
        
        // 获取当前活动分类
        const activeCategory = document.querySelector('.category-item.active');
        const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
        
        // 渲染搜索结果
        renderBlogPosts(posts, category === 'all' ? null : category, query);
    });
    
    // 添加实时搜索 (可选，取决于用户体验需求)
    searchInput.addEventListener('input', function() {
        if (this.value.trim().length >= 3 || this.value.trim().length === 0) {
            const query = this.value.trim();
            
            // 获取当前活动分类
            const activeCategory = document.querySelector('.category-item.active');
            const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
            
            // 渲染搜索结果
            renderBlogPosts(posts, category === 'all' ? null : category, query.length > 0 ? query : null);
        }
    });
}

// 获取分类的中文名称
function getCategoryName(categorySlug) {
    const categories = {
        'java': 'Java开发',
        'spring': 'Spring生态',
        'redis': 'Redis应用',
        'rag': 'RAG/LLM',
        'database': '数据库优化',
        'architecture': '系统架构'
    };
    
    return categories[categorySlug] || categorySlug;
} 