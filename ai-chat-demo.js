// AI对话多平台聚合功能

// 与手机屏幕tab功能协同工作
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否存在手机屏幕内的AI聊天界面
    const phoneAiChat = document.getElementById('ai-chat-content');
    if (phoneAiChat) {
        console.log('检测到手机AI聊天界面，初始化同步功能...');
        initPhoneAiChatSync();
        
        // 注册全局刷新函数，供tab切换时调用
        window.refreshAiChat = refreshAiChatContent;
    }
});

// 刷新AI聊天内容
function refreshAiChatContent() {
    console.log('刷新AI聊天内容...');
    
    // 获取手机AI聊天界面
    const aiChatContent = document.getElementById('ai-chat-content');
    if (!aiChatContent) return;
    
    // 添加刷新动画
    aiChatContent.classList.add('content-refresh');
    setTimeout(() => {
        aiChatContent.classList.remove('content-refresh');
    }, 500);
    
    // 模拟新消息输入
    simulateNewMessage();
}

// 模拟新消息输入
function simulateNewMessage() {
    // 获取手机AI聊天消息区域
    const messagesContainer = document.querySelector('.phone-ai-messages');
    if (!messagesContainer) return;
    
    // 获取输入框
    const inputField = document.querySelector('.phone-ai-input input');
    if (!inputField) return;
    
    // 模拟输入框动画
    inputField.classList.add('typing');
    setTimeout(() => {
        inputField.classList.remove('typing');
        
        // 随机选择一个问题
        const questions = [
            '如何提高编程效率？',
            '推荐几个学习编程的网站',
            '人工智能的未来发展趋势',
            '如何选择合适的浏览器？',
            '小脑浏览器有哪些特色功能？'
        ];
        
        // 更新用户消息
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        updatePhoneUserMessage(randomQuestion);
        
        // 延迟后更新AI回复
        setTimeout(() => {
            // 随机选择要显示的AI平台
            const platforms = Object.keys(AI_PLATFORMS);
            const randomPlatforms = platforms.sort(() => 0.5 - Math.random()).slice(0, 2);
            
            // 为每个选中的平台生成回复
            randomPlatforms.forEach(platform => {
                const aiPlatform = AI_PLATFORMS[platform];
                const templates = aiPlatform.responseTemplates;
                const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                
                // 更新AI回复
                updatePhoneAiMessage(platform, randomTemplate);
            });
        }, 1000);
    }, 800);
}

// 初始化手机AI聊天同步功能
function initPhoneAiChatSync() {
    // 监听主AI聊天区域的变化
    const mainChatObserver = new MutationObserver((mutations) => {
        // 当主聊天区域有新消息时，同步到手机界面
        syncMainChatToPhone();
    });
    
    const mainChatArea = document.querySelector('.ai-chat-messages');
    if (mainChatArea) {
        mainChatObserver.observe(mainChatArea, { 
            childList: true, 
            subtree: true 
        });
    }
    
    // 初始同步一次
    setTimeout(syncMainChatToPhone, 1000);
}

// 将主聊天区域的消息同步到手机界面
function syncMainChatToPhone() {
    const mainMessages = document.querySelectorAll('.ai-chat-message');
    const phoneMessages = document.querySelector('.phone-ai-messages');
    
    if (!mainMessages.length || !phoneMessages) return;
    
    // 清空手机消息区域
    // phoneMessages.innerHTML = '';
    
    // 只同步最新的一条用户消息和各平台回复
    let latestUserMessage = null;
    const aiResponses = {};
    
    // 查找最新的用户消息和AI回复
    for (let i = mainMessages.length - 1; i >= 0; i--) {
        const message = mainMessages[i];
        if (message.classList.contains('user') && !latestUserMessage) {
            latestUserMessage = message;
        } else if (message.classList.contains('ai')) {
            // 获取AI平台类型
            for (const platform of Object.keys(AI_PLATFORMS)) {
                if (message.classList.contains(platform) && !aiResponses[platform]) {
                    aiResponses[platform] = message;
                }
            }
        }
        
        // 如果已找到用户消息和至少一个AI回复，则停止搜索
        if (latestUserMessage && Object.keys(aiResponses).length > 0) {
            break;
        }
    }
    
    // 更新手机界面中的用户消息
    if (latestUserMessage) {
        const userMessageContent = latestUserMessage.querySelector('.message-content').textContent;
        updatePhoneUserMessage(userMessageContent);
    }
    
    // 更新手机界面中的AI回复
    for (const platform in aiResponses) {
        const aiMessage = aiResponses[platform];
        const aiMessageContent = aiMessage.querySelector('.message-content').textContent;
        updatePhoneAiMessage(platform, aiMessageContent);
    }
}

