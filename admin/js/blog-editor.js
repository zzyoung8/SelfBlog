// Blog Editor JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EasyMDE Markdown editor
    const easyMDE = new EasyMDE({
        element: document.getElementById('content'),
        spellChecker: false,
        autosave: {
            enabled: true,
            uniqueId: 'blogEditor',
            delay: 1000,
        },
        toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'code', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
        ]
    });

    // Handle image preview
    const featuredImageInput = document.getElementById('featuredImage');
    const imagePreview = document.getElementById('imagePreview');
    
    featuredImageInput.addEventListener('input', function() {
        const imageUrl = this.value;
        if (imageUrl) {
            imagePreview.innerHTML = `<img src="${imageUrl}" alt="预览图片">`;
            imagePreview.classList.add('has-image');
        } else {
            imagePreview.innerHTML = `<span class="preview-text">图片预览</span>`;
            imagePreview.classList.remove('has-image');
        }
    });

    // Preview Button Click
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closeModal = document.getElementById('closeModal');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    
    previewBtn.addEventListener('click', function() {
        // Get form data
        const title = document.getElementById('title').value;
        const readTime = document.getElementById('readTime').value;
        const tags = document.getElementById('tags').value;
        const featuredImage = document.getElementById('featuredImage').value;
        const content = easyMDE.value();
        
        // Update preview elements
        document.getElementById('previewTitle').textContent = title;
        document.getElementById('previewDate').textContent = new Date().toISOString().slice(0, 10);
        document.getElementById('previewReadTime').textContent = readTime;
        
        // Update tags
        const tagsContainer = document.getElementById('previewTags');
        tagsContainer.innerHTML = '';
        
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            tagArray.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'post-tag';
                tagSpan.textContent = tag;
                tagsContainer.appendChild(tagSpan);
            });
        }
        
        // Update featured image
        const previewImage = document.getElementById('previewImage');
        if (featuredImage) {
            previewImage.innerHTML = `<img src="${featuredImage}" alt="文章特色图片">`;
        } else {
            previewImage.innerHTML = '';
        }
        
        // Update content (convert Markdown to HTML)
        document.getElementById('previewContent').innerHTML = marked.parse(content);
        
        // Show modal
        previewModal.style.display = 'block';
    });
    
    // Close modal events
    closeModal.addEventListener('click', function() {
        previewModal.style.display = 'none';
    });
    
    closePreviewBtn.addEventListener('click', function() {
        previewModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });

    // Save Draft functionality
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', function() {
        const postData = savePostToLocalStorage('draft');
        alert('草稿已保存到本地浏览器存储中');
        
        // Update editing ID to the newly saved draft
        if (postData && !currentEditingId) {
            currentEditingId = postData.id;
            localStorage.setItem('editingDraftId', currentEditingId);
        }
    });

    // Publish functionality
    const publishBtn = document.getElementById('publishBtn');
    const confirmPublishBtn = document.getElementById('confirmPublishBtn');
    
    publishBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Save as published
        savePostToLocalStorage('published');
        // Open preview before publishing
        previewBtn.click();
    });
    
    confirmPublishBtn.addEventListener('click', function() {
        // Generate static HTML file
        generateHtmlFile();
        previewModal.style.display = 'none';
    });

    // Function to save post data to localStorage
    function savePostToLocalStorage(status) {
        const postData = {
            id: currentEditingId || Date.now(), // Use existing ID or create new one
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            readTime: document.getElementById('readTime').value,
            tags: document.getElementById('tags').value,
            excerpt: document.getElementById('excerpt').value,
            featuredImage: document.getElementById('featuredImage').value,
            content: easyMDE.value(),
            status: status,
            lastSaved: new Date().toISOString()
        };
        
        // Get existing drafts or create new array
        let drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
        
        // If editing existing draft, update it; otherwise add new draft
        if (currentEditingId) {
            const draftIndex = drafts.findIndex(draft => draft.id == currentEditingId);
            if (draftIndex !== -1) {
                drafts[draftIndex] = postData;
            } else {
                drafts.push(postData);
            }
        } else {
            drafts.push(postData);
        }
        
        // Save back to localStorage
        localStorage.setItem('blogDrafts', JSON.stringify(drafts));
        
        return postData;
    }

    // Function to generate static HTML file for download
    function generateHtmlFile() {
        const postData = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            readTime: document.getElementById('readTime').value,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
            excerpt: document.getElementById('excerpt').value,
            featuredImage: document.getElementById('featuredImage').value,
            content: easyMDE.value(),
            date: new Date().toISOString().slice(0, 10)
        };
        
        // Validate required fields
        if (!postData.title || !postData.content || !postData.excerpt) {
            alert('请填写所有必填字段（标题、摘要和内容）');
            return;
        }
        
        // Generate filename from title (slug)
        const fileName = postData.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-') + '.html';

        // Generate HTML content based on blog-posts/redis-cache-issues.html template
        const htmlContent = generatePostHtml(postData);
        
        // Create downloadable file
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';
        
        // Add to document, click and remove
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Alert user
        alert(`文章已成功生成！请保存 ${fileName} 到 blog-posts 目录下。\n\n注意：您需要手动上传到您的网站以完成发布。`);
        
        // Clear editing state after publishing
        if (currentEditingId) {
            localStorage.removeItem('editingDraftId');
            currentEditingId = null;
            
            // Redirect to list page if they want to see their published post
            if (confirm('文章已生成。是否返回文章管理页面？')) {
                window.location.href = 'blog-list.html';
            }
        }
    }

    // Function to generate HTML for a blog post
    function generatePostHtml(postData) {
        // Convert tags array to HTML
        const tagsHtml = postData.tags.map(tag => 
            `<a href="../tech-blog.html" class="post-tag">${tag}</a>`
        ).join('\n                        ');
        
        // Convert Markdown content to HTML
        const contentHtml = marked.parse(postData.content);
        
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${postData.title} - YOUNG的个人博客</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/tech-blog.css">
    <link rel="stylesheet" href="../css/blog-post.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css">
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">YOUNG</div>
                <ul class="nav-links">
                    <li><a href="../index.html">首页</a></li>
                    <li><a href="../index.html#about">关于我</a></li>
                    <li><a href="../index.html#projects">项目经历</a></li>
                    <li><a href="../tech-blog.html" class="active">技术分享</a></li>
                    <li><a href="../index.html#gallery">生活相册</a></li>
                    <li><a href="../index.html#contact">联系我</a></li>
                </ul>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </div>
    </header>

    <main class="blog-post-container">
        <div class="container">
            <article class="blog-post">
                <div class="post-header">
                    <h1 class="post-title">${postData.title}</h1>
                    <div class="post-meta">
                        <span class="post-date"><i class="far fa-calendar-alt"></i> ${postData.date}</span>
                        <span class="post-author"><i class="far fa-user"></i> YOUNG</span>
                        <span class="post-read-time"><i class="far fa-clock"></i> ${postData.readTime} 分钟阅读</span>
                    </div>
                    <div class="post-tags">
                        ${tagsHtml}
                    </div>
                </div>
                
                ${postData.featuredImage ? `<div class="post-featured-image">
                    <img src="${postData.featuredImage}" alt="${postData.title}">
                </div>` : ''}
                
                <div class="post-content">
                    ${contentHtml}
                </div>
                
                <div class="post-footer">
                    <div class="post-share">
                        <span>分享到：</span>
                        <a href="#" target="_blank"><i class="fab fa-weixin"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-weibo"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                    </div>
                    
                    <div class="post-tags">
                        <span>标签：</span>
                        ${tagsHtml}
                    </div>
                </div>
            </article>
            
            <div class="post-navigation">
                <a href="#" class="prev-post">
                    <i class="fas fa-arrow-left"></i>
                    <span>上一篇：文章标题</span>
                </a>
                <a href="#" class="next-post">
                    <span>下一篇：文章标题</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
            
            <div class="related-posts">
                <h3>相关推荐</h3>
                <div class="related-posts-grid">
                    <a href="#" class="related-post">
                        <div class="related-post-img">
                            <img src="../images/blog/placeholder.jpg" alt="相关文章">
                        </div>
                        <h4>相关文章标题</h4>
                    </a>
                    <a href="#" class="related-post">
                        <div class="related-post-img">
                            <img src="../images/blog/placeholder.jpg" alt="相关文章">
                        </div>
                        <h4>相关文章标题</h4>
                    </a>
                    <a href="#" class="related-post">
                        <div class="related-post-img">
                            <img src="../images/blog/placeholder.jpg" alt="相关文章">
                        </div>
                        <h4>相关文章标题</h4>
                    </a>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <p>&copy; 2023 YOUNG的个人博客. All Rights Reserved.</p>
                <div class="social-links">
                    <a href="#" target="_blank"><i class="fab fa-github"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-weixin"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-zhihu"></i></a>
                </div>
            </div>
        </div>
    </footer>

    <script src="../js/main.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 代码高亮
            hljs.highlightAll();
            
            // 动态设置年份
            const year = new Date().getFullYear();
            const copyrightEl = document.querySelector('footer p');
            if (copyrightEl) {
                copyrightEl.textContent = copyrightEl.textContent.replace('2023', year);
            }
        });
    </script>
