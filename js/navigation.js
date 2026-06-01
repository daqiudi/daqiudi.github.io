/**
 * 导航控制器
 * 负责3D悬浮导航栏的交互和功能
 */

class NavigationController {
    constructor(sceneManager, photoManager) {
        this.sceneManager = sceneManager;
        this.photoManager = photoManager;
        this.currentMode = 'browse'; // browse or play
        
        this.init();
    }
    
    /**
     * 初始化导航
     */
    init() {
        this.bindEvents();
        this.initMobileSwipe();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 背景主题切换按钮
        document.querySelectorAll('[data-action^="bg-"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const themeName = e.currentTarget.dataset.action.replace('bg-', '');
                this.sceneManager.setBackgroundTheme(themeName);
                
                // 更新按钮状态
                document.querySelectorAll('[data-action^="bg-"]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
        
        // 分组筛选按钮
        document.querySelectorAll('[data-action^="group-"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const groupType = e.currentTarget.dataset.action.replace('group-', '');
                this.filterGroup(groupType);
                
                // 更新按钮状态
                document.querySelectorAll('[data-action^="group-"]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
        
        // 浏览模式切换
        document.querySelector('[data-action="mode-browse"]').addEventListener('click', () => {
            this.setMode('browse');
        });
        
        document.querySelector('[data-action="mode-play"]').addEventListener('click', () => {
            this.setMode('play');
        });
        
        // 功能按钮
        document.querySelector('[data-action="upload"]').addEventListener('click', () => {
            this.openUploadDialog();
        });
        
        // 背景音乐控制
        document.querySelector('[data-action="toggle-music"]').addEventListener('click', () => {
            this.toggleMusic();
        });
        
        document.querySelector('[data-action="settings"]').addEventListener('click', () => {
            this.openSettingsPanel();
        });
        
        document.querySelector('[data-action="fullscreen"]').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // 照片详情浮窗控制
        document.querySelector('[data-action="close-modal"]').addEventListener('click', () => {
            this.photoManager.closePhotoDetail();
        });
        
        document.querySelector('[data-action="prev-photo"]').addEventListener('click', () => {
            this.photoManager.showPreviousPhoto();
        });
        
        document.querySelector('[data-action="next-photo"]').addEventListener('click', () => {
            this.photoManager.showNextPhoto();
        });
        
        document.querySelector('[data-action="toggle-favorite"]').addEventListener('click', () => {
            if (this.photoManager.selectedPhoto) {
                this.photoManager.toggleFavorite(this.photoManager.selectedPhoto.id);
            }
        });
        
        // 分组侧边栏折叠
        document.querySelector('[data-action="toggle-groups"]').addEventListener('click', () => {
            const groupsPanel = document.getElementById('photo-groups');
            const toggleBtn = document.querySelector('[data-action="toggle-groups"]');
            
            if (groupsPanel.classList.contains('fully-collapsed')) {
                // 从完全隐藏状态恢复到展开状态
                groupsPanel.classList.remove('fully-collapsed');
                groupsPanel.classList.remove('collapsed');
                toggleBtn.textContent = '▼';
            } else if (groupsPanel.classList.contains('collapsed')) {
                // 从折叠状态到完全隐藏状态
                groupsPanel.classList.add('fully-collapsed');
                toggleBtn.textContent = '▶';
            } else {
                // 从展开状态到折叠状态
                groupsPanel.classList.add('collapsed');
                toggleBtn.textContent = '◀';
            }
        });
        
        // 分组列表点击
        document.querySelectorAll('.group-item').forEach(item => {
            item.addEventListener('click', () => {
                const group = item.dataset.group;
                this.filterGroup(group);
                
                // 更新UI
                document.querySelectorAll('.group-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    

    /**
     * 初始化移动端滑动功能
     */
    initMobileSwipe() {
        const navSections = document.querySelector('.nav-sections');
        if (!navSections) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // 鼠标事件（用于桌面端测试）
        navSections.addEventListener('mousedown', (e) => {
            isDown = true;
            navSections.classList.add('active');
            startX = e.pageX - navSections.offsetLeft;
            scrollLeft = navSections.scrollLeft;
        });
        
        navSections.addEventListener('mouseleave', () => {
            isDown = false;
            navSections.classList.remove('active');
        });
        
        navSections.addEventListener('mouseup', () => {
            isDown = false;
            navSections.classList.remove('active');
        });
        
        navSections.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - navSections.offsetLeft;
            const walk = (x - startX) * 2; // 滚动速度
            navSections.scrollLeft = scrollLeft - walk;
        });
        
        // 触摸事件（移动端）
        navSections.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - navSections.offsetLeft;
            scrollLeft = navSections.scrollLeft;
        }, { passive: true });
        
        navSections.addEventListener('touchend', () => {
            isDown = false;
        });
        
        navSections.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - navSections.offsetLeft;
            const walk = (x - startX) * 2;
            navSections.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }
    
    /**
     * 筛选分组
     */
    filterGroup(groupType) {
        this.photoManager.filterByGroup(groupType);
    }
    
    /**
     * 设置浏览模式
     */
    setMode(mode) {
        // 如果已经是当前模式，则退出
        if (this.currentMode === mode && mode === 'play') {
            mode = 'browse';
        }
        
        this.currentMode = mode;
        
        // 更新按钮状态
        document.querySelectorAll('[data-action^="mode-"]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-action="mode-${mode}"]`).classList.add('active');
        
        // 显示/隐藏播放控制
        const playbackControls = document.getElementById('playback-controls');
        if (mode === 'play') {
            playbackControls.style.display = 'flex';
            if (window.playbackController) {
                window.playbackController.startPlayback();
            }
        } else {
            playbackControls.style.display = 'none';
            if (window.playbackController) {
                window.playbackController.stopPlayback();
            }
        }
        
        Utils.showToast(mode === 'play' ? '进入播放模式' : '退出播放模式');
    }
    
    /**
     * 打开上传对话框
     */
    openUploadDialog() {
        document.getElementById('upload-dialog').classList.add('show');
    }
    
    /**
     * 切换背景音乐
     */
    toggleMusic() {
        if (!window.audioManager) return;
        
        if (window.audioManager.getIsPlaying()) {
            window.audioManager.pause();
        } else {
            window.audioManager.play();
        }
        
        this.updateMusicButton();
    }
    
    /**
     * 更新音乐按钮状态
     */
    updateMusicButton() {
        const musicBtn = document.querySelector('[data-action="toggle-music"]');
        if (musicBtn && window.audioManager) {
            const icon = musicBtn.querySelector('.btn-icon');
            if (window.audioManager.getIsPlaying()) {
                icon.textContent = '🎶';
                musicBtn.classList.add('active');
            } else {
                icon.textContent = '🎵';
                musicBtn.classList.remove('active');
            }
        }
    }
    
    /**
     * 关闭上传对话框
     */
    closeUploadDialog() {
        document.getElementById('upload-dialog').classList.remove('show');
    }
    
    /**
     * 打开设置面板
     */
    openSettingsPanel() {
        document.getElementById('settings-panel').classList.add('show');
    }
    
    /**
     * 关闭设置面板
     */
    closeSettingsPanel() {
        document.getElementById('settings-panel').classList.remove('show');
    }
    
    /**
     * 切换全屏
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    /**
     * 处理键盘事件
     */
    handleKeyboard(e) {
        switch(e.key) {
            case 'Escape':
                this.photoManager.closePhotoDetail();
                this.closeUploadDialog();
                this.closeSettingsPanel();
                break;
            case 'ArrowLeft':
                if (this.photoManager.selectedPhoto) {
                    this.photoManager.showPreviousPhoto();
                }
                break;
            case 'ArrowRight':
                if (this.photoManager.selectedPhoto) {
                    this.photoManager.showNextPhoto();
                }
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
            case ' ':
                e.preventDefault();
                if (this.currentMode === 'play' && window.playbackController) {
                    window.playbackController.togglePlayPause();
                }
                break;
        }
    }
}

// 导出导航控制器
window.NavigationController = NavigationController;
