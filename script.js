// 主题切换功能
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = document.querySelector('.theme-icon');

// 检查本地存储的主题设置
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// 主题切换事件
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// 更新主题图标
function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// 设备切换功能
const deviceToggle = document.getElementById('deviceToggle');
const deviceIcon = document.querySelector('.device-icon');

// 检查当前设备类型
function getCurrentDevice() {
    return window.location.pathname.includes('mobile-index.html') ? 'mobile' : 'desktop';
}

// 更新设备图标
function updateDeviceIcon(device) {
    if (device === 'mobile') {
        deviceIcon.textContent = '💻';
        deviceToggle.title = '切换到PC端';
    } else {
        deviceIcon.textContent = '📱';
        deviceToggle.title = '切换到移动端';
    }
}

// 设备切换事件
if (deviceToggle) {
    deviceToggle.addEventListener('click', () => {
        const currentDevice = getCurrentDevice();
        
        // 添加点击动画
        deviceToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            deviceToggle.style.transform = '';
        }, 150);
        
        // 切换设备
        if (currentDevice === 'desktop') {
            // 切换到移动端
            window.location.href = 'mobile-index.html';
        } else {
            // 切换到PC端
            window.location.href = 'index.html';
        }
    });
    
    // 初始化设备图标
    updateDeviceIcon(getCurrentDevice());
}

// FAQ 折叠功能
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    // 确保question元素存在
    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 关闭所有其他FAQ项
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前FAQ项
            item.classList.toggle('active', !isActive);
        });
    }
});

// 平滑滚动导航
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // 考虑导航栏高度
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 导航栏滚动效果
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // 向下滚动，隐藏导航栏
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // 向上滚动，显示导航栏
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察需要动画的元素
const animatedElements = document.querySelectorAll('.feature-card, .step, .faq-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// 手机模型交互效果
const phoneMockup = document.querySelector('.phone-mockup');

if (phoneMockup) {
    phoneMockup.addEventListener('mouseenter', () => {
        phoneMockup.style.transform = 'scale(1.05) rotateY(5deg)';
    });
    
    phoneMockup.addEventListener('mouseleave', () => {
        phoneMockup.style.transform = 'scale(1) rotateY(0deg)';
    });
}

// 按钮点击效果
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // 创建涟漪效果
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// 添加涟漪效果样式
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 初始化主题
    if (!localStorage.getItem('theme')) {
        // 检测系统主题偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }
});

// 监听系统主题变化
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

