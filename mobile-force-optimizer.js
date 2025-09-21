// 移动端强制优化脚本
class MobileForceOptimizer {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
        this.init();
    }
    
    init() {
        this.setupIframeOptimization();
        this.setupMobileViewport();
        this.setupTouchOptimization();
    }
    
    // 设置iframe移动端优化
    setupIframeOptimization() {
        const iframe = document.getElementById('browserFrame');
        if (!iframe) return;
        
        // 监听iframe加载完成
        iframe.addEventListener('load', () => {
            this.optimizeIframeContent(iframe);
        });
        
        // 设置iframe属性
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation');
        
        // 强制移动端User-Agent
        this.setMobileUserAgent(iframe);
    }
    
    // 设置移动端User-Agent
    setMobileUserAgent(iframe) {
        try {
            // 通过代理方式设置User-Agent
            const originalSrc = iframe.src;
            
            // 创建一个代理URL，强制移动端访问
            if (originalSrc && !originalSrc.includes('about:blank')) {
                const mobileUrl = this.convertToMobileUrl(originalSrc);
                if (mobileUrl !== originalSrc) {
                    iframe.src = mobileUrl;
                }
            }
        } catch (error) {
            console.log('User-Agent设置失败，使用其他优化方案');
        }
    }
    
    // 转换为移动端URL
    convertToMobileUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            
            // 移动端URL映射表
            const mobileMapping = {
                'www.baidu.com': 'm.baidu.com',
                'baidu.com': 'm.baidu.com',
                'www.google.com': 'm.google.com',
                'google.com': 'm.google.com',
                'www.bing.com': 'm.bing.com',
                'bing.com': 'm.bing.com',
                'www.sogou.com': 'm.sogou.com',
                'sogou.com': 'm.sogou.com',
                'www.so.com': 'm.so.com',
                'so.com': 'm.so.com',
                'www.zhihu.com': 'm.zhihu.com',
                'zhihu.com': 'm.zhihu.com',
                'www.weibo.com': 'm.weibo.com',
                'weibo.com': 'm.weibo.com',
                'www.douyin.com': 'm.douyin.com',
                'douyin.com': 'm.douyin.com',
                'www.xiaohongshu.com': 'm.xiaohongshu.com',
                'xiaohongshu.com': 'm.xiaohongshu.com',
                'www.bilibili.com': 'm.bilibili.com',
                'bilibili.com': 'm.bilibili.com',
                'www.taobao.com': 'm.taobao.com',
                'taobao.com': 'm.taobao.com',
                'www.tmall.com': 'm.tmall.com',
                'tmall.com': 'm.tmall.com',
                'www.jd.com': 'm.jd.com',
                'jd.com': 'm.jd.com',
                'www.pinduoduo.com': 'mobile.yangkeduo.com',
                'pinduoduo.com': 'mobile.yangkeduo.com'
            };
            
            // 检查是否需要重定向到移动端
            if (mobileMapping[hostname]) {
                urlObj.hostname = mobileMapping[hostname];
                return urlObj.toString();
            }
            
            // 如果已经是移动端URL，直接返回
            if (hostname.startsWith('m.') || hostname.includes('mobile') || hostname.includes('wap')) {
                return url;
            }
            
            // 尝试添加m.前缀
            if (!hostname.startsWith('www.')) {
                urlObj.hostname = 'm.' + hostname;
                return urlObj.toString();
            }
            
            // 对于www开头的，替换为m.
            urlObj.hostname = hostname.replace('www.', 'm.');
            return urlObj.toString();
            
        } catch (error) {
            return url;
        }
    }
    
    // 优化iframe内容
    optimizeIframeContent(iframe) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc) return;
            
            // 注入移动端优化CSS
            this.injectMobileCSS(iframeDoc);
            
            // 设置移动端viewport
            this.setMobileViewport(iframeDoc);
            
            // 优化触摸交互
            this.optimizeTouchInteraction(iframeDoc);
            
            // 隐藏桌面端特有元素
            this.hideDesktopElements(iframeDoc);
            
            // 强制移动端布局
            this.forceMobileLayout(iframeDoc);
            
        } catch (error) {
            console.log('无法直接修改iframe内容，跨域限制:', error.message);
            // 使用其他优化方案
            this.alternativeOptimization(iframe);
        }
    }
    
    // 注入移动端优化CSS
    injectMobileCSS(doc) {
        const style = doc.createElement('style');
        style.textContent = `
            /* 移动端强制优化样式 */
            * {
                -webkit-text-size-adjust: 100% !important;
                -ms-text-size-adjust: 100% !important;
                text-size-adjust: 100% !important;
            }
            
            body {
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: hidden !important;
                -webkit-overflow-scrolling: touch !important;
                font-size: 16px !important;
                line-height: 1.5 !important;
            }
            
            /* 隐藏桌面端导航 */
            .desktop-nav,
            .pc-nav,
            .desktop-only,
            .pc-only,
            .sidebar,
            .left-sidebar,
            .right-sidebar {
                display: none !important;
            }
            
            /* 强制移动端布局 */
            .container,
            .main-content,
            .content {
                width: 100% !important;
                max-width: 100% !important;
                padding: 10px !important;
                margin: 0 !important;
            }
            
            /* 优化表格显示 */
            table {
                width: 100% !important;
                font-size: 14px !important;
                overflow-x: auto !important;
                display: block !important;
                white-space: nowrap !important;
            }
            
            /* 优化图片显示 */
            img {
                max-width: 100% !important;
                height: auto !important;
            }
            
            /* 优化按钮和链接 */
            button, a, input[type="button"], input[type="submit"] {
                min-height: 44px !important;
                padding: 12px 16px !important;
                font-size: 16px !important;
                touch-action: manipulation !important;
            }
            
            /* 优化输入框 */
            input, textarea, select {
                font-size: 16px !important;
                padding: 12px !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }
            
            /* 强制单列布局 */
            .col-md-6, .col-lg-6, .col-xl-6,
            .col-md-4, .col-lg-4, .col-xl-4,
            .col-md-3, .col-lg-3, .col-xl-3,
            .col-md-2, .col-lg-2, .col-xl-2 {
                width: 100% !important;
                float: none !important;
                display: block !important;
            }
            
            /* 优化弹窗 */
            .modal, .popup, .dialog {
                width: 95% !important;
                max-width: 95% !important;
                margin: 10px auto !important;
            }
            
            /* 隐藏不必要的元素 */
            .advertisement, .ads, .banner-ad,
            .desktop-banner, .pc-banner {
                display: none !important;
            }
            
            /* 优化导航菜单 */
            .nav, .navbar, .menu {
                flex-direction: column !important;
                width: 100% !important;
            }
            
            .nav-item, .menu-item {
                width: 100% !important;
                display: block !important;
            }
        `;
        
        doc.head.appendChild(style);
    }
    
    // 设置移动端viewport
    setMobileViewport(doc) {
        // 移除现有的viewport标签
        const existingViewport = doc.querySelector('meta[name="viewport"]');
        if (existingViewport) {
            existingViewport.remove();
        }
        
        // 添加移动端viewport
        const viewport = doc.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
        doc.head.appendChild(viewport);
        
        // 添加移动端兼容性标签
        const compatible = doc.createElement('meta');
        compatible.httpEquiv = 'X-UA-Compatible';
        compatible.content = 'IE=edge,chrome=1';
        doc.head.appendChild(compatible);
        
        // 添加移动端格式检测
        const formatDetection = doc.createElement('meta');
        formatDetection.name = 'format-detection';
        formatDetection.content = 'telephone=no, email=no, address=no';
        doc.head.appendChild(formatDetection);
    }
    
    // 优化触摸交互
    optimizeTouchInteraction(doc) {
        const touchScript = doc.createElement('script');
        touchScript.textContent = `
            // 优化触摸滚动
            document.addEventListener('touchstart', function(e) {
                // 允许触摸事件
            }, { passive: true });
            
            document.addEventListener('touchmove', function(e) {
                // 优化滚动性能
            }, { passive: true });
            
            // 防止双击缩放
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            
            // 优化点击延迟
            document.addEventListener('click', function(e) {
                // 移除300ms点击延迟
            }, true);
        `;
        
        doc.body.appendChild(touchScript);
    }
    
    // 隐藏桌面端元素
    hideDesktopElements(doc) {
        const desktopSelectors = [
            '.desktop-only', '.pc-only', '.hide-mobile',
            '.sidebar', '.left-sidebar', '.right-sidebar',
            '.desktop-nav', '.pc-nav', '.desktop-header',
            '.advertisement', '.ads', '.banner-ad'
        ];
        
        desktopSelectors.forEach(selector => {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });
    }
    
    // 强制移动端布局
    forceMobileLayout(doc) {
        // 强制body宽度
        if (doc.body) {
            doc.body.style.width = '100%';
            doc.body.style.maxWidth = '100%';
            doc.body.style.overflowX = 'hidden';
        }
        
        // 强制html宽度
        if (doc.documentElement) {
            doc.documentElement.style.width = '100%';
            doc.documentElement.style.maxWidth = '100%';
        }
        
        // 移除固定宽度
        const fixedWidthElements = doc.querySelectorAll('[style*="width"]');
        fixedWidthElements.forEach(el => {
            const style = el.getAttribute('style');
            if (style && style.includes('width') && !style.includes('max-width')) {
                el.style.width = '100%';
                el.style.maxWidth = '100%';
            }
        });
    }
    
    // 替代优化方案（跨域时使用）
    alternativeOptimization(iframe) {
        // 设置iframe样式
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        // 尝试通过postMessage与iframe通信
        this.setupIframeMessaging(iframe);
        
        // 监听iframe URL变化
        this.monitorIframeUrl(iframe);
    }
    
    // 设置iframe消息通信
    setupIframeMessaging(iframe) {
        // 向iframe发送优化指令
        const sendOptimizationMessage = () => {
            try {
                iframe.contentWindow.postMessage({
                    type: 'MOBILE_OPTIMIZATION',
                    userAgent: this.mobileUserAgent,
                    viewport: 'width=device-width, initial-scale=1.0'
                }, '*');
            } catch (error) {
                console.log('无法发送优化消息');
            }
        };
        
        // 延迟发送消息
        setTimeout(sendOptimizationMessage, 1000);
        
        // 监听来自iframe的消息
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'IFRAME_READY') {
                sendOptimizationMessage();
            }
        });
    }
    
    // 监听iframe URL变化
    monitorIframeUrl(iframe) {
        let lastUrl = iframe.src;
        
        const checkUrl = () => {
            try {
                const currentUrl = iframe.contentWindow.location.href;
                if (currentUrl !== lastUrl) {
                    lastUrl = currentUrl;
                    // URL变化时重新优化
                    setTimeout(() => {
                        this.optimizeIframeContent(iframe);
                    }, 500);
                }
            } catch (error) {
                // 跨域限制，无法获取URL
            }
        };
        
        // 定期检查URL变化
        setInterval(checkUrl, 2000);
    }
    
    // 设置移动端viewport（主页面）
    setupMobileViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
        }
    }
    
    // 设置触摸优化（主页面）
    setupTouchOptimization() {
        // 优化触摸滚动
        document.addEventListener('touchstart', function(e) {
            // 允许触摸事件
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            // 优化滚动性能
        }, { passive: true });
        
        // 防止双击缩放（在iframe外部）
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    // 强制移动端显示特定网站
    forceMobileVersion(url) {
        return this.convertToMobileUrl(url);
    }
    
    // 检测是否为移动端URL
    isMobileUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            return hostname.startsWith('m.') || 
                   hostname.includes('mobile') || 
                   hostname.includes('wap') ||
                   hostname.includes('touch');
        } catch (error) {
            return false;
        }
    }
}

// 全局实例
let mobileOptimizer;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    mobileOptimizer = new MobileForceOptimizer();
});

// 导出给其他脚本使用
window.MobileForceOptimizer = MobileForceOptimizer;