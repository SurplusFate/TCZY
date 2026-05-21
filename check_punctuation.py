#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查并修复中文标点符号规范的脚本
"""

import os
import re
import glob


def fix_punctuation(text):
    """
    修复中文标点符号
    """
    # 替换半角标点为全角标点（适用于中文语境）
    # 但要注意保留代码块、链接、特殊格式中的标点
    
    # 先保存代码块
    code_blocks = []
    def save_code(match):
        code_blocks.append(match.group(0))
        return f'__CODE_BLOCK_{len(code_blocks)-1}__'
    
    # 保存行内代码
    text = re.sub(r'`[^`]+`', save_code, text)
    
    # 保存链接
    links = []
    def save_link(match):
        links.append(match.group(0))
        return f'__LINK_{len(links)-1}__'
    
    text = re.sub(r'\[[^\]]+\]\([^)]+\)', save_link, text)
    
    # 保存HTML标签
    html_tags = []
    def save_html(match):
        html_tags.append(match.group(0))
        return f'__HTML_{len(html_tags)-1}__'
    
    text = re.sub(r'<[^>]+>', save_html, text)
    
    # 现在开始修复标点
    
    # 半角句号 → 全角句号（但要排除数字中的小数点）
    # 这个比较复杂，暂时不处理，因为小数点很难区分
    
    # 半角逗号 → 全角逗号（不在数字中）
    text = re.sub(r'(?<![0-9]),(?![0-9])', '，', text)
    
    # 半角问号 → 全角问号
    text = re.sub(r'\?', '？', text)
    
    # 半角感叹号 → 全角感叹号
    text = re.sub(r'!', '！', text)
    
    # 半角冒号 → 全角冒号
    text = re.sub(r':', '：', text)
    
    # 半角分号 → 全角分号
    text = re.sub(r';', '；', text)
    
    # 半角左括号 → 全角左括号
    text = re.sub(r'\(', '（', text)
    
    # 半角右括号 → 全角右括号
    text = re.sub(r'\)', '）', text)
    
    # 半角引号 → 全角引号（这个比较复杂，暂时不处理）
    
    # 现在恢复保存的内容
    for i, link in enumerate(links):
        text = text.replace(f'__LINK_{i}__', link)
    
    for i, code in enumerate(code_blocks):
        text = text.replace(f'__CODE_BLOCK_{i}__', code)
    
    for i, tag in enumerate(html_tags):
        text = text.replace(f'__HTML_{i}__', tag)
    
    return text


def process_file(file_path):
    """
    处理单个文件
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        fixed_content = fix_punctuation(content)
        
        if original_content != fixed_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print(f'✓ 已修复: {file_path}')
            return True
        else:
            print(f'✓ 无需修复: {file_path}')
            return False
    except Exception as e:
        print(f'✗ 处理失败: {file_path} - {e}')
        return False


def main():
    """
    主函数
    """
    print('开始检查并修复中文标点符号...\n')
    
    # 获取所有Markdown文件
    md_files = glob.glob('/workspace/**/*.md', recursive=True)
    md_files = [f for f in md_files if os.path.isfile(f)]
    
    print(f'找到 {len(md_files)} 个Markdown文件\n')
    
    fixed_count = 0
    for file_path in md_files:
        if process_file(file_path):
            fixed_count += 1
    
    print(f'\n完成！共修复 {fixed_count} 个文件')


if __name__ == '__main__':
    main()
