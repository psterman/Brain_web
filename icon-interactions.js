// 图标交互系统 - 增强用户体验

class IconSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupAppIconInteractions();
        this.setupEngineIconInteractions();
        this.setupAIAvatarInteractions();
        this.setupClickAnimations();
        this.setupHoverEffects();
    }

    // 应用图标交互
    setupAppIconInteractions() {
        const appIcons = document.querySelectorAll('.app-icon');
        
        appIcons.forEach(icon => {
            // 点击效果
            icon.addEventListener('click', (e) => {
                this.createRippleEffect(e.target, e);
                this.animateIconClick(e.target);
                
                // 模拟应用跳转
                const appName = e.target.parentElement.querySelector('.app-name')?.textContent;
                if (appName) {
                    this.showAppLaunchFeedback(appName);
                }
            });

            // 长按效果
            let pressTimer;
            icon.addEventListener('mousedown', (e) => {
                pressTimer = setTimeout(() => {
                    this.showAppOptions(e.target);
                }, 500);
            });

            icon.addEventListener('mouseup', () => {
                clearTimeout(pressTimer);
            });

            icon.addEventListener('mouseleave', () => {
                clearTimeout(pressTimer);
            });
        });
    }

    // 搜索引擎图标交互
    setupEngineIconInteractions() {
        const engineIcons = document.querySelectorAll('.engine-icon');
        
        engineIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.createRippleEffect(e.target, e);
                this.toggleEngineSelection(e.target);
            });
        });
    }

    // AI头像交互
    setupAIAvatarInteractions() {
        const aiAvatars = document.querySelectorAll('.ai-avatar');
        
        aiAvatars.forEach(avatar => {
            avatar.addEventListener('click', (e) => {
                this.createRippleEffect(e.target, e);
                this.animateAIResponse(e.target);
            });

            // 添加呼吸动画
            this.addBreathingAnimation(avatar);
        });
    }

    // 点击动画设置
    setupClickAnimations() {
        const clickableIcons = document.querySelectorAll('.app-icon, .engine-icon, .ai-avatar');
        
        clickableIcons.forEach(icon => {
            icon.addEventListener('mousedown', (e) => {
                icon.style.transform = 'scale(0.95)';
            });

            icon.addEventListener('mouseup', (e) => {
                setTimeout(() => {
                    icon.style.transform = '';
                }, 100);
            });
        });
    }

    // 悬停效果
    setupHoverEffects() {
        const icons = document.querySelectorAll('.app-icon, .engine-icon');
        
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', (e) => {
                this.addHoverGlow(e.target);
            });

            icon.addEventListener('mouseleave', (e) => {
                this.removeHoverGlow(e.target);
            });
        });
    }

    // 创建波纹效果
    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        // 添加动画样式
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // 图标点击动画
    animateIconClick(icon) {
        icon.style.animation = 'iconBounce 0.3s ease-in-out';
        
        // 添加弹跳动画样式
        if (!document.getElementById('icon-bounce-animation')) {
            const style = document.createElement('style');
            style.id = 'icon-bounce-animation';
            style.textContent = `
                @keyframes iconBounce {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            icon.style.animation = '';
        }, 300);
    }

    // 显示应用启动反馈
    showAppLaunchFeedback(appName) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;
        feedback.textContent = `正在打开 ${appName}...`;

        document.body.appendChild(feedback);

        // 添加淡入淡出动画
        if (!document.getElementById('fade-in-out-animation')) {
            const style = document.createElement('style');
            style.id = 'fade-in-out-animation';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    // 显示应用选项
    showAppOptions(icon) {
        const options = document.createElement('div');
        options.style.cssText = `
            position: absolute;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            animation: slideUp 0.3s ease-out;
        `;
        options.textContent = '添加到收藏';

        icon.style.position = 'relative';
        icon.appendChild(options);

        // 添加滑入动画
        if (!document.getElementById('slide-up-animation')) {
            const style = document.createElement('style');
            style.id = 'slide-up-animation';
            style.textContent = `
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            options.remove();
        }, 2000);
    }

    // 切换搜索引擎选择
    toggleEngineSelection(engineIcon) {
        const engineItem = engineIcon.closest('.search-engine-item');
        const checkbox = engineItem.querySelector('.engine-checkbox');
        
        if (engineItem.classList.contains('selected')) {
            engineItem.classList.remove('selected');
            checkbox.textContent = '○';
            checkbox.classList.remove('checked');
        } else {
            engineItem.classList.add('selected');
            checkbox.textContent = '✓';
            checkbox.classList.add('checked');
        }

        // 添加选择动画
        engineIcon.style.animation = 'pulse 0.3s ease-in-out';
        setTimeout(() => {
            engineIcon.style.animation = '';
        }, 300);
    }

    // AI响应动画
    animateAIResponse(avatar) {
        avatar.style.animation = 'aiPulse 1s ease-in-out';
        
        // 添加AI脉冲动画
        if (!document.getElementById('ai-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'ai-pulse-animation';
            style.textContent = `
                @keyframes aiPulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(116, 185, 255, 0.7); }
                    50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(116, 185, 255, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(116, 185, 255, 0); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            avatar.style.animation = '';
        }, 1000);
    }

    // 添加呼吸动画
    addBreathingAnimation(avatar) {
        avatar.style.animation = 'breathing 3s ease-in-out infinite';
        
        if (!document.getElementById('breathing-animation')) {
            const style = document.createElement('style');
            style.id = 'breathing-animation';
            style.textContent = `
                @keyframes breathing {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 添加悬停光晕
    addHoverGlow(icon) {
        icon.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)';
        icon.style.transform = 'translateY(-2px) scale(1.02)';
    }

    // 移除悬停光晕
    removeHoverGlow(icon) {
        icon.style.boxShadow = '';
        icon.style.transform = '';
    }

    // 添加脉冲动画样式
    addPulseAnimation() {
        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// 初始化图标系统
document.addEventListener('DOMContentLoaded', () => {
    new IconSystem();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconSystem;
}