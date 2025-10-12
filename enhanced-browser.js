// 增强版移动浏览器管理类
class EnhancedBrowserManager {
    constructor() {
        this.tabs = []; // 标签页数组
        this.activeTabId = null;
        this.tabIdCounter = 0;
        this.bookmarks = this.loadBookmarks();
        this.currentSearchEngine = 'baidu';
        this.currentAiModel = 'deepseek';
        
        // 手势相关
        this.gestureStartX = 0;
        this.gestureStartY = 0;
        this.gestureThreshold = 50;
        this.isGesturing = false;
        
        // 搜索引擎配置（移动端优化）
        this.searchEngines = {
            baidu: { name: '百度', url: 'https://m.baidu.com/s?word=', icon: '🔍' },
            google: { name: '谷歌', url: 'https://www.google.com/search?q=', icon: '🌐' },
            bing: { name: '必应', url: 'https://www.bing.com/search?q=', icon: '🔎' },
            sogou: { name: '搜狗', url: 'https://m.sogou.com/web/searchList.jsp?keyword=', icon: '🐕' },
            so360: { name: '360搜索', url: 'https://m.so.com/s?q=', icon: '🛡️' },
            shenma: { name: '神马搜索', url: 'https://m.sm.cn/s?q=', icon: '🐎' }
        };
        
        // AI模型配置
        this.aiModels = {
            deepseek: { name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: '🧠' },
            kimi: { name: 'Kimi', url: 'https://kimi.moonshot.cn/', icon: '🌙' },
            doubao: { name: '豆包', url: 'https://www.doubao.com/', icon: '🫘' },
            wenxin: { name: '文心一言', url: 'https://yiyan.baidu.com/', icon: '📝' },
            zhipu: { name: '智谱清言', url: 'https://chatglm.cn/', icon: '🎯' },
            tongyi: { name: '通义', url: 'https://tongyi.aliyun.com/', icon: '🔮' },
            claude: { name: 'Claude', url: 'https://claude.ai/', icon: '🤖' },
            chatgpt: { name: 'ChatGPT', url: 'https://chat.openai.com/', icon: '💬' }
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.createInitialTab();
        this.bindEvents();
        this.setupGestures();
        this.updateUI();
    }
    
    // 创建初始标签页
    createInitialTab() {
        this.createNewTab('https://m.baidu.com', '百度');
    }
    
    // 创建新标签页
    createNewTab(url = 'https://m.baidu.com', title = '新标签页') {
        const tabId = ++this.tabIdCounter;
        const tab = {
            id: tabId,
            url: url,
            title: title,
            history: [url],
            historyIndex: 0,
            canGoBack: false,
            canGoForward: false,
            isLoading: false,
            favicon: '🌐'
        };
        
        this.tabs.push(tab);
        this.activeTabId = tabId;
        this.updateTabsUI();
        this.navigateToUrl(url);
        
        return tabId;
    }
    
    // 关闭标签页
    closeTab(tabId) {
        const tabIndex = this.tabs.findIndex(tab => tab.id === tabId);
        if (tabIndex === -1) return;
        
        // 如果只有一个标签页，创建新的空白页
        if (this.tabs.length === 1) {
            this.tabs[0] = {
                id: ++this.tabIdCounter,
                url: 'https://m.baidu.com',
                title: '百度',
                history: ['https://m.baidu.com'],
                historyIndex: 0,
                canGoBack: false,
                canGoForward: false,
                isLoading: false,
                favicon: '🌐'
            };
            this.activeTabId = this.tabs[0].id;
        } else {
            this.tabs.splice(tabIndex, 1);
            
            // 如果关闭的是当前活动标签页，切换到相邻标签页
            if (tabId === this.activeTabId) {
                const newIndex = Math.min(tabIndex, this.tabs.length - 1);
                this.activeTabId = this.tabs[newIndex].id;
            }
        }
        
        this.updateTabsUI();
        this.updateCurrentTab();
    }
    
    // 切换到指定标签页
    switchToTab(tabId) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;
        
        this.activeTabId = tabId;
        this.updateTabsUI();
        this.updateCurrentTab();
    }
    
    // 获取当前活动标签页
    getCurrentTab() {
        return this.tabs.find(tab => tab.id === this.activeTabId);
    }
    
