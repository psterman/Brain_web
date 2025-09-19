// 改进版图标加载器 - 修复拼接和大小问题

class ImprovedIconLoader {
    constructor() {
        this.loadedIcons = new Set();
        this.failedIcons = new Set();
        this.retryCount = new Map();
        this.maxRetries = 2;
        this.loadTimeout = 3000; // 3秒超时
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
        
        icons.forEach((icon, index) => {
            // 错开加载时间，避免同时请求过多
            setTimeout(() => {
                this.loadIcon(icon);
            }, index * 100);
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
        iconElement.classList.remove('error', 'loaded');
        iconElement.classList.add('loading');
        
        // 获取图标URL
        const iconUrl = this.getIconUrl(iconClass, iconElement);
        
        if (iconUrl) {
            this.loadSingleUrl(iconElement, iconUrl, iconClass);
        } else {
            this.handleIconError(iconElement, iconClass);
        }
    }

    // 获取图标URL
    getIconUrl(iconClass, iconElement) {
        // 根据图标类型和类名获取对应的URL
        const iconUrls = {
            // 应用图标
            'taobao': 'https://img.icons8.com/fluency/48/taobao.png',
            'tmall': 'https://img.icons8.com/fluency/48/tmall.png',
            'pinduoduo': 'https://img.icons8.com/fluency/48/pinduoduo.png',
            'jd': 'https://img.icons8.com/fluency/48/jd.png',
            'xianyu': 'https://img.icons8.com/fluency/48/alibaba.png',
            'zhihu': 'https://img.icons8.com/fluency/48/zhihu.png',
            'weibo': 'https://img.icons8.com/fluency/48/weibo.png',
            'wechat': 'https://img.icons8.com/fluency/48/wechat.png',
            'xiaohongshu': 'https://img.icons8.com/fluency/48/instagram-new.png',
            'qq-music': 'https://img.icons8.com/fluency/48/qq.png',
            'netease-music': 'https://img.icons8.com/fluency/48/spotify.png',
            'kuwo-music': 'https://img.icons8.com/fluency/48/music.png',
            'meituan': 'https://img.icons8.com/fluency/48/restaurant.png',
            'eleme': 'https://img.icons8.com/fluency/48/food-delivery.png',
            'dianping': 'https://img.icons8.com/fluency/48/yelp.png',
            'bilibili': 'https://img.icons8.com/fluency/48/youtube-play.png',
            'douyin': 'https://img.icons8.com/fluency/48/tiktok.png',
            
            // 搜索引擎
            'baidu': 'https://img.icons8.com/fluency/48/baidu.png',
            'sogou': 'https://img.icons8.com/fluency/48/search.png',
            'qihoo360': 'https://img.icons8.com/fluency/48/360-degrees.png',
            'shenma': 'https://img.icons8.com/fluency/48/search-more.png',
            'chinaso': 'https://img.icons8.com/fluency/48/china.png',
            'haosou': 'https://img.icons8.com/fluency/48/search-property.png',
            'google': 'https://img.icons8.com/fluency/48/google-logo.png',
            'bing': 'https://img.icons8.com/fluency/48/bing.png',
            
            // AI助手
            'deepseek': 'https://img.icons8.com/fluency/48/neural-network.png',
            'kimi': 'https://img.icons8.com/fluency/48/crescent-moon.png',
            'zhipu': 'https://img.icons8.com/fluency/48/speech-bubble-with-dots.png',
            'chatgpt': 'https://img.icons8.com/fluency/48/chatgpt.png',
            'claude': 'https://img.icons8.com/fluency/48/bot.png',
            'tongyi': 'https://img.icons8.com/fluency/48/chat-bot.png',
            'wenxin': 'https://img.icons8.com/fluency/48/assistant.png'
        };

        return iconUrls[iconClass];
    }

    // 加载单个URL
    loadSingleUrl(iconElement, url, iconClass) {
        const img = new Image();
        let timeoutId;
        
        const cleanup = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        
        img.onload = () => {
            cleanup();
            this.handleIconSuccess(iconElement, url, iconClass);
        };
        
        img.onerror = () => {
            cleanup();
            console.log(`图标加载失败: ${iconClass} - ${url}`);
            this.handleIconError(iconElement, iconClass);
        };
        
        // 设置超时
        timeoutId = setTimeout(() => {
            img.src = ''; // 取消加载
            console.log(`图标加载超时: ${iconClass} - ${url}`);
            this.handleIconError(iconElement, iconClass);
        }, this.loadTimeout);
        
        img.src = url;
    }

    // 处理图标加载成功
    handleIconSuccess(iconElement, url, iconClass) {
        iconElement.classList.remove('loading', 'error');
        iconElement.classList.add('loaded');
        
        // 直接设置背景图片，确保正确的大小和位置
        iconElement.style.backgroundImage = `url(${url})`;
        iconElement.style.backgroundSize = '32px 32px';
        iconElement.style.backgroundPosition = 'center';
        iconElement.style.backgroundRepeat = 'no-repeat';
        
        const iconId = this.getIconId(iconElement);
        this.loadedIcons.add(iconId);
        this.failedIcons.delete(iconId);
        
        console.log(`图标加载成功: ${iconClass} - ${url}`);
    }

    // 处理图标加载失败
    handleIconError(iconElement, iconClass) {
        iconElement.classList.remove('loading');
        iconElement.classList.add('error');
        
        // 清除背景图片，让CSS的error状态生效
        iconElement.style.backgroundImage = 'none';
        
        const iconId = this.getIconId(iconElement);
        this.failedIcons.add(iconId);
        
        console.log(`图标加载失败，使用备用文字: ${iconClass}`);
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
            'https://img.icons8.com/fluency/48/taobao.png',
            'https://img.icons8.com/fluency/48/tmall.png',
            'https://img.icons8.com/fluency/48/jd.png',
            'https://img.icons8.com/fluency/48/zhihu.png',
            'https://img.icons8.com/fluency/48/weibo.png',
            'https://img.icons8.com/fluency/48/baidu.png',
            'https://img.icons8.com/fluency/48/google-logo.png',
            'https://img.icons8.com/fluency/48/wechat.png'
        ];

        commonUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // 手动重新加载所有图标
    reloadAllIcons() {
        // 清除所有状态
        this.loadedIcons.clear();
        this.failedIcons.clear();
        this.retryCount.clear();
        
        // 重置所有图标状态
        const icons = document.querySelectorAll('.app-icon, .engine-icon, .ai-avatar');
        icons.forEach(icon => {
            icon.classList.remove('loading', 'error', 'loaded');
            icon.style.backgroundImage = '';
        });
        
        // 重新加载
        this.loadAllIcons();
    }

    // 获取加载统计
    getLoadingStats() {
        return {
            loaded: this.loadedIcons.size,
            failed: this.failedIcons.size,
            total: this.loadedIcons.size + this.failedIcons.size,
            loadedList: Array.from(this.loadedIcons),
            failedList: Array.from(this.failedIcons)
        };
    }

    // 检查图标是否已加载
    isIconLoaded(iconClass) {
        return this.loadedIcons.has(iconClass);
    }

    // 检查图标是否加载失败
    isIconFailed(iconClass) {
        return this.failedIcons.has(iconClass);
    }
}

// 创建全局实例
const improvedIconLoader = new ImprovedIconLoader();

// 监听网络状态变化
window.addEventListener('online', () => {
    console.log('网络已连接，重试加载失败的图标');
    setTimeout(() => {
        improvedIconLoader.retryFailedIcons();
    }, 1000);
});

// 监听页面可见性变化
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // 页面变为可见时，重试失败的图标
        setTimeout(() => {
            improvedIconLoader.retryFailedIcons();
        }, 2000);
    }
});

// 预加载常用图标
improvedIconLoader.preloadCommonIcons();

// 导出到全局作用域
window.ImprovedIconLoader = improvedIconLoader;

// 添加调试功能
window.reloadAllIcons = () => {
    improvedIconLoader.reloadAllIcons();
};

window.getIconStats = () => {
    const stats = improvedIconLoader.getLoadingStats();
    console.log('图标加载统计:', stats);
    return stats;
};

window.checkIconStatus = (iconClass) => {
    const loaded = improvedIconLoader.isIconLoaded(iconClass);
    const failed = improvedIconLoader.isIconFailed(iconClass);
    console.log(`图标 ${iconClass} 状态: 已加载=${loaded}, 失败=${failed}`);
    return { loaded, failed };
};

console.log('改进版图标加载器已初始化');
console.log('可用命令: reloadAllIcons(), getIconStats(), checkIconStatus(iconClass)');