#!/usr/bin/env python3
"""
Fix Salesforce Blue colors in React/Next.js files by replacing Tailwind color classes
with inline styles for proper rendering.
"""
import re

# Color mappings
COLORS = {
    'primary': '#00A1E0',
    'dark': '#0070A8',
    'light': '#E6F4F9',
    'medium': '#80CFED',
    'lighter': '#B3E0F2',
    'darker': '#005A7A',
}

def fix_simple_bg_color(match):
    """Fix simple bg-indigo-600 style classes"""
    return f'style={{{{ backgroundColor: "{COLORS["primary"]}" }}}}'

def fix_text_color(match):
    """Fix text-indigo-600 style classes"""
    return f'style={{{{ color: "{COLORS["primary"]}" }}}}'

def fix_gradient_button(text):
    """Fix gradient buttons with hover states"""
    # Pattern: bg-gradient-to-r from-indigo-600 to-violet-500 ... hover:from-indigo-700
    pattern = r'className="([^"]*?)bg-gradient-to-r from-indigo-600 to-violet-500([^"]*?)"'

    def replacement(match):
        other_classes = match.group(1).strip() + ' ' + match.group(2).strip()
        other_classes = other_classes.strip()
        return f'''className="{other_classes}"
            style={{{{
              background: 'linear-gradient(to right, {COLORS["primary"]}, #8B5CF6)',
              transition: 'all 0.2s'
            }}}}
            onMouseEnter={{(e) => {{
              e.currentTarget.style.background = 'linear-gradient(to right, {COLORS["dark"]}, #7C3AED)';
            }}}}
            onMouseLeave={{(e) => {{
              e.currentTarget.style.background = 'linear-gradient(to right, {COLORS["primary"]}, #8B5CF6)';
            }}}}'''

    return re.sub(pattern, replacement, text)

# Read the files
files_to_fix = [
    'src/app/dashboard/page.tsx',
    'src/app/mock-test/page.tsx'
]

for filepath in files_to_fix:
    print(f"Processing {filepath}...")

    with open(filepath, 'r') as f:
        content = f.read()

    # Add version comment at top if not present
    if 'VERSION: SALESFORCE-BLUE' not in content:
        lines = content.split('\n')
        lines.insert(1, '// VERSION: SALESFORCE-BLUE-2026-06-01-v2')
        content = '\n'.join(lines)

    # Fix gradient buttons
    content = fix_gradient_button(content)

    # Fix simple indigo colors - bg
    content = re.sub(
        r'bg-indigo-600',
        f'[#00A1E0]',  # Use Tailwind arbitrary value
        content
    )

    content = re.sub(
        r'bg-indigo-700',
        f'[#0070A8]',
        content
    )

    # Fix text colors
    content = re.sub(
        r'text-indigo-600',
        f'[#00A1E0]',
        content
    )

    content = re.sub(
        r'text-indigo-700',
        f'[#0070A8]',
        content
    )

    # Fix border colors
    content = re.sub(
        r'border-indigo-600',
        f'[#00A1E0]',
        content
    )

    # Fix indigo-50 backgrounds
    content = re.sub(
        r'bg-indigo-50',
        f'[#E6F4F9]',
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

    print(f"✓ Fixed {filepath}")

print("\nDone! Salesforce Blue colors applied.")
