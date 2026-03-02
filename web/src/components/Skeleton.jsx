// Loading skeleton components for better UX

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="text-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mt-2" />
      </div>

      {/* Calorie Card */}
      <div className="card p-6">
        <div className="text-center">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 mx-auto" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mt-2" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full mt-4 w-full" />
        </div>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mt-2" />
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-2" />
          </div>
        ))}
      </div>

      {/* Quick Add */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Entry placeholders */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        {[1, 2].map(i => (
          <div key={i} className="card p-4 flex gap-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="text-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mt-2" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map(i => (
          <div key={i} className="card p-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mt-2" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg" />
      </div>

      {/* Day list */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="card p-4 flex justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="text-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto mt-2" />
      </div>

      {/* Toggle */}
      <div className="flex justify-center">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-48" />
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map(i => (
          <div key={i} className="card p-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mt-1" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
  );
}

export function EntryCardSkeleton() {
  return (
    <div className="card p-4 flex items-start gap-4 animate-pulse">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
      </div>
    </div>
  );
}