// 浏览器功能管理类
class BrowserManager {
    constructor() {
        this.currentUrl = 'https://www.baidu.com';
        this.history = ['https://www.baidu.com'];
        this.historyIndex = 0;
        this.bookmarks = this.loadBookmarks();
        this.downloads = [];
        this.homeUrl = 'https://www.baidu.com';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateNavigationButtons();
        this.setupIframeEvents();
    }
    
    // 绑定事件
    bindEvents() {
        // 后退按钮
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }
        
        // 前进按钮
        const forwardBtn = document.getElementById('forwardBtn');
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => this.goForward());
        }
        
        // 刷新按钮
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }
        
        // 主页按钮
        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => this.goHome());
        }
        
        // 收藏按钮
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.toggleBookmark());
        }
        
        // 历史按钮
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.showHistory());
        }
        
        // 下载按钮
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.showDownloads());
        }
        
        // 转发按钮
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareUrl());
        }
        
        // URL输入框
        const urlInput = document.querySelector('.url-input');
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.navigateToUrl(urlInput.value);
                }
            });
            
            urlInput.addEventListener('focus', () => {
                urlInput.select();
            });
        }
    }
    
    // 设置iframe事件
    setupIframeEvents() {
        const iframe = document.getElementById('browserFrame');
        const loading = document.getElementById('browserLoading');
        
        if (iframe && loading) {
            iframe.addEventListener('load', () => {
                loading.classList.remove('show');
                this.updateUrlBar();
            });
            
            // 显示加载状态
            this.showLoading();
        }
    }
    
    // 显示加载状态
    showLoading() {
        const loading = document.getElementById('browserLoading');
        if (loading) {
            loading.classList.add('show');
        }
    }
    
    // 隐藏加载状态
    hideLoading() {
        const loading = document.getElementById('browserLoading');
        if (loading) {
            loading.classList.remove('show');
        }
    }
    
    // 导航到指定URL
    navigateToUrl(url) {
        if (!url) return;
        
        // 简单的URL格式化
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            // 如果看起来像搜索词，使用百度搜索
            if (!url.includes('.') || url.includes(' ')) {
                url = `https://www.baidu.com/s?wd=${encodeURIComponent(url)}`;
            } else {
                url = 'https://' + url;
            }
        }
        
        this.showLoading();
        
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = url;
            this.currentUrl = url;
            this.addToHistory(url);
            this.updateNavigationButtons();
        }
    }
    
    // 后退
    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const url = this.history[this.historyIndex];
            this.showLoading();
            
            const iframe = document.getElementById('browserFrame');
            if (iframe) {
                iframe.src = url;
                this.currentUrl = url;
                this.updateNavigationButtons();
                this.updateUrlBar();
            }
        }
    }
    
    // 前进
    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const url = this.history[this.historyIndex];
            this.showLoading();
            
            const iframe = document.getElementById('browserFrame');
            if (iframe) {
                iframe.src = url;
                this.currentUrl = url;
                this.updateNavigationButtons();
                this.updateUrlBar();
            }
        }
    }
    
    // 刷新
    refresh() {
        this.showLoading();
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = iframe.src;
        }
    }
    
    // 回到主页
    goHome() {
        this.navigateToUrl(this.homeUrl);
    }
    
    // 切换收藏状态
    toggleBookmark() {
        const isBookmarked = this.isBookmarked(this.currentUrl);
        
        if (isBookmarked) {
            this.removeBookmark(this.currentUrl);
            this.showToast('已取消收藏');
        } else {
            this.addBookmark(this.currentUrl);
            this.showToast('已添加到收藏');
        }
        
        this.updateBookmarkButton();
    }
    
    // 显示历史记录
    showHistory() {
        const historyHtml = this.history.map((url, index) => {
            const isActive = index === this.historyIndex;
            return `
                <div class="history-item ${isActive ? 'active' : ''}" onclick="browserManager.navigateToHistory(${index})">
                    <div class="history-url">${url}</div>
                    <div class="history-time">${this.getTimeAgo(Date.now() - (this.history.length - index) * 60000)}</div>
                </div>
            `;
        }).join('');
        
        this.showModal('浏览历史', historyHtml);
    }
    
    // 显示下载列表
    showDownloads() {
        const downloadsHtml = this.downloads.length > 0 
            ? this.downloads.map(download => `
                <div class="download-item">
                    <div class="download-name">${download.name}</div>
                    <div class="download-url">${download.url}</div>
                    <div class="download-time">${download.time}</div>
                </div>
            `).join('')
            : '<div class="empty-state">暂无下载记录</div>';
        
        this.showModal('下载管理', downloadsHtml);
    }
    
    // 分享当前页面
    shareUrl() {
        if (navigator.share) {
            navigator.share({
                title: '分享网页',
                url: this.currentUrl
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(this.currentUrl).then(() => {
                this.showToast('链接已复制到剪贴板');
            }).catch(() => {
                this.showToast('分享失败');
            });
        }
    }
    
    // 添加到历史记录
    addToHistory(url) {
        // 如果当前不在历史记录末尾，删除后面的记录
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        // 如果新URL与当前URL不同，添加到历史记录
        if (this.history[this.history.length - 1] !== url) {
            this.history.push(url);
            this.historyIndex = this.history.length - 1;
        }
        
        // 限制历史记录数量
        if (this.history.length > 100) {
            this.history = this.history.slice(-100);
            this.historyIndex = this.history.length - 1;
        }
    }
    
    // 导航到历史记录中的URL
    navigateToHistory(index) {
        this.historyIndex = index;
        const url = this.history[index];
        this.showLoading();
        
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = url;
            this.currentUrl = url;
            this.updateNavigationButtons();
            this.updateUrlBar();
        }
        
        this.hideModal();
    }
    
    // 更新导航按钮状态
    updateNavigationButtons() {
        const backBtn = document.getElementById('backBtn');
        const forwardBtn = document.getElementById('forwardBtn');
        
        if (backBtn) {
            backBtn.disabled = this.historyIndex <= 0;
        }
        
        if (forwardBtn) {
            forwardBtn.disabled = this.historyIndex >= this.history.length - 1;
        }
        
        this.updateBookmarkButton();
    }
    
    // 更新收藏按钮状态
    updateBookmarkButton() {
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        if (bookmarkBtn) {
            const isBookmarked = this.isBookmarked(this.currentUrl);
            bookmarkBtn.style.color = isBookmarked ? '#FFD700' : '';
            bookmarkBtn.title = isBookmarked ? '取消收藏' : '收藏';
        }
    }
    
    // 更新URL栏
    updateUrlBar() {
        const urlInput = document.querySelector('.url-input');
        if (urlInput) {
            urlInput.value = this.currentUrl;
        }
    }
    
    // 收藏相关方法
    isBookmarked(url) {
        return this.bookmarks.some(bookmark => bookmark.url === url);
    }
    
    addBookmark(url) {
        if (!this.isBookmarked(url)) {
            this.bookmarks.push({
                url: url,
                title: url,
                time: new Date().toISOString()
            });
            this.saveBookmarks();
        }
    }
    
    removeBookmark(url) {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.url !== url);
        this.saveBookmarks();
    }
    
    loadBookmarks() {
        try {
            return JSON.parse(localStorage.getItem('browser_bookmarks') || '[]');
        } catch {
            return [];
        }
    }
    
    saveBookmarks() {
        localStorage.setItem('browser_bookmarks', JSON.stringify(this.bookmarks));
    }
    
    // 工具方法
    getTimeAgo(ms) {
        const minutes = Math.floor(ms / 60000);
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}小时前`;
        const days = Math.floor(hours / 24);
        return `${days}天前`;
    }
    
    showModal(title, content) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'browser-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="browserManager.hideModal()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    hideModal() {
        const modal = document.querySelector('.browser-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    showToast(message) {
        // 创建toast
        const toast = document.createElement('div');
        toast.className = 'browser-toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// 全局实例
let browserManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    browserManager = new BrowserManager();
});