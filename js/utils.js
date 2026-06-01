/**
 * 工具函数库
 * 提供通用的辅助功能
 */

// 显示提示信息
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 格式化日期
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 生成唯一ID
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 检测设备类型
function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
        return 'mobile';
    }
    return 'desktop';
}

// 判断是否为移动设备
function isMobile() {
    return getDeviceType() === 'mobile';
}

// 加载图片并返回Promise
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
        img.src = src;
    });
}

// 批量加载图片
async function loadImages(sources) {
    const promises = sources.map(src => loadImage(src));
    return Promise.all(promises);
}

// 计算两点距离
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// 线性插值
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// 限制数值范围
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// 随机数生成
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// 随机整数生成
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 从数组中随机选择
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 深拷贝对象
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 本地存储封装
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
};

// 动画缓动函数
const easing = {
    // 线性
    linear: t => t,
    
    // 二次方缓入
    easeInQuad: t => t * t,
    
    // 二次方缓出
    easeOutQuad: t => t * (2 - t),
    
    // 三次方缓入
    easeInCubic: t => t * t * t,
    
    // 三次方缓出
    easeOutCubic: t => (--t) * t * t + 1,
    
    // 正弦缓入
    easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
    
    // 正弦缓出
    easeOutSine: t => Math.sin(t * Math.PI / 2),
    
    // 弹性缓出
    easeOutElastic: t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
};

// 导出工具函数
window.Utils = {
    showToast,
    formatDate,
    generateId,
    debounce,
    throttle,
    getDeviceType,
    isMobile,
    loadImage,
    loadImages,
    distance,
    lerp,
    clamp,
    random,
    randomInt,
    randomChoice,
    deepClone,
    storage,
    easing
};