// 星辰神经动画系统 - 完整科技版
function createBrainStarSystem() {
    console.log('==========================================');
    console.log('🧠 初始化完整星辰神经动画系统...');
    
    const neuralBg = document.querySelector('.neural-bg');
    
    if (!neuralBg) {
        console.error('❌ 找不到 .neural-bg 元素');
        return;
    }
    
    console.log('✅ 找到neural-bg元素！');
    console.log('   - 尺寸:', neuralBg.offsetWidth, 'x', neuralBg.offsetHeight);
    console.log('   - z-index:', getComputedStyle(neuralBg).zIndex);
    console.log('   - position:', getComputedStyle(neuralBg).position);
    console.log('   - opacity:', getComputedStyle(neuralBg).opacity);
    console.log('🚀 开始创建科技动画...');
    console.log('==========================================');
    
    // 精确的俯瞰大脑区域坐标定义（左右半球分明）
    const brainRegions = {
        // 左半球（逻辑思维区域）
        leftFrontal: { x: 0.25, y: 0.35, radius: 0.12, hemisphere: 'left', name: '左额叶逻辑区' },
        leftParietal: { x: 0.20, y: 0.50, radius: 0.10, hemisphere: 'left', name: '左顶叶感知区' },
        leftTemporal: { x: 0.15, y: 0.65, radius: 0.09, hemisphere: 'left', name: '左颞叶语言区' },
        leftOccipital: { x: 0.30, y: 0.75, radius: 0.08, hemisphere: 'left', name: '左枕叶视觉区' },
        leftMotor: { x: 0.35, y: 0.40, radius: 0.07, hemisphere: 'left', name: '左运动皮质' },

        // 右半球（创意思维区域）
        rightFrontal: { x: 0.75, y: 0.35, radius: 0.12, hemisphere: 'right', name: '右额叶创意区' },
        rightParietal: { x: 0.80, y: 0.50, radius: 0.10, hemisphere: 'right', name: '右顶叶空间区' },
        rightTemporal: { x: 0.85, y: 0.65, radius: 0.09, hemisphere: 'right', name: '右颞叶艺术区' },
        rightOccipital: { x: 0.70, y: 0.75, radius: 0.08, hemisphere: 'right', name: '右枕叶形状区' },
        rightMotor: { x: 0.65, y: 0.40, radius: 0.07, hemisphere: 'right', name: '右运动皮质' },

        // 中心区域（连接左右半球）
        corpus: { x: 0.50, y: 0.45, radius: 0.06, hemisphere: 'center', name: '脑梁连接区' },
        hippocampus: { x: 0.50, y: 0.55, radius: 0.08, hemisphere: 'center', name: '海马体记忆中心' },
        thalamus: { x: 0.50, y: 0.35, radius: 0.05, hemisphere: 'center', name: '丘脑中继站' },

        // 后部区域
        cerebellum: { x: 0.50, y: 0.80, radius: 0.12, hemisphere: 'center', name: '小脑平衡中心' }
    };

    // 创建大脑容器
    const brainContainer = document.createElement('div');
    brainContainer.className = 'brain-container';
    neuralBg.appendChild(brainContainer);

    // 创建大脑区域标识
    Object.entries(brainRegions).forEach(([key, region]) => {
        const regionDiv = document.createElement('div');
        regionDiv.className = 'brain-region';

        // 根据半球添加不同样式
        if (region.hemisphere === 'left') {
            regionDiv.classList.add('left-hemisphere');
        } else if (region.hemisphere === 'right') {
            regionDiv.classList.add('right-hemisphere');
        }

        regionDiv.style.left = (region.x * 100) + '%';
        regionDiv.style.top = (region.y * 100) + '%';
        regionDiv.style.width = (region.radius * 200) + 'px';
        regionDiv.style.height = (region.radius * 200) + 'px';
        regionDiv.style.marginLeft = -(region.radius * 100) + 'px';
        regionDiv.style.marginTop = -(region.radius * 100) + 'px';
        regionDiv.style.animationDelay = (Math.random() * 8) + 's';
        regionDiv.title = region.name;
        neuralBg.appendChild(regionDiv);
    });

    // 智能随机星辰生成（强化左右半球差异）- 优化版
    function createIntelligentStar() {
        const star = document.createElement('div');
        star.className = 'star';

        // 增加随机性：70%概率在大脑区域内，30%在外围
        let x, y, hemisphere = null;

        if (Math.random() < 0.7) {
            // 大脑区域内 - 增加更多变化
            const regions = Object.values(brainRegions);
            const region = regions[Math.floor(Math.random() * regions.length)];

            // 使用多种分布模式增加随机性
            const distributionType = Math.random();
            let angle, distance;
            
            if (distributionType < 0.4) {
                // 40% 概率：均匀分布
                angle = Math.random() * Math.PI * 2;
                distance = Math.random() * region.radius * 0.9;
            } else if (distributionType < 0.7) {
                // 30% 概率：边缘分布（更多在边缘）
                angle = Math.random() * Math.PI * 2;
                distance = (0.6 + Math.random() * 0.4) * region.radius;
            } else {
                // 30% 概率：中心分布（更多在中心）
                angle = Math.random() * Math.PI * 2;
                distance = Math.random() * Math.random() * region.radius * 0.5;
            }
            
            x = (region.x + Math.cos(angle) * distance) * 100;
            y = (region.y + Math.sin(angle) * distance) * 100;
            hemisphere = region.hemisphere;
        } else {
            // 外围星辰 - 增加更自然的分布
            const edgeType = Math.random();
            
            if (edgeType < 0.5) {
                // 50% 在大脑轮廓周围
                const brainCenterX = 50;
                const brainCenterY = 50;
                const angle = Math.random() * Math.PI * 2;
                const distance = 25 + Math.random() * 20; // 25-45% 范围
                
                x = brainCenterX + Math.cos(angle) * distance;
                y = brainCenterY + Math.sin(angle) * distance;
            } else {
                // 50% 完全随机位置
                x = Math.random() * 100;
                y = Math.random() * 100;
            }

            // 判断在哪个半球
            if (x < 42) hemisphere = 'left';
            else if (x > 58) hemisphere = 'right';
            else hemisphere = 'center';
        }

        // 确保坐标在有效范围内
        x = Math.max(2, Math.min(98, x));
        y = Math.max(2, Math.min(98, y));

        // 根据半球设置不同的星辰特性 - 优化光晕效果
        if (hemisphere === 'left') {
            // 左半球：蓝色调，表示逻辑思维
            star.style.background = 'rgba(59, 130, 246, 0.9)';
            // 更自然的多层光晕
            const glowIntensity = 0.6 + Math.random() * 0.4; // 0.6-1.0
            star.style.boxShadow = `
                0 0 ${4 + Math.random() * 4}px rgba(59, 130, 246, ${glowIntensity}), 
                0 0 ${8 + Math.random() * 7}px rgba(96, 165, 250, ${glowIntensity * 0.6}),
                0 0 ${12 + Math.random() * 8}px rgba(59, 130, 246, ${glowIntensity * 0.3})
            `;
        } else if (hemisphere === 'right') {
            // 右半球：紫色调，表示创意思维
            star.style.background = 'rgba(168, 85, 247, 0.9)';
            const glowIntensity = 0.6 + Math.random() * 0.4;
            star.style.boxShadow = `
                0 0 ${4 + Math.random() * 4}px rgba(168, 85, 247, ${glowIntensity}), 
                0 0 ${8 + Math.random() * 7}px rgba(147, 51, 234, ${glowIntensity * 0.6}),
                0 0 ${12 + Math.random() * 8}px rgba(168, 85, 247, ${glowIntensity * 0.3})
            `;
        } else {
            // 中心区域：白色，表示连接区
            star.style.background = 'rgba(255, 255, 255, 0.95)';
            const glowIntensity = 0.7 + Math.random() * 0.3;
            star.style.boxShadow = `
                0 0 ${5 + Math.random() * 5}px rgba(255, 255, 255, ${glowIntensity}), 
                0 0 ${10 + Math.random() * 8}px rgba(200, 200, 255, ${glowIntensity * 0.5}),
                0 0 ${15 + Math.random() * 10}px rgba(96, 165, 250, ${glowIntensity * 0.3})
            `;
        }

        // 随机大小
        const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
        const weights = [0.25, 0.25, 0.2, 0.15, 0.15];
        const random = Math.random();
        let size = sizes[0];
        let cumulative = 0;

        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random < cumulative) {
                size = sizes[i];
                break;
            }
        }

        star.classList.add(size);

        // 大脑区域内的星辰更亮
        if (hemisphere && hemisphere !== 'center' && Math.random() < 0.4) {
            star.classList.add('bright-star');
        }

        // 随机闪烁延迟和周期
        const twinkleDelay = Math.random() * 6;
        const twinkleDuration = 3 + Math.random() * 4;

        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.animationDelay = twinkleDelay + 's';
        star.style.animationDuration = twinkleDuration + 's';
        star.style.opacity = '0';
        star.style.transition = 'opacity 3s ease-in-out';
        star.dataset.hemisphere = hemisphere || 'none';

        neuralBg.appendChild(star);

        // 淡入效果
        setTimeout(() => {
            star.style.opacity = '1';
        }, 200);

        // 生命周期：10-20秒
        const lifetime = Math.random() * 10000 + 10000;
        setTimeout(() => {
            star.style.opacity = '0';
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 3000);
        }, lifetime);
    }

    // 真实流星系统 - 模拟真实天体运动
    function createRealisticMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';

        // 随机选择四种不同的轨迹动画
        const animations = [
            'realistic-meteor-1 4s ease-out forwards',
            'realistic-meteor-2 4.5s ease-out forwards',
            'realistic-meteor-3 3.8s ease-out forwards',
            'realistic-meteor-4 4.2s ease-out forwards'
        ];

        const selectedAnimation = animations[Math.floor(Math.random() * animations.length)];

        // 随机起始位置（在屏幕边缘）
        const startPositions = [
            { x: -50, y: Math.random() * (neuralBg.clientHeight * 0.3) },
            { x: neuralBg.clientWidth + 50, y: Math.random() * (neuralBg.clientHeight * 0.3) },
            { x: Math.random() * (neuralBg.clientWidth * 0.3), y: -50 },
            { x: Math.random() * (neuralBg.clientWidth * 0.7) + (neuralBg.clientWidth * 0.3), y: neuralBg.clientHeight + 50 }
        ];

        const startPos = startPositions[Math.floor(Math.random() * startPositions.length)];

        meteor.style.left = startPos.x + 'px';
        meteor.style.top = startPos.y + 'px';
        meteor.style.animation = selectedAnimation;

        // 添加尾迹效果
        meteor.addEventListener('animationstart', () => {
            meteor.style.opacity = '1';
        });

        neuralBg.appendChild(meteor);
        console.log('创建流星，位置:', startPos);

        // 4.5秒后移除
        setTimeout(() => {
            if (meteor.parentNode) {
                meteor.parentNode.removeChild(meteor);
            }
        }, 4500);
    }

    // 智能神经脉冲系统
    function createIntelligentNeuralPulse() {
        const regions = Object.entries(brainRegions);
        const [regionName, region] = regions[Math.floor(Math.random() * regions.length)];
        
        console.log('神经脉冲激活区域:', regionName, region.name);

        // 激活该区域的所有星辰
        const stars = document.querySelectorAll('.star');
        const regionStars = [];

        stars.forEach(star => {
            const rect = star.getBoundingClientRect();
            const parentRect = neuralBg.getBoundingClientRect();
            const starX = (rect.left - parentRect.left) / parentRect.width;
            const starY = (rect.top - parentRect.top) / parentRect.height;

            const distance = Math.sqrt(Math.pow(starX - region.x, 2) + Math.pow(starY - region.y, 2));

            if (distance < region.radius * 1.2) {
                regionStars.push(star);
            }
        });

        console.log('区域内星辰数量:', regionStars.length);

        // 逐个激活星辰 - 科技感强烈的效果
        regionStars.forEach((star, index) => {
            setTimeout(() => {
                star.style.filter = 'brightness(4) drop-shadow(0 0 15px rgba(96, 165, 250, 1)) drop-shadow(0 0 25px rgba(168, 85, 247, 0.8))';
                star.style.transform = 'scale(3.5) rotate(180deg)';
                star.style.zIndex = '100';

                // 创建连接线效果
                if (index > 0) {
                    createStarConnection(regionStars[index-1], star);
                }

                setTimeout(() => {
                    star.style.filter = '';
                    star.style.transform = '';
                    star.style.zIndex = '';
                }, 2000);
            }, index * 150);
        });

        // 区域脉冲效果 - 增强科技感
        const brainRegionDivs = document.querySelectorAll('.brain-region');
        const targetRegionIndex = Object.keys(brainRegions).indexOf(regionName);
        
        if (brainRegionDivs[targetRegionIndex]) {
            const regionDiv = brainRegionDivs[targetRegionIndex];
            regionDiv.style.opacity = '0.4';
            regionDiv.style.background = 'radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, rgba(168, 85, 247, 0.6) 50%, transparent 80%)';
            regionDiv.style.transform = 'scale(2.2)';
            regionDiv.style.filter = 'brightness(1.5) drop-shadow(0 0 20px rgba(96, 165, 250, 0.8))';

            setTimeout(() => {
                regionDiv.style.opacity = '0.1';
                regionDiv.style.background = 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)';
                regionDiv.style.transform = 'scale(1)';
                regionDiv.style.filter = '';
            }, 3000);
        }
    }

    // 创建星辰连接线效果
    function createStarConnection(star1, star2) {
        const connection = document.createElement('div');
        connection.className = 'star-connection active-connection';
        
        const rect1 = star1.getBoundingClientRect();
        const rect2 = star2.getBoundingClientRect();
        const parentRect = neuralBg.getBoundingClientRect();
        
        const x1 = rect1.left - parentRect.left;
        const y1 = rect1.top - parentRect.top;
        const x2 = rect2.left - parentRect.left;
        const y2 = rect2.top - parentRect.top;
        
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        connection.style.left = x1 + 'px';
        connection.style.top = y1 + 'px';
        connection.style.width = distance + 'px';
        connection.style.transform = `rotate(${angle}deg)`;
        
        neuralBg.appendChild(connection);
        
        // 2秒后移除连接线
        setTimeout(() => {
            if (connection.parentNode) {
                connection.parentNode.removeChild(connection);
            }
        }, 2000);
    }

    // 初始化更多星辰以强化大脑形状
    console.log('创建初始星辰...');
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createIntelligentStar(), i * 200);
    }

    // 定时执行各种效果 - 优化时间间隔
    const starInterval = setInterval(createIntelligentStar, 1800); // 更频繁的星辰生成
    const meteorInterval = setInterval(createRealisticMeteor, 6000); // 更频繁的流星
    const pulseInterval = setInterval(createIntelligentNeuralPulse, 5000); // 更频繁的神经脉冲

    // 初始化延迟执行
    setTimeout(createRealisticMeteor, 1000);
    setTimeout(createIntelligentNeuralPulse, 2000);
    
    console.log('完整星辰神经动画系统初始化完成！');

    // 返回清理函数
    return () => {
        clearInterval(starInterval);
        clearInterval(meteorInterval);
        clearInterval(pulseInterval);
    };
}

