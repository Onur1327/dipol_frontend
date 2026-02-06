export default function ProductsLoading() {
  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="h-8 w-40 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px,minmax(0,1fr)] gap-8 lg:gap-10">
            {/* Sol filtre skeleton */}
            <aside className="lg:sticky lg:top-32 self-start">
              <div className="bg-white rounded-lg shadow-sm p-4 space-y-3 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-gray-100 rounded" />
                  <div className="h-3 w-28 bg-gray-100 rounded" />
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                </div>
              </div>
            </aside>

            {/* Ürün grid skeleton */}
            <main className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm px-4 py-5 sm:px-6 sm:py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse"
                    >
                      <div className="aspect-square bg-gray-100" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-100 rounded mt-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

