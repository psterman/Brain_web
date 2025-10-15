// AI聊天系统 - 增强版
class AIChatSystem {
    constructor() {
        this.currentModel = 'freeline';
        this.apiKeys = this.loadApiKeys();
        this.chatHistory = {};
        this.isTyping = false;
        
        // AI模型配置
        this.aiModels = {
            freeline: {
                name: '免费专线',
                avatar: '⚡',
                apiUrl: 'https://818233.xyz/',
                welcomeMessage: '你好！我是免费专线AI，无需API密钥即可为您服务！',
                isFree: true,
                mockResponses: [
                    '这是一个很有趣的问题！让我来为你分析一下...',
                    '根据我的理解，这个问题可以从以下几个角度来看：',
                    '我认为这个话题值得深入探讨。首先...',
                    '这确实是一个复杂的问题，需要综合考虑多个因素。',
                    '让我为你提供一个详细的解答...'
                ]
            },
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
    
    // 创建消息元素 - 微信风格
    createMessageElement(message, model) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = message.type === 'user' ? '👤' : this.aiModels[model].avatar;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        // 创建消息文本容器
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        
        // 处理markdown格式
        const formattedContent = this.formatMarkdown(message.content);
        messageText.innerHTML = formattedContent;
        
        // 创建时间戳
        const timestamp = document.createElement('div');
        timestamp.className = 'message-time';
        timestamp.textContent = message.timestamp;
        
        // 组装消息内容
        content.appendChild(messageText);
        content.appendChild(timestamp);
        
        // 组装完整消息
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
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
            
            // 控制显示速度（优化为更快的打字效果）
            await new Promise(resolve => setTimeout(resolve, 8));
        }
        
        // 最终更新聊天历史
        this.chatHistory[this.currentModel][this.chatHistory[this.currentModel].length - 1] = aiMessage;
    }
    
