// AI浏览器代理解决方案
class AIBrowserProxy {
    constructor() {
        this.currentTab = null;
        this.aiConfigs = {};
        this.isLoading = false;
        this.init();
    }

    init() {
        this.createBrowserInterface();
        this.bindEvents();
        // AI平台功能已移除
    }

    async testEmbedCapability() {
        // 测试每个网站是否可以嵌入
        for (const [key, config] of Object.entries(this.aiConfigs)) {
            try {
                const response = await fetch(config.url, { 
                    method: 'HEAD',
                    mode: 'no-cors'
                });
                config.canEmbed = true;
            } catch (error) {
                config.canEmbed = false;
                console.log(`${config.name} 无法直接嵌入，将使用备用方案`);
            }
        }
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
                    <button class="ai-browser-nav-btn" id="back-btn" title="后退">←</button>
                    <button class="ai-browser-nav-btn" id="forward-btn" title="前进">→</button>
                    <input type="text" class="ai-browser-address-bar" id="address-bar" readonly>
                    <button class="ai-browser-refresh-btn" id="refresh-btn" title="刷新">⟳</button>
                    <button class="ai-browser-nav-btn" id="new-window-btn" title="新窗口打开">🔗</button>
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
                        <p>正在尝试加载 ${config.name} 官网...</p>
                        <div class="loading-progress">
                            <div class="progress-bar" id="${aiType}-progress"></div>
                        </div>
                        <p class="loading-status" id="${aiType}-status">检测网站兼容性...</p>
                    </div>
                </div>
                
                <div class="ai-embed-container" id="${aiType}-embed">
                    <!-- 这里将根据网站兼容性动态生成内容 -->
                </div>
            </div>
            
            <div class="ai-interaction-panel ${config.panelCollapsed ? 'collapsed' : ''}" id="${aiType}-panel">
                <div class="ai-panel-header">
                    <div class="${aiType}-logo">${config.name.charAt(0)}</div>
                    <div class="${aiType}-title">${config.name}</div>
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
                    
                    <div class="ai-access-options">
                        <button class="access-option-btn primary" onclick="window.open('${config.url}', '_blank', 'width=1200,height=800')">
                            🚀 新窗口打开
                        </button>
                        <button class="access-option-btn secondary" onclick="this.openInPopup('${aiType}')">
                            📱 弹窗模式
                        </button>
                        <button class="access-option-btn secondary" onclick="this.copyUrl('${config.url}')">
                            📋 复制链接
                        </button>
                    </div>
                    
                    <div class="ai-website-preview" id="${aiType}-preview">
                        ${this.createWebsitePreview(aiType)}
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

    createWebsitePreview(aiType) {
        const config = this.aiConfigs[aiType];
        const previews = {
            chatgpt: `
                <div class="website-preview chatgpt-preview">
                    <div class="preview-header">
                        <div class="preview-logo">🤖</div>
                        <div class="preview-title">ChatGPT</div>
                        <div class="preview-status">OpenAI</div>
                    </div>
                    <div class="preview-content">
                        <div class="preview-feature">💬 智能对话</div>
                        <div class="preview-feature">📝 文本生成</div>
                        <div class="preview-feature">🔍 问题解答</div>
                        <div class="preview-feature">💡 创意协助</div>
                    </div>
                    <div class="preview-footer">
                        <span class="preview-url">${config.url}</span>
                    </div>
                </div>
            `,
            deepseek: `
                <div class="website-preview deepseek-preview">
                    <div class="preview-header">
                        <div class="preview-logo">🧠</div>
                        <div class="preview-title">DeepSeek</div>
                        <div class="preview-status">深度求索</div>
                    </div>
                    <div class="preview-content">
                        <div class="preview-feature">🔬 深度推理</div>
                        <div class="preview-feature">💻 代码生成</div>
                        <div class="preview-feature">📊 数据分析</div>
                        <div class="preview-feature">🎯 专业解答</div>
                    </div>
                    <div class="preview-footer">
                        <span class="preview-url">${config.url}</span>
                    </div>
                </div>
            `,
            kimi: `
                <div class="website-preview kimi-preview">
                    <div class="preview-header">
                        <div class="preview-logo">🌙</div>
                        <div class="preview-title">Kimi</div>
                        <div class="preview-status">月之暗面</div>
                    </div>
                    <div class="preview-content">
                        <div class="preview-feature">📚 长文本理解</div>
                        <div class="preview-feature">🔍 信息检索</div>
                        <div class="preview-feature">📝 内容总结</div>
                        <div class="preview-feature">🌐 多语言支持</div>
                    </div>
                    <div class="preview-footer">
                        <span class="preview-url">${config.url}</span>
                    </div>
                </div>
            `,
            doubao: `
                <div class="website-preview doubao-preview">
                    <div class="preview-header">
                        <div class="preview-logo">🫘</div>
                        <div class="preview-title">豆包</div>
                        <div class="preview-status">字节跳动</div>
                    </div>
                    <div class="preview-content">
                        <div class="preview-feature">💬 智能聊天</div>
                        <div class="preview-feature">🎨 创意写作</div>
                        <div class="preview-feature">📱 生活助手</div>
                        <div class="preview-feature">🎯 个性化服务</div>
                    </div>
                    <div class="preview-footer">
                        <span class="preview-url">${config.url}</span>
                    </div>
                </div>
            `,
            claude: `
                <div class="website-preview claude-preview">
                    <div class="preview-header">
                        <div class="preview-logo">🎭</div>
                        <div class="preview-title">Claude</div>
                        <div class="preview-status">Anthropic</div>
                    </div>
                    <div class="preview-content">
                        <div class="preview-feature">🤔 深度思考</div>
                        <div class="preview-feature">📖 文档分析</div>
                        <div class="preview-feature">🔒 安全可靠</div>
                        <div class="preview-feature">🎯 精准回答</div>
                    </div>
                    <div class="preview-footer">
                        <span class="preview-url">${config.url}</span>
                    </div>
                </div>
            `
        };
        
        return previews[aiType] || '';
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

        // 新窗口打开按钮
        document.addEventListener('click', (e) => {
            if (e.target.id === 'new-window-btn') {
                this.openInNewWindow();
            }
        });

        // 刷新按钮
        document.addEventListener('click', (e) => {
            if (e.target.id === 'refresh-btn') {
                this.refreshCurrentTab();
            }
        });

        // 绑定全局方法
        window.openInPopup = this.openInPopup.bind(this);
        window.copyUrl = this.copyUrl.bind(this);
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
        
        // 尝试加载网站
        this.loadWebsite(tabId);
        
        console.log(`切换到 ${this.aiConfigs[tabId].name}`);
    }

    async loadWebsite(aiType) {
        const config = this.aiConfigs[aiType];
        const overlay = document.getElementById(`${aiType}-overlay`);
        const embedContainer = document.getElementById(`${aiType}-embed`);
        const progressBar = document.getElementById(`${aiType}-progress`);
        const statusText = document.getElementById(`${aiType}-status`);
        
        if (!overlay || !embedContainer) return;
        
        // 显示加载状态
        overlay.classList.remove('hidden');
        
        // 模拟加载进度
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 90) progress = 90;
            if (progressBar) progressBar.style.width = `${progress}%`;
        }, 200);
        
        try {
            // 更新状态
            if (statusText) statusText.textContent = `正在连接 ${config.name}...`;
            
            // 尝试不同的加载方式
            await this.tryLoadMethods(aiType, embedContainer);
            
            // 完成加载
            clearInterval(progressInterval);
            if (progressBar) progressBar.style.width = '100%';
            if (statusText) statusText.textContent = '加载完成';
            
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 1000);
            
        } catch (error) {
            clearInterval(progressInterval);
            this.showLoadError(aiType, error.message);
        }
    }

    async tryLoadMethods(aiType, container) {
        const config = this.aiConfigs[aiType];
        
        // 方法1: 尝试iframe嵌入
        try {
            const iframe = document.createElement('iframe');
            iframe.src = config.url;
            iframe.className = 'ai-real-frame';
            iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation';
            
            // 设置超时检测
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('iframe加载超时')), 5000);
            });
            
            const loadPromise = new Promise((resolve, reject) => {
                iframe.onload = resolve;
                iframe.onerror = reject;
            });
            
            container.innerHTML = '';
            container.appendChild(iframe);
            
            await Promise.race([loadPromise, timeoutPromise]);
            return; // 成功加载
            
        } catch (error) {
            console.log(`${config.name} iframe加载失败:`, error.message);
        }
        
        // 方法2: 显示网站预览和访问选项
        container.innerHTML = `
            <div class="ai-website-fallback">
                <div class="fallback-header">
                    <div class="fallback-icon">🔒</div>
                    <h3>${config.name} 官网</h3>
                    <p>由于安全策略，无法直接嵌入此网站</p>
                </div>
                
                <div class="fallback-preview">
                    ${this.createWebsitePreview(aiType)}
                </div>
                
                <div class="fallback-actions">
                    <button class="fallback-btn primary" onclick="window.open('${config.url}', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')">
                        🚀 在新窗口中打开
                    </button>
                    <button class="fallback-btn secondary" onclick="window.open('${config.url}', 'ai-${aiType}', 'width=800,height=600,scrollbars=yes,resizable=yes')">
                        📱 弹窗模式打开
                    </button>
                    <button class="fallback-btn secondary" onclick="navigator.clipboard.writeText('${config.url}').then(() => alert('链接已复制到剪贴板'))">
                        📋 复制链接
                    </button>
                </div>
                
                <div class="fallback-tips">
                    <h4>💡 使用提示：</h4>
                    <ul>
                        <li>点击"新窗口打开"获得最佳体验</li>
                        <li>可以同时打开多个AI网站进行对比</li>
                        <li>右侧面板支持快速聊天功能</li>
                    </ul>
                </div>
            </div>
        `;
    }

    showLoadError(aiType, errorMessage) {
        const overlay = document.getElementById(`${aiType}-overlay`);
        if (overlay) {
            overlay.innerHTML = `
                <div class="frame-error">
                    <div class="error-icon">⚠️</div>
                    <h3>加载失败</h3>
                    <p>${errorMessage}</p>
                    <div class="error-actions">
                        <button class="error-btn primary" onclick="window.open('${this.aiConfigs[aiType].url}', '_blank')">
                            在新标签页中打开
                        </button>
                        <button class="error-btn secondary" onclick="this.loadWebsite('${aiType}')">
                            重试
                        </button>
                    </div>
                </div>
            `;
        }
    }

    openInNewWindow() {
        const config = this.aiConfigs[this.currentTab];
        window.open(config.url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        this.showToast(`已在新窗口打开 ${config.name}`);
    }

    openInPopup(aiType) {
        const config = this.aiConfigs[aiType];
        window.open(config.url, `ai-${aiType}`, 'width=800,height=600,scrollbars=yes,resizable=yes');
        this.showToast(`已在弹窗中打开 ${config.name}`);
    }

    copyUrl(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('链接已复制到剪贴板');
        }).catch(() => {
            this.showToast('复制失败，请手动复制');
        });
    }

    toggleConnection(aiType) {
        const config = this.aiConfigs[aiType];
        config.isConnected = !config.isConnected;
        
        // 更新界面
        this.updateAIInterface(aiType);
        
        if (config.isConnected) {
            this.showToast(`${config.name} 连接成功！`);
        } else {
            this.showToast(`已断开 ${config.name} 连接`);
        }
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
                "我很乐意帮助你解决这个问题。"
            ],
            deepseek: [
                "基于深度学习的分析，我认为...",
                "从技术角度来看，这个问题涉及到...",
                "让我用更专业的方式来回答你的问题。",
                "这是一个复杂的问题，需要综合考虑多个因素。"
            ],
            kimi: [
                "我来帮你整理一下相关信息...",
                "这个问题很有意思，让我搜索一下最新的资料。",
                "根据我掌握的知识，我可以这样回答...",
                "我理解你的疑问，让我详细解释一下。"
            ],
            doubao: [
                "哈哈，这个问题问得很好！让我想想...",
                "我觉得可以从这几个角度来看这个问题。",
                "这让我想起了一个有趣的观点...",
                "我很高兴能和你讨论这个话题。"
            ],
            claude: [
                "我很乐意帮助你思考这个问题。",
                "这是一个需要仔细考虑的复杂话题。",
                "让我尝试从不同的角度来分析...",
                "我认为这个问题的关键在于..."
            ]
        };
        
        const aiResponses = responses[aiType] || responses.chatgpt;
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        return `${randomResponse} 关于"${message}"这个问题，建议你在 ${this.aiConfigs[aiType].name} 官网中获得更详细和准确的回答。`;
    }

    refreshCurrentTab() {
        this.loadWebsite(this.currentTab);
        this.showToast(`正在刷新 ${this.aiConfigs[this.currentTab].name}`);
    }

    showToast(message) {
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
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
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
}

// 初始化AI浏览器代理
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.aiBrowserProxy = new AIBrowserProxy();
        console.log('AI浏览器代理功能已初始化');
    }, 500);
});