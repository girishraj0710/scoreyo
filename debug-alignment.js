/**
 * ALIGNMENT DEBUG SCRIPT
 *
 * This script measures all elements and shows you exactly what's wrong
 *
 * Usage:
 * 1. Open DevTools (F12 or Cmd+Option+I)
 * 2. Go to Console tab
 * 3. Paste this entire script and press Enter
 * 4. Read the detailed report
 */

(function() {
  console.clear();
  console.log('%c🔍 ALIGNMENT DEBUG REPORT', 'font-size: 20px; font-weight: bold; color: #3B82F6');
  console.log('═══════════════════════════════════════════════════════\n');

  const results = [];
  const issues = [];

  // ==================== 1. FIXED HEADER ====================
  console.log('%c1️⃣ FIXED HEADER ANALYSIS', 'font-size: 16px; font-weight: bold; color: #10B981');

  const fixedHeader = document.querySelector('header[class*="fixed"]') ||
                      Array.from(document.querySelectorAll('header')).find(h =>
                        window.getComputedStyle(h).position === 'fixed'
                      );

  if (fixedHeader) {
    const rect = fixedHeader.getBoundingClientRect();
    const computed = window.getComputedStyle(fixedHeader);

    console.log(`   Height: ${rect.height}px`);
    console.log(`   Top: ${rect.top}px`);
    console.log(`   Position: ${computed.position}`);
    console.log(`   Z-index: ${computed.zIndex}`);
    console.log(`   Padding: ${computed.paddingTop} / ${computed.paddingBottom}`);

    results.push({
      element: 'Fixed Header',
      height: Math.round(rect.height),
      top: rect.top,
      position: computed.position
    });

    if (rect.top !== 0) {
      issues.push('⚠️ Fixed header is not at viewport top (0px)');
    }
  } else {
    console.log('   ❌ Fixed header not found!');
    issues.push('❌ Cannot find fixed header element');
  }

  console.log('');

  // ==================== 2. MAIN CONTENT WRAPPER ====================
  console.log('%c2️⃣ MAIN CONTENT WRAPPER', 'font-size: 16px; font-weight: bold; color: #10B981');

  const main = document.querySelector('main');

  if (main) {
    const rect = main.getBoundingClientRect();
    const computed = window.getComputedStyle(main);

    console.log(`   Top position: ${rect.top}px`);
    console.log(`   Margin-top: ${computed.marginTop}`);
    console.log(`   Padding-top: ${computed.paddingTop}`);
    console.log(`   Position: ${computed.position}`);

    results.push({
      element: 'Main Content',
      top: Math.round(rect.top),
      marginTop: computed.marginTop,
      paddingTop: computed.paddingTop
    });

    const fixedHeaderHeight = fixedHeader ? fixedHeader.getBoundingClientRect().height : 0;
    const gap = rect.top - fixedHeaderHeight;

    if (gap < -5) {
      issues.push(`⚠️ Content is ${Math.abs(gap).toFixed(0)}px TOO HIGH - hidden under header!`);
    } else if (gap > 5) {
      issues.push(`⚠️ Content is ${gap.toFixed(0)}px TOO LOW - excessive spacing!`);
    } else {
      console.log(`   ✅ Content position is correct (${gap.toFixed(0)}px gap)`);
    }
  } else {
    console.log('   ❌ Main element not found!');
    issues.push('❌ Cannot find main element');
  }

  console.log('');

  // ==================== 3. STICKY HEADERS ====================
  console.log('%c3️⃣ STICKY HEADERS', 'font-size: 16px; font-weight: bold; color: #10B981');

  const stickyElements = Array.from(document.querySelectorAll('[class*="sticky"]')).filter(el => {
    const style = window.getComputedStyle(el);
    return style.position === 'sticky' || style.position === '-webkit-sticky';
  });

  if (stickyElements.length > 0) {
    stickyElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);

      console.log(`   Sticky #${i + 1}:`);
      console.log(`     Top position: ${rect.top}px`);
      console.log(`     Computed top: ${computed.top}`);
      console.log(`     Height: ${rect.height}px`);
      console.log(`     Z-index: ${computed.zIndex}`);

      results.push({
        element: `Sticky Header #${i + 1}`,
        top: Math.round(rect.top),
        computedTop: computed.top,
        height: Math.round(rect.height)
      });

      const fixedHeaderHeight = fixedHeader ? fixedHeader.getBoundingClientRect().height : 0;
      const expectedTop = fixedHeaderHeight;
      const actualTop = rect.top;

      if (Math.abs(actualTop - expectedTop) > 5) {
        if (actualTop < 5) {
          issues.push(`⚠️ Sticky header #${i + 1} is at ${actualTop}px (should be ${expectedTop}px) - HIDDEN under fixed header!`);
        } else {
          issues.push(`⚠️ Sticky header #${i + 1} is at ${actualTop}px (should be ${expectedTop}px) - wrong position!`);
        }
      }
    });
  } else {
    console.log('   ℹ️ No sticky headers found on this page');
  }

  console.log('');

  // ==================== 4. PAGE WRAPPERS ====================
  console.log('%c4️⃣ PAGE WRAPPERS', 'font-size: 16px; font-weight: bold; color: #10B981');

  const pageWrappers = Array.from(document.querySelectorAll('div[class*="min-h-screen"]'));

  if (pageWrappers.length > 0) {
    pageWrappers.forEach((wrapper, i) => {
      const computed = window.getComputedStyle(wrapper);
      const hasStickyChild = wrapper.querySelector('[class*="sticky"]') !== null;

      console.log(`   Wrapper #${i + 1} ${hasStickyChild ? '(has sticky header)' : ''}:`);
      console.log(`     Margin-top: ${computed.marginTop}`);
      console.log(`     Padding-top: ${computed.paddingTop}`);

      if (hasStickyChild) {
        const marginTop = parseInt(computed.marginTop);
        const paddingTop = parseInt(computed.paddingTop);

        if (marginTop >= 0) {
          issues.push(`⚠️ Page wrapper #${i + 1} has positive margin (${computed.marginTop}) but has sticky header - should be negative!`);
        }
        if (paddingTop === 0) {
          issues.push(`⚠️ Page wrapper #${i + 1} has no padding-top but has sticky header - content will merge!`);
        }
      }
    });
  }

  console.log('');

  // ==================== 5. SIDEBAR ====================
  console.log('%c5️⃣ SIDEBAR POSITIONING', 'font-size: 16px; font-weight: bold; color: #10B981');

  const sidebar = document.querySelector('aside');

  if (sidebar) {
    const computed = window.getComputedStyle(sidebar);
    const rect = sidebar.getBoundingClientRect();

    console.log(`   Top: ${computed.top}`);
    console.log(`   Height: ${computed.height}`);
    console.log(`   Position: ${computed.position}`);

    const fixedHeaderHeight = fixedHeader ? fixedHeader.getBoundingClientRect().height : 0;
    const expectedTop = fixedHeaderHeight;
    const actualTop = parseInt(computed.top);

    if (Math.abs(actualTop - expectedTop) > 5) {
      issues.push(`⚠️ Sidebar top is ${actualTop}px (should be ${expectedTop}px)`);
    }
  }

  console.log('');

  // ==================== SUMMARY TABLE ====================
  console.log('%c📊 MEASUREMENTS SUMMARY', 'font-size: 16px; font-weight: bold; color: #8B5CF6');
  console.table(results);

  // ==================== ISSUES REPORT ====================
  console.log('%c⚠️ ISSUES FOUND', 'font-size: 16px; font-weight: bold; color: #EF4444');

  if (issues.length > 0) {
    issues.forEach(issue => console.log(`   ${issue}`));
  } else {
    console.log('   ✅ No issues found! Alignment looks correct.');
  }

  console.log('');

  // ==================== VISUAL DEBUG ====================
  console.log('%c🎨 VISUAL DEBUG', 'font-size: 16px; font-weight: bold; color: #F59E0B');
  console.log('   Creating visual overlay...');

  // Remove old overlay if exists
  const oldOverlay = document.getElementById('debug-alignment-overlay');
  if (oldOverlay) oldOverlay.remove();

  // Create visual overlay
  const overlay = document.createElement('div');
  overlay.id = 'debug-alignment-overlay';
  overlay.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 999999;">
      ${fixedHeader ? `
        <div style="position: absolute; top: 0; left: 0; right: 0; height: ${fixedHeader.getBoundingClientRect().height}px; background: rgba(239, 68, 68, 0.3); border-bottom: 2px solid #EF4444;"></div>
        <div style="position: absolute; top: ${fixedHeader.getBoundingClientRect().height}px; left: 10px; background: #EF4444; color: white; padding: 4px 8px; font-size: 12px; font-weight: bold; border-radius: 4px;">
          Fixed Header: ${Math.round(fixedHeader.getBoundingClientRect().height)}px
        </div>
      ` : ''}

      ${main ? `
        <div style="position: absolute; top: ${main.getBoundingClientRect().top}px; left: 0; right: 0; height: 2px; background: #10B981;"></div>
        <div style="position: absolute; top: ${main.getBoundingClientRect().top + 5}px; left: 10px; background: #10B981; color: white; padding: 4px 8px; font-size: 12px; font-weight: bold; border-radius: 4px;">
          Main Content: ${Math.round(main.getBoundingClientRect().top)}px
        </div>
      ` : ''}

      ${stickyElements.map((el, i) => `
        <div style="position: absolute; top: ${el.getBoundingClientRect().top}px; left: 0; right: 0; height: ${el.getBoundingClientRect().height}px; background: rgba(139, 92, 246, 0.2); border: 2px solid #8B5CF6;"></div>
        <div style="position: absolute; top: ${el.getBoundingClientRect().top + 5}px; right: 10px; background: #8B5CF6; color: white; padding: 4px 8px; font-size: 12px; font-weight: bold; border-radius: 4px;">
          Sticky #${i + 1}: ${Math.round(el.getBoundingClientRect().top)}px
        </div>
      `).join('')}
    </div>

    <div style="position: fixed; bottom: 20px; right: 20px; background: white; border: 2px solid #3B82F6; border-radius: 8px; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 300px; pointer-events: auto; z-index: 999999;">
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1F2937;">Debug Overlay</div>
      <div style="font-size: 12px; color: #6B7280; line-height: 1.5;">
        <div style="margin-bottom: 4px;">🔴 Red = Fixed Header</div>
        <div style="margin-bottom: 4px;">🟢 Green = Main Content</div>
        <div style="margin-bottom: 4px;">🟣 Purple = Sticky Headers</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 12px; padding: 6px 12px; background: #3B82F6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">
        Close Overlay
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  console.log('   ✅ Visual overlay added (scroll to see all elements)');
  console.log('');

  // ==================== RECOMMENDATIONS ====================
  console.log('%c💡 RECOMMENDATIONS', 'font-size: 16px; font-weight: bold; color: #F59E0B');

  const fixedHeaderHeight = fixedHeader ? Math.round(fixedHeader.getBoundingClientRect().height) : 0;

  if (issues.length > 0) {
    console.log(`\n   Based on the measurements:`);
    console.log(`   1. Fixed header is ${fixedHeaderHeight}px tall`);
    console.log(`   2. Main element should have: margin-top: ${fixedHeaderHeight}px`);
    console.log(`   3. Sticky headers should have: top: ${fixedHeaderHeight}px`);
    console.log(`   4. Pages with sticky headers need:`);
    console.log(`      - margin-top: -${fixedHeaderHeight}px`);
    console.log(`      - padding-top: ${fixedHeaderHeight}px`);

    console.log(`\n   Run this to auto-fix:`);
    console.log(`%c   Copy the fix script from fix-alignment.js`, 'color: #10B981; font-weight: bold;');
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('%c✨ Debug complete! Check the visual overlay on the page.', 'font-size: 14px; color: #10B981; font-weight: bold;');

  // Return summary object
  return {
    fixedHeaderHeight,
    mainTop: main ? Math.round(main.getBoundingClientRect().top) : null,
    issuesCount: issues.length,
    issues,
    measurements: results
  };
})();
