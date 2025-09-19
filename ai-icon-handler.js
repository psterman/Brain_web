// AI图标处理器 - 专门处理AI助手图标

class AIIconHandler {
    constructor() {
        this.aiIconUrls = {
            'deepseek': [
                'https://img.icons8.com/fluency/48/neural-network.png',
                'https://img.icons8.com/fluency/48/deep-learning.png',
                'https://img.icons8.com/fluency/48/machine-learning.png',
                'https://img.icons8.com/fluency/48/artificial-intelligence.png'
            ],
            'kimi': [
                'https://img.icons8.com/fluency/48/crescent-moon.png',
                'https://img.icons8.com/fluency/48/moon-symbol.png',
                'https://img.icons8.com/fluency/48/new-moon.png',
                'https://img.icons8.com/fluency/48/assistant.png'
            ],
            'zhipu': [
                'https://img.icons8.com/fluency/48/speech-bubble-with-dots.png',
                'https://img.icons8.com/fluency/48/chat-message.png',
                'https://img.icons8.com/fluency/48/conversation.png',
                'https://img.icons8.com/fluency/48/artificial-intelligence.png'
            ]
        };
        
        this.customSvgIcons = {
            'deepseek': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+',
            'kimi': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjAiIGZpbGw9IiNmMDkzZmIiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDJDMTMuMzEgMiAxNC4zOCAyLjgzIDE0LjcxIDRIMTVDMTcuNzYgNCAxOS45OSA2LjI0IDE5Ljk5IDlWMTBDMTkuOTkgMTIuNzYgMTcuNzYgMTUgMTUgMTVIMTRWMTlDMTQgMjAuMSAxMy4xIDIxIDEyIDIxUzEwIDIwLjEgMTAgMTlWMTVIOUM2LjI0IDE1IDQgMTIuNzYgNCAxMFY5QzQgNi4yNCA2LjI0IDQgOSA0SDkuMjlDOS42MiAyLjgzIDEwLjY5IDIgMTIgMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4=',
            'zhipu': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjAiIGZpbGw9IiM0ZmFjZmUiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTIwIDJINEMzIDIgMiAzIDIgNFYyMkwyIDIwTDIwIDIwQzIxIDIwIDIyIDE5IDIyIDE4VjRDMjIgMyAyMSAyIDIwIDJaTTYgOUg5VjdIMTVWOUgxOFYxMUgxNVYxM0g5VjExSDZWOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4='
        };
        
        this.init();
    }

    init() {
        // 等待DOM加载完成后处理AI图标
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.handleAIIcons();
            });
        } else {
            this.handleAIIcons();
        }
    }

    // 处理所有AI图标
    handleAIIcons() {
        const aiIcons = document.querySelectorAll('.ai-avatar.deepseek, .ai-avatar.kimi, .ai-avatar.zhipu');
        
        aiIcons.forEach((icon, index) => {
            // 错开处理时间
            setTimeout(() => {
                this.loadAIIcon(icon);
            }, index * 200);
        });
    }

    // 加载单个AI图标
    loadAIIcon(iconElement) {
        const classList = Array.from(iconElement.classList);
        const aiType = classList.find(cls => ['deepseek', 'kimi', 'zhipu'].includes(cls));
        
        if (!aiType) return;

        // 添加加载状态
        iconElement.classList.remove('error', 'loaded', 'fallback');
        iconElement.classList.add('loading');
        
        // 尝试加载图标URL列表
        const urls = this.aiIconUrls[aiType];
        if (urls && urls.length > 0) {
            this.tryLoadUrls(iconElement, urls, 0, aiType);
        } else {
            this.useCustomSvg(iconElement, aiType);
        }
    }

    // 尝试加载URL列表
    tryLoadUrls(iconElement, urls, index, aiType) {
        if (index >= urls.length) {
            // 所有URL都失败了，使用自定义SVG
            this.useCustomSvg(iconElement, aiType);
            return;
        }

        const url = urls[index];
        const img = new Image();
        let timeoutId;
        
        const cleanup = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        
        img.onload = () => {
            cleanup();
            this.handleSuccess(iconElement, url, aiType);
        };
        
        img.onerror = () => {
            cleanup();
            console.log(`AI图标加载失败: ${aiType} - ${url}`);
            // 尝试下一个URL
            this.tryLoadUrls(iconElement, urls, index + 1, aiType);
        };
        
        // 设置超时
        timeoutId = setTimeout(() => {
            img.src = ''; // 取消加载
            console.log(`AI图标加载超时: ${aiType} - ${url}`);
            this.tryLoadUrls(iconElement, urls, index + 1, aiType);
        }, 3000);
        
        img.src = url;
    }

    // 处理加载成功
    handleSuccess(iconElement, url, aiType) {
        iconElement.classList.remove('loading', 'error', 'fallback');
        iconElement.classList.add('loaded');
        
        iconElement.style.backgroundImage = `url(${url})`;
        iconElement.style.backgroundSize = '32px 32px';
        iconElement.style.backgroundPosition = 'center';
        iconElement.style.backgroundRepeat = 'no-repeat';
        
        console.log(`AI图标加载成功: ${aiType} - ${url}`);
    }

    // 使用自定义SVG
    useCustomSvg(iconElement, aiType) {
        const svgUrl = this.customSvgIcons[aiType];
        
        if (svgUrl) {
            iconElement.classList.remove('loading');
            iconElement.classList.add('loaded');
            
            iconElement.style.backgroundImage = `url(${svgUrl})`;
            iconElement.style.backgroundSize = '40px 40px';
            iconElement.style.backgroundPosition = 'center';
            iconElement.style.backgroundRepeat = 'no-repeat';
            
            console.log(`使用自定义SVG图标: ${aiType}`);
        } else {
            // 最终备用方案
            this.useFallback(iconElement, aiType);
        }
    }

    // 使用最终备用方案
    useFallback(iconElement, aiType) {
        iconElement.classList.remove('loading');
        iconElement.classList.add('error', 'fallback');
        
        iconElement.style.backgroundImage = 'none';
        
        console.log(`AI图标使用最终备用方案: ${aiType}`);
    }

    // 重新加载AI图标
    reloadAIIcons() {
        const aiIcons = document.querySelectorAll('.ai-avatar.deepseek, .ai-avatar.kimi, .ai-avatar.zhipu');
        
        aiIcons.forEach(icon => {
            icon.classList.remove('loading', 'error', 'loaded', 'fallback');
            icon.style.backgroundImage = '';
            this.loadAIIcon(icon);
        });
    }

    // 检查AI图标状态
    checkAIIconStatus() {
        const status = {};
        const aiTypes = ['deepseek', 'kimi', 'zhipu'];
        
        aiTypes.forEach(type => {
            const icon = document.querySelector(`.ai-avatar.${type}`);
            if (icon) {
                status[type] = {
                    loaded: icon.classList.contains('loaded'),
                    error: icon.classList.contains('error'),
                    loading: icon.classList.contains('loading'),
                    fallback: icon.classList.contains('fallback')
                };
            }
        });
        
        return status;
    }
}

// 创建全局实例
const aiIconHandler = new AIIconHandler();

// 导出到全局作用域
window.AIIconHandler = aiIconHandler;

// 添加调试功能
window.reloadAIIcons = () => {
    aiIconHandler.reloadAIIcons();
};

window.checkAIIconStatus = () => {
    const status = aiIconHandler.checkAIIconStatus();
    console.log('AI图标状态:', status);
    return status;
};

console.log('AI图标处理器已初始化');
console.log('可用命令: reloadAIIcons(), checkAIIconStatus()');