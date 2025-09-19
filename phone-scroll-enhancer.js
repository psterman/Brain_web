// 手机滚动体验增强器
class PhoneScrollEnhancer {
    constructor() {
        this.scrollElements = [];
        this.scrollTimers = new Map();
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // 监听的滚动容器
        this.scrollContainers = [
            '.phone-ai-messages',
            '.phone-browser-content', 
            '.app-content',
            '.app-categories',
            '.search-engine-config',
            '.search-categories',
            '.phone-widgets'
        ];

        this.enhanceScrollElements();
        this.addScrollIndicators();
        this.setupScrollListeners();
        
        console.log('手机滚动体验增强器初始化完成');
    }

    enhanceScrollElements() {
        this.scrollElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.enhanceElement(element);
            });
        });
    }

    enhanceElement(element) {
        // 添加滚动状态类
        element.classList.add('scroll-enhanced');
        
        // 设置相对定位以支持指示器
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
    }

    addScrollIndicators() {
        this.scrollElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.createScrollIndicator(element);
            });
        });
    }

    createScrollIndicator(element) {
        // 创建顶部滚动指示器
        const topIndicator = document.createElement('div');
        topIndicator.className = 'scroll-indicator scroll-indicator-top';
        topIndicator.innerHTML = '⬆️';
        
        // 创建底部滚动指示器
        const bottomIndicator = document.createElement('div');
        bottomIndicator.className = 'scroll-indicator scroll-indicator-bottom';
        bottomIndicator.innerHTML = '⬇️';
        
        // 添加样式
        this.styleIndicator(topIndicator, 'top');
        this.styleIndicator(bottomIndicator, 'bottom');
        
        // 插入到元素中
        element.appendChild(topIndicator);
        element.appendChild(bottomIndicator);
        
        // 初始状态检查
        this.updateIndicators(element);
    }

    styleIndicator(indicator, position) {
        Object.assign(indicator.style, {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '20px',
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: '100',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        });

        if (position === 'top') {
            indicator.style.top = '5px';
        } else {
            indicator.style.bottom = '5px';
        }
    }

    setupScrollListeners() {
        this.scrollElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.addScrollListener(element);
            });
        });
    }

    addScrollListener(element) {
        let isScrolling = false;
        
        element.addEventListener('scroll', () => {
            // 添加滚动状态类
            element.classList.add('scrolling');
            
            // 更新指示器
            this.updateIndicators(element);
            
            // 清除之前的定时器
            if (this.scrollTimers.has(element)) {
                clearTimeout(this.scrollTimers.get(element));
            }
            
            // 设置新的定时器，滚动停止后移除状态类
            const timer = setTimeout(() => {
                element.classList.remove('scrolling');
                this.hideIndicators(element);
            }, 1000);
            
            this.scrollTimers.set(element, timer);
        }, { passive: true });

        // 鼠标进入时显示指示器
        element.addEventListener('mouseenter', () => {
            this.updateIndicators(element);
        });

        // 鼠标离开时隐藏指示器
        element.addEventListener('mouseleave', () => {
            if (!element.classList.contains('scrolling')) {
                this.hideIndicators(element);
            }
        });
    }

    updateIndicators(element) {
        const topIndicator = element.querySelector('.scroll-indicator-top');
        const bottomIndicator = element.querySelector('.scroll-indicator-bottom');
        
        if (!topIndicator || !bottomIndicator) return;

        const { scrollTop, scrollHeight, clientHeight } = element;
        const canScrollUp = scrollTop > 10;
        const canScrollDown = scrollTop < scrollHeight - clientHeight - 10;

        // 显示/隐藏顶部指示器
        topIndicator.style.opacity = canScrollUp ? '0.7' : '0';
        
        // 显示/隐藏底部指示器
        bottomIndicator.style.opacity = canScrollDown ? '0.7' : '0';
    }

    hideIndicators(element) {
        const indicators = element.querySelectorAll('.scroll-indicator');
        indicators.forEach(indicator => {
            indicator.style.opacity = '0';
        });
    }

    // 添加平滑滚动到顶部/底部的方法
    scrollToTop(element) {
        element.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    scrollToBottom(element) {
        element.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth'
        });
    }

    // 销毁方法
    destroy() {
        // 清除所有定时器
        this.scrollTimers.forEach(timer => clearTimeout(timer));
        this.scrollTimers.clear();
        
        // 移除所有指示器
        document.querySelectorAll('.scroll-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        // 移除增强类
        document.querySelectorAll('.scroll-enhanced').forEach(element => {
            element.classList.remove('scroll-enhanced', 'scrolling');
        });
    }
}

// 创建全局实例
let phoneScrollEnhancer = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    phoneScrollEnhancer = new PhoneScrollEnhancer();
});

// 导出到全局
if (typeof window !== 'undefined') {
    window.PhoneScrollEnhancer = PhoneScrollEnhancer;
    window.phoneScrollEnhancer = phoneScrollEnhancer;
}

// 模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhoneScrollEnhancer;
}