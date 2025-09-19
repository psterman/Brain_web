// Hero区域AI图标处理器

class HeroAIIconHandler {
    constructor() {
        this.iconUrls = {
            chatgpt: [
                'https://img.icons8.com/fluency/48/chatgpt.png',
                'https://img.icons8.com/color/48/chatgpt.png',
                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg'
            ],
            deepseek: [
                'https://img.icons8.com/fluency/48/neural-network.png',
                'https://img.icons8.com/color/48/artificial-intelligence.png',
                'https://img.icons8.com/fluency/48/brain.png'
            ],
            kimi: [
                'https://img.icons8.com/fluency/48/crescent-moon.png',
                'https://img.icons8.com/color/48/crescent-moon.png',
                'https://img.icons8.com/fluency/48/moon-symbol.png'
            ],
            doubao: [
                'https://img.icons8.com/fluency/48/coffee-beans.png',
                'https://img.icons8.com/color/48/coffee-beans.png',
                'https://img.icons8.com/fluency/48/coffee-bean.png'
            ],
            claude: [
                'https://img.icons8.com/fluency/48/bot.png',
                'https://img.icons8.com/color/48/bot.png',
                'https://img.icons8.com/fluency/48/chatbot.png'
            ]
        };
        
        this.chatAvatarUrls = {
            'deepseek-avatar': [
                'https://img.icons8.com/fluency/48/neural-network.png',
                'https://img.icons8.com/color/48/artificial-intelligence.png'
            ],
            'kimi-avatar': [
                'https://img.icons8.com/fluency/48/crescent-moon.png',
                'https://img.icons8.com/color/48/crescent-moon.png'
            ],
            'zhipu-avatar': [
                'https://img.icons8.com/fluency/48/speech-bubble-with-dots.png',
                'https://img.icons8.com/color/48/chat.png'
            ]
        };
        
        this.init();
    }
    
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAllIcons());
        } else {
            this.loadAllIcons();
        }
        
        // 监听AI浏览器界面的创建
        this.observeAIBrowserCreation();
    }
    
    observeAIBrowserCreation() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否添加了AI浏览器标签
                            const aiTabs = node.querySelectorAll('.ai-tab-icon');
                            if (aiTabs.length > 0) {
                                console.log('检测到AI浏览器标签创建，开始加载图标');
                                setTimeout(() => this.loadHeroAIIcons(), 100);
                            }
                            
                            // 检查是否添加了对话头像
                            const chatAvatars = node.querySelectorAll('.ai-avatar');
                            if (chatAvatars.length > 0) {
                                console.log('检测到对话头像创建，开始加载图标');
                                setTimeout(() => this.loadChatAvatars(), 100);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    loadAllIcons() {
        this.loadHeroAIIcons();
        this.loadChatAvatars();
    }
    
    loadHeroAIIcons() {
        console.log('开始加载Hero区域AI图标');
        
        Object.keys(this.iconUrls).forEach((aiType, index) => {
            setTimeout(() => {
                const iconElement = document.querySelector(`.ai-tab-icon.${aiType}`);
                if (iconElement) {
                    console.log(`找到${aiType}图标元素，开始加载`);
                    this.loadIconWithFallback(iconElement, this.iconUrls[aiType], aiType);
                } else {
                    console.log(`未找到${aiType}图标元素`);
                }
            }, index * 200); // 错开加载时间
        });
    }
    
    loadChatAvatars() {
        console.log('开始加载对话头像');
        
        Object.keys(this.chatAvatarUrls).forEach((avatarClass, index) => {
            setTimeout(() => {
                const avatarElements = document.querySelectorAll(`.ai-avatar.${avatarClass}`);
                avatarElements.forEach((avatarElement) => {
                    console.log(`找到${avatarClass}头像元素，开始加载`);
                    this.loadIconWithFallback(avatarElement, this.chatAvatarUrls[avatarClass], avatarClass);
                });
            }, index * 200);
        });
    }
    
    loadIconWithFallback(element, urls, type) {
        let currentUrlIndex = 0;
        
        const tryLoadIcon = () => {
            if (currentUrlIndex >= urls.length) {
                console.log(`${type}所有图标URL都加载失败，使用错误样式`);
                element.classList.add('error');
                return;
            }
            
            const img = new Image();
            const currentUrl = urls[currentUrlIndex];
            
            img.onload = () => {
                console.log(`${type}图标加载成功: ${currentUrl}`);
                element.style.backgroundImage = `url('${currentUrl}')`;
                element.classList.remove('error');
                
                // 清除可能存在的文字内容
                element.innerHTML = '';
            };
            
            img.onerror = () => {
                console.log(`${type}图标加载失败: ${currentUrl}`);
                currentUrlIndex++;
                setTimeout(tryLoadIcon, 500); // 延迟重试
            };
            
            // 设置超时
            setTimeout(() => {
                if (!img.complete) {
                    console.log(`${type}图标加载超时: ${currentUrl}`);
                    img.onerror();
                }
            }, 3000);
            
            img.src = currentUrl;
        };
        
        tryLoadIcon();
    }
    
    // 手动重新加载所有图标
    reloadAllIcons() {
        console.log('手动重新加载所有AI图标');
        this.loadAllIcons();
    }
    
    // 检查图标加载状态
    getIconStatus() {
        const status = {
            heroIcons: {},
            chatAvatars: {}
        };
        
        Object.keys(this.iconUrls).forEach(aiType => {
            const element = document.querySelector(`.ai-tab-icon.${aiType}`);
            status.heroIcons[aiType] = {
                found: !!element,
                hasBackgroundImage: element ? !!element.style.backgroundImage : false,
                hasError: element ? element.classList.contains('error') : false
            };
        });
        
        Object.keys(this.chatAvatarUrls).forEach(avatarClass => {
            const elements = document.querySelectorAll(`.ai-avatar.${avatarClass}`);
            status.chatAvatars[avatarClass] = {
                count: elements.length,
                loaded: Array.from(elements).filter(el => !!el.style.backgroundImage).length,
                errors: Array.from(elements).filter(el => el.classList.contains('error')).length
            };
        });
        
        return status;
    }
}

// 创建全局实例
window.heroAIIconHandler = new HeroAIIconHandler();

// 添加全局调试函数
window.reloadHeroAIIcons = () => window.heroAIIconHandler.reloadAllIcons();
window.getHeroAIIconStatus = () => window.heroAIIconHandler.getIconStatus();

console.log('Hero AI图标处理器已初始化');
console.log('调试命令: reloadHeroAIIcons() - 重新加载图标');
console.log('调试命令: getHeroAIIconStatus() - 查看图标状态');