// 移动端主题同步脚本 - 确保所有tab颜色适配正确

class MobileThemeSync {
    constructor() {
        this.init();
    }
    
    init() {
        // 监听主题变化
        this.observeThemeChanges();
        
        // 初始化主题
        this.syncTheme();
        
        // 监听系统主题变化
        this.observeSystemTheme();
    }
    
    observeThemeChanges() {
        // 确保DOM已加载
        if (!document.body || !document.documentElement) {
            setTimeout(() => this.observeThemeChanges(), 100);
            return;
        }
        
        // 监听body的data-theme属性变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'data-theme' || 
                     mutation.attributeName === 'class')) {
                    this.syncTheme();
                }
            });
        });
        
        try {
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['data-theme', 'class']
            });
            
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-theme', 'class']
            });
        } catch (error) {
            console.warn('Theme observer setup failed:', error);
        }
    }
    
    observeSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // 只有在没有手动设置主题时才跟随系统
                if (!localStorage.getItem('theme')) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                }
            });
        }
    }
    
    syncTheme() {
        const bodyTheme = document.body.getAttribute('data-theme');
        const htmlTheme = document.documentElement.getAttribute('data-theme');
        const hasDarkClass = document.body.classList.contains('dark-theme');
        
        // 确定当前主题
        let currentTheme = bodyTheme || htmlTheme || (hasDarkClass ? 'dark' : 'light');
        
        // 如果没有明确的主题设置，检查localStorage
        if (!currentTheme || currentTheme === 'null') {
            currentTheme = localStorage.getItem('theme') || 'light';
        }
        
        // 应用主题
        this.applyTheme(currentTheme);
    }
    
    applyTheme(theme) {
        const body = document.body;
        const html = document.documentElement;
        
        // 设置属性
        body.setAttribute('data-theme', theme);
        html.setAttribute('data-theme', theme);
        
        // 设置类
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            html.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
            html.classList.remove('dark-theme');
        }
        
        // 更新所有tab的状态
        this.updateTabStates();
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }
    
    updateTabStates() {
        // 强制更新所有激活状态的tab
        const activeTabs = document.querySelectorAll(
            '.ai-tab.active, .config-tab.active, .category-item.active, .nav-item.active'
        );
        
        activeTabs.forEach(tab => {
            // 触发重绘
            tab.style.display = 'none';
            tab.offsetHeight; // 强制重排
            tab.style.display = '';
        });
        
        // 更新导航图标颜色
        const activeNavItems = document.querySelectorAll('.nav-item.active');
        activeNavItems.forEach(item => {
            const icon = item.querySelector('.nav-icon');
            const label = item.querySelector('.nav-label');
            
            if (icon) {
                icon.style.display = 'none';
                icon.offsetHeight;
                icon.style.display = '';
            }
            
            if (label) {
                label.style.display = 'none';
                label.offsetHeight;
                label.style.display = '';
            }
        });
    }
    
    // 公共方法：切换主题
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        localStorage.setItem('theme', newTheme);
        this.applyTheme(newTheme);
        
        return newTheme;
    }
    
    // 公共方法：获取当前主题
    getCurrentTheme() {
        return document.body.getAttribute('data-theme') || 'light';
    }
    
    // 公共方法：设置主题
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            localStorage.setItem('theme', theme);
            this.applyTheme(theme);
        }
    }
}

// 创建全局实例
window.mobileThemeSync = new MobileThemeSync();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileThemeSync;
}

// 兼容旧的主题切换方法
window.toggleMobileTheme = () => {
    return window.mobileThemeSync.toggleTheme();
};

// 页面加载完成后立即同步主题
document.addEventListener('DOMContentLoaded', () => {
    window.mobileThemeSync.syncTheme();
});

// 如果页面已经加载完成，立即执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileThemeSync.syncTheme();
    });
} else {
    window.mobileThemeSync.syncTheme();
}