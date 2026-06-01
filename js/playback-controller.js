/**
 * 播放控制器
 * 负责照片自动轮播、转场动画等功能
 */

class PlaybackController {
    constructor(photoManager) {
        this.photoManager = photoManager;
        this.isPlaying = false;
        this.currentIndex = 0;
        this.playbackInterval = null;
        this.transitionDuration = 1500; // 转场持续时间（毫秒）
        this.currentTransition = 'fade'; // 当前转场效果
        
        this.init();
    }
    
    /**
     * 初始化
     */
    init() {
        this.bindEvents();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 播放/暂停
        document.querySelector('[data-action="play-pause"]').addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        // 上一张
        document.querySelector('[data-action="prev-slide"]').addEventListener('click', () => {
            this.previousSlide();
        });
        
        // 下一张
        document.querySelector('[data-action="next-slide"]').addEventListener('click', () => {
            this.nextSlide();
        });
        
        // 转场效果选择
        document.getElementById('transition-effect').addEventListener('change', (e) => {
            this.currentTransition = e.target.value;
        });
    }
    
    /**
     * 开始播放
     */
    startPlayback() {
        const photos = this.photoManager.getPhotos();
        
        if (photos.length === 0) {
            Utils.showToast('没有可播放的照片');
            return;
        }
        
        this.isPlaying = true;
        this.currentIndex = 0;
        
        // 更新播放按钮图标
        document.querySelector('[data-action="play-pause"]').textContent = '⏸️';
        
        // 显示第一张照片
        this.showCurrentPhoto();
        
        // 开始自动播放
        this.playbackInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
        
        Utils.showToast('开始播放');
    }
    
    /**
     * 停止播放
     */
    stopPlayback() {
        this.isPlaying = false;
        
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
        
        // 更新播放按钮图标
        document.querySelector('[data-action="play-pause"]').textContent = '▶️';
    }
    
    /**
     * 切换播放/暂停
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }
    
    /**
     * 暂停
     */
    pause() {
        this.isPlaying = false;
        
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
        
        document.querySelector('[data-action="play-pause"]').textContent = '▶️';
        Utils.showToast('已暂停');
    }
    
    /**
     * 继续播放
     */
    resume() {
        if (this.photoManager.getPhotos().length === 0) {
            Utils.showToast('没有可播放的照片');
            return;
        }
        
        this.isPlaying = true;
        document.querySelector('[data-action="play-pause"]').textContent = '⏸️';
        
        this.playbackInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
        
        Utils.showToast('继续播放');
    }
    
    /**
     * 上一张
     */
    previousSlide() {
        const photos = this.photoManager.getPhotos();
        
        if (photos.length === 0) return;
        
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : photos.length - 1;
        this.showCurrentPhoto();
    }
    
    /**
     * 下一张
     */
    nextSlide() {
        const photos = this.photoManager.getPhotos();
        
        if (photos.length === 0) return;
        
        this.currentIndex = this.currentIndex < photos.length - 1 ? this.currentIndex + 1 : 0;
        this.showCurrentPhoto();
    }
    
    /**
     * 显示当前照片
     */
    showCurrentPhoto() {
        const photos = this.photoManager.getPhotos();
        
        if (photos.length === 0) return;
        
        const photo = photos[this.currentIndex];
        
        // 应用转场效果
        this.applyTransition(() => {
            // 创建临时的全屏展示
            this.createFullscreenDisplay(photo);
        });
        
        // 更新进度显示
        this.updateProgressDisplay();
    }
    
    /**
     * 创建全屏展示
     */
    createFullscreenDisplay(photo) {
        // 移除现有的展示
        const existing = document.querySelector('.fullscreen-photo');
        if (existing) {
            existing.remove();
        }
        
        // 创建新的全屏展示
        const container = document.createElement('div');
        container.className = 'fullscreen-photo';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 500;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.9);
            animation: fadeIn 0.5s ease;
        `;
        
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.title;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        `;
        
