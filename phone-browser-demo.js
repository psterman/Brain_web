// 手机浏览器和App跳转功能演示
// 实现三个主要功能模块：
// 1. 浏览器模块 - 展示网页浏览和聚合搜索功能
// 2. App跳转模块 - 展示应用跳转功能
// 3. 小组件模块 - 展示桌面小组件功能

document.addEventListener('DOMContentLoaded', () => {
    console.log('初始化手机功能演示模块...');
    
    // 初始化各个功能模块
    initPhoneBrowserDemo();
    initPhoneAppJumpDemo();
    initPhoneWidgetsDemo();
    
    // 注册全局刷新函数，供tab切换时调用
    window.refreshBrowser = refreshBrowserContent;
    window.refreshAppJump = refreshAppJumpContent;
    window.refreshWidgets = refreshWidgetsContent;
});

// 初始化手机浏览器演示
function initPhoneBrowserDemo() {
    const browserContent = document.getElementById('browser-content');
    if (!browserContent) return;
    
    console.log('初始化手机浏览器演示...');
    
    // 浏览器URL输入框
    const urlBar = browserContent.querySelector('.phone-browser-url');
    if (!urlBar) return;
    
    // 浏览器刷新按钮
    const refreshButton = browserContent.querySelector('.phone-browser-action');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            simulateBrowserRefresh(urlBar);
        });
    }
    
    // 网站点击效果
    const sites = browserContent.querySelectorAll('.phone-browser-site');
    sites.forEach(site => {
        site.addEventListener('click', () => {
            simulateSiteClick(site, urlBar);
        });
    });
    
    // 自动演示
    setTimeout(() => {
        startBrowserDemo(sites, urlBar);
    }, 2000);
}

// 模拟浏览器刷新
function simulateBrowserRefresh(urlBar) {
    // 添加加载动画
    urlBar.classList.add('loading');
    
    // 模拟加载延迟
    setTimeout(() => {
        urlBar.classList.remove('loading');
    }, 800);
}

// 模拟网站点击
function simulateSiteClick(site, urlBar) {
    // 获取网站标题
    const siteTitle = site.querySelector('.phone-browser-site-title');
    if (!siteTitle) return;
    
    // 更新URL栏
    const siteName = siteTitle.textContent.split(' - ')[0];
    let newUrl = '';
    
    switch (siteName) {
        case 'B站':
            newUrl = 'https://www.bilibili.com/video/BV1234567890';
            break;
        case '知乎':
            newUrl = 'https://www.zhihu.com/question/12345678';
            break;
        case '小红书':
            newUrl = 'https://www.xiaohongshu.com/discovery/item/12345678';
            break;
        default:
            newUrl = 'https://www.example.com';
    }
    
    // 更新URL
    urlBar.textContent = newUrl;
    
    // 添加点击效果
    site.classList.add('clicked');
    setTimeout(() => {
        site.classList.remove('clicked');
    }, 300);
}

// 自动浏览器演示
function startBrowserDemo(sites, urlBar) {
    const demoSequence = [
        { index: 0, delay: 2000 }, // B站
        { index: 1, delay: 2000 }, // 知乎
        { index: 2, delay: 2000 }, // 小红书
        { index: 0, delay: 2000 }  // 回到B站
    ];
    
    let currentIndex = 0;
    
    function playNextSiteDemo() {
        if (currentIndex >= demoSequence.length) {
            currentIndex = 0; // 循环演示
        }
        
        const demo = demoSequence[currentIndex];
        const site = sites[demo.index];
        
        if (site) {
            simulateSiteClick(site, urlBar);
        }
        
        currentIndex++;
        setTimeout(playNextSiteDemo, demo.delay);
    }
    
    // 开始演示
    setTimeout(playNextSiteDemo, 1000);
}

