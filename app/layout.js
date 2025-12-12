import { Inter } from 'next/font/google'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { DatesProvider } from '@mantine/dates'
import 'dayjs/locale/tr'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VeriProje - Terapi Randevu Sistemi',
  description: 'Modern terapi randevu sistemi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Notifications />
          <ModalsProvider>
            <DatesProvider settings={{ locale: 'tr', firstDayOfWeek: 1 }}>
              {children}
            </DatesProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  )
}