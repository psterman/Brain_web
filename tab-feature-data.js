// Tab功能说明数据
const tabFeatureData = {
    'ai-chat': {
        title: 'AI智能助手',
        category: '人工智能',
        description: '与多个AI助手同时对话，获得更全面的答案和建议',
        features: [
            '多AI助手并行对话',
            '智能问题分发',
            '实时状态监控',
            '个性化配置管理'
        ],
        highlights: [
            { icon: '🧠', text: '支持DeepSeek、Kimi、智谱清言等主流AI' },
            { icon: '💬', text: '一次提问，多个AI同时回答' },
            { icon: '⚙️', text: '灵活的助手配置和管理' }
        ]
    },
    'browser': {
        title: '智能浏览器',
        category: '网页浏览',
        description: '集成AI功能的智能浏览器，提供个性化的浏览体验',
        features: [
            '智能搜索建议',
            'AI助手集成',
            '个性化身份选择',
            '多样化回复风格'
        ],
        highlights: [
            { icon: '🔍', text: '智能搜索，快速找到所需信息' },
            { icon: '👤', text: '多种身份角色，适应不同场景' },
            { icon: '💬', text: '个性化回复样式和文风选择' }
        ]
    },
    'app-jump': {
        title: '应用搜索',
        category: '应用管理',
        description: '快速搜索和访问各类应用，支持分类浏览和智能推荐',
        features: [
            '应用分类管理',
            '智能搜索功能',
            '快速应用跳转',
            '个性化推荐'
        ],
        highlights: [
            { icon: '🛍', text: '涵盖购物、社交、视频等多个分类' },
            { icon: '🔍', text: '快速搜索，精准定位目标应用' },
            { icon: '⭐', text: '自定义收藏，个性化应用管理' }
        ]
    },
    'widgets': {
        title: '小组件配置',
        category: '系统设置',
        description: '自定义配置各种小组件，包括搜索引擎、应用选择和AI助手',
        features: [
            '搜索引擎配置',
            '应用选择管理',
            'AI助手设置',
            '实时同步功能'
        ],
        highlights: [
            { icon: '🔍', text: '多种搜索引擎，满足不同需求' },
            { icon: '🔗', text: '灵活的应用选择和管理' },
            { icon: '🧠', text: 'AI助手个性化配置' }
        ]
    }
};

// 导出数据供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = tabFeatureData;
}