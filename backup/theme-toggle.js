// 主题切换功能
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
    }

    applyTheme(theme) {
        const body = document.body;
        const html = document.documentElement;
        
        // 移除所有主题类
        body.classList.remove('dark-theme');
        html.classList.remove('dark-theme');
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            html.classList.add('dark-theme');
            // Safari强制样式应用
            body.style.setProperty('background-color', '#111827', 'important');
            body.style.setProperty('color', '#f9fafb', 'important');
            html.style.setProperty('background-color', '#111827', 'important');
        } else {
            // Safari强制样式应用
            body.style.setProperty('background-color', '#ffffff', 'important');
            body.style.setProperty('color', '#111827', 'important');
            html.style.setProperty('background-color', '#ffffff', 'important');
            
            // 超强制修复所有可能的暗色残留
            this.forceLightModeCleanup();
        }
        
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // 强制重绘（Safari兼容）
        body.offsetHeight;
        html.offsetHeight;
        
        // 延迟修复样式
        setTimeout(() => {
            this.forceStyleRefresh();
        }, 10);
        
        // Safari专用额外延迟修复
        setTimeout(() => {
            this.safariSpecificFix();
        }, 50);
    }
    
    forceStyleRefresh() {
        const body = document.body;
        const isDark = this.currentTheme === 'dark';
        
        // 强制修复文字颜色
        const textElements = document.querySelectorAll('h1, h2, h3, h4, p, a, span');
        textElements.forEach(el => {
            if (!isDark) {
                if (el.classList.contains('text-gray-900') || el.tagName.match(/^H[1-4]$/)) {
                    el.style.color = '#111827';
                } else if (el.classList.contains('text-gray-600') || el.tagName === 'P') {
                    el.style.color = '#4b5563';
                }
            } else {
                if (el.classList.contains('text-gray-900') || el.tagName.match(/^H[1-4]$/)) {
                    el.style.color = '#f9fafb';
                } else if (el.classList.contains('text-gray-600') || el.tagName === 'P') {
                    el.style.color = '#d1d5db';
                }
            }
        });
    }
    
    forceLightModeCleanup() {
        // 仅在Safari中执行强制清理所有暗色模式残留
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (!isSafari) return;
        
        const allElements = document.querySelectorAll('*:not(.star):not(.meteor):not(.constellation):not(.brain-container):not(.brain-region):not(.star-connection):not(.neural-bg)');
        allElements.forEach(el => {
            if (el.tagName === 'SCRIPT' || 
                el.tagName === 'STYLE' || 
                el.tagName === 'LINK' ||
                el.classList.contains('star') ||
                el.classList.contains('meteor') ||
                el.classList.contains('constellation') ||
                el.classList.contains('brain-container') ||
                el.classList.contains('brain-region') ||
                el.classList.contains('star-connection') ||
                el.classList.contains('neural-bg')) return;
            
            const computedStyle = window.getComputedStyle(el);
            
            // 检查并修复暗色背景
            if (computedStyle.backgroundColor.includes('17, 24, 39') || // #111827
                computedStyle.backgroundColor.includes('31, 41, 55') || // #1f2937
                computedStyle.backgroundColor.includes('55, 65, 81')) { // #374151
                el.style.setProperty('background-color', '#ffffff', 'important');
            }
            
            // 检查并修复暗色文字
            if (computedStyle.color.includes('249, 250, 251') || // #f9fafb
                computedStyle.color.includes('255, 255, 255')) { // #ffffff
                el.style.setProperty('color', '#111827', 'important');
            }
        });
    }
    
    safariSpecificFix() {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (!isSafari || this.currentTheme === 'dark') return;
        
        // Safari专用亮色模式修复
        const body = document.body;
        const html = document.documentElement;
        
        // 强制重新应用亮色模式
        body.style.setProperty('background-color', '#ffffff', 'important');
        body.style.setProperty('color', '#111827', 'important');
        html.style.setProperty('background-color', '#ffffff', 'important');
        
        // 修复卡片元素（排除动画元素）
        const cards = document.querySelectorAll('.card-apple:not(.star):not(.meteor):not(.constellation)');
        cards.forEach(card => {
            card.style.setProperty('background-color', '#ffffff', 'important');
            card.style.setProperty('color', '#111827', 'important');
            
            const cardChildren = card.querySelectorAll('*:not(.star):not(.meteor):not(.constellation):not(.brain-container):not(.brain-region):not(.star-connection)');
            cardChildren.forEach(child => {
                if (child.tagName !== 'SCRIPT' && 
                    child.tagName !== 'STYLE' && 
                    child.tagName !== 'LINK' &&
                    !child.classList.contains('star') &&
                    !child.classList.contains('meteor') &&
                    !child.classList.contains('constellation') &&
                    !child.classList.contains('brain-container') &&
                    !child.classList.contains('brain-region') &&
                    !child.classList.contains('star-connection') &&
                    !child.classList.contains('neural-bg')) {
                    child.style.setProperty('background-color', 'transparent', 'important');
                    child.style.setProperty('color', '#111827', 'important');
                }
            });
        });
        
        // 修复区域背景
        const sections = {
            '#features': '#ffffff',
            '#guide': '#f9fafb',
            '#faq': '#ffffff',
            'footer': '#f9fafb'
        };
        
        Object.entries(sections).forEach(([selector, bgColor]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.setProperty('background-color', bgColor, 'important');
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'fixed top-20 right-4 z-50 w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center';
        toggleButton.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
        
        toggleButton.addEventListener('click', () => {
            this.toggleTheme();
            toggleButton.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
        });

        document.body.appendChild(toggleButton);
    }
}

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});