// 初始化App跳转演示
function initPhoneAppJumpDemo() {
    const appJumpContent = document.getElementById('app-jump-content');
    if (!appJumpContent) return;
    
    console.log('初始化App跳转演示...');
    
    // App图标点击效果
    const appItems = appJumpContent.querySelectorAll('.phone-app-item');
    appItems.forEach(app => {
        app.addEventListener('click', () => {
            simulateAppLaunch(app);
        });
    });
    
    // 自动演示
    setTimeout(() => {
        startAppJumpDemo(appItems);
    }, 3000);
}

// 模拟App启动
function simulateAppLaunch(app) {
    // 添加启动动画
    app.classList.add('launching');
    
    // 获取App名称
    const appName = app.querySelector('.phone-app-name').textContent;
    console.log(`启动应用: ${appName}`);
    
    // 模拟启动延迟
    setTimeout(() => {
        app.classList.remove('launching');
        
        // 模拟跳转效果
        const phoneScreen = document.querySelector('.phone-screen');
        if (phoneScreen) {
            phoneScreen.classList.add('app-transition');
            setTimeout(() => {
                phoneScreen.classList.remove('app-transition');
                
                // 根据不同的App切换到不同的标签页
                switch (appName) {
                    case '哔哩哔哩':
                    case '知乎':
                    case '小红书':
                    case '抖音':
                    case '百度':
                        // 跳转到浏览器标签
                        switchPhoneTab('browser');
                        break;
                    case '微信':
                        // 跳转到AI聊天标签
                        switchPhoneTab('ai-chat');
                        break;
                    case '天气':
                        // 跳转到小组件标签
                        switchPhoneTab('widgets');
                        break;
                    default:
                        // 默认不跳转
                }
            }, 300);
        }
    }, 500);
}

// 自动App跳转演示
function startAppJumpDemo(appItems) {
    const demoSequence = [
        { index: 0, delay: 3000 }, // 哔哩哔哩
        { index: 1, delay: 3000 }, // 知乎
        { index: 5, delay: 3000 }, // 微信
        { index: 7, delay: 3000 }  // 天气
    ];
    
    let currentIndex = 0;
    
    function playNextAppDemo() {
        if (currentIndex >= demoSequence.length) {
            currentIndex = 0; // 循环演示
        }
        
        const demo = demoSequence[currentIndex];
        const app = appItems[demo.index];
        
        if (app) {
            simulateAppLaunch(app);
        }
        
        currentIndex++;
        setTimeout(playNextAppDemo, demo.delay);
    }
    
    // 开始演示
    setTimeout(playNextAppDemo, 2000);
}

// 初始化小组件演示
function initPhoneWidgetsDemo() {
    const widgetsContent = document.getElementById('widgets-content');
    if (!widgetsContent) return;
    
    console.log('初始化小组件演示...');
    
    // 小组件点击效果
    const widgets = widgetsContent.querySelectorAll('.phone-widget');
    widgets.forEach(widget => {
        widget.addEventListener('click', () => {
            simulateWidgetInteraction(widget);
        });
    });
    
    // 搜索小组件特殊处理
    const searchWidget = widgetsContent.querySelector('.phone-widget-search');
    if (searchWidget) {
        searchWidget.addEventListener('click', () => {
            // 点击搜索小组件时切换到浏览器标签
            switchPhoneTab('browser');
        });
    }
    
    // 自动演示
    setTimeout(() => {
        startWidgetsDemo(widgets);
    }, 4000);
}

// 模拟小组件交互
function simulateWidgetInteraction(widget) {
    // 添加交互动画
    widget.classList.add('interacting');
    
    // 模拟交互延迟
    setTimeout(() => {
        widget.classList.remove('interacting');
        
        // 根据小组件类型执行不同操作
        if (widget.classList.contains('phone-widget-ai')) {
            // AI小组件 - 切换到AI聊天标签
            switchPhoneTab('ai-chat');
        }
    }, 300);
}

