export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-green-800">Loading...</p>
      </div>
    </div>
  )
}