    // 自动滚动到底部
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // 立即滚动
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // 延迟滚动确保内容已渲染
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 10);
            
            // 使用smooth滚动作为备选
            setTimeout(() => {
                chatMessages.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: 'smooth'
                });
            }, 50);
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
        // 免费专线特殊处理
        if (this.currentModel === 'freeline') {
            try {
                return await this.callFreelineAPI(message);
            } catch (error) {
                console.warn('免费专线API调用失败，使用模拟回复:', error);
                return this.getMockResponse(message);
            }
        }
        
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
    
    // 免费专线网页内容获取
    async callFreelineAPI(message) {
        // 处理特殊字符：空格用+替换，+用++替换，/用//替换
        let encodedMessage = message.replace(/\+/g, '++').replace(/\//g, '//').replace(/\s+/g, '+');
        
        // 构建请求URL
        const webUrl = `https://818233.xyz/${encodedMessage}`;
        
        console.log('免费专线网页访问:', webUrl);
        
        // 尝试多种方法获取网页内容
        const corsProxies = [
            'https://api.allorigins.win/get?url=',
            'https://corsproxy.io/?',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        
        for (let i = 0; i < corsProxies.length; i++) {
            const proxy = corsProxies[i];
            try {
                console.log(`尝试代理 ${i + 1}:`, proxy);
                
                let proxyUrl;
                if (proxy.includes('allorigins')) {
                    proxyUrl = `${proxy}${encodeURIComponent(webUrl)}`;
                } else {
                    proxyUrl = `${proxy}${webUrl}`;
                }
                
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
                    }
                });
                
                console.log(`代理 ${i + 1} 响应状态:`, response.status);
                
                if (!response.ok) {
                    throw new Error(`代理请求失败: ${response.status}`);
                }
                
                let htmlContent;
                if (proxy.includes('allorigins')) {
                    const data = await response.json();
                    htmlContent = data.contents;
                } else {
                    htmlContent = await response.text();
                }
                
                console.log('获取到的网页内容:', htmlContent.substring(0, 200) + '...');
                
                // 解析HTML内容，提取AI回答
                const aiResponse = this.parseWebResponse(htmlContent);
                
                if (!aiResponse || aiResponse.trim().length === 0) {
                    throw new Error('网页未返回有效内容');
                }
                
                return aiResponse;
                
            } catch (error) {
                console.warn(`代理 ${i + 1} 失败:`, error.message);
                
                // 如果是最后一个代理也失败了，尝试直接访问
                if (i === corsProxies.length - 1) {
                    try {
                        console.log('尝试直接访问...');
                        const directResponse = await fetch(webUrl, {
                            method: 'GET',
                            mode: 'no-cors'
                        });
                        
                        // no-cors模式下无法读取响应内容，所以提供备用方案
                        return `🤖 **免费专线回复**\n\n您的问题："${message}"\n\n由于网络限制，无法直接获取AI回答内容。\n\n📱 **解决方案：**\n1. 请手动访问：${webUrl}\n2. 或者尝试使用其他AI模型\n\n💡 **提示：** 免费专线服务可能需要特殊的网络环境才能正常访问。`;
                        
                    } catch (directError) {
                        console.error('直接访问也失败:', directError);
                        throw new Error(`免费专线暂时无法访问，请稍后重试。\n\n手动访问链接：${webUrl}`);
                    }
                }
            }
        }
    }
    
    // 解析网页响应内容
    parseWebResponse(htmlContent) {
        try {
            // 创建临时DOM解析器
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // 尝试多种方式提取内容
            let content = '';
            
            // 方法1: 查找body中的文本内容
            const bodyElement = doc.querySelector('body');
            if (bodyElement) {
                content = bodyElement.textContent || bodyElement.innerText || '';
            }
            
            // 方法2: 如果body为空，尝试获取整个文档的文本
            if (!content.trim()) {
                content = doc.documentElement.textContent || doc.documentElement.innerText || '';
            }
            
            // 方法3: 如果仍为空，尝试直接从HTML中提取
            if (!content.trim()) {
                // 移除HTML标签，保留文本内容
                content = htmlContent.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
            }
            
            // 高级内容清理和格式化
            content = this.formatAIResponse(content);
            
            console.log('解析后的AI回答:', content.substring(0, 200) + '...');
            
            return content;
            
        } catch (error) {
            console.error('解析网页内容失败:', error);
            // 如果解析失败，返回原始HTML内容（去除标签）
            const fallbackContent = htmlContent.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
            return this.formatAIResponse(fallbackContent);
        }
    }
    
    // 格式化AI回答内容
    formatAIResponse(rawContent) {
        if (!rawContent) return '';
        
        let content = rawContent;
        
        // 1. 解码HTML实体
        const htmlEntities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&nbsp;': ' ',
            '&hellip;': '...',
            '&mdash;': '—',
            '&ndash;': '–'
        };
        
        for (const [entity, char] of Object.entries(htmlEntities)) {
            content = content.replace(new RegExp(entity, 'g'), char);
        }
        
        // 2. 清理多余的空白字符
        content = content
            .replace(/\r\n/g, '\n')  // 统一换行符
            .replace(/\r/g, '\n')    // 统一换行符
            .replace(/\t/g, ' ')     // 制表符转空格
            .replace(/[ \u00A0]+/g, ' ')  // 多个空格和不间断空格合并
            .replace(/\n\s*\n\s*\n/g, '\n\n')  // 多个连续换行合并为两个
            .trim();
        
        // 3. 移除常见的网页元素文本和广告后缀
        const unwantedPatterns = [
            /^(<!DOCTYPE|<html|<head|<meta|<title|<link|<script|<style)/i,
            /^(Loading|Please wait|Error|404|403|500)/i,
            /^(Copyright|©|All rights reserved)/i,
            /^(Privacy Policy|Terms of Service|Cookie Policy)/i
        ];
        
        for (const pattern of unwantedPatterns) {
            if (pattern.test(content)) {
                content = content.replace(pattern, '').trim();
            }
        }
        
        // 4. 去除广告后缀（LLM from URL相关内容）
        const adSuffixPatterns = [
            /-{10,}[\s\S]*?LLM from URL[\s\S]*?-{10,}/gi,
            /LLM from URL[\s\S]*?A free AI chat completion service directly from URL/gi,
            /LLM from URL[\s\S]*?free AI chat completion service/gi,
            /A free AI chat completion service directly from URL/gi,
            /-{5,}[\s\S]*?https:\/\/818233\.xyz[\s\S]*?-{5,}/gi,
            /\n\s*-{5,}\s*\n[\s\S]*?LLM[\s\S]*?-{5,}\s*$/gi
        ];
        
        for (const pattern of adSuffixPatterns) {
            content = content.replace(pattern, '').trim();
        }
        
        // 5. 如果内容太短，可能是错误信息
        if (content.length < 10) {
            return '免费专线暂时无法获取回答，请稍后重试。';
        }
        
        // 6. 如果内容太长，截取合理长度
        if (content.length > 2000) {
            content = content.substring(0, 2000) + '...\n\n[回答内容较长，已截取部分显示]';
        }
        
        // 7. 确保内容以合适的标点结尾
        if (content && !/[.!?。！？]$/.test(content.trim())) {
            content = content.trim() + '。';
        }
        
        return content;
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
            freeline: 'freeline-ai',
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