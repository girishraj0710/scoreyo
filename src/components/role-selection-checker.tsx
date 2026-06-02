"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { RoleSelectionModal } from "./role-selection-modal";

/**
 * Role Selection Checker
 * Shows one-time modal for existing users who don't have a role assigned yet
 * This handles the migration path for users created before role system was introduced
 */
export function RoleSelectionChecker() {
  const { user, isLoading } = useUser();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Check if user needs to select a role
  useEffect(() => {
    // Don't check until user data is loaded
    if (isLoading || hasChecked) return;

    // If user exists and doesn't have a role, show modal
    if (user && !user.role) {
      setShowRoleModal(true);
    }

    setHasChecked(true);
  }, [user, isLoading, hasChecked]);

  const handleRoleSelect = async (role: 'student' | 'teacher') => {
    try {
      // Call the API to set the user's role
      const res = await fetch('/api/user/select-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to set role');
      }

      // Success - close modal and refresh user context
      setShowRoleModal(false);

      // Fetch updated user data
      const userRes = await fetch('/api/auth');
      if (userRes.ok) {
        // User context will update automatically
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to set role');
    }
  };

  return (
    <RoleSelectionModal
      isOpen={showRoleModal}
      onRoleSelect={handleRoleSelect}
    />
  );
}
