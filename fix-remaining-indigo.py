#!/usr/bin/env python3
"""
Fix remaining indigo/blue references that were missed.
"""
import os
import re
from pathlib import Path

SKIP_FILES = [
    'src/components/landing-page-v2.tsx',
    'src/components/landing-page.tsx',
    'src/app/page.tsx',
]

def should_skip(filepath):
    return any(skip in filepath for skip in SKIP_FILES)

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False

    original = content

    # More aggressive replacements
    replacements = [
        # Hover borders
        ('hover:border-indigo-700', 'hover:border-[#0070A8]'),
        ('hover:border-indigo-600', 'hover:border-[#00A1E0]'),
        ('hover:border-indigo-500', 'hover:border-[#00A1E0]'),

        # More specific cases
        ('border-indigo-200', 'border-[#80CFED]'),
        ('border-indigo-300', 'border-[#80CFED]'),
        ('bg-indigo-200', 'bg-[#80CFED]'),

        # Text colors we might have missed
        ('text-indigo-800', 'text-[#005A7A]'),
        ('text-indigo-900', 'text-[#005A7A]'),

        # From/to in gradients
        ('from-indigo-600', 'from-[#00A1E0]'),
        ('to-indigo-600', 'to-[#00A1E0]'),
        ('from-indigo-500', 'from-[#00A1E0]'),
        ('to-indigo-500', 'to-[#00A1E0]'),

        # Ring colors
        ('ring-offset-indigo-600', 'ring-offset-[#00A1E0]'),

        # Divide colors (for borders between elements)
        ('divide-indigo-200', 'divide-[#80CFED]'),
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    changed = 0
    for filepath in Path('src').rglob('*.tsx'):
        filepath_str = str(filepath)
        if should_skip(filepath_str):
            continue
        if fix_file(filepath_str):
            changed += 1
            print(f"✅ {filepath_str}")

    print(f"\n✨ Fixed {changed} more files")

if __name__ == '__main__':
    main()
