import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UTU RANCH',
  description: 'A CS2 Tournament Platform', 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
