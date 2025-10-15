// AI快速输入框功能
// 提供快速提问功能，与AI tab无缝集成

class AIQuickInput {
    constructor() {
        this.quickInput = null;
        this.quickSendButton = null;
        this.mainInput = null;
        this.mainSendButton = null;
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }

    setupElements() {
        // 获取快速输入框元素
        this.quickInput = document.getElementById('quickMessageInput');
        this.quickSendButton = document.getElementById('quickSendButton');
        
        // 获取主输入框元素
        this.mainInput = document.getElementById('messageInput');
        this.mainSendButton = document.getElementById('sendButton');

        if (this.quickInput && this.quickSendButton) {
            this.bindEvents();
            console.log('AI快速输入框初始化成功');
        } else {
            console.warn('AI快速输入框元素未找到');
        }
    }

    bindEvents() {
        // 快速发送按钮点击事件
        this.quickSendButton.addEventListener('click', () => {
            this.handleQuickSend();
        });

        // 快速输入框回车事件
        this.quickInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleQuickSend();
            }
        });

        // 快速输入框获得焦点时的动画效果
        this.quickInput.addEventListener('focus', () => {
            this.addFocusEffect();
        });

        // 快速输入框失去焦点时的效果
        this.quickInput.addEventListener('blur', () => {
            this.removeFocusEffect();
        });

        // 实时同步到主输入框（可选功能）
        this.quickInput.addEventListener('input', () => {
            this.syncToMainInput();
        });
    }

    handleQuickSend() {
        const message = this.quickInput.value.trim();
        
        if (!message) {
            this.showInputHint();
            return;
        }

        // 将消息传递给主输入框并发送
        this.transferToMainInput(message);
        
        // 清空快速输入框
        this.quickInput.value = '';
        
        // 添加发送动画
        this.addSendAnimation();
    }

    transferToMainInput(message) {
        if (this.mainInput) {
            // 将消息设置到主输入框
            this.mainInput.value = message;
            
            // 触发主输入框的发送功能
            if (this.mainSendButton) {
                // 模拟点击主发送按钮
                this.mainSendButton.click();
            } else {
                // 如果没有主发送按钮，尝试触发回车事件
                const enterEvent = new KeyboardEvent('keypress', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                this.mainInput.dispatchEvent(enterEvent);
            }
        }
    }

    syncToMainInput() {
        // 实时同步快速输入框的内容到主输入框
        if (this.mainInput && this.quickInput) {
            this.mainInput.value = this.quickInput.value;
        }
    }

    addFocusEffect() {
        const container = this.quickInput.closest('.ai-quick-input-container');
        if (container) {
            container.classList.add('focused');
        }
    }

    removeFocusEffect() {
        const container = this.quickInput.closest('.ai-quick-input-container');
        if (container) {
            container.classList.remove('focused');
        }
    }

    addSendAnimation() {
        const button = this.quickSendButton;
        if (button) {
            button.classList.add('sending');
            setTimeout(() => {
                button.classList.remove('sending');
            }, 300);
        }
    }

    showInputHint() {
        const input = this.quickInput;
        if (input) {
            input.classList.add('shake');
            input.placeholder = '请输入消息...';
            
            setTimeout(() => {
                input.classList.remove('shake');
                input.placeholder = '快速提问...';
            }, 500);
        }
    }

    // 公共方法：设置快速输入框的值
    setValue(value) {
        if (this.quickInput) {
            this.quickInput.value = value;
            this.syncToMainInput();
        }
    }

    // 公共方法：获取快速输入框的值
    getValue() {
        return this.quickInput ? this.quickInput.value : '';
    }

    // 公共方法：聚焦到快速输入框
    focus() {
        if (this.quickInput) {
            this.quickInput.focus();
        }
    }

    // 公共方法：清空快速输入框
    clear() {
        if (this.quickInput) {
            this.quickInput.value = '';
            this.syncToMainInput();
        }
    }
}

// 添加CSS动画类
const quickInputStyles = `
<style>
.ai-quick-input-container.focused {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-send-button.sending {
    transform: scale(0.9);
    background: #06a552;
}

.quick-message-input.shake {
    animation: inputShake 0.5s ease-in-out;
}

@keyframes inputShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.quick-input-wrapper:focus-within .quick-send-button {
    background: #06a552;
    box-shadow: 0 2px 8px rgba(7, 193, 96, 0.3);
}
</style>
`;

// 注入样式
if (!document.querySelector('#quick-input-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'quick-input-styles';
    styleElement.innerHTML = quickInputStyles;
    document.head.appendChild(styleElement);
}

// 全局实例
let aiQuickInput = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    aiQuickInput = new AIQuickInput();
    
    // 将实例暴露到全局，方便其他脚本调用
    window.aiQuickInput = aiQuickInput;
});

// 导出类和实例（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIQuickInput, aiQuickInput };
}