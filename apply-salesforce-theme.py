#!/usr/bin/env python3
"""
Apply Salesforce Blue theme across all pages and components.
Keeps landing page unchanged.
"""
import os
import re
from pathlib import Path

# Salesforce Blue color palette
COLORS = {
    'primary': '#00A1E0',      # Main Salesforce blue
    'primary-dark': '#0070A8',  # Darker shade for hover
    'primary-light': '#E6F4F9', # Light background
    'primary-medium': '#80CFED', # Medium shade
}

# Files to skip
SKIP_FILES = [
    'src/components/landing-page-v2.tsx',
    'src/components/landing-page.tsx',
    'src/app/page.tsx',  # Home page (uses landing page component)
]

def should_skip(filepath):
    """Check if file should be skipped"""
    return any(skip in filepath for skip in SKIP_FILES)

def apply_theme_to_file(filepath):
    """Apply Salesforce theme to a single file"""
    if should_skip(filepath):
        return False

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False

    original_content = content

    # Replace Tailwind color classes with Salesforce blue equivalents
    replacements = [
        # Primary colors
        ('bg-indigo-600', 'bg-[#00A1E0]'),
        ('bg-indigo-700', 'bg-[#0070A8]'),
        ('bg-indigo-500', 'bg-[#00A1E0]'),
        ('bg-blue-600', 'bg-[#00A1E0]'),
        ('bg-blue-700', 'bg-[#0070A8]'),

        # Text colors
        ('text-indigo-600', 'text-[#00A1E0]'),
        ('text-indigo-700', 'text-[#0070A8]'),
        ('text-indigo-500', 'text-[#00A1E0]'),
        ('text-blue-600', 'text-[#00A1E0]'),
        ('text-blue-700', 'text-[#0070A8]'),

        # Border colors
        ('border-indigo-600', 'border-[#00A1E0]'),
        ('border-indigo-500', 'border-[#00A1E0]'),
        ('border-blue-600', 'border-[#00A1E0]'),

        # Light backgrounds
        ('bg-indigo-50', 'bg-[#E6F4F9]'),
        ('bg-indigo-100', 'bg-[#E6F4F9]'),
        ('bg-blue-50', 'bg-[#E6F4F9]'),

        # Hover states
        ('hover:bg-indigo-700', 'hover:bg-[#0070A8]'),
        ('hover:bg-indigo-600', 'hover:bg-[#00A1E0]'),
        ('hover:bg-blue-700', 'hover:bg-[#0070A8]'),
        ('hover:text-indigo-700', 'hover:text-[#0070A8]'),
        ('hover:text-indigo-600', 'hover:text-[#00A1E0]'),
        ('hover:border-indigo-600', 'hover:border-[#00A1E0]'),

        # Ring colors (focus states)
        ('ring-indigo-600', 'ring-[#00A1E0]'),
        ('ring-blue-600', 'ring-[#00A1E0]'),
        ('focus:ring-indigo-600', 'focus:ring-[#00A1E0]'),
        ('focus:ring-blue-600', 'focus:ring-[#00A1E0]'),
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    # Remove gradient classes and replace with solid
    gradient_patterns = [
        (r'bg-gradient-to-r from-indigo-600 to-violet-500', 'bg-[#00A1E0]'),
        (r'bg-gradient-to-r from-blue-600 to-violet-500', 'bg-[#00A1E0]'),
        (r'bg-gradient-to-br from-indigo-600 to-violet-500', 'bg-[#00A1E0]'),
        (r'bg-gradient-to-r from-indigo-600 to-indigo-700', 'bg-[#00A1E0]'),
    ]

    for pattern, replacement in gradient_patterns:
        content = re.sub(pattern, replacement, content)

    # Remove hover gradient classes
    content = re.sub(r'\s+hover:from-indigo-\d+\s+hover:to-\w+-\d+', '', content)
    content = re.sub(r'\s+hover:from-blue-\d+\s+hover:to-\w+-\d+', '', content)

    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

def main():
    """Apply theme to all files"""
    src_dir = Path('src')

    # Patterns to include
    patterns = [
        'src/app/**/page.tsx',
        'src/components/*.tsx',
    ]

    files_changed = 0
    files_processed = 0

    # Process all .tsx files in src/app and src/components
    for pattern in ['src/app', 'src/components']:
        for filepath in Path(pattern).rglob('*.tsx'):
            filepath_str = str(filepath)

            if should_skip(filepath_str):
                print(f"⏭️  Skipped: {filepath_str}")
                continue

            files_processed += 1
            if apply_theme_to_file(filepath_str):
                files_changed += 1
                print(f"✅ Updated: {filepath_str}")

    print(f"\n{'='*60}")
    print(f"✨ Theme applied successfully!")
    print(f"📝 Files processed: {files_processed}")
    print(f"✏️  Files changed: {files_changed}")
    print(f"⏭️  Files skipped: {len(SKIP_FILES)}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
