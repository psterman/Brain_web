// 移动端交互逻辑
class MobileApp {
    constructor() {
        this.currentPage = 'ai';
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSwipeGestures();
        this.setupPageInteractions();
        this.setupDeviceToggle();
        this.initializePages();
        this.setupTimeSync();

        // 设置初始页面
        this.showPage('ai');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = item.dataset.page;
                if (targetPage) {
                    this.showPage(targetPage);
                }
            });
        });
    }

    setupSwipeGestures() {
        const appContent = document.querySelector('.app-content');
        if (!appContent) return;

        // 触摸开始
        appContent.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        // 触摸结束
        appContent.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        // 检查是否为有效的水平滑动
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
            const pages = ['ai', 'browser', 'search', 'apps', 'settings'];
            const currentIndex = pages.indexOf(this.currentPage);

            if (deltaX > 0 && currentIndex > 0) {
                // 向右滑动，显示上一页
                this.showPage(pages[currentIndex - 1]);
            } else if (deltaX < 0 && currentIndex < pages.length - 1) {
                // 向左滑动，显示下一页
                this.showPage(pages[currentIndex + 1]);
            }
        }
    }

    showPage(pageIdOrElementId) {
        if (this.isTransitioning) return;

        // 目标元素ID与页面Key的解析
        const isFullId = typeof pageIdOrElementId === 'string' && pageIdOrElementId.includes('-page');
        const targetElementId = isFullId ? pageIdOrElementId : `${pageIdOrElementId}-page`;
        const normalizedPageKey = isFullId ? pageIdOrElementId.split('-page')[0] : pageIdOrElementId;

        // 如果目标页面已经激活则跳过
        const activeElement = document.querySelector('.page.active');
        if (activeElement && activeElement.id === targetElementId) return;

        this.isTransitioning = true;

        // 添加滑出动画到当前页面
        const currentPageElement = activeElement || document.getElementById(`${this.currentPage}-page`) || document.getElementById(`${this.currentPage}-page-demo`);
        if (currentPageElement && currentPageElement.classList.contains('active')) {
            currentPageElement.classList.add('slide-out');
        }

        // 隐藏所有页面并移除过渡类
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(page => {
            page.classList.remove('active', 'slide-out');
            // 确保非激活页面不可见，避免过渡优化脚本残留样式影响
            page.style.display = 'none';
        });

        // 更新导航状态（支持完整ID）
        this.updateNavigation(targetElementId);

        // 显示新页面（快速动画）
        setTimeout(() => {
            const newPageElement = document.getElementById(targetElementId);
            if (newPageElement) {
                newPageElement.classList.add('active');
                // 强制显示激活页面，覆盖任何display:none残留
                newPageElement.style.display = 'block';
            }

            this.currentPage = normalizedPageKey;
            this.isTransitioning = false;

            // 触发页面特定的初始化
            this.initializePage(normalizedPageKey);
        }, 50);
    }

    updateNavigation(activePageId) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const target = typeof activePageId === 'string' && activePageId.includes('-page')
                ? activePageId
                : `${activePageId}-page`;
            if (item.dataset.page === target) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    initializePage(pageId) {
        switch (pageId) {
            case 'ai':
                this.initializeAIPage();
                break;
            case 'browser':
                this.initializeBrowserPage();
                break;
            case 'search':
                this.initializeSearchPage();
                break;
            case 'apps':
                this.initializeAppsPage();
                break;
            case 'settings':
                this.initializeSettingsPage();
                break;
        }
    }

    initializeAIPage() {
        // AI页面交互逻辑
        const chatInput = document.querySelector('.chat-input');
        const inputActions = document.querySelectorAll('.input-action');
        const aiItems = document.querySelectorAll('.ai-item');

        if (chatInput) {
            chatInput.addEventListener('focus', () => {
                chatInput.parentElement.style.borderColor = '#007bff';
            });

            chatInput.addEventListener('blur', () => {
                chatInput.parentElement.style.borderColor = 'transparent';
            });
        }

        inputActions.forEach(action => {
            action.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleInputAction(action.textContent.trim());
            });
        });

        aiItems.forEach(item => {
            item.addEventListener('click', () => {
                this.selectAIAssistant(item);
            });
        });
    }

    initializeBrowserPage() {
        // 浏览器页面交互逻辑
        console.log('初始化浏览页面');

        // 等待DOM完全加载
        setTimeout(() => {
            const urlInput = document.querySelector('#browser-page .url-input') || document.querySelector('#browser-page-demo .url-input');
            const navBtns = document.querySelectorAll('#browser-page .nav-btn, #browser-page .search-engine-btn, #browser-page .ai-model-btn, #browser-page-demo .nav-btn, #browser-page-demo .search-engine-btn, #browser-page-demo .ai-model-btn');
            const toolBtns = document.querySelectorAll('#browser-page .tool-btn, #browser-page-demo .tool-btn');
            const urlActionBtns = document.querySelectorAll('#browser-page .url-action-btn, #browser-page-demo .url-action-btn');
            const featureCards = document.querySelectorAll('#browser-page .feature-card, #browser-page-demo .feature-card');

            console.log('找到的元素:', {
                urlInput: !!urlInput,
                navBtns: navBtns.length,
                toolBtns: toolBtns.length,
                urlActionBtns: urlActionBtns.length,
                featureCards: featureCards.length
            });

            if (urlInput) {
                urlInput.addEventListener('focus', () => {
                    urlInput.parentElement.style.backgroundColor = '#ffffff';
                    urlInput.parentElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                });

                urlInput.addEventListener('blur', () => {
                    urlInput.parentElement.style.backgroundColor = '#f8f9fa';
                    urlInput.parentElement.style.boxShadow = 'none';
                });
            }

            navBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('导航按钮被点击:', btn.id, btn.textContent.trim());
                    // 根据按钮ID或内容判断功能
                    const btnId = btn.id;
                    const btnContent = btn.textContent.trim();

                    if (btnId === 'backBtnDemo' || btnId === 'backBtn') {
                        this.handleBrowserNavigation('←');
                    } else if (btnId === 'forwardBtnDemo' || btnId === 'forwardBtn') {
                        this.handleBrowserNavigation('→');
                    } else if (btnId === 'refreshBtnDemo' || btnId === 'refreshBtn') {
                        this.handleBrowserNavigation('↻');
                    } else if (btnId === 'searchEngineBtnDemo' || btnId === 'searchEngineBtn') {
                        this.handleBrowserNavigation('🔍');
                    } else if (btnId === 'aiModelBtnDemo' || btnId === 'aiModelBtn') {
                        this.handleBrowserNavigation('🤖');
                    } else if (btnId === 'homeBtnDemo' || btnId === 'homeBtn') {
                        this.handleBrowserNavigation('🏠');
                    } else {
                        // 回退到内容判断
                        this.handleBrowserNavigation(btnContent);
                    }
                });
            });

            toolBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('工具按钮被点击:', btn.id, btn.textContent.trim());
                    // 根据按钮ID或内容判断功能
                    const btnId = btn.id;
                    const btnContent = btn.textContent.trim();

                    if (btnId === 'bookmarkBtnDemo' || btnId === 'bookmarkBtn') {
                        this.handleBrowserTool('⭐');
                    } else if (btnId === 'bookmarkListBtnDemo' || btnId === 'bookmarkListBtn') {
                        this.handleBrowserTool('📚');
                    } else if (btnId === 'tabsBtnDemo' || btnId === 'tabsBtn') {
                        this.handleBrowserTool('📄');
                    } else if (btnId === 'historyBtnDemo' || btnId === 'historyBtn') {
                        this.handleBrowserTool('🕒');
                    } else if (btnId === 'downloadBtnDemo' || btnId === 'downloadBtn') {
                        this.handleBrowserTool('⬇️');
                    } else if (btnId === 'shareBtnDemo' || btnId === 'shareBtn') {
                        this.handleBrowserTool('📤');
                    } else {
                        // 回退到内容判断
                        this.handleBrowserTool(btnContent);
                    }
                });
            });

            urlActionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('URL操作按钮被点击:', btn.id, btn.title);
                    const btnId = btn.id;
                    const btnTitle = btn.title;

                    if (btnId === 'pasteBtnDemo' || btnId === 'pasteBtn' || btnTitle === '粘贴') {
                        this.handlePasteAction();
                    } else if (btnId === 'clearBtnDemo' || btnId === 'clearBtn' || btnTitle === '清空') {
                        this.handleClearAction();
                    }
                });
            });

            featureCards.forEach(card => {
                card.addEventListener('click', () => {
                    this.handleFeatureCard(card);
                });
            });
        }, 100); // 延迟100ms确保DOM完全加载
    }

    initializeSearchPage() {
        // 搜索页面交互逻辑
        const configTabs = document.querySelectorAll('.config-tab');
        const categoryBtns = document.querySelectorAll('.category-btn');
        const engineItems = document.querySelectorAll('.engine-item');

        configTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchConfigTab(tab);
            });
        });

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchEngineCategory(btn);
            });
        });

        engineItems.forEach(item => {
            item.addEventListener('click', () => {
                this.toggleSearchEngine(item);
            });
        });
    }

    initializeAppsPage() {
        // 应用页面交互逻辑
        const searchInput = document.querySelector('.app-search-input');
        const categoryItems = document.querySelectorAll('.category-item');
        const appItems = document.querySelectorAll('.app-item');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterApps(e.target.value);
            });
        }

        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.switchAppCategory(item);
            });
        });

        appItems.forEach(item => {
            item.addEventListener('click', () => {
                this.launchApp(item);
            });
        });
    }

    initializeSettingsPage() {
        // 设置页面交互逻辑
        const settingItems = document.querySelectorAll('.setting-item');
        const toggles = document.querySelectorAll('.setting-toggle input');

        settingItems.forEach(item => {
            item.addEventListener('click', () => {
                this.handleSettingItem(item);
            });
        });

        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.handleToggleChange(toggle, e.target.checked);
            });
        });
    }

    setupPageInteractions() {
        // 通用页面交互
        document.addEventListener('click', (e) => {
            // 处理按钮点击效果
            if (e.target.matches('button, .btn, .nav-item, .feature-card, .app-item, .setting-item')) {
                this.addClickEffect(e.target);
            }
        });
    }

    setupDeviceToggle() {
        const deviceToggle = document.querySelector('.device-toggle');
        if (deviceToggle) {
            deviceToggle.addEventListener('click', () => {
                this.toggleDeviceMode();
            });
        }
    }

    initializePages() {
        // 初始化所有页面的基本状态
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
    }

    // 交互处理方法
    handleInputAction(action) {
        switch (action) {
            case '🎤':
                this.startVoiceInput();
                break;
            case '📎':
                this.attachFile();
                break;
            case '➤':
                this.sendMessage();
                break;
        }
    }

    selectAIAssistant(item) {
        // 移除其他选中状态
        document.querySelectorAll('.ai-item').forEach(ai => {
            ai.classList.remove('selected');
        });

        // 添加选中状态
        item.classList.add('selected');

        // 显示选中反馈
        this.showToast('已选择 ' + item.querySelector('.ai-name').textContent);
    }

    handleBrowserNavigation(action) {
        switch (action) {
            case '←':
                this.browserGoBack();
                break;
            case '→':
                this.browserGoForward();
                break;
            case '↻':
                this.browserRefresh();
                break;
            case '🔍':
                // 搜索引擎按钮
                if (window.browserManager && typeof window.browserManager.showSearchEngines === 'function') {
                    window.browserManager.showSearchEngines();
                } else if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.showSearchEngines === 'function') {
                    window.enhancedBrowserV3.showSearchEngines();
                } else {
                    this.showToast('搜索引擎功能');
                }
                break;
            case '🤖':
                // AI模型按钮
                if (window.browserManager && typeof window.browserManager.showAiModels === 'function') {
                    window.browserManager.showAiModels();
                } else if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.showAiModels === 'function') {
                    window.enhancedBrowserV3.showAiModels();
                } else {
                    this.showToast('AI模型功能');
                }
                break;
            case '🏠':
                // 主页按钮
                if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.goHome === 'function') {
                    window.enhancedBrowserV3.goHome();
                } else {
                    this.showToast('主页功能');
                }
                break;
        }
    }

    handleBrowserTool(tool) {
        // 根据按钮内容判断功能
        if (tool.includes('收藏夹') || tool.includes('📚')) {
            // 调用增强浏览器的收藏夹功能
            if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.showBookmarks === 'function') {
                window.enhancedBrowserV3.showBookmarks();
            } else {
                this.showToast('收藏夹功能');
            }
        } else if (tool.includes('收藏') || tool.includes('⭐')) {
            // 调用增强浏览器的收藏功能
            if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.toggleBookmark === 'function') {
                window.enhancedBrowserV3.toggleBookmark();
            } else {
                this.showToast('收藏功能');
            }
        } else if (tool.includes('标签页') || tool.includes('📄')) {
            // 调用增强浏览器的标签页功能
            if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.showTabsManager === 'function') {
                window.enhancedBrowserV3.showTabsManager();
            } else {
                this.showToast('标签页功能');
            }
        } else if (tool.includes('历史') || tool.includes('🕒')) {
            // 调用增强浏览器的历史功能
            if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.showHistory === 'function') {
                window.enhancedBrowserV3.showHistory();
            } else {
                this.showToast('历史功能');
            }
        } else if (tool.includes('分享') || tool.includes('📤')) {
            // 调用增强浏览器的分享功能
            if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.shareUrl === 'function') {
                window.enhancedBrowserV3.shareUrl();
            } else {
                this.showToast('分享功能');
            }
        } else if (tool.includes('下载') || tool.includes('⬇️')) {
            // 调用增强浏览器的下载功能
            if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.showDownloadManager === 'function') {
                window.enhancedBrowserV3.showDownloadManager();
            } else {
                this.showToast('下载功能');
            }
        } else {
            this.showToast(`${tool} 功能`);
        }
    }

    handleFeatureCard(card) {
        const title = card.querySelector('.card-title').textContent;
        this.showToast(`打开 ${title}`);
    }

    switchConfigTab(activeTab) {
        document.querySelectorAll('.config-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    switchEngineCategory(activeBtn) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    toggleSearchEngine(item) {
        item.classList.toggle('selected');
        const engineName = item.querySelector('.engine-name').textContent;
        const isSelected = item.classList.contains('selected');
        this.showToast(`${isSelected ? '启用' : '禁用'} ${engineName}`);
    }

    filterApps(query) {
        const appItems = document.querySelectorAll('.app-item');
        appItems.forEach(item => {
            const appName = item.querySelector('.app-name').textContent.toLowerCase();
            if (appName.includes(query.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    switchAppCategory(activeItem) {
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    launchApp(item) {
        const appName = item.querySelector('.app-name').textContent;
        this.showToast(`启动 ${appName}`);

        // 添加启动动画
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 150);
    }

    handleSettingItem(item) {
        const title = item.querySelector('.setting-title').textContent;
        this.showToast(`${title} 设置`);
    }

    handleToggleChange(toggle, isChecked) {
        const settingTitle = toggle.closest('.setting-item').querySelector('.setting-title').textContent;
        this.showToast(`${settingTitle} ${isChecked ? '已开启' : '已关闭'}`);
    }

    addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    toggleDeviceMode() {
        // 切换到PC端
        window.location.href = 'index.html';
    }

    // 工具方法
    startVoiceInput() {
        this.showToast('开始语音输入');
    }

    attachFile() {
        this.showToast('选择文件');
    }

    sendMessage() {
        const input = document.querySelector('.chat-input');
        if (input && input.value.trim()) {
            this.showToast('发送消息: ' + input.value);
            input.value = '';
        }
    }

    browserGoBack() {
        // 调用增强浏览器的后退功能
        if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.goBack === 'function') {
            window.enhancedBrowserV3.goBack();
        } else {
            this.showToast('返回上一页');
        }
    }

    browserGoForward() {
        // 调用增强浏览器的前进功能
        if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.goForward === 'function') {
            window.enhancedBrowserV3.goForward();
        } else {
            this.showToast('前进下一页');
        }
    }

    browserRefresh() {
        // 调用增强浏览器的刷新功能
        if (window.enhancedBrowserV3 && typeof window.enhancedBrowserV3.refresh === 'function') {
            window.enhancedBrowserV3.refresh();
        } else {
            this.showToast('刷新页面');
        }
    }

    // 处理粘贴操作
    async handlePasteAction() {
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

    // 处理清空操作
    handleClearAction() {
        const urlInput = document.querySelector('#browser-page-demo .url-input') || document.querySelector('#browser-page .url-input');
        if (urlInput) {
            urlInput.value = '';
            urlInput.focus();
            this.showToast('已清空输入框');

            // 触发输入事件以更新清空按钮状态
            urlInput.dispatchEvent(new Event('input'));
        }
    }

    showToast(message) {
        // 创建或更新 toast 提示
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
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
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
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

    // 响应式处理
    handleResize() {
        const width = window.innerWidth;
        const container = document.querySelector('.mobile-app');

        if (width > 768) {
            container.classList.add('tablet-mode');
        } else {
            container.classList.remove('tablet-mode');
        }
    }

    // 设置时间同步
    setupTimeSync() {
        this.updateTime();
        // 每秒更新时间
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    // 更新时间显示
    updateTime() {
        const timeElement = document.querySelector('.time');
        if (timeElement) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }

    // 键盘事件处理
    handleKeyboard() {
        document.addEventListener('keydown', (e) => {
            // ESC 键返回
            if (e.key === 'Escape') {
                this.showPage('ai');
            }

            // 移除数字键快速切换功能，避免用户误操作
            // 用户可以通过导航栏或滑动手势切换页面
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const app = new MobileApp();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        app.handleResize();
    });

    // 初始化键盘事件
    app.handleKeyboard();

    // 隐藏地址栏（移动端）
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 100);
});

// 导出供外部使用
window.MobileApp = MobileApp;