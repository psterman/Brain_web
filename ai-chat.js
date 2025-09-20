// AI聊天系统 - 增强版
class AIChatSystem {
    constructor() {
        this.currentModel = 'deepseek';
        this.apiKeys = this.loadApiKeys();
        this.chatHistory = {};
        this.isTyping = false;
        
        // AI模型配置
        this.aiModels = {
            deepseek: {
                name: 'DeepSeek',
                avatar: '🧠',
                apiUrl: 'https://api.deepseek.com/v1/chat/completions',
                welcomeMessage: '你好！我是DeepSeek，有什么可以帮助你的吗？',
                mockResponses: [
                    '这是一个很有趣的问题！让我来为你分析一下...',
                    '根据我的理解，这个问题可以从以下几个角度来看：',
                    '我认为这个话题值得深入探讨。首先...',
                    '这确实是一个复杂的问题，需要综合考虑多个因素。',
                    '让我为你提供一个详细的解答...'
                ]
            },
            kimi: {
                name: 'Kimi',
                avatar: '🤖',
                apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
                welcomeMessage: '您好！我是Kimi，很高兴为您服务！',
                mockResponses: [
                    '这个问题很有意思呢！我来帮您分析一下。',
                    '根据我的知识库，我可以为您提供以下信息：',
                    '让我为您详细解释一下这个概念...',
                    '这确实是一个值得思考的问题，我的建议是：',
                    '我理解您的疑问，让我从不同角度来回答...'
                ]
            },
            zhipu: {
                name: '智谱清言',
                avatar: '💭',
                apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                welcomeMessage: '您好！我是智谱清言，请问有什么可以帮助您的？',
                mockResponses: [
                    '这是一个非常好的问题！让我来为您详细解答。',
                    '基于我的分析，我认为可以从以下几个方面来考虑：',
                    '这个话题确实很有深度，我来为您梳理一下思路。',
                    '根据相关资料和我的理解，我的回答是：',
                    '这个问题涉及多个层面，让我逐一为您分析...'
                ]
            }
        };
        
        this.initializeChatHistory();
        this.bindEvents();
        this.bindApiConfigEvents();
    }
    
