// iPhone User-Agent 注入器
class iPhoneUserAgentInjector {
    constructor() {
        this.iPhoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
        this.init();
    }
    
    init() {
        this.setupIframeProxy();
        this.overrideNavigatorUserAgent();
    }
    
    // 设置iframe代理
    setupIframeProxy() {
        // 监听所有iframe的创建和加载
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'IFRAME') {
                        this.injectUserAgentToIframe(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 处理已存在的iframe
        const existingIframes = document.querySelectorAll('iframe');
        existingIframes.forEach(iframe => {
            this.injectUserAgentToIframe(iframe);
        });
    }
    
    // 向iframe注入iPhone User-Agent
    injectUserAgentToIframe(iframe) {
        iframe.addEventListener('load', () => {
            try {
                // 尝试修改iframe内的navigator.userAgent
                if (iframe.contentWindow && iframe.contentWindow.navigator) {
                    this.overrideUserAgentInWindow(iframe.contentWindow);
                }
            } catch (error) {
                console.log('跨域限制，无法直接修改iframe User-Agent');
                // 使用代理方式处理
                this.handleCrossOriginIframe(iframe);
            }
        });
        
        // 如果iframe已经加载完成
        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            try {
                this.overrideUserAgentInWindow(iframe.contentWindow);
            } catch (error) {
                this.handleCrossOriginIframe(iframe);
            }
        }
    }
    
    // 在指定窗口中覆盖User-Agent
    overrideUserAgentInWindow(window) {
        try {
            // 覆盖navigator.userAgent
            Object.defineProperty(window.navigator, 'userAgent', {
                get: () => this.iPhoneUserAgent,
                configurable: true
            });
            
            // 覆盖其他相关属性
            Object.defineProperty(window.navigator, 'platform', {
                get: () => 'iPhone',
                configurable: true
            });
            
            Object.defineProperty(window.navigator, 'vendor', {
                get: () => 'Apple Computer, Inc.',
                configurable: true
            });
            
            Object.defineProperty(window.navigator, 'maxTouchPoints', {
                get: () => 5,
                configurable: true
            });
            
            console.log('成功注入iPhone User-Agent');
        } catch (error) {
            console.log('User-Agent注入失败:', error);
        }
    }
    
    // 处理跨域iframe
    handleCrossOriginIframe(iframe) {
        // 对于跨域iframe，我们通过修改src来添加移动端参数
        const originalSrc = iframe.src;
        if (originalSrc && !originalSrc.includes('mobile=1')) {
            const separator = originalSrc.includes('?') ? '&' : '?';
            const newSrc = `${originalSrc}${separator}mobile=1&ua=iphone`;
            
            // 延迟设置，避免循环
            setTimeout(() => {
                if (iframe.src === originalSrc) {
                    iframe.src = newSrc;
                }
            }, 100);
        }
    }
    
    // 覆盖当前页面的navigator.userAgent
    overrideNavigatorUserAgent() {
        try {
            Object.defineProperty(navigator, 'userAgent', {
                get: () => this.iPhoneUserAgent,
                configurable: true
            });
            
            Object.defineProperty(navigator, 'platform', {
                get: () => 'iPhone',
                configurable: true
            });
            
            Object.defineProperty(navigator, 'vendor', {
                get: () => 'Apple Computer, Inc.',
                configurable: true
            });
            
            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: () => 5,
                configurable: true
            });
            
            // 添加移动端特征
            Object.defineProperty(navigator, 'standalone', {
                get: () => false,
                configurable: true
            });
            
            console.log('页面User-Agent已设置为iPhone');
        } catch (error) {
            console.log('无法修改页面User-Agent:', error);
        }
    }
    
    // 创建移动端代理请求
    createMobileProxy(url) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                headers: {
                    'User-Agent': this.iPhoneUserAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                }
            })
            .then(response => response.text())
            .then(html => {
                resolve(html);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
    
    // 为特定iframe设置移动端内容
    setMobileContentForIframe(iframe, url) {
        this.createMobileProxy(url)
            .then(html => {
                const blob = new Blob([html], { type: 'text/html' });
                const blobUrl = URL.createObjectURL(blob);
                iframe.src = blobUrl;
                
                // 清理blob URL
                iframe.addEventListener('load', () => {
                    setTimeout(() => {
                        URL.revokeObjectURL(blobUrl);
                    }, 1000);
                });
            })
            .catch(error => {
                console.log('移动端代理请求失败:', error);
            });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const injector = new iPhoneUserAgentInjector();
    
    // 导出到全局作用域
    window.iPhoneUserAgentInjector = injector;
});

// 立即执行，确保尽早注入
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new iPhoneUserAgentInjector();
    });
} else {
    new iPhoneUserAgentInjector();
}