// 浏览器功能管理类
class BrowserManager {
    constructor() {
        this.currentUrl = 'https://m.baidu.com';
        this.history = ['https://m.baidu.com'];
        this.historyIndex = 0;
        this.historyRecords = this.loadHistoryRecords();
        this.bookmarks = this.loadBookmarks();
        this.tabs = this.loadTabs();
        this.currentTabIndex = 0;
        this.downloads = [];
        this.homeUrl = 'https://m.baidu.com';
        this.currentSearchEngine = 'baidu';
        this.currentAiModel = 'chatgpt';

        // iPhone User-Agent
        this.iPhoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

        // 搜索引擎配置（移动端优化）
        this.searchEngines = {
            baidu: { name: '百度', url: 'https://m.baidu.com/s?word=', icon: '🔍' },
            google: { name: '谷歌', url: 'https://m.google.com/search?q=', icon: '🌐' },
            douyin: { name: '抖音', url: 'https://m.douyin.com/search/', icon: '🎵' },
            bing: { name: '必应', url: 'https://m.bing.com/search?q=', icon: '🔎' },
            sogou: { name: '搜狗', url: 'https://m.sogou.com/web/searchList.jsp?keyword=', icon: '🐕' },
            toutiao: { name: '头条搜索', url: 'https://m.toutiao.com/search/?keyword=', icon: '📰' },
            so360: { name: '360搜索', url: 'https://m.so.com/s?q=', icon: '🛡️' },
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

        // 初始化长按功能
        this.initLongPressFeature();
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
        const btn = document.getElementById('searchEngineBtnDemo') || document.getElementById('searchEngineBtn');
        if (btn) {
            const engine = this.searchEngines[this.currentSearchEngine];
            btn.innerHTML = engine.icon;
            btn.title = `当前搜索引擎: ${engine.name}`;
        }
    }

    // 更新AI模型按钮
    updateAiModelButton() {
        const btn = document.getElementById('aiModelBtnDemo') || document.getElementById('aiModelBtn');
        if (btn) {
            const model = this.aiModels[this.currentAiModel];
            btn.innerHTML = model.icon;
            btn.title = `当前AI模型: ${model.name}`;
        }
    }

    // 绑定事件
    bindEvents() {
        // 搜索引擎按钮
        const searchEngineBtn = document.getElementById('searchEngineBtnDemo') || document.getElementById('searchEngineBtn');
        if (searchEngineBtn) {
            searchEngineBtn.addEventListener('click', () => this.showSearchEngines());
        }

        // AI模型按钮
        const aiModelBtn = document.getElementById('aiModelBtnDemo') || document.getElementById('aiModelBtn');
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

        // 粘贴按钮
        const pasteBtn = document.getElementById('pasteBtnDemo') || document.getElementById('pasteBtn');
        if (pasteBtn) {
            pasteBtn.addEventListener('click', () => this.pasteFromClipboard());
        }

        // 清空按钮
        const clearBtn = document.getElementById('clearBtnDemo') || document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearUrlInput());
        }

