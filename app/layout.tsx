import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const instrument = Instrument_Serif({ subsets: ["latin"], variable: "--font-instrument", weight: "400", style: ["normal", "italic"], display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.camwood.in"),
  title: "Cam Wood | Khushi Designer Doors and Windows",
  description:
    "Take a scroll-driven tour of the Cam Wood showroom. Explore carved wooden doors, glass and designer doors, windows, finishes and hardware in Varanasi.",
  openGraph: {
    type: "website",
    title: "Cam Wood | Khushi Designer Doors and Windows",
    description: "Explore the Cam Wood designer doors and windows showroom in Varanasi.",
    images: [{ url: "/showroom-exterior.png", width: 1400, height: 768, alt: "Cam Wood showroom at night" }],
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0c33",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable} bg-background`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