// 初始化动画系统
function initializeAnimations() {
    console.log('==========================================');
    console.log('🚀 准备初始化完整动画系统...');
    console.log('DOM状态:', document.readyState);
    
    // 检查neural-bg容器是否存在
    const neuralBg = document.querySelector('.neural-bg');
    if (neuralBg) {
        console.log('✅ 找到neural-bg容器，尺寸:', neuralBg.offsetWidth, 'x', neuralBg.offsetHeight);
        console.log('✅ neural-bg z-index:', getComputedStyle(neuralBg).zIndex);
    } else {
        console.error('❌ 未找到neural-bg容器!');
    }
    
    // 确保DOM已加载
    if (document.readyState === 'loading') {
        console.log('⏳ DOM仍在加载中，等待DOMContentLoaded事件...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📋 DOMContentLoaded事件触发，800ms后启动动画...');
            setTimeout(() => {
                console.log('🎬 开始启动动画系统!');
                createBrainStarSystem();
            }, 800);
        });
    } else {
        console.log('📋 DOM已就绪，800ms后启动动画...');
        setTimeout(() => {
            console.log('🎬 开始启动动画系统!');
            createBrainStarSystem();
        }, 800);
    }
    console.log('==========================================');
}

// 立即执行初始化
initializeAnimations();