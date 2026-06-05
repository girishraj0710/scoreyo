import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a modal or dialog
 * Prevents Tab from leaving the element and returns focus when closed
 */
export function useFocusTrap(isOpen: boolean) {
  const elementRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !elementRef.current) return;

    // Store the currently focused element to return focus later
    previousActiveRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the modal
    const getFocusableElements = () => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input[type="text"]:not([disabled])',
        'input[type="radio"]:not([disabled])',
        'input[type="checkbox"]:not([disabled])',
        'input[type="email"]:not([disabled])',
        'input[type="password"]:not([disabled])',
        'input[type="tel"]:not([disabled])',
        'input[type="number"]:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',');

      return Array.from(elementRef.current?.querySelectorAll(focusableSelectors) || []) as HTMLElement[];
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // If Shift+Tab on first element, focus last element
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // If Tab on last element, focus first element
      else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    // Focus the first focusable element when modal opens
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add keyboard listener
    elementRef.current.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      elementRef.current?.removeEventListener('keydown', handleKeyDown);

      // Return focus to the element that triggered the modal
      if (previousActiveRef.current?.focus) {
        previousActiveRef.current.focus();
      }
    };
  }, [isOpen]);

  return elementRef;
}
