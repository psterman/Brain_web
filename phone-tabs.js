// 手机标签页切换功能
// 实现四个主要tab的功能：
// 1. AI聊天模块 - 展示与多个AI助手的对话
// 2. 浏览器模块 - 展示网页浏览功能
// 3. App跳转搜索模块 - 展示应用跳转功能
// 4. 小组件模块 - 展示桌面小组件功能

document.addEventListener('DOMContentLoaded', () => {
    console.log('初始化手机标签页系统...');
    initPhoneTabs();
    
    // 确保全局可访问switchPhoneTab函数，便于其他模块调用
    window.switchPhoneTab = switchPhoneTab;
});

function initPhoneTabs() {
    const phoneTabs = document.querySelectorAll('.phone-tab');
    
    if (!phoneTabs.length) {
        console.warn('手机标签页元素未找到');
        return;
    }
    
    console.log('初始化手机标签页功能...');
    
    // 为每个标签页添加点击事件
    phoneTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchPhoneTab(tabId);
        });
    });
    
    // 初始化时显示第一个标签页
    const firstTabId = phoneTabs[0].getAttribute('data-tab');
    switchPhoneTab(firstTabId);
}

// 切换标签页
function switchPhoneTab(tabId) {
    console.log(`切换到标签页: ${tabId}`);
    
    // 验证tabId是否有效
    const validTabs = ['ai-chat', 'browser', 'app-jump', 'widgets'];
    if (!validTabs.includes(tabId)) {
        console.error(`无效的标签页ID: ${tabId}`);
        return;
    }
    
    // 更新标签页状态
    const tabs = document.querySelectorAll('.phone-tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // 更新内容区域
    const contents = document.querySelectorAll('.phone-screen-content');
    contents.forEach(content => {
        if (content.id === `${tabId}-content`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // 更新手机底部导航栏的状态
    updatePhoneBottomNav(tabId);
    
    // 触发特定标签页的初始化或刷新
    switch (tabId) {
        case 'ai-chat':
            console.log('激活AI聊天模块');
            // 如果存在AI聊天初始化函数，则调用
            if (typeof refreshAiChat === 'function') {
                refreshAiChat();
            }
            break;
        case 'browser':
            console.log('激活浏览器模块');
            // 如果存在浏览器初始化函数，则调用
            if (typeof refreshBrowser === 'function') {
                refreshBrowser();
            }
            break;
        case 'app-jump':
            console.log('激活应用跳转模块');
            // 如果存在应用跳转初始化函数，则调用
            if (typeof refreshAppJump === 'function') {
                refreshAppJump();
            }
            break;
        case 'widgets':
            console.log('激活小组件模块');
            // 如果存在小组件初始化函数，则调用
            if (typeof refreshWidgets === 'function') {
                refreshWidgets();
            }
            break;
    }
}

// 更新底部导航栏状态
function updatePhoneBottomNav(tabId) {
    const navItems = document.querySelectorAll('.phone-nav-item');
    
    // 根据当前标签页设置对应的底部导航项为激活状态
    switch (tabId) {
        case 'ai-chat':
            // AI聊天对应底部导航的AI图标
            setActiveNavItem(navItems, 2); // AI图标（第3个项目，索引为2）
            break;
        case 'browser':
            // 浏览器对应底部导航的搜索图标
            setActiveNavItem(navItems, 1); // 搜索图标（第2个项目，索引为1）
            break;
        case 'app-jump':
            // 应用跳转对应底部导航的首页图标
            setActiveNavItem(navItems, 0); // 首页图标（第1个项目，索引为0）
            break;
        case 'widgets':
            // 小组件也对应底部导航的首页图标
            setActiveNavItem(navItems, 0); // 首页图标（第1个项目，索引为0）
            break;
        default:
            // 默认激活首页图标
            setActiveNavItem(navItems, 0);
    }
    
    // 更新底部导航图标的提示文本
    updateNavItemTooltips(tabId);
}

// 更新底部导航图标的提示文本
function updateNavItemTooltips(activeTabId) {
    const homeNavText = document.querySelector('.phone-nav-item:nth-child(1) div:last-child');
    const searchNavText = document.querySelector('.phone-nav-item:nth-child(2) div:last-child');
    const aiNavText = document.querySelector('.phone-nav-item:nth-child(3) div:last-child');
    const browseNavText = document.querySelector('.phone-nav-item:nth-child(4) div:last-child');
    
    // 根据当前激活的标签页更新提示文本
    if (activeTabId === 'app-jump') {
        if (homeNavText) homeNavText.textContent = '应用';
    } else if (activeTabId === 'widgets') {
        if (homeNavText) homeNavText.textContent = '小组件';
    } else {
        if (homeNavText) homeNavText.textContent = '首页';
    }
    
    if (activeTabId === 'browser') {
        if (searchNavText) searchNavText.textContent = '浏览中';
        if (browseNavText) browseNavText.textContent = '浏览中';
    } else {
        if (searchNavText) searchNavText.textContent = '搜索';
        if (browseNavText) browseNavText.textContent = '浏览';
    }
    
    if (activeTabId === 'ai-chat') {
        if (aiNavText) aiNavText.textContent = '聊天中';
    } else {
        if (aiNavText) aiNavText.textContent = 'AI';
    }
}

// 设置激活的底部导航项
function setActiveNavItem(navItems, activeIndex) {
    navItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 添加底部导航栏点击事件
function initBottomNav() {
    const navItems = document.querySelectorAll('.phone-nav-item');
    
    if (!navItems.length) {
        console.warn('底部导航栏元素未找到');
        return;
    }
    
    console.log('初始化底部导航栏功能...');
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 添加点击反馈效果
            addClickEffect(item);
            
            // 根据点击的导航项切换到对应的标签页
            switch (index) {
                case 0: // 首页/小组件
                    // 如果当前已经在小组件页面，则切换到应用跳转页面
                    const currentActiveTab = document.querySelector('.phone-tab.active');
                    if (currentActiveTab && currentActiveTab.getAttribute('data-tab') === 'widgets') {
                        switchPhoneTab('app-jump');
                    } else {
                        switchPhoneTab('widgets');
                    }
                    break;
                case 1: // 搜索/浏览器
                    switchPhoneTab('browser');
                    break;
                case 2: // AI聊天
                    switchPhoneTab('ai-chat');
                    break;
                case 3: // 浏览
                    switchPhoneTab('browser');
                    break;
            }
        });
    });
}

// 添加点击反馈效果
function addClickEffect(element) {
    element.classList.add('clicked');
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 300);
}



