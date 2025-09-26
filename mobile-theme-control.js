// 移动端主题控制脚本 - 统一主题切换功能

class MobileThemeController {
    constructor() {
        this.isToggling = false;
        this.init();
    }

    init() {
        // 绑定所有主题切换按钮
        this.bindThemeToggles();
        
        // 初始化主题状态
        this.initTheme();
        
        // 监听系统主题变化
        this.watchSystemTheme();
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

    initTheme() {
        // 从本地存储获取主题设置
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let isDark = false;
        
        if (savedTheme) {
            isDark = savedTheme === 'dark';
        } else {
            isDark = systemPrefersDark;
        }
        
        this.applyTheme(isDark);
        this.updateToggleStates(isDark);
    }

    toggleTheme() {
        try {
            // 防止重复点击导致卡住
            if (this.isToggling) {
                return;
            }
            this.isToggling = true;
            
            const body = document.body;
            const isDark = body.classList.contains('dark-theme') || body.getAttribute('data-theme') === 'dark';
            const newTheme = !isDark;
            
            this.applyTheme(newTheme);
            this.updateToggleStates(newTheme);
            
            // 保存到本地存储
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            
            // 触发主题变化事件
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { isDark: newTheme } 
            }));
            
            // 重置防重复标志
            setTimeout(() => {
                this.isToggling = false;
            }, 300);
        } catch (error) {
            console.error('Theme toggle error:', error);
            this.isToggling = false;
        }
    }

    applyTheme(isDark) {
        const body = document.body;
        
        try {
            // 添加过渡效果防止闪烁
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            
            if (isDark) {
                // 应用暗色主题
                body.classList.add('dark-theme');
                body.setAttribute('data-theme', 'dark');
            } else {
                // 应用亮色主题
                body.classList.remove('dark-theme');
                body.setAttribute('data-theme', 'light');
            }
            
            // 强制重新渲染所有元素
            requestAnimationFrame(() => {
                // 触发样式重新计算
                body.offsetHeight;
                
                // 通知所有页面元素更新主题
                const allElements = document.querySelectorAll('*');
                allElements.forEach(el => {
                    if (el.style) {
                        el.style.transition = 'all 0.3s ease';
                    }
                });
                
                // 移除过渡效果
                setTimeout(() => {
                    body.style.transition = '';
                    allElements.forEach(el => {
                        if (el.style) {
                            el.style.transition = '';
                        }
                    });
                }, 300);
            });
        } catch (error) {
            console.error('Theme application error:', error);
        }
    }

    updateToggleStates(isDark) {
        // 更新状态栏主题图标
        const statusThemeToggle = document.getElementById('themeToggle');
        if (statusThemeToggle) {
            const themeIcon = statusThemeToggle.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = isDark ? '☀️' : '🌙';
            }
        }

        // 更新设置页面开关状态
        const settingsThemeToggle = document.getElementById('theme-toggle');
        if (settingsThemeToggle) {
            settingsThemeToggle.checked = isDark;
        }
    }

    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener((e) => {
            // 只有在没有手动设置主题时才跟随系统
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                this.applyTheme(e.matches);
                this.updateToggleStates(e.matches);
            }
        });
    }
}

// 主题控制器类定义（已禁用自动初始化，由mobile-theme-sync.js统一管理）
// 如需手动初始化，请使用: new MobileThemeController();

// 注释掉自动初始化，避免与mobile-theme-sync.js冲突
/*
document.addEventListener('DOMContentLoaded', () => {
    new MobileThemeController();
});

// 确保在页面加载完成后立即初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileThemeController();
    });
} else {
    new MobileThemeController();
}
*/