// 手机页面重新设计的交互功能

document.addEventListener('DOMContentLoaded', () => {
    initRedesignedPhoneFeatures();
});

function initRedesignedPhoneFeatures() {
    console.log('初始化重新设计的手机功能...');
    
    // 初始化AI聊天功能
    initAiChatFeatures();
    
    // 初始化浏览器功能
    initBrowserFeatures();
    
    // 初始化应用跳转功能
    initAppJumpFeatures();
    
    // 初始化小组件功能
    initWidgetFeatures();
}

// AI聊天功能
function initAiChatFeatures() {
    // AI助手项点击事件
    const assistantItems = document.querySelectorAll('.ai-assistant-item');
    assistantItems.forEach(item => {
        item.addEventListener('click', () => {
            // 添加点击效果
            item.classList.add('clicked');
            setTimeout(() => {
                item.classList.remove('clicked');
            }, 200);
            
            // 模拟AI对话
            const aiName = item.querySelector('.ai-name').textContent;
            simulateAiConversation(aiName);
        });
    });
    
    // AI输入框功能
    const aiInput = document.querySelector('.ai-main-input');
    if (aiInput) {
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const question = aiInput.value.trim();
                if (question) {
                    simulateAiQuestion(question);
                    aiInput.value = '';
                }
            }
        });
    }
}

// 模拟AI对话
function simulateAiConversation(aiName) {
    console.log(`与${aiName}开始对话`);
    
    // 更新AI状态
    const aiItem = Array.from(document.querySelectorAll('.ai-assistant-item'))
        .find(item => item.querySelector('.ai-name').textContent === aiName);
    
    if (aiItem) {
        const statusElement = aiItem.querySelector('.ai-status');
        statusElement.textContent = '正在思考中...';
        
        // 模拟回复延迟
        setTimeout(() => {
            const responses = [
                '我来帮您解答这个问题...',
                '根据我的理解，这个问题可以这样分析...',
                '让我为您提供一些建议...',
                '这是一个很好的问题，我的看法是...'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            statusElement.textContent = randomResponse;
        }, 1500);
    }
}

// 模拟AI提问
function simulateAiQuestion(question) {
    console.log(`用户提问: ${question}`);
    
    // 更新所有AI助手状态
    const assistantItems = document.querySelectorAll('.ai-assistant-item');
    assistantItems.forEach(item => {
        const statusElement = item.querySelector('.ai-status');
        statusElement.textContent = '正在分析问题...';
        
        // 随机延迟回复
        const delay = Math.random() * 2000 + 1000;
        setTimeout(() => {
            const responses = [
                `关于"${question}"，我的建议是...`,
                `针对您的问题"${question}"，我认为...`,
                `这个问题很有趣，我的分析是...`,
                `让我来回答"${question}"这个问题...`
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            statusElement.textContent = randomResponse;
        }, delay);
    });
}

// 浏览器功能
function initBrowserFeatures() {
    // 功能卡片点击事件
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            // 添加点击效果
            card.classList.add('clicked');
            setTimeout(() => {
                card.classList.remove('clicked');
            }, 200);
            
            const title = card.querySelector('.feature-title').textContent;
            simulateFeatureSelection(title);
        });
    });
    
    // 搜索输入框功能
    const browserInput = document.querySelector('.browser-search-input');
    if (browserInput) {
        browserInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = browserInput.value.trim();
                if (query) {
                    simulateBrowserSearch(query);
                }
            }
        });
    }
    
    // 导航按钮功能
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.add('clicked');
            setTimeout(() => {
                btn.classList.remove('clicked');
            }, 200);
        });
    });
}

// 模拟功能选择
function simulateFeatureSelection(featureName) {
    console.log(`选择功能: ${featureName}`);
    
    // 显示选择反馈
    const toast = createToast(`已选择: ${featureName}`);
    showToast(toast);
}

// 模拟浏览器搜索
function simulateBrowserSearch(query) {
    console.log(`浏览器搜索: ${query}`);
    
    const toast = createToast(`正在搜索: ${query}`);
    showToast(toast);
}

