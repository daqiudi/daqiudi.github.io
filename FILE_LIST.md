# 项目文件清单

## 📁 完整文件结构

```
qiu_li_wedding/
│
├── 📄 index.html                    # 主HTML文件 (13.3KB)
│   └── 包含完整的页面结构和所有UI组件
│
├── 📂 css/                          # 样式文件夹
│   ├── style.css                    # 全局基础样式 (3.0KB)
│   ├── navigation.css               # 导航栏样式 (2.8KB)
│   ├── photo-wall.css               # 照片墙和浮窗样式 (7.2KB)
│   ├── upload.css                   # 上传对话框样式 (4.8KB)
│   └── settings.css                 # 设置面板样式 (3.5KB)
│
├── 📂 js/                           # JavaScript文件夹
│   ├── main.js                      # 主程序入口 (6.1KB)
│   ├── utils.js                     # 工具函数库 (4.7KB)
│   ├── scene-manager.js             # 场景管理器 (7.6KB)
│   ├── photo-manager.js             # 照片管理器 (14.8KB)
│   ├── particle-system.js           # 粒子系统 (7.6KB)
│   ├── navigation.js                # 导航控制器 (7.2KB)
│   ├── upload-handler.js            # 上传处理器 (8.1KB)
│   ├── settings-manager.js          # 设置管理器 (7.1KB)
│   └── playback-controller.js       # 播放控制器 (11.0KB)
│
├── 📂 photos/                       # 示例照片文件夹（可选）
│   └── [45个示例照片文件]
│
├── 📄 start.bat                     # Windows启动脚本 (1.3KB)
│
├── 📄 README.md                     # 项目说明文档 (6.1KB)
├── 📄 QUICK_START.md                # 快速开始指南 (3.5KB)
├── 📄 PROJECT_SUMMARY.md            # 项目开发总结 (9.8KB)
├── 📄 DEPLOY.md                     # 部署指南 (新增)
└── 📄 FILE_LIST.md                  # 本文件
```

---

## 📊 文件统计

### 核心代码文件
| 类型 | 数量 | 总大小 |
|------|------|--------|
| HTML | 1 | ~13 KB |
| CSS | 5 | ~21 KB |
| JavaScript | 9 | ~74 KB |
| **合计** | **15** | **~108 KB** |

### 文档文件
| 文件名 | 大小 | 用途 |
|--------|------|------|
| README.md | 6.1KB | 项目总体说明 |
| QUICK_START.md | 3.5KB | 快速上手指南 |
| PROJECT_SUMMARY.md | 9.8KB | 开发总结文档 |
| DEPLOY.md | ~8KB | 部署指南 |
| FILE_LIST.md | 本文件 | 文件清单 |

### 辅助文件
| 文件名 | 用途 |
|--------|------|
| start.bat | Windows一键启动脚本 |
| main.py | Python主文件（占位符） |

---

## 🔍 文件详细说明

### HTML文件

#### `index.html`
**功能**: 应用主页面
**包含**:
- 加载界面
- Three.js画布容器
- 主题标题显示区
- 3D悬浮导航栏
- 照片分组侧边栏
- 照片详情浮窗
- 上传对话框
- 设置面板
- 播放控制栏
- Toast提示组件
- 所有JavaScript文件引用

**关键依赖**:
```html
<!-- Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
```

---

### CSS文件

#### `css/style.css`
**功能**: 全局基础样式
**包含**:
- CSS重置
- body样式
- 加载界面样式
- 主题标题样式
- Toast提示样式
- 基础动画定义
- 响应式媒体查询

#### `css/navigation.css`
**功能**: 导航栏样式
**包含**:
- 主导航栏布局
- 导航按钮样式
- Hover动效
- 品牌图标旋转动画
- 移动端适配

#### `css/photo-wall.css`
**功能**: 照片墙相关样式
**包含**:
- 照片分组侧边栏
- 分组列表项样式
- 照片详情浮窗
- 模态框动画
- 播放控制栏
- 收藏按钮样式
- 导航箭头样式

#### `css/upload.css`
**功能**: 上传功能样式
**包含**:
- 上传对话框布局
- 拖拽区域样式
- 文件预览网格
- 进度条样式
- 删除按钮
- 对话框底部按钮

#### `css/settings.css`
**功能**: 设置面板样式
**包含**:
- 侧滑面板布局
- 表单元素样式
- 滑块控件
- 颜色选择器
- 开关按钮
- 响应式适配

---

### JavaScript文件

#### `js/main.js`
**功能**: 应用初始化和协调
**职责**:
- 初始化所有模块
- 启动渲染循环
- 处理设备优化
- 管理加载进度
- 绑定全局事件
- 预加载资源

**导出**: `window.WeddingApp`

#### `js/utils.js`
**功能**: 通用工具函数库
**包含**:
- 提示信息显示 (`showToast`)
- 日期格式化 (`formatDate`)
- ID生成 (`generateId`)
- 防抖节流 (`debounce`, `throttle`)
- 设备检测 (`isMobile`)
- 图片加载 (`loadImage`, `loadImages`)
- 数学工具 (`lerp`, `clamp`, `random`)
- 本地存储封装 (`storage`)
- 缓动函数 (`easing`)

**导出**: `window.Utils`

#### `js/scene-manager.js`
**功能**: Three.js场景管理
**职责**:
- 创建和管理Three.js场景
- 配置相机和渲染器
- 设置光照系统
- 实现4大场景切换
- 处理窗口大小调整
- 提供渲染接口

