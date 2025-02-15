import './globals.css'
import { ThemeProvider } from './context/ThemeContext'

export const metadata = {
  title: 'ROSRA | UN Habitat',
  description: 'Rapid Own Source Revenue Analysis tool by UN-Habitat',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