// 自动小组件演示
function startWidgetsDemo(widgets) {
    const demoSequence = [
        { index: 0, delay: 3000 }, // AI小组件
        { index: 1, delay: 3000 }, // 天气小组件
        { index: 2, delay: 3000 }  // 新闻小组件
    ];
    
    let currentIndex = 0;
    
    function playNextWidgetDemo() {
        if (currentIndex >= demoSequence.length) {
            currentIndex = 0; // 循环演示
        }
        
        const demo = demoSequence[currentIndex];
        const widget = widgets[demo.index];
        
        if (widget) {
            simulateWidgetInteraction(widget);
        }
        
        currentIndex++;
        setTimeout(playNextWidgetDemo, demo.delay);
    }
    
    // 开始演示
    setTimeout(playNextWidgetDemo, 2000);
}

// 刷新浏览器内容
function refreshBrowserContent() {
    console.log('刷新浏览器内容...');
    
    const browserContent = document.getElementById('browser-content');
    if (!browserContent) return;
    
    // 获取URL栏
    const urlBar = browserContent.querySelector('.phone-browser-url');
    if (!urlBar) return;
    
    // 模拟刷新效果
    simulateBrowserRefresh(urlBar);
    
    // 更新URL显示
    const urls = [
        'https://www.bilibili.com/search?keyword=编程教程',
        'https://www.zhihu.com/search?q=AI助手对比',
        'https://www.xiaohongshu.com/search_result?keyword=浏览器推荐',
        'https://www.baidu.com/s?wd=小脑浏览器'
    ];
    
    // 随机选择一个URL
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    urlBar.textContent = randomUrl;
    
    // 添加内容刷新动画
    const browserSites = browserContent.querySelectorAll('.phone-browser-site');
    browserSites.forEach(site => {
        site.classList.add('content-refresh');
        setTimeout(() => {
            site.classList.remove('content-refresh');
        }, 500);
    });
}

// 刷新应用跳转内容
function refreshAppJumpContent() {
    console.log('刷新应用跳转内容...');
    
    const appJumpContent = document.getElementById('app-jump-content');
    if (!appJumpContent) return;
    
    // 添加刷新动画
    appJumpContent.classList.add('content-refresh');
    setTimeout(() => {
        appJumpContent.classList.remove('content-refresh');
    }, 500);
    
    // 随机高亮一个应用图标
    const appItems = appJumpContent.querySelectorAll('.phone-app-item');
    if (appItems.length) {
        const randomIndex = Math.floor(Math.random() * appItems.length);
        const randomApp = appItems[randomIndex];
        
        randomApp.classList.add('app-highlight');
        setTimeout(() => {
            randomApp.classList.remove('app-highlight');
        }, 1000);
    }
}

// 刷新小组件内容
function refreshWidgetsContent() {
    console.log('刷新小组件内容...');
    
    const widgetsContent = document.getElementById('widgets-content');
    if (!widgetsContent) return;
    
    // 添加刷新动画
    widgetsContent.classList.add('content-refresh');
    setTimeout(() => {
        widgetsContent.classList.remove('content-refresh');
    }, 500);
    
    // 更新天气小组件
    const weatherTemp = widgetsContent.querySelector('.phone-widget-temp');
    if (weatherTemp) {
        const temps = ['24°', '25°', '26°', '27°', '28°'];
        const randomTemp = temps[Math.floor(Math.random() * temps.length)];
        weatherTemp.textContent = randomTemp;
    }
    
    // 更新新闻小组件
    const newsItems = widgetsContent.querySelectorAll('.phone-widget-news-text');
    const newsTexts = [
        '人工智能新突破：大模型理解能力再提升',
        '全球科技公司发布最新移动设备',
        '程序员必备：提高编程效率的十大工具',
        '小脑浏览器：一款颠覆传统的智能浏览器',
        '聚合搜索成为新趋势：一次搜索全网内容',
        'AI助手对比：哪款最适合日常使用？',
        '手机浏览器大战：谁能胜出？'
    ];
    
    // 随机更新新闻内容
    newsItems.forEach(item => {
        const randomNews = newsTexts[Math.floor(Math.random() * newsTexts.length)];
        item.textContent = randomNews;
    });
}
