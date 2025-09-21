// 移动端应用搜索功能
class MobileAppSearch {
    constructor() {
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.selectedApp = null;
        this.appsContainer = document.getElementById('apps-grid');
        this.categoryItems = document.querySelectorAll('.category-item');
        this.searchInput = document.querySelector('.app-search-input');
        
        if (!this.appsContainer) {
            console.error('未找到应用容器 #apps-grid');
            return;
        }
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCategories();
        this.renderApps();
        this.initDragAndDrop();
        this.initCategoryContextMenu();
    }

    bindEvents() {
        // 分类点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-item') && e.target.dataset.category) {
                // 移除所有active类
                document.querySelectorAll('.category-item').forEach(item => {
                    item.classList.remove('active');
                });
                // 添加active类到当前点击的分类
                e.target.classList.add('active');
                
                this.handleCategoryClick(e.target);
            }
        });

        // 应用点击事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.app-item')) {
                this.handleAppClick(e.target.closest('.app-item'));
            }
        });

        // 应用长按事件（显示更多选项）
        let longPressTimer;
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.app-item')) {
                longPressTimer = setTimeout(() => {
                    this.handleAppLongPress(e.target.closest('.app-item'));
                }, 800);
            }
        });

        document.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        });

        document.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        });

        // 搜索输入事件
        const searchInput = document.querySelector('.app-search-input');
        const clearBtn = document.querySelector('#app-search-clear-btn');
        
        if (searchInput) {
            this.searchInput = searchInput;
            
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.renderApps();
                this.toggleClearButton();
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.selectedApp && this.searchQuery) {
                    this.performSearch();
                }
            });
        }
        
        // 清空按钮事件
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }
    }

    handleCategoryClick(categoryElement) {
        // 移除所有active类
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加active类到当前点击的分类
        categoryElement.classList.add('active');
        
        // 获取分类
        const categoryText = categoryElement.textContent.trim();
        this.currentCategory = this.getCategoryKey(categoryText);
        
        // 重新渲染应用
        this.renderApps();
    }

    getCategoryKey(categoryText) {
        const categoryMap = {
            '📱 全部': 'all',
            '🛍️ 购物': 'shopping',
            '👥 社交': 'social',
            '📺 视频': 'video',
            '🎵 音乐': 'music',
            '🏠 生活': 'life',
            '🗺️ 地图': 'map',
            '🌐 浏览器': 'browser',
            '💰 金融': 'finance',
            '🚗 出行': 'transport',
            '💼 招聘': 'job',
            '📚 教育': 'education',
            '📰 新闻': 'news'
        };
        return categoryMap[categoryText] || 'all';
    }

    handleAppClick(appElement) {
        const appKey = appElement.dataset.appKey;
        const app = IconConfig.getApp(appKey);
        
        if (!app) return;

        // 如果有搜索内容，跳转到应用的搜索结果页面
        if (this.searchQuery.trim()) {
            this.openAppSearchPage(app, this.searchQuery);
        } else {
            // 没有搜索内容，直接打开应用
            this.openApp(app);
        }
    }

    handleAppLongPress(appElement) {
        const appKey = appElement.dataset.appKey;
        const app = IconConfig.getApp(appKey);
        
        if (!app) return;

        // 显示应用选项菜单
        this.showAppOptions(app, appElement);
    }

    openApp(app) {
        // 尝试打开应用
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = app.url;
        document.body.appendChild(iframe);

        this.showToast(`正在打开${app.name}`);

        // 2秒后移除iframe
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 2000);

        // 如果应用未安装，3秒后提供网页版链接
        setTimeout(() => {
            this.showFallbackOption(app.name, app.webUrl);
        }, 3000);
    }

    showAppOptions(app, appElement) {
        // 创建选项菜单
        const optionsMenu = document.createElement('div');
        optionsMenu.className = 'app-options-menu';
        optionsMenu.innerHTML = `
            <div class="options-content">
                <div class="options-header">
                    <div class="app-icon-small" style="background: ${app.gradient};">${app.text}</div>
                    <span class="app-name-small">${app.name}</span>
                </div>
                <div class="options-buttons">
                    <button class="option-btn" onclick="window.mobileAppSearch.openApp(IconConfig.getApp('${app.key}'))">
                        📱 打开应用
                    </button>
                    <button class="option-btn" onclick="window.open('${app.webUrl}', '_blank')">
                        🌐 网页版
                    </button>
                    <button class="option-btn" onclick="window.mobileAppSearch.selectForSearch('${app.key}')">
                        🔍 选择搜索
                    </button>
                </div>
            </div>
            <div class="options-overlay" onclick="this.parentElement.remove()"></div>
        `;
        
        document.body.appendChild(optionsMenu);
        
        setTimeout(() => {
            optionsMenu.classList.add('show');
        }, 100);
    }

    selectForSearch(appKey) {
        // 移除选项菜单
        const menu = document.querySelector('.app-options-menu');
        if (menu) menu.remove();

        // 选中应用用于搜索
        const appElement = document.querySelector(`[data-app-key="${appKey}"]`);
        if (appElement) {
            document.querySelectorAll('.app-item').forEach(item => {
                item.classList.remove('selected');
            });
            appElement.classList.add('selected');
            this.selectedApp = appKey;
            
            // 聚焦搜索框
            const searchInput = document.querySelector('.app-search-input');
            if (searchInput) {
                searchInput.focus();
            }
            
            this.showToast('已选择应用，请输入搜索内容');
        }
    }

    performSearch() {
        if (!this.selectedApp || !this.searchQuery) {
            this.showToast('请选择应用并输入搜索内容');
            return;
        }

        const app = IconConfig.getApp(this.selectedApp);
        if (!app) {
            this.showToast('应用配置错误');
            return;
        }

        // 构建搜索URL
        const searchUrl = app.appSearchUrl + encodeURIComponent(this.searchQuery);
        
        // 尝试打开应用内搜索
        this.openAppSearch(searchUrl, app);
    }

    openAppSearchPage(app, query) {
        // 优先使用URL scheme跳转到应用内搜索
        if (app.appSearchUrl) {
            const appSearchUrl = app.appSearchUrl + encodeURIComponent(query);
            this.showToast(`正在${app.name}中搜索：${query}`);
            
            // 尝试打开URL scheme
            window.location.href = appSearchUrl;
            
            // 如果应用未安装，3秒后提供网页版链接
            setTimeout(() => {
                if (app.searchUrl) {
                    const webSearchUrl = app.searchUrl + encodeURIComponent(query);
                    this.showFallbackOption(app.name, webSearchUrl);
                }
            }, 3000);
        } else if (app.searchUrl) {
            // 如果没有URL scheme，使用网页版搜索
            const webSearchUrl = app.searchUrl + encodeURIComponent(query);
            this.showToast(`正在${app.name}中搜索：${query}`);
            window.open(webSearchUrl, '_blank');
        }
        
        // 清空搜索框
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.toggleClearButton();
        }
    }

    openAppSearch(searchUrl, app) {
        // 创建隐藏的iframe来尝试打开URL scheme
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = searchUrl;
        document.body.appendChild(iframe);

        // 显示操作提示
        this.showToast(`正在打开${app.name}搜索: ${this.searchQuery}`);

        // 2秒后移除iframe
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 2000);

        // 如果应用未安装，3秒后提供网页版链接
        setTimeout(() => {
            const webSearchUrl = app.searchUrl + encodeURIComponent(this.searchQuery);
            this.showFallbackOption(app.name, webSearchUrl);
        }, 3000);
    }

    showFallbackOption(appName, webUrl) {
        const toast = document.createElement('div');
        toast.className = 'app-search-toast fallback';
        toast.innerHTML = `
            <div class="toast-content">
                <p>未检测到${appName}应用</p>
                <button onclick="window.open('${webUrl}', '_blank')" class="fallback-btn">
                    使用网页版搜索
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'app-search-toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }

    toggleClearButton() {
        const clearBtn = document.querySelector('#app-search-clear-btn');
        if (clearBtn) {
            if (this.searchQuery && this.searchQuery.trim().length > 0) {
                clearBtn.classList.add('show');
            } else {
                clearBtn.classList.remove('show');
            }
        }
    }

    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.renderApps();
            this.toggleClearButton();
            this.searchInput.focus();
        }
    }

    renderCategories() {
        // 分类已经在HTML中定义，这里可以添加动态更新逻辑
    }

    renderApps() {
        const appsGrid = document.getElementById('apps-grid');
        if (!appsGrid) return;

        let apps = [];
        
        if (this.currentCategory === 'all') {
            // 显示所有应用，按分类分组
            const allApps = Object.keys(IconConfig.apps).map(key => ({
                key,
                ...IconConfig.apps[key]
            }));
            
            // 按分类分组
            const appsByCategory = {};
            allApps.forEach(app => {
                const category = app.category || 'other';
                if (!appsByCategory[category]) {
                    appsByCategory[category] = [];
                }
                appsByCategory[category].push(app);
            });
            
            // 按分类顺序排列
            const categoryOrder = ['shopping', 'social', 'music', 'video', 'life', 'map', 'browser', 'finance', 'transport', 'job', 'education', 'news'];
            apps = [];
            categoryOrder.forEach(category => {
                if (appsByCategory[category]) {
                    apps.push(...appsByCategory[category]);
                }
            });
            
            // 添加其他未分类的应用
            Object.keys(appsByCategory).forEach(category => {
                if (!categoryOrder.includes(category)) {
                    apps.push(...appsByCategory[category]);
                }
            });
        } else if (this.currentCategory === 'custom') {
            // 自定义分类显示被拖拽到此分类的应用
            apps = Object.keys(IconConfig.apps).map(key => ({
                key,
                ...IconConfig.apps[key]
            })).filter(app => app.category === 'custom');
        } else {
            // 显示特定分类的应用
            apps = IconConfig.getAppsByCategory(this.currentCategory);
        }

        // 如果有搜索查询，过滤应用
        if (this.searchQuery) {
            apps = apps.filter(app => 
                app.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // 生成HTML
        appsGrid.innerHTML = apps.map(app => this.generateAppHTML(app)).join('');
        
        // 重新绑定拖拽功能
        this.updateAppDraggable();
    }

    generateAppHTML(app) {
        // 获取应用名称的首字母
        const firstLetter = app.name.charAt(0).toUpperCase();
        
        return `
            <div class="app-item" data-app-key="${app.key}" data-app-name="${app.name}" title="${app.name}" 
                 onclick="handleAppClick('${app.name}')"
                 ontouchstart="handleAppTouchStart(event, '${app.name}')"
                 ontouchend="handleAppTouchEnd(event)"
                 ontouchmove="handleAppTouchMove(event)">
                <div class="app-icon" style="background: ${app.gradient};">
                    <div class="app-letter">${firstLetter}</div>
                </div>
                <div class="app-name">${app.name}</div>
            </div>
        `;
    }

    extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return '';
        }
    }

    // 全局图标错误处理函数
    handleIconError(img, iconSources) {
        const sources = JSON.parse(iconSources.replace(/&quot;/g, '"'));
        const currentSrc = img.src;
        const currentIndex = sources.indexOf(currentSrc);
        
        if (currentIndex < sources.length - 1) {
            // 尝试下一个图标源
            img.src = sources[currentIndex + 1];
        } else {
            // 所有图标源都失败，显示备用图标
            img.style.display = 'none';
            img.nextElementSibling.style.display = 'flex';
        }
    }

    getAppByName(appName) {
        // 从所有应用中查找指定名称的应用
        const apps = IconConfig.apps;
        if (!apps) {
            console.error('IconConfig.apps 未定义');
            return null;
        }
        
        for (const key in apps) {
            const app = apps[key];
            if (app && app.name === appName) {
                return {
                    key: key,
                    ...app
                };
            }
        }
        return null;
    }

    initDragAndDrop() {
        this.initCategoryDrag();
        this.initAppDrag();
    }

    initCategoryDrag() {
        const categoryList = document.getElementById('category-list');
        if (!categoryList) return;

        let draggedCategory = null;

        categoryList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('category-item')) {
                draggedCategory = e.target;
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        categoryList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('category-item')) {
                e.target.style.opacity = '';
                draggedCategory = null;
            }
        });

        categoryList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        categoryList.addEventListener('drop', (e) => {
            e.preventDefault();
            const target = e.target.closest('.category-item');
            if (target && draggedCategory && target !== draggedCategory) {
                const rect = target.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    categoryList.insertBefore(draggedCategory, target);
                } else {
                    categoryList.insertBefore(draggedCategory, target.nextSibling);
                }
            }
        });

        // 为分类项添加draggable属性
        document.querySelectorAll('.category-item').forEach(item => {
            item.draggable = true;
        });
    }

    initAppDrag() {
        const appsContainer = document.querySelector('.apps-content');
        if (!appsContainer) return;

        let draggedApp = null;

        appsContainer.addEventListener('dragstart', (e) => {
            if (e.target.closest('.app-item')) {
                draggedApp = e.target.closest('.app-item');
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', draggedApp.dataset.appKey);
            }
        });

        appsContainer.addEventListener('dragend', (e) => {
            if (e.target.closest('.app-item')) {
                e.target.style.opacity = '';
                draggedApp = null;
            }
        });

        // 为分类项添加拖拽目标功能
        const categoryList = document.getElementById('category-list');
        if (categoryList) {
            categoryList.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const target = e.target.closest('.category-item');
                if (target) {
                    target.style.backgroundColor = '#e3f2fd';
                }
            });

            categoryList.addEventListener('dragleave', (e) => {
                const target = e.target.closest('.category-item');
                if (target) {
                    target.style.backgroundColor = '';
                }
            });

            categoryList.addEventListener('drop', (e) => {
                e.preventDefault();
                const target = e.target.closest('.category-item');
                if (target) {
                    target.style.backgroundColor = '';
                    const appKey = e.dataTransfer.getData('text/plain');
                    const categoryText = target.textContent.trim();
                    const categoryKey = this.getCategoryKey(categoryText);
                    
                    if (appKey && categoryKey) {
                        this.moveAppToCategory(appKey, categoryKey);
                    }
                }
            });
        }

        // 为应用项添加draggable属性
        this.updateAppDraggable();
    }

    updateAppDraggable() {
        document.querySelectorAll('.app-item').forEach(item => {
            item.draggable = true;
        });
    }

    moveAppToCategory(appKey, categoryKey) {
        const app = IconConfig.apps[appKey];
        if (app) {
            // 更新应用的分类
            app.category = categoryKey;
            
            // 重新渲染应用列表
            this.renderApps();
            this.updateAppDraggable();
            
            // 显示提示
            this.showToast(`${app.name} 已移动到 ${this.getCategoryName(categoryKey)}`);
        }
    }

    getCategoryName(categoryKey) {
        const categoryMap = {
            'custom': '自定义',
            'all': '全部',
            'shopping': '购物',
            'social': '社交',
            'video': '视频',
            'music': '音乐',
            'life': '生活',
            'map': '地图',
            'browser': '浏览器',
            'finance': '金融',
            'transport': '出行',
            'job': '招聘',
            'education': '教育',
            'news': '新闻'
        };
        return categoryMap[categoryKey] || '未知';
    }

    // 初始化分类长按菜单
    initCategoryContextMenu() {
        let longPressTimer = null;
        let currentCategoryElement = null;
        const contextMenu = document.getElementById('categoryContextMenu');

        // 为分类项添加长按事件
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('category-item') && e.target.dataset.category) {
                currentCategoryElement = e.target;
                longPressTimer = setTimeout(() => {
                    this.showCategoryContextMenu(e, currentCategoryElement);
                }, 500); // 500ms长按
            }
        });

        document.addEventListener('touchend', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        });

        // 菜单项点击事件
        contextMenu.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.context-menu-item');
            if (menuItem && currentCategoryElement) {
                const action = menuItem.dataset.action;
                this.handleCategoryContextAction(action, currentCategoryElement);
                this.hideCategoryContextMenu();
            }
        });

        // 点击其他地方隐藏菜单
        document.addEventListener('click', (e) => {
            if (!contextMenu.contains(e.target)) {
                this.hideCategoryContextMenu();
            }
        });
    }

    // 显示分类长按菜单
    showCategoryContextMenu(event, categoryElement) {
        const contextMenu = document.getElementById('categoryContextMenu');
        const touch = event.touches[0];
        
        // 设置菜单位置
        contextMenu.style.left = touch.clientX + 'px';
        contextMenu.style.top = touch.clientY + 'px';
        contextMenu.style.display = 'block';

        // 确保菜单不超出屏幕
        const rect = contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            contextMenu.style.left = (window.innerWidth - rect.width - 10) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            contextMenu.style.top = (window.innerHeight - rect.height - 10) + 'px';
        }
    }

    // 隐藏分类长按菜单
    hideCategoryContextMenu() {
        const contextMenu = document.getElementById('categoryContextMenu');
        contextMenu.style.display = 'none';
    }

    // 处理分类长按菜单动作
    handleCategoryContextAction(action, categoryElement) {
        const categoryKey = categoryElement.dataset.category;
        const categoryName = this.getCategoryName(categoryKey);

        switch (action) {
            case 'set-default':
                this.setCategoryAsDefault(categoryKey, categoryName);
                break;
            case 'move-to-category':
                this.showMoveToCategory(categoryKey, categoryName);
                break;
            case 'direct-search':
                this.directSearchInCategory(categoryKey, categoryName);
                break;
        }
    }

    // 设置为默认分类
    setCategoryAsDefault(categoryKey, categoryName) {
        // 保存到本地存储
        localStorage.setItem('defaultCategory', categoryKey);
        
        // 更新UI，为默认分类添加标记
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('default-category');
        });
        
        const categoryElement = document.querySelector(`[data-category="${categoryKey}"]`);
        if (categoryElement) {
            categoryElement.classList.add('default-category');
        }
        
        this.showToast(`已设置 ${categoryName} 为默认分类`);
    }

    // 显示移动到分类选项
    showMoveToCategory(categoryKey, categoryName) {
        this.showToast(`移动到 ${categoryName} 功能开发中`);
    }

    // 直接在分类中搜索
    directSearchInCategory(categoryKey, categoryName) {
        // 切换到该分类
        this.currentCategory = categoryKey;
        
        // 更新分类选中状态
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const categoryElement = document.querySelector(`[data-category="${categoryKey}"]`);
        if (categoryElement) {
            categoryElement.classList.add('active');
        }
        
        // 重新渲染应用
        this.renderApps();
        
        // 聚焦搜索框
        const searchInput = document.querySelector('.app-search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.placeholder = `在 ${categoryName} 中搜索...`;
        }
        
        this.showToast(`已切换到 ${categoryName} 分类`);
    }
}

// 搜索功能相关变量
let selectedApp = null;
let searchInput = null;

// 初始化搜索功能
function initializeSearch() {
    searchInput = document.querySelector('.app-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', handleSearchKeyPress);
        searchInput.addEventListener('input', handleSearchInput);
    }
}

// 处理搜索输入
function handleSearchInput(event) {
    const query = event.target.value.trim();
    if (query) {
        // 如果有输入内容，高亮显示搜索按钮或提示
        updateSearchUI(true);
    } else {
        updateSearchUI(false);
        selectedApp = null;
    }
}

// 处理回车键搜索
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query && selectedApp) {
            // 执行应用内搜索
            searchInApp(selectedApp, query);
        } else if (query) {
            // 如果没有选择应用，提示用户选择
            showSearchTip();
        }
    }
}

// 在应用内搜索
function searchInApp(app, query) {
    const searchUrls = {
        '微信': `weixin://dl/search?query=${encodeURIComponent(query)}`,
        '支付宝': `alipay://platformapi/startapp?appId=20000067&query=${encodeURIComponent(query)}`,
        '淘宝': `taobao://s.taobao.com?q=${encodeURIComponent(query)}`,
        '京东': `openapp.jdmobile://virtual?params={"category":"jump","des":"search","keyWord":"${encodeURIComponent(query)}"}`,
        '美团': `imeituan://www.meituan.com/search?q=${encodeURIComponent(query)}`,
        '饿了么': `eleme://search?keyword=${encodeURIComponent(query)}`,
        '抖音': `snssdk1128://search?keyword=${encodeURIComponent(query)}`,
        '快手': `kwai://search?keyword=${encodeURIComponent(query)}`,
        '小红书': `xhsdiscover://search/result?keyword=${encodeURIComponent(query)}`,
        '知乎': `zhihu://search?q=${encodeURIComponent(query)}`,
        '百度': `baiduboxapp://v1/easybrowse/search?word=${encodeURIComponent(query)}`,
        '高德地图': `iosamap://path?sourceApplication=applicationName&keyword=${encodeURIComponent(query)}`,
        '腾讯地图': `qqmap://map/search?keyword=${encodeURIComponent(query)}`,
        '网易云音乐': `orpheus://search?keyword=${encodeURIComponent(query)}`,
        'QQ音乐': `qqmusic://search?key=${encodeURIComponent(query)}`,
        '酷狗音乐': `kugou://search?keyword=${encodeURIComponent(query)}`,
        '爱奇艺': `qiyi-iphone://search?key=${encodeURIComponent(query)}`,
        '腾讯视频': `tenvideo2://search?keyword=${encodeURIComponent(query)}`,
        '优酷': `youku://search?keyword=${encodeURIComponent(query)}`,
        '哔哩哔哩': `bilibili://search?keyword=${encodeURIComponent(query)}`,
        '马蜂窝': `mafengwo://search?keyword=${encodeURIComponent(query)}`,
        '携程': `ctrip://search?keyword=${encodeURIComponent(query)}`,
        '去哪儿': `qunar://search?keyword=${encodeURIComponent(query)}`,
        '飞猪': `taobaotravel://search?keyword=${encodeURIComponent(query)}`
    };

    const searchUrl = searchUrls[app.name];
    if (searchUrl) {
        // 尝试打开应用内搜索
        window.location.href = searchUrl;
        
        // 清空搜索框和选择状态
        setTimeout(() => {
            if (searchInput) {
                searchInput.value = '';
            }
            selectedApp = null;
            updateSearchUI(false);
            clearAppSelection();
        }, 500);
    } else {
        // 如果没有对应的搜索URL，则打开应用
        openApp(app);
    }
}

