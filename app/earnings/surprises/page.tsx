import { getEarningsSurprises } from '@/lib/data'
import Link from 'next/link'
import type { EarningsSurprise } from '@/types/stock'

function pct(v: number | null, digits = 1) {
  if (v == null) return <span className="text-gray-300">-</span>
  const color = v > 0 ? 'text-red-500' : v < 0 ? 'text-blue-500' : 'text-gray-500'
  return <span className={color}>{v > 0 ? '+' : ''}{v.toFixed(digits)}%</span>
}

function SurpriseMethodBadge({ s }: { s: EarningsSurprise }) {
  if (s.surprise_method === 'eps_analyst') {
    return <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">EPS予想比</span>
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${
      s.earnings_pattern === '増収増益' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
    }`}>
      {s.earnings_pattern ?? 'YoY'}
    </span>
  )
}

export default function SurprisesPage() {
  const { surprises, updated_at } = getEarningsSurprises()

  const positive = surprises.filter(s => s.is_positive_surprise)
  const negative = surprises.filter(s => s.is_negative_surprise)

  const updatedAt = updated_at
    ? new Date(updated_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold">決算サプライズ一覧</h1>
        {updatedAt && <p className="text-xs text-gray-400">最終更新: {updatedAt}</p>}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-xs text-yellow-700">
        米国株はアナリスト予想比（EPS）で判定。日本株は前年同期比（増収増益/減収減益）で判定。投資判断の根拠として使用しないでください。
      </div>

      {surprises.length === 0 && (
        <p className="text-gray-400 text-center py-12">データがありません。バッチ実行後に表示されます。</p>
      )}

      {/* 好決算 */}
      {positive.length > 0 && (
        <section>
          <h2 className="font-semibold text-sm mb-2 text-red-600">▲ 好決算 / ポジティブサプライズ（{positive.length}件）</h2>
          <div className="bg-white rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  {['銘柄', '決算日', 'EPS差分', '営業利益YoY', '売上YoY', '翌日ギャップ', 'MA25↑', '判定方法'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {positive.map((s, i) => (
                  <tr key={i} className="hover:bg-red-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/stocks/${s.market}/${s.symbol}`} className="hover:text-blue-600">
                        <div className="font-semibold">{s.symbol}</div>
                        <div className="text-xs text-gray-400">{s.name}</div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{s.report_date}</td>
                    <td className="px-4 py-3">{pct(s.eps_surprise_pct)}</td>
                    <td className="px-4 py-3">{pct(s.op_profit_yoy_pct)}</td>
                    <td className="px-4 py-3">{pct(s.revenue_yoy_pct)}</td>
                    <td className="px-4 py-3">{pct(s.price_gap_pct)}</td>
                    <td className="px-4 py-3">
                      {s.ma25_rising === true ? <span className="text-red-500 font-semibold">▲</span>
                        : s.ma25_rising === false ? <span className="text-blue-500 font-semibold">▼</span>
                        : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3"><SurpriseMethodBadge s={s} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 悪決算 */}
      {negative.length > 0 && (
        <section>
          <h2 className="font-semibold text-sm mb-2 text-blue-600">▼ 悪決算 / ネガティブサプライズ（{negative.length}件）</h2>
          <div className="bg-white rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  {['銘柄', '決算日', 'EPS差分', '営業利益YoY', '売上YoY', '翌日ギャップ', 'MA25↑', '判定方法'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {negative.map((s, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/stocks/${s.market}/${s.symbol}`} className="hover:text-blue-600">
                        <div className="font-semibold">{s.symbol}</div>
                        <div className="text-xs text-gray-400">{s.name}</div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{s.report_date}</td>
                    <td className="px-4 py-3">{pct(s.eps_surprise_pct)}</td>
                    <td className="px-4 py-3">{pct(s.op_profit_yoy_pct)}</td>
                    <td className="px-4 py-3">{pct(s.revenue_yoy_pct)}</td>
                    <td className="px-4 py-3">{pct(s.price_gap_pct)}</td>
                    <td className="px-4 py-3">
                      {s.ma25_rising === true ? <span className="text-red-500 font-semibold">▲</span>
                        : s.ma25_rising === false ? <span className="text-blue-500 font-semibold">▼</span>
                        : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3"><SurpriseMethodBadge s={s} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
