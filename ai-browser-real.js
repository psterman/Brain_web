// 真实AI浏览器集成功能
class AIBrowserReal {
    constructor() {
        this.currentTab = null;
        this.aiConfigs = {};
        this.isLoading = false;
        this.init();
    }

    init() {
        this.createBrowserInterface();
        this.bindEvents();
        this.switchTab('chatgpt');
        this.startAutoDemo();
    }

    createBrowserInterface() {
        const container = document.querySelector('.ai-chat-demo');
        if (!container) return;

        container.innerHTML = `
            <div class="ai-browser-container">
                <div class="ai-browser-tabs">
                    ${Object.keys(this.aiConfigs).map(key => `
                        <button class="ai-browser-tab" data-tab="${key}">
                            <div class="ai-tab-icon ${key}"></div>
                            <span>${this.aiConfigs[key].name}</span>
                        </button>
                    `).join('')}
                </div>
                
                <div class="ai-browser-toolbar">
                    <button class="ai-browser-nav-btn" id="back-btn" onclick="history.back()" title="后退">←</button>
                    <button class="ai-browser-nav-btn" id="forward-btn" onclick="history.forward()" title="前进">→</button>
                    <input type="text" class="ai-browser-address-bar" id="address-bar" readonly>
                    <button class="ai-browser-refresh-btn" id="refresh-btn" title="刷新">⟳</button>
                    <button class="ai-browser-nav-btn" id="fullscreen-btn" title="全屏">⛶</button>
                </div>
                
                <div class="ai-browser-content">
                    ${Object.keys(this.aiConfigs).map(key => `
                        <div class="ai-browser-frame ${key}-frame" data-frame="${key}">
                            <div class="ai-website-simulator ${key}-simulator">
                                ${this.createAIInterface(key)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createAIInterface(aiType) {
        const config = this.aiConfigs[aiType];
        return `
            <div class="ai-website-frame-container">
                <div class="ai-frame-overlay" id="${aiType}-overlay">
                    <div class="frame-loading">
                        <div class="loading-spinner"></div>
                        <p>正在加载 ${config.name} 官网...</p>
                        <p class="loading-tip">由于跨域限制，某些网站可能无法直接嵌入</p>
                        <button class="open-new-tab-btn" onclick="window.open('${config.url}', '_blank')">
                            在新标签页中打开 ${config.name}
                        </button>
                    </div>
                </div>
                <iframe 
                    id="${aiType}-iframe" 
                    class="ai-real-frame" 
                    src="${config.url}"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
            
            <div class="ai-interaction-panel ${config.panelCollapsed ? 'collapsed' : ''}" id="${aiType}-panel">
                <div class="ai-panel-header">
                    <div class="${aiType}-logo">${config.name.charAt(0)}</div>
                    <div class="${aiType}-title">${config.name} 官网</div>
                    <button class="toggle-panel-btn" data-ai="${aiType}" title="切换面板">💬</button>
                </div>
                
                <div class="ai-panel-content">
                    <div class="ai-status-info">
                        <div class="ai-login-indicator ${config.isConnected ? 'logged-in' : ''}"></div>
                        <span>${config.isConnected ? '已连接' : '未连接'}</span>
                        <button class="ai-connect-btn" data-ai="${aiType}">
                            ${config.isConnected ? '断开' : '连接'}
                        </button>
                    </div>
                    
                    <div class="ai-quick-actions">
                        <button class="quick-action-btn" onclick="window.open('${config.url}', '_blank')" title="新窗口打开">🔗</button>
                        <button class="quick-action-btn" onclick="document.getElementById('${aiType}-iframe').src = '${config.url}'" title="重新加载">🔄</button>
                        <button class="quick-action-btn" data-action="screenshot" data-ai="${aiType}" title="截图">📷</button>
                    </div>
                    
                    <div class="ai-quick-chat" id="${aiType}-quick-chat">
                        ${this.renderMessages(aiType)}
                    </div>
                    
                    <div class="ai-input-area">
                        <input type="text" class="ai-input" id="${aiType}-input" 
                               placeholder="快速向 ${config.name} 提问..." 
                               ${config.isConnected ? '' : 'disabled'}>
                        <button class="ai-send-btn" id="${aiType}-send" 
                                ${config.isConnected ? '' : 'disabled'}>发送</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderMessages(aiType) {
        const messages = this.aiConfigs[aiType].messages;
        if (messages.length === 0) {
            return `<div class="ai-message assistant">
                <div>你好！我是 ${this.aiConfigs[aiType].name}，有什么可以帮助你的吗？</div>
                <div class="ai-message-time">${new Date().toLocaleTimeString()}</div>
            </div>`;
        }
        
        return messages.map(msg => `
            <div class="ai-message ${msg.role}">
                <div>${msg.content}</div>
                <div class="ai-message-time">${msg.time}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // 标签页切换
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ai-browser-tab')) {
                const tab = e.target.closest('.ai-browser-tab').dataset.tab;
                this.switchTab(tab);
            }
        });

