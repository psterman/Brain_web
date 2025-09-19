// 图标加载失败处理系统

class IconFallbackManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIconFallbacks();
        this.preloadIcons();
        this.setupErrorHandling();
    }

    // 设置图标加载失败的备用方案
    setupIconFallbacks() {
        const icons = document.querySelectorAll('.app-icon, .engine-icon');
        
        icons.forEach(icon => {
            this.checkIconLoad(icon);
        });
    }

    // 检查图标是否加载成功
    checkIconLoad(iconElement) {
        const computedStyle = window.getComputedStyle(iconElement);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
            const imageUrl = backgroundImage.slice(4, -1).replace(/"/g, "");
            
            // 创建一个临时图片元素来测试加载
            const testImage = new Image();
            
            testImage.onload = () => {
                // 图标加载成功
                iconElement.removeAttribute('data-fallback');
                this.addLoadedClass(iconElement);
            };
            
            testImage.onerror = () => {
                // 图标加载失败，使用备用方案
                this.enableFallback(iconElement);
            };
            
            testImage.src = imageUrl;
        } else {
            // 没有背景图片，使用备用方案
            this.enableFallback(iconElement);
        }
    }

    // 启用备用方案
    enableFallback(iconElement) {
        iconElement.setAttribute('data-fallback', 'true');
        iconElement.classList.add('icon-fallback');
        
        // 添加加载失败的样式
        iconElement.style.backgroundImage = 'none';
        
        console.log(`图标加载失败，使用备用文字: ${iconElement.className}`);
    }

    // 添加加载成功的样式
    addLoadedClass(iconElement) {
        iconElement.classList.add('icon-loaded');
    }

    // 预加载图标
    preloadIcons() {
        const iconUrls = [
            'https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-83.svg',
            'https://img.alicdn.com/tfs/TB1Ly5oS3HqK1RjSZFPXXcwapXa-238-238.png',
            'https://www.baidu.com/favicon.ico',
            'https://www.sogou.com/favicon.ico',
            'https://static.zhihu.com/heifetz/favicon.ico',
            'https://weibo.com/favicon.ico',
            'https://y.qq.com/favicon.ico',
            'https://s1.music.126.net/style/favicon.ico'
        ];

        iconUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // 设置错误处理
    setupErrorHandling() {
        // 监听网络状态变化
        window.addEventListener('online', () => {
            this.retryFailedIcons();
        });

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.retryFailedIcons();
            }
        });
    }

    // 重试加载失败的图标
    retryFailedIcons() {
        const failedIcons = document.querySelectorAll('[data-fallback="true"]');
        
        failedIcons.forEach(icon => {
            // 移除失败标记
            icon.removeAttribute('data-fallback');
            icon.classList.remove('icon-fallback');
            
            // 重新检查加载
            setTimeout(() => {
                this.checkIconLoad(icon);
            }, 1000);
        });
    }

    // 手动重新加载所有图标
    reloadAllIcons() {
        const icons = document.querySelectorAll('.app-icon, .engine-icon');
        
        icons.forEach(icon => {
            icon.removeAttribute('data-fallback');
            icon.classList.remove('icon-fallback', 'icon-loaded');
            this.checkIconLoad(icon);
        });
    }
}

