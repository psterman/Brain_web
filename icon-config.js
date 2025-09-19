// 图标配置系统 - 统一管理所有图标映射

const IconConfig = {
    // 应用图标配置
    apps: {
        // 购物类
        taobao: {
            name: '淘宝',
            className: 'taobao',
            category: 'shopping',
            color: '#ff6a00',
            gradient: 'linear-gradient(135deg, #ff6a00 0%, #ff4400 100%)',
            text: '淘',
            url: 'taobao://',
            webUrl: 'https://www.taobao.com'
        },
        tmall: {
            name: '天猫',
            className: 'tmall',
            category: 'shopping',
            color: '#ff0036',
            gradient: 'linear-gradient(135deg, #ff0036 0%, #d50027 100%)',
            text: '天',
            url: 'tmall://',
            webUrl: 'https://www.tmall.com'
        },
        pinduoduo: {
            name: '拼多多',
            className: 'pinduoduo',
            category: 'shopping',
            color: '#ff5722',
            gradient: 'linear-gradient(135deg, #ff5722 0%, #e91e63 100%)',
            text: '拼',
            url: 'pinduoduo://',
            webUrl: 'https://www.pinduoduo.com'
        },
        jd: {
            name: '京东',
            className: 'jd',
            category: 'shopping',
            color: '#e60012',
            gradient: 'linear-gradient(135deg, #e60012 0%, #c5000f 100%)',
            text: '京',
            url: 'openapp.jdmobile://',
            webUrl: 'https://www.jd.com'
        },
        xianyu: {
            name: '闲鱼',
            className: 'xianyu',
            category: 'shopping',
            color: '#ffb300',
            gradient: 'linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)',
            text: '闲',
            url: 'fleamarket://',
            webUrl: 'https://www.xianyu.com'
        },

        // 社交类
        zhihu: {
            name: '知乎',
            className: 'zhihu',
            category: 'social',
            color: '#0084ff',
            gradient: 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)',
            text: '知',
            url: 'zhihu://',
            webUrl: 'https://www.zhihu.com'
        },
        weibo: {
            name: '微博',
            className: 'weibo',
            category: 'social',
            color: '#e6162d',
            gradient: 'linear-gradient(135deg, #e6162d 0%, #c41230 100%)',
            text: '微',
            url: 'sinaweibo://',
            webUrl: 'https://weibo.com'
        },
        wechat: {
            name: '微信',
            className: 'wechat',
            category: 'social',
            color: '#07c160',
            gradient: 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)',
            text: '微',
            url: 'weixin://',
            webUrl: 'https://web.wechat.com'
        },

        // 音乐类
        qqMusic: {
            name: 'QQ音乐',
            className: 'qq-music',
            category: 'music',
            color: '#31c27c',
            gradient: 'linear-gradient(135deg, #31c27c 0%, #2ba471 100%)',
            text: 'QQ',
            url: 'qqmusic://',
            webUrl: 'https://y.qq.com'
        },
        neteaseMusic: {
            name: '网易云音乐',
            className: 'netease-music',
            category: 'music',
            color: '#d33a31',
            gradient: 'linear-gradient(135deg, #d33a31 0%, #b8312a 100%)',
            text: '网',
            url: 'orpheus://',
            webUrl: 'https://music.163.com'
        },
        kuwoMusic: {
            name: '酷我音乐',
            className: 'kuwo-music',
            category: 'music',
            color: '#ff6b35',
            gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            text: '酷',
            url: 'kuwo://',
            webUrl: 'https://www.kuwo.cn'
        },

        // 生活服务类
        meituan: {
            name: '美团',
            className: 'meituan',
            category: 'life',
            color: '#ffc107',
            gradient: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
            text: '美',
            url: 'imeituan://',
            webUrl: 'https://www.meituan.com'
        },
        eleme: {
            name: '饿了么',
            className: 'eleme',
            category: 'life',
            color: '#0078ff',
            gradient: 'linear-gradient(135deg, #0078ff 0%, #0066e0 100%)',
            text: '饿',
            url: 'eleme://',
            webUrl: 'https://www.ele.me'
        },
        dianping: {
            name: '大众点评',
            className: 'dianping',
            category: 'life',
            color: '#ffb300',
            gradient: 'linear-gradient(135deg, #ffb300 0%, #ff9800 100%)',
            text: '大',
            url: 'dianping://',
            webUrl: 'https://www.dianping.com'
        },

        // 视频类
        bilibili: {
            name: 'B站',
            className: 'bilibili',
            category: 'video',
            color: '#fb7299',
            gradient: 'linear-gradient(135deg, #fb7299 0%, #f25d8e 100%)',
            text: 'B',
            url: 'bilibili://',
            webUrl: 'https://www.bilibili.com'
        },
        douyin: {
            name: '抖音',
            className: 'douyin',
            category: 'video',
            color: '#000000',
            gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
            text: '抖',
            url: 'snssdk1128://',
            webUrl: 'https://www.douyin.com'
        },
        xiaohongshu: {
            name: '小红书',
            className: 'xiaohongshu',
            category: 'social',
            color: '#ff2442',
            gradient: 'linear-gradient(135deg, #ff2442 0%, #ff1744 100%)',
            text: '小',
            url: 'xhsdiscover://',
            webUrl: 'https://www.xiaohongshu.com'
        }
    },

    // 搜索引擎配置
    searchEngines: {
        baidu: {
            name: '百度',
            className: 'baidu',
            color: '#2932e1',
            gradient: 'linear-gradient(135deg, #2932e1 0%, #1e28cc 100%)',
            text: '百',
            url: 'https://www.baidu.com/s?wd=',
            icon: 'https://www.baidu.com/favicon.ico'
        },
        sogou: {
            name: '搜狗',
            className: 'sogou',
            color: '#fb6c2c',
            gradient: 'linear-gradient(135deg, #fb6c2c 0%, #e55a26 100%)',
            text: '搜',
            url: 'https://www.sogou.com/web?query=',
            icon: 'https://www.sogou.com/favicon.ico'
        },
        qihoo360: {
            name: '360搜索',
            className: 'qihoo360',
            color: '#4caf50',
            gradient: 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)',
            text: '360',
            url: 'https://www.so.com/s?q=',
            icon: 'https://www.so.com/favicon.ico'
        },
        shenma: {
            name: '神马搜索',
            className: 'shenma',
            color: '#9c27b0',
            gradient: 'linear-gradient(135deg, #9c27b0 0%, #8e24aa 100%)',
            text: '神',
            url: 'https://m.sm.cn/s?q=',
            icon: 'https://m.sm.cn/favicon.ico'
        },
        chinaso: {
            name: '中国搜索',
            className: 'chinaso',
            color: '#f44336',
            gradient: 'linear-gradient(135deg, #f44336 0%, #e53935 100%)',
            text: '中',
            url: 'https://www.chinaso.com/search/pagesearch.htm?q=',
            icon: 'https://www.chinaso.com/favicon.ico'
        },
        haosou: {
            name: '好搜',
            className: 'haosou',
            color: '#00bcd4',
            gradient: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)',
            text: '好',
            url: 'https://www.haosou.com/s?q=',
            icon: 'https://www.haosou.com/favicon.ico'
        },
        google: {
            name: 'Google',
            className: 'google',
            color: '#4285f4',
            gradient: 'linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc05 75%, #ea4335 100%)',
            text: 'G',
            url: 'https://www.google.com/search?q=',
            icon: 'https://www.google.com/favicon.ico'
        },
        bing: {
            name: 'Bing',
            className: 'bing',
            color: '#0078d4',
            gradient: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
            text: 'B',
            url: 'https://www.bing.com/search?q=',
            icon: 'https://www.bing.com/favicon.ico'
        }
    },

    // AI助手配置
    aiAssistants: {
        deepseek: {
            name: 'DeepSeek',
            className: 'deepseek-avatar',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: '🧠',
            description: '专业的AI编程助手',
            features: ['代码生成', '技术问答', '算法优化']
        },
        kimi: {
            name: 'Kimi',
            className: 'kimi-avatar',
            color: '#f093fb',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: '🤖',
            description: '智能对话助手',
            features: ['长文本处理', '文档分析', '创意写作']
        },
        zhipu: {
            name: '智谱清言',
            className: 'zhipu-avatar',
            color: '#4facfe',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: '💡',
            description: '中文AI助手',
            features: ['中文对话', '知识问答', '文本生成']
        },
        chatgpt: {
            name: 'ChatGPT',
            className: 'chatgpt-avatar',
            color: '#74b9ff',
            gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            icon: '🎯',
            description: 'OpenAI智能助手',
            features: ['通用对话', '创意写作', '问题解答']
        },
        doubao: {
            name: '豆包',
            className: 'doubao-avatar',
            color: '#fd79a8',
            gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
            icon: '🎈',
            description: '字节跳动AI助手',
            features: ['中文对话', '生活助手', '娱乐互动']
        }
    },

    // 分类配置
    categories: {
        shopping: {
            name: '购物',
            icon: '🛍',
            color: '#4caf50'
        },
        social: {
            name: '社交',
            icon: '💬',
            color: '#2196f3'
        },
        music: {
            name: '音乐',
            icon: '🎵',
            color: '#9c27b0'
        },
        video: {
            name: '视频',
            icon: '📺',
            color: '#ff5722'
        },
        life: {
            name: '生活',
            icon: '🏠',
            color: '#ff9800'
        },
        map: {
            name: '地图',
            icon: '🗺',
            color: '#607d8b'
        },
        browser: {
            name: '浏览器',
            icon: '🌐',
            color: '#795548'
        },
        finance: {
            name: '金融',
            icon: '💰',
            color: '#ffc107'
        },
        transport: {
            name: '出行',
            icon: '🚗',
            color: '#3f51b5'
        },
        job: {
            name: '招聘',
            icon: '💼',
            color: '#009688'
        },
        education: {
            name: '教育',
            icon: '📚',
            color: '#673ab7'
        },
        news: {
            name: '新闻',
            icon: '📰',
            color: '#e91e63'
        }
    },

    // 获取应用配置
    getApp(key) {
        return this.apps[key] || null;
    },

    // 获取搜索引擎配置
    getSearchEngine(key) {
        return this.searchEngines[key] || null;
    },

    // 获取AI助手配置
    getAIAssistant(key) {
        return this.aiAssistants[key] || null;
    },

    // 获取分类配置
    getCategory(key) {
        return this.categories[key] || null;
    },

    // 根据分类获取应用列表
    getAppsByCategory(category) {
        return Object.entries(this.apps)
            .filter(([key, app]) => app.category === category)
            .map(([key, app]) => ({ key, ...app }));
    },

    // 搜索应用
    searchApps(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.apps)
            .filter(([key, app]) => 
                app.name.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .map(([key, app]) => ({ key, ...app }));
    },

    // 生成图标HTML
    generateAppIconHTML(appKey, size = 'normal') {
        const app = this.getApp(appKey);
        if (!app) return '';

        const sizeClass = size === 'small' ? 'app-icon-small' : 'app-icon';
        return `<div class="${sizeClass} ${app.className}" title="${app.name}"></div>`;
    },

    // 生成搜索引擎图标HTML
    generateEngineIconHTML(engineKey, size = 'normal') {
        const engine = this.getSearchEngine(engineKey);
        if (!engine) return '';

        const sizeClass = size === 'small' ? 'engine-icon-small' : 'engine-icon';
        return `<div class="${sizeClass} ${engine.className}" title="${engine.name}"></div>`;
    },

    // 生成AI助手头像HTML
    generateAIAvatarHTML(aiKey, size = 'normal') {
        const ai = this.getAIAssistant(aiKey);
        if (!ai) return '';

        const sizeClass = size === 'small' ? 'ai-avatar-small' : 'ai-avatar';
        return `
            <div class="${sizeClass} ${ai.className}" title="${ai.name}">
                <div class="ai-brain-icon">${ai.icon}</div>
            </div>
        `;
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconConfig;
} else if (typeof window !== 'undefined') {
    window.IconConfig = IconConfig;
}