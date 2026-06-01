/**
 * 音频管理器
 * 负责背景音乐的播放、暂停、切换等功能
 */

class AudioManager {
    constructor() {
        this.audioElement = null;
        this.playlist = []; // 音乐列表
        this.currentIndex = 0;
        this.isPlaying = false;
        this.volume = 0.5;
        
        this.init();
    }
    
    /**
     * 初始化音频系统
     */
    init() {
        // 创建音频元素
        this.audioElement = new Audio();
        this.audioElement.loop = false; // 不自动循环，手动控制
        this.audioElement.volume = this.volume;
        
        // 监听播放结束事件
        this.audioElement.addEventListener('ended', () => {
            this.playNext();
        });
        
        // 监听错误事件
        this.audioElement.addEventListener('error', (e) => {
            console.error('音频播放错误:', e);
            Utils.showToast('音频播放失败');
        });
        
        // 加载音乐列表
        this.loadPlaylist();
    }
    
    /**
     * 加载音乐列表
     */
    async loadPlaylist() {
        try {
            // 尝试加载音乐列表配置文件
            const response = await fetch('audio/playlist.json');
            if (response.ok) {
                const data = await response.json();
                this.playlist = data.songs || [];
                console.log(`已加载 ${this.playlist.length} 首音乐`);
            } else {
                // 如果没有配置文件，使用默认列表
                this.playlist = [
                    { name: '示例音乐1', url: 'audio/比初雪先来的是你.mp3' },
                    { name: '示例音乐2', url: 'audio/明天见.mp3' },
                    { name: '示例音乐3', url: 'audio/愿你走过夜多长.mp3' }
                ];
                console.log('使用默认音乐列表');
            }
        } catch (error) {
            console.warn('无法加载音乐列表:', error);
            this.playlist = [];
        }
    }
    
    /**
     * 播放音乐
     */
    play(index = 0) {
        if (this.playlist.length === 0) {
            Utils.showToast('没有可用的音乐');
            return;
        }
        
        this.currentIndex = index % this.playlist.length;
        const song = this.playlist[this.currentIndex];
        
        this.audioElement.src = song.url;
        this.audioElement.play()
            .then(() => {
                this.isPlaying = true;
                console.log(`正在播放: ${song.name}`);
                Utils.showToast(`♪ ${song.name}`);
            })
            .catch(error => {
                console.error('播放失败:', error);
                Utils.showToast('播放失败，请检查音频文件');
            });
    }
    
    /**
     * 暂停音乐
     */
    pause() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.isPlaying = false;
            Utils.showToast('已暂停');
        }
    }
    
    /**
     * 切换播放/暂停
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play(this.currentIndex);
        }
    }
    
    /**
     * 播放下一首
     */
    playNext() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.play(this.currentIndex);
    }
    
    /**
     * 播放上一首
     */
    playPrevious() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.play(this.currentIndex);
    }
    
    /**
     * 设置音量
     */
    setVolume(value) {
        this.volume = value / 100;
        if (this.audioElement) {
            this.audioElement.volume = this.volume;
        }
    }
    
    /**
     * 获取播放状态
     */
    getIsPlaying() {
        return this.isPlaying;
    }
    
    /**
     * 获取当前音乐信息
     */
    getCurrentSong() {
        if (this.playlist.length === 0) return null;
        return this.playlist[this.currentIndex];
    }
    
    /**
     * 获取音乐列表
     */
    getPlaylist() {
        return this.playlist;
    }
}

// 导出音频管理器
window.AudioManager = AudioManager;
