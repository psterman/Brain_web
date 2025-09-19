/**
 * 最终图标验证器 - 确保DeepSeek和豆包logo正确显示
 * 提供实时监控、自动修复和调试功能
 */

class FinalIconValidator {
    constructor() {
        this.targetPlatforms = {
            'deepseek': {
                name: 'DeepSeek',
                officialSources: [
                    'https://chat.deepseek.com/favicon.ico',
                    'https://www.deepseek.com/favicon.ico',
                    'https://www.google.com/s2/favicons?domain=chat.deepseek.com&sz=64',
                    'https://logo.clearbit.com/deepseek.com'
                ],
                fallbackSVG: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZGVlcHNlZWtHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDcwRjMiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDA1MEIzIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9InVybCgjZGVlcHNlZWtHcmFkaWVudCkiLz4KPHBhdGggZD0iTTMyIDEyTDUyIDMyTDMyIDUyTDEyIDMyTDMyIDEyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTMyIDE4TDQ2IDMyTDMyIDQ2TDE4IDMyTDMyIDE4WiIgZmlsbD0idXJsKCNkZWVwc2Vla0dyYWRpZW50KSIvPgo8L3N2Zz4=',
                brandColor: '#0070F3',
                identifiers: ['deepseek', 'DeepSeek', 'K'] // K是错误显示的字母
            },
            'doubao': {
                name: '豆包',
                officialSources: [
                    'https://www.doubao.com/favicon.ico',
                    'https://doubao.com/favicon.ico',
                    'https://www.google.com/s2/favicons?domain=www.doubao.com&sz=64',
                    'https://www.google.com/s2/favicons?domain=doubao.com&sz=64'
                ],
                fallbackSVG: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZG91YmFvR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkY0MDgwIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGMjA2MCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjE2IiBmaWxsPSJ1cmwoI2RvdWJhb0dyYWRpZW50KSIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjI0IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjAgNDBRMzIgNTIgNDQgNDBRMzIgNDggMjAgNDBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
                brandColor: '#FF4080',
                identifiers: ['doubao', '豆包', 'Doubao']
            }
        };

        this.validatedIcons = new Map();
        this.monitoringInterval = null;
        this.stats = {
            totalChecks: 0,
            successfulFixes: 0,
            failedFixes: 0,
            lastCheckTime: null
        };

        this.init();
    }

    init() {
        console.log('🔍 最终图标验证器初始化...');
        
        // 等待DOM完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startValidation());
        } else {
            this.startValidation();
        }

