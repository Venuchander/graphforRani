import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rainbai Noob',
  description: 'Jiiva',
  generator: 'Spiderman',
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
