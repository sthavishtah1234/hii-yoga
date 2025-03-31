import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