// 更新手机界面中的用户消息
function updatePhoneUserMessage(content) {
    const phoneUserMessage = document.querySelector('.phone-ai-message.user .message-content');
    if (phoneUserMessage) {
        phoneUserMessage.textContent = content;
    }
}

// 更新手机界面中的AI回复
function updatePhoneAiMessage(platform, content) {
    const phoneAiMessage = document.querySelector(`.phone-ai-message.ai.${platform} .message-content`);
    if (phoneAiMessage) {
        phoneAiMessage.textContent = content;
    }
}

// AI平台配置
const AI_PLATFORMS = {
    chatgpt: {
        name: 'ChatGPT',
        icon: '<div class="ai-platform-icon chatgpt-icon"></div>',
        responseTime: '1.2s',
        style: 'chatgpt',
        responseTemplates: [
            "根据我的理解，这个问题涉及到...",
            "这是一个很好的问题。从技术角度来看...",
            "我认为这个问题可以从几个方面来思考...",
            "基于最新的研究和数据，我可以告诉你..."
        ]
    },
    deepseek: {
        name: 'DeepSeek',
        icon: '<div class="ai-platform-icon deepseek-icon"></div>',
        responseTime: '0.9s',
        style: 'deepseek',
        responseTemplates: [
            "从技术实现角度分析，这个问题的核心在于...",
            "作为一个专注于深度学习的模型，我认为...",
            "这个问题涉及到几个关键技术点...",
            "从代码层面来看，你可以这样实现..."
        ]
    },
    kimi: {
        name: 'Kimi',
        icon: '<div class="ai-platform-icon kimi-icon"></div>',
        responseTime: '1.5s',
        style: 'kimi',
        responseTemplates: [
            "我查阅了相关文档，发现这个问题的答案是...",
            "根据我的知识库，这个问题可以这样解决...",
            "这个问题很有趣，我找到了几篇相关论文...",
            "从多个角度分析，我认为最佳方案是..."
        ]
    },
    douban: {
        name: '豆包',
        icon: '<div class="ai-platform-icon doubao-icon"></div>',
        responseTime: '1.1s',
        style: 'douban',
        responseTemplates: [
            "这个问题在中文语境下，我们通常这样理解...",
            "从实用角度出发，我建议你可以...",
            "结合中国用户的使用习惯，我认为...",
            "这个问题在国内的解决方案通常是..."
        ]
    },
    claude: {
        name: 'Claude',
        icon: '<div class="ai-platform-icon claude-icon"></div>',
        responseTime: '1.3s',
        style: 'claude',
        responseTemplates: [
            "从哲学和伦理的角度思考，这个问题...",
            "我尝试从多个维度来分析这个问题...",
            "这是个有深度的问题，让我系统地回答...",
            "考虑到各种因素，我的分析是..."
        ]
    }
};

// 示例问题库
const SAMPLE_QUESTIONS = [
    "什么是量子计算？",
    "如何提高编程效率？",
    "人工智能会取代人类工作吗？",
    "如何学习一门新语言？",
    "区块链技术的应用场景有哪些？",
    "如何培养创造性思维？",
    "元宇宙的发展前景如何？"
];

