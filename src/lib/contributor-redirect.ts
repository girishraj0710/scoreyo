// Helper to check if user is contributor and redirect
export function useContributorRedirect(user: any, isLoading: boolean, router: any) {
  const { useEffect } = require('react');

  useEffect(() => {
    if (!isLoading && user && ['contributor', 'admin'].includes(user.role || '')) {
      router.push('/contributor');
    }
  }, [user, isLoading, router]);
}
