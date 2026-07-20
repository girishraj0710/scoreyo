#!/bin/bash
# cleanup-orphaned-pages.sh
# Removes orphaned pages from Scoreyo platform

echo "🧹 Cleaning up orphaned pages from Scoreyo..."
echo ""

# Change to project root
cd "$(dirname "$0")/.." || exit 1

# Backup before deletion
BACKUP_DIR=".backup-orphaned-pages-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup in $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"

# Function to backup and delete
backup_and_delete() {
  local path=$1
  local name=$(basename "$path")

  if [ -d "$path" ]; then
    echo "  - Backing up $path..."
    cp -r "$path" "$BACKUP_DIR/$name"
    echo "  - Deleting $path..."
    rm -rf "$path"
  else
    echo "  ⚠️  $path not found (already deleted?)"
  fi
}

# Debug/Test pages (security risk)
echo ""
echo "🔴 Removing debug/test pages (security risk)..."
backup_and_delete "src/app/debug-auth"
backup_and_delete "src/app/debug-version"
backup_and_delete "src/app/landing-test"

# Duplicate dashboard
echo ""
echo "🟠 Removing duplicate dashboard..."
backup_and_delete "src/app/dashboard-redesign"

# Old study pages
echo ""
echo "🟡 Removing old study pages (superseded by /study-guides)..."
backup_and_delete "src/app/study"
backup_and_delete "src/app/study-v2"

# Duplicate game intro pages
echo ""
echo "🟢 Removing duplicate game pages..."
backup_and_delete "src/app/blocks-game"
backup_and_delete "src/app/match-game"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  ✓ 3 debug pages removed"
echo "  ✓ 1 duplicate dashboard removed"
echo "  ✓ 2 old study pages removed"
echo "  ✓ 2 duplicate game pages removed"
echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Total: 8 pages removed"
echo ""
echo "💾 Backup saved to: $BACKUP_DIR"
echo ""
echo "⚠️  NEXT STEPS:"
echo "  1. Fix /profile link in src/app/more/page.tsx"
echo "     Change: { href: \"/profile\", icon: User, label: \"Profile\" }"
echo "     To:     { href: \"/settings\", icon: User, label: \"Profile\" }"
echo ""
echo "  2. Check if /learn/english/vocabulary is still used"
echo "     If not, delete: rm -rf src/app/learn/english/vocabulary"
echo ""
echo "  3. Test navigation:"
echo "     npm run dev"
echo "     Visit http://localhost:3000 and test all links"
echo ""
echo "  4. If everything works, delete backup:"
echo "     rm -rf $BACKUP_DIR"
echo ""
