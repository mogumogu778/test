import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'テックストック',
  description: '日米テック株の株価・テクニカル指標・決算情報',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <footer className="text-center text-xs text-gray-400 py-6 mt-8 border-t">
          データはyfinance経由で取得。投資判断の根拠として使用しないでください。
        </footer>
      </body>
    </html>
  )
}