// 初始化函数
function initAIChatDemo() {
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatSubmit = document.getElementById('aiChatSubmit');
    const aiResponsesContainer = document.getElementById('aiResponsesContainer');
    
    // 设置随机的示例问题作为占位符
    aiChatInput.placeholder = `试试问: "${getRandomSampleQuestion()}"`;
    
    // 提交按钮点击事件
    aiChatSubmit.addEventListener('click', () => {
        handleChatSubmit(aiChatInput, aiResponsesContainer);
    });
    
    // 输入框回车事件
    aiChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSubmit(aiChatInput, aiResponsesContainer);
        }
    });
    
    // 平台选择框变化事件
    document.querySelectorAll('.ai-platform-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // 确保至少有一个平台被选中
            const checkedPlatforms = document.querySelectorAll('.ai-platform-checkbox:checked');
            if (checkedPlatforms.length === 0) {
                checkbox.checked = true;
            }
        });
    });
}

// 处理聊天提交
function handleChatSubmit(inputElement, responsesContainer) {
    const query = inputElement.value.trim();
    if (!query) return;
    
    // 清空输入框
    inputElement.value = '';
    
    // 更新占位符
    inputElement.placeholder = `试试问: "${getRandomSampleQuestion()}"`;
    
    // 获取选中的AI平台
    const selectedPlatforms = [];
    document.querySelectorAll('.ai-platform-checkbox:checked').forEach(checkbox => {
        selectedPlatforms.push(checkbox.id);
    });
    
    // 如果没有选中任何平台，默认选择ChatGPT
    if (selectedPlatforms.length === 0) {
        selectedPlatforms.push('chatgpt');
        document.getElementById('chatgpt').checked = true;
    }
    
    // 显示响应容器
    responsesContainer.classList.add('active');
    
    // 清空之前的响应
    responsesContainer.innerHTML = '';
    
    // 为每个选中的平台创建加载动画
    selectedPlatforms.forEach(platformId => {
        const platform = AI_PLATFORMS[platformId];
        createLoadingIndicator(responsesContainer, platform);
    });
    
    // 模拟AI响应（在实际应用中，这里会调用真实的AI API）
    selectedPlatforms.forEach((platformId, index) => {
        const platform = AI_PLATFORMS[platformId];
        const responseTime = parseInt(platform.responseTime) * 1000;
        
        // 模拟不同的响应时间
        setTimeout(() => {
            // 移除该平台的加载指示器
            const loadingIndicator = document.querySelector(`.ai-response-loading[data-platform="${platformId}"]`);
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
            
            // 创建响应卡片
            createResponseCard(responsesContainer, platform, query);
        }, responseTime + Math.random() * 500);
    });
}

// 创建加载指示器
function createLoadingIndicator(container, platform) {
    const loadingHTML = `
        <div class="ai-response-loading" data-platform="${platform.style}">
            <div class="ai-response-platform-icon">${platform.icon}</div>
            <div class="ai-response-platform-name">${platform.name}</div>
            <div class="ai-loading-dots">
                <div class="ai-loading-dot ${platform.style}"></div>
                <div class="ai-loading-dot ${platform.style}"></div>
                <div class="ai-loading-dot ${platform.style}"></div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', loadingHTML);
}

// 创建响应卡片
function createResponseCard(container, platform, query) {
    // 生成模拟响应
    const response = generateAIResponse(platform, query);
    
    const cardHTML = `
        <div class="ai-response-card" data-platform="${platform.style}">
            <div class="ai-response-header">
                <div class="ai-response-platform-icon">${platform.icon}</div>
                <div class="ai-response-platform-name">${platform.name}</div>
            </div>
            <div class="ai-response-content">
                ${response}
            </div>
            <div class="ai-response-footer">
                <div class="ai-response-time">响应时间: ${platform.responseTime}</div>
                <div class="ai-response-actions">
                    <span class="ai-response-action">👍</span>
                    <span class="ai-response-action">👎</span>
                    <span class="ai-response-action">💾</span>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', cardHTML);
    
    // 添加点击事件到操作按钮
    const card = container.lastElementChild;
    card.querySelectorAll('.ai-response-action').forEach(action => {
        action.addEventListener('click', (e) => {
            // 简单的反馈效果
            e.target.style.transform = 'scale(1.2)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 200);
        });
    });
}

