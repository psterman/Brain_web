// 应用页面交互修复
class AppsInteractionFix {
    constructor() {
        this.isDropdownVisible = false;
        this.init();
    }

    init() {
        this.fixRecentSearchButton();
        this.fixDropdownInteraction();
        this.fixAppClickResponse();
        this.preventDropdownFlicker();
        this.loadSelectedApp(); // 加载保存的默认应用
        this.bindSearchInput(); // 绑定输入框按回车搜索
    }

    // 修复近期搜索按钮
    fixRecentSearchButton() {
        // 等待DOM完全加载
        setTimeout(() => {
            const recentSearchBtn = document.getElementById('recentSearchBtn');
            const dropdown = document.getElementById('recentSearchDropdown');

            if (recentSearchBtn && dropdown) {
                // 初始化下拉菜单状态
                dropdown.style.display = 'none';
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';
                dropdown.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                this.isDropdownVisible = false;

                // 移除所有现有事件监听器
                const newBtn = recentSearchBtn.cloneNode(true);
                recentSearchBtn.parentNode.replaceChild(newBtn, recentSearchBtn);

                // 添加新的事件监听器
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('近期搜索按钮被点击，当前状态:', this.isDropdownVisible);

                    if (this.isDropdownVisible) {
                        // 隐藏下拉菜单
                        this.hideDropdown();
                    } else {
                        // 显示下拉菜单
                        this.showDropdown();
                    }
                });

                console.log('近期搜索按钮事件监听器已重新绑定');
            } else {
                console.warn('找不到近期搜索按钮或下拉菜单元素');
            }
        }, 200);
    }

    showDropdown() {
        const dropdown = document.getElementById('recentSearchDropdown');
        if (dropdown) {
            this.isDropdownVisible = true;
            dropdown.style.display = 'block';
            // 强制重绘
            dropdown.offsetHeight;
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';

            // 更新搜索建议
            this.updateRecentSearches();

            console.log('下拉菜单已显示');
        }
    }

    hideDropdown() {
        const dropdown = document.getElementById('recentSearchDropdown');
        if (dropdown) {
            this.isDropdownVisible = false;
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);

            console.log('下拉菜单已隐藏');
        }
    }

    // 修复下拉菜单交互
    fixDropdownInteraction() {
        const dropdown = document.getElementById('recentSearchDropdown');

        if (dropdown) {
            // 防止下拉菜单内部点击时关闭
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // 点击外部关闭下拉菜单
            document.addEventListener('click', (e) => {
                const recentSearchBtn = document.getElementById('recentSearchBtn');
                if (dropdown && recentSearchBtn &&
                    !dropdown.contains(e.target) &&
                    !recentSearchBtn.contains(e.target)) {
                    this.hideDropdown();
                }
            });

            // 设置下拉菜单样式
            dropdown.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            dropdown.style.transform = 'translateY(-10px)';
            dropdown.style.opacity = '0';
        }
    }

    // 修复应用点击响应（兼容多个容器）
    fixAppClickResponse() {
        // 支持旧/新网格ID
        const appsGrid = document.getElementById('appsGrid') || document.getElementById('apps-grid');
        const lettersContent = document.getElementById('letters-content');
        const recentAppsList = document.getElementById('recentAppsList');

        const bindContainer = (container) => {
            if (!container) return;
            container.addEventListener('click', (e) => {
                const appItem = e.target.closest('.app-item, .letter-app-item, .recent-app-item');
                if (appItem) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleAppClick(appItem);
                }
            }, { capture: true });
        };

        bindContainer(appsGrid);
        bindContainer(lettersContent);
        bindContainer(recentAppsList);
    }

    handleAppClick(appItem) {
        const appId = appItem.dataset.app || appItem.dataset.appKey;
        const nameEl = appItem.querySelector('.app-name') || appItem.querySelector('span');
        const appName = (appItem.dataset.appName || (nameEl ? nameEl.textContent : '') || appId || '').trim();
        const searchInput = document.querySelector('.app-search-input');
        const searchQuery = searchInput ? searchInput.value.trim() : '';

        // 添加点击效果
        this.addClickEffect(appItem);

        // 始终更新左侧选中图标与占位文案
        this.replaceDefaultAppIcon(appId, appName, appItem);

        if (searchQuery) {
            // 输入框已有文字：立刻用所选应用搜索
            this.showToast(`正在用 ${appName} 搜索: ${searchQuery}`);
            setTimeout(() => {
                this.performSearch(appId, searchQuery, appName);
            }, 250);
        } else {
            // 输入框无文字：提示并等待用户输入后按回车
            this.showToast(`已选择 ${appName}，请输入关键词后按回车搜索`);
        }
    }

    // 替换默认app图标功能
    replaceDefaultAppIcon(appId, appName, clickedAppItem) {
        // 找到搜索框旁边的默认app图标
        const defaultAppIcon = document.querySelector('.selected-app-icon');

        if (defaultAppIcon && clickedAppItem && appId) {
            // 获取点击的应用图标信息（兼容不同结构）
            const letterEl = clickedAppItem.querySelector('.app-letter')
                || clickedAppItem.querySelector('.app-icon-mini')
                || clickedAppItem.querySelector('.app-icon-small');
            const appLetterText = letterEl ? (letterEl.textContent || '').trim().slice(0, 1) : (appName || '').charAt(0);
            const appLetterStyle = letterEl ? (letterEl.getAttribute('style') || '') : '';

            // 更新默认图标的显示
            defaultAppIcon.innerHTML = `
                <div class="app-letter" style="${appLetterStyle}">${appLetterText}</div>
            `;

            // 保存选中的应用信息
            defaultAppIcon.dataset.selectedApp = appId;
            defaultAppIcon.dataset.selectedAppName = appName;

            // 添加选中状态的样式
            defaultAppIcon.classList.add('app-selected');

            // 保存到本地存储
            this.saveSelectedApp(appId, appName, appLetterText, appLetterStyle);

            // 同步占位文案
            this.updateInputPlaceholder(appName);

            console.log(`默认应用已更换为: ${appName} (${appId})`);
        }
    }

    // 保存选中的应用到本地存储
    saveSelectedApp(appId, appName, appLetter, appLetterStyle) {
        try {
            const selectedAppData = {
                appId: appId,
                appName: appName,
                appLetter: appLetter,
                appLetterStyle: appLetterStyle,
                timestamp: Date.now()
            };
            localStorage.setItem('selectedDefaultApp', JSON.stringify(selectedAppData));
        } catch (e) {
            console.warn('无法保存选中的应用:', e);
        }
    }

    // 加载保存的默认应用
    loadSelectedApp() {
        try {
            const savedApp = localStorage.getItem('selectedDefaultApp');
            if (savedApp) {
                const appData = JSON.parse(savedApp);
                const defaultAppIcon = document.querySelector('.selected-app-icon');

                if (defaultAppIcon) {
                    defaultAppIcon.innerHTML = `
                        <div class="app-letter" style="${appData.appLetterStyle}">${appData.appLetter}</div>
                    `;
                    defaultAppIcon.dataset.selectedApp = appData.appId;
                    defaultAppIcon.dataset.selectedAppName = appData.appName;
                    defaultAppIcon.classList.add('app-selected');
                    this.updateInputPlaceholder(appData.appName);
                }
            }
        } catch (e) {
            console.warn('无法加载保存的应用:', e);
        }
    }

    // 绑定输入框按回车搜索
    bindSearchInput() {
        const input = document.getElementById('appSearchInput') || document.querySelector('.app-search-input');
        if (!input) return;

        // 防止重复绑定，替换节点
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);

        newInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = (newInput.value || '').trim();
                if (!query) return;
                const selected = this.getSelectedAppInfo();
                if (selected.appId) {
                    this.showToast(`正在用 ${selected.appName} 搜索: ${query}`);
                    setTimeout(() => {
                        this.performSearch(selected.appId, query, selected.appName);
                    }, 150);
                } else {
                    this.showToast('请先选择一个应用');
                }
            }
        });

        // 清空按钮恢复默认占位
        const clearBtn = document.getElementById('app-search-clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                newInput.value = '';
                const selected = this.getSelectedAppInfo();
                this.updateInputPlaceholder(selected.appName);
            });
        }
    }

    // 获取当前选中的应用信息
    getSelectedAppInfo() {
        const icon = document.querySelector('.selected-app-icon');
        let appId = icon ? icon.dataset.selectedApp : '';
        let appName = icon ? icon.dataset.selectedAppName : '';

        if (!appId) {
            try {
                const savedApp = localStorage.getItem('selectedDefaultApp');
                if (savedApp) {
                    const appData = JSON.parse(savedApp);
                    appId = appData.appId;
                    appName = appData.appName;
                }
            } catch (e) {
                // ignore
            }
        }
        return { appId, appName };
    }

    // 同步输入框占位文案
    updateInputPlaceholder(appName) {
        const input = document.getElementById('appSearchInput') || document.querySelector('.app-search-input');
        if (input) {
            if (appName) {
                input.placeholder = `在 ${appName} 搜索，按回车执行`;
            } else {
                input.placeholder = '输入关键词，然后点击下方应用图标进行搜索';
            }
        }
    }

    performSearch(appId, query, appName) {
        // 搜索URL映射
        const searchUrls = {
            'taobao': `https://s.taobao.com/search?q=${encodeURIComponent(query)}`,
            'jd': `https://search.jd.com/Search?keyword=${encodeURIComponent(query)}`,
            'pinduoduo': `https://mobile.yangkeduo.com/search_result.html?search_key=${encodeURIComponent(query)}`,
            'tmall': `https://list.tmall.com/search_product.htm?q=${encodeURIComponent(query)}`,
            'baidu': `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
            'zhihu': `https://www.zhihu.com/search?q=${encodeURIComponent(query)}`,
            'weibo': `https://s.weibo.com/weibo?q=${encodeURIComponent(query)}`,
            'bilibili': `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`,
            'douyin': `https://www.douyin.com/search/${encodeURIComponent(query)}`,
            'xiaohongshu': `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(query)}`,
            'youku': `https://so.youku.com/search_video/q_${encodeURIComponent(query)}`,
            'iqiyi': `https://so.iqiyi.com/so/q_${encodeURIComponent(query)}`,
            'netease': `https://music.163.com/#/search/m/?s=${encodeURIComponent(query)}`,
            'qqmusic': `https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.top&t=song&w=${encodeURIComponent(query)}`
        };

        const searchUrl = searchUrls[appId];
        if (searchUrl) {
            window.open(searchUrl, '_blank');
            console.log(`在 ${appName} 中搜索: ${query}`);

            // 保存搜索历史
            this.addToSearchHistory(query, appId, appName);
        } else {
            console.warn(`不支持在 ${appName} 中搜索`);
            this.showToast(`${appName} 暂不支持搜索功能`);
        }
    }

    launchApp(appId, appName) {
        // 应用默认页面URL映射
        const appUrls = {
            'taobao': 'https://www.taobao.com',
            'jd': 'https://www.jd.com',
            'pinduoduo': 'https://www.pinduoduo.com',
            'tmall': 'https://www.tmall.com',
            'wechat': 'https://web.wechat.com',
            'qq': 'https://im.qq.com',
            'weibo': 'https://weibo.com',
            'xiaohongshu': 'https://www.xiaohongshu.com',
            'douyin': 'https://www.douyin.com',
            'bilibili': 'https://www.bilibili.com',
            'youku': 'https://www.youku.com',
            'iqiyi': 'https://www.iqiyi.com',
            'meituan': 'https://www.meituan.com',
            'eleme': 'https://www.ele.me',
            'didi': 'https://www.didiglobal.com',
            'alipay': 'https://www.alipay.com',
            'amap': 'https://www.amap.com',
            'baidumap': 'https://map.baidu.com',
            'netease': 'https://music.163.com',
            'qqmusic': 'https://y.qq.com',
            'zhihu': 'https://www.zhihu.com',
            'baidu': 'https://www.baidu.com'
        };

        const appUrl = appUrls[appId];
        if (appUrl) {
            window.open(appUrl, '_blank');
            console.log(`打开应用: ${appName} - ${appUrl}`);
        } else {
            console.log(`启动应用: ${appId}`);
            this.showToast(`${appName} 功能开发中...`);
        }
    }

    addToSearchHistory(query, appId, appName) {
        try {
            let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const historyItem = {
                query: query,
                appId: appId,
                appName: appName,
                timestamp: Date.now()
            };

            // 避免重复
            history = history.filter(item => !(item.query === query && item.appId === appId));

            // 添加到开头
            history.unshift(historyItem);

            // 只保留最近20条记录
            history = history.slice(0, 20);

            localStorage.setItem('searchHistory', JSON.stringify(history));

            // 更新搜索建议
            this.updateRecentSearches();
        } catch (e) {
            console.warn('无法保存搜索历史:', e);
        }
    }

    updateRecentSearches() {
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
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const keyword = item.dataset.keyword;
                        const searchInput = document.querySelector('.app-search-input');
                        if (searchInput) {
                            searchInput.value = keyword;
                            searchInput.focus();
                        }
                        this.hideDropdown();
                    });
                });
            }
        } catch (e) {
            console.warn('无法更新搜索建议:', e);
        }
    }

    // 防止下拉菜单闪现
    preventDropdownFlicker() {
        const searchInput = document.querySelector('.app-search-input');
        if (searchInput) {
            // 移除自动显示搜索建议的事件
            searchInput.removeEventListener('focus', this.showSearchSuggestions);
        }
    }

    hideDropdown() {
        const dropdown = document.getElementById('recentSearchDropdown');
        if (dropdown) {
            this.isDropdownVisible = false;
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);
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
                padding: 12px 20px;
                border-radius: 25px;
                font-size: 14px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                max-width: 300px;
                text-align: center;
                font-weight: 500;
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';

        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2500);
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
                    if (!window.appsInteractionFix) {
                        // 延迟初始化，确保DOM完全加载
                        setTimeout(() => {
                            window.appsInteractionFix = new AppsInteractionFix();
                        }, 100);
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
            setTimeout(() => {
                window.appsInteractionFix = new AppsInteractionFix();
            }, 100);
        }
    }
});

// 导出供外部使用
window.AppsInteractionFix = AppsInteractionFix;