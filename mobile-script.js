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
        
        // 设置初始页面
        this.showPage('ai');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = item.dataset.page;
                if (pageId) {
                    const simplifiedPageId = pageId.replace('-page', '');
                    if (simplifiedPageId !== this.currentPage) {
                        this.showPage(simplifiedPageId);
                    }
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

    showPage(pageId) {
        if (this.isTransitioning || pageId === this.currentPage) return;
        
        this.isTransitioning = true;
        
        // 隐藏当前页面
        const currentPageElement = document.getElementById(`${this.currentPage}-page`);
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }
        
        // 更新导航状态
        this.updateNavigation(pageId);
        
        // 显示新页面
        setTimeout(() => {
            const newPageElement = document.getElementById(`${pageId}-page`);
            if (newPageElement) {
                newPageElement.classList.add('active');
            }
            
            this.currentPage = pageId;
            this.isTransitioning = false;
            
            // 触发页面特定的初始化
            this.initializePage(pageId);
        }, 150);
    }

    updateNavigation(activePageId) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.dataset.page === `${activePageId}-page`) {
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
        const urlInput = document.querySelector('.url-input');
        const navBtns = document.querySelectorAll('.nav-btn');
        const toolBtns = document.querySelectorAll('.tool-btn');
        const featureCards = document.querySelectorAll('.feature-card');
        
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
                this.handleBrowserNavigation(btn.textContent.trim());
            });
        });
        
        toolBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBrowserTool(btn.textContent.trim());
            });
        });
        
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleFeatureCard(card);
            });
        });
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
        }
    }

    handleBrowserTool(tool) {
        this.showToast(`${tool} 功能`);
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
        const container = document.querySelector('.mobile-app');
        if (container) {
            container.classList.toggle('tablet-mode');
            this.showToast('切换设备模式');
        }
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
        this.showToast('返回上一页');
    }

    browserGoForward() {
        this.showToast('前进下一页');
    }

    browserRefresh() {
        this.showToast('刷新页面');
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
    
    // 防止页面滚动
    document.body.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // 隐藏地址栏（移动端）
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 100);
});

// 导出供外部使用
window.MobileApp = MobileApp;