        // 连接/断开按钮
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ai-connect-btn')) {
                const aiType = e.target.dataset.ai;
                this.toggleConnection(aiType);
            }
        });

        // 面板切换按钮
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-panel-btn')) {
                const aiType = e.target.dataset.ai;
                this.togglePanel(aiType);
            }
        });

        // 发送消息
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ai-send-btn')) {
                const aiType = e.target.id.replace('-send', '');
                this.sendMessage(aiType);
            }
        });

        // 回车发送
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('ai-input')) {
                const aiType = e.target.id.replace('-input', '');
                this.sendMessage(aiType);
            }
        });

        // 刷新按钮
        document.addEventListener('click', (e) => {
            if (e.target.id === 'refresh-btn') {
                this.refreshCurrentTab();
            }
        });

        // 全屏按钮
        document.addEventListener('click', (e) => {
            if (e.target.id === 'fullscreen-btn') {
                this.toggleFullscreen();
            }
        });

        // iframe加载事件处理
        this.setupIframeHandlers();
    }

    setupIframeHandlers() {
        setTimeout(() => {
            Object.keys(this.aiConfigs).forEach(aiType => {
                const iframe = document.getElementById(`${aiType}-iframe`);
                const overlay = document.getElementById(`${aiType}-overlay`);
                
                if (iframe && overlay) {
                    // iframe加载完成
                    iframe.onload = () => {
                        setTimeout(() => {
                            overlay.classList.add('hidden');
                        }, 2000);
                    };

                    // iframe加载错误
                    iframe.onerror = () => {
                        overlay.innerHTML = `
                            <div class="frame-error">
                                <div class="error-icon">⚠️</div>
                                <p>无法加载 ${this.aiConfigs[aiType].name} 官网</p>
                                <p class="error-reason">可能是由于跨域限制或网络问题</p>
                                <button class="open-new-tab-btn" onclick="window.open('${this.aiConfigs[aiType].url}', '_blank')">
                                    在新标签页中打开
                                </button>
                                <button class="retry-btn" onclick="document.getElementById('${aiType}-iframe').src = '${this.aiConfigs[aiType].url}'">
                                    重试
                                </button>
                            </div>
                        `;
                    };

                    // 设置超时处理
                    setTimeout(() => {
                        if (!overlay.classList.contains('hidden')) {
                            overlay.innerHTML = `
                                <div class="frame-timeout">
                                    <div class="timeout-icon">⏱️</div>
                                    <p>${this.aiConfigs[aiType].name} 加载时间较长</p>
                                    <p class="timeout-reason">网站可能有防嵌入保护</p>
                                    <button class="open-new-tab-btn" onclick="window.open('${this.aiConfigs[aiType].url}', '_blank')">
                                        在新标签页中打开
                                    </button>
                                    <button class="continue-wait-btn" onclick="this.parentElement.parentElement.classList.add('hidden')">
                                        继续等待
                                    </button>
                                </div>
                            `;
                        }
                    }, 10000);
                }
            });
        }, 500);
    }

    switchTab(tabId) {
        if (this.isLoading) return;
        
        this.currentTab = tabId;
        
        // 更新标签页状态
        document.querySelectorAll('.ai-browser-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // 更新内容区域
        document.querySelectorAll('.ai-browser-frame').forEach(frame => {
            frame.classList.remove('active');
        });
        document.querySelector(`[data-frame="${tabId}"]`).classList.add('active');
        
        // 更新地址栏
        const addressBar = document.getElementById('address-bar');
        if (addressBar) {
            addressBar.value = this.aiConfigs[tabId].url;
        }
        
        // 添加切换动画
        this.addSwitchAnimation();
        
        console.log(`切换到 ${this.aiConfigs[tabId].name}`);
    }

    addSwitchAnimation() {
        const activeFrame = document.querySelector('.ai-browser-frame.active');
        if (activeFrame) {
            activeFrame.style.opacity = '0';
            activeFrame.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                activeFrame.style.transition = 'all 0.3s ease';
                activeFrame.style.opacity = '1';
                activeFrame.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    toggleConnection(aiType) {
        const config = this.aiConfigs[aiType];
        config.isConnected = !config.isConnected;
        
        // 更新界面
        this.updateAIInterface(aiType);
        
        // 模拟连接过程
        if (config.isConnected) {
            this.simulateConnection(aiType);
        } else {
            this.simulateDisconnection(aiType);
        }
    }

    simulateConnection(aiType) {
        const config = this.aiConfigs[aiType];
        this.showToast(`正在连接 ${config.name}...`);
        
        setTimeout(() => {
            this.showToast(`${config.name} 连接成功！`);
            this.updateAIInterface(aiType);
        }, 1500);
    }

    simulateDisconnection(aiType) {
        const config = this.aiConfigs[aiType];
        config.messages = []; // 清空消息记录
        this.showToast(`已断开 ${config.name} 连接`);
        this.updateAIInterface(aiType);
    }

    togglePanel(aiType) {
        const panel = document.getElementById(`${aiType}-panel`);
        if (panel) {
            panel.classList.toggle('collapsed');
            this.aiConfigs[aiType].panelCollapsed = panel.classList.contains('collapsed');
        }
    }

    updateAIInterface(aiType) {
        const frame = document.querySelector(`[data-frame="${aiType}"]`);
        if (frame) {
            const simulator = frame.querySelector('.ai-website-simulator');
            simulator.innerHTML = this.createAIInterface(aiType);
            this.setupIframeHandlers();
        }
    }

    sendMessage(aiType) {
        const input = document.getElementById(`${aiType}-input`);
        const message = input.value.trim();
        
        if (!message || !this.aiConfigs[aiType].isConnected) return;
        
        // 添加用户消息
        this.addMessage(aiType, 'user', message);
        input.value = '';
        
        // 显示加载状态
        this.showAILoading(aiType);
        
        // 模拟AI回复
        setTimeout(() => {
            this.hideAILoading(aiType);
            const response = this.generateAIResponse(aiType, message);
            this.addMessage(aiType, 'assistant', response);
        }, 1000 + Math.random() * 2000);
    }

    addMessage(aiType, role, content) {
        const message = {
            role,
            content,
            time: new Date().toLocaleTimeString()
        };
        
        this.aiConfigs[aiType].messages.push(message);
        
        // 更新聊天区域
        const chatArea = document.getElementById(`${aiType}-quick-chat`);
        if (chatArea) {
            chatArea.innerHTML = this.renderMessages(aiType);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    showAILoading(aiType) {
        const chatArea = document.getElementById(`${aiType}-quick-chat`);
        if (chatArea) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'ai-loading';
            loadingDiv.id = `${aiType}-loading`;
            loadingDiv.innerHTML = `
                <span>${this.aiConfigs[aiType].name} 正在思考</span>
                <div class="ai-loading-dots">
                    <div class="ai-loading-dot"></div>
                    <div class="ai-loading-dot"></div>
                    <div class="ai-loading-dot"></div>
                </div>
            `;
            chatArea.appendChild(loadingDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    hideAILoading(aiType) {
        const loading = document.getElementById(`${aiType}-loading`);
        if (loading) {
            loading.remove();
        }
    }

    generateAIResponse(aiType, message) {
        const responses = {
            chatgpt: [
                "这是一个很有趣的问题。从我的角度来看...",
                "让我来帮你分析一下这个问题。",
                "根据我的理解，这个问题可以从几个方面来考虑...",
                "我很乐意帮助你解决这个问题。",
                "这确实是一个值得深入思考的话题。"
            ],
            deepseek: [
                "基于深度学习的分析，我认为...",
                "从技术角度来看，这个问题涉及到...",
                "让我用更专业的方式来回答你的问题。",
                "这是一个复杂的问题，需要综合考虑多个因素。",
                "我会尽我所能为你提供准确的信息。"
            ],
            kimi: [
                "我来帮你整理一下相关信息...",
                "这个问题很有意思，让我搜索一下最新的资料。",
                "根据我掌握的知识，我可以这样回答...",
                "我理解你的疑问，让我详细解释一下。",
                "这确实是一个需要仔细分析的问题。"
            ],
            doubao: [
                "哈哈，这个问题问得很好！让我想想...",
                "我觉得可以从这几个角度来看这个问题。",
                "这让我想起了一个有趣的观点...",
                "我很高兴能和你讨论这个话题。",
                "让我用简单易懂的方式来解释一下。"
            ],
            claude: [
                "我很乐意帮助你思考这个问题。",
                "这是一个需要仔细考虑的复杂话题。",
                "让我尝试从不同的角度来分析...",
                "我认为这个问题的关键在于...",
                "基于我的理解，我可以提供以下见解..."
            ]
        };
        
        const aiResponses = responses[aiType] || responses.chatgpt;
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        return `${randomResponse} 关于"${message}"这个问题，我需要更多的上下文来给出更准确的回答。你能提供更多细节吗？`;
    }

    refreshCurrentTab() {
        const refreshBtn = document.getElementById('refresh-btn');
        const iframe = document.getElementById(`${this.currentTab}-iframe`);
        const overlay = document.getElementById(`${this.currentTab}-overlay`);
        
        if (refreshBtn && iframe && overlay) {
            refreshBtn.classList.add('loading');
            overlay.classList.remove('hidden');
            overlay.innerHTML = `
                <div class="frame-loading">
                    <div class="loading-spinner"></div>
                    <p>正在刷新 ${this.aiConfigs[this.currentTab].name}...</p>
                </div>
            `;
            
            iframe.src = iframe.src;
            
            setTimeout(() => {
                refreshBtn.classList.remove('loading');
            }, 1000);
        }
    }

    toggleFullscreen() {
        const container = document.querySelector('.ai-browser-container');
        if (container) {
            container.classList.toggle('fullscreen');
            const btn = document.getElementById('fullscreen-btn');
            if (btn) {
                btn.innerHTML = container.classList.contains('fullscreen') ? '⛶' : '⛶';
            }
        }
    }

    showToast(message) {
        // 创建提示消息
        const toast = document.createElement('div');
        toast.className = 'ai-browser-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    startAutoDemo() {
        // 自动演示功能
        setTimeout(() => {
            this.showToast('欢迎体验真实AI官网浏览功能！');
        }, 1000);
        
        // 自动切换演示
        let demoIndex = 0;
        const aiTypes = Object.keys(this.aiConfigs);
        
        setInterval(() => {
            if (document.querySelector('.ai-browser-container:hover')) return;
            
            demoIndex = (demoIndex + 1) % aiTypes.length;
            this.switchTab(aiTypes[demoIndex]);
        }, 15000);
        
        // 自动连接演示
        setTimeout(() => {
            if (!this.aiConfigs[this.currentTab].isConnected) {
                this.toggleConnection(this.currentTab);
            }
        }, 5000);
    }

    // 批量发送消息到多个AI
    broadcastMessage(message, targetAIs = null) {
        const targets = targetAIs || Object.keys(this.aiConfigs).filter(
            key => this.aiConfigs[key].isConnected
        );
        
        targets.forEach(aiType => {
            if (this.aiConfigs[aiType].isConnected) {
                setTimeout(() => {
                    this.addMessage(aiType, 'user', message);
                    this.showAILoading(aiType);
                    
                    setTimeout(() => {
                        this.hideAILoading(aiType);
                        const response = this.generateAIResponse(aiType, message);
                        this.addMessage(aiType, 'assistant', response);
                    }, 1000 + Math.random() * 2000);
                }, Math.random() * 500);
            }
        });
        
        this.showToast(`消息已发送到 ${targets.length} 个AI平台`);
    }
}

// 初始化真实AI浏览器
let aiBrowserReal;

document.addEventListener('DOMContentLoaded', () => {
    // 等待页面完全加载后初始化
    setTimeout(() => {
        aiBrowserReal = new AIBrowserReal();
        
        // 添加全局快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        aiBrowserReal.switchTab('chatgpt');
                        break;
                    case '2':
                        e.preventDefault();
                        aiBrowserReal.switchTab('deepseek');
                        break;
                    case '3':
                        e.preventDefault();
                        aiBrowserReal.switchTab('kimi');
                        break;
                    case '4':
                        e.preventDefault();
                        aiBrowserReal.switchTab('doubao');
                        break;
                    case '5':
                        e.preventDefault();
                        aiBrowserReal.switchTab('claude');
                        break;
                    case 'r':
                        e.preventDefault();
                        aiBrowserReal.refreshCurrentTab();
                        break;
                }
            }
        });
        
        console.log('真实AI浏览器集成功能已初始化');
    }, 500);
});

// 导出给其他模块使用
window.AIBrowserReal = AIBrowserReal;
window.aiBrowserReal = aiBrowserReal;