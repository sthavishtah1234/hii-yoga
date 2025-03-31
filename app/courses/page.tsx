"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, FileText, Lock, MapPin, Globe, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { getCourses } from "@/lib/actions"
import { formatLocalTime } from "@/lib/utils"
import { LanguageSelector } from "@/components/language-selector"
import { CountrySelector } from "@/components/country-selector"
import { Badge } from "@/components/ui/badge"

interface Course {
  id: string
  title: string
  description: string
  timeSlots: { time: string; days: string[]; batchName: string }[]
  duration: number
  languages: string[]
  videoId: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timezone, setTimezone] = useState<string>("")
  const [language, setLanguage] = useState("english")
  const [country, setCountry] = useState("")
  const [usingManualLocation, setUsingManualLocation] = useState(false)
  const [locationSelected, setLocationSelected] = useState(false)
  const [step, setStep] = useState<"location" | "language" | "courses">("location")
  const router = useRouter()

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLocationError(null)
          setUsingManualLocation(false)
          setLocationSelected(true)
          setStep("language")
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationError("Unable to access your location. Please select your country below.")
          setUsingManualLocation(true)
        },
      )
    } else {
      setLocationError("Geolocation is not supported by your browser. Please select your country below.")
      setUsingManualLocation(true)
    }

    // Set timezone
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

    // Fetch courses
    const loadCourses = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (error) {
        console.error("Error loading courses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Filter courses when language changes
  useEffect(() => {
    if (courses.length > 0) {
      if (language === "all") {
        setFilteredCourses(courses)
      } else {
        setFilteredCourses(courses.filter((course) => course.languages.includes(language)))
      }
    }
  }, [courses, language])

  const isAccessible = (timeSlots: { time: string; days: string[] }[]) => {
    if (!timeSlots || timeSlots.length === 0) return false

    const now = new Date()
    const currentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()]
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    return timeSlots.some((slot) => {
      const [hours, minutes] = slot.time.split(":").map(Number)

      // Check if current day is in the allowed days
      if (!slot.days.includes(currentDay)) return false

      // Check if current time is within 1 hour of the scheduled time
      if (currentHour === hours) return true
      if (currentHour === hours - 1 && currentMinute >= 30 && minutes <= 30) return true
      if (currentHour === hours + 1 && currentMinute <= 30 && minutes >= 30) return true

      return false
    })
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
    // In a real app, you would use a timezone API to get the timezone for the selected country
    // For now, we'll just use the browser's timezone
    setUsingManualLocation(true)
    setLocationSelected(true)
    setStep("language")
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setStep("courses")
  }

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case "english":
        return "English"
      case "hindi":
        return "हिंदी (Hindi)"
      case "kannada":
        return "ಕನ್ನಡ (Kannada)"
      default:
        return code
    }
  }

  const getTranslatedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      pageTitle: {
        english: "Available Yoga Courses",
        hindi: "उपलब्ध योग पाठ्यक्रम",
        kannada: "ಲಭ್ಯವಿರುವ ಯೋಗ ಕೋರ್ಸ್‌ಗಳು",
      },
      pageSubtitle: {
        english: "Access your courses based on your local time",
        hindi: "अपने स्थानीय समय के अनुसार अपने पाठ्यक्रमों तक पहुंचें",
        kannada: "ನಿಮ್ಮ ಸ್ಥಳೀಯ ಸಮಯದ ಆಧಾರದ ಮೇಲೆ ನಿಮ್ಮ ಕೋರ್ಸ್‌ಗಳನ್ನು ಪ್ರವೇಶಿಸಿ",
      },
      locationDetected: {
        english: "Location detected",
        hindi: "स्थान का पता चला",
        kannada: "ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ",
      },
      localTime: {
        english: "Local time",
        hindi: "स्थानीय समय",
        kannada: "ಸ್ಥಳೀಯ ಸಮಯ",
      },
      availableTimes: {
        english: "Available Times (Your Local Time)",
        hindi: "उपलब्ध समय (आपका स्थानीय समय)",
        kannada: "ಲಭ್ಯವಿರುವ ಸಮಯಗಳು (ನಿಮ್ಮ ಸ್ಥಳೀಯ ಸಮಯ)",
      },
      durationLabel: {
        english: "Duration",
        hindi: "अवधि",
        kannada: "ಅವಧಿ",
      },
      accessCourse: {
        english: "Access Course",
        hindi: "पाठ्यक्रम तक पहुंचें",
        kannada: "ಕೋರ್ಸ್ ಪ್ರವೇಶಿಸಿ",
      },
      availableAtScheduledTimes: {
        english: "Available at scheduled times",
        hindi: "निर्धारित समय पर उपलब्ध",
        kannada: "ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ಲಭ್ಯವಿದೆ",
      },
      noCourses: {
        english: "No courses available",
        hindi: "कोई पाठ्यक्रम उपलब्ध नहीं है",
        kannada: "ಯಾವುದೇ ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ",
      },
      checkBackLater: {
        english: "There are no courses available at the moment. Please check back later.",
        hindi: "इस समय कोई पाठ्यक्रम उपलब्ध नहीं है। कृपया बाद में फिर से जांचें।",
        kannada: "ಈ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ.",
      },
      selectCountry: {
        english: "Select your country",
        hindi: "अपना देश चुनें",
        kannada: "ನಿಮ್ಮ ದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      },
      selectLanguage: {
        english: "Select your preferred language",
        hindi: "अपनी पसंदीदा भाषा चुनें",
        kannada: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      },
      continue: {
        english: "Continue",
        hindi: "जारी रखें",
        kannada: "ಮುಂದುವರಿಸಿ",
      },
      availableLanguages: {
        english: "Available in",
        hindi: "उपलब्ध भाषाएँ",
        kannada: "ಲಭ್ಯವಿರುವ ಭಾಷೆಗಳು",
      },
      batchLabel: {
        english: "Batch",
        hindi: "बैच",
        kannada: "ಬ್ಯಾಚ್",
      },
      viewCourse: {
        english: "View Course",
        hindi: "पाठ्यक्रम देखें",
        kannada: "ಕೋರ್ಸ್ ವೀಕ್ಷಿಸಿ",
      },
      batches: {
        english: "Batches",
        hindi: "बैच",
        kannada: "ಬ್ಯಾಚ್‌ಗಳು",
      },
    }

    return translations[key]?.[language] || translations[key]?.["english"] || key
  }

  const renderLocationStep = () => (
    <Card className="max-w-md mx-auto border-green-100 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-green-100">
        <CardTitle className="text-green-800">Select Your Location</CardTitle>
        <CardDescription>We need your location to show courses available in your local time</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <CountrySelector
            value={country}
            onChange={handleCountryChange}
            placeholder={getTranslatedText("selectCountry")}
          />
          <p className="text-sm text-muted-foreground">
            Your location helps us determine your local time zone for course access.
          </p>
        </div>
      </CardContent>
    </Card>
  )

  const renderLanguageStep = () => (
    <Card className="max-w-md mx-auto border-green-100 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-green-100">
        <CardTitle className="text-green-800">{getTranslatedText("selectLanguage")}</CardTitle>
        <CardDescription>Choose the language you prefer for your yoga courses</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <LanguageSelector value={language} onChange={handleLanguageChange} className="w-full" />
          <p className="text-sm text-muted-foreground">You'll see courses available in your selected language.</p>
        </div>
      </CardContent>
      <CardFooter className="border-t border-green-100 bg-green-50/50">
        <Button onClick={() => setStep("courses")} className="w-full bg-green-700 hover:bg-green-800">
          {getTranslatedText("continue")}
        </Button>
      </CardFooter>
    </Card>
  )

  const renderCoursesStep = () => (
    <>
      {(location || usingManualLocation) && (
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground bg-white p-3 rounded-md border border-green-100">
          {usingManualLocation ? (
            <Globe className="h-4 w-4 text-green-600" />
          ) : (
            <MapPin className="h-4 w-4 text-green-600" />
          )}
          <span>
            {getTranslatedText("locationDetected")} • {timezone} • {getTranslatedText("localTime")}:{" "}
            {formatLocalTime(currentTime)}
          </span>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-green-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-green-100">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-300" />
          <h3 className="text-lg font-medium mb-2 text-green-800">{getTranslatedText("noCourses")}</h3>
          <p className="text-muted-foreground">{getTranslatedText("checkBackLater")}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const accessible = isAccessible(course.timeSlots)
            const accessibleBatches = course.timeSlots.filter((slot) => isAccessible([slot]))

            return (
              <Card key={course.id} className="border-green-100 bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-green-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-green-800">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="bg-green-50">
                          {getLanguageLabel(lang)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">{getTranslatedText("batches")}</h4>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {course.timeSlots.map((slot, index) => {
                            const isSlotAccessible = isAccessible([slot])
                            return (
                              <div
                                key={index}
                                className={`border rounded-md p-2 ${
                                  isSlotAccessible ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="font-medium">
                                    {slot.batchName || `${getTranslatedText("batchLabel")} ${index + 1}`}
                                  </div>
                                  {isSlotAccessible ? (
                                    <Badge className="bg-green-100 text-green-800 border-green-200">Live Now</Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-gray-500">
                                      <Lock className="h-3 w-3 mr-1" />
                                      Scheduled
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm mt-1 flex items-center">
                                  <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                  <span className="text-gray-600">
                                    {slot.time} on {slot.days.join(", ")}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-green-800">{getTranslatedText("durationLabel")}:</span>
                      <span>{course.duration} minutes</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-green-50 bg-green-50/50">
                  <Button
                    className="w-full bg-green-700 hover:bg-green-800"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    {accessible ? getTranslatedText("accessCourse") : getTranslatedText("viewCourse")}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-10 w-10 relative mr-2">
              <Image src="/images/logo.png" alt="STHAVISHTA YOGA AND WELLNESS" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-800">{getTranslatedText("pageTitle")}</h1>
              <p className="text-muted-foreground">{getTranslatedText("pageSubtitle")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {step === "courses" && <LanguageSelector value={language} onChange={setLanguage} className="bg-white" />}
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>

        {locationError && step === "location" && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertTitle className="text-amber-800">{locationError}</AlertTitle>
            <AlertDescription>Please select your country to continue.</AlertDescription>
          </Alert>
        )}

        {step === "location" && renderLocationStep()}
        {step === "language" && renderLanguageStep()}
        {step === "courses" && renderCoursesStep()}
      </div>
    </div>
  )
}