// 自动演示功能
function startPhoneDemo() {
    console.log('开始手机功能演示...');
    
    // 初始化底部导航栏点击事件
    initBottomNav();
    
    // 定义标签页切换顺序和时间间隔
    const demoSequence = [
        // 从AI聊天开始
        { 
            tab: 'ai-chat', 
            delay: 6000,
            description: '展示AI聊天功能 - 多平台AI助手同时回答问题'
        },
        // 切换到浏览器
        { 
            tab: 'browser', 
            delay: 5000,
            description: '展示浏览器功能 - 聚合搜索多平台内容'
        },
        // 切换到应用跳转
        { 
            tab: 'app-jump', 
            delay: 4000,
            description: '展示应用跳转功能 - 快速启动常用应用'
        },
        // 切换到小组件
        { 
            tab: 'widgets', 
            delay: 5000,
            description: '展示小组件功能 - 桌面信息一目了然'
        },
        // 回到AI聊天，完成循环
        { 
            tab: 'ai-chat', 
            delay: 6000,
            description: '回到AI聊天 - 展示完整功能循环'
        }
    ];
    
    // 执行演示序列
    let currentIndex = 0;
    
    function playNextDemo() {
        if (currentIndex >= demoSequence.length) {
            currentIndex = 0; // 循环演示
        }
        
        const demo = demoSequence[currentIndex];
        console.log(`演示: ${demo.description}`);
        
        // 切换标签页
        switchPhoneTab(demo.tab);
        
        // 添加标签页切换动画效果
        addTabSwitchAnimation(demo.tab);
        
        currentIndex++;
        setTimeout(playNextDemo, demo.delay);
    }
    
    // 开始演示
    setTimeout(playNextDemo, 2000);
}

// 添加标签页切换动画效果
function addTabSwitchAnimation(tabId) {
    // 找到对应的标签页
    const tab = document.querySelector(`.phone-tab[data-tab="${tabId}"]`);
    if (!tab) return;
    
    // 添加高亮动画
    tab.classList.add('tab-highlight');
    setTimeout(() => {
        tab.classList.remove('tab-highlight');
    }, 1000);
    
    // 添加内容区域动画
    const content = document.getElementById(`${tabId}-content`);
    if (!content) return;
    
    content.classList.add('content-highlight');
    setTimeout(() => {
        content.classList.remove('content-highlight');
    }, 1000);
}

// 页面加载完成后启动演示
document.addEventListener('DOMContentLoaded', () => {
    // 初始化标签页
    initPhoneTabs();
    
    // 初始化底部导航栏
    initBottomNav();
    
    // 启动自动演示
    setTimeout(startPhoneDemo, 3000);
});