        // 添加快捷键支持
        this.addKeyboardShortcuts();
    }

    async startValidation() {
        console.log('🚀 开始图标验证和修复...');
        
        // 立即执行一次验证
        await this.validateAndFixIcons();
        
        // 启动持续监控
        this.startMonitoring();
        
        // 监听DOM变化
        this.observeDOMChanges();
    }

    async validateAndFixIcons() {
        this.stats.totalChecks++;
        this.stats.lastCheckTime = new Date().toLocaleTimeString();
        
        console.log(`🔍 第 ${this.stats.totalChecks} 次图标验证开始...`);
        
        // 查找所有可能的图标元素
        const iconElements = this.findAllIconElements();
        console.log(`📊 找到 ${iconElements.length} 个图标元素`);
        
        let fixedCount = 0;
        
        for (const element of iconElements) {
            const platform = this.identifyPlatform(element);
            if (platform && (platform === 'deepseek' || platform === 'doubao')) {
                const wasFixed = await this.validateAndFixSingleIcon(element, platform);
                if (wasFixed) {
                    fixedCount++;
                    this.stats.successfulFixes++;
                } else {
                    this.stats.failedFixes++;
                }
            }
        }
        
        console.log(`✅ 验证完成，修复了 ${fixedCount} 个图标`);
        this.updateDebugInfo();
    }

    findAllIconElements() {
        const selectors = [
            // AI平台图标选择器
            '.ai-platform-icon',
            '.ai-tab-icon',
            '.ai-avatar',
            // 特定平台选择器
            '.deepseek-icon',
            '.doubao-icon',
            '[data-ai-type="deepseek"]',
            '[data-ai-type="doubao"]',
            // 通配符选择器
            '[class*="deepseek"]',
            '[class*="doubao"]',
            // 可能的其他选择器
            '.chat-avatar',
            '.platform-icon'
        ];

        const elements = new Set();
        
        selectors.forEach(selector => {
            try {
                const found = document.querySelectorAll(selector);
                found.forEach(el => elements.add(el));
            } catch (e) {
                console.warn('选择器错误:', selector, e);
            }
        });

        return Array.from(elements);
    }

    identifyPlatform(element) {
        // 检查类名
        const classList = Array.from(element.classList).join(' ').toLowerCase();
        
        // 检查文本内容
        const textContent = element.textContent?.trim().toLowerCase() || '';
        
        // 检查data属性
        const dataType = element.getAttribute('data-ai-type')?.toLowerCase() || '';
        
        // 检查父元素
        const parentClass = element.parentElement?.className?.toLowerCase() || '';
        
        // 组合所有信息进行判断
        const allInfo = `${classList} ${textContent} ${dataType} ${parentClass}`;
        
        // DeepSeek识别
        if (allInfo.includes('deepseek') || textContent === 'k' || textContent === 'K') {
            return 'deepseek';
        }
        
        // 豆包识别
        if (allInfo.includes('doubao') || allInfo.includes('豆包')) {
            return 'doubao';
        }
        
        return null;
    }

    async validateAndFixSingleIcon(element, platform) {
        console.log(`🎯 验证 ${platform} 图标...`);
        
        // 检查当前图标是否正确
        const isCurrentlyCorrect = await this.isIconCorrect(element, platform);
        
        if (isCurrentlyCorrect) {
            console.log(`✅ ${platform} 图标已正确显示`);
            return false; // 不需要修复
        }
        
        console.log(`🔧 修复 ${platform} 图标...`);
        
        // 获取最佳图标URL
        const iconUrl = await this.getBestIconUrl(platform);
        
        if (iconUrl) {
            this.applyIconFix(element, iconUrl, platform);
            console.log(`✅ ${platform} 图标修复成功`);
            return true;
        } else {
            console.error(`❌ ${platform} 图标修复失败`);
            return false;
        }
    }

    async isIconCorrect(element, platform) {
        // 检查是否显示为文字
        const hasText = element.textContent && element.textContent.trim().length > 0;
        if (hasText && (element.textContent.trim() === 'K' || element.textContent.trim().length <= 2)) {
            return false; // 显示为字母，不正确
        }
        
        // 检查背景图片
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (!bgImage || bgImage === 'none') {
            return false; // 没有背景图片，不正确
        }
        
        // 检查是否有正确的图标标记
        const hasCorrectMarker = element.hasAttribute('data-icon-validated') && 
                                element.getAttribute('data-platform') === platform;
        
        return hasCorrectMarker;
    }

    async getBestIconUrl(platform) {
        const config = this.targetPlatforms[platform];
        if (!config) return null;
        
        // 检查缓存
        if (this.validatedIcons.has(platform)) {
            const cached = this.validatedIcons.get(platform);
            if (Date.now() - cached.timestamp < 300000) { // 5分钟缓存
                return cached.url;
            }
        }
        
        // 尝试官方源
        for (const source of config.officialSources) {
            const isValid = await this.validateIconUrl(source);
            if (isValid) {
                this.validatedIcons.set(platform, {
                    url: source,
                    timestamp: Date.now()
                });
                return source;
            }
        }
        
        // 使用备用SVG
        console.log(`🔄 ${platform} 使用备用SVG图标`);
        return config.fallbackSVG;
    }

    async validateIconUrl(url) {
        return new Promise((resolve) => {
            if (url.startsWith('data:')) {
                resolve(true);
                return;
            }
            
            const img = new Image();
            const timeout = setTimeout(() => resolve(false), 10000);
            
            img.onload = () => {
                clearTimeout(timeout);
                const isValid = img.naturalWidth >= 16 && img.naturalHeight >= 16;
                resolve(isValid);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            img.src = url;
        });
    }

    applyIconFix(element, iconUrl, platform) {
        const config = this.targetPlatforms[platform];
        
        // 清除所有现有内容和样式
        element.innerHTML = '';
        element.textContent = '';
        
        // 应用新的图标样式
        Object.assign(element.style, {
            backgroundImage: `url("${iconUrl}")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            display: 'inline-block',
            borderRadius: '6px',
            border: `2px solid ${config.brandColor}20`,
            boxShadow: `0 2px 8px ${config.brandColor}30`,
            transition: 'all 0.3s ease',
            // 确保没有文字显示
            fontSize: '0',
            textIndent: '-9999px',
            overflow: 'hidden',
            color: 'transparent',
            // 防止被覆盖
            backgroundClip: 'padding-box',
            position: 'relative'
        });
        
        // 添加验证标记
        element.setAttribute('data-icon-validated', 'true');
        element.setAttribute('data-platform', platform);
        element.setAttribute('data-icon-url', iconUrl);
        element.setAttribute('title', config.name);
        element.classList.add('icon-validated');
        
        // 添加hover效果
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
            element.style.boxShadow = `0 4px 16px ${config.brandColor}50`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = `0 2px 8px ${config.brandColor}30`;
        });
    }

    startMonitoring() {
        // 每30秒检查一次
        this.monitoringInterval = setInterval(() => {
            this.validateAndFixIcons();
        }, 30000);
        
        console.log('🔄 启动持续监控 (每30秒检查一次)');
    }

    observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            let needsCheck = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const hasTargetIcons = node.querySelectorAll('[class*="deepseek"], [class*="doubao"], .ai-platform-icon, .ai-tab-icon').length > 0;
                            if (hasTargetIcons) {
                                needsCheck = true;
                            }
                        }
                    });
                }
            });
            
            if (needsCheck) {
                console.log('🔄 检测到DOM变化，重新验证图标...');
                setTimeout(() => this.validateAndFixIcons(), 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+V: 手动验证图标
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                console.log('🔍 手动触发图标验证...');
                this.validateAndFixIcons();
            }
            
            // Ctrl+Shift+I: 显示图标统计
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.showStats();
            }
            
            // Ctrl+Shift+D: 切换调试模式
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDebugMode();
            }
        });
    }

    showStats() {
        const stats = {
            ...this.stats,
            validatedIcons: this.validatedIcons.size,
            monitoringActive: !!this.monitoringInterval
        };
        
        console.table(stats);
        
        // 在页面上显示统计信息
        this.showStatsModal(stats);
    }

    showStatsModal(stats) {
        // 创建统计信息模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: monospace;
            max-width: 400px;
        `;
        
        modal.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">图标验证统计</h3>
            <p><strong>总检查次数:</strong> ${stats.totalChecks}</p>
            <p><strong>成功修复:</strong> ${stats.successfulFixes}</p>
            <p><strong>修复失败:</strong> ${stats.failedFixes}</p>
            <p><strong>缓存图标:</strong> ${stats.validatedIcons}</p>
            <p><strong>监控状态:</strong> ${stats.monitoringActive ? '运行中' : '已停止'}</p>
            <p><strong>最后检查:</strong> ${stats.lastCheckTime || '未检查'}</p>
            <button onclick="this.parentElement.remove()" style="
                background: #0070F3;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">关闭</button>
        `;
        
        document.body.appendChild(modal);
        
        // 3秒后自动关闭
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 5000);
    }

    toggleDebugMode() {
        document.body.classList.toggle('debug-icons');
        const isDebug = document.body.classList.contains('debug-icons');
        console.log(`🐛 调试模式: ${isDebug ? '开启' : '关闭'}`);
    }

    updateDebugInfo() {
        // 在控制台输出调试信息
        const debugInfo = {
            timestamp: new Date().toLocaleString(),
            stats: this.stats,
            validatedPlatforms: Array.from(this.validatedIcons.keys()),
            currentIcons: this.findAllIconElements().length
        };
        
        console.log('🐛 调试信息:', debugInfo);
    }

    // 手动刷新方法
    async refresh() {
        console.log('🔄 手动刷新图标验证器...');
        this.validatedIcons.clear();
        await this.validateAndFixIcons();
    }

    // 停止监控
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            console.log('⏹️ 停止图标监控');
        }
    }

    // 获取详细统计
    getDetailedStats() {
        return {
            ...this.stats,
            validatedIcons: this.validatedIcons.size,
            monitoringActive: !!this.monitoringInterval,
            supportedPlatforms: Object.keys(this.targetPlatforms),
            currentIconElements: this.findAllIconElements().length
        };
    }
}

// 创建全局实例
window.finalIconValidator = new FinalIconValidator();

console.log('🔍 最终图标验证器已加载');
console.log('💡 快捷键:');
console.log('  Ctrl+Shift+V: 手动验证图标');
console.log('  Ctrl+Shift+I: 显示统计信息');
console.log('  Ctrl+Shift+D: 切换调试模式');