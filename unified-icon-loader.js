/**
 * 统一图标加载器 - 智能图标管理系统
 * 处理图标加载失败、备用方案和性能优化
 */

class UnifiedIconLoader {
    constructor() {
        this.iconConfig = {
            deepseek: {
                primary: 'https://www.google.com/s2/favicons?domain=chat.deepseek.com&sz=64',
                fallback: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Ccircle cx="12" cy="12" r="2"/%3E%3Ccircle cx="6" cy="6" r="1.5"/%3E%3Ccircle cx="18" cy="6" r="1.5"/%3E%3Ccircle cx="6" cy="18" r="1.5"/%3E%3Ccircle cx="18" cy="18" r="1.5"/%3E%3Cline x1="7.5" y1="7.5" x2="10" y2="10" stroke="white" stroke-width="1.5"/%3E%3Cline x1="16.5" y1="7.5" x2="14" y2="10" stroke="white" stroke-width="1.5"/%3E%3Cline x1="7.5" y1="16.5" x2="10" y2="14" stroke="white" stroke-width="1.5"/%3E%3Cline x1="16.5" y1="16.5" x2="14" y2="14" stroke="white" stroke-width="1.5"/%3E%3C/svg%3E',
                color: '#1a1a1a'
            },
            kimi: {
                primary: 'https://www.google.com/s2/favicons?domain=kimi.moonshot.cn&sz=64',
                fallback: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z"/%3E%3Ccircle cx="16" cy="8" r="1"/%3E%3Ccircle cx="14" cy="10" r="0.5"/%3E%3C/svg%3E',
                color: '#4a90e2'
            },
            chatgpt: {
                primary: 'https://www.google.com/s2/favicons?domain=chat.openai.com&sz=64',
                fallback: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.078 6.078 0 0 0 6.525 2.9 5.973 5.973 0 0 0 4.233.956 6.066 6.066 0 0 0 6.273-2.035 5.985 5.985 0 0 0 3.997-2.9 6.046 6.046 0 0 0-.743-7.098z"/%3E%3C/svg%3E',
                color: '#10a37f'
            },
            zhipu: {
                primary: 'https://www.google.com/s2/favicons?domain=chatglm.cn&sz=64',
                fallback: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M12 2L13.09 8.26L20 9L13.09 15.74L12 22L10.91 15.74L4 9L10.91 8.26L12 2Z"/%3E%3C/svg%3E',
                color: '#6366f1'
            },
            doubao: {
                primary: 'https://www.google.com/s2/favicons?domain=doubao.com&sz=64',
                fallback: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cellipse cx="12" cy="12" rx="6" ry="9"/%3E%3Cpath d="M12 6C14.761 6 17 8.686 17 12S14.761 18 12 18C9.239 18 7 15.314 7 12S9.239 6 12 6Z"/%3E%3Cellipse cx="12" cy="12" rx="2" ry="4"/%3E%3C/svg%3E',
                color: '#ea580c'
            },
            claude: {
                primary: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64',
                fallback: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Crect x="6" y="4" width="12" height="16" rx="4"/%3E%3Ccircle cx="10" cy="10" r="1.5"/%3E%3Ccircle cx="14" cy="10" r="1.5"/%3E%3Cpath d="M9 14H15C15 15.6569 13.6569 17 12 17C10.3431 17 9 15.6569 9 14Z"/%3E%3C/svg%3E',
                color: '#f59e0b'
            }
        };
        
        this.loadedIcons = new Set();
        this.failedIcons = new Set();
        this.retryCount = new Map();
        this.maxRetries = 2;
        
        this.init();
    }
    
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAllIcons());
        } else {
            this.loadAllIcons();
        }
        
        // 监听新元素添加
        this.observeNewElements();
    }
    
    loadAllIcons() {
        // 查找所有图标元素
        const iconSelectors = [
            '.ai-avatar',
            '.ai-platform-icon',
            '.ai-tab-icon',
            '.phone-tab-icon',
            '.app-icon',
            '.engine-icon'
        ];
        
        iconSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => this.processIconElement(element));
        });
    }
    
    processIconElement(element) {
        // 清理元素内容
        this.cleanElement(element);
        
        // 识别图标类型
        const iconType = this.identifyIconType(element);
        if (!iconType) return;
        
        // 设置加载状态
        element.classList.add('loading');
        
        // 加载图标
        this.loadIcon(element, iconType);
    }
    
    cleanElement(element) {
        // 清除所有内部内容
        element.innerHTML = '';
        element.textContent = '';
        
        // 移除可能的内联样式
        const inlineStyle = element.getAttribute('style');
        if (inlineStyle && inlineStyle.includes('background-image')) {
            element.removeAttribute('style');
        }
        
        // 清除可能的data属性
        Object.keys(element.dataset).forEach(key => {
            if (key.includes('icon') || key.includes('image')) {
                delete element.dataset[key];
            }
        });
    }
    
    identifyIconType(element) {
        const classList = Array.from(element.classList);
        
        // 检查类名中的图标类型
        for (const className of classList) {
            if (className.includes('deepseek')) return 'deepseek';
            if (className.includes('kimi')) return 'kimi';
            if (className.includes('chatgpt')) return 'chatgpt';
            if (className.includes('zhipu')) return 'zhipu';
            if (className.includes('doubao')) return 'doubao';
            if (className.includes('claude')) return 'claude';
        }
        
        // 检查data属性
        const dataType = element.dataset.iconType || element.dataset.platform;
        if (dataType && this.iconConfig[dataType.toLowerCase()]) {
            return dataType.toLowerCase();
        }
        
        // 检查文本内容
        const text = element.textContent.toLowerCase();
        if (text.includes('deepseek')) return 'deepseek';
        if (text.includes('kimi')) return 'kimi';
        if (text.includes('chatgpt') || text.includes('gpt')) return 'chatgpt';
        if (text.includes('智谱') || text.includes('zhipu')) return 'zhipu';
        if (text.includes('豆包') || text.includes('doubao')) return 'doubao';
        if (text.includes('claude')) return 'claude';
        
        return null;
    }
    
    async loadIcon(element, iconType) {
        const config = this.iconConfig[iconType];
        if (!config) {
            this.setErrorState(element);
            return;
        }
        
        // 设置背景色
        element.style.backgroundColor = config.color;
        
        // 尝试加载主要图标
        try {
            const success = await this.testImageLoad(config.primary);
            if (success) {
                this.setIconSuccess(element, config.primary);
                return;
            }
        } catch (error) {
            console.warn(`Failed to load primary icon for ${iconType}:`, error);
        }
        
        // 使用备用图标
        this.setIconSuccess(element, config.fallback);
    }
    
    testImageLoad(url) {
        return new Promise((resolve) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                resolve(false);
            }, 3000); // 3秒超时
            
            img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            img.src = url;
        });
    }
    
    setIconSuccess(element, imageUrl) {
        element.style.backgroundImage = `url("${imageUrl}")`;
        element.classList.remove('loading', 'error');
        element.classList.add('loaded');
        
        // 添加到成功加载列表
        this.loadedIcons.add(element);
    }
    
    setErrorState(element) {
        element.classList.remove('loading');
        element.classList.add('error');
        element.style.backgroundColor = '#ef4444';
        
        // 添加到失败列表
        this.failedIcons.add(element);
    }
    
    observeNewElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查新添加的元素是否是图标
                        const iconSelectors = [
                            '.ai-avatar',
                            '.ai-platform-icon',
                            '.ai-tab-icon',
                            '.phone-tab-icon',
                            '.app-icon',
                            '.engine-icon'
                        ];
                        
                        iconSelectors.forEach(selector => {
                            if (node.matches && node.matches(selector)) {
                                this.processIconElement(node);
                            }
                            
                            // 检查子元素
                            const childIcons = node.querySelectorAll && node.querySelectorAll(selector);
                            if (childIcons) {
                                childIcons.forEach(child => this.processIconElement(child));
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 公共方法：重新加载失败的图标
    retryFailedIcons() {
        this.failedIcons.forEach(element => {
            const iconType = this.identifyIconType(element);
            if (iconType) {
                element.classList.remove('error');
                this.loadIcon(element, iconType);
            }
        });
        this.failedIcons.clear();
    }
    
    // 公共方法：获取加载统计
    getLoadStats() {
        return {
            loaded: this.loadedIcons.size,
            failed: this.failedIcons.size,
            total: this.loadedIcons.size + this.failedIcons.size
        };
    }
    
    // 公共方法：强制刷新所有图标
    refreshAllIcons() {
        this.loadedIcons.clear();
        this.failedIcons.clear();
        this.retryCount.clear();
        this.loadAllIcons();
    }
}

// 创建全局实例
window.unifiedIconLoader = new UnifiedIconLoader();

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedIconLoader;
}