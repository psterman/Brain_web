// 移动端页面切换优化 - 防止暗色模式白色漏光

class PageTransitionOptimizer {
    constructor() {
        this.isInitialized = false;
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // 监听DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
        
        this.isInitialized = true;
    }

    setup() {
        // 检测当前主题
        this.detectTheme();
        
        // 预设所有页面的背景色
        this.presetPageBackgrounds();
        
        // 监听主题变化
        this.observeThemeChanges();
        
        // 优化页面切换
        this.optimizePageTransitions();
        
        // 监听页面可见性变化
        this.handleVisibilityChange();
    }

    detectTheme() {
        const body = document.body;
        if (body.hasAttribute('data-theme')) {
            this.currentTheme = body.getAttribute('data-theme');
        } else if (body.classList.contains('dark-theme')) {
            this.currentTheme = 'dark';
        } else {
            this.currentTheme = 'light';
        }
    }

    presetPageBackgrounds() {
        const pages = document.querySelectorAll('.page');
        const isDark = this.currentTheme === 'dark';
        const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
        
        pages.forEach(page => {
            // 设置页面背景色
            page.style.backgroundColor = backgroundColor;
            
            // 确保页面在非激活状态下也有正确的背景色
            if (!page.classList.contains('active')) {
                page.style.display = 'none';
                page.style.backgroundColor = backgroundColor;
            }
        });

        // 设置body和html的背景色
        document.body.style.backgroundColor = backgroundColor;
        document.documentElement.style.backgroundColor = backgroundColor;
        
        // 设置app-content的背景色
        const appContent = document.querySelector('.app-content');
        if (appContent) {
            appContent.style.backgroundColor = backgroundColor;
        }
    }

    observeThemeChanges() {
        // 监听data-theme属性变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
                    this.detectTheme();
                    this.presetPageBackgrounds();
                }
            });
        });

        // 观察body元素的属性变化
        if (document.body) {
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['data-theme', 'class']
            });
        }

        // 观察documentElement的属性变化
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });
    }

    optimizePageTransitions() {
        // 重写原始的showPage方法
        if (window.MobileApp && window.MobileApp.prototype.showPage) {
            const originalShowPage = window.MobileApp.prototype.showPage;
            
            window.MobileApp.prototype.showPage = function(pageId) {
                // 在切换前确保所有页面都有正确的背景色
                const optimizer = window.pageTransitionOptimizer;
                if (optimizer) {
                    optimizer.presetPageBackgrounds();
                }
                
                // 调用原始方法
                return originalShowPage.call(this, pageId);
            };
        }

        // 监听页面切换事件
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                // 在导航点击时立即设置背景
                setTimeout(() => this.presetPageBackgrounds(), 0);
            }
        });
    }

    handleVisibilityChange() {
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // 页面重新可见时，确保背景色正确
                setTimeout(() => this.presetPageBackgrounds(), 100);
            }
        });

        // 监听窗口焦点变化
        window.addEventListener('focus', () => {
            setTimeout(() => this.presetPageBackgrounds(), 100);
        });
    }

    // 强制刷新所有页面背景
    forceRefreshBackgrounds() {
        this.detectTheme();
        this.presetPageBackgrounds();
    }

    // 手动设置主题
    setTheme(theme) {
        this.currentTheme = theme;
        this.presetPageBackgrounds();
    }
}

// 创建全局实例
window.pageTransitionOptimizer = new PageTransitionOptimizer();

// 导出类以供其他脚本使用
window.PageTransitionOptimizer = PageTransitionOptimizer;

// 确保在主题切换时立即更新
document.addEventListener('DOMContentLoaded', () => {
    // 监听主题切换按钮
    const themeToggle = document.querySelector('input[type="checkbox"][onchange*="theme"]');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            setTimeout(() => {
                if (window.pageTransitionOptimizer) {
                    window.pageTransitionOptimizer.forceRefreshBackgrounds();
                }
            }, 50);
        });
    }

    // 监听所有可能的主题切换事件
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('.theme-toggle, .dark-mode-toggle, [data-theme-toggle]') ||
            target.closest('.theme-toggle, .dark-mode-toggle, [data-theme-toggle]')) {
            setTimeout(() => {
                if (window.pageTransitionOptimizer) {
                    window.pageTransitionOptimizer.forceRefreshBackgrounds();
                }
            }, 100);
        }
    });
});

// 在页面加载时立即执行一次
if (document.readyState !== 'loading') {
    setTimeout(() => {
        if (window.pageTransitionOptimizer) {
            window.pageTransitionOptimizer.forceRefreshBackgrounds();
        }
    }, 100);
}