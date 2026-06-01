/**
 * 上传处理器
 * 负责图片上传、校验、进度展示等功能
 */

class UploadHandler {
    constructor(photoManager) {
        this.photoManager = photoManager;
        this.selectedFiles = [];
        this.maxFiles = 50;
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        
        this.init();
    }
    
    /**
     * 初始化上传功能
     */
    init() {
        this.bindEvents();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        
        // 点击选择文件
        document.querySelector('[data-action="select-files"]').addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });
        
        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            this.handleFileSelect(e.dataTransfer.files);
        });
        
        // 取消上传
        document.querySelector('[data-action="cancel-upload"]').addEventListener('click', () => {
            this.cancelUpload();
        });
        
        // 确认上传
        document.querySelector('[data-action="confirm-upload"]').addEventListener('click', () => {
            this.confirmUpload();
        });
        
        // 关闭上传对话框
        document.querySelector('[data-action="close-upload"]').addEventListener('click', () => {
            if (window.navigationController) {
                window.navigationController.closeUploadDialog();
            }
        });
    }
    
    /**
     * 处理文件选择
     */
    handleFileSelect(files) {
        const fileArray = Array.from(files);
        
        // 校验文件
        const validFiles = this.validateFiles(fileArray);
        
        if (validFiles.length === 0) {
            Utils.showToast('没有有效的图片文件');
            return;
        }
        
        this.selectedFiles = validFiles;
        this.showPreview();
        
        // 启用确认按钮
        document.querySelector('[data-action="confirm-upload"]').disabled = false;
        
        Utils.showToast(`已选择 ${validFiles.length} 个文件`);
    }
    
    /**
     * 校验文件
     */
    validateFiles(files) {
        const validFiles = [];
        
        // 检查数量限制
        if (files.length > this.maxFiles) {
            Utils.showToast(`最多只能上传 ${this.maxFiles} 个文件`);
            return validFiles;
        }
        
        files.forEach(file => {
            // 检查文件类型
            if (!this.allowedTypes.includes(file.type)) {
                Utils.showToast(`${file.name} 格式不支持`);
                return;
            }
            
            // 检查文件大小
            if (file.size > this.maxFileSize) {
                Utils.showToast(`${file.name} 超过10MB限制`);
                return;
            }
            
            validFiles.push(file);
        });
        
        return validFiles;
    }
    
    /**
     * 显示预览
     */
    showPreview() {
        const previewContainer = document.getElementById('upload-preview');
        previewContainer.innerHTML = '';
        
        this.selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'preview-remove';
                removeBtn.innerHTML = '×';
                removeBtn.addEventListener('click', () => {
                    this.removeFile(index);
                });
                
                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                previewContainer.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    /**
     * 移除文件
     */
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.showPreview();
        
        if (this.selectedFiles.length === 0) {
            document.querySelector('[data-action="confirm-upload"]').disabled = true;
        }
    }
    
    /**
     * 确认上传
     */
    async confirmUpload() {
        if (this.selectedFiles.length === 0) {
            Utils.showToast('请先选择文件');
            return;
        }
        
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const uploadProgress = document.getElementById('upload-progress');
        
        uploadProgress.style.display = 'block';
        
        const photos = [];
        
        for (let i = 0; i < this.selectedFiles.length; i++) {
            const file = this.selectedFiles[i];
            
            try {
                // 读取文件为DataURL
                const dataUrl = await this.readFileAsDataURL(file);
                
                // 创建照片对象
                const photo = {
                    url: dataUrl,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    date: Utils.formatDate(new Date()),
                    scene: 'church',
                    style: 'romantic',
                    dress: 'white'
                };
                
                photos.push(photo);
                
                // 更新进度
                const progress = ((i + 1) / this.selectedFiles.length) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `上传中... ${Math.round(progress)}%`;
                
            } catch (error) {
                console.error('Failed to read file:', error);
            }
        }
        
        // 添加到照片管理器
        this.photoManager.addPhotos(photos);
        
        // 提示用户更新配置文件
        Utils.showToast(`成功上传 ${photos.length} 张照片`);
        Utils.showToast('请运行 generate-list.py 更新照片列表');
        
        // 延迟关闭对话框
        setTimeout(() => {
            this.resetUpload();
            
            if (window.navigationController) {
                window.navigationController.closeUploadDialog();
            }
        }, 1000);
    }
    
    /**
     * 读取文件为DataURL
     */
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }
    
    /**
     * 取消上传
     */
    cancelUpload() {
        this.resetUpload();
        
        if (window.navigationController) {
            window.navigationController.closeUploadDialog();
        }
        
        Utils.showToast('已取消上传');
    }
    
    /**
     * 重置上传状态
     */
    resetUpload() {
        this.selectedFiles = [];
        document.getElementById('upload-preview').innerHTML = '';
        document.getElementById('upload-progress').style.display = 'none';
        document.querySelector('.progress-fill').style.width = '0%';
        document.querySelector('[data-action="confirm-upload"]').disabled = true;
        document.getElementById('file-input').value = '';
    }
}

// 导出上传处理器
window.UploadHandler = UploadHandler;
