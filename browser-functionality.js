// 浏览器功能管理类
class BrowserManager {
    constructor() {
        this.currentUrl = 'https://www.baidu.com';
        this.history = ['https://www.baidu.com'];
        this.historyIndex = 0;
        this.bookmarks = this.loadBookmarks();
        this.downloads = [];
        this.homeUrl = 'https://www.baidu.com';
        this.currentSearchEngine = 'baidu';
        this.currentAiModel = 'chatgpt';
        
        // 搜索引擎配置
        this.searchEngines = {
            baidu: { name: '百度', url: 'https://www.baidu.com/s?wd=', icon: '🔍' },
            google: { name: '谷歌', url: 'https://www.google.com/search?q=', icon: '🌐' },
            douyin: { name: '抖音', url: 'https://www.douyin.com/search/', icon: '🎵' },
            bing: { name: '必应', url: 'https://www.bing.com/search?q=', icon: '🔎' },
            sogou: { name: '搜狗', url: 'https://www.sogou.com/web?query=', icon: '🐕' },
            toutiao: { name: '头条搜索', url: 'https://so.toutiao.com/search?keyword=', icon: '📰' },
            so360: { name: '360搜索', url: 'https://www.so.com/s?q=', icon: '🛡️' },
            shenma: { name: '神马搜索', url: 'https://m.sm.cn/s?q=', icon: '🐎' },
            duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: '🦆' },
            yandex: { name: 'Yandex', url: 'https://yandex.com/search/?text=', icon: '🇷🇺' }
        };
        
        // AI模型配置
        this.aiModels = {
            deepseek: { name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: '🧠' },
            kimi: { name: 'Kimi', url: 'https://kimi.moonshot.cn/', icon: '🌙' },
            doubao: { name: '豆包', url: 'https://www.doubao.com/', icon: '🫘' },
            wenxin: { name: '文心一言', url: 'https://yiyan.baidu.com/', icon: '📝' },
            yuanbao: { name: '元宝', url: 'https://yuanbao.tencent.com/', icon: '💰' },
            zhipu: { name: '智谱清言', url: 'https://chatglm.cn/', icon: '🎯' },
            tongyi: { name: '通义', url: 'https://tongyi.aliyun.com/', icon: '🔮' },
            claude: { name: 'Claude', url: 'https://claude.ai/', icon: '🤖' },
            chatgpt: { name: 'ChatGPT', url: 'https://chat.openai.com/', icon: '💬' },
            perplexity: { name: 'Perplexity', url: 'https://www.perplexity.ai/', icon: '🔍' },
            quark: { name: '夸克', url: 'https://quark.sm.cn/', icon: '⚛️' },
            keling: { name: '可灵', url: 'https://klingai.kuaishou.com/', icon: '🎨' },
            metaso: { name: '秘塔', url: 'https://metaso.cn/', icon: '🗼' },
            nano: { name: '纳米搜索', url: 'https://nano.so/', icon: '🔬' },
            you: { name: 'You', url: 'https://you.com/', icon: '👤' },
            copilot: { name: 'Copilot', url: 'https://copilot.microsoft.com/', icon: '🚁' }
        };
        
