// 应用搜索列表组件
class AppSearchList {
    constructor() {
        this.isVisible = false;
        this.selectedApp = null;
        this.searchInput = null;
        this.currentLetter = null;
        this.init();
    }

    init() {
        this.createSearchListModal();
        this.bindEvents();
        this.loadApps();
    }

    // 创建搜索列表模态框
    createSearchListModal() {
        const modal = document.createElement('div');
        modal.className = 'app-search-modal';
        modal.id = 'appSearchModal';
        modal.innerHTML = `
            <div class="search-modal-overlay"></div>
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <h3>查找</h3>
                    <button class="close-search-modal" id="closeSearchModal">×</button>
                </div>
                
                <div class="search-modal-body">
                    <!-- 字母索引 -->
                    <div class="letter-index" id="letterIndex">
                        <!-- 字母索引将在这里动态生成 -->
                    </div>
                    
                    <!-- 应用列表 -->
                    <div class="app-list-container" id="appListContainer">
                        <div class="app-list-scroll" id="appListScroll">
                            <!-- 应用列表将在这里动态生成 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
    }

    // 绑定事件
    bindEvents() {
        // 关闭模态框
        const closeBtn = document.getElementById('closeSearchModal');
        const overlay = this.modal.querySelector('.search-modal-overlay');
        
        closeBtn.addEventListener('click', () => this.hide());
        overlay.addEventListener('click', () => this.hide());

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // 字母索引点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('letter-index-item')) {
                const letter = e.target.dataset.letter;
                this.scrollToLetter(letter);
                this.highlightLetter(letter);
            }
        });

        // 应用项点击事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.app-list-item')) {
                const appItem = e.target.closest('.app-list-item');
                const appKey = appItem.dataset.appKey;
                this.selectApp(appKey);
            }
        });

        // 滚动事件 - 更新当前字母高亮
        const appListScroll = document.getElementById('appListScroll');
        if (appListScroll) {
            appListScroll.addEventListener('scroll', () => {
                this.updateCurrentLetter();
            });
        }
    }

    // 加载应用数据
    loadApps() {
        if (!window.AppSearchDB) {
            console.error('AppSearchDB 未加载');
            return;
        }

        this.renderLetterIndex();
        this.renderAppList();
    }

    // 渲染字母索引
    renderLetterIndex() {
        const letterIndex = document.getElementById('letterIndex');
        const letters = window.AppSearchDB.getAllLetters();
        
        letterIndex.innerHTML = letters.map(letter => `
            <div class="letter-index-item" data-letter="${letter}">
                ${letter}
            </div>
        `).join('');
    }

    // 渲染应用列表
    renderAppList() {
        const appListScroll = document.getElementById('appListScroll');
        const letters = window.AppSearchDB.getAllLetters();
        
        let html = '';
        letters.forEach(letter => {
            const apps = window.AppSearchDB.getAppsByLetter(letter);
            if (apps.length > 0) {
                html += `
                    <div class="letter-section" data-letter="${letter}" id="letter-${letter}">
                        <div class="letter-header">${letter}</div>
                        <div class="letter-apps">
                            ${apps.map(app => this.renderAppItem(app)).join('')}
                        </div>
                    </div>
                `;
            }
        });
        
        appListScroll.innerHTML = html;
    }

    // 渲染单个应用项
    renderAppItem(app) {
        return `
            <div class="app-list-item" data-app-key="${app.key}" data-app-name="${app.name}">
                <div class="app-list-icon" style="background: ${app.gradient};">
                    ${app.icon}
                </div>
                <div class="app-list-info">
                    <div class="app-list-name">${app.name}</div>
                    <div class="app-list-category">${this.getCategoryName(app.category)}</div>
                </div>
                <div class="app-list-arrow">›</div>
            </div>
        `;
    }

    // 获取分类名称
    getCategoryName(category) {
        const categoryNames = {
            'shopping': '购物',
            'social': '社交',
            'video': '视频',
            'music': '音乐',
            'life': '生活',
            'map': '地图',
            'browser': '浏览器',
            'finance': '金融',
            'transport': '出行',
            'news': '新闻'
        };
        return categoryNames[category] || '其他';
    }

    // 滚动到指定字母
    scrollToLetter(letter) {
        const letterSection = document.getElementById(`letter-${letter}`);
        const appListScroll = document.getElementById('appListScroll');
        
        if (letterSection && appListScroll) {
            const offsetTop = letterSection.offsetTop;
            appListScroll.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // 高亮字母
    highlightLetter(letter) {
        // 移除所有高亮
        document.querySelectorAll('.letter-index-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加当前字母高亮
        const letterItem = document.querySelector(`[data-letter="${letter}"]`);
        if (letterItem) {
            letterItem.classList.add('active');
        }
        
        this.currentLetter = letter;
    }

    // 更新当前字母（基于滚动位置）
    updateCurrentLetter() {
        const appListScroll = document.getElementById('appListScroll');
        const letterSections = document.querySelectorAll('.letter-section');
        
        if (!appListScroll || letterSections.length === 0) return;
        
        const scrollTop = appListScroll.scrollTop;
        let currentLetter = null;
        
        letterSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop - 50 && scrollTop < sectionTop + sectionHeight - 50) {
                currentLetter = section.dataset.letter;
            }
        });
        
        if (currentLetter && currentLetter !== this.currentLetter) {
            this.highlightLetter(currentLetter);
        }
    }

    // 选择应用
    selectApp(appKey) {
        const app = window.AppSearchDB.getApp(appKey);
        if (!app) return;

        this.selectedApp = app;
        
        // 更新搜索框中的应用图标
        this.updateSearchIcon(app);
        
        // 处理应用选择
        this.handleAppSelect(app);
    }
    
    // 处理应用选择
    handleAppSelect(appData) {
        // 隐藏模态框
        this.hide();
        
        // 获取当前搜索输入框的内容
        const searchInput = document.getElementById('appSearchInput');
        let keyword = '';
        
        if (searchInput && searchInput.value.trim()) {
            keyword = searchInput.value.trim();
        } else {
            // 如果没有输入关键词，提示用户输入
            this.showToast(`请在搜索框中输入要搜索的内容`);
            if (searchInput) {
                searchInput.focus();
            }
            return;
        }
        
        // 调用现有的搜索功能
         if (window.mobileEnhancedFeatures && typeof window.mobileEnhancedFeatures.performAppSearch === 'function') {
             window.mobileEnhancedFeatures.performAppSearch(appData.id, keyword);
         } else {
             // 备用方案：直接跳转到搜索URL
             this.performDirectSearch(appData, keyword);
         }
        
        // 显示提示
        this.showToast(`正在打开 ${appData.name} 搜索"${keyword}"`);
    }
    
    // 直接搜索的备用方案
    performDirectSearch(appData, keyword) {
        if (appData.searchUrl) {
            const searchUrl = appData.searchUrl.replace('{keyword}', encodeURIComponent(keyword));
            window.open(searchUrl, '_blank');
        } else {
            console.warn('No search URL configured for app:', appData.name);
        }
    }

    // 更新搜索图标
    updateSearchIcon(app) {
        const selectedAppIcon = document.getElementById('selectedAppIcon');
        if (selectedAppIcon) {
            selectedAppIcon.innerHTML = `
                <div class="app-letter" style="background: ${app.gradient}; color: white;">
                    ${app.icon}
                </div>
            `;
            selectedAppIcon.dataset.app = app.key || app.name.toLowerCase();
        }
    }

    // 执行搜索
    performSearch(app, query) {
        if (!app || !query) return;

        const searchUrl = app.appSearchUrl + encodeURIComponent(query);
        
        // 显示搜索提示
        this.showToast(`正在 ${app.name} 中搜索"${query}"...`);
        
        // 尝试打开应用内搜索
        try {
            const link = document.createElement('a');
            link.href = searchUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 延迟后打开网页版作为备选
            setTimeout(() => {
                if (app.searchUrl) {
                    window.open(app.searchUrl + encodeURIComponent(query), '_blank');
                }
            }, 1000);
        } catch (error) {
            console.error('打开应用失败:', error);
            if (app.searchUrl) {
                window.open(app.searchUrl + encodeURIComponent(query), '_blank');
            }
        }
    }

    // 显示提示
    showToast(message) {
        // 移除现有的toast
        const existingToast = document.querySelector('.search-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'search-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => toast.classList.add('show'), 10);

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 显示模态框
    show() {
        this.modal.style.display = 'flex';
        this.isVisible = true;
        
        // 添加显示动画
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
        
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
        
        // 重新加载数据
        this.loadApps();
    }

    // 隐藏模态框
    hide() {
        this.modal.classList.remove('show');
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.isVisible = false;
            
            // 恢复背景滚动
            document.body.style.overflow = '';
        }, 300);
    }

    // 获取选中的应用
    getSelectedApp() {
        return this.selectedApp;
    }
}

// 创建全局实例
window.AppSearchList = new AppSearchList();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppSearchList;
}