    // 更新当前标签页
    updateCurrentTab() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        const iframe = document.getElementById('browserFrame');
        if (iframe && iframe.src !== tab.url) {
            this.showLoading();
            iframe.src = tab.url;
        }
        
        this.updateNavigationButtons();
        this.updateUrlBar();
    }
    
    // 绑定事件
    bindEvents() {
        // 搜索引擎按钮
        const searchEngineBtn = document.getElementById('searchEngineBtn');
        if (searchEngineBtn) {
            searchEngineBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSearchEngines();
            });
        }
        
        // AI模型按钮
        const aiModelBtn = document.getElementById('aiModelBtn');
        if (aiModelBtn) {
            aiModelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showAiModels();
            });
        }
        
        // 导航按钮
        document.getElementById('backBtn')?.addEventListener('click', () => this.goBack());
        document.getElementById('forwardBtn')?.addEventListener('click', () => this.goForward());
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.refresh());
        document.getElementById('homeBtn')?.addEventListener('click', () => this.goHome());
        document.getElementById('bookmarkBtn')?.addEventListener('click', () => this.toggleBookmark());
        document.getElementById('bookmarkListBtn')?.addEventListener('click', () => this.showBookmarks());
        document.getElementById('historyBtn')?.addEventListener('click', () => this.showHistory());
        document.getElementById('shareBtn')?.addEventListener('click', () => this.shareUrl());
        
        // 添加多标签页按钮
        this.addTabsButton();
        
        // URL输入框
        const urlInput = document.querySelector('#browser-page .url-input');
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
        
        // iframe加载事件
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.addEventListener('load', () => {
                this.hideLoading();
                this.updateTabInfo();
                // 移动端优化由 mobile-force-optimizer.js 处理
            });
        }
        
        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-list') && !e.target.closest('.nav-btn') && !e.target.closest('.action-btn')) {
                this.hideAllLists();
            }
        });
    }
    
    // 添加标签页管理按钮
    addTabsButton() {
        const toolbar = document.querySelector('.browser-toolbar');
        if (!toolbar) return;
        
        // 检查是否已经添加了标签页按钮
        if (document.getElementById('tabsBtn')) return;
        
        const tabsBtn = document.createElement('button');
        tabsBtn.id = 'tabsBtn';
        tabsBtn.className = 'tool-btn';
        tabsBtn.innerHTML = '📑';
        tabsBtn.title = '标签页管理';
        tabsBtn.addEventListener('click', () => this.showTabsManager());
        
        // 插入到分享按钮之前
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            toolbar.insertBefore(tabsBtn, shareBtn);
        } else {
            toolbar.appendChild(tabsBtn);
        }
    }
    
    // 设置手势操作
    setupGestures() {
        const browserContent = document.querySelector('#browser-page .browser-content');
        if (!browserContent) return;
        
        let startX, startY, startTime;
        
        browserContent.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
                this.isGesturing = false;
            }
        }, { passive: true });
        
        browserContent.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && !this.isGesturing) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;
                
                // 检测水平滑动手势
                if (Math.abs(deltaX) > this.gestureThreshold && Math.abs(deltaY) < this.gestureThreshold) {
                    this.isGesturing = true;
                    
                    if (deltaX > 0) {
                        // 右滑 - 后退
                        this.showGestureHint('← 后退');
                    } else {
                        // 左滑 - 前进
                        this.showGestureHint('前进 →');
                    }
                }
            }
        }, { passive: true });
        
        browserContent.addEventListener('touchend', (e) => {
            if (this.isGesturing) {
                const endX = e.changedTouches[0].clientX;
                const deltaX = endX - startX;
                const duration = Date.now() - startTime;
                
                // 快速滑动才触发导航
                if (duration < 300 && Math.abs(deltaX) > this.gestureThreshold) {
                    if (deltaX > 0) {
                        this.goBack();
                    } else {
                        this.goForward();
                    }
                }
                
                this.hideGestureHint();
                this.isGesturing = false;
            }
        }, { passive: true });
    }
    
    // 显示手势提示
    showGestureHint(text) {
        let hint = document.getElementById('gestureHint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'gestureHint';
            hint.className = 'gesture-hint';
            document.body.appendChild(hint);
        }
        
        hint.textContent = text;
        hint.classList.add('show');
    }
    
    // 隐藏手势提示
    hideGestureHint() {
        const hint = document.getElementById('gestureHint');
        if (hint) {
            hint.classList.remove('show');
        }
    }
    

    
    // 显示搜索引擎列表
    showSearchEngines() {
        this.hideAllLists();
        
        const listHtml = `
            <div class="dropdown-list search-engine-list" id="searchEngineList">
                <div class="list-header">
                    <span>选择搜索引擎</span>
                    <button class="close-btn" onclick="enhancedBrowser.hideAllLists()">×</button>
                </div>
                ${Object.entries(this.searchEngines).map(([key, engine]) => `
                    <div class="list-item ${key === this.currentSearchEngine ? 'active' : ''}" 
                         onclick="enhancedBrowser.selectSearchEngine('${key}')">
                        <span class="item-icon">${engine.icon}</span>
                        <span class="item-name">${engine.name}</span>
                        ${key === this.currentSearchEngine ? '<span class="item-check">✓</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', listHtml);
    }
    
    // 显示AI模型列表
    showAiModels() {
        this.hideAllLists();
        
        const listHtml = `
            <div class="dropdown-list ai-model-list" id="aiModelList">
                <div class="list-header">
                    <span>选择AI模型</span>
                    <button class="close-btn" onclick="enhancedBrowser.hideAllLists()">×</button>
                </div>
                ${Object.entries(this.aiModels).map(([key, model]) => `
                    <div class="list-item ${key === this.currentAiModel ? 'active' : ''}" 
                         onclick="enhancedBrowser.selectAiModel('${key}')">
                        <span class="item-icon">${model.icon}</span>
                        <span class="item-name">${model.name}</span>
                        ${key === this.currentAiModel ? '<span class="item-check">✓</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', listHtml);
    }
    
    // 显示标签页管理器
    showTabsManager() {
        this.hideAllLists();
        
        const tabsHtml = this.tabs.map(tab => `
            <div class="tab-item ${tab.id === this.activeTabId ? 'active' : ''}" 
                 onclick="enhancedBrowser.switchToTab(${tab.id})">
                <div class="tab-favicon">${tab.favicon}</div>
                <div class="tab-info">
                    <div class="tab-title">${tab.title}</div>
                    <div class="tab-url">${tab.url}</div>
                </div>
                <button class="tab-close" onclick="event.stopPropagation(); enhancedBrowser.closeTab(${tab.id})">×</button>
            </div>
        `).join('');
        
        const listHtml = `
            <div class="dropdown-list tabs-manager" id="tabsManager">
                <div class="list-header">
                    <span>标签页管理 (${this.tabs.length})</span>
                    <div class="header-actions">
                        <button class="new-tab-btn" onclick="enhancedBrowser.createNewTab()">+</button>
                        <button class="close-btn" onclick="enhancedBrowser.hideAllLists()">×</button>
                    </div>
                </div>
                <div class="tabs-list">
                    ${tabsHtml}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', listHtml);
    }
    
    // 显示收藏夹
    showBookmarks() {
        this.hideAllLists();
        
        const bookmarksHtml = this.bookmarks.length > 0 
            ? this.bookmarks.map((bookmark, index) => `
                <div class="list-item bookmark-item" onclick="enhancedBrowser.navigateToUrl('${bookmark.url}')">
                    <span class="item-icon">⭐</span>
                    <div class="item-content">
                        <div class="item-name">${bookmark.title}</div>
                        <div class="item-url">${bookmark.url}</div>
                    </div>
                    <button class="item-delete" onclick="event.stopPropagation(); enhancedBrowser.removeBookmarkByIndex(${index})" title="删除收藏">×</button>
                </div>
            `).join('')
            : '<div class="empty-state">暂无收藏</div>';
        
        const listHtml = `
            <div class="dropdown-list bookmarks-list" id="bookmarksList">
                <div class="list-header">
                    <span>收藏夹</span>
                    <button class="close-btn" onclick="enhancedBrowser.hideAllLists()">×</button>
                </div>
                ${bookmarksHtml}
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', listHtml);
    }
    
    // 选择搜索引擎
    selectSearchEngine(engineKey) {
        this.currentSearchEngine = engineKey;
        this.hideAllLists();
        this.updateSearchEngineButton();
        localStorage.setItem('currentSearchEngine', engineKey);
    }
    
    // 选择AI模型
    selectAiModel(modelKey) {
        this.currentAiModel = modelKey;
        this.hideAllLists();
        this.updateAiModelButton();
        localStorage.setItem('currentAiModel', modelKey);
        this.navigateToUrl(this.aiModels[modelKey].url);
    }
    
    // 导航到URL
    navigateToUrl(url) {
        if (!url) return;
        
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        // URL格式化
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.')) {
                url = 'https://' + url;
            } else {
                const searchEngine = this.searchEngines[this.currentSearchEngine];
                url = searchEngine.url + encodeURIComponent(url);
            }
        }
        
        // 强制转换为移动端URL
        if (window.mobileOptimizer) {
            url = window.mobileOptimizer.forceMobileVersion(url);
        }
        
        // 更新标签页信息
        tab.url = url;
        tab.isLoading = true;
        
        // 添加到历史记录
        if (tab.history[tab.historyIndex] !== url) {
            // 如果不在历史记录末尾，删除后面的记录
            if (tab.historyIndex < tab.history.length - 1) {
                tab.history = tab.history.slice(0, tab.historyIndex + 1);
            }
            tab.history.push(url);
            tab.historyIndex = tab.history.length - 1;
        }
        
        this.updateNavigationButtons();
        this.showLoading();
        
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = url;
        }
        
        this.updateTabsUI();
    }
    
    // 处理URL输入
    handleUrlInput(input) {
        if (!input) return;
        
        // 检查是否是搜索词
        if (!input.includes('.') || input.includes(' ')) {
            const searchEngine = this.searchEngines[this.currentSearchEngine];
            const searchUrl = searchEngine.url + encodeURIComponent(input);
            this.navigateToUrl(searchUrl);
        } else {
            this.navigateToUrl(input);
        }
    }
    
    // 后退
    goBack() {
        const tab = this.getCurrentTab();
        if (!tab || tab.historyIndex <= 0) return;
        
        tab.historyIndex--;
        tab.url = tab.history[tab.historyIndex];
        tab.isLoading = true;
        
        this.showLoading();
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = tab.url;
        }
        
        this.updateNavigationButtons();
        this.updateUrlBar();
        this.updateTabsUI();
    }
    
    // 前进
    goForward() {
        const tab = this.getCurrentTab();
        if (!tab || tab.historyIndex >= tab.history.length - 1) return;
        
        tab.historyIndex++;
        tab.url = tab.history[tab.historyIndex];
        tab.isLoading = true;
        
        this.showLoading();
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = tab.url;
        }
        
        this.updateNavigationButtons();
        this.updateUrlBar();
        this.updateTabsUI();
    }
    
    // 刷新
    refresh() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        tab.isLoading = true;
        this.showLoading();
        
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = iframe.src;
        }
        
        this.updateTabsUI();
    }
    
    // 回到主页
    goHome() {
        this.navigateToUrl('https://m.baidu.com');
    }
    
    // 切换收藏状态
    toggleBookmark() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        const isBookmarked = this.isBookmarked(tab.url);
        
        if (isBookmarked) {
            this.removeBookmark(tab.url);
            this.showToast('已取消收藏', 'success');
        } else {
            this.addBookmark(tab.url, tab.title);
            this.showToast('已添加到收藏', 'success');
        }
        
        this.updateBookmarkButton();
    }
    
    // 分享当前页面
    shareUrl() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        if (navigator.share) {
            navigator.share({
                title: tab.title,
                url: tab.url
            });
        } else {
            navigator.clipboard.writeText(tab.url).then(() => {
                this.showToast('链接已复制到剪贴板', 'success');
            }).catch(() => {
                this.showToast('分享失败', 'error');
            });
        }
    }
    
    // 显示历史记录
    showHistory() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        const historyHtml = tab.history.map((url, index) => {
            const isActive = index === tab.historyIndex;
            return `
                <div class="history-item ${isActive ? 'active' : ''}" onclick="enhancedBrowser.navigateToHistory(${index})">
                    <div class="history-url">${url}</div>
                    <div class="history-time">${this.getTimeAgo(Date.now() - (tab.history.length - index) * 60000)}</div>
                </div>
            `;
        }).join('');
        
        this.showModal('浏览历史', historyHtml);
    }
    
    // 导航到历史记录
    navigateToHistory(index) {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        tab.historyIndex = index;
        tab.url = tab.history[index];
        tab.isLoading = true;
        
        this.showLoading();
        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = tab.url;
        }
        
        this.updateNavigationButtons();
        this.updateUrlBar();
        this.updateTabsUI();
        this.hideModal();
    }
    
    // 更新UI相关方法
    updateUI() {
        this.updateSearchEngineButton();
        this.updateAiModelButton();
        this.updateNavigationButtons();
        this.updateUrlBar();
        this.updateTabsUI();
    }
    
    updateSearchEngineButton() {
        const btn = document.getElementById('searchEngineBtn');
        if (btn) {
            const engine = this.searchEngines[this.currentSearchEngine];
            btn.innerHTML = engine.icon;
            btn.title = `当前搜索引擎: ${engine.name}`;
        }
    }
    
    updateAiModelButton() {
        const btn = document.getElementById('aiModelBtn');
        if (btn) {
            const model = this.aiModels[this.currentAiModel];
            btn.innerHTML = model.icon;
            btn.title = `当前AI模型: ${model.name}`;
        }
    }
    
    updateNavigationButtons() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        const backBtn = document.getElementById('backBtn');
        const forwardBtn = document.getElementById('forwardBtn');
        
        if (backBtn) {
            backBtn.disabled = tab.historyIndex <= 0;
        }
        
        if (forwardBtn) {
            forwardBtn.disabled = tab.historyIndex >= tab.history.length - 1;
        }
        
        this.updateBookmarkButton();
    }
    
    updateBookmarkButton() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        if (bookmarkBtn) {
            const isBookmarked = this.isBookmarked(tab.url);
            bookmarkBtn.style.color = isBookmarked ? '#FFD700' : '';
            bookmarkBtn.title = isBookmarked ? '取消收藏' : '收藏';
        }
    }
    
    updateUrlBar() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        const urlInput = document.querySelector('#browser-page .url-input');
        if (urlInput) {
            urlInput.value = tab.url;
        }
    }
    
    updateTabsUI() {
        // 更新标签页按钮显示
        const tabsBtn = document.getElementById('tabsBtn');
        if (tabsBtn) {
            tabsBtn.innerHTML = `📑<span class="tab-count">${this.tabs.length}</span>`;
        }
    }
    
    updateTabInfo() {
        const tab = this.getCurrentTab();
        if (!tab) return;
        
        tab.isLoading = false;
        
        // 尝试获取页面标题
        try {
            const iframe = document.getElementById('browserFrame');
            if (iframe && iframe.contentDocument) {
                const title = iframe.contentDocument.title;
                if (title) {
                    tab.title = title;
                }
            }
        } catch (error) {
            // 跨域限制，无法获取标题
        }
        
        this.updateTabsUI();
    }
    
    // 工具方法
    showLoading() {
        const loading = document.getElementById('browserLoading');
        if (loading) {
            loading.classList.add('show');
        }
    }
    
    hideLoading() {
        const loading = document.getElementById('browserLoading');
        if (loading) {
            loading.classList.remove('show');
        }
    }
    
    hideAllLists() {
        const lists = document.querySelectorAll('.dropdown-list');
        lists.forEach(list => list.remove());
    }
    
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'browser-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="enhancedBrowser.hideModal()">×</button>
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
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `browser-toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    // 收藏相关方法
    isBookmarked(url) {
        return this.bookmarks.some(bookmark => bookmark.url === url);
    }
    
    addBookmark(url, title = url) {
        if (!this.isBookmarked(url)) {
            this.bookmarks.push({
                url: url,
                title: title,
                time: new Date().toISOString()
            });
            this.saveBookmarks();
        }
    }
    
    removeBookmark(url) {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.url !== url);
        this.saveBookmarks();
    }
    
    removeBookmarkByIndex(index) {
        this.bookmarks.splice(index, 1);
        this.saveBookmarks();
        this.updateBookmarkButton();
        
        // 重新显示收藏夹列表
        this.hideAllLists();
        setTimeout(() => this.showBookmarks(), 100);
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
    
    getTimeAgo(ms) {
        const minutes = Math.floor(ms / 60000);
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}小时前`;
        const days = Math.floor(hours / 24);
        return `${days}天前`;
    }
}

// 全局实例
let enhancedBrowser;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    enhancedBrowser = new EnhancedBrowserManager();
});