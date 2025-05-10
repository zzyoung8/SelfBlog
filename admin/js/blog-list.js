// Blog List Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Load Drafts from localStorage
    loadDrafts();
    
    // Search Functionality
    const draftSearch = document.getElementById('draft-search');
    const publishedSearch = document.getElementById('published-search');
    
    draftSearch.addEventListener('input', function() {
        searchInTable('drafts-list', this.value);
    });
    
    publishedSearch.addEventListener('input', function() {
        searchInTable('published-list', this.value);
    });
    
    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const closeBtn = document.querySelector('#deleteModal .close');
    const cancelBtn = document.getElementById('cancelDelete');
    const confirmBtn = document.getElementById('confirmDelete');
    
    let postToDelete = null;
    
    // Open delete modal
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');
            const postTitle = this.closest('tr').querySelector('.post-title-cell span').textContent;
            
            document.getElementById('deletePostTitle').textContent = postTitle;
            postToDelete = {
                id: postId,
                type: this.closest('.tab-content').id // "drafts" or "published"
            };
            
            deleteModal.style.display = 'block';
        });
    });
    
    // Close delete modal
    closeBtn.addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
    
    // Confirm delete
    confirmBtn.addEventListener('click', function() {
        if (postToDelete) {
            if (postToDelete.type === 'drafts') {
                deleteDraft(postToDelete.id);
            } else {
                // For published posts, you would typically need a backend
                // For now, just show an alert
                alert(`请注意：由于这是静态网站，您需要手动删除 blog-posts/${postToDelete.id} 文件。`);
            }
            
            deleteModal.style.display = 'none';
        }
    });
    
    // Edit Draft button click
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit')) {
            const button = e.target.closest('.btn-edit');
            const postId = button.getAttribute('data-id');
            const tabContent = button.closest('.tab-content');
            
            if (tabContent.id === 'drafts') {
                // For drafts, load draft into editor
                const draftId = postId;
                localStorage.setItem('editingDraftId', draftId);
                window.location.href = 'blog-editor.html';
            } else {
                // For published posts, this would need backend support
                // For now, just show an alert
                alert(`请注意：由于这是静态网站，无法直接编辑已发布文章。您可以查看文章内容，然后在编辑器中重新创建。`);
            }
        }
    });
});

// Load drafts from localStorage
function loadDrafts() {
    const drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
    const draftsList = document.getElementById('drafts-list');
    
    if (drafts.length === 0) {
        draftsList.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">暂无草稿</td>
            </tr>
        `;
        return;
    }
    
    // Sort drafts by last saved date (newest first)
    drafts.sort((a, b) => new Date(b.lastSaved) - new Date(a.lastSaved));
    
    // Clear existing content
    draftsList.innerHTML = '';
    
    // Add each draft to the table
    drafts.forEach(draft => {
        const row = document.createElement('tr');
        row.className = 'post-row';
        row.setAttribute('data-id', draft.id);
        
        const formattedDate = new Date(draft.lastSaved).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Get tags array from string
        const tagsArray = draft.tags ? draft.tags.split(',').map(tag => tag.trim()) : [];
        
        // Create tags HTML
        let tagsHtml = '';
        if (tagsArray.length > 0) {
            tagsHtml = tagsArray.map(tag => `<span class="tag">${tag}</span>`).join('');
        } else {
            tagsHtml = '<span class="no-tags">无标签</span>';
        }
        
        row.innerHTML = `
            <td>
                <div class="post-title-cell">
                    ${draft.featuredImage ? 
                    `<img src="${draft.featuredImage}" alt="${draft.title}" class="post-thumbnail">` : 
                    `<div class="post-thumbnail" style="background-color: #eee; display: flex; align-items: center; justify-content: center;"><i class="fas fa-file-alt" style="color: #aaa;"></i></div>`}
                    <span>${draft.title || '无标题草稿'}</span>
                </div>
            </td>
            <td>${draft.category || '-'}</td>
            <td>
                <div class="tags-cell">
                    ${tagsHtml}
                </div>
            </td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" title="编辑" data-id="${draft.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" title="删除" data-id="${draft.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        draftsList.appendChild(row);
    });
}

// Delete a draft from localStorage
function deleteDraft(draftId) {
    const drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
    const updatedDrafts = drafts.filter(draft => draft.id != draftId);
    
    localStorage.setItem('blogDrafts', JSON.stringify(updatedDrafts));
    
    // Update the UI
    const draftRow = document.querySelector(`#drafts-list tr[data-id="${draftId}"]`);
    if (draftRow) {
        draftRow.remove();
    }
    
    // If no drafts left, show empty message
    if (updatedDrafts.length === 0) {
        document.getElementById('drafts-list').innerHTML = `
            <tr class="empty-row">
                <td colspan="5">暂无草稿</td>
            </tr>
        `;
    }
}

// Search in table
function searchInTable(tableId, query) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tr.post-row');
    
    query = query.toLowerCase().trim();
    
    if (query === '') {
        // Show all rows when query is empty
        rows.forEach(row => {
            row.style.display = '';
        });
        
        // Hide empty message if there are rows
        if (rows.length > 0) {
            const emptyRow = table.querySelector('.empty-row');
            if (emptyRow) emptyRow.style.display = 'none';
        }
        
        return;
    }
    
    let hasVisibleRows = false;
    
    rows.forEach(row => {
        const title = row.querySelector('.post-title-cell span').textContent.toLowerCase();
        const category = row.cells[1].textContent.toLowerCase();
        const tags = row.querySelector('.tags-cell').textContent.toLowerCase();
        
        if (title.includes(query) || category.includes(query) || tags.includes(query)) {
            row.style.display = '';
            hasVisibleRows = true;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show empty message if no matches
    let emptyRow = table.querySelector('.empty-row');
    
    if (!hasVisibleRows) {
        if (!emptyRow) {
            emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            emptyRow.innerHTML = `<td colspan="5">没有找到匹配的结果</td>`;
            table.appendChild(emptyRow);
        } else {
            emptyRow.style.display = '';
            emptyRow.cells[0].textContent = '没有找到匹配的结果';
        }
    } else if (emptyRow) {
        emptyRow.style.display = 'none';
    }
} 