import os
from PIL import Image

# ===================== 配置区（可根据需要调整）=====================
# 照片文件夹路径
PHOTO_FOLDER = "photos"
# 单张图片尺寸（宽、高），仅作为最大尺寸限制
IMG_W = 150
IMG_H = 150
# 图片之间的间距，减小间距使排列更紧密
PADDING = 1
# 背景颜色（白色）
BG_COLOR = (255, 255, 255)
# 保存路径
OUTPUT_PATH = "heart_photo_collage.jpg"
# =================================================================

# 优化后的爱心点阵布局，更加规整对称（从上到下的行，每行的列数）
heart_grid = [
    [0, 0, 1, 1, 0, 1, 1, 0, 0],      # 第1行：顶部两个凸起
    [0, 1, 1, 1, 1, 1, 1, 1, 0],      # 第2行
    [1, 1, 1, 1, 1, 1, 1, 1, 1],      # 第3行：最宽
    [1, 1, 1, 1, 1, 1, 1, 1, 1],      # 第4行
    [1, 1, 1, 1, 1, 1, 1, 1, 1],      # 第5行
    [1, 1, 1, 1, 1, 1, 1, 1, 1],      # 第6行：保持宽度
    [0, 1, 1, 1, 1, 1, 1, 1, 0],      # 第7行：开始收缩
    [0, 0, 1, 1, 1, 1, 1, 0, 0],      # 第8行
    [0, 0, 0, 1, 1, 1, 0, 0, 0],      # 第9行
    [0, 0, 0, 0, 1, 0, 0, 0, 0]       # 第10行：底部尖端
]

def get_all_images(folder):
    """读取文件夹里所有图片文件"""
    valid_exts = (".jpg", ".jpeg", ".png", ".bmp")
    images = []
    for filename in os.listdir(folder):
        if filename.lower().endswith(valid_exts):
            images.append(os.path.join(folder, filename))
    return images

def create_heart_collage():
    # 1. 获取所有图片
    img_paths = get_all_images(PHOTO_FOLDER)
    if not img_paths:
        print(f"❌ 错误：文件夹 '{PHOTO_FOLDER}' 中没有找到图片！")
        return

    print(f"✅ 共找到 {len(img_paths)} 张图片")

    # 2. 计算需要的照片数量
    total_photos_needed = sum(sum(row) for row in heart_grid)
    print(f"📊 爱心布局需要 {total_photos_needed} 张照片")
    
    if len(img_paths) < total_photos_needed:
        print(f"️  照片数量不足，将循环使用照片（共{len(img_paths)}张，需要{total_photos_needed}张）")
    elif len(img_paths) > total_photos_needed:
        print(f"ℹ️  照片数量充足，将使用前 {total_photos_needed} 张照片")

    # 3. 计算画布尺寸
    max_cols = max(len(row) for row in heart_grid)
    canvas_width = max_cols * (IMG_W + PADDING)
    canvas_height = len(heart_grid) * (IMG_H + PADDING)

    # 4. 创建空白画布
    canvas = Image.new("RGB", (canvas_width, canvas_height), BG_COLOR)

    # 5. 循环摆放图片到爱心点位
    img_index = 0
    photos_used = 0
    for y, row in enumerate(heart_grid):
        for x, is_place in enumerate(row):
            if is_place:
                # 如果照片数量超过需要的数量，只使用前N张
                if img_index >= total_photos_needed:
                    break
                    
                # 图片循环使用，避免照片数不足报错
                img_path = img_paths[img_index % len(img_paths)]
                try:
                    img = Image.open(img_path).convert("RGB")
                    # 保持原始宽高比缩放，避免人物变形
                    img.thumbnail((IMG_W, IMG_H), Image.Resampling.LANCZOS)
                    # 计算位置（居中放置）
                    pos_x = x * (IMG_W + PADDING) + (IMG_W - img.width) // 2
                    pos_y = y * (IMG_H + PADDING) + (IMG_H - img.height) // 2
                    canvas.paste(img, (pos_x, pos_y))
                    img_index += 1
                    photos_used += 1
                except Exception as e:
                    print(f"️ 图片加载失败: {img_path}, 错误: {e}")

    print(f" 实际使用 {photos_used} 张照片完成爱心拼图")

    # 6. 保存并显示结果
    canvas.save(OUTPUT_PATH, quality=95)
    print(f"🎉 爱心拼图已生成！保存为: {OUTPUT_PATH}")
    canvas.show()

if __name__ == "__main__":
    create_heart_collage()