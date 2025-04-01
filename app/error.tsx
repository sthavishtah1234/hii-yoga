"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <Link className="flex items-center justify-center" href="/">
          <div className="h-12 w-12 relative mr-2">
            <Image src="/images/logo.png" alt="STHAVISHTA YOGA AND WELLNESS" fill className="object-contain" />
          </div>
          <span className="font-bold text-lg text-green-800">STHAVISHTA YOGA AND WELLNESS</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-3xl font-bold text-green-800 mb-4">We're working on it!</h1>
          <p className="text-gray-600 mb-6">
            We're currently experiencing some technical difficulties. Our team is working to resolve the issue as
            quickly as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              Try again
            </Button>
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 relative">
            <Image src="/images/logo.png" alt="STHAVISHTA YOGA AND WELLNESS" fill className="object-contain" />
          </div>
          <p className="text-xs text-gray-500">© 2024 STHAVISHTA YOGA AND WELLNESS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