// 创建更好的图标映射系统
const IconMapping = {
    // 应用图标映射
    apps: {
        taobao: {
            name: '淘宝',
            urls: [
                'https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-83.svg',
                'https://www.taobao.com/favicon.ico'
            ],
            fallbackText: '淘',
            color: '#ff6a00'
        },
        tmall: {
            name: '天猫',
            urls: [
                'https://img.alicdn.com/tfs/TB1Ly5oS3HqK1RjSZFPXXcwapXa-238-238.png',
                'https://www.tmall.com/favicon.ico'
            ],
            fallbackText: '天',
            color: '#ff0036'
        },
        pinduoduo: {
            name: '拼多多',
            urls: [
                'https://commimg.pddpic.com/pdd_h5/favicon.ico',
                'https://www.pinduoduo.com/favicon.ico'
            ],
            fallbackText: '拼',
            color: '#ff5722'
        },
        jd: {
            name: '京东',
            urls: [
                'https://www.jd.com/favicon.ico'
            ],
            fallbackText: '京',
            color: '#e60012'
        },
        xianyu: {
            name: '闲鱼',
            urls: [
                'https://gw.alicdn.com/imgextra/i2/O1CN01qzGaWx1dQFQFzBJVL_!!6000000003726-2-tps-180-180.png'
            ],
            fallbackText: '闲',
            color: '#ffb300'
        },
        zhihu: {
            name: '知乎',
            urls: [
                'https://static.zhihu.com/heifetz/favicon.ico',
                'https://www.zhihu.com/favicon.ico'
            ],
            fallbackText: '知',
            color: '#0084ff'
        },
        weibo: {
            name: '微博',
            urls: [
                'https://weibo.com/favicon.ico'
            ],
            fallbackText: '微',
            color: '#e6162d'
        },
        'qq-music': {
            name: 'QQ音乐',
            urls: [
                'https://y.qq.com/favicon.ico'
            ],
            fallbackText: 'QQ',
            color: '#31c27c'
        },
        'netease-music': {
            name: '网易云音乐',
            urls: [
                'https://s1.music.126.net/style/favicon.ico',
                'https://music.163.com/favicon.ico'
            ],
            fallbackText: '网',
            color: '#d33a31'
        },
        meituan: {
            name: '美团',
            urls: [
                'https://www.meituan.com/favicon.ico'
            ],
            fallbackText: '美',
            color: '#ffc107'
        },
        eleme: {
            name: '饿了么',
            urls: [
                'https://fuss10.elemecdn.com/9/cd/95de8c7b85c7c233db531a7c4d3e7jpeg.jpeg',
                'https://www.ele.me/favicon.ico'
            ],
            fallbackText: '饿',
            color: '#0078ff'
        },
        dianping: {
            name: '大众点评',
            urls: [
                'https://www.dianping.com/favicon.ico'
            ],
            fallbackText: '大',
            color: '#ffb300'
        }
    },

    // 搜索引擎图标映射
    engines: {
        baidu: {
            name: '百度',
            urls: [
                'https://www.baidu.com/favicon.ico'
            ],
            fallbackText: '百',
            color: '#2932e1'
        },
        sogou: {
            name: '搜狗',
            urls: [
                'https://www.sogou.com/favicon.ico'
            ],
            fallbackText: '搜',
            color: '#fb6c2c'
        },
        qihoo360: {
            name: '360搜索',
            urls: [
                'https://www.so.com/favicon.ico'
            ],
            fallbackText: '360',
            color: '#4caf50'
        },
        shenma: {
            name: '神马搜索',
            urls: [
                'https://m.sm.cn/favicon.ico'
            ],
            fallbackText: '神',
            color: '#9c27b0'
        },
        chinaso: {
            name: '中国搜索',
            urls: [
                'https://www.chinaso.com/favicon.ico'
            ],
            fallbackText: '中',
            color: '#f44336'
        },
        haosou: {
            name: '好搜',
            urls: [
                'https://www.haosou.com/favicon.ico'
            ],
            fallbackText: '好',
            color: '#00bcd4'
        }
    },

    // 尝试加载图标的多个URL
    tryLoadIcon(element, iconKey, type = 'apps') {
        const iconData = this[type][iconKey];
        if (!iconData) return false;

        let urlIndex = 0;
        const tryNextUrl = () => {
            if (urlIndex >= iconData.urls.length) {
                // 所有URL都失败了，使用备用方案
                this.setFallback(element, iconData);
                return;
            }

            const url = iconData.urls[urlIndex];
            const testImage = new Image();
            
            testImage.onload = () => {
                // 成功加载
                element.style.backgroundImage = `url(${url})`;
                element.removeAttribute('data-fallback');
                element.classList.add('icon-loaded');
            };
            
            testImage.onerror = () => {
                // 当前URL失败，尝试下一个
                urlIndex++;
                tryNextUrl();
            };
            
            testImage.src = url;
        };

        tryNextUrl();
        return true;
    },

    // 设置备用方案
    setFallback(element, iconData) {
        element.setAttribute('data-fallback', 'true');
        element.classList.add('icon-fallback');
        element.style.backgroundImage = 'none';
        element.style.backgroundColor = iconData.color;
        
        // 确保备用文字显示
        if (!element.querySelector('.fallback-text')) {
            const fallbackText = document.createElement('span');
            fallbackText.className = 'fallback-text';
            fallbackText.textContent = iconData.fallbackText;
            fallbackText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 14px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            `;
            element.appendChild(fallbackText);
        }
    }
};

// 初始化图标系统
document.addEventListener('DOMContentLoaded', () => {
    const iconManager = new IconFallbackManager();
    
    // 为所有图标设置智能加载
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach(icon => {
        const classList = Array.from(icon.classList);
        const iconClass = classList.find(cls => cls !== 'app-icon');
        if (iconClass) {
            IconMapping.tryLoadIcon(icon, iconClass, 'apps');
        }
    });

    const engineIcons = document.querySelectorAll('.engine-icon');
    engineIcons.forEach(icon => {
        const classList = Array.from(icon.classList);
        const iconClass = classList.find(cls => cls !== 'engine-icon');
        if (iconClass) {
            IconMapping.tryLoadIcon(icon, iconClass, 'engines');
        }
    });

    // 导出到全局作用域供调试使用
    window.IconManager = iconManager;
    window.IconMapping = IconMapping;
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IconFallbackManager, IconMapping };
}