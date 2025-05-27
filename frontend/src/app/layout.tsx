'use client'
import '../styles/globals.css'
import Navbar from '../components/navbar'
import { AuthProvider } from '../hooks/useAuth'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
      </body>
    </html>
  );
}