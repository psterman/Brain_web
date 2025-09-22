// 移动端增强功能 JavaScript
// 包含主题切换、近期搜索、应用首字母筛选等功能

class MobileEnhancedFeatures {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.recentApps = JSON.parse(localStorage.getItem('recentApps') || '[]');
        this.recentKeywords = JSON.parse(localStorage.getItem('recentKeywords') || '[]');
        this.selectedApp = localStorage.getItem('selectedApp') || 'xiaohongshu';
        
        this.init();
    }
    
    init() {
        this.initThemeToggle();
        this.initRecentSearch();
        this.initAppSelection();
        this.initSearchInput();
        this.applyTheme();
        this.loadRecentData();
    }
    
    // 主题切换功能
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }
    
    applyTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (this.currentTheme === 'dark') {
            body.classList.add('dark-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            body.classList.remove('dark-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
        
        // 更新CSS变量
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
    
    // 近期搜索功能
    initRecentSearch() {
        const recentSearchBtn = document.getElementById('recentSearchBtn');
        const recentSearchDropdown = document.getElementById('recentSearchDropdown');
        const dropdownTabs = document.querySelectorAll('.dropdown-tab');
        
        if (recentSearchBtn && recentSearchDropdown) {
            // 点击按钮显示/隐藏下拉菜单
            recentSearchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleRecentDropdown();
            });
            
            // 点击其他地方关闭下拉菜单
            document.addEventListener('click', (e) => {
                if (!recentSearchDropdown.contains(e.target) && !recentSearchBtn.contains(e.target)) {
                    this.hideRecentDropdown();
                }
            });
            
            // 标签页切换
            dropdownTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    this.switchDropdownTab(tab.dataset.tab);
                });
            });
        }
    }
    
    toggleRecentDropdown() {
        const dropdown = document.getElementById('recentSearchDropdown');
        if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
        }
    }
    
    hideRecentDropdown() {
        const dropdown = document.getElementById('recentSearchDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
    
    switchDropdownTab(tabName) {
        // 切换标签页激活状态
        document.querySelectorAll('.dropdown-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 切换内容显示
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');
    }
    
    // 应用选择功能
    initAppSelection() {
        // 近期应用点击事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.recent-app-item') || e.target.closest('.letter-app-item')) {
                const appItem = e.target.closest('.recent-app-item') || e.target.closest('.letter-app-item');
                const appId = appItem.dataset.app;
                if (appId) {
                    this.selectApp(appId);
                }
            }
        });
        
        // 主应用网格点击事件 - 执行搜索而不是选择应用
        document.addEventListener('click', (e) => {
            if (e.target.closest('.app-item')) {
                const appItem = e.target.closest('.app-item');
                const appId = appItem.dataset.app;
                if (appId) {
                    const searchInput = document.getElementById('appSearchInput');
                    const keyword = searchInput ? searchInput.value.trim() : '';
                    
                    if (keyword) {
                        // 如果有搜索关键词，直接执行搜索
                        this.performAppSearch(appId, keyword);
                    } else {
                        // 如果没有关键词，提示用户输入
                        this.showToast('请先输入搜索关键词');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    }
                }
            }
        });
        
        // 关键词点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('keyword-item')) {
                const keyword = e.target.textContent;
                this.fillSearchInput(keyword);
            }
        });
    }
    
    selectApp(appId) {
        this.selectedApp = appId;
        localStorage.setItem('selectedApp', appId);
        
        // 更新选中的应用图标
        this.updateSelectedAppIcon(appId);
        
        // 添加到近期应用
        this.addToRecentApps(appId);
        
        // 隐藏下拉菜单
        this.hideRecentDropdown();
        
        // 如果搜索框有内容，执行搜索
        const searchInput = document.getElementById('appSearchInput');
        if (searchInput && searchInput.value.trim()) {
            this.performAppSearch(appId, searchInput.value.trim());
        }
    }
    
    updateSelectedAppIcon(appId) {
        const selectedAppIcon = document.getElementById('selectedAppIcon');
        if (selectedAppIcon) {
            const appConfig = this.getAppConfig(appId);
            selectedAppIcon.dataset.app = appId;
            
            const appLetter = selectedAppIcon.querySelector('.app-letter');
            if (appLetter && appConfig) {
                appLetter.textContent = appConfig.letter;
                appLetter.style.background = appConfig.gradient;
            }
        }
    }
    
    addToRecentApps(appId) {
        // 移除已存在的相同应用
        this.recentApps = this.recentApps.filter(app => app !== appId);
        
        // 添加到开头
        this.recentApps.unshift(appId);
        
        // 限制数量
        if (this.recentApps.length > 6) {
            this.recentApps = this.recentApps.slice(0, 6);
        }
        
        localStorage.setItem('recentApps', JSON.stringify(this.recentApps));
        this.updateRecentAppsList();
    }
    
    addToRecentKeywords(keyword) {
        // 移除已存在的相同关键词
        this.recentKeywords = this.recentKeywords.filter(kw => kw !== keyword);
        
        // 添加到开头
        this.recentKeywords.unshift(keyword);
        
        // 限制数量
        if (this.recentKeywords.length > 8) {
            this.recentKeywords = this.recentKeywords.slice(0, 8);
        }
        
        localStorage.setItem('recentKeywords', JSON.stringify(this.recentKeywords));
        this.updateRecentKeywordsList();
    }
    
    // 搜索输入框功能
    initSearchInput() {
        const searchInput = document.getElementById('appSearchInput');
        const clearBtn = document.getElementById('app-search-clear-btn');
        
        if (searchInput) {
            // 输入事件
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value;
                this.toggleClearButton(value.length > 0);
            });
            
            // 回车搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const keyword = e.target.value.trim();
                    if (keyword) {
                        this.performAppSearch(this.selectedApp, keyword);
                    }
                }
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearSearchInput();
            });
        }
    }
    
    toggleClearButton(show) {
        const clearBtn = document.getElementById('app-search-clear-btn');
        if (clearBtn) {
            clearBtn.classList.toggle('show', show);
        }
    }
    
    clearSearchInput() {
        const searchInput = document.getElementById('appSearchInput');
        if (searchInput) {
            searchInput.value = '';
            this.toggleClearButton(false);
            searchInput.focus();
        }
    }
    
    fillSearchInput(keyword) {
        const searchInput = document.getElementById('appSearchInput');
        if (searchInput) {
            searchInput.value = keyword;
            this.toggleClearButton(true);
            this.hideRecentDropdown();
        }
    }
    
    // 执行应用搜索
    performAppSearch(appId, keyword) {
        // 添加到近期关键词
        this.addToRecentKeywords(keyword);
        
        // 获取应用的URL Scheme
        const urlScheme = this.getAppUrlScheme(appId, keyword);
        
        if (urlScheme) {
            // 尝试打开应用
            window.location.href = urlScheme;
            
            // 显示提示
            this.showToast(`正在打开${this.getAppConfig(appId).name}搜索"${keyword}"`);
        } else {
            this.showToast('暂不支持该应用的搜索跳转');
        }
    }
    
    // 获取应用URL Scheme
    getAppUrlScheme(appId, keyword) {
        const schemes = {
            'xiaohongshu': `xhsdiscover://search/result?keyword=${encodeURIComponent(keyword)}`,
            'taobao': `taobao://s.taobao.com?q=${encodeURIComponent(keyword)}`,
            'tmall': `tmall://page.tm/search?q=${encodeURIComponent(keyword)}`,
            'jd': `openapp.jdmobile://virtual?params={"category":"jump","des":"search","keyWord":"${encodeURIComponent(keyword)}"}`,
            'pinduoduo': `pinduoduo://com.xunmeng.pinduoduo/search_result.html?search_key=${encodeURIComponent(keyword)}`,
            'zhihu': `zhihu://search?q=${encodeURIComponent(keyword)}`,
            'weibo': `sinaweibo://searchall?q=${encodeURIComponent(keyword)}`,
            'bilibili': `bilibili://search?keyword=${encodeURIComponent(keyword)}`,
            'douyin': `snssdk1128://search/result/?keyword=${encodeURIComponent(keyword)}`,
            'meituan': `imeituan://www.meituan.com/search?q=${encodeURIComponent(keyword)}`,
            'dianping': `dianping://search?keyword=${encodeURIComponent(keyword)}`,
            'alipay': `alipays://platformapi/startapp?saId=20000067&query=${encodeURIComponent(keyword)}`,
            'baidu': `baiduboxapp://search?word=${encodeURIComponent(keyword)}`,
            'xianyu': `fleamarket://search?q=${encodeURIComponent(keyword)}`
        };
        
        return schemes[appId];
    }
    
    // 获取应用配置
    getAppConfig(appId) {
        const configs = {
            'xiaohongshu': { name: '小红书', letter: '小', gradient: 'linear-gradient(135deg, #ff2442 0%, #ff1744 100%)' },
            'taobao': { name: '淘宝', letter: '淘', gradient: 'linear-gradient(135deg, #ff6a00 0%, #ee0a24 100%)' },
            'tmall': { name: '天猫', letter: '天', gradient: 'linear-gradient(135deg, #e02020 0%, #c41e3a 100%)' },
            'jd': { name: '京东', letter: '京', gradient: 'linear-gradient(135deg, #e93323 0%, #d32f2f 100%)' },
            'pinduoduo': { name: '拼多多', letter: '拼', gradient: 'linear-gradient(135deg, #e02020 0%, #c41e3a 100%)' },
            'zhihu': { name: '知乎', letter: '知', gradient: 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)' },
            'weibo': { name: '微博', letter: '微', gradient: 'linear-gradient(135deg, #e6162d 0%, #c41e3a 100%)' },
            'bilibili': { name: '哔哩哔哩', letter: 'B', gradient: 'linear-gradient(135deg, #fb7299 0%, #ff85a1 100%)' },
            'douyin': { name: '抖音', letter: '抖', gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)' },
            'meituan': { name: '美团', letter: '美', gradient: 'linear-gradient(135deg, #ffc300 0%, #ffb000 100%)' },
            'dianping': { name: '大众点评', letter: '大', gradient: 'linear-gradient(135deg, #ffc300 0%, #ffb000 100%)' },
            'alipay': { name: '支付宝', letter: '支', gradient: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)' },
            'baidu': { name: '百度', letter: '百', gradient: 'linear-gradient(135deg, #3385ff 0%, #1c6cff 100%)' },
            'xianyu': { name: '闲鱼', letter: '闲', gradient: 'linear-gradient(135deg, #ff6a00 0%, #ee0a24 100%)' }
        };
        
        return configs[appId];
    }
    
    // 加载近期数据
    loadRecentData() {
        this.updateRecentAppsList();
        this.updateRecentKeywordsList();
        this.updateSelectedAppIcon(this.selectedApp);
        this.generateAppsGrid();
    }
    
    // 生成应用网格
    generateAppsGrid() {
        const appsGrid = document.getElementById('apps-grid');
        if (!appsGrid) return;
        
        const apps = [
            { id: 'xiaohongshu', name: '小红书', letter: '小', gradient: 'linear-gradient(135deg, #ff2442 0%, #ff1744 100%)', category: 'social' },
            { id: 'taobao', name: '淘宝', letter: '淘', gradient: 'linear-gradient(135deg, #ff6a00 0%, #ee0a24 100%)', category: 'shopping' },
            { id: 'tmall', name: '天猫', letter: '天', gradient: 'linear-gradient(135deg, #e02020 0%, #c41e3a 100%)', category: 'shopping' },
            { id: 'jd', name: '京东', letter: '京', gradient: 'linear-gradient(135deg, #e93323 0%, #d32f2f 100%)', category: 'shopping' },
            { id: 'pinduoduo', name: '拼多多', letter: '拼', gradient: 'linear-gradient(135deg, #e02020 0%, #c41e3a 100%)', category: 'shopping' },
            { id: 'zhihu', name: '知乎', letter: '知', gradient: 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)', category: 'social' },
            { id: 'weibo', name: '微博', letter: '微', gradient: 'linear-gradient(135deg, #e6162d 0%, #c41e3a 100%)', category: 'social' },
            { id: 'bilibili', name: '哔哩哔哩', letter: 'B', gradient: 'linear-gradient(135deg, #fb7299 0%, #ff85a1 100%)', category: 'video' },
            { id: 'douyin', name: '抖音', letter: '抖', gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)', category: 'video' },
            { id: 'meituan', name: '美团', letter: '美', gradient: 'linear-gradient(135deg, #ffc300 0%, #ffb000 100%)', category: 'life' },
            { id: 'dianping', name: '大众点评', letter: '大', gradient: 'linear-gradient(135deg, #ffc300 0%, #ffb000 100%)', category: 'life' },
            { id: 'alipay', name: '支付宝', letter: '支', gradient: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)', category: 'life' },
            { id: 'baidu', name: '百度', letter: '百', gradient: 'linear-gradient(135deg, #3385ff 0%, #1c6cff 100%)', category: 'search' },
            { id: 'xianyu', name: '闲鱼', letter: '闲', gradient: 'linear-gradient(135deg, #ff6a00 0%, #ee0a24 100%)', category: 'shopping' }
        ];
        
        appsGrid.innerHTML = '';
        
        apps.forEach(app => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            appItem.dataset.app = app.id;
            appItem.dataset.category = app.category;
            
            appItem.innerHTML = `
                <div class="app-icon" style="background: ${app.gradient};">
                    <span class="app-letter">${app.letter}</span>
                </div>
                <div class="app-name">${app.name}</div>
                <div class="search-hint-overlay">
                    <span class="search-icon">🔍</span>
                    <span class="hint-text">点击搜索</span>
                </div>
            `;
            
            appsGrid.appendChild(appItem);
        });
        
        // 添加搜索提示
        this.addSearchHints();
    }
    
    // 添加搜索提示
    addSearchHints() {
        const searchInput = document.getElementById('appSearchInput');
        if (searchInput) {
            // 监听输入框状态变化
            const updateAppHints = () => {
                const hasKeyword = searchInput.value.trim().length > 0;
                const appItems = document.querySelectorAll('.app-item');
                
                appItems.forEach(item => {
                    const overlay = item.querySelector('.search-hint-overlay');
                    if (overlay) {
                        overlay.style.display = hasKeyword ? 'flex' : 'none';
                    }
                    
                    // 添加或移除搜索就绪状态
                    item.classList.toggle('search-ready', hasKeyword);
                });
            };
            
            searchInput.addEventListener('input', updateAppHints);
            searchInput.addEventListener('focus', updateAppHints);
            searchInput.addEventListener('blur', () => {
                setTimeout(updateAppHints, 100); // 延迟一点以避免闪烁
            });
            
            // 初始化状态
            updateAppHints();
        }
    }
    
    updateRecentAppsList() {
        const recentAppsList = document.getElementById('recentAppsList');
        if (recentAppsList) {
            recentAppsList.innerHTML = '';
            
            this.recentApps.forEach(appId => {
                const config = this.getAppConfig(appId);
                if (config) {
                    const appItem = document.createElement('div');
                    appItem.className = 'recent-app-item';
                    appItem.dataset.app = appId;
                    appItem.innerHTML = `
                        <div class="app-icon-small" style="background: ${config.gradient};">${config.letter}</div>
                        <span class="app-name">${config.name}</span>
                    `;
                    recentAppsList.appendChild(appItem);
                }
            });
        }
    }
    
    updateRecentKeywordsList() {
        const recentKeywordsList = document.getElementById('recentKeywordsList');
        if (recentKeywordsList) {
            recentKeywordsList.innerHTML = '';
            
            this.recentKeywords.forEach(keyword => {
                const keywordItem = document.createElement('div');
                keywordItem.className = 'keyword-item';
                keywordItem.textContent = keyword;
                recentKeywordsList.appendChild(keywordItem);
            });
        }
    }
    
    // 显示提示消息
    showToast(message) {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = 'mobile-toast';
        toast.textContent = message;
        
        // 添加样式
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            zIndex: '10000',
            opacity: '0',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new MobileEnhancedFeatures();
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileEnhancedFeatures;
}