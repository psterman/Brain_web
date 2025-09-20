/**
 * 多元图标聚合搜索交互逻辑
 * 实现小红书、B站、抖音等平台的交互效果和用户使用步骤展示
 */

class MultiPlatformSearch {
    constructor() {
        this.selectedPlatforms = new Set();
        this.searchSteps = [
            {
                step: 1,
                title: "选择平台",
                description: "点击您想要搜索的平台图标",
                icon: "👆",
                action: "selectPlatform"
            },
            {
                step: 2,
                title: "输入关键词",
                description: "在搜索框中输入您要查找的内容",
                icon: "✍️",
                action: "inputKeyword"
            },
            {
                step: 3,
                title: "开始搜索",
                description: "点击搜索按钮，获取全网结果",
                icon: "🚀",
                action: "startSearch"
            }
        ];
        this.currentStep = 1;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initPlatformIcons();
        this.startGuidanceAnimation();
        this.initTooltips();
    }

    bindEvents() {
        // 平台图标点击事件
        document.querySelectorAll('.platform-icon-item').forEach(item => {
            item.addEventListener('click', (e) => this.handlePlatformClick(e));
            item.addEventListener('mouseenter', (e) => this.handlePlatformHover(e));
            item.addEventListener('mouseleave', (e) => this.handlePlatformLeave(e));
        });

        // 交互提示点击事件
        document.querySelectorAll('.tip-item').forEach(tip => {
            tip.addEventListener('click', (e) => this.handleTipClick(e));
        });

        // 搜索卡片悬停效果
        const searchCard = document.querySelector('.multi-platform-search-card');
        if (searchCard) {
            searchCard.addEventListener('mouseenter', () => this.handleCardHover());
            searchCard.addEventListener('mouseleave', () => this.handleCardLeave());
        }
    }

    initPlatformIcons() {
        // 为每个平台图标添加特殊效果
        const platforms = document.querySelectorAll('.platform-icon-item');
        platforms.forEach((platform, index) => {
            // 添加延迟动画
            platform.style.animationDelay = `${index * 0.1}s`;
            platform.classList.add('platform-fade-in');
            
            // 添加平台特定的数据属性
            const platformType = platform.dataset.platform;
            this.addPlatformSpecificEffects(platform, platformType);
        });
    }

    addPlatformSpecificEffects(platform, type) {
        const effects = {
            xiaohongshu: {
                color: '#ff2d92',
                hoverText: '小红书：发现生活的美好',
                features: ['生活分享', '美妆护肤', '旅行攻略']
            },
            bilibili: {
                color: '#00a1d6',
                hoverText: 'B站：你感兴趣的视频都在这里',
                features: ['学习视频', '娱乐内容', '科技数码']
            },
            douyin: {
                color: '#fe2c55',
                hoverText: '抖音：记录美好生活',
                features: ['短视频', '音乐舞蹈', '搞笑娱乐']
            },
            zhihu: {
                color: '#0084ff',
                hoverText: '知乎：有问题，就会有答案',
                features: ['专业问答', '深度文章', '行业见解']
            },
            weibo: {
                color: '#ff8200',
                hoverText: '微博：随时随地发现新鲜事',
                features: ['热点资讯', '明星动态', '社会话题']
            },
            more: {
                color: '#6366f1',
                hoverText: '更多平台：扩展搜索范围',
                features: ['其他平台', '自定义源', '扩展功能']
            }
        };

        const effect = effects[type];
        if (effect) {
            platform.setAttribute('data-hover-text', effect.hoverText);
            platform.setAttribute('data-features', effect.features.join(','));
            platform.style.setProperty('--platform-color', effect.color);
        }
    }

    handlePlatformClick(e) {
        const platform = e.currentTarget;
        const platformType = platform.dataset.platform;
        
        // 切换选中状态
        if (this.selectedPlatforms.has(platformType)) {
            this.selectedPlatforms.delete(platformType);
            platform.classList.remove('selected');
            this.showFeedback('已取消选择 ' + this.getPlatformName(platformType), 'info');
        } else {
            this.selectedPlatforms.add(platformType);
            platform.classList.add('selected');
            this.showFeedback('已选择 ' + this.getPlatformName(platformType), 'success');
        }

        // 添加点击动画
        platform.classList.add('platform-clicked');
        setTimeout(() => {
            platform.classList.remove('platform-clicked');
        }, 300);

        // 更新搜索步骤
        this.updateSearchProgress();
        
        // 触发选择音效（如果需要）
        this.playSelectSound();
    }

    handlePlatformHover(e) {
        const platform = e.currentTarget;
        const hoverText = platform.getAttribute('data-hover-text');
        
        if (hoverText) {
            this.showTooltip(platform, hoverText);
        }

        // 添加悬停动画
        platform.classList.add('platform-hovering');
    }

    handlePlatformLeave(e) {
        const platform = e.currentTarget;
        platform.classList.remove('platform-hovering');
        this.hideTooltip();
    }