        const info = document.createElement('div');
        info.className = 'photo-info-overlay';
        info.style.cssText = `
            position: absolute;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            padding: 15px 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        `;
        
        info.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 1.5rem;">${photo.title}</h3>
            <p style="margin: 0; opacity: 0.8;">${photo.date} · ${this.photoManager.getSceneName(photo.scene)}</p>
        `;
        
        container.appendChild(img);
        container.appendChild(info);
        document.body.appendChild(container);
        
        // 点击关闭
        container.addEventListener('click', () => {
            container.remove();
        });
    }
    
    /**
     * 应用转场效果
     */
    applyTransition(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 499;
            pointer-events: none;
        `;
        
        document.body.appendChild(overlay);
        
        switch (this.currentTransition) {
            case 'fade':
                this.fadeTransition(overlay, callback);
                break;
            case 'blur':
                this.blurTransition(overlay, callback);
                break;
            case 'flash':
                this.flashTransition(overlay, callback);
                break;
            case 'zoom':
                this.zoomTransition(overlay, callback);
                break;
            default:
                this.fadeTransition(overlay, callback);
        }
    }
    
    /**
     * 淡入淡出转场
     */
    fadeTransition(overlay, callback) {
        overlay.style.background = '#000';
        overlay.style.opacity = '0';
        overlay.style.transition = `opacity ${this.transitionDuration / 2}ms ease`;
        
        // 淡出
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            callback();
            
            // 淡入
            setTimeout(() => {
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    overlay.remove();
                }, this.transitionDuration / 2);
            }, 100);
        }, this.transitionDuration / 2);
    }
    
    /**
     * 模糊转场
     */
    blurTransition(overlay, callback) {
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        overlay.style.backdropFilter = 'blur(0px)';
        overlay.style.transition = `backdrop-filter ${this.transitionDuration / 2}ms ease`;
        
        overlay.style.backdropFilter = 'blur(20px)';
        
        setTimeout(() => {
            callback();
            
            setTimeout(() => {
                overlay.style.backdropFilter = 'blur(0px)';
                
                setTimeout(() => {
                    overlay.remove();
                }, this.transitionDuration / 2);
            }, 100);
        }, this.transitionDuration / 2);
    }
    
    /**
     * 闪白转场
     */
    flashTransition(overlay, callback) {
        overlay.style.background = '#fff';
        overlay.style.opacity = '0';
        
        // 快速闪白
        overlay.style.transition = 'opacity 100ms ease';
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            callback();
            
            setTimeout(() => {
                overlay.style.transition = `opacity ${this.transitionDuration / 2}ms ease`;
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    overlay.remove();
                }, this.transitionDuration / 2);
            }, 100);
        }, 100);
    }
    
    /**
     * 缩放转场
     */
    zoomTransition(overlay, callback) {
        overlay.style.background = '#000';
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1)';
        overlay.style.transition = `all ${this.transitionDuration / 2}ms ease`;
        
        overlay.style.opacity = '1';
        overlay.style.transform = 'scale(1.5)';
        
        setTimeout(() => {
            callback();
            
            setTimeout(() => {
                overlay.style.transform = 'scale(1)';
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    overlay.remove();
                }, this.transitionDuration / 2);
            }, 100);
        }, this.transitionDuration / 2);
    }
    
    /**
     * 更新进度显示
     */
    updateProgressDisplay() {
        const photos = this.photoManager.getPhotos();
        const progressCurrent = document.querySelector('.progress-current');
        const timeDisplay = document.querySelector('.time-display');
        
        if (progressCurrent && timeDisplay) {
            const progress = ((this.currentIndex + 1) / photos.length) * 100;
            progressCurrent.style.width = `${progress}%`;
            timeDisplay.textContent = `${this.currentIndex + 1} / ${photos.length}`;
        }
    }
}

// 导出播放控制器
window.PlaybackController = PlaybackController;