        // 标签页按钮
        const tabsBtn = document.getElementById('tabsBtn');
        if (tabsBtn) {
            tabsBtn.addEventListener('click', () => this.showTabsManager());
        }

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
    }

    // 设置iframe事件
    setupIframeEvents() {
        const iframe = document.getElementById('browserFrame');
        const loading = document.getElementById('browserLoading');

        if (iframe && loading) {
            iframe.addEventListener('load', () => {
                loading.classList.remove('show');
                this.updateUrlBar();
                this.injectMobileUserAgent(iframe);
            });

            // 显示加载状态
            this.showLoading();
        }
    }

    // 注入移动端User-Agent
    injectMobileUserAgent(iframe) {
        try {
            // iOS Safari User-Agent
            const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

            // 尝试设置iframe的User-Agent（注意：由于同源策略限制，这可能不会生效）
            if (iframe.contentWindow && iframe.contentWindow.navigator) {
                // 这里我们通过代理的方式来处理移动端访问
                this.setupMobileProxy(iframe);
            }
        } catch (error) {
            console.log('无法直接修改User-Agent，使用代理方式');
            this.setupMobileProxy(iframe);
        }
    }

    // 设置移动端代理
    setupMobileProxy(iframe) {
        // 为常见网站添加移动端URL重定向
        const currentSrc = iframe.src;
        const mobileUrl = this.getMobileUrl(currentSrc);

        if (mobileUrl !== currentSrc) {
            iframe.src = mobileUrl;
        }
    }

    // 获取移动端URL
    getMobileUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            // 常见网站的移动端URL映射
            const mobileMapping = {
                'www.baidu.com': 'm.baidu.com',
                'baidu.com': 'm.baidu.com',
                'www.google.com': 'm.google.com',
                'google.com': 'm.google.com',
                'www.bing.com': 'm.bing.com',
                'bing.com': 'm.bing.com',
                'www.sogou.com': 'm.sogou.com',
                'sogou.com': 'm.sogou.com',
                'www.so.com': 'm.so.com',
                'so.com': 'm.so.com',
                'www.zhihu.com': 'm.zhihu.com',
                'zhihu.com': 'm.zhihu.com',
                'www.weibo.com': 'm.weibo.com',
                'weibo.com': 'm.weibo.com',
                'www.douyin.com': 'm.douyin.com',
                'douyin.com': 'm.douyin.com',
                'www.xiaohongshu.com': 'm.xiaohongshu.com',
                'xiaohongshu.com': 'm.xiaohongshu.com'
            };

            // 检查是否需要重定向到移动端
            if (mobileMapping[hostname]) {
                urlObj.hostname = mobileMapping[hostname];
                return urlObj.toString();
            }

            // 如果已经是移动端URL，直接返回
            if (hostname.startsWith('m.') || hostname.includes('mobile')) {
                return url;
            }

            // 尝试添加m.前缀
            if (!hostname.startsWith('www.')) {
                urlObj.hostname = 'm.' + hostname;
                return urlObj.toString();
            }

            return url;
        } catch (error) {
            return url;
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

        // 转换为移动端URL
        url = this.getMobileUrl(url);

        this.showLoading();

        const iframe = document.getElementById('browserFrame');
        if (iframe) {
            iframe.src = url;
            this.currentUrl = url;
            this.addToHistory(url);
            this.updateNavigationButtons();

            // 更新当前标签页信息
            this.updateCurrentTab(url);
        }
    }

    // 显示搜索引擎列表
    showSearchEngines() {
        this.hideAllLists();

        const listHtml = `
            <div class="dropdown-list search-engine-list centered-list ios-style" id="searchEngineList" style="display: block !important; z-index: 10000 !important;">
                <div class="list-header">
                    <span>选择搜索引擎</span>
                    <button class="close-btn" onclick="browserManager.hideAllLists()">✕</button>
                </div>
                <div class="list-content">
                    ${Object.entries(this.searchEngines).map(([key, engine]) => `
                        <div class="list-item ${key === this.currentSearchEngine ? 'active' : ''}" 
                             onclick="browserManager.selectSearchEngine('${key}')">
                            <span class="item-icon">${engine.icon}</span>
                            <span class="item-name">${engine.name}</span>
                            ${key === this.currentSearchEngine ? '<span class="item-check">✓</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', listHtml);

        // 确保抽屉显示
        setTimeout(() => {
            const drawer = document.getElementById('searchEngineList');
            if (drawer) {
                drawer.style.display = 'block';
                drawer.style.opacity = '1';
                drawer.style.visibility = 'visible';
            }
        }, 10);

        // 点击外部关闭列表
        setTimeout(() => {
            document.addEventListener('click', this.closeListOnOutsideClick.bind(this), { once: true });
        }, 100);
    }

    // 显示AI模型列表
    showAiModels() {
        this.hideAllLists();

        const listHtml = `
            <div class="dropdown-list ai-model-list centered-list ios-style" id="aiModelList" style="display: block !important; z-index: 10000 !important;">
                <div class="list-header">
                    <span>选择AI模型</span>
                    <button class="close-btn" onclick="browserManager.hideAllLists()">✕</button>
                </div>
                <div class="list-content">
                    ${Object.entries(this.aiModels).map(([key, model]) => `
                        <div class="list-item ${key === this.currentAiModel ? 'active' : ''}" 
                             onclick="browserManager.selectAiModel('${key}')">
                            <span class="item-icon">${model.icon}</span>
                            <span class="item-name">${model.name}</span>
                            ${key === this.currentAiModel ? '<span class="item-check">✓</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', listHtml);

        // 确保抽屉显示
        setTimeout(() => {
            const drawer = document.getElementById('aiModelList');
            if (drawer) {
                drawer.style.display = 'block';
                drawer.style.opacity = '1';
                drawer.style.visibility = 'visible';
            }
        }, 10);

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
        const btn = document.getElementById('searchEngineBtnDemo') || document.getElementById('searchEngineBtn');
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
        const btn = document.getElementById('aiModelBtnDemo') || document.getElementById('aiModelBtn');
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
        // 创建收藏夹弹出界面
        const existingBookmarks = document.querySelector('.bookmarks-overlay');
        if (existingBookmarks) {
            existingBookmarks.remove();
            return;
        }

        const bookmarksHtml = this.bookmarks.length > 0
            ? this.bookmarks.map((bookmark, index) => `
                <div class="bookmark-card" onclick="browserManager.navigateToUrl('${bookmark.url}')">
                    <div class="bookmark-favicon">⭐</div>
                    <div class="bookmark-info">
                        <div class="bookmark-title">${bookmark.title || '未命名'}</div>
                        <div class="bookmark-url">${bookmark.url}</div>
                        <div class="bookmark-time">${this.formatTime(bookmark.time)}</div>
                    </div>
                    <button class="bookmark-delete-btn" onclick="event.stopPropagation(); browserManager.removeBookmarkByIndex(${index})" title="删除收藏">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
                        </svg>
                    </button>
                </div>
            `).join('')
            : `<div class="empty-bookmarks">
                <div class="empty-icon">📚</div>
                <div class="empty-title">暂无收藏</div>
                <div class="empty-desc">收藏喜欢的网页，方便下次访问</div>
            </div>`;

        const bookmarksOverlay = document.createElement('div');
        bookmarksOverlay.className = 'bookmarks-overlay';
        bookmarksOverlay.innerHTML = `
            <div class="bookmarks-modal">
                <div class="bookmarks-header">
                    <h3>我的收藏</h3>
                    <div class="bookmarks-actions">
                        ${this.bookmarks.length > 0 ? '<button class="clear-all-bookmarks" title="清空收藏">清空</button>' : ''}
                        <button class="close-bookmarks">×</button>
                    </div>
                </div>
                <div class="bookmarks-content">
                    ${bookmarksHtml}
                </div>
            </div>
        `;

        document.body.appendChild(bookmarksOverlay);

        // 绑定事件
        bookmarksOverlay.querySelector('.close-bookmarks').addEventListener('click', () => {
            bookmarksOverlay.remove();
        });

        bookmarksOverlay.addEventListener('click', (e) => {
            if (e.target === bookmarksOverlay) {
                bookmarksOverlay.remove();
            }
        });

        const clearAllBtn = bookmarksOverlay.querySelector('.clear-all-bookmarks');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm('确定要清空所有收藏吗？')) {
                    this.bookmarks = [];
                    this.saveBookmarks();
                    this.updateBookmarkButton();
                    this.showToast('已清空所有收藏');
                    bookmarksOverlay.remove();
                }
            });
        }
    }

    // 显示历史记录
    showHistory() {
        // 创建历史记录弹出界面
        const existingHistory = document.querySelector('.history-overlay');
        if (existingHistory) {
            existingHistory.remove();
            return;
        }

        const historyHtml = this.historyRecords.length > 0
            ? this.historyRecords.slice().reverse().map((record, index) => {
                const actualIndex = this.historyRecords.length - 1 - index;
                const timeAgo = this.formatTime(record.time);
                const isActive = record.url === this.currentUrl;
                return `
                    <div class="history-card ${isActive ? 'active' : ''}" onclick="browserManager.navigateToUrl('${record.url}')">
                        <div class="history-favicon">🌐</div>
                        <div class="history-info">
                            <div class="history-title">${record.title || this.getPageTitle(record.url)}</div>
                            <div class="history-url">${record.url}</div>
                            <div class="history-time">${timeAgo} • 访问${record.visitCount}次</div>
                        </div>
                        <div class="history-actions">
                            <button class="action-btn" onclick="event.stopPropagation(); browserManager.addBookmark('${record.url}', '${record.title || this.getPageTitle(record.url)}')" title="收藏">
                                ⭐
                            </button>
                            <button class="action-btn" onclick="event.stopPropagation(); browserManager.shareUrl('${record.url}')" title="分享">
                                📤
                            </button>
                            <button class="action-btn" onclick="event.stopPropagation(); browserManager.removeHistoryRecord(${actualIndex})" title="删除">
                                🗑️
                            </button>
                        </div>
                        ${isActive ? '<div class="history-current">当前</div>' : ''}
                    </div>
                `;
            }).join('')
            : `<div class="empty-history">
                <div class="empty-icon">📖</div>
                <div class="empty-title">暂无历史记录</div>
                <div class="empty-desc">开始浏览网页，这里会显示访问记录</div>
            </div>`;

        const historyOverlay = document.createElement('div');
        historyOverlay.className = 'history-overlay';
        historyOverlay.innerHTML = `
            <div class="history-modal">
                <div class="history-header">
                    <h3>浏览历史</h3>
                    <div class="history-actions">
                        ${this.historyRecords.length > 0 ? '<button class="clear-all-history" title="清空历史">清空</button>' : ''}
                        <button class="close-history">×</button>
                    </div>
                </div>
                <div class="history-content">
                    ${historyHtml}
                </div>
            </div>
        `;

        document.body.appendChild(historyOverlay);

        // 绑定事件
        historyOverlay.querySelector('.close-history').addEventListener('click', () => {
            historyOverlay.remove();
        });

        historyOverlay.addEventListener('click', (e) => {
            if (e.target === historyOverlay) {
                historyOverlay.remove();
            }
        });

        const clearAllBtn = historyOverlay.querySelector('.clear-all-history');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm('确定要清空所有历史记录吗？')) {
                    this.historyRecords = [];
                    this.history = [this.homeUrl];
                    this.historyIndex = 0;
                    localStorage.setItem('browser_history_records', JSON.stringify(this.historyRecords));
                    localStorage.setItem('browser_history', JSON.stringify(this.history));
                    this.showToast('已清空历史记录');
                    historyOverlay.remove();
                }
            });
        }
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

        // 获取页面标题
        let pageTitle;
        try {
            const iframe = document.querySelector('.browser-content iframe');
            if (iframe && iframe.contentDocument) {
                pageTitle = iframe.contentDocument.title || this.getPageTitle(url);
            } else {
                pageTitle = this.getPageTitle(url);
            }
        } catch (e) {
            pageTitle = this.getPageTitle(url);
        }

        // 如果新URL与当前URL不同，添加到历史记录
        if (this.history[this.history.length - 1] !== url) {
            this.history.push(url);
            this.historyIndex = this.history.length - 1;

            // 同时添加到详细历史记录
            if (!this.historyRecords) {
                this.historyRecords = [];
            }
            this.historyRecords.push({
                url: url,
                title: pageTitle,
                time: new Date().toISOString(),
                visitCount: 1
            });
        }

        // 限制历史记录数量
        if (this.history.length > 100) {
            this.history = this.history.slice(-100);
            this.historyIndex = this.history.length - 1;

            if (this.historyRecords && this.historyRecords.length > 100) {
                this.historyRecords = this.historyRecords.slice(-100);
            }
        }

        // 保存到本地存储
        localStorage.setItem('browser_history', JSON.stringify(this.history));
        localStorage.setItem('browser_history_index', this.historyIndex.toString());
        if (this.historyRecords) {
            localStorage.setItem('browser_history_records', JSON.stringify(this.historyRecords));
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

        // 关闭历史记录弹窗
        const historyOverlay = document.querySelector('.history-overlay');
        if (historyOverlay) {
            historyOverlay.remove();
        }
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
        const urlInput = document.querySelector('#browser-page .url-input');
        if (urlInput) {
            urlInput.value = this.currentUrl;
        }
    }

    // 收藏相关方法
    isBookmarked(url) {
        return this.bookmarks.some(bookmark => bookmark.url === url);
    }

    addBookmark(url, title = null) {
        if (!this.isBookmarked(url)) {
            // 尝试获取页面标题
            let pageTitle = title;
            if (!pageTitle) {
                try {
                    const iframe = document.querySelector('.browser-content iframe');
                    if (iframe && iframe.contentDocument) {
                        pageTitle = iframe.contentDocument.title || this.getPageTitle(url);
                    } else {
                        pageTitle = this.getPageTitle(url);
                    }
                } catch (e) {
                    pageTitle = this.getPageTitle(url);
                }
            }

            this.bookmarks.push({
                url: url,
                title: pageTitle,
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
        this.showToast('已删除收藏');

        // 重新显示收藏夹列表
        const existingBookmarks = document.querySelector('.bookmarks-overlay');
        if (existingBookmarks) {
            existingBookmarks.remove();
            setTimeout(() => this.showBookmarks(), 100);
        }
    }

    // 通过索引删除历史记录
    removeHistoryRecord(index) {
        if (index >= 0 && index < this.historyRecords.length) {
            this.historyRecords.splice(index, 1);
            localStorage.setItem('browser_history_records', JSON.stringify(this.historyRecords));

            // 同时更新旧的history数组
            this.history = this.historyRecords.map(record => record.url);
            localStorage.setItem('browser_history', JSON.stringify(this.history));

            // 重新显示历史记录
            const historyOverlay = document.querySelector('.history-overlay');
            if (historyOverlay) {
                historyOverlay.remove();
                setTimeout(() => this.showHistory(), 100);
            }

            this.showToast('已删除历史记录');
        }
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

    // 粘贴功能
    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            const urlInput = document.querySelector('#browser-page-demo .url-input') || document.querySelector('#browser-page .url-input');
            if (urlInput && text) {
                urlInput.value = text;
                urlInput.focus();
                this.showToast('已粘贴内容');

                // 触发输入事件以更新清空按钮状态
                urlInput.dispatchEvent(new Event('input'));
            }
        } catch (err) {
            this.showToast('粘贴失败，请手动粘贴');
        }
    }

    // 清空输入框
    clearUrlInput() {
        const urlInput = document.querySelector('#browser-page-demo .url-input') || document.querySelector('#browser-page .url-input');
        if (urlInput) {
            urlInput.value = '';
            urlInput.focus();
            this.showToast('已清空输入框');

            // 触发输入事件以更新清空按钮状态
            urlInput.dispatchEvent(new Event('input'));
        }
    }

    // 显示标签页管理器
    showTabsManager() {
        // 创建标签页管理器界面
        const existingManager = document.querySelector('.tabs-manager');
        if (existingManager) {
            existingManager.remove();
            return;
        }

        const tabsManager = document.createElement('div');
        tabsManager.className = 'tabs-manager';
        tabsManager.innerHTML = `
            <div class="tabs-manager-overlay">
                <div class="tabs-manager-content">
                    <div class="tabs-manager-header">
                        <h3>标签页管理</h3>
                        <button class="close-tabs-manager">×</button>
                    </div>
                    <div class="tabs-grid">
                        ${this.generateTabCards()}
                    </div>
                    <div class="tabs-manager-footer">
                        <button class="new-tab-btn">新建标签页</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(tabsManager);

        // 绑定事件
        tabsManager.querySelector('.close-tabs-manager').addEventListener('click', () => {
            tabsManager.remove();
        });

        tabsManager.querySelector('.tabs-manager-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                tabsManager.remove();
            }
        });

        tabsManager.querySelector('.new-tab-btn').addEventListener('click', () => {
            this.newTab();
            tabsManager.remove();
        });
    }

    // 生成标签页卡片
    generateTabCards() {
        if (this.tabs.length === 0) {
            return `
                <div class="empty-tabs">
                    <div class="empty-icon">📄</div>
                    <div class="empty-title">暂无打开的标签页</div>
                    <div class="empty-desc">点击新建标签页开始浏览</div>
                </div>
            `;
        }

        return this.tabs.map((tab, index) => {
            const timeAgo = this.formatTime(tab.lastVisited);
            const isActive = tab.isActive || tab.url === this.currentUrl;
            return `
                <div class="tab-card ${isActive ? 'active' : ''}" data-index="${index}" onclick="browserManager.switchToTab(${index})">
                    <div class="tab-card-header">
                        <span class="tab-favicon">${tab.favicon || '🌐'}</span>
                        <button class="close-tab-btn" onclick="event.stopPropagation(); browserManager.closeTab(${index})" title="关闭标签页">×</button>
                    </div>
                    <div class="tab-card-content">
                        <div class="tab-title">${tab.title || this.getPageTitle(tab.url)}</div>
                        <div class="tab-url">${tab.url}</div>
                        <div class="tab-time">${timeAgo}</div>
                    </div>
                    ${isActive ? '<div class="tab-current">当前</div>' : ''}
                </div>
            `;
        }).join('');
    }

    loadBookmarks() {
        try {
            return JSON.parse(localStorage.getItem('browser_bookmarks') || '[]');
        } catch {
            return [];
        }
    }

    loadHistoryRecords() {
        try {
            return JSON.parse(localStorage.getItem('browser_history_records') || '[]');
        } catch {
            return [];
        }
    }

    loadTabs() {
        try {
            const savedTabs = JSON.parse(localStorage.getItem('browser_tabs') || '[]');
            if (savedTabs.length === 0) {
                // 初始化默认标签页
                return [{
                    id: Date.now(),
                    title: '百度',
                    url: 'https://m.baidu.com',
                    favicon: '🔍',
                    isActive: true,
                    lastVisited: new Date().toISOString()
                }];
            }
            return savedTabs;
        } catch {
            return [{
                id: Date.now(),
                title: '百度',
                url: 'https://m.baidu.com',
                favicon: '🔍',
                isActive: true,
                lastVisited: new Date().toISOString()
            }];
        }
    }

    saveTabs() {
        localStorage.setItem('browser_tabs', JSON.stringify(this.tabs));
    }

    // 切换到指定标签页
    switchToTab(index) {
        if (index >= 0 && index < this.tabs.length) {
            // 更新当前标签页状态
            this.tabs.forEach(tab => tab.isActive = false);
            this.tabs[index].isActive = true;
            this.tabs[index].lastVisited = new Date().toISOString();
            this.currentTabIndex = index;

            // 导航到该标签页的URL
            this.navigateToUrl(this.tabs[index].url);
            this.saveTabs();

            // 关闭标签页管理器
            const tabsManager = document.querySelector('.tabs-manager');
            if (tabsManager) {
                tabsManager.remove();
            }

            this.showToast(`已切换到：${this.tabs[index].title}`);
        }
    }

    // 关闭标签页
    closeTab(index) {
        if (index >= 0 && index < this.tabs.length) {
            const closedTab = this.tabs[index];
            this.tabs.splice(index, 1);

            // 如果关闭的是当前标签页，切换到其他标签页
            if (closedTab.isActive && this.tabs.length > 0) {
                const newIndex = Math.min(index, this.tabs.length - 1);
                this.switchToTab(newIndex);
            } else if (this.tabs.length === 0) {
                // 如果没有标签页了，创建一个新的
                this.newTab();
            }

            this.saveTabs();

            // 重新显示标签页管理器
            const tabsManager = document.querySelector('.tabs-manager');
            if (tabsManager) {
                const tabsGrid = tabsManager.querySelector('.tabs-grid');
                if (tabsGrid) {
                    tabsGrid.innerHTML = this.generateTabCards();
                }
            }

            this.showToast(`已关闭：${closedTab.title}`);
        }
    }

    // 新建标签页
    newTab(url = 'https://m.baidu.com') {
        const newTab = {
            id: Date.now(),
            title: this.getPageTitle(url),
            url: url,
            favicon: '🌐',
            isActive: true,
            lastVisited: new Date().toISOString()
        };

        // 将其他标签页设为非活跃状态
        this.tabs.forEach(tab => tab.isActive = false);

        // 添加新标签页
        this.tabs.push(newTab);
        this.currentTabIndex = this.tabs.length - 1;

        // 导航到新标签页
        this.navigateToUrl(url);
        this.saveTabs();

        this.showToast('已创建新标签页');
    }

    // 更新当前标签页信息
    updateCurrentTab(url, title = null) {
        if (this.tabs.length > 0 && this.currentTabIndex >= 0 && this.currentTabIndex < this.tabs.length) {
            this.tabs[this.currentTabIndex].url = url;
            this.tabs[this.currentTabIndex].title = title || this.getPageTitle(url);
            this.tabs[this.currentTabIndex].lastVisited = new Date().toISOString();
            this.saveTabs();
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
        // 移除现有的toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 2000);
    }

    // 格式化时间
    formatTime(timeString) {
        if (!timeString) return '未知时间';
        try {
            const date = new Date(timeString);
            const now = new Date();
            const diff = now - date;

            if (diff < 60000) return '刚刚';
            if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
            if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;

            return date.toLocaleDateString();
        } catch {
            return '未知时间';
        }
    }

    // 获取页面标题
    getPageTitle(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            // 常见网站标题映射
            const titleMapping = {
                'm.baidu.com': '百度',
                'baidu.com': '百度',
                'm.google.com': '谷歌',
                'google.com': '谷歌',
                'm.bing.com': '必应',
                'bing.com': '必应',
                'github.com': 'GitHub',
                'm.zhihu.com': '知乎',
                'zhihu.com': '知乎',
                'm.weibo.com': '微博',
                'weibo.com': '微博'
            };

            return titleMapping[hostname] || hostname;
        } catch {
            return url;
        }
    }

    // 初始化长按功能
    initLongPressFeature() {
        const browserContent = document.querySelector('#browser-page .browser-content');
        if (!browserContent) return;

        let longPressTimer = null;
        let startX = 0;
        let startY = 0;
        let isLongPress = false;

        // 触摸开始
        browserContent.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isLongPress = false;

            // 设置长按定时器
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                this.handleLongPress(e);
            }, 500); // 500ms长按
        });

        // 触摸移动
        browserContent.addEventListener('touchmove', (e) => {
            if (longPressTimer) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - startX);
                const deltaY = Math.abs(touch.clientY - startY);

                // 如果移动距离超过阈值，取消长按
                if (deltaX > 10 || deltaY > 10) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            }
        });

        // 触摸结束
        browserContent.addEventListener('touchend', () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        });

        // 鼠标事件（桌面端）
        browserContent.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
            isLongPress = false;

            longPressTimer = setTimeout(() => {
                isLongPress = true;
                this.handleLongPress(e);
            }, 500);
        });

        browserContent.addEventListener('mousemove', (e) => {
            if (longPressTimer) {
                const deltaX = Math.abs(e.clientX - startX);
                const deltaY = Math.abs(e.clientY - startY);

                if (deltaX > 10 || deltaY > 10) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            }
        });

        browserContent.addEventListener('mouseup', () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        });

        // 阻止默认的上下文菜单
        browserContent.addEventListener('contextmenu', (e) => {
            if (isLongPress) {
                e.preventDefault();
            }
        });
    }

    // 处理长按事件
    handleLongPress(e) {
        const target = e.target;
        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX;
        const y = touch.clientY;

        // 检测元素类型
        let elementType = 'text';
        let elementData = {};

        if (target.tagName === 'A' || target.closest('a')) {
            elementType = 'link';
            const link = target.tagName === 'A' ? target : target.closest('a');
            elementData = {
                url: link.href,
                text: link.textContent.trim()
            };
        } else if (target.tagName === 'IMG') {
            elementType = 'image';
            elementData = {
                src: target.src,
                alt: target.alt || '图片'
            };
        } else {
            elementType = 'text';
            elementData = {
                text: this.getSelectedText() || target.textContent?.trim() || '文本'
            };
        }

        this.showContextMenu(x, y, elementType, elementData);
    }

    // 获取选中的文本
    getSelectedText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';
    }

    // 显示上下文菜单
    showContextMenu(x, y, type, data) {
        // 移除现有菜单
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'context-menu';

        let menuItems = [];

        switch (type) {
            case 'link':
                menuItems = [
                    { icon: '🆕', text: '新建打开', action: () => this.openLinkInNewTab(data.url) },
                    { icon: '🔗', text: '覆盖打开', action: () => this.openLink(data.url) },
                    { icon: '📋', text: '复制链接', action: () => this.copyToClipboard(data.url) },
                    { icon: '📤', text: '转发链接', action: () => this.shareLink(data.url) },
                    { icon: '⭐', text: '收藏链接', action: () => this.bookmarkLink(data.url, data.text) },
                    { icon: '📥', text: '下载链接', action: () => this.downloadLink(data.url) }
                ];
                break;
            case 'image':
                menuItems = [
                    { icon: '🆕', text: '新建打开', action: () => this.openLinkInNewTab(data.src) },
                    { icon: '🖼️', text: '查看图片', action: () => this.viewImage(data.src) },
                    { icon: '💾', text: '保存图片', action: () => this.saveImage(data.src) },
                    { icon: '📤', text: '分享图片', action: () => this.shareImage(data.src) },
                    { icon: '📋', text: '复制图片链接', action: () => this.copyToClipboard(data.src) }
                ];
                break;
            case 'text':
                menuItems = [
                    { icon: '📋', text: '复制', action: () => this.copyToClipboard(data.text) },
                    { icon: '🔘', text: '全选', action: () => this.selectAllText() },
                    { icon: '✂️', text: '选择', action: () => this.selectText(data.text) },
                    { icon: '🔍', text: '新建搜索', action: () => this.searchTextInNewTab(data.text) },
                    { icon: '📤', text: '分享文本', action: () => this.shareText(data.text) },
                    { icon: '🔖', text: '添加笔记', action: () => this.addNote(data.text) }
                ];
                break;
        }

        menu.innerHTML = `
             <div class="context-menu-header">
                 <span class="context-menu-title">${this.getMenuTitle(type)}</span>
                 <button class="context-menu-close">×</button>
             </div>
             <div class="context-menu-items">
                 ${menuItems.map(item => `
                     <div class="context-menu-item" data-action="${item.text}">
                         <span class="context-menu-icon">${item.icon}</span>
                         <span class="context-menu-text">${item.text}</span>
                     </div>
                 `).join('')}
             </div>
         `;

        // 设置菜单位置
        menu.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
        menu.style.top = `${Math.min(y, window.innerHeight - 300)}px`;

        document.body.appendChild(menu);

        // 绑定事件
        menu.querySelector('.context-menu-close').addEventListener('click', () => {
            menu.remove();
        });

        menuItems.forEach((item, index) => {
            const menuItem = menu.querySelectorAll('.context-menu-item')[index];
            menuItem.addEventListener('click', () => {
                item.action();
                menu.remove();
            });
        });

        // 点击外部关闭
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                }
            }, { once: true });
        }, 100);

        // 添加显示动画
        setTimeout(() => {
            menu.classList.add('show');
        }, 10);
    }

    // 获取菜单标题
    getMenuTitle(type) {
        const titles = {
            link: '链接操作',
            image: '图片操作',
            text: '文本操作'
        };
        return titles[type] || '操作菜单';
    }

    // 菜单操作方法
    openLink(url) {
        this.handleUrlInput(url);
        this.showToast('正在打开链接');
    }

    // 在新标签页中打开链接
    openLinkInNewTab(url) {
        this.newTab(url);
        this.showToast('已在新标签页打开');
    }

    // 下载链接
    downloadLink(url) {
        try {
            // 创建一个隐藏的下载链接
            const link = document.createElement('a');
            link.href = url;
            link.download = this.getFileNameFromUrl(url);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showToast('开始下载');
        } catch (error) {
            // 如果直接下载失败，尝试在新窗口打开
            window.open(url, '_blank');
            this.showToast('已在新窗口打开下载链接');
        }
    }

    // 从URL获取文件名
    getFileNameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop();
            return filename || 'download';
        } catch (error) {
            return 'download';
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('已复制到剪贴板');
            }).catch(() => {
                this.showToast('复制失败');
            });
        } else {
            this.showToast('复制功能不可用');
        }
    }

    bookmarkLink(url, title) {
        this.addBookmark(url, title);
        this.showToast('已添加到收藏');
    }

    shareLink(url) {
        if (navigator.share) {
            navigator.share({
                title: '分享链接',
                url: url
            });
        } else {
            this.copyToClipboard(url);
            this.showToast('链接已复制，可手动分享');
        }
    }

    viewImage(src) {
        window.open(src, '_blank');
        this.showToast('正在查看图片');
    }

    saveImage(src) {
        const link = document.createElement('a');
        link.href = src;
        link.download = 'image';
        link.click();
        this.showToast('正在保存图片');
    }

    shareImage(src) {
        if (navigator.share) {
            navigator.share({
                title: '分享图片',
                url: src
            });
        } else {
            this.copyToClipboard(src);
            this.showToast('图片链接已复制');
        }
    }

    searchText(text) {
        if (text.trim()) {
            const searchEngine = this.searchEngines[this.currentSearchEngine];
            const searchUrl = searchEngine.url + encodeURIComponent(text);
            this.handleUrlInput(searchUrl);
            this.showToast('正在搜索文本');
        }
    }

    // 在新标签页中搜索文本
    searchTextInNewTab(text) {
        if (text.trim()) {
            const searchEngine = this.searchEngines[this.currentSearchEngine];
            const searchUrl = searchEngine.url + encodeURIComponent(text);
            this.newTab(searchUrl);
            this.showToast('已在新标签页搜索');
        }
    }

    // 全选文本
    selectAllText() {
        try {
            const iframe = document.getElementById('browserFrame');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.document.execCommand('selectAll');
                this.showToast('已全选文本');
            } else {
                this.showToast('无法访问页面内容');
            }
        } catch (error) {
            this.showToast('全选功能不可用');
        }
    }

    // 选择文本（高亮显示）
    selectText(text) {
        try {
            const iframe = document.getElementById('browserFrame');
            if (iframe && iframe.contentWindow && iframe.contentWindow.find) {
                iframe.contentWindow.find(text);
                this.showToast('已选择文本');
            } else {
                this.copyToClipboard(text);
                this.showToast('文本已复制到剪贴板');
            }
        } catch (error) {
            this.copyToClipboard(text);
            this.showToast('文本已复制到剪贴板');
        }
    }

    shareText(text) {
        if (navigator.share) {
            navigator.share({
                title: '分享文本',
                text: text
            });
        } else {
            this.copyToClipboard(text);
            this.showToast('文本已复制');
        }
    }

    addNote(text) {
        // 简单的笔记功能
        const note = prompt('添加笔记:', text);
        if (note) {
            const notes = JSON.parse(localStorage.getItem('browser_notes') || '[]');
            notes.push({
                text: note,
                time: new Date().toISOString(),
                url: this.currentUrl
            });
            localStorage.setItem('browser_notes', JSON.stringify(notes));
            this.showToast('笔记已保存');
        }
    }
}

// 全局实例
let browserManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    browserManager = new BrowserManager();
    window.browserManager = browserManager; // 暴露到全局作用域
});