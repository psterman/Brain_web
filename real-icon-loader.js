// 真实图标加载器 - 处理第三方图标服务

class RealIconLoader {
    constructor() {
        this.loadedIcons = new Set();
        this.failedIcons = new Set();
        this.retryCount = new Map();
        this.maxRetries = 3;
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadAllIcons();
            });
        } else {
            this.loadAllIcons();
        }
    }

    // 加载所有图标
    loadAllIcons() {
        const icons = document.querySelectorAll('.app-icon, .engine-icon, .ai-avatar');
        
        icons.forEach(icon => {
            this.loadIcon(icon);
        });
    }

    // 加载单个图标
    loadIcon(iconElement) {
        const classList = Array.from(iconElement.classList);
        const iconClass = classList.find(cls => 
            cls !== 'app-icon' && 
            cls !== 'engine-icon' && 
            cls !== 'ai-avatar' &&
            cls !== 'loading' &&
            cls !== 'error' &&
            cls !== 'loaded'
        );

        if (!iconClass) return;

        // 添加加载状态
        iconElement.classList.add('loading');
        
        // 获取背景图片URL列表
        const computedStyle = window.getComputedStyle(iconElement);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
            // 解析多个URL
            const urls = this.parseBackgroundImageUrls(backgroundImage);
            this.tryLoadUrls(iconElement, urls, 0);
        } else {
            this.handleIconError(iconElement, iconClass);
        }
    }

    // 解析背景图片URL
    parseBackgroundImageUrls(backgroundImage) {
        const urls = [];
        const urlRegex = /url\(['"]?([^'"]+)['"]?\)/g;
        let match;
        
        while ((match = urlRegex.exec(backgroundImage)) !== null) {
            urls.push(match[1]);
        }
        
        return urls;
    }

    // 尝试加载URL列表
    tryLoadUrls(iconElement, urls, index) {
        if (index >= urls.length) {
            // 所有URL都失败了
            this.handleIconError(iconElement);
            return;
        }

        const url = urls[index];
        const img = new Image();
        
        img.onload = () => {
            // 成功加载
            this.handleIconSuccess(iconElement, url);
        };
        
        img.onerror = () => {
            // 当前URL失败，尝试下一个
            console.log(`图标加载失败: ${url}`);
            this.tryLoadUrls(iconElement, urls, index + 1);
        };
        
        // 设置超时
        setTimeout(() => {
            if (!img.complete) {
                img.src = ''; // 取消加载
                this.tryLoadUrls(iconElement, urls, index + 1);
            }
        }, 5000); // 5秒超时
        
        img.src = url;
    }

    // 处理图标加载成功
    handleIconSuccess(iconElement, url) {
        iconElement.classList.remove('loading', 'error');
        iconElement.classList.add('loaded');
        iconElement.style.backgroundImage = `url(${url})`;
        
        const iconId = this.getIconId(iconElement);
        this.loadedIcons.add(iconId);
        this.failedIcons.delete(iconId);
        
        console.log(`图标加载成功: ${iconId} - ${url}`);
    }

    // 处理图标加载失败
    handleIconError(iconElement, iconClass) {
        iconElement.classList.remove('loading');
        iconElement.classList.add('error');
        
        const iconId = this.getIconId(iconElement);
        this.failedIcons.add(iconId);
        
        // 使用备用方案
        this.setFallbackIcon(iconElement, iconClass || iconId);
        
        console.log(`图标加载失败，使用备用方案: ${iconId}`);
    }

    // 设置备用图标
    setFallbackIcon(iconElement, iconClass) {
        const fallbackData = this.getFallbackData(iconClass);
        
        if (fallbackData) {
            iconElement.style.background = fallbackData.gradient;
            iconElement.style.backgroundImage = 'none';
            
            // 添加文字
            if (!iconElement.querySelector('.fallback-text')) {
                const textElement = document.createElement('span');
                textElement.className = 'fallback-text';
                textElement.textContent = fallbackData.text;
                textElement.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: 900;
                    font-size: 14px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                    z-index: 10;
                `;
                iconElement.appendChild(textElement);
            }
        }
    }

    // 获取备用数据
    getFallbackData(iconClass) {
        const fallbackMap = {
            // 应用图标备用数据
            'taobao': { text: '淘', gradient: 'linear-gradient(135deg, #FF6A00 0%, #FF4400 100%)' },
            'tmall': { text: '天', gradient: 'linear-gradient(135deg, #FF0036 0%, #D50027 100%)' },
            'pinduoduo': { text: '拼', gradient: 'linear-gradient(135deg, #FF5722 0%, #E91E63 100%)' },
            'jd': { text: '京', gradient: 'linear-gradient(135deg, #E60012 0%, #C5000F 100%)' },
            'xianyu': { text: '闲', gradient: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)' },
            'zhihu': { text: '知', gradient: 'linear-gradient(135deg, #0084FF 0%, #0066CC 100%)' },
            'weibo': { text: '微', gradient: 'linear-gradient(135deg, #E6162D 0%, #C41230 100%)' },
            'wechat': { text: '微', gradient: 'linear-gradient(135deg, #07C160 0%, #06AD56 100%)' },
            'xiaohongshu': { text: '小', gradient: 'linear-gradient(135deg, #FF2442 0%, #FF1744 100%)' },
            'qq-music': { text: 'QQ', gradient: 'linear-gradient(135deg, #31C27C 0%, #2BA471 100%)' },
            'netease-music': { text: '网', gradient: 'linear-gradient(135deg, #D33A31 0%, #B8312A 100%)' },
            'kuwo-music': { text: '酷', gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' },
            'meituan': { text: '美', gradient: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)' },
            'eleme': { text: '饿', gradient: 'linear-gradient(135deg, #0078FF 0%, #0066E0 100%)' },
            'dianping': { text: '大', gradient: 'linear-gradient(135deg, #FFB300 0%, #FF9800 100%)' },
            'bilibili': { text: 'B', gradient: 'linear-gradient(135deg, #FB7299 0%, #F25D8E 100%)' },
            'douyin': { text: '抖', gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)' },
            
            // 搜索引擎备用数据
            'baidu': { text: '百', gradient: 'linear-gradient(135deg, #2932E1 0%, #1E28CC 100%)' },
            'sogou': { text: '搜', gradient: 'linear-gradient(135deg, #FB6C2C 0%, #E55A26 100%)' },
            'qihoo360': { text: '360', gradient: 'linear-gradient(135deg, #4CAF50 0%, #43A047 100%)' },
            'shenma': { text: '神', gradient: 'linear-gradient(135deg, #9C27B0 0%, #8E24AA 100%)' },
            'chinaso': { text: '中', gradient: 'linear-gradient(135deg, #F44336 0%, #E53935 100%)' },
            'haosou': { text: '好', gradient: 'linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%)' },
            'google': { text: 'G', gradient: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 75%, #EA4335 100%)' },
            'bing': { text: 'B', gradient: 'linear-gradient(135deg, #0078D4 0%, #106EBE 100%)' },
            
            // AI助手备用数据
            'deepseek': { text: 'DS', gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' },
            'kimi': { text: 'K', gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)' },
            'zhipu': { text: '智', gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' },
            'chatgpt': { text: 'GPT', gradient: 'linear-gradient(135deg, #10A37F 0%, #0D8F6F 100%)' },
            'claude': { text: 'C', gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' }
        };
        
        return fallbackMap[iconClass] || { text: '?', gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)' };
    }

    // 获取图标ID
    getIconId(iconElement) {
        const classList = Array.from(iconElement.classList);
        return classList.find(cls => 
            cls !== 'app-icon' && 
            cls !== 'engine-icon' && 
            cls !== 'ai-avatar' &&
            cls !== 'loading' &&
            cls !== 'error' &&
            cls !== 'loaded'
        ) || 'unknown';
    }

    // 重试加载失败的图标
    retryFailedIcons() {
        const failedElements = document.querySelectorAll('.app-icon.error, .engine-icon.error, .ai-avatar.error');
        
        failedElements.forEach(element => {
            const iconId = this.getIconId(element);
            const currentRetries = this.retryCount.get(iconId) || 0;
            
            if (currentRetries < this.maxRetries) {
                this.retryCount.set(iconId, currentRetries + 1);
                element.classList.remove('error');
                
                // 清除备用文字
                const fallbackText = element.querySelector('.fallback-text');
                if (fallbackText) {
                    fallbackText.remove();
                }
                
                // 重新加载
                setTimeout(() => {
                    this.loadIcon(element);
                }, 1000 * (currentRetries + 1)); // 递增延迟
            }
        });
    }

    // 预加载常用图标
    preloadCommonIcons() {
        const commonUrls = [
            'https://img.icons8.com/color/48/taobao.png',
            'https://img.icons8.com/color/48/tmall.png',
            'https://img.icons8.com/color/48/jd.png',
            'https://img.icons8.com/color/48/zhihu.png',
            'https://img.icons8.com/color/48/weibo.png',
            'https://img.icons8.com/color/48/baidu.png',
            'https://img.icons8.com/color/48/google-logo.png'
        ];

        commonUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // 获取加载统计
    getLoadingStats() {
        return {
            loaded: this.loadedIcons.size,
            failed: this.failedIcons.size,
            total: this.loadedIcons.size + this.failedIcons.size
        };
    }
}

// 创建全局实例
const realIconLoader = new RealIconLoader();

// 监听网络状态变化
window.addEventListener('online', () => {
    console.log('网络已连接，重试加载失败的图标');
    realIconLoader.retryFailedIcons();
});

// 监听页面可见性变化
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // 页面变为可见时，重试失败的图标
        setTimeout(() => {
            realIconLoader.retryFailedIcons();
        }, 1000);
    }
});

// 预加载常用图标
realIconLoader.preloadCommonIcons();

// 导出到全局作用域
window.RealIconLoader = realIconLoader;

// 添加手动重新加载功能
window.reloadAllIcons = () => {
    realIconLoader.loadAllIcons();
};

// 添加调试功能
window.getIconStats = () => {
    return realIconLoader.getLoadingStats();
};

console.log('真实图标加载器已初始化');