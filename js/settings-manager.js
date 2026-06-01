/**
 * 设置管理器
 * 负责主题标题、特效、性能等设置
 */

class SettingsManager {
    constructor(sceneManager, photoManager) {
        this.sceneManager = sceneManager;
        this.photoManager = photoManager;
        
        // 默认设置
        this.settings = {
            groomName: '新郎',
            brideName: '新娘',
            subtitle: '我们的美好时光',
            titleSize: 48,
            titleColor: '#ffffff',
            particleIntensity: 70,
            bgMusicEnabled: false,
            musicVolume: 50,
            renderQuality: 'medium',
            rotationSpeed: 30
        };
        
        this.init();
    }
    
    /**
     * 初始化设置
     */
    init() {
        this.loadSettings();
        this.bindEvents();
        this.applySettings();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 保存设置
        document.querySelector('[data-action="save-settings"]').addEventListener('click', () => {
            this.saveSettingsFromUI();
        });
        
        // 关闭设置面板
        document.querySelector('[data-action="close-settings"]').addEventListener('click', () => {
            if (window.navigationController) {
                window.navigationController.closeSettingsPanel();
            }
        });
        
        // 背景音乐控制
        document.getElementById('bg-music-toggle').addEventListener('change', (e) => {
            if (window.audioManager) {
                if (e.target.checked) {
                    window.audioManager.play();
                } else {
                    window.audioManager.pause();
                }
                if (window.navigationController) {
                    window.navigationController.updateMusicButton();
                }
            }
        });
        
        document.getElementById('music-volume').addEventListener('input', (e) => {
            if (window.audioManager) {
                window.audioManager.setVolume(e.target.value);
            }
        });
        
        // 实时预览标题变化
        ['groom-name', 'bride-name', 'subtitle'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.updateTitlePreview();
            });
        });
        
        document.getElementById('title-size').addEventListener('input', () => {
            this.updateTitlePreview();
        });
        
        document.getElementById('title-color').addEventListener('input', () => {
            this.updateTitlePreview();
        });
        
        // 粒子强度调节
        document.getElementById('particle-intensity').addEventListener('change', (e) => {
            if (window.particleSystem) {
                window.particleSystem.setIntensity(e.target.value);
            }
        });
    }
    
    /**
     * 从UI读取并保存设置
     */
    saveSettingsFromUI() {
        this.settings.groomName = document.getElementById('groom-name').value || '新郎';
        this.settings.brideName = document.getElementById('bride-name').value || '新娘';
        this.settings.subtitle = document.getElementById('subtitle').value || '我们的美好时光';
        this.settings.titleSize = parseInt(document.getElementById('title-size').value);
        this.settings.titleColor = document.getElementById('title-color').value;
        this.settings.particleIntensity = parseInt(document.getElementById('particle-intensity').value);
        this.settings.bgMusicEnabled = document.getElementById('bg-music-toggle').checked;
        this.settings.musicVolume = parseInt(document.getElementById('music-volume').value);
        this.settings.renderQuality = document.getElementById('render-quality').value;
        this.settings.rotationSpeed = parseInt(document.getElementById('rotation-speed').value);
        
        // 保存到本地存储
        Utils.storage.set('weddingSettings', this.settings);
        
        // 应用设置
        this.applySettings();
        
        Utils.showToast('设置已保存');
        
        // 关闭设置面板
        if (window.navigationController) {
            window.navigationController.closeSettingsPanel();
        }
    }
    
    /**
     * 加载设置
     */
    loadSettings() {
        const savedSettings = Utils.storage.get('weddingSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...savedSettings };
        }
        
        this.populateUI();
    }
    
    /**
     * 填充UI
     */
    populateUI() {
        document.getElementById('groom-name').value = this.settings.groomName;
        document.getElementById('bride-name').value = this.settings.brideName;
        document.getElementById('subtitle').value = this.settings.subtitle;
        document.getElementById('title-size').value = this.settings.titleSize;
        document.getElementById('title-color').value = this.settings.titleColor;
        document.getElementById('particle-intensity').value = this.settings.particleIntensity;
        document.getElementById('bg-music-toggle').checked = this.settings.bgMusicEnabled;
        document.getElementById('music-volume').value = this.settings.musicVolume;
        document.getElementById('render-quality').value = this.settings.renderQuality;
        document.getElementById('rotation-speed').value = this.settings.rotationSpeed;
    }
    
    /**
     * 应用设置
     */
    applySettings() {
        this.updateTitleDisplay();
        
        // 应用粒子强度
        if (window.particleSystem) {
            window.particleSystem.setIntensity(this.settings.particleIntensity);
        }
        
        // 应用渲染质量
        this.applyRenderQuality();
    }
    
    /**
     * 更新标题显示
     */
    updateTitleDisplay() {
        const titleMain = document.querySelector('.title-main');
        const titleSub = document.querySelector('.title-sub');
        
        titleMain.textContent = `${this.settings.groomName} & ${this.settings.brideName}`;
        titleSub.textContent = this.settings.subtitle;
        
        titleMain.style.fontSize = `${this.settings.titleSize}px`;
        titleMain.style.color = this.settings.titleColor;
    }
    
    /**
     * 更新标题预览
     */
    updateTitlePreview() {
        const groomName = document.getElementById('groom-name').value || '新郎';
        const brideName = document.getElementById('bride-name').value || '新娘';
        const subtitle = document.getElementById('subtitle').value || '我们的美好时光';
        const titleSize = document.getElementById('title-size').value;
        const titleColor = document.getElementById('title-color').value;
        
        const titleMain = document.querySelector('.title-main');
        const titleSub = document.querySelector('.title-sub');
        
        titleMain.textContent = `${groomName} & ${brideName}`;
        titleSub.textContent = subtitle;
        
        titleMain.style.fontSize = `${titleSize}px`;
        titleMain.style.color = titleColor;
    }
    
    /**
     * 应用渲染质量
     */
    applyRenderQuality() {
        const renderer = this.sceneManager.getRenderer();
        
        switch (this.settings.renderQuality) {
            case 'low':
                renderer.setPixelRatio(1);
                renderer.shadowMap.enabled = false;
                break;
            case 'medium':
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.shadowMap.enabled = true;
                break;
            case 'high':
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.shadowMap.enabled = true;
                break;
        }
    }
    
    /**
     * 获取设置
     */
    getSettings() {
        return this.settings;
    }
}

// 导出设置管理器
window.SettingsManager = SettingsManager;