// 生成AI响应
function generateAIResponse(platform, query) {
    // 从模板中随机选择一个响应开头
    const responseTemplate = platform.responseTemplates[Math.floor(Math.random() * platform.responseTemplates.length)];
    
    // 根据查询内容生成不同的响应
    let specificResponse = '';
    
    if (query.includes('量子') || query.includes('计算')) {
        specificResponse = '量子计算是利用量子力学原理进行信息处理的计算方式。与传统计算机使用比特（0或1）不同，量子计算机使用量子比特，可以同时处于多个状态，这使得它们能够并行处理大量信息。';
    } else if (query.includes('编程') || query.includes('效率')) {
        specificResponse = '提高编程效率的方法包括：使用合适的IDE和工具、学习键盘快捷键、编写可重用的代码、遵循最佳实践、使用版本控制系统、自动化测试等。定期休息和保持良好的工作环境也很重要。';
    } else if (query.includes('人工智能') || query.includes('AI')) {
        specificResponse = '人工智能可能会改变某些工作，但不太可能完全取代人类。AI更可能成为人类的辅助工具，接管重复性任务，让人类专注于需要创造力、情感智能和复杂决策的工作。';
    } else if (query.includes('语言') || query.includes('学习')) {
        specificResponse = '学习新语言的有效方法包括：每天坚持学习、沉浸在语言环境中、找语言交换伙伴、使用学习应用、阅读和听该语言的内容、不怕犯错并从错误中学习。';
    } else if (query.includes('区块链')) {
        specificResponse = '区块链技术的应用场景包括：金融服务、供应链管理、医疗记录、身份验证、智能合约、投票系统、知识产权保护等。它的去中心化和不可篡改特性使其在需要透明度和信任的领域特别有价值。';
    } else {
        // 默认响应
        specificResponse = '这是一个很有深度的问题。从多个角度来看，我们需要考虑技术发展、社会影响以及个人成长等因素。随着科技的进步，我们有更多工具和资源来解决这类问题。';
    }
    
    // 组合响应
    return `${responseTemplate} ${specificResponse}`;
}

// 获取随机示例问题
function getRandomSampleQuestion() {
    return SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
}

// 同步手机模型中的聊天界面
function syncPhoneChat(query, platform, response) {
    // 只同步ChatGPT和DeepSeek的响应到手机界面
    if (platform.style !== 'chatgpt' && platform.style !== 'deepseek') return;
    
    // 如果是第一个响应，更新用户问题
    const phoneMessages = document.querySelector('.phone-ai-messages');
    const userMessage = phoneMessages.querySelector('.phone-ai-message.user .message-content');
    
    if (userMessage) {
        userMessage.textContent = query;
    }
    
    // 更新对应AI的响应
    const aiMessage = phoneMessages.querySelector(`.phone-ai-message.ai.${platform.style} .message-content`);
    
    if (aiMessage) {
        // 截取响应的前部分以适应手机屏幕
        const shortResponse = response.split(' ').slice(0, 15).join(' ') + '...';
        aiMessage.textContent = shortResponse;
    }
}

// 创建响应卡片时同步到手机界面
const originalCreateResponseCard = createResponseCard;
createResponseCard = function(container, platform, query) {
    // 调用原始函数
    originalCreateResponseCard(container, platform, query);
    
    // 生成响应内容
    const response = generateAIResponse(platform, query);
    
    // 同步到手机界面
    syncPhoneChat(query, platform, response);
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initAIChatDemo();
    
    // 添加手机模型交互效果
    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        phoneMockup.addEventListener('mouseenter', () => {
            phoneMockup.style.transform = 'scale(1.05) rotateY(5deg)';
        });
        
        phoneMockup.addEventListener('mouseleave', () => {
            phoneMockup.style.transform = '';
        });
    }
});

// 为了演示效果，添加一个自动触发功能
setTimeout(() => {
    // 自动填充一个问题
    const aiChatInput = document.getElementById('aiChatInput');
    aiChatInput.value = "人工智能会如何改变我们的未来？";
    
    // 自动点击提交按钮
    document.getElementById('aiChatSubmit').click();
}, 3000);
