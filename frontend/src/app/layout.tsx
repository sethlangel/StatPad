'use client'

import { AuthProvider } from "../hooks/useAuth"
import '../styles/globals.css'
import Navbar from "../components/navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="bg-dark-mode" lang="en">
      <body className="text-white">
        <main>
            <AuthProvider>
              <Navbar/>
                {children}
            </AuthProvider>
        </main>
      </body>
    </html>
  )
}