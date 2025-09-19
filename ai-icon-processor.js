/**
 * AI图标处理器 - 专门处理AI平台图标的显示问题
 * 与动态图标抓取器配合工作，确保AI图标正确显示
 */

class AIIconProcessor {
    constructor() {
        // AI平台的精确域名映射
        this.aiDomainMappings = {
            'chatgpt': 'chat.openai.com',
            'chatgpt-icon': 'chat.openai.com',
            'deepseek': 'chat.deepseek.com', 
            'deepseek-icon': 'chat.deepseek.com',
            'kimi': 'kimi.moonshot.cn',
            'kimi-icon': 'kimi.moonshot.cn',
            'doubao': 'www.doubao.com',
            'doubao-icon': 'www.doubao.com',
            'claude': 'claude.ai',
            'claude-icon': 'claude.ai',
            'zhipu': 'chatglm.cn',
            'qingyan': 'chatglm.cn'
        };

        // 高质量图标API优先级列表
        this.iconAPIs = [
            {
                name: 'Google Favicon',
                getUrl: (domain, size = 32) => `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
                priority: 1
            },
            {
                name: 'Clearbit Logo',
                getUrl: (domain) => `https://logo.clearbit.com/${domain}`,
                priority: 2
            },
            {
                name: 'Favicon Grabber',
                getUrl: (domain) => `https://favicons.githubusercontent.com/${domain}`,
                priority: 3
            },
            {
                name: 'Icons8',
                getUrl: (domain, size = 32) => `https://img.icons8.com/color/${size}/${this.getIcons8Name(domain)}.png`,
                priority: 4
            }
        ];

        // 缓存已成功加载的图标
        this.iconCache = new Map();
        this.failedUrls = new Set();
        
        this.init();
    }

    // 获取Icons8的图标名称映射
    getIcons8Name(domain) {
        const icons8Map = {
            'chat.openai.com': 'chatgpt',
            'chat.deepseek.com': 'artificial-intelligence',
            'kimi.moonshot.cn': 'robot',
            'www.doubao.com': 'chatbot',
            'claude.ai': 'artificial-intelligence',
            'chatglm.cn': 'artificial-intelligence'
        };
        return icons8Map[domain] || 'artificial-intelligence';
    }

