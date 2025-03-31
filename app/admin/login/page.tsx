"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock } from "lucide-react"
import Image from "next/image"
import Cookies from "js-cookie"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = Cookies.get("adminAuthenticated") === "true"
    if (isAuthenticated) {
      router.push("/admin")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check against the hardcoded password
    if (password === "!@#$%^&*()AjItH") {
      // Store in both session storage and cookies for redundancy
      sessionStorage.setItem("adminAuthenticated", "true")
      Cookies.set("adminAuthenticated", "true", { expires: 1 }) // Expires in 1 day
      router.push("/admin")
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 relative">
              <Image src="/images/logo.png" alt="STHAVISHTA YOGA AND WELLNESS" fill className="object-contain" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800">Admin Login</CardTitle>
          <CardDescription>STHAVISHTA YOGA AND WELLNESS</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>Incorrect password. Please try again.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(false)
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
              Login
            </Button>
          </CardFooter>
        </form>
        <div className="text-center pb-4">
          <Link href="/" className="text-sm text-green-600 hover:text-green-700">
            Back to Home
          </Link>
        </div>
      </Card>
    </div>
  )
}

