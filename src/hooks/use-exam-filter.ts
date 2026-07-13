import { useUser } from "@/context/user-context";
import { useMemo } from "react";

/**
 * Single-Exam-Focus Hook
 *
 * Returns the appropriate exam filter for the current user:
 * - Admin/Contributor: null (no filter, see all exams)
 * - Regular users: current_exam (only their selected exam)
 *
 * Usage:
 * const examFilter = useExamFilter();
 *
 * In queries:
 * const url = examFilter ? `/api/stats?examId=${examFilter}` : "/api/stats";
 *
 * In filters:
 * const filteredExams = examFilter
 *   ? EXAMS.filter(e => e.id === examFilter)
 *   : EXAMS;
 */
export function useExamFilter() {
  const { user, isAdmin } = useUser();

  return useMemo(() => {
    // Admin: No filter (see all exams)
    if (isAdmin) {
      return null;
    }

    // Regular users: Filter by current_exam
    return user?.current_exam || null;
  }, [user?.current_exam, isAdmin]);
}

/**
 * Returns filtered list of exams based on user's access
 *
 * Usage:
 * const visibleExams = useFilteredExams();
 * // Admin sees all, regular users see only enrolled exams
 */
export function useFilteredExams(allExams: Array<{ id: string; [key: string]: any }>) {
  const { user, isAdmin } = useUser();

  return useMemo(() => {
    // Admin: See all exams
    if (isAdmin) {
      return allExams;
    }

    // Regular users: Only enrolled exams
    const enrolledExams = user?.enrolled_exams || [];
    if (enrolledExams.length === 0) {
      return allExams; // Fallback if no enrollments
    }

    return allExams.filter(exam => enrolledExams.includes(exam.id));
  }, [allExams, user?.enrolled_exams, isAdmin]);
}

/**
 * Check if user should see a specific exam
 *
 * Usage:
 * if (canAccessExam('jee')) {
 *   // Show JEE content
 * }
 */
export function useCanAccessExam(examId: string) {
  const { user, isAdmin } = useUser();

  return useMemo(() => {
    // Admin: Access all exams
    if (isAdmin) {
      return true;
    }

    // Regular users: Only enrolled exams
    return user?.enrolled_exams?.includes(examId) || false;
  }, [examId, user?.enrolled_exams, isAdmin]);
}
