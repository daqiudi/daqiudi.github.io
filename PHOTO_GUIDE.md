# 照片管理快速指南

## 📸 如何添加您的婚纱照片

### 步骤一：准备照片

1. **收集照片**
   - 将所有婚纱照片整理到一个文件夹
   - 建议照片尺寸：宽度1000-2000px
   - 支持格式：JPG、PNG、WEBP

2. **重命名（可选但推荐）**
   ```
   wedding_001.jpg
   wedding_002.jpg
   ceremony_001.jpg
   ...
   ```

---

### 步骤二：复制到项目

将照片复制到项目的 `photos` 文件夹：

```
qiu_li_wedding/
└── photos/
    ├── your_photo_1.jpg    ← 放入这里
    ├── your_photo_2.jpg    ← 放入这里
    ├── your_photo_3.jpg    ← 放入这里
    └── ...
```

---

### 步骤三：生成配置文件

#### Windows用户：
```bash
# 在项目根目录打开命令行
python generate-list.py
```

#### Mac/Linux用户：
```bash
cd /path/to/qiu_li_wedding
python3 generate-list.py
```

#### 成功提示：
```
✓ 成功生成照片列表!
  照片数量: 25
  配置文件: photos/photos-list.json
```

---

### 步骤四：启动应用

**方式1：使用启动脚本（推荐）**
```bash
# Windows
双击 start.bat

# 或命令行
start.bat
```

**方式2：直接打开**
```
直接在浏览器中打开 index.html
```

**方式3：本地服务器**
```bash
python -m http.server 8080
# 访问 http://localhost:8080
```

---

### 步骤五：查看照片

1. 浏览器会自动加载所有照片
2. 照片以3D螺旋形排列
3. 鼠标拖拽旋转视角
4. 滚轮缩放画面
5. 点击照片查看详情

---

## 🔄 更新照片

### 添加新照片

```bash
# 1. 复制新照片到 photos 文件夹
cp new_photos/* photos/

# 2. 重新生成配置
python generate-list.py

# 3. 刷新浏览器（F5）
```

### 删除照片

```bash
# 1. 从 photos 文件夹删除照片
rm photos/unwanted_photo.jpg

# 2. 重新生成配置
python generate-list.py

# 3. 刷新浏览器
```

---

## ⚙️ 高级用法

### 手动编辑配置文件

如果需要自定义照片信息：

1. 打开 `photos/photos-list.json`
2. 编辑照片信息：

```json
{
  "photos": [
    {
      "id": "photo_001",
      "url": "photos/wedding.jpg",
      "title": "婚礼仪式",          // 自定义标题
      "date": "2024-05-20",        // 自定义日期
      "scene": "default",
      "style": "romantic",         // romantic 或 elegant
      "dress": "white"             // white 或 colorful
    }
  ]
}
```

3. 保存文件
4. 刷新浏览器

---

### 调整照片显示数量

如果照片太多导致卡顿，可以限制显示数量：

编辑 `js/photo-manager.js`：
```javascript
this.wallConfig = {
    maxVisible: 20,  // 修改这个数字（默认30）
    // ...
};
```

---

### 调整照片间距

如果照片仍然重叠，可以增加间距：

编辑 `js/photo-manager.js`：
```javascript
this.wallConfig = {
    spacing: 4.0,  // 增加这个数字（默认3.5）
    // ...
};
```

---

## 💡 常见问题

### Q: 为什么看不到照片？
**A**: 
1. 确认照片已放入 `photos` 文件夹
2. 确认已运行 `python generate-list.py`
3. 检查生成的 `photos-list.json` 文件
4. 刷新浏览器页面

### Q: Python命令找不到？
**A**:
- 确保已安装Python 3.6+
- 下载地址：https://www.python.org/downloads/
- 安装时勾选"Add Python to PATH"

### Q: 照片顺序不对？
**A**:
- 照片按文件名排序
- 可以重命名文件调整顺序
- 或手动编辑 `photos-list.json`

### Q: 上传的照片会保存吗？
**A**:
- ❌ 通过网页上传的照片不会永久保存
- ✅ 只有放入 `photos` 文件夹的照片才会永久保存
- 💡 建议：重要照片都放入 `photos` 文件夹

### Q: 可以在手机上查看吗？
**A**:
- ✅ 可以！应用支持移动端
- 需要在同一局域网内访问
- 或使用部署方案发布到网络

---

## 🎯 最佳实践

### 照片准备
- ✅ 统一调整为合适尺寸（宽1500px左右）
- ✅ 使用JPG格式（体积小，兼容性好）
- ✅ 文件名使用英文和数字
- ✅ 按时间或场景分类命名

### 数量控制
- 🎯 最佳：15-25张照片
- ⚠️ 最多：不超过50张
- 💡 过多会影响性能

### 定期维护
- 📦 备份 `photos` 文件夹
- 📦 备份 `photos-list.json`
- 🗑️ 删除不需要的照片
- 🔄 定期重新生成配置

---

## 📊 示例工作流程

假设您有30张婚礼照片：

```bash
# 第1步：整理照片
mkdir my_wedding_photos
# 复制30张照片到这个文件夹
# 重命名为 wedding_001.jpg ~ wedding_030.jpg

# 第2步：复制到项目
cp my_wedding_photos/* qiu_li_wedding/photos/

# 第3步：生成配置
cd qiu_li_wedding
python generate-list.py

# 输出：
# ✓ 成功生成照片列表!
#   照片数量: 30
#   配置文件: photos/photos-list.json

# 第4步：启动应用
start.bat

# 第5步：在浏览器中查看
# http://localhost:8080
```

---

## 🔗 相关文档

- [README.md](README.md) - 完整功能说明
- [QUICK_START.md](QUICK_START.md) - 3分钟快速上手
- [UPDATE_NOTES.md](UPDATE_NOTES.md) - 本次更新详情
- [DEPLOY.md](DEPLOY.md) - 部署到网络

---

**祝您享受美好的婚礼回忆！** 💍💕
