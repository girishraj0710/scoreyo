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
      <div className={`min-h-screen p-4 ${className}`} style={{ background: "var(--page-bg)" }}>
        {/* Header skeleton */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="h-8 rounded-lg w-48 animate-pulse mb-4" style={{ background: "var(--hover-bg)" }}></div>
          <div className="h-4 rounded w-64 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
        </div>

        {/* Question card skeleton */}
        <div className="max-w-4xl mx-auto rounded-2xl shadow-lg p-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          {/* Question number */}
          <div className="flex justify-between mb-6">
            <div className="h-6 rounded w-32 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
            <div className="h-6 rounded w-24 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
          </div>

          {/* Question text */}
          <div className="space-y-3 mb-6">
            <div className="h-4 rounded w-full animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
            <div className="h-4 rounded w-5/6 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
            <div className="h-4 rounded w-4/6 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between">
            <div className="h-10 rounded w-24 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
            <div className="h-10 bg-[#90CAF9] rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2" style={{ color: "var(--foreground-secondary)" }}>
            <div className="w-5 h-5 border-2 border-[#E76F51] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading {type}...</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`rounded-xl shadow-md p-6 ${className}`} style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <div className="h-6 rounded w-3/4 animate-pulse mb-4" style={{ background: "var(--hover-bg)" }}></div>
        <div className="h-4 rounded w-full animate-pulse mb-2" style={{ background: "var(--hover-bg)" }}></div>
        <div className="h-4 rounded w-5/6 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg p-4 shadow-sm" style={{ background: "var(--card-bg)" }}>
            <div className="w-12 h-12 rounded-full animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded w-3/4 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
              <div className="h-3 rounded w-1/2 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default page skeleton
  return (
    <div className={`min-h-screen p-8 ${className}`} style={{ background: "var(--page-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="h-10 rounded-lg w-64 animate-pulse mb-4" style={{ background: "var(--hover-bg)" }}></div>
          <div className="h-4 rounded w-96 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl shadow-lg p-6" style={{ background: "var(--card-bg)" }}>
              <div className="h-6 rounded w-3/4 animate-pulse mb-4" style={{ background: "var(--hover-bg)" }}></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 rounded w-full animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
                <div className="h-4 rounded w-5/6 animate-pulse" style={{ background: "var(--hover-bg)" }}></div>
              </div>
              <div className="h-10 bg-[#90CAF9] rounded animate-pulse"></div>
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
      <div className={`${sizeClasses[size]} border-[#E76F51] border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
}
