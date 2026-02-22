import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Business Control AI - Операционная система вашего бизнеса',
  description: 'ИИ-агенты анализируют данные и предлагают решения. Управляйте компанией из одного интерфейса.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
