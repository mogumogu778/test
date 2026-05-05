'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',                      label: 'ダッシュボード' },
  { href: '/stocks',                label: '銘柄一覧' },
  { href: '/earnings/surprises',    label: '決算サプライズ' },
  { href: '/earnings/calendar',     label: '決算カレンダー' },
]

export function Navigation() {
  const pathname = usePathname()
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-14">
        <span className="font-bold text-blue-600 text-lg">テックストック</span>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium transition-colors ${
              pathname === href
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
