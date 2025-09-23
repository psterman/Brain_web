// Material Design 应用页面结构和交互
class MaterialAppsPage {
    constructor() {
        this.currentCategory = 'all';
        this.apps = this.getAppsData();
        this.filteredApps = [...this.apps];
        this.init();
    }

    init() {
        this.setupCategoryNavigation();
        this.setupSearch();
        this.setupAppInteractions();
        this.renderApps();
    }

    getAppsData() {
        return [
            // 购物类
            { id: 'taobao', name: '淘宝', category: 'shopping', icon: '淘', color: 'linear-gradient(135deg, #ff6a00 0%, #ee0a24 100%)' },
            { id: 'jd', name: '京东', category: 'shopping', icon: '京', color: 'linear-gradient(135deg, #e93323 0%, #d32f2f 100%)' },
            { id: 'pinduoduo', name: '拼多多', category: 'shopping', icon: '拼', color: 'linear-gradient(135deg, #e02020 0%, #c41e3a 100%)' },
            { id: 'tmall', name: '天猫', category: 'shopping', icon: '天', color: 'linear-gradient(135deg, #ff6a00 0%, #ee0a24 100%)' },
            
            // 社交类
            { id: 'wechat', name: '微信', category: 'social', icon: '微', color: 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)' },
            { id: 'qq', name: 'QQ', category: 'social', icon: 'Q', color: 'linear-gradient(135deg, #12b7f5 0%, #0e9fe5 100%)' },
            { id: 'weibo', name: '微博', category: 'social', icon: '微', color: 'linear-gradient(135deg, #e6162d 0%, #c41e3a 100%)' },
            { id: 'xiaohongshu', name: '小红书', category: 'social', icon: '小', color: 'linear-gradient(135deg, #ff2442 0%, #ff1744 100%)' },
            
            // 视频类
            { id: 'douyin', name: '抖音', category: 'video', icon: '抖', color: 'linear-gradient(135deg, #000000 0%, #333333 100%)' },
            { id: 'bilibili', name: '哔哩哔哩', category: 'video', icon: 'B', color: 'linear-gradient(135deg, #fb7299 0%, #ff85a1 100%)' },
            { id: 'youku', name: '优酷', category: 'video', icon: '优', color: 'linear-gradient(135deg, #00a0e9 0%, #0080c7 100%)' },
            { id: 'iqiyi', name: '爱奇艺', category: 'video', icon: '爱', color: 'linear-gradient(135deg, #00be07 0%, #00a006 100%)' },
            
            // 生活类
            { id: 'meituan', name: '美团', category: 'life', icon: '美', color: 'linear-gradient(135deg, #ffc300 0%, #ffb000 100%)' },
            { id: 'eleme', name: '饿了么', category: 'life', icon: '饿', color: 'linear-gradient(135deg, #0078ff 0%, #0056cc 100%)' },
            { id: 'didi', name: '滴滴出行', category: 'life', icon: '滴', color: 'linear-gradient(135deg, #ff6600 0%, #ff4400 100%)' },
            { id: 'alipay', name: '支付宝', category: 'life', icon: '支', color: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)' },
            
            // 地图类
            { id: 'amap', name: '高德地图', category: 'map', icon: '高', color: 'linear-gradient(135deg, #00a6fb 0%, #0582ca 100%)' },
            { id: 'baidumap', name: '百度地图', category: 'map', icon: '百', color: 'linear-gradient(135deg, #3385ff 0%, #1c6cff 100%)' },
            
            // 音乐类
            { id: 'netease', name: '网易云音乐', category: 'music', icon: '网', color: 'linear-gradient(135deg, #e60012 0%, #cc0010 100%)' },
            { id: 'qqmusic', name: 'QQ音乐', category: 'music', icon: 'Q', color: 'linear-gradient(135deg, #12b7f5 0%, #0e9fe5 100%)' },
            
            // 工具类
            { id: 'zhihu', name: '知乎', category: 'tools', icon: '知', color: 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)' },
            { id: 'baidu', name: '百度', category: 'tools', icon: '百', color: 'linear-gradient(135deg, #3385ff 0%, #1c6cff 100%)' }
        ];
    }

