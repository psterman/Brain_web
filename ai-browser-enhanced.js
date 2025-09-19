// AI浏览器增强功能
class AIBrowserEnhanced {
    constructor() {
        this.aiBrowser = null;
        this.comparisonMode = false;
        this.batchQuery = false;
        this.init();
    }

    init() {
        // 等待AI浏览器初始化完成
        setTimeout(() => {
            if (window.aiBrowserIntegration) {
                this.aiBrowser = window.aiBrowserIntegration;
                this.addEnhancedFeatures();
            }
        }, 1000);
    }

    addEnhancedFeatures() {
        this.addBatchQueryButton();
        this.addComparisonMode();
        this.addQuickActions();
        this.addKeyboardShortcuts();
    }

    addBatchQueryButton() {
        const container = document.querySelector('.ai-browser-container');
        if (!container) return;

        const toolbar = container.querySelector('.ai-browser-toolbar');
        if (!toolbar) return;

        // 添加批量查询按钮
        const batchBtn = document.createElement('button');
        batchBtn.className = 'ai-browser-nav-btn batch-query-btn';
        batchBtn.innerHTML = '📊';
        batchBtn.title = '批量查询所有AI';
        batchBtn.onclick = () => this.toggleBatchQuery();

        // 添加对比模式按钮
        const compareBtn = document.createElement('button');
        compareBtn.className = 'ai-browser-nav-btn compare-mode-btn';
        compareBtn.innerHTML = '⚖️';
        compareBtn.title = '对比模式';
        compareBtn.onclick = () => this.toggleComparisonMode();

        toolbar.appendChild(batchBtn);
        toolbar.appendChild(compareBtn);
    }

    toggleBatchQuery() {
        this.batchQuery = !this.batchQuery;
        const btn = document.querySelector('.batch-query-btn');
        
        if (this.batchQuery) {
            btn.style.background = 'var(--primary-color)';
            btn.style.color = 'white';
            this.showToast('批量查询模式已开启');
            this.addBatchQueryInterface();
        } else {
            btn.style.background = '';
            btn.style.color = '';
            this.showToast('批量查询模式已关闭');
            this.removeBatchQueryInterface();
        }
    }