// 应用跳转功能
function initAppJumpFeatures() {
    // 分类项点击事件
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除其他项的激活状态
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // 激活当前项
            item.classList.add('active');
            
            const categoryName = item.querySelector('.category-name').textContent;
            simulateCategorySwitch(categoryName);
        });
    });
    
    // 应用项点击事件
    const appItems = document.querySelectorAll('.app-item');
    appItems.forEach(item => {
        item.addEventListener('click', () => {
            // 添加点击效果
            item.classList.add('clicked');
            setTimeout(() => {
                item.classList.remove('clicked');
            }, 300);
            
            const appName = item.querySelector('.app-name').textContent;
            simulateAppLaunch(appName);
        });
    });
    
    // 应用搜索功能
    const appSearchInput = document.querySelector('.app-search-input input');
    if (appSearchInput) {
        appSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query) {
                simulateAppSearch(query);
            } else {
                // 清空搜索时，移除所有高亮
                const appItems = document.querySelectorAll('.app-item');
                appItems.forEach(item => {
                    item.classList.remove('search-highlight');
                });
            }
        });
        
        // 添加回车键搜索功能
        appSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    // 查找第一个高亮的应用
                    const highlightedApp = document.querySelector('.app-item.search-highlight');
                    if (highlightedApp) {
                        const appName = highlightedApp.querySelector('.app-name').textContent.trim();
                        jumpToAppSearch(appName, query);
                    } else {
                        // 如果没有高亮应用，显示提示
                        const toast = createToast('请先输入关键词匹配应用，或点击应用图标进行搜索');
                        showToast(toast);
                    }
                }
            }
        });
    }
}

// 跳转到应用搜索
function jumpToAppSearch(appName, query) {
    console.log(`跳转到 ${appName} 搜索: ${query}`);
    
    // 获取应用配置
    const appConfig = findAppConfigByName(appName);
    if (!appConfig) {
        const toast = createToast(`未找到 ${appName} 的配置信息`);
        showToast(toast);
        return;
    }
    
    // 构建搜索URL
    const searchUrl = appConfig.searchUrl ? appConfig.searchUrl + encodeURIComponent(query) : null;
    const appSearchUrl = appConfig.appSearchUrl ? appConfig.appSearchUrl + encodeURIComponent(query) : null;
    
    // 显示跳转提示
    const toast = createToast(`正在跳转到 ${appName} 搜索"${query}"...`);
    showToast(toast);
    
    // 尝试打开应用内搜索
    if (appSearchUrl) {
        try {
            // 创建隐藏的链接来尝试打开应用
            const link = document.createElement('a');
            link.href = appSearchUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 延迟后检查是否成功打开应用，如果没有则打开网页版
            setTimeout(() => {
                if (searchUrl) {
                    window.open(searchUrl, '_blank');
                    const successToast = createToast(`已在新标签页打开 ${appName} 搜索结果`);
                    showToast(successToast);
                }
            }, 1000);
        } catch (error) {
            console.log('应用跳转失败，尝试网页版:', error);
            if (searchUrl) {
                window.open(searchUrl, '_blank');
                const successToast = createToast(`已在新标签页打开 ${appName} 搜索结果`);
                showToast(successToast);
            }
        }
    } else if (searchUrl) {
        // 只有网页版搜索URL
        window.open(searchUrl, '_blank');
        const successToast = createToast(`已在新标签页打开 ${appName} 搜索结果`);
        showToast(successToast);
    } else {
        const errorToast = createToast(`${appName} 暂不支持搜索功能`);
        showToast(errorToast);
    }
}

// 根据应用名称查找配置
function findAppConfigByName(appName) {
    if (typeof IconConfig === 'undefined') {
        console.error('IconConfig 未加载');
        return null;
    }
    
    // 遍历所有应用配置
    for (const [key, config] of Object.entries(IconConfig.apps)) {
        if (config.name === appName) {
            return config;
        }
    }
    
    return null;
}

// 模拟分类切换
function simulateCategorySwitch(categoryName) {
    console.log(`切换到分类: ${categoryName}`);
    
    // 模拟加载不同分类的应用
    const appGrid = document.querySelector('.app-grid');
    if (appGrid) {
        appGrid.classList.add('loading');
        setTimeout(() => {
            appGrid.classList.remove('loading');
        }, 500);
    }
}

// 模拟应用启动
function simulateAppLaunch(appName) {
    console.log(`启动应用: ${appName}`);
    
    const toast = createToast(`正在启动 ${appName}...`);
    showToast(toast);
    
    // 模拟跳转效果
    setTimeout(() => {
        const successToast = createToast(`${appName} 启动成功`);
        showToast(successToast);
    }, 1500);
}