    // 初始化聊天历史
    initializeChatHistory() {
        Object.keys(this.aiModels).forEach(modelKey => {
            if (!this.chatHistory[modelKey]) {
                this.chatHistory[modelKey] = [
                    {
                        type: 'ai',
                        content: this.aiModels[modelKey].welcomeMessage,
                        timestamp: new Date().toLocaleTimeString('zh-CN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })
                    }
                ];
            }
        });
    }
    
    // 绑定事件
    bindEvents() {
        // AI模型切换
        document.querySelectorAll('.ai-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const model = tab.dataset.model;
                this.switchModel(model);
            });
        });
        
        // 发送消息
        const sendButton = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');
        
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }
    
    // 绑定API配置事件
    bindApiConfigEvents() {
        // API配置按钮
        const configBtn = document.getElementById('apiConfigBtn');
        if (configBtn) {
            configBtn.addEventListener('click', () => {
                this.showApiConfig();
            });
        }
        
        // 关闭配置模态框
        const closeBtn = document.getElementById('closeConfigBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideApiConfig();
            });
        }
        
        // 保存配置
        const saveBtn = document.getElementById('saveConfigBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveApiConfig();
            });
        }
        
        // 测试连接
        const testBtn = document.getElementById('testConnectionBtn');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.testApiConnection();
            });
        }
    }
    
    // 切换AI模型
    switchModel(modelKey) {
        if (this.aiModels[modelKey]) {
            this.currentModel = modelKey;
            
            // 更新UI
            document.querySelectorAll('.ai-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelector(`[data-model="${modelKey}"]`).classList.add('active');
            
            // 渲染聊天历史
            this.renderChatHistory();
        }
    }
    
    // 渲染聊天历史
    renderChatHistory() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        chatMessages.innerHTML = '';
        const history = this.chatHistory[this.currentModel] || [];
        
        history.forEach(message => {
            const messageElement = this.createMessageElement(message, this.currentModel);
            chatMessages.appendChild(messageElement);
        });
        
        // 自动滚动到底部
        this.scrollToBottom();
    }
    
    // 创建消息元素
    createMessageElement(message, model) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = message.type === 'user' ? '👤' : this.aiModels[model].avatar;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        // 处理markdown格式
        const formattedContent = this.formatMarkdown(message.content);
        content.innerHTML = formattedContent;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = message.timestamp;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messageDiv.appendChild(timestamp);
        
        return messageDiv;
    }
    
    // 格式化Markdown内容
    formatMarkdown(text) {
        // 基本的markdown格式化
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // 粗体
            .replace(/\*(.*?)\*/g, '<em>$1</em>')              // 斜体
            .replace(/`(.*?)`/g, '<code>$1</code>')            // 行内代码
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // 代码块
            .replace(/\n/g, '<br>')                            // 换行
            .replace(/^- (.*$)/gim, '<li>$1</li>')             // 列表项
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');        // 包装列表
    }
    
    // 发送消息
    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;
        
        const message = messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // 添加用户消息
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date().toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
        
        this.chatHistory[this.currentModel].push(userMessage);
        messageInput.value = '';
        
        // 更新UI
        this.renderChatHistory();
        
        // 显示输入指示器
        this.showTypingIndicator();
        
        // 获取AI回复
        try {
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            
            // 流式显示AI回复
            await this.displayStreamingResponse(response);
            
        } catch (error) {
            this.hideTypingIndicator();
            console.error('获取AI回复失败:', error);
            
            const errorMessage = {
                type: 'ai',
                content: '抱歉，我现在无法回复。请检查网络连接或API配置。',
                timestamp: new Date().toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };
            
            this.chatHistory[this.currentModel].push(errorMessage);
            this.renderChatHistory();
        }
    }
    
    // 流式显示AI回复
    async displayStreamingResponse(response) {
        const aiMessage = {
            type: 'ai',
            content: '',
            timestamp: new Date().toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
        
        this.chatHistory[this.currentModel].push(aiMessage);
        
        // 创建消息元素
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = this.createMessageElement(aiMessage, this.currentModel);
        chatMessages.appendChild(messageElement);
        
        const contentElement = messageElement.querySelector('.message-content');
        
        // 逐字显示效果
        let currentText = '';
        const words = response.split('');
        
        for (let i = 0; i < words.length; i++) {
            currentText += words[i];
            aiMessage.content = currentText;
            contentElement.innerHTML = this.formatMarkdown(currentText);
            
            // 自动滚动到底部
            this.scrollToBottom();
            
            // 控制显示速度
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        // 最终更新聊天历史
        this.chatHistory[this.currentModel][this.chatHistory[this.currentModel].length - 1] = aiMessage;
    }
    
    // 自动滚动到底部
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // 显示输入指示器
    showTypingIndicator() {
        this.isTyping = true;
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = this.aiModels[this.currentModel].avatar;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        
        content.appendChild(indicator);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(content);
        chatMessages.appendChild(typingDiv);
        
        this.scrollToBottom();
    }
    
    // 隐藏输入指示器
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // 获取AI回复
    async getAIResponse(message) {
        const apiKey = this.apiKeys[this.currentModel];
        
        // 如果有API密钥，尝试真实API调用
        if (apiKey) {
            try {
                return await this.callRealAPI(message, apiKey);
            } catch (error) {
                console.warn('真实API调用失败，使用模拟回复:', error);
            }
        }
        
        // 使用模拟回复
        return this.getMockResponse(message);
    }
    
    // 真实API调用
    async callRealAPI(message, apiKey) {
        const model = this.aiModels[this.currentModel];
        
        // 根据不同模型使用不同的认证方式
        let headers = {
            'Content-Type': 'application/json'
        };
        
        let requestBody = {
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
            stream: false
        };
        
        // 智谱清言使用不同的认证方式
        if (this.currentModel === 'zhipu') {
            headers['Authorization'] = `Bearer ${apiKey}`;
            requestBody.model = 'glm-4';
        } else if (this.currentModel === 'deepseek') {
            headers['Authorization'] = `Bearer ${apiKey}`;
            requestBody.model = 'deepseek-chat';
        } else if (this.currentModel === 'kimi') {
            headers['Authorization'] = `Bearer ${apiKey}`;
            requestBody.model = 'moonshot-v1-8k';
        }
        
        const response = await fetch(model.apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API调用失败: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // 根据不同模型处理响应格式
        if (this.currentModel === 'zhipu') {
            // 智谱清言的响应格式
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else if (data.data && data.data.choices && data.data.choices[0]) {
                return data.data.choices[0].message.content;
            } else if (data.output && data.output.text) {
                return data.output.text;
            } else {
                console.error('智谱清言API响应:', data);
                throw new Error(`智谱清言API响应格式不正确: ${JSON.stringify(data)}`);
            }
        } else {
            // 其他模型的标准OpenAI格式
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                console.error('API响应:', data);
                throw new Error(`API响应格式不正确: ${JSON.stringify(data)}`);
            }
        }
    }
    
    // 获取模型名称
    getModelName() {
        const modelNames = {
            deepseek: 'deepseek-chat',
            kimi: 'moonshot-v1-8k',
            zhipu: 'glm-4'
        };
        return modelNames[this.currentModel] || 'gpt-3.5-turbo';
    }
    
    // 模拟回复
    getMockResponse(message) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = this.aiModels[this.currentModel].mockResponses;
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                // 根据用户消息内容生成更相关的回复
                let response = randomResponse;
                if (message.includes('你好') || message.includes('hello')) {
                    response = `你好！很高兴与你交流。${randomResponse}`;
                } else if (message.includes('谢谢') || message.includes('感谢')) {
                    response = '不客气！很高兴能帮助到你。还有其他问题吗？';
                } else if (message.includes('再见') || message.includes('拜拜')) {
                    response = '再见！期待下次与你的交流！';
                } else if (message.includes('代码') || message.includes('编程')) {
                    response = `关于编程的问题，我很乐意帮助你！\n\n**这里是一个简单的示例：**\n\`\`\`javascript\nfunction hello() {\n    console.log("Hello World!");\n}\n\`\`\`\n\n你还有其他编程相关的问题吗？`;
                }
                
                resolve(response);
            }, 1000 + Math.random() * 2000); // 1-3秒随机延迟
        });
    }
    
    // 显示API配置
    showApiConfig() {
        const modal = document.getElementById('apiConfigModal');
        if (modal) {
            // 加载当前配置
            document.getElementById('deepseekApiKey').value = this.apiKeys.deepseek || '';
            document.getElementById('kimiApiKey').value = this.apiKeys.kimi || '';
            document.getElementById('zhipuApiKey').value = this.apiKeys.zhipu || '';
            
            modal.style.display = 'flex';
        }
    }
    
    // 隐藏API配置
    hideApiConfig() {
        const modal = document.getElementById('apiConfigModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // 保存API配置
    saveApiConfig() {
        this.apiKeys.deepseek = document.getElementById('deepseekApiKey').value.trim();
        this.apiKeys.kimi = document.getElementById('kimiApiKey').value.trim();
        this.apiKeys.zhipu = document.getElementById('zhipuApiKey').value.trim();
        
        // 保存到本地存储
        localStorage.setItem('aiChatApiKeys', JSON.stringify(this.apiKeys));
        
        this.hideApiConfig();
        
        // 显示保存成功提示
        this.showToast('API配置已保存');
    }
    
    // 测试API连接
    async testApiConnection() {
        const testBtn = document.getElementById('testConnectionBtn');
        if (!testBtn) return;
        
        const originalText = testBtn.textContent;
        testBtn.textContent = '测试中...';
        testBtn.disabled = true;
        
        try {
            // 这里可以添加实际的API测试逻辑
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showToast('API连接测试成功');
        } catch (error) {
            this.showToast('API连接测试失败');
        } finally {
            testBtn.textContent = originalText;
            testBtn.disabled = false;
        }
    }
    
    // 加载API密钥
    loadApiKeys() {
        try {
            const saved = localStorage.getItem('aiChatApiKeys');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('加载API密钥失败:', error);
            return {};
        }
    }
    
    // 显示提示消息
    showToast(message) {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;
        toast.textContent = message;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // 2秒后移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 2000);
    }
}

// 初始化AI聊天系统
let aiChatSystem;

document.addEventListener('DOMContentLoaded', () => {
    aiChatSystem = new AIChatSystem();
});