    handleTipClick(e) {
        const tip = e.currentTarget;
        const tipText = tip.querySelector('.tip-text').textContent;
        
        // 根据提示内容执行相应动作
        if (tipText.includes('点击平台图标')) {
            this.highlightPlatformIcons();
        } else if (tipText.includes('多平台同时搜索')) {
            this.demonstrateMultiSelect();
        }
    }

    handleCardHover() {
        // 卡片悬停时的特殊效果
        const card = document.querySelector('.multi-platform-search-card');
        card.classList.add('card-focused');
        
        // 启动平台图标的呼吸动画
        this.startPlatformBreathing();
    }

    handleCardLeave() {
        const card = document.querySelector('.multi-platform-search-card');
        card.classList.remove('card-focused');
        
        // 停止呼吸动画
        this.stopPlatformBreathing();
    }

    startGuidanceAnimation() {
        // 启动引导动画，展示用户使用步骤
        setTimeout(() => {
            this.showStepGuidance(1);
        }, 1000);
    }

    showStepGuidance(stepNumber) {
        const step = this.searchSteps[stepNumber - 1];
        if (!step) return;

        // 创建步骤提示气泡
        const guidanceBubble = this.createGuidanceBubble(step);
        document.body.appendChild(guidanceBubble);

        // 根据步骤类型执行相应的引导动作
        switch (step.action) {
            case 'selectPlatform':
                // 高亮平台图标
                const platformIcons = document.querySelectorAll('.platform-icon-item');
                platformIcons.forEach(icon => {
                    icon.style.transform = 'scale(1.1)';
                    icon.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
                });
                break;
            case 'inputKeyword':
                // 可以添加搜索框高亮效果
                break;
            case 'startSearch':
                // 可以添加搜索按钮高亮效果
                break;
        }

        // 自动进入下一步
        setTimeout(() => {
            guidanceBubble.remove();
            if (stepNumber < this.searchSteps.length) {
                this.showStepGuidance(stepNumber + 1);
            }
        }, 3000);
    }