    setupCategoryNavigation() {
        const categoryItems = document.querySelectorAll('.app-categories-sidebar .category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchCategory(item);
            });
        });
    }

    switchCategory(activeItem) {
        // 移除所有活动状态
        document.querySelectorAll('.app-categories-sidebar .category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加活动状态
        activeItem.classList.add('active');
        
        // 获取分类
        this.currentCategory = activeItem.dataset.category;
        
        // 过滤和渲染应用
        this.filterApps();
        
        // 添加点击效果
        this.addClickEffect(activeItem);
    }

    setupSearch() {
        const searchInput = document.querySelector('.app-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('focus', () => {
                this.showSearchSuggestions();
            });
            
            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideSearchSuggestions(), 200);
            });
        }
    }

    handleSearch(query) {
        const trimmedQuery = query.trim();
        
        // 搜索框不是用来过滤应用的，而是用户输入搜索关键词
        // 当用户输入内容时，显示搜索提示
        if (trimmedQuery) {
            this.showSearchPreview(trimmedQuery);
        } else {
            this.hideSearchPreview();
        }
        
        // 保存搜索关键词到输入框
        this.currentSearchQuery = trimmedQuery;
    }

    filterApps() {
        if (this.currentCategory === 'all') {
            this.filteredApps = [...this.apps];
        } else {
            this.filteredApps = this.apps.filter(app => app.category === this.currentCategory);
        }
    }

    renderApps() {
        const appsGrid = document.querySelector('.apps-grid');
        if (!appsGrid) return;
        
        if (this.filteredApps.length === 0) {
            appsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📱</div>
                    <div class="empty-state-text">没有找到应用</div>
                    <div class="empty-state-subtext">尝试搜索其他关键词</div>
                </div>
            `;
            return;
        }
        
        appsGrid.innerHTML = this.filteredApps.map(app => `
            <div class="app-item" data-app="${app.id}" data-category="${app.category}">
                <div class="app-icon" style="background: ${app.color};">${app.icon}</div>
                <div class="app-name">${app.name}</div>
            </div>
        `).join('');
        
        // 重新设置应用交互
        this.setupAppInteractions();
    }

    setupAppInteractions() {
        const appItems = document.querySelectorAll('.app-item');
        appItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.launchAppWithSearch(item);
            });
        });
    }

    launchAppWithSearch(appItem) {
        const appId = appItem.dataset.app;
        const appName = appItem.querySelector('.app-name').textContent;
        const searchQuery = this.currentSearchQuery || '';
        
        // 添加点击效果
        this.addClickEffect(appItem);
        
        // 显示启动提示
        if (searchQuery) {
            this.showToast(`正在用 ${appName} 搜索: ${searchQuery}`);
        } else {
            this.showToast(`正在打开 ${appName}`);
        }
        
        // 模拟应用启动和搜索
        setTimeout(() => {
            if (searchQuery) {
                console.log(`在 ${appName} 中搜索: ${searchQuery}`);
                // 这里可以添加实际的搜索逻辑
                this.performSearch(appId, searchQuery);
            } else {
                console.log(`启动应用: ${appId}`);
                // 这里可以添加实际的应用启动逻辑
            }
        }, 300);
    }

    performSearch(appId, query) {
        // 根据不同应用执行不同的搜索逻辑
        const searchUrls = {
            'taobao': `https://s.taobao.com/search?q=${encodeURIComponent(query)}`,
            'jd': `https://search.jd.com/Search?keyword=${encodeURIComponent(query)}`,
            'baidu': `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
            'zhihu': `https://www.zhihu.com/search?q=${encodeURIComponent(query)}`,
            'weibo': `https://s.weibo.com/weibo?q=${encodeURIComponent(query)}`,
            'bilibili': `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`,
            'douyin': `https://www.douyin.com/search/${encodeURIComponent(query)}`,
            'xiaohongshu': `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(query)}`
        };
        
        const searchUrl = searchUrls[appId];
        if (searchUrl) {
            // 在新标签页中打开搜索结果
            window.open(searchUrl, '_blank');
        }
        
        // 保存到搜索历史
        this.addToSearchHistory(query, appId);
    }

    addToSearchHistory(query, appId) {
        try {
            let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const historyItem = {
                query: query,
                appId: appId,
                timestamp: Date.now()
            };
            
            // 避免重复，移除相同的搜索记录
            history = history.filter(item => !(item.query === query && item.appId === appId));
            
            // 添加到开头
            history.unshift(historyItem);
            
            // 只保留最近20条记录
            history = history.slice(0, 20);
            
            localStorage.setItem('searchHistory', JSON.stringify(history));
            
            // 更新搜索建议
            this.updateSearchSuggestions();
        } catch (e) {
            console.warn('无法保存搜索历史:', e);
        }
    }

    showSearchPreview(query) {
        // 显示搜索预览，提示用户点击应用进行搜索
        const appsGrid = document.querySelector('.apps-grid');
        if (appsGrid) {
            // 在应用网格上方显示搜索提示
            let searchPreview = document.querySelector('.search-preview');
            if (!searchPreview) {
                searchPreview = document.createElement('div');
                searchPreview.className = 'search-preview';
                searchPreview.style.cssText = `
                    background: #e3f2fd;
                    padding: 12px 16px;
                    margin-bottom: 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #1976d2;
                    text-align: center;
                `;
                appsGrid.parentNode.insertBefore(searchPreview, appsGrid);
            }
            
            searchPreview.innerHTML = `
                <div>🔍 搜索关键词: <strong>${query}</strong></div>
                <div style="font-size: 12px; margin-top: 4px; opacity: 0.8;">点击下方应用图标进行搜索</div>
            `;
            searchPreview.style.display = 'block';
        }
    }

    hideSearchPreview() {
        const searchPreview = document.querySelector('.search-preview');
        if (searchPreview) {
            searchPreview.style.display = 'none';
        }
    }

    updateSearchSuggestions() {
        // 更新搜索建议列表
        try {
            const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const recentKeywords = [...new Set(history.map(item => item.query))].slice(0, 8);
            
            const keywordsList = document.getElementById('recentKeywordsList');
            if (keywordsList && recentKeywords.length > 0) {
                keywordsList.innerHTML = recentKeywords.map(keyword => 
                    `<div class="keyword-item" data-keyword="${keyword}">${keyword}</div>`
                ).join('');
                
                // 添加关键词点击事件
                keywordsList.querySelectorAll('.keyword-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const keyword = item.dataset.keyword;
                        const searchInput = document.querySelector('.app-search-input');
                        if (searchInput) {
                            searchInput.value = keyword;
                            this.handleSearch(keyword);
                        }
                    });
                });
            }
        } catch (e) {
            console.warn('无法更新搜索建议:', e);
        }
    }

    showSearchSuggestions() {
        const dropdown = document.querySelector('.recent-search-dropdown');
        if (dropdown) {
            dropdown.style.display = 'block';
        }
    }

    hideSearchSuggestions() {
        const dropdown = document.querySelector('.recent-search-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
    }

    showToast(message) {
        let toast = document.querySelector('.apps-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'apps-toast';
            toast.style.cssText = `
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                max-width: 300px;
                text-align: center;
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }

    // 优化应用页面布局
    optimizeLayout() {
        const appsPage = document.getElementById('apps-page');
        if (!appsPage) return;
        
        // 确保页面结构正确
        if (!appsPage.querySelector('.page-content')) {
            this.createMaterialLayout();
        }
    }

    createMaterialLayout() {
        const appsPage = document.getElementById('apps-page');
        if (!appsPage) return;
        
        // 清空现有内容（保留头部和搜索栏）
        const header = appsPage.querySelector('.apps-header');
        const searchBar = appsPage.querySelector('.top-search-bar');
        
        appsPage.innerHTML = '';
        
        // 重新添加头部和搜索栏
        if (header) appsPage.appendChild(header);
        if (searchBar) appsPage.appendChild(searchBar);
        
        // 创建Material Design布局
        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';
        pageContent.innerHTML = `
            <!-- 左侧分类导航 -->
            <div class="app-categories-sidebar">
                <div class="category-item active" data-category="all">
                    <div class="category-icon">📱</div>
                    <div class="category-name">全部</div>
                </div>
                <div class="category-item" data-category="shopping">
                    <div class="category-icon">🛍️</div>
                    <div class="category-name">购物</div>
                </div>
                <div class="category-item" data-category="social">
                    <div class="category-icon">👥</div>
                    <div class="category-name">社交</div>
                </div>
                <div class="category-item" data-category="video">
                    <div class="category-icon">📺</div>
                    <div class="category-name">视频</div>
                </div>
                <div class="category-item" data-category="music">
                    <div class="category-icon">🎵</div>
                    <div class="category-name">音乐</div>
                </div>
                <div class="category-item" data-category="life">
                    <div class="category-icon">🏠</div>
                    <div class="category-name">生活</div>
                </div>
                <div class="category-item" data-category="map">
                    <div class="category-icon">🗺️</div>
                    <div class="category-name">地图</div>
                </div>
                <div class="category-item" data-category="tools">
                    <div class="category-icon">🔧</div>
                    <div class="category-name">工具</div>
                </div>
            </div>

            <!-- 右侧应用网格 -->
            <div class="apps-grid-container">
                <div class="apps-grid" id="appsGrid">
                    <!-- 应用将通过JavaScript动态生成 -->
                </div>
            </div>
        `;
        
        appsPage.appendChild(pageContent);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保在应用页面激活时初始化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const appsPage = document.getElementById('apps-page');
                if (appsPage && appsPage.classList.contains('active')) {
                    if (!window.materialAppsPage) {
                        window.materialAppsPage = new MaterialAppsPage();
                    }
                }
            }
        });
    });
    
    const appsPage = document.getElementById('apps-page');
    if (appsPage) {
        observer.observe(appsPage, { attributes: true });
        
        // 如果应用页面已经是激活状态，立即初始化
        if (appsPage.classList.contains('active')) {
            window.materialAppsPage = new MaterialAppsPage();
        }
    }
});

// 导出供外部使用
window.MaterialAppsPage = MaterialAppsPage;