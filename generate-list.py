#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
照片列表生成脚本
扫描photos文件夹，自动生成photos-list.json配置文件
"""

import os
import json
from datetime import datetime

def generate_photo_list():
    """生成照片列表配置文件"""
    
    photos_dir = 'photos'
    output_file = os.path.join(photos_dir, 'photos-list.json')
    
    # 支持的照片格式
    supported_formats = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    
    # 收集所有照片文件
    photo_files = []
    
    if not os.path.exists(photos_dir):
        print(f"错误: {photos_dir} 文件夹不存在")
        return
    
    for filename in sorted(os.listdir(photos_dir)):
        file_ext = os.path.splitext(filename)[1].lower()
        print(f"正在处理文件: {filename}")
        if file_ext in supported_formats and filename != 'photos-list.json':
            filepath = os.path.join(photos_dir, filename)
            
            # 获取文件修改时间
            mod_time = os.path.getmtime(filepath)
            date_str = datetime.fromtimestamp(mod_time).strftime('%Y-%m-%d')
            
            # 生成照片信息
            photo_info = {
                "id": f"photo_{len(photo_files) + 1:03d}",
                "url": f"photos/{filename}",
                "title": os.path.splitext(filename)[0],  # 使用文件名作为标题
                "date": date_str,
                "scene": "default",
                "style": "romantic",
                "dress": "white"
            }
            
            photo_files.append(photo_info)
    
    # 创建配置文件
    config = {
        "description": "照片列表配置文件 - 由generate-list.py自动生成",
        "generated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "total_photos": len(photo_files),
        "photos": photo_files
    }
    
    # 写入JSON文件
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    
    print(f"✓ 成功生成照片列表!")
    print(f"  照片数量: {len(photo_files)}")
    print(f"  配置文件: {output_file}")
    
    if len(photo_files) == 0:
        print(f"\n提示: 在 {photos_dir} 文件夹中未找到照片文件")
        print(f"支持的格式: {', '.join(supported_formats)}")

if __name__ == '__main__':
    generate_photo_list()
