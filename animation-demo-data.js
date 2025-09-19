// 动画演示数据配置
const animationDemoData = {
    'widgets': {
        title: '小组件配置演示',
        scenes: [
            {
                id: 'search-engine-switch',
                title: '搜索引擎切换',
                duration: 3000,
                elements: [
                    {
                        type: 'search-bar',
                        content: '百度搜索',
                        icon: '🔍',
                        action: 'fade-in',
                        delay: 0
                    },
                    {
                        type: 'switch-animation',
                        content: '→ Google',
                        icon: '🌐',
                        action: 'slide-replace',
                        delay: 1000
                    },
                    {
                        type: 'config-panel',
                        content: '配置已保存',
                        icon: '✅',
                        action: 'bounce-in',
                        delay: 2000
                    }
                ]
            },
            {
                id: 'widget-config',
                title: '小组件配置',
                duration: 4000,
                elements: [
                    {
                        type: 'widget-grid',
                        content: '选择小组件',
                        icon: '📱',
                        action: 'grid-appear',
                        delay: 0
                    },
                    {
                        type: 'drag-drop',
                        content: '拖拽排序',
                        icon: '↕️',
                        action: 'drag-demo',
                        delay: 1500
                    },
                    {
                        type: 'sync-indicator',
                        content: '实时同步',
                        icon: '🔄',
                        action: 'pulse',
                        delay: 3000
                    }
                ]
            }
        ]
    },
    'ai-chat': {
        title: 'AI智能助手演示',
        scenes: [
            {
                id: 'multi-ai-chat',
                title: '多AI对话',
                duration: 5000,
                elements: [
                    {
                        type: 'user-input',
                        content: '如何学习编程？',
                        icon: '👤',
                        action: 'type-animation',
                        delay: 0
                    },
                    {
                        type: 'ai-thinking',
                        content: 'DeepSeek思考中...',
                        icon: '🧠',
                        action: 'thinking-dots',
                        delay: 1000
                    },
                    {
                        type: 'ai-response',
                        content: 'Kimi回复中...',
                        icon: '🤖',
                        action: 'typing-effect',
                        delay: 2500
                    },
                    {
                        type: 'multi-response',
                        content: '智谱清言加入...',
                        icon: '💬',
                        action: 'slide-in',
                        delay: 4000
                    }
                ]
            },
            {
                id: 'smart-distribution',
                title: '智能问题分发',
                duration: 3500,
                elements: [
                    {
                        type: 'question-analysis',
                        content: '分析问题类型',
                        icon: '🔍',
                        action: 'scan-effect',
                        delay: 0
                    },
                    {
                        type: 'ai-selection',
                        content: '选择最佳AI',
                        icon: '🎯',
                        action: 'highlight-selection',
                        delay: 1500
                    },
                    {
                        type: 'parallel-processing',
                        content: '并行处理',
                        icon: '⚡',
                        action: 'parallel-lines',
                        delay: 2500
                    }
                ]
            }
        ]
    },
    'browser': {
        title: '智能浏览器演示',
        scenes: [
            {
                id: 'smart-search',
                title: '智能搜索',
                duration: 4000,
                elements: [
                    {
                        type: 'search-input',
                        content: '输入搜索关键词',
                        icon: '🔍',
                        action: 'type-animation',
                        delay: 0
                    },
                    {
                        type: 'ai-suggestions',
                        content: 'AI智能建议',
                        icon: '💡',
                        action: 'suggestion-popup',
                        delay: 1500
                    },
                    {
                        type: 'search-results',
                        content: '个性化结果',
                        icon: '📊',
                        action: 'results-cascade',
                        delay: 2500
                    },
                    {
                        type: 'ai-summary',
                        content: 'AI内容摘要',
                        icon: '📝',
                        action: 'summary-unfold',
                        delay: 3500
                    }
                ]
            },
            {
                id: 'identity-switch',
                title: '身份角色切换',
                duration: 3000,
                elements: [
                    {
                        type: 'role-selector',
                        content: '选择身份角色',
                        icon: '👤',
                        action: 'role-carousel',
                        delay: 0
                    },
                    {
                        type: 'style-change',
                        content: '回复风格调整',
                        icon: '🎨',
                        action: 'style-morph',
                        delay: 1500
                    },
                    {
                        type: 'personalized-response',
                        content: '个性化回复',
                        icon: '💬',
                        action: 'response-style',
                        delay: 2500
                    }
                ]
            }
        ]
    },
    'app-jump': {
        title: '应用搜索演示',
        scenes: [
            {
                id: 'app-search',
                title: '应用搜索',
                duration: 4500,
                elements: [
                    {
                        type: 'search-bar',
                        content: '搜索应用',
                        icon: '🔍',
                        action: 'search-focus',
                        delay: 0
                    },
                    {
                        type: 'category-filter',
                        content: '分类筛选',
                        icon: '📂',
                        action: 'filter-animation',
                        delay: 1000
                    },
                    {
                        type: 'app-grid',
                        content: '应用展示',
                        icon: '📱',
                        action: 'grid-populate',
                        delay: 2000
                    },
                    {
                        type: 'quick-launch',
                        content: '快速启动',
                        icon: '🚀',
                        action: 'launch-effect',
                        delay: 3500
                    }
                ]
            },
            {
                id: 'smart-recommendation',
                title: '智能推荐',
                duration: 3500,
                elements: [
                    {
                        type: 'usage-analysis',
                        content: '使用习惯分析',
                        icon: '📊',
                        action: 'data-visualization',
                        delay: 0
                    },
                    {
                        type: 'recommendation-engine',
                        content: '推荐算法',
                        icon: '🧠',
                        action: 'algorithm-visual',
                        delay: 1500
                    },
                    {
                        type: 'personalized-apps',
                        content: '个性化推荐',
                        icon: '⭐',
                        action: 'recommendation-appear',
                        delay: 2500
                    }
                ]
            }
        ]
    }
};

// 动画配置
const animationConfig = {
    // 基础动画时长
    baseDuration: 300,
    // 动画缓动函数
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // 循环播放间隔
    loopInterval: 8000,
    // 是否自动播放
    autoPlay: true,
    // 动画效果定义
    effects: {
        'fade-in': {
            from: { opacity: 0 },
            to: { opacity: 1 },
            duration: 500
        },
        'slide-replace': {
            from: { transform: 'translateX(100%)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 },
            duration: 600
        },
        'bounce-in': {
            from: { transform: 'scale(0)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 },
            duration: 400,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        },
        'type-animation': {
            duration: 1000,
            effect: 'typewriter'
        },
        'thinking-dots': {
            duration: 1500,
            effect: 'dots-pulse'
        },
        'typing-effect': {
            duration: 800,
            effect: 'typing-cursor'
        },
        'grid-appear': {
            from: { transform: 'scale(0.8)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 },
            duration: 600,
            stagger: 100
        },
        'pulse': {
            duration: 1000,
            effect: 'continuous-pulse'
        }
    }
};

// 导出数据
if (typeof window !== 'undefined') {
    window.animationDemoData = animationDemoData;
    window.animationConfig = animationConfig;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { animationDemoData, animationConfig };
}