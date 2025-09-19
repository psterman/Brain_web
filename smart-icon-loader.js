/**
 * 智能图标加载器
 * 专业前端解决方案 - 多重备用机制确保图标正常显示
 * 
 * 功能特性:
 * 1. 自动检测图标加载失败
 * 2. 智能切换备用方案
 * 3. 支持第三方服务和本地图标
 * 4. 实时监控和错误恢复
 * 5. 性能优化和缓存机制
 */

class SmartIconLoader {
    constructor() {
        this.loadAttempts = new Map(); // 记录加载尝试次数
        this.loadedIcons = new Set(); // 记录已成功加载的图标
        this.failedIcons = new Set(); // 记录加载失败的图标
        this.retryQueue = []; // 重试队列
        this.maxRetries = 3; // 最大重试次数
        this.retryDelay = 1000; // 重试延迟(ms)
        
        // 图标配置
        this.iconConfigs = {
            // Hero区域AI标签页图标
            heroAI: {
                'chatgpt': {
                    selector: '.ai-tab-icon.chatgpt',
                    fallbackClasses: ['fallback-1', 'fallback-2'],
                    testUrls: [
                        'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v9/icons/openai.svg',
                        'https://img.icons8.com/color/48/chatgpt.png'
                    ]
                },
                'deepseek': {
                    selector: '.ai-tab-icon.deepseek',
                    fallbackClasses: ['fallback-1', 'fallback-2'],
                    testUrls: [
                        'https://img.icons8.com/fluency/48/artificial-intelligence.png',
                        'https://img.icons8.com/color/48/neural-network.png'
                    ]
                },
                'kimi': {
                    selector: '.ai-tab-icon.kimi',
                    fallbackClasses: ['fallback-1', 'fallback-2'],
                    testUrls: [
                        'https://img.icons8.com/fluency/48/crescent-moon.png',
                        'https://img.icons8.com/color/48/moon-symbol.png'
                    ]
                },
                'doubao': {
                    selector: '.ai-tab-icon.doubao',
                    fallbackClasses: ['fallback-1', 'fallback-2'],
                    testUrls: [
                        'https://img.icons8.com/fluency/48/coffee-beans.png',
                        'https://img.icons8.com/color/48/coffee-bean.png'
                    ]
                },
                'claude': {
                    selector: '.ai-tab-icon.claude',
                    fallbackClasses: ['fallback-1', 'fallback-2'],
                    testUrls: [
                        'https://img.icons8.com/fluency/48/bot.png',
                        'https://img.icons8.com/color/48/chatbot.png'
                    ]
                }
            },
            
            // 对话界面AI头像
            chatAvatars: {
                'deepseek-avatar': {
                    selector: '.ai-avatar.deepseek-avatar',
                    fallbackClasses: ['fallback-1', 'fallback-2'],
                    testUrls: [
                        'https://img.icons8.com/fluency/48/artificial-intelligence.png',
                        'https://img.icons8.com/color/48/neural-network.png'
                    ]
                },
                'kimi-avatar': {
                    selector: '.ai-avatar.kimi-avatar',
                    fallbackClasses: ['fallback-1', 'fallback-2'],
                    testUrls: [
                        'https://img.icons8.com/fluency/48/crescent-moon.png',
                        'https://img.icons8.com/color/48/moon-symbol.png'
                    ]
                },
                'zhipu-avatar': {
                    selector: '.ai-avatar.zhipu-avatar',
                    fallbackClasses: ['fallback-1', 'fallback-2'],
                    testUrls: [
                        'https://img.icons8.com/fluency/48/speech-bubble-with-dots.png',
                        'https://img.icons8.com/color/48/chat.png'
                    ]
                }
            },
            
            // 应用图标
            appIcons: {
                'taobao': {
                    selector: '.app-icon.taobao',
                    fallbackClasses: ['fallback-1'],
                    testUrls: ['https://img.icons8.com/color/48/taobao.png']
                },
                'tmall': {
                    selector: '.app-icon.tmall',
                    fallbackClasses: ['fallback-1'],
                    testUrls: ['https://img.icons8.com/color/48/tmall.png']
                },
                'pinduoduo': {
                    selector: '.app-icon.pinduoduo',
                    fallbackClasses: ['fallback-1'],
                    testUrls: ['https://img.icons8.com/color/48/pinduoduo.png']
                },
                'jingdong': {
                    selector: '.app-icon.jingdong',
                    fallbackClasses: ['fallback-1'],
                    testUrls: ['https://img.icons8.com/color/48/jd.png']
                },
                'zhihu': {
                    selector: '.app-icon.zhihu',
                    fallbackClasses: ['fallback-1'],
                    testUrls: ['https://img.icons8.com/color/48/zhihu.png']
                },
                'weibo': {
                    selector: '.app-icon.weibo',
                    fallbackClasses: ['fallback-1'],
                    testUrls: ['https://img.icons8.com/color/48/sina-weibo.png']
                }
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 智能图标加载器初始化');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startLoading());
        } else {
            this.startLoading();
        }
        
        // 监听动态内容变化
        this.observeDOM();
        
        // 网络状态监听
        this.setupNetworkMonitoring();
        
        // 定期检查和修复
        this.startPeriodicCheck();
    }
    
    startLoading() {
        console.log('📋 开始加载所有图标');
        
        // 加载各类图标
        Object.keys(this.iconConfigs).forEach(category => {
            Object.keys(this.iconConfigs[category]).forEach(iconKey => {
                setTimeout(() => {
                    this.loadIconCategory(category, iconKey);
                }, Math.random() * 500); // 随机延迟避免并发过多
            });
        });
    }
    
    loadIconCategory(category, iconKey) {
        const config = this.iconConfigs[category][iconKey];
        const elements = document.querySelectorAll(config.selector);
        
        if (elements.length === 0) {
            console.log(`⚠️ 未找到图标元素: ${config.selector}`);
            return;
        }
        
        console.log(`🔍 找到 ${elements.length} 个 ${iconKey} 图标元素`);
        
        elements.forEach((element, index) => {
            const uniqueId = `${category}-${iconKey}-${index}`;
            this.loadIconWithFallback(element, config, uniqueId);
        });
    }
    
    loadIconWithFallback(element, config, uniqueId) {
        // 添加加载状态
        element.classList.add('icon-loading');
        
        // 初始化加载尝试计数
        if (!this.loadAttempts.has(uniqueId)) {
            this.loadAttempts.set(uniqueId, 0);
        }
        
        const currentAttempt = this.loadAttempts.get(uniqueId);
        
        // 如果超过最大重试次数，标记为错误
        if (currentAttempt >= this.maxRetries) {
            this.markIconAsError(element, uniqueId);
            return;
        }
        
        // 测试当前图标是否能正常加载
        this.testIconLoad(element, config, uniqueId, currentAttempt);
    }
    
    testIconLoad(element, config, uniqueId, attemptIndex) {
        // 获取当前应该使用的URL
        const testUrl = config.testUrls[Math.min(attemptIndex, config.testUrls.length - 1)];
        
        if (!testUrl) {
            // 没有更多URL可测试，使用备用方案
            this.applyFallback(element, config, uniqueId, attemptIndex);
            return;
        }
        
        console.log(`🔄 测试图标加载: ${uniqueId}, 尝试 ${attemptIndex + 1}, URL: ${testUrl}`);
        
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ 图标加载成功: ${uniqueId}`);
            this.markIconAsLoaded(element, uniqueId);
        };
        
        img.onerror = () => {
            console.log(`❌ 图标加载失败: ${uniqueId}, URL: ${testUrl}`);
            this.loadAttempts.set(uniqueId, attemptIndex + 1);
            
            // 尝试备用方案
            setTimeout(() => {
                this.applyFallback(element, config, uniqueId, attemptIndex);
            }, this.retryDelay);
        };
        
        // 设置超时
        setTimeout(() => {
            if (!img.complete) {
                console.log(`⏰ 图标加载超时: ${uniqueId}`);
                img.onerror();
            }
        }, 5000);
        
        img.src = testUrl;
    }
    
    applyFallback(element, config, uniqueId, attemptIndex) {
        const fallbackIndex = Math.min(attemptIndex, config.fallbackClasses.length - 1);
        const fallbackClass = config.fallbackClasses[fallbackIndex];
        
        if (fallbackClass) {
            console.log(`🔄 应用备用方案: ${uniqueId}, 备用方案: ${fallbackClass}`);
            
            // 清除之前的备用类
            config.fallbackClasses.forEach(cls => {
                element.classList.remove(cls);
            });
            
            // 添加当前备用类
            element.classList.add(fallbackClass);
            
            // 测试备用方案是否有效
            setTimeout(() => {
                this.testFallbackEffectiveness(element, config, uniqueId, attemptIndex);
            }, 500);
        } else {
            // 没有更多备用方案，标记为错误
            this.markIconAsError(element, uniqueId);
        }
    }
    
    testFallbackEffectiveness(element, config, uniqueId, attemptIndex) {
        // 检查元素是否有背景图片
        const computedStyle = window.getComputedStyle(element);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
            console.log(`✅ 备用方案生效: ${uniqueId}`);
            this.markIconAsLoaded(element, uniqueId);
        } else {
            console.log(`❌ 备用方案无效: ${uniqueId}`);
            // 继续尝试下一个备用方案
            this.loadAttempts.set(uniqueId, attemptIndex + 1);
            this.loadIconWithFallback(element, config, uniqueId);
        }
    }
    
    markIconAsLoaded(element, uniqueId) {
        element.classList.remove('icon-loading', 'icon-error');
        this.loadedIcons.add(uniqueId);
        this.failedIcons.delete(uniqueId);
        console.log(`🎉 图标加载完成: ${uniqueId}`);
    }
    
    markIconAsError(element, uniqueId) {
        element.classList.remove('icon-loading');
        element.classList.add('icon-error');
        this.failedIcons.add(uniqueId);
        this.loadedIcons.delete(uniqueId);
        console.log(`💥 图标加载失败: ${uniqueId}`);
        
        // 添加到重试队列
        this.retryQueue.push({ element, uniqueId });
    }
    
    observeDOM() {
        const observer = new MutationObserver((mutations) => {
            let shouldReload = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否有新的图标元素
                            const hasIcons = node.querySelectorAll && (
                                node.querySelectorAll('.ai-tab-icon').length > 0 ||
                                node.querySelectorAll('.ai-avatar').length > 0 ||
                                node.querySelectorAll('.app-icon').length > 0
                            );
                            
                            if (hasIcons) {
                                shouldReload = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldReload) {
                console.log('🔄 检测到新的图标元素，重新加载');
                setTimeout(() => this.startLoading(), 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    setupNetworkMonitoring() {
        // 监听网络状态变化
        window.addEventListener('online', () => {
            console.log('🌐 网络已连接，重试失败的图标');
            this.retryFailedIcons();
        });
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.failedIcons.size > 0) {
                console.log('👁️ 页面重新可见，重试失败的图标');
                setTimeout(() => this.retryFailedIcons(), 1000);
            }
        });
    }
    
    startPeriodicCheck() {
        // 每30秒检查一次失败的图标
        setInterval(() => {
            if (this.failedIcons.size > 0) {
                console.log(`🔍 定期检查: 发现 ${this.failedIcons.size} 个失败图标，尝试修复`);
                this.retryFailedIcons();
            }
        }, 30000);
    }
    
    retryFailedIcons() {
        const retryItems = [...this.retryQueue];
        this.retryQueue = [];
        
        retryItems.forEach(({ element, uniqueId }) => {
            // 重置尝试次数
            this.loadAttempts.set(uniqueId, 0);
            
            // 找到对应的配置
            let config = null;
            let category = null;
            let iconKey = null;
            
            for (const cat in this.iconConfigs) {
                for (const key in this.iconConfigs[cat]) {
                    if (uniqueId.includes(`${cat}-${key}`)) {
                        config = this.iconConfigs[cat][key];
                        category = cat;
                        iconKey = key;
                        break;
                    }
                }
                if (config) break;
            }
            
            if (config) {
                console.log(`🔄 重试图标: ${uniqueId}`);
                this.loadIconWithFallback(element, config, uniqueId);
            }
        });
    }
    
    // 公共API方法
    reloadAllIcons() {
        console.log('🔄 手动重新加载所有图标');
        this.loadAttempts.clear();
        this.loadedIcons.clear();
        this.failedIcons.clear();
        this.retryQueue = [];
        this.startLoading();
    }
    
    getLoadingStatus() {
        return {
            loaded: this.loadedIcons.size,
            failed: this.failedIcons.size,
            total: this.loadAttempts.size,
            loadedIcons: Array.from(this.loadedIcons),
            failedIcons: Array.from(this.failedIcons),
            retryQueue: this.retryQueue.length
        };
    }
    
    forceReloadIcon(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            // 移除所有状态类
            element.classList.remove('icon-loading', 'icon-error');
            
            // 找到对应的配置并重新加载
            for (const category in this.iconConfigs) {
                for (const iconKey in this.iconConfigs[category]) {
                    const config = this.iconConfigs[category][iconKey];
                    if (element.matches(config.selector)) {
                        const uniqueId = `${category}-${iconKey}-${index}`;
                        this.loadAttempts.set(uniqueId, 0);
                        this.loadIconWithFallback(element, config, uniqueId);
                        return;
                    }
                }
            }
        });
    }
}

// 创建全局实例
window.smartIconLoader = new SmartIconLoader();

// 添加全局调试函数
window.reloadAllIcons = () => window.smartIconLoader.reloadAllIcons();
window.getIconStatus = () => window.smartIconLoader.getLoadingStatus();
window.forceReloadIcon = (selector) => window.smartIconLoader.forceReloadIcon(selector);

// 调试信息
console.log('🎯 智能图标加载器已就绪');
console.log('📋 可用命令:');
console.log('  - reloadAllIcons() : 重新加载所有图标');
console.log('  - getIconStatus() : 查看加载状态');
console.log('  - forceReloadIcon(selector) : 强制重新加载指定图标');

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartIconLoader;
}