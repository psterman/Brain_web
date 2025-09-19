/**
 * 图标调试面板 - 监控图标加载状态
 */

class IconDebugPanel {
    constructor() {
        this.isVisible = false;
        this.stats = {
            totalIcons: 0,
            loadedIcons: 0,
            failedIcons: 0,
            loadingIcons: 0
        };
        this.iconStatus = new Map();
        
        this.init();
    }

    init() {
        // 创建调试面板
        this.createPanel();
        
        // 监听键盘快捷键 (Ctrl+Shift+I)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.toggle();
            }
        });

        // 定期更新统计信息
        setInterval(() => {
            this.updateStats();
        }, 1000);

        // 监听图标加载事件
        this.observeIconChanges();
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'icon-debug-panel';
        panel.innerHTML = `
            <div class="debug-panel-header">
                <h3>🔍 图标调试面板</h3>
                <button class="debug-close-btn" onclick="window.iconDebugPanel.hide()">×</button>
            </div>
            <div class="debug-panel-content">
                <div class="debug-stats">
                    <div class="stat-item">
                        <span class="stat-label">总图标数:</span>
                        <span class="stat-value" id="total-icons">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">已加载:</span>
                        <span class="stat-value success" id="loaded-icons">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">加载中:</span>
                        <span class="stat-value warning" id="loading-icons">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">加载失败:</span>
                        <span class="stat-value error" id="failed-icons">0</span>
                    </div>
                </div>
                
                <div class="debug-actions">
                    <button class="debug-btn" onclick="window.iconDebugPanel.reloadAllIcons()">🔄 重新加载所有图标</button>
                    <button class="debug-btn" onclick="window.iconDebugPanel.clearCache()">🗑️ 清除缓存</button>
                    <button class="debug-btn" onclick="window.iconDebugPanel.exportReport()">📊 导出报告</button>
                </div>
                
                <div class="debug-icon-list">
                    <h4>图标状态详情:</h4>
                    <div class="icon-list-container" id="icon-list-container">
                        <!-- 图标状态列表将在这里动态生成 -->
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #icon-debug-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                background: white;
                border: 2px solid #e1e5e9;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                display: none;
                overflow: hidden;
            }

            .debug-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .debug-panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .debug-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s;
            }

            .debug-close-btn:hover {
                background-color: rgba(255,255,255,0.2);
            }

            .debug-panel-content {
                padding: 16px;
                max-height: calc(80vh - 60px);
                overflow-y: auto;
            }

            .debug-stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }

            .stat-item {
                background: #f8f9fa;
                padding: 8px 12px;
                border-radius: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .stat-label {
                font-weight: 500;
                color: #495057;
            }

            .stat-value {
                font-weight: 600;
                font-size: 16px;
            }

            .stat-value.success { color: #28a745; }
            .stat-value.warning { color: #ffc107; }
            .stat-value.error { color: #dc3545; }

            .debug-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 16px;
            }

            .debug-btn {
                background: #007bff;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s;
            }

            .debug-btn:hover {
                background: #0056b3;
            }

            .debug-icon-list h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #495057;
            }

            .icon-list-container {
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #e9ecef;
                border-radius: 6px;
            }

            .icon-item {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                border-bottom: 1px solid #e9ecef;
                font-size: 12px;
            }

            .icon-item:last-child {
                border-bottom: none;
            }

            .icon-preview {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                margin-right: 8px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                border: 1px solid #e9ecef;
                flex-shrink: 0;
            }

            .icon-info {
                flex: 1;
                min-width: 0;
            }

            .icon-name {
                font-weight: 500;
                color: #212529;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .icon-status {
                color: #6c757d;
                font-size: 11px;
            }

            .icon-status.success { color: #28a745; }
            .icon-status.warning { color: #ffc107; }
            .icon-status.error { color: #dc3545; }

            .debug-panel-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #007bff;
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,123,255,0.3);
                transition: all 0.3s ease;
            }

            .debug-panel-toggle:hover {
                background: #0056b3;
                transform: scale(1.1);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(panel);

        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'debug-panel-toggle';
        toggleBtn.innerHTML = '🔍';
        toggleBtn.title = '打开图标调试面板 (Ctrl+Shift+I)';
        toggleBtn.onclick = () => this.toggle();
        document.body.appendChild(toggleBtn);

        this.panel = panel;
        this.toggleBtn = toggleBtn;
    }

    observeIconChanges() {
        // 监听DOM变化
        const observer = new MutationObserver(() => {
            setTimeout(() => this.scanIcons(), 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // 初始扫描
        setTimeout(() => this.scanIcons(), 1000);
    }

    scanIcons() {
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

        allIcons.forEach((icon, index) => {
            const iconName = this.getIconName(icon);
            const status = this.getIconStatus(icon);
            
            this.iconStatus.set(`${iconName}-${index}`, {
                element: icon,
                name: iconName,
                status: status,
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
    }

    getIconName(element) {
        const classList = Array.from(element.classList);
        
        // 尝试从类名中提取图标名称
        const iconNames = [
            'chatgpt', 'deepseek', 'kimi', 'doubao', 'claude', 'zhipu',
            'baidu', 'sogou', 'qihoo360', 'google', 'bing',
            'taobao', 'tmall', 'jd', 'pinduoduo', 'zhihu', 'weibo',
            'qq-music', 'netease-music', 'meituan', 'eleme', 'dianping'
        ];

        for (const name of iconNames) {
            if (classList.includes(name)) {
                return name;
            }
        }

        return element.dataset.icon || element.dataset.iconName || 'unknown';
    }

    getIconSelector(element) {
        const classList = Array.from(element.classList);
        return '.' + classList.join('.');
    }

    getIconStatus(element) {
        const style = window.getComputedStyle(element);
        const backgroundImage = style.backgroundImage;

        if (element.classList.contains('icon-loaded')) {
            return 'loaded';
        } else if (element.classList.contains('icon-error')) {
            return 'failed';
        } else if (element.classList.contains('icon-loading')) {
            return 'loading';
        } else if (backgroundImage && backgroundImage !== 'none') {
            return 'loaded';
        } else {
            return 'unknown';
        }
    }

    updateStats() {
        if (!this.isVisible) return;

        this.scanIcons();

        // 更新统计显示
        document.getElementById('total-icons').textContent = this.stats.totalIcons;
        document.getElementById('loaded-icons').textContent = this.stats.loadedIcons;
        document.getElementById('loading-icons').textContent = this.stats.loadingIcons;
        document.getElementById('failed-icons').textContent = this.stats.failedIcons;

        // 更新图标列表
        this.updateIconList();
    }

    updateIconList() {
        const container = document.getElementById('icon-list-container');
        if (!container) return;

        container.innerHTML = '';

        this.iconStatus.forEach((iconData, key) => {
            const item = document.createElement('div');
            item.className = 'icon-item';

            const preview = document.createElement('div');
            preview.className = 'icon-preview';
            
            const style = window.getComputedStyle(iconData.element);
            if (style.backgroundImage && style.backgroundImage !== 'none') {
                preview.style.backgroundImage = style.backgroundImage;
            } else {
                preview.style.backgroundColor = '#f8f9fa';
                preview.innerHTML = '?';
                preview.style.display = 'flex';
                preview.style.alignItems = 'center';
                preview.style.justifyContent = 'center';
                preview.style.fontSize = '12px';
                preview.style.color = '#6c757d';
            }

            const info = document.createElement('div');
            info.className = 'icon-info';

            const name = document.createElement('div');
            name.className = 'icon-name';
            name.textContent = iconData.name;

            const status = document.createElement('div');
            status.className = `icon-status ${iconData.status}`;
            status.textContent = `${iconData.status} - ${iconData.selector}`;

            info.appendChild(name);
            info.appendChild(status);

            item.appendChild(preview);
            item.appendChild(info);

            container.appendChild(item);
        });
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

    reloadAllIcons() {
        if (window.smartIconLoader) {
            window.smartIconLoader.reloadAllIcons();
            console.log('🔄 重新加载所有图标');
        } else {
            console.warn('⚠️ 智能图标加载器未找到');
        }
    }

    clearCache() {
        if (window.smartIconLoader) {
            window.smartIconLoader.loadedIcons.clear();
            window.smartIconLoader.failedSources.clear();
            console.log('🗑️ 图标缓存已清除');
        }
        
        // 清除浏览器缓存中的图标
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('icon')) {
                        caches.delete(name);
                    }
                });
            });
        }
    }

    exportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            stats: this.stats,
            icons: Array.from(this.iconStatus.entries()).map(([key, data]) => ({
                key,
                name: data.name,
                status: data.status,
                selector: data.selector
            })),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `icon-debug-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📊 调试报告已导出');
    }
}

// 创建全局实例
window.iconDebugPanel = new IconDebugPanel();

// 在控制台中提供快捷方法
console.log('🔍 图标调试面板已加载');
console.log('💡 使用 Ctrl+Shift+I 打开调试面板');
console.log('💡 或点击右下角的调试按钮');
console.log('💡 控制台命令: window.iconDebugPanel.show()');