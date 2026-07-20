/**
 * Admin Authorization Utilities
 * Provides consistent admin role detection across the application
 */

// List of email addresses that are auto-promoted to admin role
// These users will be set to admin role on login if they're not already admin
export const ADMIN_EMAILS = [
  // "girish.raj0710@gmail.com", // Owner/developer account - keep as student to test all features
  // "grgowda07.1992@gmail.com", // Commented out to test as student
  "admin@scoreyo.in",
];

/**
 * Check if an email should be granted admin role
 */
export function isAdminEmail(email: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(cleanEmail);
}

/**
 * Check if a user has admin role
 * Supports both database role and email-based fallback
 */
export function isAdmin(userRole?: string, userEmail?: string): boolean {
  // Check database role first (preferred)
  if (userRole === 'admin') {
    return true;
  }

  // Fallback to email check for backward compatibility
  if (userEmail && isAdminEmail(userEmail)) {
    return true;
  }

  return false;
}

/**
 * Determine the appropriate role for a user
 * - If email is in admin list → 'admin'
 * - If they have an existing role → keep it
 * - Otherwise → default to 'student'
 */
export function determineUserRole(
  userEmail: string,
  existingRole?: string | null
): 'admin' | 'contributor' | 'student' {
  // Admins stay admin
  if (isAdminEmail(userEmail)) {
    return 'admin';
  }

  // Keep existing role if set
  if (existingRole && ['contributor', 'admin', 'student'].includes(existingRole)) {
    return existingRole as 'admin' | 'contributor' | 'student';
  }

  // Default to student
  return 'student';
}
