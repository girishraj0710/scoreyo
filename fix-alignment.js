/**
 * Dynamic Alignment Fix Script
 * Run this in browser console to fix header alignment issues
 *
 * Usage:
 * 1. Open DevTools (F12 or Cmd+Option+I)
 * 2. Go to Console tab
 * 3. Paste this entire script and press Enter
 * 4. It will automatically fix all alignment issues
 */

(function() {
  console.log('🔧 Starting alignment fix...');

  // Step 1: Find the fixed header and measure its actual height
  const fixedHeader = document.querySelector('header[class*="fixed"]') ||
                      document.querySelector('header.fixed') ||
                      Array.from(document.querySelectorAll('header')).find(h =>
                        window.getComputedStyle(h).position === 'fixed'
                      );

  if (!fixedHeader) {
    console.error('❌ Fixed header not found');
    return;
  }

  const headerHeight = fixedHeader.getBoundingClientRect().height;
  console.log(`📏 Fixed header height: ${headerHeight}px`);

  // Step 2: Find the main content wrapper
  const mainElement = document.querySelector('main');

  if (!mainElement) {
    console.error('❌ Main element not found');
    return;
  }

  // Step 3: Apply correct margin to main element
  const currentMarginTop = window.getComputedStyle(mainElement).marginTop;
  console.log(`📐 Current main margin-top: ${currentMarginTop}`);

  // Only apply on desktop (min-width: 768px)
  if (window.innerWidth >= 768) {
    mainElement.style.marginTop = `${headerHeight}px`;
    console.log(`✅ Set main margin-top to ${headerHeight}px`);
  }

  // Step 4: Find all sticky headers and fix their positioning
  const stickyElements = Array.from(document.querySelectorAll('[class*="sticky"]')).filter(el => {
    const style = window.getComputedStyle(el);
    return style.position === 'sticky' || style.position === '-webkit-sticky';
  });

  console.log(`🔍 Found ${stickyElements.length} sticky elements`);

  stickyElements.forEach((el, index) => {
    const currentTop = window.getComputedStyle(el).top;
    console.log(`  Sticky ${index + 1}: current top = ${currentTop}`);

    if (window.innerWidth >= 768) {
      el.style.top = `${headerHeight}px`;
      console.log(`  ✅ Set sticky ${index + 1} top to ${headerHeight}px`);
    }
  });

  // Step 5: Fix page wrappers with negative margins (pages with sticky headers)
  const pageWrappers = document.querySelectorAll('div[class*="min-h-screen"]');

  pageWrappers.forEach((wrapper, index) => {
    const style = window.getComputedStyle(wrapper);
    const marginTop = parseInt(style.marginTop);
    const paddingTop = parseInt(style.paddingTop);

    // If this page has a sticky header inside, it needs negative margin compensation
    const hasStickyChild = wrapper.querySelector('[class*="sticky"]');

    if (hasStickyChild && window.innerWidth >= 768) {
      // Apply negative margin and equal padding
      wrapper.style.marginTop = `-${headerHeight}px`;
      wrapper.style.paddingTop = `${headerHeight}px`;
      console.log(`✅ Page wrapper ${index + 1}: set margin-top: -${headerHeight}px, padding-top: ${headerHeight}px`);
    }
  });

  // Step 6: Report final state
  console.log('\n📊 Final Measurements:');
  console.log(`  Fixed Header: ${headerHeight}px`);
  console.log(`  Main margin-top: ${mainElement.style.marginTop}`);
  console.log(`  Sticky headers: ${stickyElements.length} elements @ ${headerHeight}px`);
  console.log('\n✨ Alignment fix complete!');

  // Step 7: Create a visual indicator
  const indicator = document.createElement('div');
  indicator.textContent = `✅ Alignment Fixed (${headerHeight}px)`;
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #10B981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: system-ui;
    font-size: 14px;
    font-weight: 600;
    z-index: 99999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease-out;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(indicator);

  setTimeout(() => {
    indicator.style.transition = 'opacity 0.3s';
    indicator.style.opacity = '0';
    setTimeout(() => indicator.remove(), 300);
  }, 3000);

  // Return diagnostic info
  return {
    headerHeight,
    mainMarginTop: mainElement.style.marginTop,
    stickyCount: stickyElements.length,
    pageWrappersAdjusted: Array.from(pageWrappers).filter(w => w.querySelector('[class*="sticky"]')).length
  };
})();
