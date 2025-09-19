/**
 * 搜索引擎图标处理器 - 专门处理搜索引擎图标显示问题
 * 解决图标上有文字、显示不正确等问题
 */

class SearchEngineIconProcessor {
    constructor() {
        // 搜索引擎精确域名映射
        this.searchEngineMappings = {
            'baidu': 'www.baidu.com',
            'sogou': 'www.sogou.com', 
            'qihoo360': 'www.so.com',
            '360': 'www.so.com',
            'google': 'www.google.com',
            'bing': 'www.bing.com',
            'yahoo': 'www.yahoo.com',
            'duckduckgo': 'duckduckgo.com',
            'yandex': 'yandex.com'
        };

        // 专门的搜索引擎图标API
        this.searchIconAPIs = [
            {
                name: 'Google Favicon High Quality',
                getUrl: (domain, size = 32) => `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
                priority: 1
            },
            {
                name: 'Clearbit Logo',
                getUrl: (domain) => `https://logo.clearbit.com/${domain}`,
                priority: 2
            },
            {
                name: 'Favicon Kit',
                getUrl: (domain) => `https://api.faviconkit.com/${domain}/32`,
                priority: 3
            },
            {
                name: 'Icons8 Search Engines',
                getUrl: (domain) => this.getIcons8SearchUrl(domain),
                priority: 4
            }
        ];

        // 高质量SVG备用图标
        this.fallbackSVGs = {
            'baidu': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMyMzE5RkYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMCAyQzE0LjQxODMgMiAxOCA1LjU4MTcgMTggMTBDMTggMTQuNDE4MyAxNC40MTgzIDE4IDEwIDE4QzUuNTgxNyAxOCAyIDE0LjQxODMgMiAxMEMyIDUuNTgxNyA1LjU4MTcgMiAxMCAyWiIgZmlsbD0id2hpdGUiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik02IDFDOC43NjE0MiAxIDExIDMuMjM4NTggMTEgNkMxMSA4Ljc2MTQyIDguNzYxNDIgMTEgNiAxMUMzLjIzODU4IDExIDEgOC43NjE0MiAxIDZDMSAzLjIzODU4IDMuMjM4NTggMSA2IDFaIiBmaWxsPSIjMjMxOUZGIi8+CjwvZz4KPC9zdmc+CjwvZz4KPC9zdmc+',
            'google': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNC4yNjY3IDE2LjI2NjdDMjQuMjY2NyAxNS40OCAyNC4yIDEzLjczMzMgMjQgMTIuMjY2N0gxNlYxOS43MzMzSDIwLjkzMzNDMjAuNjY2NyAyMS4yIDIwIDIyLjQgMTguOTMzMyAyMy4yVjI2LjEzMzNIMjEuNzMzM0MyMy40NjY3IDI0LjUzMzMgMjQuMjY2NyAyMC42NjY3IDI0LjI2NjcgMTYuMjY2N1oiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTE2IDI4QzE5LjczMzMgMjggMjIuOCAyNi44IDI0LjI2NjcgMjQuNTMzM0wyMS43MzMzIDIxLjZDMjAuOCAyMi4yNjY3IDE5LjUzMzMgMjIuNjY2NyAxNiAyMi42NjY3QzEyLjQgMjIuNjY2NyA5LjMzMzMzIDIwLjUzMzMgOC4yNjY2NyAxNy42SDUuMzMzMzNWMjAuNTMzM0M2LjggMjMuNDY2NyAxMS4wNjY3IDI4IDE2IDI4WiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNOC4yNjY2NyAxNy42QzggMTYuOTMzMyA4IDE2LjI2NjcgOCAxNS42QzggMTQuOTMzMyA4LjEzMzMzIDE0LjI2NjcgOC4yNjY2NyAxMy42VjEwLjY2NjdINS4zMzMzM0M0LjUzMzMzIDEyLjI2NjcgNCA0IDQgMTUuNkM0IDE3LjIgNC41MzMzMyAxOC42NjY3IDUuMzMzMzMgMjAuNTMzM0w4LjI2NjY3IDE3LjZaIiBmaWxsPSIjRkJCQzA0Ii8+CjxwYXRoIGQ9Ik0xNiA4LjUzMzMzQzE3LjczMzMgOC41MzMzMyAxOS4yNjY3IDkuMiAyMC40IDEwLjI2NjdMMjIuOCA3Ljg2NjY3QzIwLjkzMzMgNi4xMzMzMyAxOC41MzMzIDUuMzMzMzMgMTYgNS4zMzMzM0MxMS4wNjY3IDUuMzMzMzMgNi44IDkuODY2NjcgNS4zMzMzMyAxMi44TDguMjY2NjcgMTUuNzMzM0M5LjMzMzMzIDEyLjggMTIuNCA4LjUzMzMzIDE2IDguNTMzMzNaIiBmaWxsPSIjRUE0MzM1Ii8+Cjwvc3ZnPg==',
            'bing': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwMDc4RDQiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yIDJWMTRIMTRWMkgyWk04IDZIMTJWMTBIOFY2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+CjwvZz4KPC9zdmc+',
            'sogou': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGRjY2MDAiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDMTEuMzEzNyAyIDEzLjk5OTkgNC42ODYyOSAxMy45OTk5IDhDMTMuOTk5OSAxMS4zMTM3IDExLjMxMzcgMTQgOCAxNEM0LjY4NjI5IDE0IDIgMTEuMzEzNyAyIDhDMiA0LjY4NjI5IDQuNjg2MjkgMiA4IDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+',
            '360': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwMEE2RkIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDMTEuMzEzNyAyIDEzLjk5OTkgNC42ODYyOSAxMy45OTk5IDhDMTMuOTk5OSAxMS4zMTM3IDExLjMxMzcgMTQgOCAxNEM0LjY4NjI5IDE0IDIgMTEuMzEzNyAyIDhDMiA0LjY4NjI5IDQuNjg2MjkgMiA4IDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+',
            'duckduckgo': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNERTU4MzMiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDMTEuMzEzNyAyIDEzLjk5OTkgNC42ODYyOSAxMy45OTk5IDhDMTMuOTk5OSAxMS4zMTM3IDExLjMxMzcgMTQgOCAxNEM0LjY4NjI5IDE0IDIgMTEuMzEzNyAyIDhDMiA0LjY4NjI5IDQuNjg2MjkgMiA4IDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+'
        };

        this.iconCache = new Map();
        this.failedUrls = new Set();
        
        this.init();
    }

