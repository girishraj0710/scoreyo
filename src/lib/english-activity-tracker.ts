/**
 * English Learning Activity Tracker
 *
 * Tracks user's last visited topic from:
 * - Course topics (Foundation, Advanced, etc.)
 * - Study Plan topics (Personalized path)
 *
 * Stores in localStorage for "Continue Learning" feature
 */

interface ActivityData {
  topicTitle: string;
  topicId: string;
  pathName: string;
  pathId: string;
  visitedAt: string;
}

/**
 * Save user's activity when they visit a topic
 * Call this from the topic page component
 */
export function trackTopicVisit(
  userId: string,
  topicId: string,
  topicTitle: string,
  pathId: string,
  pathName: string
): void {
  const activityData: ActivityData = {
    topicTitle,
    topicId,
    pathName,
    pathId,
    visitedAt: new Date().toISOString()
  };

  localStorage.setItem(
    `english_last_activity_${userId}`,
    JSON.stringify(activityData)
  );
}

/**
 * Get user's last activity
 * Returns null if no activity found
 */
export function getLastActivity(userId: string): ActivityData | null {
  const data = localStorage.getItem(`english_last_activity_${userId}`);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Clear user's activity history
 * Useful for testing or reset functionality
 */
export function clearActivityHistory(userId: string): void {
  localStorage.removeItem(`english_last_activity_${userId}`);
}
