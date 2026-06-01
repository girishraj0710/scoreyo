/**
 * Loading Skeleton Component
 * Reusable skeleton for dynamically imported components
 * Used with dynamic() for better UX during code splitting
 */

interface LoadingSkeletonProps {
  type?: 'page' | 'card' | 'list' | 'quiz' | 'mocktest';
  className?: string;
}

export function LoadingSkeleton({ type = 'page', className = '' }: LoadingSkeletonProps) {
  if (type === 'quiz' || type === 'mocktest') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 ${className}`}>
        {/* Header skeleton */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Question card skeleton */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          {/* Question number */}
          <div className="flex justify-between mb-6">
            <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded w-24 animate-pulse"></div>
          </div>

          {/* Question text */}
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse"></div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse"></div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between">
            <div className="h-10 bg-slate-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-[#80CFED] rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-slate-600">
            <div className="w-5 h-5 border-2 border-[#00A1E0] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading {type}...</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default page skeleton
  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="h-10 bg-slate-200 rounded-lg w-64 animate-pulse mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
              </div>
              <div className="h-10 bg-[#80CFED] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline spinner for smaller components
 */
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-[#00A1E0] border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
}
