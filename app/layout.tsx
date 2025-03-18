import './globals.css'
import { ThemeProvider } from './context/ThemeContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { PotentialEstimatesProvider } from './context/PotentialEstimatesContext'
import { AnalysisProvider } from './context/AnalysisContext'
import { OSRProvider } from './context/OSRContext'
import { RosraProvider } from './context/RosraContext'
import { LicenseProvider } from './context/LicenseContext'
import { LicenseMetricsProvider } from './context/LicenseMetricsContext'
import { ShortTermProvider } from './context/ShortTermContext'
import { LongTermProvider } from './context/LongTermContext'
import { MixedChargeProvider } from './context/MixedChargeContext'
import { CausesAnalysisProvider } from './context/CausesAnalysisContext'
import { PropertyTaxProvider } from './context/PropertyTaxContext'
import NavigationWrapper from './components/NavigationWrapper'
import { Inter } from 'next/font/google'
import SessionProviderWrapper from './providers/SessionProviderWrapper'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ROSRA | UN Habitat',
  description: 'Revenue Optimization System for Revenue Authorities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <SessionProviderWrapper>
          <ThemeProvider>
            <CurrencyProvider>
              <PotentialEstimatesProvider>
                <AnalysisProvider>
                  <OSRProvider>
                    <RosraProvider>
                      <LicenseProvider>
                        <LicenseMetricsProvider>
                          <ShortTermProvider>
                            <LongTermProvider>
                              <MixedChargeProvider>
                                <PropertyTaxProvider>
                                  <CausesAnalysisProvider>
                                    <Toaster position="top-right" />
                                    <NavigationWrapper />
                                    <main>
                                      {children}
                                    </main>
                                  </CausesAnalysisProvider>
                                </PropertyTaxProvider>
                              </MixedChargeProvider>
                            </LongTermProvider>
                          </ShortTermProvider>
                        </LicenseMetricsProvider>
                      </LicenseProvider>
                    </RosraProvider>
                  </OSRProvider>
                </AnalysisProvider>
              </PotentialEstimatesProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
