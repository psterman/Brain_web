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
        
        // 绑定主题切换按钮
        this.bindThemeToggles();
    }
    
    bindThemeToggles() {
        // 状态栏主题切换按钮
        const statusThemeToggle = document.getElementById('themeToggle');
        if (statusThemeToggle) {
            statusThemeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        // 设置页面主题切换开关
        const settingsThemeToggle = document.getElementById('theme-toggle');
        if (settingsThemeToggle) {
            settingsThemeToggle.addEventListener('change', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }
    }
    
    observeThemeChanges() {
        // 确保DOM已加载
        if (!document.body || !document.documentElement) {
            setTimeout(() => this.observeThemeChanges(), 100);
            return;
        }
        
        // 防止重复创建observer
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // 防抖处理，避免频繁触发
        let debounceTimer = null;
        
        // 监听body的data-theme属性变化
        this.observer = new MutationObserver((mutations) => {
            // 防止在同步主题时触发无限循环
            if (this.isSyncing) {
                return;
            }
            
            let shouldSync = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'data-theme' || 
                     mutation.attributeName === 'class')) {
                    shouldSync = true;
                }
            });
            
            if (shouldSync) {
                // 防抖处理
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.syncTheme();
                }, 50);
            }
        });
        
        try {
            this.observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['data-theme', 'class']
            });
            
            this.observer.observe(document.documentElement, {
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
        // 防止重复同步
        if (this.isSyncing) {
            return;
        }
        
        // 确保DOM已加载
        if (!document.body || !document.documentElement) {
            setTimeout(() => this.syncTheme(), 100);
            return;
        }
        
        this.isSyncing = true;
        
        try {
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
        } finally {
            // 延迟重置标志，确保所有相关操作完成
            setTimeout(() => {
                this.isSyncing = false;
            }, 100);
        }
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
        
        // 更新主题图标
        this.updateThemeIcon(theme);
        
        // 更新所有tab的状态
        this.updateTabStates();
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }
    
    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // 更新设置页面的开关状态
        const themeToggleSwitch = document.getElementById('theme-toggle');
        if (themeToggleSwitch) {
            themeToggleSwitch.checked = theme === 'dark';
        }
    }
    
    updateTabStates() {
        // 使用requestAnimationFrame优化性能
        requestAnimationFrame(() => {
            // 更新所有激活状态的tab
            const activeTabs = document.querySelectorAll(
                '.ai-tab.active, .config-tab.active, .category-item.active, .nav-item.active'
            );
            
            activeTabs.forEach(tab => {
                // 使用CSS类切换而不是强制重排
                tab.classList.add('theme-updating');
                setTimeout(() => {
                    tab.classList.remove('theme-updating');
                }, 10);
            });
            
            // 更新导航图标颜色
            const activeNavItems = document.querySelectorAll('.nav-item.active');
            activeNavItems.forEach(item => {
                const icon = item.querySelector('.nav-icon');
                const label = item.querySelector('.nav-label');
                
                if (icon) {
                    icon.classList.add('theme-updating');
                    setTimeout(() => {
                        icon.classList.remove('theme-updating');
                    }, 10);
                }
                
                if (label) {
                    label.classList.add('theme-updating');
                    setTimeout(() => {
                        label.classList.remove('theme-updating');
                    }, 10);
                }
            });
        });
    }
    
    // 公共方法：切换主题
    toggleTheme() {
        // 防止重复点击
        if (this.isToggling || this.isSyncing) {
            return;
        }
        
        this.isToggling = true;
        
        try {
            const currentTheme = document.body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            localStorage.setItem('theme', newTheme);
            this.applyTheme(newTheme);
            
            return newTheme;
        } finally {
            // 延迟重置标志
            setTimeout(() => {
                this.isToggling = false;
            }, 300);
        }
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