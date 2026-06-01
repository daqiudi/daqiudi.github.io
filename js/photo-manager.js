/**
 * 照片管理器
 * 负责照片的分组、展示、收藏等功能
 */

class PhotoManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.photos = []; // 所有照片数据
        this.photoMeshes = []; // Three.js照片网格对象
        this.currentGroup = 'all'; // 当前显示的分组
        this.favorites = new Set(); // 收藏的照片ID
        this.selectedPhoto = null; // 当前选中的照片
        
        // 照片墙布局参数 - 优化版
        this.wallConfig = {
            radius: 12,           // 增加半径，减少拥挤
            rows: 3,
            spacing: 4.0,         // 进一步增加间距，避免重叠
            maxVisible: 50,       // 最大可见数量
            photoWidth: 1.6,      // 进一步减小照片宽度
            useGridLayout: true,  // 使用网格布局
            enableLOD: true,      // 启用LOD优化
            lodDistance: 15       // LOD距离阈值
        };
        
        this.init();
    }
    
    /**
     * 初始化
     */
    init() {
        // 从本地存储加载收藏数据
        const savedFavorites = Utils.storage.get('favorites', []);
        this.favorites = new Set(savedFavorites);
        
        // 从photos文件夹加载照片
        this.loadPhotosFromFolder();
    }
    
    /**
     * 从photos文件夹加载照片
     */
    async loadPhotosFromFolder() {
        try {
            // 加载照片列表配置文件
            const response = await fetch('photos/photos-list.json');
            if (response.ok) {
                const config = await response.json();
                const photoList = config.photos || [];
                
                if (photoList.length === 0) {
                    Utils.showToast('照片列表为空，请添加照片到photos文件夹');
                    return;
                }
                
                // 批量添加照片
                photoList.forEach(photoData => {
                    this.addPhoto(photoData);
                });
                
                Utils.showToast(`成功加载 ${photoList.length} 张照片`);
                console.log(`已加载 ${photoList.length} 张照片`);
            } else {
                console.warn('未找到photos-list.json文件');
                Utils.showToast('未找到照片配置，请运行 generate-list.py');
            }
        } catch (error) {
            console.error('加载照片失败:', error);
            Utils.showToast('加载照片失败，请检查photos文件夹和配置文件');
        }
    }
    
    /**
     * 添加照片
     */
    addPhoto(photoData) {
        const photo = {
            id: photoData.id || Utils.generateId(),
            url: photoData.url,
            title: photoData.title || '未命名照片',
            date: photoData.date || Utils.formatDate(new Date()),
            scene: photoData.scene || 'church',
            style: photoData.style || 'romantic',
            dress: photoData.dress || 'white',
            location: photoData.location || (['church', 'indoor'].includes(photoData.scene) ? 'indoor' : 'outdoor'),
            favorite: this.favorites.has(photoData.id),
            texture: null
        };
        
        this.photos.push(photo);
        this.updateGroupCounts();
        
        // 如果当前显示所有照片，则添加到场景
        if (this.currentGroup === 'all') {
            this.createPhotoMesh(photo);
        }
        
        return photo;
    }
    
    /**
     * 批量添加照片
     */
    addPhotos(photoArray) {
        photoArray.forEach(photo => this.addPhoto(photo));
        this.rebuildPhotoWall();
    }
    
    /**
     * 创建照片3D网格 - 优化版
     */
    async createPhotoMesh(photo) {
        // 限制可见照片数量，提升性能
        if (this.photoMeshes.length >= this.wallConfig.maxVisible) {
            return;
        }
        
        try {
            // 加载纹理（使用较低分辨率）
            const textureLoader = new THREE.TextureLoader();
            textureLoader.setCrossOrigin('anonymous');
            
            const texture = await new Promise((resolve, reject) => {
                textureLoader.load(
                    photo.url,
                    resolve,
                    undefined,
                    reject
                );
            });
            
            // 设置纹理优化参数
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false; // 禁用mipmap提升性能
            
            photo.texture = texture;
            
            // 计算照片比例
            const aspectRatio = texture.image.width / texture.image.height;
            const width = this.wallConfig.photoWidth;
            const height = width / aspectRatio;
            
            // 创建几何体（复用几何体提升性能）
            const geometry = new THREE.PlaneGeometry(width, height);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false // 优化渲染顺序
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = { photoId: photo.id };
            
            // 使用优化的网格布局
            const index = this.photoMeshes.length;
            this.calculateGridPosition(mesh, index, width, height);
            
            // 添加边框
            this.addPhotoBorder(mesh, width, height);
            
            this.sceneManager.getScene().add(mesh);
            this.photoMeshes.push(mesh);
            
            // 添加hover事件（使用节流优化）
            this.setupPhotoInteraction(mesh);
            
        } catch (error) {
            console.error('Failed to create photo mesh:', error);
        }
    }
    
    /**
     * 计算网格位置 - 优化版
     */
    calculateGridPosition(mesh, index, width, height) {
        if (this.wallConfig.useGridLayout) {
            // 使用螺旋形布局，更加美观
            const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // 黄金角度
            const r = this.wallConfig.spacing * Math.sqrt(index + 1);
            const theta = index * goldenAngle;
            
            mesh.position.x = r * Math.cos(theta);
            mesh.position.z = r * Math.sin(theta);
            mesh.position.y = (Math.random() - 0.5) * 2; // Y轴小幅随机
            
            // 面向相机
            mesh.lookAt(0, mesh.position.y, 0);
        } else {
            // 备用：圆形布局
            const angle = (index / Math.max(this.photoMeshes.length, 1)) * Math.PI * 2;
            const radius = this.wallConfig.radius;
            
            mesh.position.x = Math.cos(angle) * radius;
            mesh.position.z = Math.sin(angle) * radius;
            mesh.position.y = (Math.random() - 0.5) * 2;
            
            mesh.lookAt(0, mesh.position.y, 0);
        }
    }
    
    /**
     * 添加照片边框
     */
    addPhotoBorder(mesh, width, height) {
        const borderGeometry = new THREE.PlaneGeometry(width + 0.1, height + 0.1);
        const borderMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.z = -0.01;
        mesh.add(border);
    }
    
    /**
     * 设置照片交互 - 优化版
     */
    setupPhotoInteraction(mesh) {
        const onHover = Utils.throttle((isHovering) => {
            this.onPhotoHover(mesh, isHovering);
        }, 100); // 100ms节流
        
        // 鼠标悬停效果
        mesh.addEventListener('mouseenter', () => {
            onHover(true);
        });
        
        mesh.addEventListener('mouseleave', () => {
            onHover(false);
        });
        
        // 点击事件
        mesh.addEventListener('click', () => {
            this.onPhotoClick(mesh);
        });
    }
    
    /**
     * 照片悬停效果 - 优化版
     */
    onPhotoHover(mesh, isHovering) {
        if (isHovering) {
            // 放大效果（使用GSAP或手动动画）
            const targetScale = 1.15;
            mesh.scale.set(targetScale, targetScale, targetScale);
            mesh.material.emissive = new THREE.Color(0x444444);
            mesh.renderOrder = 999;
            
            // 提升z-index效果
            mesh.position.z += 0.5;
        } else {
            // 恢复原状
            mesh.scale.set(1, 1, 1);
            mesh.material.emissive = new THREE.Color(0x000000);
            mesh.renderOrder = 0;
            mesh.position.z -= 0.5;
        }
    }
    
    /**
     * LOD优化 - 根据距离调整细节
     */
    updateLOD() {
        if (!this.wallConfig.enableLOD) return;
        
        const camera = this.sceneManager.getCamera();
        const cameraPos = camera.position;
        
        this.photoMeshes.forEach(mesh => {
            const distance = cameraPos.distanceTo(mesh.position);
            
            if (distance > this.wallConfig.lodDistance) {
                // 远距离：降低透明度，减少渲染负担
                mesh.material.opacity = 0.6;
            } else {
                // 近距离：完全显示
                mesh.material.opacity = 1.0;
            }
        });
    }
    
    /**
     * 照片点击事件
     */
    onPhotoClick(mesh) {
        const photoId = mesh.userData.photoId;
        const photo = this.photos.find(p => p.id === photoId);
        
        if (photo) {
            this.showPhotoDetail(photo);
        }
    }
    
    /**
     * 显示照片详情
     */
    showPhotoDetail(photo) {
        this.selectedPhoto = photo;
        
        const modal = document.getElementById('photo-modal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalScene = document.getElementById('modal-scene');
        const modalTags = document.getElementById('modal-tags');
        const favoriteBtn = document.querySelector('.favorite-btn');
        
        modalImage.src = photo.url;
        modalTitle.textContent = photo.title;
        modalDate.textContent = photo.date;
        modalScene.textContent = this.getSceneName(photo.scene);
        modalTags.textContent = `${this.getStyleName(photo.style)} · ${this.getDressName(photo.dress)}`;
        
        // 更新收藏按钮状态
        if (this.favorites.has(photo.id)) {
            favoriteBtn.classList.add('active');
            favoriteBtn.querySelector('.heart-icon').textContent = '♥';
        } else {
            favoriteBtn.classList.remove('active');
            favoriteBtn.querySelector('.heart-icon').textContent = '♡';
        }
        
        modal.classList.add('show');
    }
    
    /**
     * 关闭照片详情
     */
    closePhotoDetail() {
        const modal = document.getElementById('photo-modal');
        modal.classList.remove('show');
        this.selectedPhoto = null;
    }
    
    /**
     * 切换到上一张照片
     */
    showPreviousPhoto() {
        if (!this.selectedPhoto) return;
        
        const currentIndex = this.photos.findIndex(p => p.id === this.selectedPhoto.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.photos.length - 1;
        this.showPhotoDetail(this.photos[prevIndex]);
    }
    
    /**
     * 切换到下一张照片
     */
    showNextPhoto() {
        if (!this.selectedPhoto) return;
        
        const currentIndex = this.photos.findIndex(p => p.id === this.selectedPhoto.id);
        const nextIndex = currentIndex < this.photos.length - 1 ? currentIndex + 1 : 0;
        this.showPhotoDetail(this.photos[nextIndex]);
    }
    
    /**
     * 切换收藏状态
     */
    toggleFavorite(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return;
        
        if (this.favorites.has(photoId)) {
            this.favorites.delete(photoId);
            photo.favorite = false;
            Utils.showToast('已取消收藏');
        } else {
            this.favorites.add(photoId);
            photo.favorite = true;
            Utils.showToast('已添加到收藏');
        }
        
        // 保存到本地存储
        Utils.storage.set('favorites', Array.from(this.favorites));
        
        // 更新UI
        this.updateFavoriteButton(photoId);
        this.updateGroupCounts();
    }
    
    /**
     * 更新收藏按钮显示
     */
    updateFavoriteButton(photoId) {
        const favoriteBtn = document.querySelector('.favorite-btn');
        if (this.favorites.has(photoId)) {
            favoriteBtn.classList.add('active');
            favoriteBtn.querySelector('.heart-icon').textContent = '♥';
        } else {
            favoriteBtn.classList.remove('active');
            favoriteBtn.querySelector('.heart-icon').textContent = '♡';
        }
    }
    
    /**
     * 筛选照片分组
     */
    filterByGroup(groupType) {
        this.currentGroup = groupType;
        
        // 清除现有照片网格
        this.clearPhotoMeshes();
        
        // 根据分组筛选照片
        let filteredPhotos = [];
        
        switch (groupType) {
            case 'all':
                filteredPhotos = this.photos;
                break;
            case 'favorites':
                filteredPhotos = this.photos.filter(p => this.favorites.has(p.id));
                break;
            case 'style-romantic':
                filteredPhotos = this.photos.filter(p => p.style === 'romantic');
                break;
            case 'style-elegant':
                filteredPhotos = this.photos.filter(p => p.style === 'elegant');
                break;
            case 'location-indoor':
                filteredPhotos = this.photos.filter(p => p.location === 'indoor');
                break;
            case 'location-outdoor':
                filteredPhotos = this.photos.filter(p => p.location === 'outdoor');
                break;
            case 'dress-white':
                filteredPhotos = this.photos.filter(p => p.dress === 'white');
                break;
            case 'dress-colorful':
                filteredPhotos = this.photos.filter(p => p.dress === 'colorful');
                break;
            default:
                filteredPhotos = this.photos;
        }
        
        // 重建照片墙
        filteredPhotos.forEach(photo => {
            this.createPhotoMesh(photo);
        });
        
        Utils.showToast(`显示: ${this.getGroupName(groupType)}`);
    }
    
    /**
     * 清除所有照片网格
     */
    clearPhotoMeshes() {
        this.photoMeshes.forEach(mesh => {
            this.sceneManager.getScene().remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        this.photoMeshes = [];
    }
    
    /**
     * 重建照片墙
     */
    rebuildPhotoWall() {
        this.clearPhotoMeshes();
        this.filterByGroup(this.currentGroup);
    }
    
    /**
     * 更新分组计数
     */
    updateGroupCounts() {
        const groups = {
            'all': this.photos.length,
            'favorites': this.photos.filter(p => this.favorites.has(p.id)).length,
            'style-romantic': this.photos.filter(p => p.style === 'romantic').length,
            'style-elegant': this.photos.filter(p => p.style === 'elegant').length,
            'location-indoor': this.photos.filter(p => p.location === 'indoor').length,
            'location-outdoor': this.photos.filter(p => p.location === 'outdoor').length,
            'dress-white': this.photos.filter(p => p.dress === 'white').length,
            'dress-colorful': this.photos.filter(p => p.dress === 'colorful').length
        };
        
        // 更新UI
        document.querySelectorAll('.group-item').forEach(item => {
            const group = item.dataset.group;
            const countElement = item.querySelector('.group-count');
            if (countElement && groups[group] !== undefined) {
                countElement.textContent = groups[group];
            }
        });
    }
    
    /**
     * 获取分组名称
     */
    getGroupName(groupType) {
        const names = {
            'all': '全部照片',
            'favorites': '收藏',
            'style-romantic': '浪漫风格',
            'style-elegant': '优雅风格',
            'location-indoor': '室内场景',
            'location-outdoor': '户外场景',
            'dress-white': '白色婚纱',
            'dress-colorful': '彩色礼服'
        };
        return names[groupType] || '未知分组';
    }
    
    /**
     * 获取场景名称
     */
    getSceneName(sceneType) {
        const scenes = {
            'church': '婚礼教堂',
            'garden': '花海草坪',
            'indoor': '轻奢室内',
            'seaside': '海边落日'
        };
        return scenes[sceneType] || sceneType;
    }
    
    /**
     * 获取风格名称
     */
    getStyleName(styleType) {
        const styles = {
            'romantic': '浪漫',
            'elegant': '优雅'
        };
        return styles[styleType] || styleType;
    }
    
    /**
     * 获取服装名称
     */
    getDressName(dressType) {
        const dresses = {
            'white': '白色婚纱',
            'colorful': '彩色礼服'
        };
        return dresses[dressType] || dressType;
    }
    
    /**
     * 获取所有照片
     */
    getPhotos() {
        return this.photos;
    }
    
    /**
     * 获取收藏的照片
     */
    getFavorites() {
        return this.photos.filter(p => this.favorites.has(p.id));
    }
}

// 导出照片管理器
window.PhotoManager = PhotoManager;