**场景配置**:
- church (婚礼教堂)
- garden (花海草坪)
- indoor (轻奢室内)
- seaside (海边落日)

**导出**: `window.SceneManager`

#### `js/photo-manager.js`
**功能**: 照片数据和管理
**职责**:
- 照片数据存储
- 照片分组筛选
- 3D照片墙渲染
- 照片交互处理
- 收藏功能管理
- 详情浮窗显示
- 分组计数更新

**分组类型**:
- all (全部)
- favorites (收藏)
- style-romantic/elegant (风格)
- location-indoor/outdoor (位置)
- dress-white/colorful (服装)

**导出**: `window.PhotoManager`

#### `js/particle-system.js`
**功能**: 粒子特效系统
**职责**:
- 创建场景粒子效果
- 更新粒子动画
- 管理粒子强度
- 场景切换同步

**粒子类型**:
- FallingPetals (飘落花瓣)
- FloatingPetals (漂浮花瓣)
- Sparkles (星光闪烁)
- Mist (烟雾柔雾)

**导出**: `window.ParticleSystem`

#### `js/navigation.js`
**功能**: 导航和交互控制
**职责**:
- 绑定所有UI事件
- 场景切换处理
- 分组筛选处理
- 浏览模式切换
- 全屏控制
- 键盘快捷键
- 浮窗控制

**导出**: `window.NavigationController`

#### `js/upload-handler.js`
**功能**: 文件上传处理
**职责**:
- 文件选择和验证
- 拖拽上传支持
- 文件预览显示
- 批量上传处理
- 进度条更新
- DataURL转换

**限制**:
- 最多50个文件
- 支持JPG/PNG/WEBP
- 单文件最大10MB

**导出**: `window.UploadHandler`

#### `js/settings-manager.js`
**功能**: 应用设置管理
**职责**:
- 加载和保存设置
- 主题标题编辑
- 实时预览更新
- 特效强度调节
- 渲染质量控制
- LocalStorage持久化

**设置项**:
- 新郎新娘姓名
- 副标题
- 字体大小和颜色
- 粒子强度
- 背景音乐
- 渲染质量
- 旋转速度

**导出**: `window.SettingsManager`

#### `js/playback-controller.js`
**功能**: 照片播放控制
**职责**:
- 自动轮播功能
- 播放/暂停控制
- 上一张/下一张
- 转场动画实现
- 进度显示更新
- 全屏展示创建

**转场效果**:
- fade (淡入淡出)
- blur (模糊转场)
- flash (闪白)
- zoom (缩放)

**导出**: `window.PlaybackController`

---

## 🎯 模块依赖关系

```
main.js (主程序)
  ├─→ SceneManager (场景管理)
  ├─→ PhotoManager (照片管理)
  │     └─→ Utils (工具函数)
  ├─→ ParticleSystem (粒子系统)
  ├─→ NavigationController (导航控制)
  │     ├─→ SceneManager
  │     └─→ PhotoManager
  ├─→ UploadHandler (上传处理)
  │     └─→ PhotoManager
  ├─→ SettingsManager (设置管理)
  │     ├─→ SceneManager
  │     └─→ PhotoManager
  └─→ PlaybackController (播放控制)
        └─→ PhotoManager
```

---

## 📦 外部依赖

### CDN资源
1. **Three.js r128**
   - URL: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
   - 用途: 3D图形渲染引擎

2. **OrbitControls**
   - URL: `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`
   - 用途: 相机轨道控制

### 浏览器API
- File API (文件上传)
- LocalStorage (数据持久化)
- Fullscreen API (全屏模式)
- FileReader (文件读取)
- requestAnimationFrame (动画循环)

---

## 🔧 开发建议

### 修改样式
- 全局样式 → `css/style.css`
- 导航样式 → `css/navigation.css`
- 照片墙样式 → `css/photo-wall.css`
- 上传样式 → `css/upload.css`
- 设置样式 → `css/settings.css`

### 修改功能
- 场景配置 → `js/scene-manager.js`
- 照片逻辑 → `js/photo-manager.js`
- 粒子效果 → `js/particle-system.js`
- 交互控制 → `js/navigation.js`
- 上传功能 → `js/upload-handler.js`
- 设置功能 → `js/settings-manager.js`
- 播放功能 → `js/playback-controller.js`

### 添加新功能
1. 在 `js/` 目录创建新模块
2. 在 `index.html` 中引入新文件
3. 在 `main.js` 中初始化新模块
4. 在 `navigation.js` 中绑定事件

---

## ✅ 完整性检查

部署前请确认以下文件都存在：

- [ ] index.html
- [ ] css/style.css
- [ ] css/navigation.css
- [ ] css/photo-wall.css
- [ ] css/upload.css
- [ ] css/settings.css
- [ ] js/main.js
- [ ] js/utils.js
- [ ] js/scene-manager.js
- [ ] js/photo-manager.js
- [ ] js/particle-system.js
- [ ] js/navigation.js
- [ ] js/upload-handler.js
- [ ] js/settings-manager.js
- [ ] js/playback-controller.js

---

## 📝 版本信息

- **项目名称**: 3D婚纱照片浏览网页应用
- **版本**: 1.0.0
- **完成时间**: 2026年5月
- **总文件数**: 20个（不含示例照片）
- **总代码量**: 约4,000行

---

**所有文件已准备就绪，可以开始部署！** 🚀