</body>
</html>`;
    }

    // Check for editing existing draft
    let currentEditingId = localStorage.getItem('editingDraftId');
    if (currentEditingId) {
        loadDraftForEditing(currentEditingId);
    } else {
        // Check if there's any draft to load
        checkForExistingDraft();
    }

    // Function to load a specific draft for editing
    function loadDraftForEditing(draftId) {
        const drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
        const draft = drafts.find(d => d.id == draftId);
        
        if (draft) {
            // Fill the form with draft data
            document.getElementById('title').value = draft.title || '';
            document.getElementById('category').value = draft.category || '';
            document.getElementById('readTime').value = draft.readTime || '5';
            document.getElementById('tags').value = draft.tags || '';
            document.getElementById('excerpt').value = draft.excerpt || '';
            document.getElementById('featuredImage').value = draft.featuredImage || '';
            
            // Update image preview if applicable
            if (draft.featuredImage) {
                imagePreview.innerHTML = `<img src="${draft.featuredImage}" alt="预览图片">`;
                imagePreview.classList.add('has-image');
            }
            
            // Set editor content
            easyMDE.value(draft.content || '');
            
            // Update page title to show we're editing
            document.querySelector('.admin-title').textContent = '编辑文章';
            document.title = `编辑: ${draft.title || '无标题草稿'} - YOUNG的个人博客`;
        } else {
            // If draft not found, clear editing state
            localStorage.removeItem('editingDraftId');
            currentEditingId = null;
        }
    }
    
    // Check if there's any draft that can be loaded
    function checkForExistingDraft() {
        const drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
        if (drafts.length > 0) {
            // Get the most recent draft
            const latestDraft = drafts[drafts.length - 1];
            
            // Confirm if user wants to load draft
            const loadDraft = confirm(`发现一个保存于 ${new Date(latestDraft.lastSaved).toLocaleString()} 的草稿。是否加载？`);
            
            if (loadDraft) {
                currentEditingId = latestDraft.id;
                localStorage.setItem('editingDraftId', currentEditingId);
                loadDraftForEditing(currentEditingId);
            }
        }
    }
    
    // Add a cancel button to return to the list without saving
    const formActions = document.querySelector('.form-actions');
    if (formActions && currentEditingId) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-outline';
        cancelBtn.textContent = '取消';
        cancelBtn.style.marginRight = 'auto'; // Push to the left
        
        cancelBtn.addEventListener('click', function() {
            if (confirm('确定要取消编辑吗？未保存的更改将丢失。')) {
                localStorage.removeItem('editingDraftId');
                window.location.href = 'blog-list.html';
            }
        });
        
        formActions.insertBefore(cancelBtn, formActions.firstChild);
    }
}); 