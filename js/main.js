/**
 * 主程序入口
 * 初始化所有模块并启动应用
 */

// 全局变量
let sceneManager = null;
let photoManager = null;
let particleSystem = null;
let navigationController = null;
let uploadHandler = null;
let settingsManager = null;
let playbackController = null;
let audioManager = null;

/**
 * 应用初始化
 */
async function initApp() {
    try {
        // 显示加载进度
        updateLoadingProgress(10);
        
        // 初始化场景管理器
        sceneManager = new SceneManager();
        window.sceneManager = sceneManager;
        updateLoadingProgress(30);
        
        // 初始化照片管理器
        photoManager = new PhotoManager(sceneManager);
        window.photoManager = photoManager;
        updateLoadingProgress(50);
        
        // 初始化粒子系统
        particleSystem = new ParticleSystem(sceneManager);
        window.particleSystem = particleSystem;
        updateLoadingProgress(60);
        
        // 初始化导航控制器
        navigationController = new NavigationController(sceneManager, photoManager);
        window.navigationController = navigationController;
        updateLoadingProgress(70);
        
        // 初始化上传处理器
        uploadHandler = new UploadHandler(photoManager);
        window.uploadHandler = uploadHandler;
        updateLoadingProgress(80);
        
        // 初始化设置管理器
        settingsManager = new SettingsManager(sceneManager, photoManager);
        window.settingsManager = settingsManager;
        updateLoadingProgress(90);
        
        // 初始化播放控制器
        playbackController = new PlaybackController(photoManager);
        window.playbackController = playbackController;
        updateLoadingProgress(95);
        
        // 初始化音频管理器
        audioManager = new AudioManager();
        window.audioManager = audioManager;
        updateLoadingProgress(100);
        
        // 隐藏加载界面
        setTimeout(() => {
            hideLoadingScreen();
        }, 500);
        
        // 启动渲染循环
        startRenderLoop();
        
        console.log('应用初始化完成');
        
    } catch (error) {
        console.error('应用初始化失败:', error);
        showToast('应用加载失败，请刷新页面重试');
    }
}

/**
 * 更新加载进度
 */
function updateLoadingProgress(progress) {
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * 隐藏加载界面
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

/**
 * 启动渲染循环
 */
function startRenderLoop() {
    let frameCount = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        frameCount++;
        
        // 渲染场景
        if (sceneManager) {
            sceneManager.render();
        }
        
        // 更新粒子系统
        if (particleSystem) {
            particleSystem.update();
        }
        
        // 每5帧更新一次LOD（减少计算频率）
        if (frameCount % 5 === 0 && photoManager) {
            photoManager.updateLOD();
        }
    }
    
    animate();
}

/**
 * 显示提示
 */
function showToast(message) {
    Utils.showToast(message);
}

/**
 * 添加CSS动画样式
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * 检测设备类型并优化
 */
function optimizeForDevice() {
    const isMobileDevice = Utils.isMobile();
    
    if (isMobileDevice) {
        // 移动端优化
        document.body.classList.add('mobile-device');
        
        // 降低粒子数量
        if (particleSystem) {
            particleSystem.setIntensity(40);
        }
        
        // 简化阴影
        if (sceneManager) {
            const renderer = sceneManager.getRenderer();
            renderer.shadowMap.enabled = false;
        }
        
        console.log('已应用移动端优化');
    }
}

/**
 * 注册服务工作者（可选，用于离线支持）
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // 这里可以注册service worker
        // navigator.serviceWorker.register('/sw.js');
    }
}

/**
 * 处理页面可见性变化
 */
function handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面不可见时暂停播放
            if (playbackController && playbackController.isPlaying) {
                playbackController.pause();
            }
        }
    });
}

/**
 * 预加载关键资源
 */
async function preloadCriticalResources() {
    // 预加载示例图片
    const sampleImages = [
        'https://picsum.photos/400/600?random=1',
        'https://picsum.photos/400/600?random=2',
        'https://picsum.photos/400/600?random=3'
    ];
    
    try {
        await Utils.loadImages(sampleImages);
        console.log('关键资源预加载完成');
    } catch (error) {
        console.warn('部分资源预加载失败:', error);
    }
}

/**
 * 绑定全局事件
 */
function bindGlobalEvents() {
    // 防止移动端双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 阻止默认的双击手势
    document.addEventListener('dblclick', (e) => {
        e.preventDefault();
    });
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 添加动画样式
    addAnimationStyles();
    
    // 绑定全局事件
    bindGlobalEvents();
    
    // 预加载资源
    preloadCriticalResources();
    
    // 初始化应用
    initApp();
    
    // 设备优化
    optimizeForDevice();
    
    // 处理可见性变化
    handleVisibilityChange();
    
    // 注册服务工作者
    registerServiceWorker();
});

// 导出全局函数
window.WeddingApp = {
    initApp,
    sceneManager,
    photoManager,
    particleSystem,
    navigationController,
    uploadHandler,
    settingsManager,
    playbackController
};