    // 获取Icons8搜索引擎图标URL
    getIcons8SearchUrl(domain) {
        const icons8Map = {
            'www.baidu.com': 'https://img.icons8.com/color/32/baidu.png',
            'www.google.com': 'https://img.icons8.com/color/32/google-logo.png',
            'www.bing.com': 'https://img.icons8.com/color/32/bing.png',
            'www.sogou.com': 'https://img.icons8.com/color/32/search.png',
            'www.so.com': 'https://img.icons8.com/color/32/search.png',
            'duckduckgo.com': 'https://img.icons8.com/color/32/duckduckgo.png',
            'www.yahoo.com': 'https://img.icons8.com/color/32/yahoo.png'
        };
        return icons8Map[domain] || `https://img.icons8.com/color/32/search.png`;
    }

    // 初始化处理器
    init() {
        console.log('🔍 搜索引擎图标处理器初始化...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processAllSearchEngineIcons());
        } else {
            this.processAllSearchEngineIcons();
        }

        this.observeSearchEngineIconChanges();
    }

    // 处理所有搜索引擎图标
    async processAllSearchEngineIcons() {
        console.log('🔍 开始处理搜索引擎图标...');
        
        // 查找所有搜索引擎图标元素
        const searchEngineSelectors = [
            '.engine-icon',
            '.search-engine-icon',
            '.baidu-icon',
            '.google-icon', 
            '.bing-icon',
            '.sogou-icon',
            '.qihoo360-icon',
            '.duckduckgo-icon',
            '.yahoo-icon'
        ];

        const allSearchIcons = [];
        searchEngineSelectors.forEach(selector => {
            const icons = document.querySelectorAll(selector);
            allSearchIcons.push(...icons);
        });

        // 也查找包含搜索引擎类名的元素
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const classList = Array.from(element.classList);
            for (const className of classList) {
                if (Object.keys(this.searchEngineMappings).some(engine => className.includes(engine))) {
                    if (!allSearchIcons.includes(element)) {
                        allSearchIcons.push(element);
                    }
                }
            }
        });

        console.log(`📊 找到 ${allSearchIcons.length} 个搜索引擎图标元素`);

        // 处理每个图标
        for (const iconElement of allSearchIcons) {
            await this.processSearchEngineIcon(iconElement);
        }

        console.log('✅ 搜索引擎图标处理完成');
    }

    // 处理单个搜索引擎图标
    async processSearchEngineIcon(iconElement) {
        try {
            // 确定搜索引擎类型
            const engineType = this.determineSearchEngineType(iconElement);
            if (!engineType) {
                console.warn('⚠️ 无法确定搜索引擎类型:', iconElement);
                return;
            }

            console.log(`🎯 处理 ${engineType} 搜索引擎图标`);

            // 获取对应的域名
            const domain = this.searchEngineMappings[engineType];
            if (!domain) {
                console.warn(`⚠️ 未找到 ${engineType} 的域名映射`);
                return;
            }

            // 尝试加载图标
            const iconUrl = await this.findWorkingSearchIcon(domain);
            if (iconUrl) {
                this.applyIconToElement(iconElement, iconUrl, engineType);
                console.log(`✅ ${engineType} 搜索引擎图标加载成功:`, iconUrl);
            } else {
                console.error(`❌ ${engineType} 搜索引擎图标加载失败`);
                this.applyFallbackIcon(iconElement, engineType);
            }

        } catch (error) {
            console.error('❌ 处理搜索引擎图标时出错:', error);
        }
    }

    // 确定搜索引擎类型
    determineSearchEngineType(element) {
        const classList = Array.from(element.classList);
        
        // 直接匹配类名
        for (const className of classList) {
            if (this.searchEngineMappings[className]) {
                return className;
            }
            // 检查包含搜索引擎名称的类名
            for (const engine of Object.keys(this.searchEngineMappings)) {
                if (className.includes(engine)) {
                    return engine;
                }
            }
        }

        // 检查父元素的类名
        const parent = element.parentElement;
        if (parent) {
            const parentClasses = Array.from(parent.classList);
            for (const className of parentClasses) {
                for (const engine of Object.keys(this.searchEngineMappings)) {
                    if (className.includes(engine)) {
                        return engine;
                    }
                }
            }
        }

        // 检查元素的data属性
        const dataType = element.getAttribute('data-engine-type');
        if (dataType && this.searchEngineMappings[dataType]) {
            return dataType;
        }

        return null;
    }

    // 查找可用的搜索引擎图标URL
    async findWorkingSearchIcon(domain) {
        // 检查缓存
        if (this.iconCache.has(domain)) {
            return this.iconCache.get(domain);
        }

        // 按优先级尝试不同的API
        for (const api of this.searchIconAPIs) {
            const iconUrl = api.getUrl(domain);
            
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
    applyIconToElement(element, iconUrl, engineType) {
        // 清除现有样式和内容
        element.style.backgroundImage = '';
        element.style.backgroundColor = '';
        element.innerHTML = ''; // 清除文字内容
        
        // 应用新图标
        element.style.backgroundImage = `url("${iconUrl}")`;
        element.style.backgroundSize = 'contain';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'center';
        element.style.width = '32px';
        element.style.height = '32px';
        element.style.display = 'inline-block';
        element.style.border = 'none';
        element.style.outline = 'none';
        
        // 确保没有文字显示
        element.style.fontSize = '0';
        element.style.textIndent = '-9999px';
        element.style.overflow = 'hidden';

        // 添加成功标记
        element.classList.add('search-icon-loaded');
        element.setAttribute('data-icon-url', iconUrl);
        element.setAttribute('data-engine-type', engineType);
    }

    // 应用备用图标
    applyFallbackIcon(element, engineType) {
        const fallbackSVG = this.fallbackSVGs[engineType] || this.fallbackSVGs['google'];
        this.applyIconToElement(element, fallbackSVG, engineType);
        
        console.log(`🔄 ${engineType} 使用备用搜索引擎图标`);
    }

    // 监听DOM变化
    observeSearchEngineIconChanges() {
        const observer = new MutationObserver((mutations) => {
            let hasNewSearchIcons = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新添加的元素是否包含搜索引擎图标
                            const searchIcons = node.querySelectorAll('.engine-icon, .search-engine-icon, .baidu-icon, .google-icon, .bing-icon');
                            if (searchIcons.length > 0) {
                                hasNewSearchIcons = true;
                            }
                        }
                    });
                }
            });

            if (hasNewSearchIcons) {
                console.log('🔄 检测到新的搜索引擎图标，重新处理...');
                setTimeout(() => this.processAllSearchEngineIcons(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 手动刷新所有搜索引擎图标
    async refreshAllSearchEngineIcons() {
        console.log('🔄 手动刷新所有搜索引擎图标...');
        this.iconCache.clear();
        this.failedUrls.clear();
        await this.processAllSearchEngineIcons();
    }

    // 获取统计信息
    getStats() {
        return {
            cachedIcons: this.iconCache.size,
            failedUrls: this.failedUrls.size,
            supportedSearchEngines: Object.keys(this.searchEngineMappings).length
        };
    }
}

// 创建全局实例
window.searchEngineIconProcessor = new SearchEngineIconProcessor();

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchEngineIconProcessor;
}

console.log('🔍 搜索引擎图标处理器已加载');