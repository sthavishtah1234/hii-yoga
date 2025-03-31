import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <Link className="flex items-center justify-center" href="/">
          <div className="h-12 w-12 relative mr-2">
            <Image
              src="/images/logo.png"
              alt="STHAVISHTA YOGA AND WELLNESS"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg text-green-800">STHAVISHTA YOGA AND WELLNESS</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('/images/yoga-pose1.png')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/80 to-blue-100/80"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-green-800">
                  STHAVISHTA YOGA AND WELLNESS
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl">
                  Access transformative yoga courses at the perfect time, no matter where you are in the world.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="bg-green-700 hover:bg-green-800">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                  <Link href="/courses">Access Courses</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-center">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/yoga-pose2.png"
                  alt="Yoga meditation pose"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-green-800">Experience Transformative Yoga</h2>
                <p className="text-gray-700">
                  Our courses are designed to help you achieve balance, strength, and inner peace through traditional
                  yoga practices adapted for the modern world. Access our courses at specific times designed to align
                  with natural rhythms, no matter where you are located.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Meditation</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Asanas</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Pranayama</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Wellness</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-green-800">Our Yoga Courses</h2>
              <p className="text-gray-700 mt-2">Discover our range of specialized yoga programs</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Morning Energizing Flow",
                  description: "Start your day with energy and intention through gentle flowing movements.",
                  image: "/images/yoga-pose1.png",
                },
                {
                  title: "Mindful Meditation",
                  description: "Develop presence and awareness through guided meditation practices.",
                  image: "/images/yoga-pose3.png",
                },
                {
                  title: "Restorative Evening Practice",
                  description: "Wind down and prepare for restful sleep with gentle, restorative poses.",
                  image: "/images/yoga-pose2.png",
                },
              ].map((course, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-48 relative">
                    <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-green-800">{course.title}</h3>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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