    addBatchQueryInterface() {
        const container = document.querySelector('.ai-browser-container');
        if (!container) return;

        // 创建批量查询界面
        const batchInterface = document.createElement('div');
        batchInterface.className = 'batch-query-interface';
        batchInterface.innerHTML = `
            <div class="batch-query-header">
                <h3>批量查询多个AI</h3>
                <button class="close-batch-btn">×</button>
            </div>
            <div class="batch-query-content">
                <div class="ai-selection">
                    <h4>选择AI平台：</h4>
                    <div class="ai-checkboxes">
                        ${Object.keys(this.aiBrowser.aiConfigs).map(key => `
                            <label class="ai-checkbox-label">
                                <input type="checkbox" value="${key}" ${this.aiBrowser.aiConfigs[key].isLoggedIn ? 'checked' : 'disabled'}>
                                <span class="ai-checkbox-text">${this.aiBrowser.aiConfigs[key].name}</span>
                                ${!this.aiBrowser.aiConfigs[key].isLoggedIn ? '<span class="login-required">(需登录)</span>' : ''}
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div class="batch-input-area">
                    <textarea class="batch-input" placeholder="输入要查询的问题..."></textarea>
                    <button class="batch-send-btn">发送到选中的AI</button>
                </div>
            </div>
        `;

        container.appendChild(batchInterface);

        // 绑定事件
        batchInterface.querySelector('.close-batch-btn').onclick = () => {
            this.toggleBatchQuery();
        };

        batchInterface.querySelector('.batch-send-btn').onclick = () => {
            this.executeBatchQuery();
        };
    }

    removeBatchQueryInterface() {
        const batchInterface = document.querySelector('.batch-query-interface');
        if (batchInterface) {
            batchInterface.remove();
        }
    }

    executeBatchQuery() {
        const input = document.querySelector('.batch-input');
        const checkboxes = document.querySelectorAll('.ai-checkboxes input[type="checkbox"]:checked');
        
        if (!input.value.trim()) {
            this.showToast('请输入查询内容');
            return;
        }

        if (checkboxes.length === 0) {
            this.showToast('请选择至少一个AI平台');
            return;
        }

        const selectedAIs = Array.from(checkboxes).map(cb => cb.value);
        const message = input.value.trim();

        // 执行批量查询
        this.aiBrowser.broadcastMessage(message, selectedAIs);
        
        // 清空输入
        input.value = '';
        
        // 关闭批量查询界面
        this.toggleBatchQuery();
    }

    toggleComparisonMode() {
        this.comparisonMode = !this.comparisonMode;
        const btn = document.querySelector('.compare-mode-btn');
        
        if (this.comparisonMode) {
            btn.style.background = 'var(--primary-color)';
            btn.style.color = 'white';
            this.showToast('对比模式已开启');
            this.enableComparisonView();
        } else {
            btn.style.background = '';
            btn.style.color = '';
            this.showToast('对比模式已关闭');
            this.disableComparisonView();
        }
    }

    enableComparisonView() {
        const container = document.querySelector('.ai-browser-container');
        if (!container) return;

        container.classList.add('comparison-mode');
        
        // 创建对比视图
        const comparisonView = document.createElement('div');
        comparisonView.className = 'comparison-view';
        comparisonView.innerHTML = `
            <div class="comparison-header">
                <h3>AI回答对比</h3>
                <div class="comparison-controls">
                    <button class="export-comparison-btn">导出对比</button>
                    <button class="clear-comparison-btn">清空对比</button>
                </div>
            </div>
            <div class="comparison-content">
                <div class="comparison-grid">
                    ${Object.keys(this.aiBrowser.aiConfigs).map(key => `
                        <div class="comparison-column" data-ai="${key}">
                            <div class="comparison-ai-header">
                                <div class="ai-tab-icon ${key}"></div>
                                <span>${this.aiBrowser.aiConfigs[key].name}</span>
                            </div>
                            <div class="comparison-messages" id="comparison-${key}">
                                <!-- 消息将在这里显示 -->
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.appendChild(comparisonView);

        // 绑定事件
        comparisonView.querySelector('.export-comparison-btn').onclick = () => {
            this.exportComparison();
        };

        comparisonView.querySelector('.clear-comparison-btn').onclick = () => {
            this.clearComparison();
        };

        // 同步现有消息到对比视图
        this.syncMessagesToComparison();
    }

    disableComparisonView() {
        const container = document.querySelector('.ai-browser-container');
        if (!container) return;

        container.classList.remove('comparison-mode');
        
        const comparisonView = document.querySelector('.comparison-view');
        if (comparisonView) {
            comparisonView.remove();
        }
    }

    syncMessagesToComparison() {
        Object.keys(this.aiBrowser.aiConfigs).forEach(aiType => {
            const messages = this.aiBrowser.aiConfigs[aiType].messages;
            const comparisonColumn = document.getElementById(`comparison-${aiType}`);
            
            if (comparisonColumn && messages.length > 0) {
                comparisonColumn.innerHTML = messages.map(msg => `
                    <div class="comparison-message ${msg.role}">
                        <div class="message-content">${msg.content}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `).join('');
            }
        });
    }

    exportComparison() {
        const comparisonData = {};
        
        Object.keys(this.aiBrowser.aiConfigs).forEach(aiType => {
            comparisonData[aiType] = {
                name: this.aiBrowser.aiConfigs[aiType].name,
                messages: this.aiBrowser.aiConfigs[aiType].messages
            };
        });

        const dataStr = JSON.stringify(comparisonData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ai-comparison-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showToast('对比数据已导出');
    }

    clearComparison() {
        Object.keys(this.aiBrowser.aiConfigs).forEach(aiType => {
            this.aiBrowser.aiConfigs[aiType].messages = [];
            const comparisonColumn = document.getElementById(`comparison-${aiType}`);
            if (comparisonColumn) {
                comparisonColumn.innerHTML = '';
            }
            
            // 同时清空主界面的消息
            const chatArea = document.getElementById(`${aiType}-chat`);
            if (chatArea) {
                chatArea.innerHTML = this.aiBrowser.renderMessages(aiType);
            }
        });
        
        this.showToast('对比数据已清空');
    }

    addQuickActions() {
        const container = document.querySelector('.ai-browser-container');
        if (!container) return;

        // 添加快捷操作面板
        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions-panel';
        quickActions.innerHTML = `
            <div class="quick-actions-header">
                <span>快捷操作</span>
                <button class="toggle-quick-actions">⚡</button>
            </div>
            <div class="quick-actions-content">
                <button class="quick-action-btn" data-action="login-all">一键登录所有AI</button>
                <button class="quick-action-btn" data-action="logout-all">一键退出所有AI</button>
                <button class="quick-action-btn" data-action="clear-all">清空所有对话</button>
                <button class="quick-action-btn" data-action="export-all">导出所有对话</button>
            </div>
        `;

        container.appendChild(quickActions);

        // 绑定事件
        quickActions.querySelector('.toggle-quick-actions').onclick = () => {
            quickActions.classList.toggle('expanded');
        };

        quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const action = e.target.dataset.action;
                this.executeQuickAction(action);
            }
        });
    }

    executeQuickAction(action) {
        switch(action) {
            case 'login-all':
                Object.keys(this.aiBrowser.aiConfigs).forEach(aiType => {
                    if (!this.aiBrowser.aiConfigs[aiType].isLoggedIn) {
                        this.aiBrowser.toggleLogin(aiType);
                    }
                });
                this.showToast('正在登录所有AI平台...');
                break;
                
            case 'logout-all':
                Object.keys(this.aiBrowser.aiConfigs).forEach(aiType => {
                    if (this.aiBrowser.aiConfigs[aiType].isLoggedIn) {
                        this.aiBrowser.toggleLogin(aiType);
                    }
                });
                this.showToast('已退出所有AI平台');
                break;
                
            case 'clear-all':
                Object.keys(this.aiBrowser.aiConfigs).forEach(aiType => {
                    this.aiBrowser.aiConfigs[aiType].messages = [];
                    this.aiBrowser.updateAIInterface(aiType);
                });
                this.showToast('已清空所有对话记录');
                break;
                
            case 'export-all':
                this.exportAllConversations();
                break;
        }
    }

    exportAllConversations() {
        const allData = {};
        
        Object.keys(this.aiBrowser.aiConfigs).forEach(aiType => {
            allData[aiType] = {
                name: this.aiBrowser.aiConfigs[aiType].name,
                messages: this.aiBrowser.aiConfigs[aiType].messages,
                isLoggedIn: this.aiBrowser.aiConfigs[aiType].isLoggedIn
            };
        });

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `all-ai-conversations-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showToast('所有对话记录已导出');
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case 'b':
                        e.preventDefault();
                        this.toggleBatchQuery();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.toggleComparisonMode();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.executeQuickAction('login-all');
                        break;
                    case 'q':
                        e.preventDefault();
                        document.querySelector('.toggle-quick-actions')?.click();
                        break;
                }
            }
        });
    }

    showToast(message) {
        if (this.aiBrowser && this.aiBrowser.showToast) {
            this.aiBrowser.showToast(message);
        }
    }
}

