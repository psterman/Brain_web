// 移动端搜索页面Tab功能实现
class MobileSearchTabs {
    constructor() {
        this.currentTab = 'search-engines';
        this.selectedEngines = new Set(['baidu']);
        this.maxEngines = 4;
        this.minEngines = 1;
        
        this.init();
    }

    init() {
        this.setupConfigTabs();
        this.setupEngineCategories();
        this.setupEngineSelection();
        this.setupSearchInput();
        this.loadSavedSettings();
    }

    // 设置配置标签页
    setupConfigTabs() {
        const configTabs = document.querySelectorAll('.config-tab');
        configTabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchConfigTab(tab, index);
            });
        });
    }

    // 切换配置标签页
    switchConfigTab(activeTab, index) {
        // 移除所有活动状态
        document.querySelectorAll('.config-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 添加活动状态
        activeTab.classList.add('active');
        
        // 显示对应内容
        this.showTabContent(index);
        
        // 添加点击效果
        this.addClickEffect(activeTab);
    }

    // 显示标签页内容 - 修复为真正的标签页切换
    showTabContent(tabIndex) {
        // 获取所有标签页内容容器
        const tabContents = document.querySelectorAll('.tab-content');
        
        // 隐藏所有标签页内容
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // 显示对应的标签页内容
        let targetTabId = '';
        switch (tabIndex) {
            case 0: // 搜索引擎
                targetTabId = 'search-engines-tab';
                this.currentTab = 'search-engines';
                break;
            case 1: // 应用选择
                targetTabId = 'app-selection-tab';
                this.currentTab = 'app-selection';
                this.ensureAppSelectionContent();
                break;
            case 2: // AI助手
                targetTabId = 'ai-assistant-tab';
                this.currentTab = 'ai-assistant';
                this.ensureAIAssistantContent();
                break;
        }
        
        // 显示目标标签页
        const targetTab = document.getElementById(targetTabId);
        if (targetTab) {
            targetTab.classList.add('active');
            targetTab.style.display = 'block';
        }
    }

    // 确保应用选择内容存在
    ensureAppSelectionContent() {
        const appSelectionTab = document.getElementById('app-selection-tab');
        if (appSelectionTab && !appSelectionTab.querySelector('.app-selection')) {
            const appSelectionContent = document.createElement('div');
            appSelectionContent.className = 'app-selection';
            appSelectionContent.innerHTML = `
                <div class="section-title">应用选择</div>
                <div class="app-note">选择常用应用进行快速搜索</div>
                
                <div class="app-categories-tabs">
                    <button class="app-category-btn active">社交</button>
                    <button class="app-category-btn">购物</button>
                    <button class="app-category-btn">视频</button>
                    <button class="app-category-btn">工具</button>
                </div>
                
                <div class="app-grid">
                    <div class="app-item selected" data-app="wechat">
                        <div class="app-icon">💬</div>
                        <div class="app-name">微信</div>
                        <div class="app-check">✓</div>
                    </div>
                    <div class="app-item" data-app="weibo">
                        <div class="app-icon">📱</div>
                        <div class="app-name">微博</div>
                        <div class="app-radio">○</div>
                    </div>
                    <div class="app-item" data-app="qq">
                        <div class="app-icon">🐧</div>
                        <div class="app-name">QQ</div>
                        <div class="app-radio">○</div>
                    </div>
                    <div class="app-item" data-app="douyin">
                        <div class="app-icon">🎵</div>
                        <div class="app-name">抖音</div>
                        <div class="app-radio">○</div>
                    </div>
                </div>
                
                <div class="config-note">
                    <span class="note-icon">ℹ️</span>
                    最多选择6个应用，至少保留2个
                </div>
            `;
            appSelectionTab.appendChild(appSelectionContent);
            
            // 设置应用选择事件
            this.setupAppSelection(appSelectionContent);
        }
    }

    // 确保AI助手内容存在
    ensureAIAssistantContent() {
        const aiAssistantTab = document.getElementById('ai-assistant-tab');
        if (aiAssistantTab && !aiAssistantTab.querySelector('.ai-assistant')) {
            const aiAssistantContent = document.createElement('div');
            aiAssistantContent.className = 'ai-assistant';
            aiAssistantContent.innerHTML = `
                <div class="section-title">AI助手</div>
                <div class="ai-note">选择默认AI助手</div>
                
                <div class="ai-grid">
                    <div class="ai-item selected" data-ai="deepseek">
                        <div class="ai-icon">🧠</div>
                        <div class="ai-name">DeepSeek</div>
                        <div class="ai-check">✓</div>
                    </div>
                    <div class="ai-item" data-ai="kimi">
                        <div class="ai-icon">🤖</div>
                        <div class="ai-name">Kimi</div>
                        <div class="ai-radio">○</div>
                    </div>
                    <div class="ai-item" data-ai="zhipu">
                        <div class="ai-icon">💭</div>
                        <div class="ai-name">智谱清言</div>
                        <div class="ai-radio">○</div>
                    </div>
                    <div class="ai-item" data-ai="chatgpt">
                        <div class="ai-icon">💬</div>
                        <div class="ai-name">ChatGPT</div>
                        <div class="ai-radio">○</div>
                    </div>
                </div>
                
                <div class="config-note">
                    <span class="note-icon">ℹ️</span>
                    选择一个默认AI助手
                </div>
            `;
            aiAssistantTab.appendChild(aiAssistantContent);
            
            // 设置AI助手选择事件
            this.setupAISelection(aiAssistantContent);
        }
    }

    // 设置搜索引擎分类
    setupEngineCategories() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchEngineCategory(btn);
            });
        });
    }

    // 切换搜索引擎分类
    switchEngineCategory(activeBtn) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active', 'selected');
        });
        activeBtn.classList.add('active');
        
        // 根据分类显示不同的搜索引擎
        this.loadEnginesByCategory(activeBtn.textContent.trim());
        
        // 添加点击效果
        this.addClickEffect(activeBtn);
    }

    // 根据分类加载搜索引擎
    loadEnginesByCategory(category) {
        const engineGrid = document.querySelector('.engine-grid');
        if (!engineGrid) return;
        
        const engines = this.getEnginesByCategory(category);
        
        engineGrid.innerHTML = engines.map(engine => `
            <div class="engine-item ${this.selectedEngines.has(engine.id) ? 'selected' : ''}" data-engine="${engine.id}">
                <div class="engine-icon ${engine.id}">${engine.icon}</div>
                <div class="engine-name">${engine.name}</div>
                <div class="${this.selectedEngines.has(engine.id) ? 'engine-check' : 'engine-radio'}">
                    ${this.selectedEngines.has(engine.id) ? '✓' : '○'}
                </div>
            </div>
        `).join('');
        
        // 重新设置事件监听
        this.setupEngineSelection();
    }

    // 获取分类对应的搜索引擎
    getEnginesByCategory(category) {
        const allEngines = {
            'AI搜索': [
                { id: 'perplexity', name: 'Perplexity', icon: '🔍' },
                { id: 'you', name: 'You.com', icon: '🤖' },
                { id: 'phind', name: 'Phind', icon: '💡' },
                { id: 'kagi', name: 'Kagi', icon: '🔎' }
            ],
            '专业搜索': [
                { id: 'scholar', name: '谷歌学术', icon: '🎓' },
                { id: 'arxiv', name: 'arXiv', icon: '📚' },
                { id: 'pubmed', name: 'PubMed', icon: '🏥' },
                { id: 'ieee', name: 'IEEE', icon: '⚡' }
            ],
            '国内搜索': [
                { id: 'baidu', name: '百度', icon: '🔍' },
                { id: 'sogou', name: '搜狗', icon: '🐕' },
                { id: 'so360', name: '360搜索', icon: '🔍' },
                { id: 'shenma', name: '神马搜索', icon: '🐎' },
                { id: 'chinaso', name: '中国搜索', icon: '🇨🇳' },
                { id: 'haosou', name: '好搜', icon: '👍' }
            ],
            '国际搜索': [
                { id: 'google', name: 'Google', icon: '🌐' },
                { id: 'bing', name: 'Bing', icon: '🔍' },
                { id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆' },
                { id: 'yahoo', name: 'Yahoo', icon: '📧' }
            ]
        };
        
        return allEngines[category] || allEngines['国内搜索'];
    }

    // 设置搜索引擎选择
    setupEngineSelection() {
        const engineItems = document.querySelectorAll('.engine-item');
        engineItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSearchEngine(item);
            });
        });
    }

    // 切换搜索引擎选择
    toggleSearchEngine(item) {
        const engineId = item.dataset.engine;
        const isSelected = this.selectedEngines.has(engineId);
        
        if (isSelected) {
            // 取消选择
            if (this.selectedEngines.size > this.minEngines) {
                this.selectedEngines.delete(engineId);
                item.classList.remove('selected');
                item.querySelector('.engine-check').className = 'engine-radio';
                item.querySelector('.engine-radio').textContent = '○';
                this.showToast(`已取消选择 ${item.querySelector('.engine-name').textContent}`);
            } else {
                this.showToast(`至少需要保留 ${this.minEngines} 个搜索引擎`);
            }
        } else {
            // 添加选择
            if (this.selectedEngines.size < this.maxEngines) {
                this.selectedEngines.add(engineId);
                item.classList.add('selected');
                item.querySelector('.engine-radio').className = 'engine-check';
                item.querySelector('.engine-check').textContent = '✓';
                this.showToast(`已选择 ${item.querySelector('.engine-name').textContent}`);
            } else {
                this.showToast(`最多只能选择 ${this.maxEngines} 个搜索引擎`);
            }
        }
        
        // 添加点击效果
        this.addClickEffect(item);
        
        // 保存设置
        this.saveSettings();
    }

    // 设置应用选择
    setupAppSelection(container) {
        const appItems = container.querySelectorAll('.app-item');
        const categoryBtns = container.querySelectorAll('.app-category-btn');
        
        appItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAppSelection(item);
            });
        });
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchAppCategory(btn);
            });
        });
    }

    // 设置AI助手选择
    setupAISelection(container) {
        const aiItems = container.querySelectorAll('.ai-item');
        
        aiItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectAIAssistant(item);
            });
        });
    }

    // 切换应用选择
    toggleAppSelection(item) {
        const isSelected = item.classList.contains('selected');
        
        if (isSelected) {
            item.classList.remove('selected');
            item.querySelector('.app-check').className = 'app-radio';
            item.querySelector('.app-radio').textContent = '○';
        } else {
            item.classList.add('selected');
            item.querySelector('.app-radio').className = 'app-check';
            item.querySelector('.app-check').textContent = '✓';
        }
        
        this.addClickEffect(item);
        this.showToast(`${isSelected ? '取消选择' : '已选择'} ${item.querySelector('.app-name').textContent}`);
    }

    // 选择AI助手
    selectAIAssistant(item) {
        // 移除其他选中状态
        document.querySelectorAll('.ai-item').forEach(ai => {
            ai.classList.remove('selected');
            const check = ai.querySelector('.ai-check');
            const radio = ai.querySelector('.ai-radio');
            if (check) {
                check.className = 'ai-radio';
                check.textContent = '○';
            }
        });
        
        // 选中当前项
        item.classList.add('selected');
        item.querySelector('.ai-radio').className = 'ai-check';
        item.querySelector('.ai-check').textContent = '✓';
        
        this.addClickEffect(item);
        this.showToast(`已选择 ${item.querySelector('.ai-name').textContent}`);
    }

    // 设置搜索输入框
    setupSearchInput() {
        const searchInput = document.querySelector('.app-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            searchInput.addEventListener('focus', () => {
                this.showSearchSuggestions();
            });
            
            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideSearchSuggestions(), 200);
            });
        }
    }

    // 处理搜索输入
    handleSearchInput(query) {
        if (query.trim()) {
            this.filterContent(query);
            this.showSearchSuggestions(query);
        } else {
            this.clearFilter();
            this.hideSearchSuggestions();
        }
    }

    // 过滤内容
    filterContent(query) {
        const lowerQuery = query.toLowerCase();
        
        // 过滤搜索引擎
        const engineItems = document.querySelectorAll('.engine-item');
        engineItems.forEach(item => {
            const name = item.querySelector('.engine-name').textContent.toLowerCase();
            item.style.display = name.includes(lowerQuery) ? 'block' : 'none';
        });
        
        // 过滤应用
        const appItems = document.querySelectorAll('.app-item');
        appItems.forEach(item => {
            const name = item.querySelector('.app-name').textContent.toLowerCase();
            item.style.display = name.includes(lowerQuery) ? 'block' : 'none';
        });
    }

    // 清除过滤
    clearFilter() {
        const items = document.querySelectorAll('.engine-item, .app-item, .ai-item');
        items.forEach(item => {
            item.style.display = 'block';
        });
    }

    // 显示搜索建议
    showSearchSuggestions(query = '') {
        // 实现搜索建议功能
        console.log('显示搜索建议:', query);
    }

    // 隐藏搜索建议
    hideSearchSuggestions() {
        // 隐藏搜索建议
        console.log('隐藏搜索建议');
    }

    // 添加点击效果
    addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
    }

    // 显示提示消息
    showToast(message) {
        let toast = document.querySelector('.search-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'search-toast';
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

    // 保存设置
    saveSettings() {
        const settings = {
            selectedEngines: Array.from(this.selectedEngines),
            currentTab: this.currentTab,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('mobileSearchSettings', JSON.stringify(settings));
        } catch (e) {
            console.warn('无法保存搜索设置:', e);
        }
    }

    // 加载保存的设置
    loadSavedSettings() {
        try {
            const saved = localStorage.getItem('mobileSearchSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                if (settings.selectedEngines) {
                    this.selectedEngines = new Set(settings.selectedEngines);
                }
            }
        } catch (e) {
            console.warn('无法加载搜索设置:', e);
        }
    }

    // 重置设置
    resetSettings() {
        this.selectedEngines = new Set(['baidu']);
        this.currentTab = 'search-engines';
        
        // 重新加载界面
        this.loadEnginesByCategory('国内搜索');
        
        // 重置标签页
        document.querySelectorAll('.config-tab').forEach((tab, index) => {
            tab.classList.toggle('active', index === 0);
        });
        
        this.showTabContent(0);
        this.saveSettings();
        this.showToast('设置已重置');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保在搜索页面激活时初始化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const searchPage = document.getElementById('search-page');
                if (searchPage && searchPage.classList.contains('active')) {
                    if (!window.mobileSearchTabs) {
                        window.mobileSearchTabs = new MobileSearchTabs();
                    }
                }
            }
        });
    });
    
    const searchPage = document.getElementById('search-page');
    if (searchPage) {
        observer.observe(searchPage, { attributes: true });
        
        // 如果搜索页面已经是激活状态，立即初始化
        if (searchPage.classList.contains('active')) {
            window.mobileSearchTabs = new MobileSearchTabs();
        }
    }
});

// 导出供外部使用
window.MobileSearchTabs = MobileSearchTabs;