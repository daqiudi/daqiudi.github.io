/**
 * 场景管理器
 * 负责Three.js场景、相机、光照系统的初始化和4大主题场景切换
 */

class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.lights = [];
        this.backgroundMesh = null;
        
        // 简化的场景配置
        this.sceneConfig = {
            bgColor: 0x1a1a2e,
            ambientColor: 0x404060,
            lightColor: 0xffffff,
            fogColor: 0x1a1a2e,
            fogDensity: 0.02
        };
        
        // 背景主题配置
        this.backgroundThemes = {
            starry: {
                name: '梦幻星空',
                bgColor: 0x0a0e27,
                ambientColor: 0x304080,
                lightColor: 0xaaccff,
                fogColor: 0x0a0e27,
                fogDensity: 0.015
            },
            pink: {
                name: '浪漫粉颜',
                bgColor: 0xffb6c1,
                ambientColor: 0xff9eb5,
                lightColor: 0xffd4e0,
                fogColor: 0xffc0cb,
                fogDensity: 0.02
            },
            white: {
                name: '神圣淡白',
                bgColor: 0xf5f5f5,
                ambientColor: 0xe8e8e8,
                lightColor: 0xffffff,
                fogColor: 0xfafafa,
                fogDensity: 0.025
            }
        };
        
        this.init();
    }
    
    /**
     * 初始化Three.js基础环境
     */
    init() {
        const container = document.getElementById('canvas-container');
        
        // 创建场景
        this.scene = new THREE.Scene();
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 15);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
        
        // 创建轨道控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());
        
        // 设置场景
        this.setupScene();
    }
    
    /**
     * 设置场景
     */
    setupScene() {
        const config = this.sceneConfig;
        
        // 设置场景背景
        this.scene.background = new THREE.Color(config.bgColor);
        this.scene.fog = new THREE.FogExp2(config.fogColor, config.fogDensity);
        
        // 添加光照
        this.setupLights(config);
    }
    
    /**
     * 切换背景主题
     */
    setBackgroundTheme(themeName) {
        const theme = this.backgroundThemes[themeName];
        if (!theme) {
            console.error(`Unknown theme: ${themeName}`);
            return;
        }
        
        // 更新配置
        this.sceneConfig = { ...theme };
        
        // 清除旧的光照
        this.clearLights();
        
        // 应用新主题
        this.scene.background = new THREE.Color(theme.bgColor);
        this.scene.fog = new THREE.FogExp2(theme.fogColor, theme.fogDensity);
        this.setupLights(theme);
        
        Utils.showToast(`切换到${theme.name}主题`);
    }
    
    /**
     * 设置光照系统
     */
    setupLights(config) {
        // 环境光
        const ambientLight = new THREE.AmbientLight(config.ambientColor, 0.6);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // 主光源
        const mainLight = new THREE.DirectionalLight(config.lightColor, 0.8);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        this.scene.add(mainLight);
        this.lights.push(mainLight);
        
        // 补光
        const fillLight = new THREE.PointLight(config.lightColor, 0.4, 50);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);
        this.lights.push(fillLight);
    }
    
    /**
     * 清除所有光照
     */
    clearLights() {
        this.lights.forEach(light => {
            this.scene.remove(light);
        });
        this.lights = [];
    }
    

    
    /**
     * 窗口大小调整
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * 渲染循环
     */
    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * 获取渲染器
     */
    getRenderer() {
        return this.renderer;
    }
    
    /**
     * 获取场景
     */
    getScene() {
        return this.scene;
    }
    
    /**
     * 获取相机
     */
    getCamera() {
        return this.camera;
    }
}

// 导出场景管理器
window.SceneManager = SceneManager;