    startStepDemo() {
        const steps = [
            { text: '👆 点击选择您感兴趣的平台', action: 'selectPlatform', duration: 3000 },
            { text: '⌨️ 在搜索框输入关键词', action: 'inputKeyword', duration: 2500 },
            { text: '🚀 点击搜索获取精准结果', action: 'startSearch', duration: 2500 },
            { text: '📊 查看来自多个平台的聚合结果', action: 'showResults', duration: 3000 }
        ];

        let currentStep = 0;
        const showStep = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                this.updateInteractionTip(step.text, '✨');
                this.performStepAction(step);
                
                // 添加步骤进度指示
                this.updateStepProgress(currentStep + 1, steps.length);
                
                setTimeout(() => {
                    currentStep++;
                    showStep();
                }, step.duration);
            } else {
                this.updateInteractionTip('🎉 体验完整的聚合搜索功能！', '🌟');
                this.resetStepProgress();
                // 3秒后重新开始演示
                setTimeout(() => this.startStepDemo(), 3000);
            }
        };

        showStep();
    }

    updateInteractionTip(text, icon) {
        const tipElement = document.querySelector('.interaction-tip');
        if (tipElement) {
            tipElement.innerHTML = `<span class="tip-icon">${icon}</span><span class="tip-text">${text}</span>`;
            tipElement.classList.add('tip-updated');
            setTimeout(() => tipElement.classList.remove('tip-updated'), 300);
        }
    }

    performStepAction(step) {
        switch (step.action) {
            case 'selectPlatform':
                this.highlightPlatformIcons();
                break;
            case 'inputKeyword':
                this.highlightSearchInput();
                break;
            case 'startSearch':
                this.highlightSearchButton();
                break;
            case 'showResults':
                this.simulateResultsDisplay();
                break;
        }
    }

    updateStepProgress(current, total) {
        const progressElement = document.querySelector('.step-progress');
        if (progressElement) {
            progressElement.textContent = `步骤 ${current}/${total}`;
            progressElement.style.opacity = '1';
        }
    }

    resetStepProgress() {
        const progressElement = document.querySelector('.step-progress');
        if (progressElement) {
            progressElement.style.opacity = '0';
        }
    }

    highlightSearchInput() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.classList.add('input-highlight');
            setTimeout(() => searchInput.classList.remove('input-highlight'), 2000);
        }
    }

    highlightSearchButton() {
        const searchButton = document.querySelector('.search-button');
        if (searchButton) {
            searchButton.classList.add('button-highlight');
            setTimeout(() => searchButton.classList.remove('button-highlight'), 2000);
        }
    }

    simulateResultsDisplay() {
        const resultsArea = document.querySelector('.search-results');
        if (resultsArea) {
            resultsArea.classList.add('results-preview');
            setTimeout(() => resultsArea.classList.remove('results-preview'), 2500);
        }
    }

    createGuidanceBubble(step) {
        const bubble = document.createElement('div');
        bubble.className = 'guidance-bubble';
        bubble.innerHTML = `
            <div class="guidance-content">
                <div class="guidance-icon">${step.icon}</div>
                <div class="guidance-text">
                    <div class="guidance-title">步骤 ${step.step}: ${step.title}</div>
                    <div class="guidance-description">${step.description}</div>
                </div>
            </div>
        `;
        
        // 添加样式
        bubble.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 16px 20px;
            border-radius: 16px;
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
            z-index: 1000;
            animation: guidanceFadeIn 0.5s ease-out;
            max-width: 280px;
        `;

        return bubble;
    }

    highlightPlatformIcons() {
        const platforms = document.querySelectorAll('.platform-icon-item');
        platforms.forEach((platform, index) => {
            setTimeout(() => {
                platform.classList.add('platform-highlight');
                platform.style.transform = 'scale(1.05)';
                platform.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
                setTimeout(() => {
                    platform.classList.remove('platform-highlight');
                    platform.style.transform = '';
                    platform.style.boxShadow = '';
                }, 2500);
            }, index * 200);
        });
    }

    demonstrateMultiSelect() {
        // 演示多选功能
        const platforms = ['xiaohongshu', 'bilibili', 'douyin'];
        platforms.forEach((platformType, index) => {
            setTimeout(() => {
                const platform = document.querySelector(`[data-platform="${platformType}"]`);
                if (platform) {
                    platform.click();
                }
            }, index * 500);
        });
    }

    startPlatformBreathing() {
        const platforms = document.querySelectorAll('.platform-icon-item');
        platforms.forEach(platform => {
            platform.classList.add('platform-breathing');
        });
    }

    stopPlatformBreathing() {
        const platforms = document.querySelectorAll('.platform-icon-item');
        platforms.forEach(platform => {
            platform.classList.remove('platform-breathing');
        });
    }

    showTooltip(element, text) {
        // 移除现有的tooltip
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'platform-tooltip';
        tooltip.textContent = text;
        
        // 计算位置
        const rect = element.getBoundingClientRect();
        tooltip.style.cssText = `
            position: fixed;
            top: ${rect.top - 40}px;
            left: ${rect.left + rect.width / 2}px;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            animation: tooltipFadeIn 0.3s ease-out;
        `;
        
        document.body.appendChild(tooltip);
    }

    hideTooltip() {
        const existingTooltip = document.querySelector('.platform-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `feedback-message feedback-${type}`;
        feedback.textContent = message;
        
        const colors = {
            success: '#22c55e',
            info: '#3b82f6',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            animation: feedbackSlideUp 0.3s ease-out;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'feedbackSlideDown 0.3s ease-out';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    updateSearchProgress() {
        // 更新搜索进度显示
        const selectedCount = this.selectedPlatforms.size;
        const progressText = selectedCount > 0 
            ? `已选择 ${selectedCount} 个平台` 
            : '请选择搜索平台';
            
        // 更新状态指示器
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = selectedCount > 0 ? '就绪' : '在线';
        }
    }

    getPlatformName(platformType) {
        const names = {
            xiaohongshu: '小红书',
            bilibili: 'B站',
            douyin: '抖音',
            zhihu: '知乎',
            weibo: '微博',
            more: '更多平台'
        };
        return names[platformType] || platformType;
    }

    playSelectSound() {
        // 播放选择音效（可选）
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.1;
            audio.play().catch(() => {}); // 忽略播放失败
        } catch (e) {
            // 忽略音频播放错误
        }
    }

    initTooltips() {
        // 初始化所有交互提示
        const style = document.createElement('style');
        style.textContent = `
            @keyframes guidanceFadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes tooltipFadeIn {
                from { opacity: 0; transform: translateX(-50%) translateY(10px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            
            @keyframes feedbackSlideUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            
            @keyframes feedbackSlideDown {
                from { opacity: 1; transform: translateX(-50%) translateY(0); }
                to { opacity: 0; transform: translateX(-50%) translateY(20px); }
            }
            
            .platform-fade-in {
                animation: platformFadeIn 0.6s ease-out forwards;
                opacity: 0;
            }
            
            @keyframes platformFadeIn {
                to { opacity: 1; }
            }
            
            .platform-clicked {
                animation: platformClick 0.3s ease-out;
            }
            
            @keyframes platformClick {
                0% { transform: scale(1); }
                50% { transform: scale(0.95); }
                100% { transform: scale(1); }
            }
            
            .platform-highlight {
                animation: platformHighlight 1s ease-in-out;
            }
            
            @keyframes platformHighlight {
                0%, 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
                50% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
            }
            
            .platform-breathing {
                animation: platformBreathe 2s ease-in-out infinite;
            }
            
            @keyframes platformBreathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            
            .card-focused .search-icon-pulse {
                animation-duration: 1.5s;
            }
            
            .card-focused .search-icon-ring {
                animation-duration: 1.5s;
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否存在多元图标搜索卡片
    if (document.querySelector('.multi-platform-search-card')) {
        new MultiPlatformSearch();
    }
});

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiPlatformSearch;
}