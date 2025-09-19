// Hero区域AI标签页图标处理器
class HeroAITabsHandler {
    constructor() {
        this.aiTabsMapping = {
            'ai-chat': 'chatgpt',
            'deepseek': 'deepseek', 
            'kimi': 'kimi',
            '豆包': 'doubao',
            'doubao': 'doubao',
            'claude': 'claude'
        };
        
        this.init();
    }
    
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAITabs());
        } else {
            this.setupAITabs();
        }
        
        // 监听动态内容变化
        this.observeChanges();
    }
    
    setupAITabs() {
        console.log('🎯 开始设置Hero区域AI标签页图标...');
        
        // 查找所有phone-tab元素
        const phoneTabs = document.querySelectorAll('.phone-tab');
        console.log(`📱 找到 ${phoneTabs.length} 个标签页`);
        
        phoneTabs.forEach((tab, index) => {
            this.processAITab(tab, index);
        });
        
        // 特殊处理：根据文本内容识别AI类型
        this.identifyAITabsByText();
        
        // 强制刷新样式
        setTimeout(() => this.forceRefreshStyles(), 100);
    }
    
    processAITab(tab, index) {
        const tabText = tab.textContent?.trim().toLowerCase() || '';
        const dataTab = tab.getAttribute('data-tab') || '';
        
        console.log(`🔍 处理标签页 ${index}: "${tabText}", data-tab: "${dataTab}"`);
        
        // 根据data-tab属性或文本内容确定AI类型
        let aiType = null;
        
        // 优先检查data-tab
        if (dataTab && this.aiTabsMapping[dataTab]) {
            aiType = this.aiTabsMapping[dataTab];
        }
        // 然后检查文本内容
        else if (tabText.includes('ai') || tabText.includes('聊天')) {
            aiType = 'chatgpt';
        } else if (tabText.includes('deepseek')) {
            aiType = 'deepseek';
        } else if (tabText.includes('kimi')) {
            aiType = 'kimi';
        } else if (tabText.includes('豆包') || tabText.includes('doubao')) {
            aiType = 'doubao';
        } else if (tabText.includes('claude')) {
            aiType = 'claude';
        }
        
        if (aiType) {
            console.log(`✅ 识别为 ${aiType} 类型，应用样式`);
            
            // 移除所有AI类型的class
            Object.values(this.aiTabsMapping).forEach(type => {
                tab.classList.remove(type);
            });
            
            // 添加对应的AI类型class
            tab.classList.add(aiType);
            
            // 确保图标容器存在并设置正确的class
            const iconElement = tab.querySelector('.phone-tab-icon');
            if (iconElement) {
                iconElement.classList.add(`${aiType}-icon`);
                // 清空图标内容，让CSS背景图显示
                iconElement.innerHTML = '';
                iconElement.textContent = '';
            }
        }
    }
    
    identifyAITabsByText() {
        // 特殊处理：查找包含AI相关文本的标签页
        const allTabs = document.querySelectorAll('.phone-tab');
        
        allTabs.forEach(tab => {
            const textContent = tab.textContent?.toLowerCase() || '';
            
            // 如果还没有AI类型class，尝试根据文本识别
            const hasAIClass = Object.values(this.aiTabsMapping).some(type => 
                tab.classList.contains(type)
            );
            
            if (!hasAIClass) {
                if (textContent.includes('ai') || textContent.includes('聊天')) {
                    tab.classList.add('chatgpt');
                    console.log('🤖 根据文本识别为ChatGPT类型');
                }
            }
        });
    }
    
    forceRefreshStyles() {
        console.log('🔄 强制刷新AI标签页样式...');
        
        const aiTabs = document.querySelectorAll('.phone-tab');
        aiTabs.forEach(tab => {
            // 强制重新计算样式
            tab.style.display = 'none';
            tab.offsetHeight; // 触发重排
            tab.style.display = '';
            
            // 确保图标元素正确设置
            const icon = tab.querySelector('.phone-tab-icon');
            if (icon) {
                icon.style.fontSize = '0';
                icon.innerHTML = '';
            }
        });
        
        console.log('✨ AI标签页样式刷新完成');
    }
    
    observeChanges() {
        // 监听DOM变化，处理动态添加的内容
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList?.contains('phone-tab') || 
                                node.querySelector?.('.phone-tab')) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldUpdate) {
                console.log('🔄 检测到标签页变化，重新处理...');
                setTimeout(() => this.setupAITabs(), 50);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 调试方法
    debugAITabs() {
        console.log('🐛 AI标签页调试信息:');
        const tabs = document.querySelectorAll('.phone-tab');
        tabs.forEach((tab, index) => {
            console.log(`标签页 ${index}:`, {
                text: tab.textContent?.trim(),
                dataTab: tab.getAttribute('data-tab'),
                classes: Array.from(tab.classList),
                iconElement: tab.querySelector('.phone-tab-icon')
            });
        });
    }
}

// 全局调试函数
window.debugAITabs = () => {
    if (window.heroAIHandler) {
        window.heroAIHandler.debugAITabs();
    }
};

window.refreshAITabs = () => {
    if (window.heroAIHandler) {
        window.heroAIHandler.setupAITabs();
    }
};

// 初始化处理器
document.addEventListener('DOMContentLoaded', () => {
    window.heroAIHandler = new HeroAITabsHandler();
    console.log('🚀 Hero AI标签页处理器已启动');
});

// 如果DOM已经加载完成，立即初始化
if (document.readyState !== 'loading') {
    window.heroAIHandler = new HeroAITabsHandler();
    console.log('🚀 Hero AI标签页处理器已启动（立即模式）');
}