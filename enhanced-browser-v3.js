// 增强版移动浏览器管理类 V3 - iOS风格
class EnhancedBrowserManagerV3 {
    constructor() {
        this.tabs = []; // 标签页数组
        this.activeTabId = null;
        this.tabIdCounter = 0;
        this.bookmarks = this.loadBookmarks();
        this.currentSearchEngine = 'baidu';
        this.currentAiModel = 'deepseek';

        // 长按相关
        this.longPressTimer = null;
        this.longPressThreshold = 500; // 500ms
        this.isLongPressing = false;

        // 手势相关
        this.gestureStartX = 0;
        this.gestureStartY = 0;
        this.gestureThreshold = 50;
        this.isGesturing = false;

        // 搜索引擎配置（iOS风格图标）
        this.searchEngines = {
            baidu: { name: '百度', url: 'https://m.baidu.com/s?word=', icon: '🔍' },
            google: { name: '谷歌', url: 'https://www.google.com/search?q=', icon: '🌐' },
            bing: { name: '必应', url: 'https://www.bing.com/search?q=', icon: '🔎' },
            sogou: { name: '搜狗', url: 'https://m.sogou.com/web/searchList.jsp?keyword=', icon: '🔍' },
            so360: { name: '360搜索', url: 'https://m.so.com/s?q=', icon: '🔍' },
            shenma: { name: '神马搜索', url: 'https://m.sm.cn/s?q=', icon: '🔍' }
        };

        // AI模型配置（iOS风格图标）
        this.aiModels = {
            deepseek: { name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: '🤖' },
            kimi: { name: 'Kimi', url: 'https://kimi.moonshot.cn/', icon: '🌙' },
            doubao: { name: '豆包', url: 'https://www.doubao.com/', icon: '🫘' },
            wenxin: { name: '文心一言', url: 'https://yiyan.baidu.com/', icon: '💭' },
            zhipu: { name: '智谱清言', url: 'https://chatglm.cn/', icon: '🧠' },
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
        this.setupLongPress();
        this.updateUI();
        this.setupUrlInputEnhancements();

        // 监听页面切换事件，确保在切换到浏览页面时重新绑定事件
        this.setupPageSwitchListener();
    }

    // 设置URL输入框增强功能
    setupUrlInputEnhancements() {
        // 等待DOM加载完成后再设置
        setTimeout(() => {
            const urlContainer = document.querySelector('#browser-page-demo .url-container') || document.querySelector('#browser-page .url-container');
            if (!urlContainer) {
                console.warn('未找到URL容器元素');
                return;
            }

            const urlInput = document.querySelector('#browser-page-demo .url-input') || document.querySelector('#browser-page .url-input');
            if (!urlInput) {
                console.warn('未找到URL输入框元素');
                return;
            }

            // 监听输入框变化，控制清空按钮显示
            urlInput.addEventListener('input', () => {
                const clearBtn = document.querySelector('#browser-page-demo .clear-btn') || document.querySelector('#browser-page .clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = urlInput.value ? 'flex' : 'none';
                }
            });

            // 粘贴按钮事件 - 确保正确绑定
            const pasteBtn = document.querySelector('#browser-page-demo .paste-btn') || document.querySelector('#browser-page .paste-btn');
            if (pasteBtn) {
                // 移除可能存在的旧事件监听器
                pasteBtn.removeEventListener('click', this.pasteToUrlInput);
                // 添加新的事件监听器
                pasteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('粘贴按钮被点击');
                    this.pasteToUrlInput();
                });
                console.log('粘贴按钮事件已绑定');
            } else {
                console.warn('未找到粘贴按钮元素');
            }

            // 清空按钮事件
            const clearBtn = document.querySelector('#browser-page-demo .clear-btn') || document.querySelector('#browser-page .clear-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('清空按钮被点击');
                    this.clearUrlInput();
                });
                // 初始状态
                clearBtn.style.display = urlInput.value ? 'flex' : 'none';
                console.log('清空按钮事件已绑定');
            } else {
                console.warn('未找到清空按钮元素');
            }
        }, 100);
    }

    // 设置页面切换监听器
    setupPageSwitchListener() {
        // 监听页面切换事件
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item[data-page]');
            if (navItem) {
                const targetPage = navItem.getAttribute('data-page');
                if (targetPage === 'browser-page') {
                    // 当切换到浏览页面时，重新绑定事件
                    setTimeout(() => {
                        this.setupUrlInputEnhancements();
                        this.bindEvents();
                    }, 200);
                }
            }
        });

        // 监听页面显示事件
        document.addEventListener('DOMContentLoaded', () => {
            // 检查当前是否在浏览页面
            const browserPage = document.getElementById('browser-page');
            if (browserPage && browserPage.classList.contains('active')) {
                setTimeout(() => {
                    this.setupUrlInputEnhancements();
                }, 300);
            }
        });
    }

    // 粘贴到URL输入框
    async pasteToUrlInput() {
        try {
            const text = await navigator.clipboard.readText();
            const urlInput = document.querySelector('#browser-page-demo .url-input') || document.querySelector('#browser-page .url-input');
            if (urlInput && text) {
                urlInput.value = text;
                urlInput.focus();
                this.showToast('已粘贴', 'success');

                // 触发输入事件以更新清空按钮状态
                urlInput.dispatchEvent(new Event('input'));
            }
        } catch (error) {
            this.showToast('粘贴失败', 'error');
        }
    }

    // 清空URL输入框
    clearUrlInput() {
        const urlInput = document.querySelector('#browser-page-demo .url-input') || document.querySelector('#browser-page .url-input');
        if (urlInput) {
            urlInput.value = '';
            urlInput.focus();

            // 触发输入事件以更新清空按钮状态
            urlInput.dispatchEvent(new Event('input'));
        }
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
            history: [{
                url: url,
                title: title,
                timestamp: Date.now()
            }],
            historyIndex: 0,
            canGoBack: false,
            canGoForward: false,
            isLoading: false,
            favicon: '🌐',
            screenshot: null,
            timestamp: Date.now()
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
                history: [{
                    url: 'https://m.baidu.com',
                    title: '百度',
                    timestamp: Date.now()
                }],
                historyIndex: 0,
                canGoBack: false,
                canGoForward: false,
                isLoading: false,
                favicon: '🌐',
                screenshot: null,
                timestamp: Date.now()
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
        this.hideAllLists();
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
        // 搜索引擎按钮 - 确保绑定到正确的元素
        const searchEngineBtn = document.getElementById('searchEngineBtnDemo') || document.getElementById('searchEngineBtn');
        if (searchEngineBtn) {
            searchEngineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('搜索引擎按钮被点击');
                this.showSearchEngines();
            });
        } else {
            console.warn('未找到搜索引擎按钮元素');
        }

        // AI模型按钮 - 确保绑定到正确的元素
        const aiModelBtn = document.getElementById('aiModelBtnDemo') || document.getElementById('aiModelBtn');
        if (aiModelBtn) {
            aiModelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('AI模型按钮被点击');
                this.showAiModels();
            });
        } else {
            console.warn('未找到AI模型按钮元素');
        }

        // 导航按钮 - 使用iOS风格图标
        (document.getElementById('backBtnDemo') || document.getElementById('backBtn'))?.addEventListener('click', () => this.goBack());
        (document.getElementById('forwardBtnDemo') || document.getElementById('forwardBtn'))?.addEventListener('click', () => this.goForward());
        (document.getElementById('refreshBtnDemo') || document.getElementById('refreshBtn'))?.addEventListener('click', () => this.refresh());
        (document.getElementById('homeBtnDemo') || document.getElementById('homeBtn'))?.addEventListener('click', () => this.goHome());
        // 收藏按钮 - 确保两个版本都能正常工作
        const bookmarkBtnDemo = document.getElementById('bookmarkBtnDemo');
        const bookmarkBtn = document.getElementById('bookmarkBtn');

        if (bookmarkBtnDemo) {
            bookmarkBtnDemo.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleBookmark();
            });
        }

        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleBookmark();
            });
        }

        // 收藏夹按钮 - 确保两个版本都能正常工作
        const bookmarkListBtnDemo = document.getElementById('bookmarkListBtnDemo');
        const bookmarkListBtn = document.getElementById('bookmarkListBtn');

        if (bookmarkListBtnDemo) {
            bookmarkListBtnDemo.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showBookmarks();
            });
        }

        if (bookmarkListBtn) {
            bookmarkListBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showBookmarks();
            });
        }

        (document.getElementById('historyBtnDemo') || document.getElementById('historyBtn'))?.addEventListener('click', () => this.showHistory());
        (document.getElementById('shareBtnDemo') || document.getElementById('shareBtn'))?.addEventListener('click', () => this.shareUrl());
        (document.getElementById('tabsBtnDemo') || document.getElementById('tabsBtn'))?.addEventListener('click', () => this.showTabsManager());
        (document.getElementById('downloadBtnDemo') || document.getElementById('downloadBtn'))?.addEventListener('click', () => this.showDownloadManager());

        // 添加多标签页按钮
        this.addTabsButton();

        // URL输入框
        const urlInput = document.querySelector('#browser-page-demo .url-input') || document.querySelector('#browser-page .url-input') || document.querySelector('.url-input');
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
        const iframe = document.getElementById('browserFrameDemo') || document.getElementById('browserFrame');
        if (iframe) {
            iframe.addEventListener('load', () => {
                this.hideLoading();
                this.updateTabInfo();
                this.captureTabScreenshot();
            });
        }

        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-list') &&
                !e.target.closest('.nav-btn') &&
                !e.target.closest('.action-btn') &&
                !e.target.closest('.context-menu') &&
                !e.target.closest('.url-action-btn')) {
                this.hideAllLists();
                this.hideContextMenu();
            }
        });
    }

    // 添加标签页管理按钮
    addTabsButton() {
        const toolbar = document.querySelector('#browser-page-demo .browser-toolbar') || document.querySelector('#browser-page .browser-toolbar') || document.querySelector('.browser-toolbar');
        if (!toolbar) return;

        // 检查是否已经添加了标签页按钮
        if (document.getElementById('tabsBtn')) return;

        const tabsBtn = document.createElement('button');
        tabsBtn.id = 'tabsBtn';
        tabsBtn.className = 'tool-btn';
        tabsBtn.innerHTML = '📄'; // iOS风格标签页图标
        tabsBtn.title = '标签页管理';
        tabsBtn.addEventListener('click', () => this.showTabsManager());

        // 插入到分享按钮之前
        const shareBtn = document.getElementById('shareBtnDemo') || document.getElementById('shareBtn');
        if (shareBtn) {
            toolbar.insertBefore(tabsBtn, shareBtn);
        } else {
            toolbar.appendChild(tabsBtn);
        }
    }

    // 设置长按功能
    setupLongPress() {
        const browserContent = document.querySelector('#browser-page-demo .browser-content') || document.querySelector('#browser-page .browser-content');
        if (!browserContent) return;

        let touchStartTime;
        let touchStartX, touchStartY;

        browserContent.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartTime = Date.now();
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                this.isLongPressing = false;

                // 设置长按定时器
                this.longPressTimer = setTimeout(() => {
                    this.isLongPressing = true;
                    this.handleLongPress(e.touches[0]);
                }, this.longPressThreshold);
            }
        }, { passive: false });

        browserContent.addEventListener('touchmove', (e) => {
            if (this.longPressTimer) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = Math.abs(currentX - touchStartX);
                const deltaY = Math.abs(currentY - touchStartY);

                // 如果移动距离超过阈值，取消长按
                if (deltaX > 10 || deltaY > 10) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
            }
        }, { passive: true });

        browserContent.addEventListener('touchend', (e) => {
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }

            // 如果是长按，阻止默认行为
            if (this.isLongPressing) {
                e.preventDefault();
                this.isLongPressing = false;
            }
        }, { passive: false });
    }

    // 处理长按事件
    handleLongPress(touch) {
        const x = touch.clientX;
        const y = touch.clientY;

        // 震动反馈（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // 显示上下文菜单
        this.showContextMenu(x, y);
    }

    // 显示上下文菜单（iOS风格）
    showContextMenu(x, y) {
        this.hideContextMenu();

        const menu = document.createElement('div');
        menu.className = 'context-menu ios-style';
        menu.innerHTML = `
            <div class="context-menu-item" onclick="enhancedBrowserV3.contextAction('copy-link')">
                <span class="context-icon">🔗</span>
                <span class="context-text">复制链接</span>
            </div>
            <div class="context-menu-item" onclick="enhancedBrowserV3.contextAction('copy-text')">
                <span class="context-icon">📝</span>
                <span class="context-text">复制文字</span>
            </div>
            <div class="context-menu-item" onclick="enhancedBrowserV3.contextAction('save-image')">
                <span class="context-icon">💾</span>
                <span class="context-text">保存图片</span>
            </div>
            <div class="context-menu-item" onclick="enhancedBrowserV3.contextAction('new-tab')">
                <span class="context-icon">📄</span>
                <span class="context-text">新标签页打开</span>
            </div>
            <div class="context-menu-item" onclick="enhancedBrowserV3.contextAction('share')">
                <span class="context-icon">📤</span>
                <span class="context-text">分享</span>
            </div>
        `;

        // 计算菜单位置
        const menuWidth = 200;
        const menuHeight = 250;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let menuX = x - menuWidth / 2;
        let menuY = y - menuHeight / 2;

        // 边界检查
        if (menuX < 10) menuX = 10;
        if (menuX + menuWidth > viewportWidth - 10) menuX = viewportWidth - menuWidth - 10;
        if (menuY < 10) menuY = 10;
        if (menuY + menuHeight > viewportHeight - 10) menuY = viewportHeight - menuHeight - 10;

        menu.style.left = menuX + 'px';
        menu.style.top = menuY + 'px';

        document.body.appendChild(menu);

        // 添加动画
        setTimeout(() => menu.classList.add('show'), 10);
    }

    // 隐藏上下文菜单
    hideContextMenu() {
        const menu = document.querySelector('.context-menu');
        if (menu) {
            menu.classList.remove('show');
            setTimeout(() => menu.remove(), 200);
        }
    }

    // 上下文菜单操作
    contextAction(action) {
        this.hideContextMenu();

        switch (action) {
            case 'copy-link':
                this.copyCurrentUrl();
                break;
            case 'copy-text':
                this.copySelectedText();
                break;
            case 'save-image':
                this.saveImage();
                break;
            case 'new-tab':
                this.openInNewTab();
                break;
            case 'share':
                this.shareUrl();
                break;
        }
    }

    // 复制当前URL
    copyCurrentUrl() {
        const tab = this.getCurrentTab();
        if (tab) {
            navigator.clipboard.writeText(tab.url).then(() => {
                this.showToast('链接已复制', 'success');
            }).catch(() => {
                this.showToast('复制失败', 'error');
            });
        }
    }

    // 复制选中文字
    copySelectedText() {
        try {
            const iframe = document.getElementById('browserFrame');
            if (iframe && iframe.contentWindow) {
                const selection = iframe.contentWindow.getSelection();
                if (selection && selection.toString()) {
                    navigator.clipboard.writeText(selection.toString()).then(() => {
                        this.showToast('文字已复制', 'success');
                    });
                } else {
                    this.showToast('未选中文字', 'warning');
                }
            }
        } catch (error) {
            this.showToast('无法复制文字', 'error');
        }
    }

    // 保存图片
    saveImage() {
        this.showToast('图片保存功能开发中', 'info');
    }

    // 在新标签页打开
    openInNewTab() {
        const tab = this.getCurrentTab();
        if (tab) {
            this.createNewTab(tab.url, tab.title);
            this.showToast('已在新标签页打开', 'success');
        }
    }

    // 设置手势操作
    setupGestures() {
        const browserContent = document.querySelector('.browser-content');
        if (!browserContent) return;

        let startX, startY, startTime;

        browserContent.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1 && !this.isLongPressing) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
                this.isGesturing = false;
            }
        }, { passive: true });

        browserContent.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && !this.isGesturing && !this.isLongPressing) {
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

    // 显示搜索引擎列表（居中显示）
    showSearchEngines() {
        this.hideAllLists();

        const listHtml = `
            <div class="dropdown-list search-engine-list centered-list ios-style" id="searchEngineList" style="display: block !important; z-index: 10000 !important;">
                <div class="list-header">
                    <span>选择搜索引擎</span>
                    <button class="close-btn" onclick="enhancedBrowserV3.hideAllLists()">✕</button>
                </div>
                <div class="list-content">
                    ${Object.entries(this.searchEngines).map(([key, engine]) => `
                        <div class="list-item ${key === this.currentSearchEngine ? 'active' : ''}" 
                             onclick="enhancedBrowserV3.selectSearchEngine('${key}')">
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
    }

    // 显示AI模型列表（居中显示）
    showAiModels() {
        this.hideAllLists();

        const listHtml = `
            <div class="dropdown-list ai-model-list centered-list ios-style" id="aiModelList" style="display: block !important; z-index: 10000 !important;">
                <div class="list-header">
                    <span>选择AI模型</span>
                    <button class="close-btn" onclick="enhancedBrowserV3.hideAllLists()">✕</button>
                </div>
                <div class="list-content">
                    ${Object.entries(this.aiModels).map(([key, model]) => `
                        <div class="list-item ${key === this.currentAiModel ? 'active' : ''}" 
                             onclick="enhancedBrowserV3.selectAiModel('${key}')">
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
    }

    // 显示大卡片式标签页管理器
    showTabsManager() {
        this.hideAllLists();

        const tabsHtml = this.tabs.map(tab => {
            const timeAgo = this.getTimeAgo(Date.now() - tab.timestamp);
            return `
                <div class="tab-large-card ${tab.id === this.activeTabId ? 'active' : ''}" 
                     onclick="enhancedBrowserV3.switchToTab(${tab.id})">
                    <div class="tab-card-preview-large">
                        ${tab.screenshot ? `<img src="${tab.screenshot}" alt="预览">` :
                    '<div class="tab-card-placeholder-large">🌐</div>'}
                        <div class="tab-card-overlay">
                            <div class="tab-card-favicon-large">${tab.favicon}</div>
                        </div>
                    </div>
                    <div class="tab-card-info">
                        <div class="tab-card-header-large">
                            <div class="tab-card-title-large">${tab.title}</div>
                            <button class="tab-card-close-large" onclick="event.stopPropagation(); enhancedBrowserV3.closeTab(${tab.id})">✕</button>
                        </div>
                        <div class="tab-card-url-large">${tab.url}</div>
                        <div class="tab-card-time">${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');

        const listHtml = `
            <div class="dropdown-list tabs-manager-large ios-style" id="tabsManagerLarge">
                <div class="list-header">
                    <span>标签页管理 (${this.tabs.length})</span>
                    <div class="header-actions">
                        <button class="new-tab-btn-large" onclick="enhancedBrowserV3.createNewTab()" title="新建标签页">➕</button>
                        <button class="close-btn" onclick="enhancedBrowserV3.hideAllLists()">✕</button>
                    </div>
                </div>
                <div class="tabs-grid-large">
                    ${tabsHtml}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', listHtml);
    }

    // 显示收藏夹（优化版本 - 展示用户收藏的网址）
    showBookmarks() {
        this.hideAllLists();

        // 确保收藏夹数据是最新的
        this.bookmarks = this.loadBookmarks();

        const bookmarksHtml = this.bookmarks.length > 0
            ? this.bookmarks.map((bookmark, index) => {
                // 安全处理URL和标题，防止XSS
                const safeUrl = bookmark.url.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                const safeTitle = bookmark.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const safeDisplayUrl = bookmark.url.length > 50 ? bookmark.url.substring(0, 50) + '...' : bookmark.url;

                return `
                    <div class="bookmark-item-enhanced" onclick="enhancedBrowserV3.navigateToUrl('${safeUrl}')">
                        <div class="bookmark-icon-enhanced">⭐</div>
                        <div class="bookmark-content-enhanced">
                            <div class="bookmark-title-enhanced">${safeTitle}</div>
                            <div class="bookmark-url-enhanced">${safeDisplayUrl}</div>
                            <div class="bookmark-time-enhanced">${this.formatBookmarkTime(bookmark.time)}</div>
                        </div>
                        <button class="bookmark-delete-enhanced" onclick="event.stopPropagation(); enhancedBrowserV3.removeBookmarkByIndex(${index})" title="删除收藏">🗑️</button>
                    </div>
                `;
            }).join('')
            : `
                <div class="empty-bookmarks-state">
                    <div class="empty-icon">📚</div>
                    <div class="empty-title">暂无收藏</div>
                    <div class="empty-desc">收藏喜欢的网页，方便下次访问</div>
                </div>
            `;

        const listHtml = `
            <div class="dropdown-list bookmarks-list-enhanced ios-style" id="bookmarksList">
                <div class="list-header">
                    <span>我的收藏 (${this.bookmarks.length})</span>
                    <div class="header-actions">
                        ${this.bookmarks.length > 0 ? '<button class="clear-all-btn" onclick="enhancedBrowserV3.clearAllBookmarks()" title="清空收藏">🗑️</button>' : ''}
                        <button class="close-btn" onclick="enhancedBrowserV3.hideAllLists()">✕</button>
                    </div>
                </div>
                <div class="bookmarks-content-enhanced">
                    ${bookmarksHtml}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', listHtml);
    }

    // 显示下载管理器
    showDownloadManager() {
        this.hideAllLists();

        // 模拟下载列表
        const downloads = [
            { name: '示例文档.pdf', size: '2.3 MB', progress: 100, status: 'completed' },
            { name: '图片.jpg', size: '1.8 MB', progress: 75, status: 'downloading' },
            { name: '视频.mp4', size: '45.2 MB', progress: 30, status: 'downloading' }
        ];

        const downloadsHtml = downloads.map((download, index) => `
            <div class="download-item">
                <div class="download-icon">
                    ${download.status === 'completed' ? '✅' : '⬇️'}
                </div>
                <div class="download-info">
                    <div class="download-name">${download.name}</div>
                    <div class="download-details">
                        <span class="download-size">${download.size}</span>
                        <span class="download-status">${download.status === 'completed' ? '已完成' : '下载中'}</span>
                    </div>
                    ${download.status === 'downloading' ? `
                        <div class="download-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${download.progress}%"></div>
                            </div>
                            <span class="progress-text">${download.progress}%</span>
                        </div>
                    ` : ''}
                </div>
                <div class="download-actions">
                    ${download.status === 'completed' ?
                '<button class="download-action-btn" onclick="enhancedBrowserV3.openDownload(' + index + ')">📂</button>' :
                '<button class="download-action-btn" onclick="enhancedBrowserV3.pauseDownload(' + index + ')">⏸️</button>'
            }
                    <button class="download-action-btn" onclick="enhancedBrowserV3.deleteDownload(${index})">🗑️</button>
                </div>
            </div>
        `).join('');

        const listHtml = `
            <div class="dropdown-list download-manager ios-style" id="downloadManager">
                <div class="list-header">
                    <span>下载管理</span>
                    <div class="header-actions">
                        <button class="clear-downloads-btn" onclick="enhancedBrowserV3.clearCompletedDownloads()" title="清除已完成">🧹</button>
                        <button class="close-btn" onclick="enhancedBrowserV3.hideAllLists()">✕</button>
                    </div>
                </div>
                <div class="downloads-content">
                    ${downloadsHtml}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', listHtml);
    }

    // 下载管理相关方法
    openDownload(index) {
        this.showToast('打开文件', 'info');
    }

    pauseDownload(index) {
        this.showToast('暂停下载', 'info');
    }

    deleteDownload(index) {
        this.showToast('删除下载', 'info');
    }

    clearCompletedDownloads() {
        this.showToast('清除已完成下载', 'info');
    }

    // 捕获标签页截图
    captureTabScreenshot() {
        const tab = this.getCurrentTab();
        if (!tab) return;

        try {
            const iframe = document.getElementById('browserFrame');
            if (iframe && iframe.contentWindow) {
                // 由于跨域限制，这里使用占位符
                // 实际项目中可以使用服务端截图服务
                tab.screenshot = null;
            }
        } catch (error) {
            console.log('无法捕获截图，跨域限制');
        }
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
        tab.timestamp = Date.now();

        // 添加到历史记录
        const currentHistoryItem = tab.history[tab.historyIndex];
        if (!currentHistoryItem || currentHistoryItem.url !== url) {
            // 如果不在历史记录末尾，删除后面的记录
            if (tab.historyIndex < tab.history.length - 1) {
                tab.history = tab.history.slice(0, tab.historyIndex + 1);
            }

            // 获取页面标题（这里先用URL作为标题，后续可以通过iframe获取真实标题）
            const pageTitle = this.getPageTitle(url) || url;

            tab.history.push({
                url: url,
                title: pageTitle,
                timestamp: Date.now()
            });
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

    // 获取页面标题
    getPageTitle(url) {
        // 简单的标题提取逻辑
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;

            // 常见网站的标题映射
            const titleMap = {
                'baidu.com': '百度',
                'm.baidu.com': '百度',
                'google.com': 'Google',
                'bing.com': 'Bing',
                'taobao.com': '淘宝',
                'tmall.com': '天猫',
                'jd.com': '京东',
                'weibo.com': '微博',
                'zhihu.com': '知乎',
                'bilibili.com': '哔哩哔哩',
                'douyin.com': '抖音',
                'tiktok.com': 'TikTok'
            };

            for (const [key, title] of Object.entries(titleMap)) {
                if (domain.includes(key)) {
                    return title;
                }
            }

            // 如果没有匹配，返回域名
            return domain;
        } catch (e) {
            return url;
        }
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
        const historyItem = tab.history[tab.historyIndex];
        tab.url = historyItem.url;
        tab.title = historyItem.title;
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
        const historyItem = tab.history[tab.historyIndex];
        tab.url = historyItem.url;
        tab.title = historyItem.title;
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

    // 切换收藏状态（优化版本 - 改进提示）
    toggleBookmark() {
        const tab = this.getCurrentTab();
        if (!tab) return;

        const isBookmarked = this.isBookmarked(tab.url);

        if (isBookmarked) {
            this.removeBookmark(tab.url);
            this.showEnhancedToast('已取消收藏', 'removed', '⭐');
        } else {
            this.addBookmark(tab.url, tab.title);
            this.showEnhancedToast('已添加到收藏夹', 'added', '⭐');
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

        if (tab.history.length === 0) {
            this.showModal('浏览历史', '<div class="empty-state">暂无浏览历史</div>');
            return;
        }

        const historyHtml = `
            <div class="history-header">
                <div class="history-search-container">
                    <input type="text" id="historySearchInput" placeholder="搜索历史记录..." class="history-search-input">
                    <button class="history-search-clear" onclick="enhancedBrowserV3.clearHistorySearch()" title="清空搜索">✕</button>
                </div>
                <button class="clear-all-history-btn" onclick="enhancedBrowserV3.clearAllHistory()">
                    <span class="icon">🗑️</span>
                    清空所有历史
                </button>
            </div>
            <div class="history-list" id="historyList">
                ${tab.history.map((item, index) => {
            const isActive = index === tab.historyIndex;
            const timeStr = this.formatHistoryTime(item.timestamp);
            return `
                        <div class="history-item ${isActive ? 'active' : ''}" data-title="${this.escapeHtml(item.title).toLowerCase()}" data-url="${this.escapeHtml(item.url).toLowerCase()}">
                            <div class="history-content" onclick="enhancedBrowserV3.navigateToHistory(${index})">
                                <div class="history-title">${this.escapeHtml(item.title)}</div>
                                <div class="history-url">${this.escapeHtml(item.url)}</div>
                                <div class="history-time">${timeStr}</div>
                            </div>
                            <button class="delete-history-btn" onclick="enhancedBrowserV3.deleteHistoryItem(${index})" title="删除">
                                <span class="icon">❌</span>
                            </button>
                        </div>
                    `;
        }).join('')}
            </div>
        `;

        this.showModal('浏览历史', historyHtml);

        // 设置搜索功能
        setTimeout(() => {
            const searchInput = document.getElementById('historySearchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.filterHistoryItems(e.target.value);
                });
            }
        }, 100);
    }

    // 导航到历史记录
    navigateToHistory(index) {
        const tab = this.getCurrentTab();
        if (!tab) return;

        const historyItem = tab.history[index];
        if (!historyItem) return;

        tab.historyIndex = index;
        tab.url = historyItem.url;
        tab.title = historyItem.title;
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

    // 删除单个历史记录
    deleteHistoryItem(index) {
        const tab = this.getCurrentTab();
        if (!tab || index < 0 || index >= tab.history.length) return;

        // 如果删除的是当前页面之前的记录，需要调整当前索引
        if (index < tab.historyIndex) {
            tab.historyIndex--;
        } else if (index === tab.historyIndex) {
            // 如果删除的是当前页面，跳转到前一个页面（如果存在）
            if (tab.historyIndex > 0) {
                tab.historyIndex--;
                const historyItem = tab.history[tab.historyIndex];
                tab.url = historyItem.url;
                tab.title = historyItem.title;

                const iframe = document.getElementById('browserFrame');
                if (iframe) {
                    iframe.src = tab.url;
                }
                this.updateUrlBar();
                this.updateTabsUI();
            }
        }

        // 删除历史记录
        tab.history.splice(index, 1);

        // 如果历史记录为空，创建一个默认记录
        if (tab.history.length === 0) {
            const defaultUrl = 'https://m.baidu.com';
            tab.history = [{
                url: defaultUrl,
                title: '百度',
                timestamp: Date.now()
            }];
            tab.historyIndex = 0;
            tab.url = defaultUrl;
            tab.title = '百度';

            const iframe = document.getElementById('browserFrame');
            if (iframe) {
                iframe.src = defaultUrl;
            }
            this.updateUrlBar();
            this.updateTabsUI();
        }

        this.updateNavigationButtons();
        this.showEnhancedToast('已删除历史记录', 'success', '✅');

        // 刷新历史记录显示
        this.showHistory();
    }

    // 清空所有历史记录
    clearAllHistory() {
        const tab = this.getCurrentTab();
        if (!tab) return;

        // 确认对话框
        if (!confirm('确定要清空所有浏览历史吗？此操作不可撤销。')) {
            return;
        }

        // 保留当前页面作为唯一的历史记录
        const currentItem = tab.history[tab.historyIndex] || {
            url: tab.url,
            title: tab.title || this.getPageTitle(tab.url),
            timestamp: Date.now()
        };

        tab.history = [currentItem];
        tab.historyIndex = 0;

        this.updateNavigationButtons();
        this.showEnhancedToast('已清空所有历史记录', 'success', '🗑️');

        // 关闭模态框
        this.hideModal();
    }

    // 格式化历史记录时间
    formatHistoryTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const date = new Date(timestamp);

        // 小于1分钟
        if (diff < 60000) {
            return '刚刚';
        }
        // 小于1小时
        else if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes}分钟前`;
        }
        // 小于1天
        else if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}小时前`;
        }
        // 小于7天
        else if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days}天前`;
        }
        // 超过7天，显示具体日期
        else {
            return date.toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    // HTML转义函数
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 过滤历史记录项
    filterHistoryItems(searchTerm) {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        const items = historyList.querySelectorAll('.history-item');
        const term = searchTerm.toLowerCase().trim();

        let visibleCount = 0;

        items.forEach(item => {
            const title = item.dataset.title || '';
            const url = item.dataset.url || '';

            if (term === '' || title.includes(term) || url.includes(term)) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // 如果没有搜索结果，显示提示
        if (visibleCount === 0 && term !== '') {
            this.showNoSearchResults(historyList);
        } else {
            this.hideNoSearchResults(historyList);
        }
    }

    // 显示无搜索结果提示
    showNoSearchResults(container) {
        let noResults = container.querySelector('.no-search-results');
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-search-results';
            noResults.innerHTML = `
                <div class="no-results-icon">🔍</div>
                <div class="no-results-text">未找到匹配的历史记录</div>
            `;
            container.appendChild(noResults);
        }
        noResults.style.display = 'block';
    }

    // 隐藏无搜索结果提示
    hideNoSearchResults(container) {
        const noResults = container.querySelector('.no-search-results');
        if (noResults) {
            noResults.style.display = 'none';
        }
    }

    // 清空历史记录搜索
    clearHistorySearch() {
        const searchInput = document.getElementById('historySearchInput');
        if (searchInput) {
            searchInput.value = '';
            this.filterHistoryItems('');
            searchInput.focus();
        }
    }

    // 更新UI相关方法
    updateUI() {
        this.updateSearchEngineButton();
        this.updateAiModelButton();
        this.updateNavigationButtons();
        this.updateUrlBar();
        this.updateTabsUI();
        this.updateToolbarIcons();
    }

    // 更新工具栏图标为iOS风格
    updateToolbarIcons() {
        const iconMap = {
            'backBtnDemo': '◀️',
            'forwardBtnDemo': '▶️',
            'refreshBtnDemo': '🔄',
            'homeBtnDemo': '🏠',
            'bookmarkBtnDemo': '⭐',
            'bookmarkListBtnDemo': '📚',
            'historyBtnDemo': '🕒',
            'shareBtnDemo': '📤',
            'downloadBtnDemo': '⬇️',
            // 回退到非Demo ID
            'backBtn': '◀️',
            'forwardBtn': '▶️',
            'refreshBtn': '🔄',
            'homeBtn': '🏠',
            'bookmarkBtn': '⭐',
            'bookmarkListBtn': '📚',
            'historyBtn': '🕒',
            'shareBtn': '📤',
            'downloadBtn': '⬇️'
        };

        Object.entries(iconMap).forEach(([id, icon]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.innerHTML = icon;
            }
        });
    }

    updateSearchEngineButton() {
        const btn = document.getElementById('searchEngineBtnDemo') || document.getElementById('searchEngineBtn');
        if (btn) {
            const engine = this.searchEngines[this.currentSearchEngine];
            btn.innerHTML = engine.icon;
            btn.title = `当前搜索引擎: ${engine.name}`;
        }
    }

    updateAiModelButton() {
        const btn = document.getElementById('aiModelBtnDemo') || document.getElementById('aiModelBtn');
        if (btn) {
            const model = this.aiModels[this.currentAiModel];
            btn.innerHTML = model.icon;
            btn.title = `当前AI模型: ${model.name}`;
        }
    }

    updateNavigationButtons() {
        const tab = this.getCurrentTab();
        if (!tab) return;

        const backBtn = document.getElementById('backBtnDemo') || document.getElementById('backBtn');
        const forwardBtn = document.getElementById('forwardBtnDemo') || document.getElementById('forwardBtn');

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

        const bookmarkBtn = document.getElementById('bookmarkBtnDemo') || document.getElementById('bookmarkBtn');
        if (bookmarkBtn) {
            const isBookmarked = this.isBookmarked(tab.url);
            bookmarkBtn.style.color = isBookmarked ? '#FFD700' : '';
            bookmarkBtn.title = isBookmarked ? '取消收藏' : '收藏';
        }
    }

    updateUrlBar() {
        const tab = this.getCurrentTab();
        if (!tab) return;

        const urlInput = document.querySelector('#browser-page-demo .url-input') || document.querySelector('#browser-page .url-input') || document.querySelector('.url-input');
        if (urlInput) {
            urlInput.value = tab.url;
        }
    }

    updateTabsUI() {
        // 更新标签页按钮显示
        const tabsBtn = document.getElementById('tabsBtnDemo') || document.getElementById('tabsBtn');
        if (tabsBtn) {
            tabsBtn.innerHTML = `📄<span class="tab-count">${this.tabs.length}</span>`;
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
        modal.className = 'browser-modal ios-style';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="enhancedBrowserV3.hideModal()">✕</button>
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
        toast.className = `browser-toast ios-style ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 增强的Toast提示
    showEnhancedToast(message, type = 'info', icon = '') {
        const toast = document.createElement('div');
        toast.className = `browser-toast-enhanced ios-style ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                ${icon ? `<span class="toast-icon">${icon}</span>` : ''}
                <span class="toast-message">${message}</span>
            </div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

    // 格式化收藏时间
    formatBookmarkTime(timeString) {
        if (!timeString) return '未知时间';

        const bookmarkTime = new Date(timeString);
        const now = new Date();
        const diffMs = now - bookmarkTime;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                return diffMinutes <= 0 ? '刚刚' : `${diffMinutes}分钟前`;
            }
            return `${diffHours}小时前`;
        } else if (diffDays === 1) {
            return '昨天';
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return bookmarkTime.toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
            });
        }
    }

    // 清空所有收藏
    clearAllBookmarks() {
        if (this.bookmarks.length === 0) return;

        if (confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
            this.bookmarks = [];
            this.saveBookmarks();
            this.updateBookmarkButton();
            this.hideAllLists();
            this.showEnhancedToast('已清空所有收藏', 'info', '🗑️');
        }
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
let enhancedBrowserV3;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    enhancedBrowserV3 = new EnhancedBrowserManagerV3();
    window.enhancedBrowserV3 = enhancedBrowserV3; // 暴露到全局作用域
});