// 模拟应用搜索
function simulateAppSearch(query) {
    console.log(`搜索应用: ${query}`);
    
    if (!query.trim()) {
        // 清空搜索时，移除所有高亮
        const appItems = document.querySelectorAll('.app-item');
        appItems.forEach(item => {
            item.classList.remove('search-highlight');
        });
        return;
    }
    
    // 高亮匹配的应用
    const appItems = document.querySelectorAll('.app-item');
    let hasMatches = false;
    
    appItems.forEach(item => {
        const appName = item.querySelector('.app-name').textContent.toLowerCase();
        if (appName.includes(query.toLowerCase())) {
            item.classList.add('search-highlight');
            hasMatches = true;
            
            // 为匹配的应用添加点击事件，支持搜索跳转
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                jumpToAppSearch(appName.trim(), query);
                item.removeEventListener('click', clickHandler);
            };
            
            // 移除之前的事件监听器，避免重复绑定
            item.removeEventListener('click', clickHandler);
            item.addEventListener('click', clickHandler);
        } else {
            item.classList.remove('search-highlight');
        }
    });
    
    // 显示搜索结果提示
    if (hasMatches) {
        const toast = createToast(`找到匹配应用，点击应用图标可直接搜索"${query}"`);
        showToast(toast);
    } else {
        const toast = createToast(`未找到匹配的应用`);
        showToast(toast);
    }
}

// 小组件功能
function initWidgetFeatures() {
    // 小组件标签页切换
    const widgetTabs = document.querySelectorAll('.widget-tab');
    widgetTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除其他标签的激活状态
            widgetTabs.forEach(t => t.classList.remove('active'));
            // 激活当前标签
            tab.classList.add('active');
            
            const tabText = tab.querySelector('.tab-text').textContent;
            simulateWidgetTabSwitch(tabText);
        });
    });
    
    // 搜索引擎项点击事件
    const engineItems = document.querySelectorAll('.search-engine-item');
    engineItems.forEach(item => {
        item.addEventListener('click', () => {
            toggleSearchEngine(item);
        });
    });
    
    // 搜索分类按钮
    const categoryBtns = document.querySelectorAll('.search-category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除其他按钮的激活状态
            categoryBtns.forEach(b => b.classList.remove('active'));
            // 激活当前按钮
            btn.classList.add('active');
            
            const categoryName = btn.textContent;
            simulateSearchCategorySwitch(categoryName);
        });
    });
    
    // 小组件动作按钮
    const actionBtns = document.querySelectorAll('.widget-action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            simulateWidgetAction(action);
        });
    });
}

// 模拟小组件标签切换
function simulateWidgetTabSwitch(tabName) {
    console.log(`切换到小组件标签: ${tabName}`);
    
    const toast = createToast(`切换到 ${tabName}`);
    showToast(toast);
}

// 切换搜索引擎选择状态
function toggleSearchEngine(engineItem) {
    const checkbox = engineItem.querySelector('.engine-checkbox');
    const engineName = engineItem.querySelector('.engine-name').textContent;
    
    if (engineItem.classList.contains('selected')) {
        // 取消选择
        engineItem.classList.remove('selected');
        checkbox.classList.remove('checked');
        checkbox.textContent = '○';
        console.log(`取消选择搜索引擎: ${engineName}`);
    } else {
        // 选择
        engineItem.classList.add('selected');
        checkbox.classList.add('checked');
        checkbox.textContent = '✓';
        console.log(`选择搜索引擎: ${engineName}`);
    }
    
    // 更新选择计数
    updateSelectedEngineCount();
}

// 更新选择的搜索引擎计数
function updateSelectedEngineCount() {
    const selectedEngines = document.querySelectorAll('.search-engine-item.selected');
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (statusIndicator) {
        statusIndicator.textContent = `✓ ${selectedEngines.length}`;
    }
}

// 模拟搜索分类切换
function simulateSearchCategorySwitch(categoryName) {
    console.log(`切换搜索分类: ${categoryName}`);
    
    // 模拟加载不同分类的搜索引擎
    const enginesGrid = document.querySelector('.search-engines-grid');
    if (enginesGrid) {
        enginesGrid.classList.add('loading');
        setTimeout(() => {
            enginesGrid.classList.remove('loading');
        }, 500);
    }
}

// 模拟小组件动作
function simulateWidgetAction(action) {
    console.log(`执行小组件动作: ${action}`);
    
    const toast = createToast(`正在${action}...`);
    showToast(toast);
}

// 创建提示消息
function createToast(message) {
    const toast = document.createElement('div');
    toast.className = 'phone-toast';
    toast.textContent = message;
    return toast;
}

// 显示提示消息
function showToast(toast) {
    const phoneScreen = document.querySelector('.phone-screen');
    if (phoneScreen) {
        phoneScreen.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }
}

// 注册全局函数
window.simulateAiConversation = simulateAiConversation;
window.simulateFeatureSelection = simulateFeatureSelection;
window.simulateAppLaunch = simulateAppLaunch;
window.toggleSearchEngine = toggleSearchEngine;