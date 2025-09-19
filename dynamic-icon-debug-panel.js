/**
 * 动态图标调试面板 - 专门监控动态图标抓取系统
 */

class DynamicIconDebugPanel {
    constructor() {
        this.isVisible = false;
        this.stats = {
            totalIcons: 0,
            loadedIcons: 0,
            failedIcons: 0,
            loadingIcons: 0,
            cachedIcons: 0,
            apiCalls: 0
        };
        this.iconDetails = new Map();
        this.apiStats = new Map();
        
        this.init();
    }

    init() {
        // 等待动态图标抓取器加载完成
        if (window.dynamicIconFetcher) {
            this.setupPanel();
        } else {
            // 等待动态图标抓取器加载
            const checkInterval = setInterval(() => {
                if (window.dynamicIconFetcher) {
                    clearInterval(checkInterval);
                    this.setupPanel();
                }
            }, 100);
        }
    }

    setupPanel() {
        this.createPanel();
        this.startMonitoring();
        
        // 监听键盘快捷键 (Ctrl+Shift+D)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });

        console.log('🔍 动态图标调试面板已初始化');
        console.log('💡 使用 Ctrl+Shift+D 打开调试面板');
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'dynamic-icon-debug-panel';
        panel.innerHTML = `
            <div class="debug-panel-header">
                <h3>🎯 动态图标调试面板</h3>
                <div class="debug-panel-controls">
                    <button class="debug-control-btn" onclick="window.dynamicIconDebugPanel.refreshStats()" title="刷新统计">🔄</button>
                    <button class="debug-control-btn" onclick="window.dynamicIconDebugPanel.exportReport()" title="导出报告">📊</button>
                    <button class="debug-close-btn" onclick="window.dynamicIconDebugPanel.hide()">×</button>
                </div>
            </div>
            <div class="debug-panel-content">
                <!-- 统计概览 -->
                <div class="debug-section">
                    <h4>📊 统计概览</h4>
                    <div class="debug-stats-grid">
                        <div class="stat-card">
                            <div class="stat-number" id="total-icons-count">0</div>
                            <div class="stat-label">总图标数</div>
                        </div>
                        <div class="stat-card success">
                            <div class="stat-number" id="loaded-icons-count">0</div>
                            <div class="stat-label">已加载</div>
                        </div>
                        <div class="stat-card warning">
                            <div class="stat-number" id="loading-icons-count">0</div>
                            <div class="stat-label">加载中</div>
                        </div>
                        <div class="stat-card error">
                            <div class="stat-number" id="failed-icons-count">0</div>
                            <div class="stat-label">失败</div>
                        </div>
                        <div class="stat-card info">
                            <div class="stat-number" id="cached-icons-count">0</div>
                            <div class="stat-label">已缓存</div>
                        </div>
                        <div class="stat-card primary">
                            <div class="stat-number" id="api-calls-count">0</div>
                            <div class="stat-label">API调用</div>
                        </div>
                    </div>
                </div>

                <!-- API服务状态 -->
                <div class="debug-section">
                    <h4>🌐 API服务状态</h4>
                    <div class="api-status-container" id="api-status-container">
                        <!-- API状态将在这里动态生成 -->
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="debug-section">
                    <h4>🛠️ 操作工具</h4>
                    <div class="debug-actions">
                        <button class="debug-btn primary" onclick="window.dynamicIconFetcher.refreshAllIcons()">
                            🔄 重新加载所有图标
                        </button>
                        <button class="debug-btn secondary" onclick="window.dynamicIconDebugPanel.clearCache()">
                            🗑️ 清除缓存
                        </button>
                        <button class="debug-btn info" onclick="window.dynamicIconDebugPanel.testAllAPIs()">
                            🧪 测试所有API
                        </button>
                        <button class="debug-btn warning" onclick="window.dynamicIconDebugPanel.showFailedIcons()">
                            ⚠️ 显示失败图标
                        </button>
                    </div>
                </div>

                <!-- 图标详情列表 -->
                <div class="debug-section">
                    <h4>📋 图标详情</h4>
                    <div class="icon-filter-tabs">
                        <button class="filter-tab active" data-filter="all">全部</button>
                        <button class="filter-tab" data-filter="loaded">已加载</button>
                        <button class="filter-tab" data-filter="failed">失败</button>
                        <button class="filter-tab" data-filter="loading">加载中</button>
                    </div>
                    <div class="icon-details-container" id="icon-details-container">
                        <!-- 图标详情将在这里动态生成 -->
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #dynamic-icon-debug-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 450px;
                max-height: 85vh;
                background: white;
                border: 2px solid #e1e5e9;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                z-index: 10001;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                display: none;
                overflow: hidden;
            }

            .debug-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .debug-panel-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .debug-panel-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .debug-control-btn, .debug-close-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
                font-size: 14px;
            }

            .debug-control-btn:hover, .debug-close-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .debug-panel-content {
                padding: 20px;
                max-height: calc(85vh - 80px);
                overflow-y: auto;
            }

            .debug-section {
                margin-bottom: 24px;
            }

            .debug-section h4 {
                margin: 0 0 12px 0;
                font-size: 16px;
                color: #2d3748;
                font-weight: 600;
            }

            .debug-stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin-bottom: 16px;
            }

            .stat-card {
                background: #f8f9fa;
                padding: 16px;
                border-radius: 12px;
                text-align: center;
                border: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .stat-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .stat-card.success { border-color: #28a745; background: #d4edda; }
            .stat-card.warning { border-color: #ffc107; background: #fff3cd; }
            .stat-card.error { border-color: #dc3545; background: #f8d7da; }
            .stat-card.info { border-color: #17a2b8; background: #d1ecf1; }
            .stat-card.primary { border-color: #007bff; background: #d1ecf1; }

            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: #2d3748;
                margin-bottom: 4px;
            }

            .stat-label {
                font-size: 12px;
                color: #6c757d;
                font-weight: 500;
            }

            .api-status-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .api-status-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #6c757d;
            }

            .api-status-item.success { border-left-color: #28a745; }
            .api-status-item.error { border-left-color: #dc3545; }
            .api-status-item.warning { border-left-color: #ffc107; }

            .api-name {
                font-weight: 600;
                color: #2d3748;
            }

            .api-stats {
                font-size: 12px;
                color: #6c757d;
            }

            .debug-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .debug-btn {
                padding: 10px 16px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }

            .debug-btn.primary {
                background: #007bff;
                color: white;
            }

            .debug-btn.primary:hover {
                background: #0056b3;
            }

            .debug-btn.secondary {
                background: #6c757d;
                color: white;
            }

            .debug-btn.secondary:hover {
                background: #545b62;
            }

            .debug-btn.info {
                background: #17a2b8;
                color: white;
            }

            .debug-btn.info:hover {
                background: #117a8b;
            }

            .debug-btn.warning {
                background: #ffc107;
                color: #212529;
            }

            .debug-btn.warning:hover {
                background: #e0a800;
            }

            .icon-filter-tabs {
                display: flex;
                gap: 4px;
                margin-bottom: 12px;
            }

            .filter-tab {
                padding: 6px 12px;
                border: none;
                background: #e9ecef;
                color: #6c757d;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .filter-tab.active {
                background: #007bff;
                color: white;
            }

            .filter-tab:hover:not(.active) {
                background: #dee2e6;
            }

            .icon-details-container {
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #e9ecef;
                border-radius: 8px;
            }

            .icon-detail-item {
                display: flex;
                align-items: center;
                padding: 12px;
                border-bottom: 1px solid #e9ecef;
                transition: background-color 0.2s ease;
            }

            .icon-detail-item:last-child {
                border-bottom: none;
            }

            .icon-detail-item:hover {
                background-color: #f8f9fa;
            }

            .icon-preview {
                width: 32px;
                height: 32px;
                border-radius: 6px;
                margin-right: 12px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                border: 1px solid #e9ecef;
                flex-shrink: 0;
                background-color: #f8f9fa;
            }

            .icon-info {
                flex: 1;
                min-width: 0;
            }

            .icon-name {
                font-weight: 600;
                color: #2d3748;
                font-size: 14px;
                margin-bottom: 2px;
            }

            .icon-status {
                font-size: 12px;
                color: #6c757d;
            }

            .icon-actions {
                display: flex;
                gap: 4px;
            }

            .icon-action-btn {
                width: 24px;
                height: 24px;
                border: none;
                background: #e9ecef;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s ease;
            }

            .icon-action-btn:hover {
                background: #dee2e6;
            }

            .status-success { color: #28a745; }
            .status-error { color: #dc3545; }
            .status-warning { color: #ffc107; }
            .status-info { color: #17a2b8; }

            /* 滚动条样式 */
            .debug-panel-content::-webkit-scrollbar,
            .icon-details-container::-webkit-scrollbar {
                width: 6px;
            }

            .debug-panel-content::-webkit-scrollbar-track,
            .icon-details-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            .debug-panel-content::-webkit-scrollbar-thumb,
            .icon-details-container::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }

            .debug-panel-content::-webkit-scrollbar-thumb:hover,
            .icon-details-container::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(panel);

        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'debug-panel-toggle';
        toggleBtn.innerHTML = '🎯';
        toggleBtn.title = '打开动态图标调试面板 (Ctrl+Shift+D)';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
        `;
        toggleBtn.onclick = () => this.toggle();
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1)';
        });
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'scale(1)';
        });
        document.body.appendChild(toggleBtn);

        this.panel = panel;
        this.toggleBtn = toggleBtn;

        // 设置过滤器事件
        this.setupFilterTabs();
    }

    setupFilterTabs() {
        const filterTabs = this.panel.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.filterIcons(tab.dataset.filter);
            });
        });
    }

    startMonitoring() {
        // 定期更新统计信息
        setInterval(() => {
            if (this.isVisible) {
                this.updateStats();
            }
        }, 1000);

        // 初始更新
        setTimeout(() => this.updateStats(), 500);
    }

    updateStats() {
        if (!window.dynamicIconFetcher) return;

        // 获取动态图标抓取器的统计信息
        const fetcherStats = window.dynamicIconFetcher.getStats();
        
        // 扫描页面上的图标
        this.scanPageIcons();

        // 更新统计显示
        this.updateStatsDisplay();
        this.updateAPIStatus();
        this.updateIconDetails();
    }

    scanPageIcons() {
        const iconSelectors = [
            '.ai-tab-icon',
            '.engine-icon',
            '.search-engine-icon', 
            '.app-icon',
            '.ai-avatar',
            '.phone-tab-icon'
        ];

        const allIcons = document.querySelectorAll(iconSelectors.join(', '));
        this.stats.totalIcons = allIcons.length;

        // 重置计数
        this.stats.loadedIcons = 0;
        this.stats.failedIcons = 0;
        this.stats.loadingIcons = 0;

        this.iconDetails.clear();

        allIcons.forEach((icon, index) => {
            const iconName = this.getIconName(icon);
            const status = this.getIconStatus(icon);
            const iconUrl = icon.getAttribute('data-icon-url') || '';
            
            this.iconDetails.set(`${iconName}-${index}`, {
                element: icon,
                name: iconName,
                status: status,
                url: iconUrl,
                selector: this.getIconSelector(icon)
            });

            // 更新统计
            switch (status) {
                case 'loaded':
                    this.stats.loadedIcons++;
                    break;
                case 'failed':
                    this.stats.failedIcons++;
                    break;
                case 'loading':
                    this.stats.loadingIcons++;
                    break;
            }
        });

        // 获取缓存统计
        if (window.dynamicIconFetcher) {
            const fetcherStats = window.dynamicIconFetcher.getStats();
            this.stats.cachedIcons = fetcherStats.cachedIcons || 0;
        }
    }

    getIconName(element) {
        return element.getAttribute('data-icon-name') || 
               element.dataset.icon || 
               this.extractIconNameFromClass(element) || 
               'unknown';
    }

    extractIconNameFromClass(element) {
        const classList = Array.from(element.classList);
        const knownIcons = [
            'chatgpt', 'deepseek', 'kimi', 'doubao', 'claude', 'zhipu',
            'baidu', 'sogou', 'qihoo360', 'google', 'bing',
            'taobao', 'tmall', 'jd', 'pinduoduo', 'zhihu', 'weibo',
            'qq-music', 'netease-music', 'meituan', 'eleme', 'dianping'
        ];

        for (const iconName of knownIcons) {
            if (classList.includes(iconName)) {
                return iconName;
            }
        }
        return null;
    }

    getIconStatus(element) {
        if (element.classList.contains('icon-loaded')) {
            return 'loaded';
        } else if (element.classList.contains('icon-error')) {
            return 'failed';
        } else if (element.classList.contains('icon-loading')) {
            return 'loading';
        } else {
            const style = window.getComputedStyle(element);
            const backgroundImage = style.backgroundImage;
            if (backgroundImage && backgroundImage !== 'none') {
                return 'loaded';
            } else {
                return 'unknown';
            }
        }
    }

    getIconSelector(element) {
        const classList = Array.from(element.classList);
        return '.' + classList.join('.');
    }

    updateStatsDisplay() {
        document.getElementById('total-icons-count').textContent = this.stats.totalIcons;
        document.getElementById('loaded-icons-count').textContent = this.stats.loadedIcons;
        document.getElementById('loading-icons-count').textContent = this.stats.loadingIcons;
        document.getElementById('failed-icons-count').textContent = this.stats.failedIcons;
        document.getElementById('cached-icons-count').textContent = this.stats.cachedIcons;
        document.getElementById('api-calls-count').textContent = this.stats.apiCalls;
    }

    updateAPIStatus() {
        const container = document.getElementById('api-status-container');
        if (!container || !window.dynamicIconFetcher) return;

        container.innerHTML = '';

        const apis = window.dynamicIconFetcher.iconAPIs || [];
        apis.forEach(api => {
            const item = document.createElement('div');
            item.className = 'api-status-item success'; // 默认成功状态
            
            item.innerHTML = `
                <div>
                    <div class="api-name">${api.name}</div>
                    <div class="api-stats">优先级: ${api.priority}</div>
                </div>
                <div class="api-stats">可用</div>
            `;
            
            container.appendChild(item);
        });
    }

    updateIconDetails() {
        const container = document.getElementById('icon-details-container');
        if (!container) return;

        const activeFilter = this.panel.querySelector('.filter-tab.active').dataset.filter;
        this.renderIconDetails(container, activeFilter);
    }

    renderIconDetails(container, filter = 'all') {
        container.innerHTML = '';

        this.iconDetails.forEach((iconData, key) => {
            if (filter !== 'all' && iconData.status !== filter) {
                return;
            }

            const item = document.createElement('div');
            item.className = 'icon-detail-item';

            const preview = document.createElement('div');
            preview.className = 'icon-preview';
            
            if (iconData.url) {
                preview.style.backgroundImage = `url("${iconData.url}")`;
            } else {
                preview.style.backgroundColor = '#f8f9fa';
                preview.innerHTML = '?';
                preview.style.display = 'flex';
                preview.style.alignItems = 'center';
                preview.style.justifyContent = 'center';
                preview.style.fontSize = '14px';
                preview.style.color = '#6c757d';
            }

            const info = document.createElement('div');
            info.className = 'icon-info';

            const name = document.createElement('div');
            name.className = 'icon-name';
            name.textContent = iconData.name;

            const status = document.createElement('div');
            status.className = `icon-status status-${iconData.status}`;
            status.textContent = `${iconData.status} - ${iconData.selector}`;

            info.appendChild(name);
            info.appendChild(status);

            const actions = document.createElement('div');
            actions.className = 'icon-actions';

            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'icon-action-btn';
            refreshBtn.innerHTML = '🔄';
            refreshBtn.title = '刷新此图标';
            refreshBtn.onclick = () => this.refreshSingleIcon(iconData.name);

            actions.appendChild(refreshBtn);

            item.appendChild(preview);
            item.appendChild(info);
            item.appendChild(actions);

            container.appendChild(item);
        });
    }

    filterIcons(filter) {
        const container = document.getElementById('icon-details-container');
        this.renderIconDetails(container, filter);
    }

    async refreshSingleIcon(iconName) {
        if (window.dynamicIconFetcher && window.dynamicIconFetcher.refreshIcon) {
            await window.dynamicIconFetcher.refreshIcon(iconName);
            this.updateStats();
        }
    }

    async testAllAPIs() {
        console.log('🧪 开始测试所有API...');
        // 这里可以添加API测试逻辑
        alert('API测试功能开发中...');
    }

    clearCache() {
        if (window.dynamicIconFetcher) {
            window.dynamicIconFetcher.cache.clear();
            window.dynamicIconFetcher.failedUrls.clear();
            console.log('🗑️ 缓存已清除');
            this.updateStats();
        }
    }

    showFailedIcons() {
        const failedIcons = Array.from(this.iconDetails.values()).filter(icon => icon.status === 'failed');
        if (failedIcons.length === 0) {
            alert('没有失败的图标！');
            return;
        }

        const failedList = failedIcons.map(icon => `- ${icon.name} (${icon.selector})`).join('\n');
        alert(`失败的图标 (${failedIcons.length}个):\n\n${failedList}`);
    }

    refreshStats() {
        this.updateStats();
        console.log('🔄 统计信息已刷新');
    }

    exportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            stats: this.stats,
            icons: Array.from(this.iconDetails.entries()).map(([key, data]) => ({
                key,
                name: data.name,
                status: data.status,
                url: data.url,
                selector: data.selector
            })),
            fetcherStats: window.dynamicIconFetcher ? window.dynamicIconFetcher.getStats() : null,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dynamic-icon-debug-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📊 调试报告已导出');
    }

    show() {
        this.isVisible = true;
        this.panel.style.display = 'block';
        this.updateStats();
    }

    hide() {
        this.isVisible = false;
        this.panel.style.display = 'none';
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// 创建全局实例
window.dynamicIconDebugPanel = new DynamicIconDebugPanel();

// 控制台帮助信息
console.log('🎯 动态图标调试面板已加载');
console.log('💡 使用 Ctrl+Shift+D 打开调试面板');
console.log('💡 或点击右下角的 🎯 按钮');