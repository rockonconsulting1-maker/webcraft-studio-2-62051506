import { lazy, Suspense, useEffect, useState } from 'react'

// recharts + framer-motion are heavy and DOM-bound. Render this section only
// after mount (client) so the dynamic import never enters the SSR bundle and
// the SSR build stays lean.
const MarketAnalysisLazy = lazy(() => import('./MarketAnalysis'))

export default function MarketAnalysisClient() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="flex flex-col md:flex-row gap-8 min-h-[500px] animate-pulse">
        <div className="w-full md:w-64 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="flex-grow bg-white rounded-3xl p-8 border border-gray-100 shadow-sm" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col md:flex-row gap-8 min-h-[500px] animate-pulse">
          <div className="flex-grow bg-white rounded-3xl p-8 border border-gray-100 shadow-sm" />
        </div>
      }
    >
      <MarketAnalysisLazy />
    </Suspense>
  )
}
