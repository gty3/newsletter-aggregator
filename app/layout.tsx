import { ThemeProvider } from "@/components/themecomponent"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import PlausibleProvider from "next-plausible"
import NewsletterNavigation from "./newsletterNavigation"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: "Email service example",
  description: "An app to recieve and render newsletters",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {" "}
        {/* <PlausibleProvider domain={"https://d3m3jyvyarnzfr.cloudfront.net"}> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="div flex flex-col-reverse md:flex-row">
              <div className="items-start md:w-80 orderlast md:order-first">
                <div className="">
                  <NewsletterNavigation />
                </div>
              </div>
              <div className="flex justify-center items-center sm:w-3/4 ">
                {children}
              </div>
            </div>
          </ThemeProvider>
        {/* </PlausibleProvider> */}
      </body>
    </html>
  )
}

export const revalidate = 0