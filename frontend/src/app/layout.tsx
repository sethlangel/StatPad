'use client'
import '../styles/globals.css'
import Navbar from '../components/navbar'
import { AuthProvider } from '../hooks/useAuth'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
      </body>
    </html>
  );
}