    // 初始化处理器
    init() {
        console.log('🤖 AI图标处理器初始化...');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processAllAIIcons());
        } else {
            this.processAllAIIcons();
        }

        // 监听DOM变化，处理动态添加的AI图标
        this.observeAIIconChanges();
    }

    // 处理所有AI图标
    async processAllAIIcons() {
        console.log('🔍 开始处理AI图标...');
        
        // 查找所有AI图标元素
        const aiIconSelectors = [
            '.ai-platform-icon',
            '.ai-tab-icon', 
            '.chatgpt-icon',
            '.deepseek-icon',
            '.kimi-icon',
            '.doubao-icon',
            '.claude-icon',
            '.ai-avatar'
        ];

        const allAIIcons = [];
        aiIconSelectors.forEach(selector => {
            const icons = document.querySelectorAll(selector);
            allAIIcons.push(...icons);
        });

        console.log(`📊 找到 ${allAIIcons.length} 个AI图标元素`);

        // 处理每个图标
        for (const iconElement of allAIIcons) {
            await this.processAIIcon(iconElement);
        }

        console.log('✅ AI图标处理完成');
    }

    // 处理单个AI图标
    async processAIIcon(iconElement) {
        try {
            // 确定AI平台类型
            const aiType = this.determineAIType(iconElement);
            if (!aiType) {
                console.warn('⚠️ 无法确定AI类型:', iconElement);
                return;
            }

            console.log(`🎯 处理 ${aiType} 图标`);

            // 获取对应的域名
            const domain = this.aiDomainMappings[aiType];
            if (!domain) {
                console.warn(`⚠️ 未找到 ${aiType} 的域名映射`);
                return;
            }

            // 尝试加载图标
            const iconUrl = await this.findWorkingIcon(domain);
            if (iconUrl) {
                this.applyIconToElement(iconElement, iconUrl, aiType);
                console.log(`✅ ${aiType} 图标加载成功:`, iconUrl);
            } else {
                console.error(`❌ ${aiType} 图标加载失败`);
                this.applyFallbackIcon(iconElement, aiType);
            }

        } catch (error) {
            console.error('❌ 处理AI图标时出错:', error);
        }
    }

    // 确定AI类型
    determineAIType(element) {
        const classList = Array.from(element.classList);
        
        // 直接匹配类名
        for (const className of classList) {
            if (this.aiDomainMappings[className]) {
                return className;
            }
        }

        // 检查父元素的类名
        const parent = element.parentElement;
        if (parent) {
            const parentClasses = Array.from(parent.classList);
            for (const className of parentClasses) {
                if (className.includes('chatgpt')) return 'chatgpt';
                if (className.includes('deepseek')) return 'deepseek';
                if (className.includes('kimi')) return 'kimi';
                if (className.includes('doubao')) return 'doubao';
                if (className.includes('claude')) return 'claude';
            }
        }

        // 检查元素的data属性
        const dataType = element.getAttribute('data-ai-type');
        if (dataType && this.aiDomainMappings[dataType]) {
            return dataType;
        }

        return null;
    }

    // 查找可用的图标URL
    async findWorkingIcon(domain) {
        // 检查缓存
        if (this.iconCache.has(domain)) {
            return this.iconCache.get(domain);
        }

        // 按优先级尝试不同的API
        for (const api of this.iconAPIs) {
            const iconUrl = api.getUrl(domain, 32);
            
            // 跳过已知失败的URL
            if (this.failedUrls.has(iconUrl)) {
                continue;
            }

            // 测试图标是否可用
            const isValid = await this.validateIcon(iconUrl);
            if (isValid) {
                this.iconCache.set(domain, iconUrl);
                return iconUrl;
            } else {
                this.failedUrls.add(iconUrl);
            }
        }

        return null;
    }

    // 验证图标是否有效
    validateIcon(url) {
        return new Promise((resolve) => {
            const img = new Image();
            const timeout = setTimeout(() => resolve(false), 5000);

            img.onload = () => {
                clearTimeout(timeout);
                // 检查图片尺寸，过滤无效图标
                if (img.naturalWidth >= 16 && img.naturalHeight >= 16) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };

            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };

            img.src = url;
        });
    }

    // 将图标应用到元素
    applyIconToElement(element, iconUrl, aiType) {
        // 清除现有样式
        element.style.backgroundImage = '';
        element.style.backgroundColor = '';
        
        // 应用新图标
        element.style.backgroundImage = `url("${iconUrl}")`;
        element.style.backgroundSize = 'contain';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'center';
        element.style.width = '32px';
        element.style.height = '32px';
        element.style.display = 'inline-block';
        
        // 清除文本内容（如果有的话）
        if (element.textContent && element.textContent.length <= 2) {
            element.textContent = '';
        }

        // 添加成功标记
        element.classList.add('ai-icon-loaded');
        element.setAttribute('data-icon-url', iconUrl);
        element.setAttribute('data-ai-type', aiType);
    }

    // 应用备用图标
    applyFallbackIcon(element, aiType) {
        // 使用SVG备用图标
        const fallbackSVGs = {
            'chatgpt': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMxMEE1N0EiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDMTEuMzEzNyAyIDEzLjk5OTkgNC42ODYyOSAxMy45OTk5IDhDMTMuOTk5OSAxMS4zMTM3IDExLjMxMzcgMTQgOCAxNEM0LjY4NjI5IDE0IDIgMTEuMzEzNyAyIDhDMiA0LjY4NjI5IDQuNjg2MjkgMiA4IDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+',
            'deepseek': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwMDcwRjMiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJMMTQgOEw4IDE0TDIgOEw4IDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+',
            'kimi': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGRjZBMDAiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDMTEuMzEzNyAyIDEzLjk5OTkgNC42ODYyOSAxMy45OTk5IDhDMTMuOTk5OSAxMS4zMTM3IDExLjMxMzcgMTQgOCAxNEM0LjY4NjI5IDE0IDIgMTEuMzEzNyAyIDhDMiA0LjY4NjI5IDQuNjg2MjkgMiA4IDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+',
            'doubao': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGRjQwODAiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDMTEuMzEzNyAyIDEzLjk5OTkgNC42ODYyOSAxMy45OTk5IDhDMTMuOTk5OSAxMS4zMTM3IDExLjMxMzcgMTQgOCAxNEM0LjY4NjI5IDE0IDIgMTEuMzEzNyAyIDhDMiA0LjY4NjI5IDQuNjg2MjkgMiA4IDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+',
            'claude': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNEOTdBNDEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDMTEuMzEzNyAyIDEzLjk5OTkgNC42ODYyOSAxMy45OTk5IDhDMTMuOTk5OSAxMS4zMTM3IDExLjMxMzcgMTQgOCAxNEM0LjY4NjI5IDE0IDIgMTEuMzEzNyAyIDhDMiA0LjY4NjI5IDQuNjg2MjkgMiA4IDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+'
        };

        const fallbackSVG = fallbackSVGs[aiType] || fallbackSVGs['chatgpt'];
        this.applyIconToElement(element, fallbackSVG, aiType);
        
        console.log(`🔄 ${aiType} 使用备用图标`);
    }

    // 监听DOM变化
    observeAIIconChanges() {
        const observer = new MutationObserver((mutations) => {
            let hasNewAIIcons = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新添加的元素是否包含AI图标
                            const aiIcons = node.querySelectorAll('.ai-platform-icon, .ai-tab-icon, .chatgpt-icon, .deepseek-icon, .kimi-icon, .doubao-icon, .claude-icon');
                            if (aiIcons.length > 0) {
                                hasNewAIIcons = true;
                            }
                        }
                    });
                }
            });

            if (hasNewAIIcons) {
                console.log('🔄 检测到新的AI图标，重新处理...');
                setTimeout(() => this.processAllAIIcons(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 手动刷新所有AI图标
    async refreshAllAIIcons() {
        console.log('🔄 手动刷新所有AI图标...');
        this.iconCache.clear();
        this.failedUrls.clear();
        await this.processAllAIIcons();
    }

    // 获取统计信息
    getStats() {
        return {
            cachedIcons: this.iconCache.size,
            failedUrls: this.failedUrls.size,
            supportedAIPlatforms: Object.keys(this.aiDomainMappings).length
        };
    }
}

// 创建全局实例
window.aiIconProcessor = new AIIconProcessor();

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIIconProcessor;
}

console.log('🤖 AI图标处理器已加载');