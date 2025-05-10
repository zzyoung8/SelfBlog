// 技术博客页面的JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 文章过滤功能
    const filterTags = document.querySelectorAll('.filter-tags .tag');
    const articleCards = document.querySelectorAll('.article-card');
    
    // 添加标签点击事件
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // 移除所有标签的激活状态
            filterTags.forEach(t => t.classList.remove('active'));
            
            // 激活当前点击的标签
            tag.classList.add('active');
            
            const selectedTag = tag.getAttribute('data-tag');
            
            // 显示或隐藏文章
            articleCards.forEach(card => {
                if (selectedTag === 'all') {
                    card.style.display = 'flex';
                } else {
                    const cardTags = card.getAttribute('data-tags');
                    if (cardTags && cardTags.includes(selectedTag)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // 如果搜索框为空，恢复所有文章显示
            articleCards.forEach(card => {
                card.style.display = 'flex';
            });
            
            // 恢复"全部"标签激活状态
            filterTags.forEach(t => {
                if (t.getAttribute('data-tag') === 'all') {
                    t.classList.add('active');
                } else {
                    t.classList.remove('active');
                }
            });
            
            return;
        }
        
        // 移除所有标签的激活状态
        filterTags.forEach(t => t.classList.remove('active'));
        
        // 搜索文章标题和摘要
        articleCards.forEach(card => {
            const title = card.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
            const tagElements = card.querySelectorAll('.article-tags span');
            
            // 搜索标签
            let tagsText = '';
            tagElements.forEach(tagEl => {
                tagsText += tagEl.textContent.toLowerCase() + ' ';
            });
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tagsText.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // 绑定搜索按钮点击事件
    searchBtn.addEventListener('click', performSearch);
    
    // 绑定输入框Enter键事件
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 分类侧边栏点击事件
    const categoryLinks = document.querySelectorAll('.category-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 获取点击的分类
            const category = link.getAttribute('data-category');
            
            // 找到对应的过滤标签并触发点击
            filterTags.forEach(tag => {
                if (tag.getAttribute('data-tag') === category) {
                    tag.click();
                    
                    // 滚动到文章列表顶部
                    document.querySelector('.filter-bar').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    });
    
    // 标签云点击事件
    const tagCloudLinks = document.querySelectorAll('.tag-cloud a');
    tagCloudLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 获取点击的标签文本
            const tagText = link.textContent.toLowerCase();
            
            // 设置搜索输入框的值并执行搜索
            searchInput.value = tagText;
            performSearch();
            
            // 滚动到文章列表顶部
            document.querySelector('.filter-bar').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // 分页功能
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的激活状态
            paginationBtns.forEach(b => b.classList.remove('active'));
            
            // 激活当前点击的按钮
            if (!btn.classList.contains('next')) {
                btn.classList.add('active');
            }
            
            // 这里可以添加实际分页加载文章的逻辑
            // 当前只是一个示例，没有实际功能
            
            // 滚动到顶部
            document.querySelector('.blog-content').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // 为文章卡片添加淡入效果
    articleCards.forEach(card => {
        card.classList.add('fade-out');
    });
    
    const fadeInOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, fadeInOptions);
    
    articleCards.forEach(card => {
        fadeInObserver.observe(card);
    });
}); 