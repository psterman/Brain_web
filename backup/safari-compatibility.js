// Safari兼容性增强脚本
(function() {
    'use strict';
    
    // 检测Safari浏览器
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
        console.log('Safari browser detected, applying compatibility fixes...');
        
        // Safari主题切换增强 - 保护动画元素
        function enforceSafariTheme() {
            const body = document.body;
            const html = document.documentElement;
            const isDark = body.classList.contains('dark-theme');
            
            if (isDark) {
                // 强制应用暗色主题
                body.style.setProperty('background-color', '#111827', 'important');
                body.style.setProperty('color', '#f9fafb', 'important');
                html.style.setProperty('background-color', '#111827', 'important');
            } else {
                // 强制应用亮色主题
                body.style.setProperty('background-color', '#ffffff', 'important');
                body.style.setProperty('color', '#111827', 'important');
                html.style.setProperty('background-color', '#ffffff', 'important');
                
                // 仅在Safari中执行样式修复
                if (isSafari) {
                    forceSafariLightModeStyles();
                }
            }
            
            // 强制刷新样式
            body.offsetHeight; // 触发重绘
            html.offsetHeight; // 触发重绘
        }
        
        // Safari专用亮色模式样式修复 - 不影响动画
        function forceSafariLightModeStyles() {
            // 只在Safari中执行
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (!isSafari) return;
            
            // 修复卡片元素
            const cards = document.querySelectorAll('.card-apple');
            cards.forEach(card => {
                card.style.setProperty('background-color', '#ffffff', 'important');
                card.style.setProperty('color', '#111827', 'important');
            });
            
            // 修复区域背景
            const sections = [
                { selector: '#features', bgColor: '#ffffff' },
                { selector: '#guide', bgColor: '#f9fafb' },
                { selector: '#faq', bgColor: '#ffffff' },
                { selector: 'footer', bgColor: '#f9fafb' }
            ];
            
            sections.forEach(({ selector, bgColor }) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.setProperty('background-color', bgColor, 'important');
                }
            });
            
            // 修复文字颜色
            const textElements = document.querySelectorAll('h1, h2, h3, h4, p, .text-gray-900, .text-gray-600');
            textElements.forEach(el => {
                // 跳过动画元素
                if (el.closest('.neural-bg') || 
                    el.classList.contains('star') ||
                    el.classList.contains('meteor') ||
                    el.classList.contains('constellation') ||
                    el.classList.contains('brain-container') ||
                    el.classList.contains('brain-region') ||
                    el.classList.contains('star-connection')) {
                    return;
                }
                
                if (el.tagName.match(/^H[1-6]$/) || el.classList.contains('text-gray-900')) {
                    el.style.setProperty('color', '#111827', 'important');
                } else if (el.tagName === 'P' || el.classList.contains('text-gray-600')) {
                    el.style.setProperty('color', '#4b5563', 'important');
                }
            });
        }
        
        // DOM加载完成后执行
        document.addEventListener('DOMContentLoaded', function() {
            // 初始主题强制应用
            enforceSafariTheme();
            
            // 监听主题变化
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        setTimeout(enforceSafariTheme, 10);
                    }
                });
            });
            
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            // 增强主题切换按钮
            setTimeout(function() {
                const themeButton = document.querySelector('[class*="fixed"][class*="top-20"]');
                if (themeButton) {
                    themeButton.addEventListener('click', function() {
                        setTimeout(enforceSafariTheme, 50);
                    });
                }
            }, 1000);
        });
        
        // 页面可见性变化时重新应用主题
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(enforceSafariTheme, 100);
            }
        });
        
        // 窗口焦点变化时重新应用主题
        window.addEventListener('focus', function() {
            setTimeout(enforceSafariTheme, 100);
        });
        
        // Safari文字颜色修复 - 仅针对内容元素
        function fixSafariTextColors() {
            // 只在Safari中执行
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (!isSafari) return;
            
            const isDark = document.body.classList.contains('dark-theme');
            
            if (!isDark) {
                // 亮色模式下的文字颜色修复
                const textElements = document.querySelectorAll('nav a, nav span, .card-apple h3, .card-apple h4, .card-apple p');
                textElements.forEach(el => {
                    // 跳过动画元素
                    if (el.closest('.neural-bg') || 
                        el.classList.contains('star') ||
                        el.classList.contains('meteor') ||
                        el.classList.contains('constellation')) {
                        return;
                    }
                    
                    if (el.classList.contains('text-primary-600') || el.classList.contains('text-primary-400')) {
                        el.style.setProperty('color', '#16a34a', 'important');
                    } else if (el.tagName.match(/^H[1-6]$/)) {
                        el.style.setProperty('color', '#111827', 'important');
                    } else {
                        el.style.setProperty('color', '#4b5563', 'important');
                    }
                });
            }
        }
        
        // 定期检查并修复文字颜色
        setInterval(fixSafariTextColors, 1000);
        
        // 初始修复
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(fixSafariTextColors, 100);
        });
    }
})();