// 选择应用进行搜索
function selectForSearch(app) {
    selectedApp = app;
    updateSearchUI(true);
    
    // 更新UI显示选中的应用
    clearAppSelection();
    const appElement = document.querySelector(`[data-app-name="${app.name}"]`);
    if (appElement) {
        appElement.classList.add('selected');
    }
    
    // 聚焦搜索框
    if (searchInput) {
        searchInput.focus();
        searchInput.placeholder = `在 ${app.name} 中搜索...`;
    }
}

// 清除应用选择状态
function clearAppSelection() {
    const selectedApps = document.querySelectorAll('.app-item.selected');
    selectedApps.forEach(app => app.classList.remove('selected'));
}

// 更新搜索UI状态
function updateSearchUI(hasContent) {
    if (searchInput) {
        if (hasContent && selectedApp) {
            searchInput.style.borderColor = '#007bff';
            searchInput.style.background = '#f8f9ff';
        } else if (hasContent) {
            searchInput.style.borderColor = '#ffc107';
            searchInput.style.background = '#fffbf0';
        } else {
            searchInput.style.borderColor = '#ddd';
            searchInput.style.background = '#fff';
            searchInput.placeholder = '输入搜索关键词';
        }
    }
}

// 显示搜索提示
function showSearchTip() {
    const tip = document.createElement('div');
    tip.className = 'search-tip';
    tip.textContent = '请先选择一个应用图标，然后输入搜索内容';
    tip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10001;
        animation: fadeInOut 2s ease-in-out;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            20%, 80% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(tip);
    
    setTimeout(() => {
        if (tip.parentNode) {
            tip.parentNode.removeChild(tip);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 2000);
}

// 触摸事件处理
let touchTimer = null;

function handleAppTouchStart(event, appName) {
    touchTimer = setTimeout(() => {
        handleAppLongPress(appName);
    }, 800);
}

function handleAppTouchEnd(event) {
    if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
}

function handleAppTouchMove(event) {
    if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
}

function handleAppClick(appName) {
    if (window.mobileAppSearch) {
        const app = window.mobileAppSearch.getAppByName(appName);
        if (app) {
            const searchInput = document.querySelector('.app-search-input');
            const query = searchInput ? searchInput.value.trim() : '';
            
            if (query && selectedApp && selectedApp.name === appName) {
                // 执行搜索
                searchInApp(app, query);
            } else if (query) {
                // 有搜索内容但没选择应用，选择这个应用
                selectForSearch(app);
            } else {
                // 没有搜索内容，直接打开应用
                openApp(app);
            }
        }
    }
}

function handleAppLongPress(appName) {
    if (window.mobileAppSearch) {
        const app = window.mobileAppSearch.getAppByName(appName);
        if (app) {
            showAppOptions(app);
        }
    }
}

function openApp(app) {
    if (app.scheme) {
        window.location.href = app.scheme;
    } else if (app.webUrl) {
        window.open(app.webUrl, '_blank');
    }
}

function showAppOptions(app) {
    const menu = document.createElement('div');
    menu.className = 'app-options-menu';
    menu.innerHTML = `
        <div class="options-overlay" onclick="closeAppOptions()"></div>
        <div class="options-content">
            <div class="options-header">
                <div class="app-icon-small" style="background: ${app.gradient};">
                    ${app.text}
                </div>
                <div class="app-name-small">${app.name}</div>
            </div>
            <div class="options-buttons">
                <button class="option-btn" onclick="openApp(${JSON.stringify(app)}); closeAppOptions();">
                    🚀 打开应用
                </button>
                <button class="option-btn" onclick="selectForSearch(${JSON.stringify(app)}); closeAppOptions();">
                    🔍 选择搜索
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(menu);
    setTimeout(() => menu.classList.add('show'), 10);
}

function closeAppOptions() {
    const menu = document.querySelector('.app-options-menu');
    if (menu) {
        menu.classList.remove('show');
        setTimeout(() => {
            if (menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
        }, 300);
    }
}

// 将图标错误处理函数添加到全局作用域
window.handleIconError = function(img, iconSources) {
    if (window.mobileAppSearch) {
        window.mobileAppSearch.handleIconError(img, iconSources);
    }
};

// 全局函数，供HTML调用
window.selectForSearch = selectForSearch;
window.handleAppClick = handleAppClick;
window.handleAppTouchStart = handleAppTouchStart;
window.handleAppTouchEnd = handleAppTouchEnd;
window.handleAppTouchMove = handleAppTouchMove;
window.openApp = openApp;
window.showAppOptions = showAppOptions;
window.closeAppOptions = closeAppOptions;

// 搜索图标管理类
class SearchIconManager {
    constructor() {
        this.selectedAppIcon = document.getElementById('selectedAppIcon');
        this.recentAppsDropdown = document.getElementById('recentAppsDropdown');
        this.recentAppsList = document.getElementById('recentAppsList');
        this.searchIconContainer = document.querySelector('.search-icon-container');
        this.searchInput = document.querySelector('.app-search-input');
        
        // 从localStorage获取近期选择的应用
        this.recentApps = JSON.parse(localStorage.getItem('recentSearchApps') || '[]');
        this.currentSelectedApp = 'xiaohongshu'; // 默认小红书
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateRecentAppsList();
    }
    
    bindEvents() {
        // 点击搜索图标容器显示/隐藏下拉列表
        this.searchIconContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        // 点击近期应用图标
        this.recentAppsList.addEventListener('click', (e) => {
            if (e.target.closest('.recent-app-item')) {
                const appKey = e.target.closest('.recent-app-item').dataset.app;
                this.selectApp(appKey);
                this.hideDropdown();
            }
        });
        
        // 点击其他地方隐藏下拉列表
        document.addEventListener('click', (e) => {
            if (!this.searchIconContainer.contains(e.target)) {
                this.hideDropdown();
            }
        });
        
        // 搜索功能
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }
    
    selectApp(appKey) {
        const app = IconConfig.apps[appKey];
        if (!app) return;
        
        this.currentSelectedApp = appKey;
        
        // 更新选中的图标显示
        this.updateSelectedIcon(app);
        
        // 添加到近期选择（如果不存在）
        this.addToRecentApps(appKey);
        
        // 更新近期应用列表
        this.updateRecentAppsList();
    }
    
    updateSelectedIcon(app) {
        const iconElement = this.selectedAppIcon.querySelector('.app-letter');
        iconElement.textContent = app.text;
        iconElement.style.background = app.gradient;
        iconElement.style.color = 'white';
        this.selectedAppIcon.dataset.app = this.currentSelectedApp;
    }
    
    addToRecentApps(appKey) {
        // 移除已存在的相同应用
        this.recentApps = this.recentApps.filter(key => key !== appKey);
        
        // 添加到开头
        this.recentApps.unshift(appKey);
        
        // 最多保留8个近期应用
        if (this.recentApps.length > 8) {
            this.recentApps = this.recentApps.slice(0, 8);
        }
        
        // 保存到localStorage
        localStorage.setItem('recentSearchApps', JSON.stringify(this.recentApps));
    }
    
    updateRecentAppsList() {
        this.recentAppsList.innerHTML = '';
        
        // 如果没有近期应用，显示提示信息
        if (this.recentApps.length === 0) {
            const emptyElement = document.createElement('div');
            emptyElement.className = 'recent-apps-empty';
            emptyElement.innerHTML = `
                <div class="empty-message">暂无历史选择</div>
                <div class="empty-tip">点击下方应用图标选择搜索引擎</div>
            `;
            this.recentAppsList.appendChild(emptyElement);
        } else {
            this.recentApps.forEach(appKey => {
                const app = IconConfig.apps[appKey];
                if (app) {
                    const appElement = document.createElement('div');
                    appElement.className = 'recent-app-item';
                    appElement.dataset.app = appKey;
                    appElement.innerHTML = `
                        <div class="app-icon">
                            <div class="app-letter" style="background: ${app.gradient}; color: white;">
                                ${app.text}
                            </div>
                        </div>
                        <div class="app-name">${app.name}</div>
                    `;
                    this.recentAppsList.appendChild(appElement);
                }
            });
        }
    }
    
    toggleDropdown() {
        const isVisible = this.recentAppsDropdown.style.display !== 'none';
        if (isVisible) {
            this.hideDropdown();
        } else {
            this.showDropdown();
        }
    }
    
    showDropdown() {
        this.recentAppsDropdown.style.display = 'block';
        this.updateRecentAppsList();
    }
    
    hideDropdown() {
        this.recentAppsDropdown.style.display = 'none';
    }
    
    performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;
        
        const app = IconConfig.apps[this.currentSelectedApp];
        if (!app) return;
        
        // 构建搜索URL
        let searchUrl;
        if (app.appSearchUrl) {
            // 使用应用内搜索URL
            searchUrl = app.appSearchUrl + encodeURIComponent(query);
        } else if (app.searchUrl) {
            // 使用网页搜索URL
            searchUrl = app.searchUrl + encodeURIComponent(query);
        } else {
            // 默认使用网页URL
            searchUrl = app.webUrl;
        }
        
        // 尝试打开应用
        this.openAppSearch(searchUrl, app, query);
    }
    
    openAppSearch(searchUrl, app, query) {
        // 尝试打开应用
        const appUrl = app.url;
        if (appUrl && appUrl !== '#') {
            // 创建隐藏的iframe尝试打开应用
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = searchUrl;
            document.body.appendChild(iframe);
            
            // 设置超时，如果应用没有打开，则显示备选方案
            setTimeout(() => {
                document.body.removeChild(iframe);
                this.showFallbackOption(app.name, app.searchUrl + encodeURIComponent(query));
            }, 2000);
            
            // 显示提示
            this.showToast(`正在打开${app.name}搜索"${query}"...`);
        } else {
            // 直接打开网页搜索
            window.open(searchUrl, '_blank');
        }
    }
    
    showFallbackOption(appName, webUrl) {
        const fallback = confirm(`无法打开${appName}应用，是否在浏览器中搜索？`);
        if (fallback && webUrl) {
            window.open(webUrl, '_blank');
        }
    }
    
    showToast(message) {
        // 创建toast提示
        const toast = document.createElement('div');
        toast.className = 'search-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 2000);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
}
`;
document.head.appendChild(style);

// 初始化应用搜索功能
document.addEventListener('DOMContentLoaded', () => {
    // 等待页面完全加载后再初始化
    setTimeout(() => {
        if (document.getElementById('apps-page') && document.getElementById('apps-grid')) {
            console.log('初始化应用搜索功能...');
            window.mobileAppSearch = new MobileAppSearch();
            initializeSearch();
        } else {
            console.log('应用搜索页面或容器未找到');
        }
        
        // 初始化搜索图标管理器
        if (document.querySelector('.search-icon-container')) {
            window.searchIconManager = new SearchIconManager();
        }
    }, 100);
});