        this.init();
    }
    
    init() {
        // 加载保存的设置
        this.loadSettings();
        
        this.bindEvents();
        this.updateNavigationButtons();
        this.setupIframeEvents();
        this.updateSearchEngineButton();
        this.updateAiModelButton();
    }
    
    // 加载设置
    loadSettings() {
        const savedSearchEngine = localStorage.getItem('currentSearchEngine');
        if (savedSearchEngine && this.searchEngines[savedSearchEngine]) {
            this.currentSearchEngine = savedSearchEngine;
        }
        
        const savedAiModel = localStorage.getItem('currentAiModel');
        if (savedAiModel && this.aiModels[savedAiModel]) {
            this.currentAiModel = savedAiModel;
        }
    }
    
    // 更新搜索引擎按钮
    updateSearchEngineButton() {
        const btn = document.getElementById('searchEngineBtn');
        if (btn) {
            const engine = this.searchEngines[this.currentSearchEngine];
            btn.innerHTML = engine.icon;
            btn.title = `当前搜索引擎: ${engine.name}`;
        }
    }
    
    // 更新AI模型按钮
    updateAiModelButton() {
        const btn = document.getElementById('aiModelBtn');
        if (btn) {
            const model = this.aiModels[this.currentAiModel];
            btn.innerHTML = model.icon;
            btn.title = `当前AI模型: ${model.name}`;
        }
    }
    
    // 绑定事件
    bindEvents() {
        // 搜索引擎按钮
        const searchEngineBtn = document.getElementById('searchEngineBtn');
        if (searchEngineBtn) {
            searchEngineBtn.addEventListener('click', () => this.showSearchEngines());
        }
        
        // AI模型按钮
        const aiModelBtn = document.getElementById('aiModelBtn');
        if (aiModelBtn) {
            aiModelBtn.addEventListener('click', () => this.showAiModels());
        }
        
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
        
        // 收藏夹列表按钮
        const bookmarkListBtn = document.getElementById('bookmarkListBtn');
        if (bookmarkListBtn) {
            bookmarkListBtn.addEventListener('click', () => this.showBookmarks());
        }
        
        // 历史按钮
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.showHistory());
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
                    this.handleUrlInput(urlInput.value);
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
    
    // 处理URL输入
    handleUrlInput(input) {
        if (!input) return;
        
        // 检查是否是搜索词
        if (!input.includes('.') || input.includes(' ')) {
            // 使用当前选择的搜索引擎进行搜索
            const searchEngine = this.searchEngines[this.currentSearchEngine];
            const searchUrl = searchEngine.url + encodeURIComponent(input);
            this.navigateToUrl(searchUrl);
        } else {
            // 作为URL处理
            this.navigateToUrl(input);
        }
    }
    
    // 导航到指定URL
    navigateToUrl(url) {
        if (!url) return;
        
        // 简单的URL格式化
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.')) {
                url = 'https://' + url;
            } else {
                // 如果不是URL，则作为搜索词处理
                const searchEngine = this.searchEngines[this.currentSearchEngine];
                url = searchEngine.url + encodeURIComponent(url);
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
    
    // 显示搜索引擎列表
    showSearchEngines() {
        this.hideAllLists();
        
        const listHtml = `
            <div class="dropdown-list" id="searchEngineList">
                <div class="list-header">选择搜索引擎</div>
                ${Object.entries(this.searchEngines).map(([key, engine]) => `
                    <div class="list-item ${key === this.currentSearchEngine ? 'active' : ''}" 
                         onclick="browserManager.selectSearchEngine('${key}')">
                        <span class="item-icon">${engine.icon}</span>
                        <span class="item-name">${engine.name}</span>
                        ${key === this.currentSearchEngine ? '<span class="item-check">✓</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', listHtml);
        
        // 点击外部关闭列表
        setTimeout(() => {
            document.addEventListener('click', this.closeListOnOutsideClick.bind(this), { once: true });
        }, 100);
    }
    
    // 显示AI模型列表
    showAiModels() {
        this.hideAllLists();
        
        const listHtml = `
            <div class="dropdown-list" id="aiModelList">
                <div class="list-header">选择AI模型</div>
                ${Object.entries(this.aiModels).map(([key, model]) => `
                    <div class="list-item ${key === this.currentAiModel ? 'active' : ''}" 
                         onclick="browserManager.selectAiModel('${key}')">
                        <span class="item-icon">${model.icon}</span>
                        <span class="item-name">${model.name}</span>
                        ${key === this.currentAiModel ? '<span class="item-check">✓</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', listHtml);
        
        // 点击外部关闭列表
        setTimeout(() => {
            document.addEventListener('click', this.closeListOnOutsideClick.bind(this), { once: true });
        }, 100);
    }
    
    // 选择搜索引擎
    selectSearchEngine(engineKey) {
        this.currentSearchEngine = engineKey;
        this.hideAllLists();
        
        // 更新按钮显示
        const btn = document.getElementById('searchEngineBtn');
        if (btn) {
            const engine = this.searchEngines[engineKey];
            btn.innerHTML = `${engine.icon}`;
            btn.title = `当前搜索引擎: ${engine.name}`;
        }
        
        // 保存到本地存储
        localStorage.setItem('currentSearchEngine', engineKey);
    }
    
    // 选择AI模型
    selectAiModel(modelKey) {
        this.currentAiModel = modelKey;
        this.hideAllLists();
        
        // 更新按钮显示
        const btn = document.getElementById('aiModelBtn');
        if (btn) {
            const model = this.aiModels[modelKey];
            btn.innerHTML = `${model.icon}`;
            btn.title = `当前AI模型: ${model.name}`;
        }
        
        // 保存到本地存储
        localStorage.setItem('currentAiModel', modelKey);
        
        // 导航到AI模型首页
        this.navigateToUrl(this.aiModels[modelKey].url);
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
    
    // 显示收藏夹
    showBookmarks() {
        this.hideAllLists();
        
        const bookmarksHtml = this.bookmarks.length > 0 
            ? this.bookmarks.map((bookmark, index) => `
                <div class="list-item" onclick="browserManager.navigateToUrl('${bookmark.url}')">
                    <span class="item-icon">⭐</span>
                    <div class="item-content">
                        <div class="item-name">${bookmark.title}</div>
                        <div class="item-url">${bookmark.url}</div>
                    </div>
                    <button class="item-delete" onclick="event.stopPropagation(); browserManager.removeBookmarkByIndex(${index})" title="删除收藏">×</button>
                </div>
            `).join('')
            : '<div class="empty-state">暂无收藏</div>';
        
        const listHtml = `
            <div class="dropdown-list" id="bookmarksList">
                <div class="list-header">收藏夹</div>
                ${bookmarksHtml}
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', listHtml);
        
        // 点击外部关闭列表
        setTimeout(() => {
            document.addEventListener('click', this.closeListOnOutsideClick.bind(this), { once: true });
        }, 100);
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
    
    // 通过索引删除收藏
    removeBookmarkByIndex(index) {
        this.bookmarks.splice(index, 1);
        this.saveBookmarks();
        this.updateBookmarkButton();
        
        // 重新显示收藏夹列表
        this.hideAllLists();
        setTimeout(() => this.showBookmarks(), 100);
    }
    
    // 隐藏所有下拉列表
    hideAllLists() {
        const lists = document.querySelectorAll('.dropdown-list');
        lists.forEach(list => list.remove());
    }
    
    // 点击外部关闭列表
    closeListOnOutsideClick(event) {
        const list = document.querySelector('.dropdown-list');
        if (list && !list.contains(event.target)) {
            this.hideAllLists();
        }
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