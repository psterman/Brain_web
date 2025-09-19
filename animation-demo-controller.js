// 动画演示控制器
class AnimationDemoController {
    constructor() {
        this.currentTab = null;
        this.currentSceneIndex = 0;
        this.isPlaying = false;
        this.animationTimer = null;
        this.sceneTimer = null;
        this.container = null;
        
        this.init();
    }
    
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // 创建动画容器
        this.createAnimationContainer();
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化默认动画（AI聊天）
        setTimeout(() => {
            this.handleTabChange('ai-chat');
        }, 1000);
        
        console.log('动画演示控制器初始化完成');
    }
    
    createAnimationContainer() {
        // 查找feature-view-card容器
        const featureCard = document.querySelector('.feature-view-card');
        if (!featureCard) {
            console.warn('未找到feature-view-card容器');
            return;
        }
        
        // 创建动画演示容器
        this.container = document.createElement('div');
        this.container.className = 'animation-demo-container';
        this.container.innerHTML = `
            <div class="animation-controls">
                <button class="animation-control-btn play-pause-btn" title="播放/暂停">
                    <span class="play-icon">▶️</span>
                    <span class="pause-icon" style="display: none;">⏸️</span>
                </button>
                <button class="animation-control-btn restart-btn" title="重新开始">🔄</button>
            </div>
            <div class="animation-scenes"></div>
        `;
        
        // 插入到highlights之前
        const highlights = featureCard.querySelector('.feature-view-highlights');
        if (highlights) {
            featureCard.insertBefore(this.container, highlights);
        } else {
            featureCard.appendChild(this.container);
        }
        
        // 绑定控制按钮事件
        this.bindControlEvents();
    }
    
    bindControlEvents() {
        const playPauseBtn = this.container.querySelector('.play-pause-btn');
        const restartBtn = this.container.querySelector('.restart-btn');
        
        playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        restartBtn?.addEventListener('click', () => this.restart());
    }
    
    bindEvents() {
        // 监听tab切换事件
        document.addEventListener('tabChanged', (event) => {
            this.handleTabChange(event.detail.tabId);
        });
        
        // 监听窗口可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else if (this.currentTab) {
                this.play();
            }
        });
    }
    
    handleTabChange(tabId) {
        this.currentTab = tabId;
        this.currentSceneIndex = 0;
        
        // 停止当前动画
        this.stop();
        
        // 确保容器存在
        if (!this.container) {
            this.createAnimationContainer();
        }
        
        // 加载新的动画数据
        this.loadAnimationData(tabId);
        
        // 开始播放
        setTimeout(() => this.play(), 800);
    }
    
    loadAnimationData(tabId) {
        if (!window.animationDemoData || !window.animationDemoData[tabId]) {
            console.warn(`未找到${tabId}的动画数据`);
            return;
        }
        
        const data = window.animationDemoData[tabId];
        this.createScenes(data.scenes);
    }
    
    createScenes(scenes) {
        const scenesContainer = this.container.querySelector('.animation-scenes');
        if (!scenesContainer) return;
        
        // 清空现有场景
        scenesContainer.innerHTML = '';
        
        // 创建场景
        scenes.forEach((scene, index) => {
            const sceneElement = this.createSceneElement(scene, index);
            scenesContainer.appendChild(sceneElement);
        });
    }
    
    createSceneElement(scene, index) {
        const sceneDiv = document.createElement('div');
        sceneDiv.className = 'animation-scene';
        sceneDiv.dataset.sceneId = scene.id;
        sceneDiv.dataset.sceneIndex = index;
        
        // 创建场景元素
        scene.elements.forEach((element, elementIndex) => {
            const elementDiv = this.createAnimationElement(element, elementIndex);
            sceneDiv.appendChild(elementDiv);
        });
        
        return sceneDiv;
    }
    
    createAnimationElement(element, index) {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'animation-element';
        elementDiv.dataset.elementIndex = index;
        elementDiv.dataset.action = element.action;
        elementDiv.dataset.delay = element.delay;
        
        elementDiv.innerHTML = `
            <div class="animation-element-icon">${element.icon}</div>
            <div class="animation-element-content">${element.content}</div>
        `;
        
        return elementDiv;
    }
    
    play() {
        if (this.isPlaying || !this.currentTab) return;
        
        this.isPlaying = true;
        this.updatePlayPauseButton();
        
        // 开始播放当前场景
        this.playCurrentScene();
    }
    
    pause() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
        
        // 清除定时器
        if (this.animationTimer) {
            clearTimeout(this.animationTimer);
            this.animationTimer = null;
        }
        if (this.sceneTimer) {
            clearTimeout(this.sceneTimer);
            this.sceneTimer = null;
        }
    }
    
    stop() {
        this.pause();
        this.currentSceneIndex = 0;
        
        // 重置所有场景
        const scenes = this.container.querySelectorAll('.animation-scene');
        scenes.forEach(scene => {
            scene.classList.remove('active');
            const elements = scene.querySelectorAll('.animation-element');
            elements.forEach(element => {
                element.classList.remove('animate-in');
                this.removeAnimationClasses(element);
            });
        });
    }
    
    restart() {
        this.stop();
        setTimeout(() => this.play(), 100);
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    updatePlayPauseButton() {
        const playIcon = this.container.querySelector('.play-icon');
        const pauseIcon = this.container.querySelector('.pause-icon');
        
        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }
    
    playCurrentScene() {
        if (!this.isPlaying) return;
        
        const scenes = this.container.querySelectorAll('.animation-scene');
        const currentScene = scenes[this.currentSceneIndex];
        
        if (!currentScene) {
            // 所有场景播放完毕，循环播放
            this.currentSceneIndex = 0;
            this.sceneTimer = setTimeout(() => this.playCurrentScene(), 2000);
            return;
        }
        
        // 隐藏其他场景，显示当前场景
        scenes.forEach(scene => scene.classList.remove('active'));
        currentScene.classList.add('active');
        
        // 播放场景中的元素动画
        this.playSceneElements(currentScene);
        
        // 获取场景持续时间
        const sceneDuration = this.getSceneDuration(currentScene);
        
        // 场景播放完毕后切换到下一个场景
        this.sceneTimer = setTimeout(() => {
            this.currentSceneIndex++;
            this.playCurrentScene();
        }, sceneDuration + 1000); // 额外1秒间隔
    }
    
    playSceneElements(scene) {
        const elements = scene.querySelectorAll('.animation-element');
        
        elements.forEach((element, index) => {
            const delay = parseInt(element.dataset.delay) || 0;
            const action = element.dataset.action;
            
            this.animationTimer = setTimeout(() => {
                if (!this.isPlaying) return;
                
                // 添加基础动画类
                element.classList.add('animate-in');
                
                // 添加特殊动画效果
                this.applyAnimationEffect(element, action);
                
            }, delay);
        });
    }
    
    applyAnimationEffect(element, action) {
        // 移除之前的动画类
        this.removeAnimationClasses(element);
        
        // 根据动画类型添加对应的类
        switch (action) {
            case 'type-animation':
                this.applyTypewriterEffect(element);
                break;
            case 'thinking-dots':
                element.classList.add('thinking-dots');
                break;
            case 'typing-effect':
                this.applyTypingEffect(element);
                break;
            case 'slide-replace':
                element.classList.add('slide-in-effect');
                break;
            case 'bounce-in':
                element.classList.add('bounce-in-effect');
                break;
            case 'grid-appear':
                element.classList.add('grid-appear');
                break;
            case 'pulse':
                element.classList.add('pulse-effect');
                break;
            case 'scan-effect':
                element.classList.add('scan-effect');
                break;
            case 'highlight-selection':
                element.classList.add('highlight-selection');
                break;
            case 'parallel-lines':
                element.classList.add('parallel-lines');
                break;
            case 'data-visualization':
                element.classList.add('data-visualization');
                break;
            case 'launch-effect':
                element.classList.add('launch-effect');
                break;
            default:
                // 默认淡入效果
                break;
        }
    }
    
    applyTypewriterEffect(element) {
        const content = element.querySelector('.animation-element-content');
        if (!content) return;
        
        const text = content.textContent;
        content.textContent = '';
        content.classList.add('typewriter-effect');
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length && this.isPlaying) {
                content.textContent += text[index];
                index++;
            } else {
                clearInterval(typeInterval);
                content.classList.remove('typewriter-effect');
            }
        }, 50);
    }
    
    applyTypingEffect(element) {
        const content = element.querySelector('.animation-element-content');
        if (!content) return;
        
        content.style.borderRight = '2px solid var(--primary-color)';
        content.style.animation = 'blink-cursor 1s infinite';
        
        setTimeout(() => {
            content.style.borderRight = '';
            content.style.animation = '';
        }, 2000);
    }
    
    removeAnimationClasses(element) {
        const animationClasses = [
            'typewriter-effect', 'thinking-dots', 'slide-in-effect',
            'bounce-in-effect', 'grid-appear', 'pulse-effect',
            'scan-effect', 'highlight-selection', 'parallel-lines',
            'data-visualization', 'launch-effect'
        ];
        
        animationClasses.forEach(className => {
            element.classList.remove(className);
        });
    }
    
    getSceneDuration(scene) {
        const elements = scene.querySelectorAll('.animation-element');
        let maxDuration = 0;
        
        elements.forEach(element => {
            const delay = parseInt(element.dataset.delay) || 0;
            const duration = 1000; // 基础动画持续时间
            const totalTime = delay + duration;
            
            if (totalTime > maxDuration) {
                maxDuration = totalTime;
            }
        });
        
        return Math.max(maxDuration, 3000); // 最少3秒
    }
    
    // 销毁方法
    destroy() {
        this.stop();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        // 移除事件监听
        document.removeEventListener('tabChanged', this.handleTabChange);
        document.removeEventListener('visibilitychange', this.pause);
    }
}

// 全局实例
let animationDemoController = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保动画数据已加载
    if (window.animationDemoData) {
        animationDemoController = new AnimationDemoController();
    } else {
        // 等待动画数据加载
        const checkData = setInterval(() => {
            if (window.animationDemoData) {
                clearInterval(checkData);
                animationDemoController = new AnimationDemoController();
            }
        }, 100);
        
        // 10秒后停止检查
        setTimeout(() => clearInterval(checkData), 10000);
    }
});

// 导出控制器
if (typeof window !== 'undefined') {
    window.AnimationDemoController = AnimationDemoController;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationDemoController;
}