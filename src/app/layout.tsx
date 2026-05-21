import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: '隷書 — 5・7・5のSNS',
  description: '俳句形式（5音・7音・5音）でしか投稿できないSNS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-paper">
        <Nav />
        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
