# 部署指南

## 🚀 快速部署方案

### 方案一：直接使用（最简单）

**适合场景**：本地预览、个人使用

1. **Windows用户**
   ```
   双击运行 start.bat
   浏览器访问 http://localhost:8080
   ```

2. **直接打开**
   ```
   直接在浏览器中打开 index.html 文件
   注意：部分功能可能受限于file://协议
   ```

---

### 方案二：GitHub Pages（推荐）

**适合场景**：公开分享、免费托管

#### 步骤：

1. **创建GitHub仓库**
   ```bash
   # 初始化git
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入仓库 Settings
   - 找到 Pages 选项
   - Source 选择 main branch
   - 点击 Save

4. **访问应用**
   ```
   https://你的用户名.github.io/仓库名/
   ```

---

### 方案三：Vercel部署

**适合场景**：专业部署、自定义域名

#### 步骤：

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署项目**
   ```bash
   cd G:\Work-G\qiu_li_wedding
   vercel
   ```

3. **按提示操作**
   - 登录Vercel账户
   - 确认项目配置
   - 等待部署完成

4. **访问应用**
   ```
   获得类似 https://xxx.vercel.app 的网址
   ```

---

### 方案四：Netlify部署

**适合场景**：拖拽部署、持续集成

#### 方法A：拖拽部署（最简单）

1. 访问 https://app.netlify.com/drop
2. 将整个项目文件夹拖拽到页面
3. 等待上传完成
4. 获得访问链接

#### 方法B：Git部署

1. 将代码推送到GitHub/GitLab
2. 在Netlify点击 "New site from Git"
3. 选择你的代码仓库
4. 点击 "Deploy site"

---

### 方案五：云服务器部署

**适合场景**：企业级应用、完全控制

#### Nginx配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/wedding-app;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 部署步骤：

```bash
# 1. 上传文件到服务器
scp -r G:\Work-G\qiu_li_wedding user@server:/var/www/wedding-app

# 2. 设置权限
sudo chown -R www-data:www-data /var/www/wedding-app
sudo chmod -R 755 /var/www/wedding-app

# 3. 重启Nginx
sudo systemctl restart nginx
```

---

## 🔧 部署前检查清单

### ✅ 必检项目

- [ ] 所有文件已上传
- [ ] index.html 可正常访问
- [ ] CSS文件路径正确
- [ ] JavaScript文件路径正确
- [ ] Three.js CDN链接可访问
- [ ] 图片资源可加载

### ✅ 性能优化

- [ ] 启用gzip压缩
- [ ] 配置浏览器缓存
- [ ] 启用HTTPS
- [ ] 优化图片大小
- [ ] 使用CDN加速

### ✅ 兼容性测试

- [ ] Chrome浏览器测试
- [ ] Firefox浏览器测试
- [ ] Safari浏览器测试
- [ ] Edge浏览器测试
- [ ] 移动端浏览器测试

---

## 🌐 域名配置（可选）

### 自定义域名设置

#### GitHub Pages：
1. 在仓库 Settings > Pages 中添加自定义域名
2. 在DNS服务商添加CNAME记录
   ```
   CNAME your-domain.com -> username.github.io
   ```

#### Vercel：
1. 在项目设置中添加域名
2. 按提示配置DNS记录
3. 等待SSL证书生成

#### Netlify：
1. 在Site settings > Domain management中添加域名
2. 配置DNS记录
3. 启用HTTPS

---

## 📊 监控与分析（可选）

### 添加Google Analytics

在 `index.html` 的 `<head>` 标签中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔒 HTTPS配置

### 为什么需要HTTPS？
- 保护用户隐私
- 提升安全性
- 某些功能需要（如Service Worker）
- SEO友好

### 免费SSL证书方案

#### Let's Encrypt（云服务器）：
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Cloudflare（CDN）：
1. 注册Cloudflare账号
2. 添加网站
3. 修改DNS服务器
4. 自动启用HTTPS

---

## 🎯 部署验证

### 部署后测试步骤：

1. **基础功能测试**
   ```
   ✓ 页面正常加载
   ✓ 3D场景显示正常
   ✓ 照片可以上传
   ✓ 场景可以切换
   ✓ 导航按钮可用
   ```

2. **性能测试**
   ```
   ✓ 首屏加载时间 < 3秒
   ✓ 滚动流畅无卡顿
   ✓ 无明显内存泄漏
   ```

3. **兼容性测试**
   ```
   ✓ 桌面浏览器正常
   ✓ 移动浏览器正常
   ✓ 不同分辨率适配
   ```

---

## 📱 PWA支持（进阶）

如需支持离线访问，可添加Service Worker：

### 1. 创建 sw.js
```javascript
const CACHE_NAME = 'wedding-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 2. 在 index.html 中注册
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

---

## 🆘 常见问题

### Q1: 部署后图片无法加载？
**A**: 检查图片路径是否使用相对路径，确保文件已上传。

### Q2: Three.js库加载失败？
**A**: 检查网络连接，CDN可能被墙，可下载到本地引用。

### Q3: 移动端访问很慢？
**A**: 启用gzip压缩，优化图片大小，使用CDN加速。

### Q4: 自定义域名不生效？
**A**: DNS解析可能需要24-48小时，耐心等待。

### Q5: HTTPS证书错误？
**A**: 确保证书正确配置，检查过期时间。

---

## 📞 获取帮助

部署遇到问题？

1. 查看浏览器控制台错误信息
2. 检查服务器日志
3. 参考各平台官方文档
4. 搜索相关错误信息

---

## ✨ 部署完成！

恭喜！您的3D婚纱照片浏览应用已成功部署！

现在可以：
- 分享给亲朋好友
- 在婚礼现场展示
- 作为永久纪念保存

**祝幸福美满！** 💍💕
