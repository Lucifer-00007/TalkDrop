import { Skeleton } from '@/components/ui/skeleton'

export default function ChatSkeleton() {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header skeleton */}
      <header className="px-3 py-2.5 bg-[#1b48ac]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg bg-white/20" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32 bg-white/20" />
              <Skeleton className="h-3 w-44 bg-white/15" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-9 w-9 rounded-lg bg-white/20" />
            <Skeleton className="h-9 w-9 rounded-lg bg-white/20" />
            <Skeleton className="h-9 w-9 rounded-lg bg-white/20" />
            <Skeleton className="h-9 w-20 rounded-lg bg-white/20" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar skeleton - hidden on mobile */}
        <div className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <Skeleton className="h-5 w-24" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Main chat area skeleton */}
        <div className="flex-1 flex flex-col relative bg-white dark:bg-gray-800">
          {/* Messages */}
          <div className="flex-1 overflow-hidden p-4 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex flex-col gap-1.5 ${i % 2 === 0 ? 'items-start' : 'items-end'}`}>
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className={`h-12 rounded-2xl ${i % 2 === 0 ? 'w-64' : 'w-52'} ${i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/40'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Input bar skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
