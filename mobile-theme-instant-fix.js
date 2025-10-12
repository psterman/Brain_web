// 移动端主题即时切换修复脚本

class InstantThemeController {
    constructor() {
        this.isToggling = false;
        this.init();
    }

    init() {
        // 立即绑定主题切换按钮
        this.bindThemeToggles();
        
        // 初始化主题状态
        this.initTheme();
        
        // 强制刷新所有样式
        this.forceStyleRefresh();
    }

    bindThemeToggles() {
        // 使用事件委托确保按钮能被找到
        document.addEventListener('click', (e) => {
            if (e.target.id === 'themeToggle' || e.target.closest('#themeToggle')) {
                e.preventDefault();
                e.stopPropagation();
                this.instantToggleTheme();
            }
        });

        // 设置页面的开关
        document.addEventListener('change', (e) => {
            if (e.target.id === 'theme-toggle') {
                e.preventDefault();
                e.stopPropagation();
                this.instantToggleTheme();
            }
        });
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let isDark = false;
        if (savedTheme) {
            isDark = savedTheme === 'dark';
        } else {
            isDark = systemPrefersDark;
        }
        
        this.instantApplyTheme(isDark);
        this.updateAllToggleStates(isDark);
    }

    instantToggleTheme() {
        if (this.isToggling) return;
        this.isToggling = true;
        
        try {
            const body = document.body;
            const html = document.documentElement;
            
            // 检查当前主题状态
            const isDarkNow = body.classList.contains('dark-theme') || 
                             body.getAttribute('data-theme') === 'dark' ||
                             html.classList.contains('dark-theme') ||
                             html.getAttribute('data-theme') === 'dark';
            
            const newTheme = !isDarkNow;
            
            // 立即应用新主题
            this.instantApplyTheme(newTheme);
            this.updateAllToggleStates(newTheme);
            
            // 保存设置
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            
            // 强制重新渲染
            this.forceStyleRefresh();
            
            console.log(`主题切换: ${isDarkNow ? '暗色' : '亮色'} -> ${newTheme ? '暗色' : '亮色'}`);
            
        } catch (error) {
            console.error('主题切换错误:', error);
        } finally {
            setTimeout(() => {
                this.isToggling = false;
            }, 50);
        }
    }

    instantApplyTheme(isDark) {
        const body = document.body;
        const html = document.documentElement;
        
        // 移除所有现有的主题类
        body.classList.remove('dark-theme', 'light-theme');
        html.classList.remove('dark-theme', 'light-theme');
        body.removeAttribute('data-theme');
        html.removeAttribute('data-theme');
        
        // 强制重绘
        body.offsetHeight;
        
        if (isDark) {
            // 应用暗色主题 - 多种方式确保生效
            body.classList.add('dark-theme');
            html.classList.add('dark-theme');
            body.setAttribute('data-theme', 'dark');
            html.setAttribute('data-theme', 'dark');
            body.style.setProperty('--theme-mode', 'dark');
        } else {
            // 应用亮色主题
            body.classList.add('light-theme');
            html.classList.add('light-theme');
            body.setAttribute('data-theme', 'light');
            html.setAttribute('data-theme', 'light');
            body.style.setProperty('--theme-mode', 'light');
        }
        
        // 立即触发重绘
        body.offsetHeight;
        html.offsetHeight;
        
        // 强制所有元素重新计算样式
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.offsetHeight !== undefined) {
                el.offsetHeight;
            }
        });
    }

    updateAllToggleStates(isDark) {
        // 更新状态栏主题图标
        const statusThemeToggle = document.getElementById('themeToggle');
        if (statusThemeToggle) {
            const themeIcon = statusThemeToggle.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = isDark ? '☀️' : '🌙';
            }
            statusThemeToggle.title = isDark ? '切换到亮色模式' : '切换到暗色模式';
        }

        // 更新设置页面开关状态
        const settingsThemeToggle = document.getElementById('theme-toggle');
        if (settingsThemeToggle) {
            settingsThemeToggle.checked = isDark;
        }

        // 更新所有可能的主题切换按钮
        const allThemeButtons = document.querySelectorAll('[data-theme-toggle], .theme-toggle, .theme-switch');
        allThemeButtons.forEach(btn => {
            if (btn.type === 'checkbox') {
                btn.checked = isDark;
            }
        });
    }

    forceStyleRefresh() {
        // 强制浏览器重新计算所有样式
        const style = document.createElement('style');
        style.textContent = '/* force refresh */';
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.head.removeChild(style);
        }, 1);
        
        // 触发窗口resize事件，强制重新渲染
        window.dispatchEvent(new Event('resize'));
        
        // 触发自定义主题变化事件
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { 
                isDark: document.body.classList.contains('dark-theme'),
                timestamp: Date.now()
            }
        }));
    }
}

// 立即执行，不等待DOM加载完成
(function() {
    let themeController;
    
    function initThemeController() {
        if (!themeController) {
            themeController = new InstantThemeController();
        }
    }
    
    // 多种方式确保脚本执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeController);
    } else {
        initThemeController();
    }
    
    // 备用初始化
    setTimeout(initThemeController, 100);
})();

// 全局函数，供其他脚本调用
window.toggleThemeInstant = function() {
    if (window.instantThemeController) {
        window.instantThemeController.instantToggleTheme();
    }
};