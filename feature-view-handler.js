// 功能视图卡片处理器
class FeatureViewHandler {
    constructor() {
        this.featureCard = null;
        this.currentTab = 'ai-chat'; // 默认显示AI聊天
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
        // 获取功能卡片元素
        this.featureCard = document.querySelector('.feature-view-card');
        if (!this.featureCard) {
            console.warn('Feature view card not found');
            return;
        }

        // 监听tab切换事件
        this.setupTabListeners();
        
        // 初始化显示默认tab的内容
        this.updateFeatureView(this.currentTab);
    }

    setupTabListeners() {
        // 监听手机tab按钮点击
        const tabButtons = document.querySelectorAll('.phone-tab');
        tabButtons.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = this.getTabIdFromElement(tab);
                if (tabId) {
                    this.currentTab = tabId;
                    this.updateFeatureView(tabId);
                }
            });
        });

        // 监听tab内容区域的显示变化（通过MutationObserver）
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const target = mutation.target;
                        if (target.classList.contains('phone-screen-content') && target.classList.contains('active')) {
                            const tabId = this.getTabIdFromContentId(target.id);
                            if (tabId && tabId !== this.currentTab) {
                                this.currentTab = tabId;
                                this.updateFeatureView(tabId);
                            }
                        }
                    }
                });
            });

            // 观察所有内容区域的class变化
            const contentElements = contentArea.querySelectorAll('.phone-screen-content');
            contentElements.forEach(element => {
                observer.observe(element, { attributes: true, attributeFilter: ['class'] });
            });
        }
    }

    getTabIdFromElement(tabElement) {
        // 从tab元素获取对应的tab ID
        const tabText = tabElement.querySelector('.tab-text')?.textContent?.trim();
        const tabMapping = {
            'AI聊天': 'ai-chat',
            '浏览网页': 'browser',
            'App跳转': 'app-jump',
            '小组件': 'widgets'
        };
        return tabMapping[tabText] || null;
    }

    getTabIdFromContentId(contentId) {
        // 从内容ID获取tab ID
        const mapping = {
            'ai-chat-content': 'ai-chat',
            'browser-content': 'browser',
            'app-jump-content': 'app-jump',
            'widgets-content': 'widgets'
        };
        return mapping[contentId] || null;
    }

    updateFeatureView(tabId) {
        if (!this.featureCard || !tabFeatureData[tabId]) {
            return;
        }

        const data = tabFeatureData[tabId];
        
        // 添加更新动画
        this.featureCard.style.opacity = '0.7';
        this.featureCard.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            // 更新标题
            const titleElement = this.featureCard.querySelector('.feature-view-title');
            if (titleElement) {
                titleElement.textContent = data.title;
            }

            // 更新分类
            const categoryElement = this.featureCard.querySelector('.feature-view-category');
            if (categoryElement) {
                categoryElement.textContent = data.category;
            }

            // 更新描述
            const descElement = this.featureCard.querySelector('.feature-view-description');
            if (descElement) {
                descElement.textContent = data.description;
            }

            // 更新特性列表
            const featuresContainer = this.featureCard.querySelector('.feature-view-features');
            if (featuresContainer) {
                featuresContainer.innerHTML = '';
                data.features.forEach(feature => {
                    const featureItem = document.createElement('div');
                    featureItem.className = 'feature-item';
                    featureItem.innerHTML = `<span class="feature-bullet">•</span>${feature}`;
                    featuresContainer.appendChild(featureItem);
                });
            }

            // 更新高亮特性
            const highlightsContainer = this.featureCard.querySelector('.feature-view-highlights');
            if (highlightsContainer) {
                highlightsContainer.innerHTML = '';
                data.highlights.forEach(highlight => {
                    const highlightItem = document.createElement('div');
                    highlightItem.className = 'highlight-item';
                    highlightItem.innerHTML = `
                        <span class="highlight-icon">${highlight.icon}</span>
                        <span class="highlight-text">${highlight.text}</span>
                    `;
                    highlightsContainer.appendChild(highlightItem);
                });
            }

            // 恢复动画
            this.featureCard.style.opacity = '1';
            this.featureCard.style.transform = 'translateY(0)';
            
            // 触发动画演示更新事件
            this.triggerAnimationUpdate(tabId);
        }, 150);
    }
    
    triggerAnimationUpdate(tabId) {
        // 发送自定义事件通知动画控制器
        const event = new CustomEvent('tabChanged', {
            detail: { tabId: tabId }
        });
        document.dispatchEvent(event);
        
        console.log(`Tab changed to: ${tabId}, animation demo should update`);
    }
}

// 初始化功能视图处理器
const featureViewHandler = new FeatureViewHandler();