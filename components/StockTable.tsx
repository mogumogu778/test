import Link from 'next/link'
import type { Stock } from '@/types/stock'

function pct(v: number | null) {
  if (v == null) return <span className="text-gray-300">-</span>
  const color = v > 0 ? 'text-red-500' : v < 0 ? 'text-blue-500' : 'text-gray-500'
  return <span className={color}>{v > 0 ? '+' : ''}{v.toFixed(2)}%</span>
}

function num(v: number | null, digits = 2) {
  if (v == null) return <span className="text-gray-300">-</span>
  return <>{v.toFixed(digits)}</>
}

function rsiColor(v: number | null) {
  if (v == null) return 'text-gray-400'
  if (v >= 70) return 'text-red-500 font-semibold'
  if (v <= 30) return 'text-blue-500 font-semibold'
  return 'text-gray-700'
}

export function StockTable({ stocks }: { stocks: Stock[] }) {
  if (stocks.length === 0) {
    return <p className="text-gray-400 text-center py-12">データがありません。バッチ実行後に表示されます。</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
          <tr>
            {['銘柄', '株価', '前日比', 'RSI(14)', 'MA25', '出来高', '52週高値比'].map(h => (
              <th key={h} className="px-4 py-3 text-right first:text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stocks.map(s => {
            const pos52w = s.high_52w && s.low_52w && s.high_52w !== s.low_52w
              ? Math.round((s.close - s.low_52w) / (s.high_52w - s.low_52w) * 100)
              : null
            return (
              <tr key={`${s.market}_${s.symbol}`} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/stocks/${s.market}/${s.symbol}`} className="hover:text-blue-600">
                    <div className="font-semibold">{s.symbol}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[140px]">{s.name}</div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right font-mono">{num(s.close)}</td>
                <td className="px-4 py-3 text-right">{pct(s.price_change_pct)}</td>
                <td className={`px-4 py-3 text-right ${rsiColor(s.rsi_14)}`}>{num(s.rsi_14, 1)}</td>
                <td className="px-4 py-3 text-right text-gray-600">{num(s.ma_25)}</td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {s.volume ? (s.volume / 1_000_000).toFixed(1) + 'M' : '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  {pos52w != null ? (
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pos52w}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{pos52w}%</span>
                    </div>
                  ) : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