// 添加增强功能的CSS样式
const enhancedStyles = `
<style>
.batch-query-interface {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    margin: 0 16px;
}

.batch-query-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
}

.batch-query-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.close-batch-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 4px;
}

.batch-query-content {
    padding: 16px;
}

.ai-selection h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 500;
}

.ai-checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
}

.ai-checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    cursor: pointer;
}

.ai-checkbox-label input[type="checkbox"]:disabled {
    opacity: 0.5;
}

.login-required {
    color: var(--text-secondary);
    font-size: 11px;
}

.batch-input-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.batch-input {
    width: 100%;
    min-height: 80px;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    resize: vertical;
    background: var(--surface-bg);
    color: var(--text-primary);
}

.batch-send-btn {
    padding: 10px 16px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    align-self: flex-end;
}

.comparison-mode .ai-browser-content {
    display: none;
}

.comparison-view {
    background: var(--surface-bg);
    border-radius: 8px;
    overflow: hidden;
}

.comparison-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
}

.comparison-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.comparison-controls {
    display: flex;
    gap: 8px;
}

.comparison-controls button {
    padding: 6px 12px;
    font-size: 12px;
    border: 1px solid var(--border-color);
    background: var(--card-bg);
    color: var(--text-primary);
    border-radius: 4px;
    cursor: pointer;
}

.comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1px;
    background: var(--border-color);
}

.comparison-column {
    background: var(--card-bg);
    min-height: 400px;
}

.comparison-ai-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: var(--surface-bg);
    border-bottom: 1px solid var(--border-color);
    font-weight: 500;
    font-size: 13px;
}

.comparison-messages {
    padding: 12px;
    max-height: 350px;
    overflow-y: auto;
}

.comparison-message {
    margin-bottom: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
}

.comparison-message.user {
    background: var(--primary-color);
    color: white;
    margin-left: 20px;
}

.comparison-message.assistant {
    background: var(--surface-bg);
    border: 1px solid var(--border-color);
    margin-right: 20px;
}

.message-time {
    font-size: 10px;
    opacity: 0.7;
    margin-top: 4px;
}

.quick-actions-panel {
    position: absolute;
    top: 16px;
    right: 16px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    z-index: 999;
    min-width: 200px;
}

.quick-actions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid var(--border-color);
    font-size: 13px;
    font-weight: 500;
}

.toggle-quick-actions {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: var(--text-secondary);
}

.quick-actions-content {
    display: none;
    padding: 8px;
}

.quick-actions-panel.expanded .quick-actions-content {
    display: block;
}

.quick-action-btn {
    display: block;
    width: 100%;
    padding: 8px 12px;
    margin-bottom: 4px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    border-radius: 4px;
    font-size: 12px;
    color: var(--text-primary);
}

.quick-action-btn:hover {
    background: var(--hover-bg);
}

@media (max-width: 768px) {
    .comparison-grid {
        grid-template-columns: 1fr;
    }
    
    .quick-actions-panel {
        position: relative;
        top: auto;
        right: auto;
        margin: 16px;
    }
    
    .batch-query-interface {
        margin: 0 8px;
    }
}
</style>
`;

// 注入样式
document.head.insertAdjacentHTML('beforeend', enhancedStyles);

// 初始化增强功能
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new AIBrowserEnhanced();
    }, 1500);
});