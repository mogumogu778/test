import Link from 'next/link'
import { getUsStocks, getJpStocks, getEarningsSurprises } from '@/lib/data'
import type { EarningsSurprise, Stock } from '@/types/stock'

function SurpriseRow({ s }: { s: EarningsSurprise }) {
  const badge = s.is_positive_surprise
    ? 'bg-red-100 text-red-600'
    : 'bg-blue-100 text-blue-600'
  const label = s.is_positive_surprise ? '▲ 好決算' : '▼ 悪決算'
  const pct = s.eps_surprise_pct != null
    ? `EPS ${s.eps_surprise_pct > 0 ? '+' : ''}${s.eps_surprise_pct.toFixed(1)}%`
    : s.op_profit_yoy_pct != null
    ? `営業利益YoY ${s.op_profit_yoy_pct > 0 ? '+' : ''}${s.op_profit_yoy_pct.toFixed(1)}%`
    : '-'

  return (
    <Link href={`/stocks/${s.market}/${s.symbol}`}
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
        <div>
          <span className="font-semibold text-sm">{s.symbol}</span>
          <span className="text-xs text-gray-400 ml-2">{s.name}</span>
        </div>
      </div>
      <div className="text-right text-sm">
        <div className="text-gray-700 font-mono">{pct}</div>
        <div className="text-xs text-gray-400">{s.report_date}</div>
      </div>
    </Link>
  )
}

function MoverRow({ s }: { s: Stock }) {
  const color = (s.price_change_pct ?? 0) > 0 ? 'text-red-500' : 'text-blue-500'
  const sign  = (s.price_change_pct ?? 0) > 0 ? '+' : ''
  return (
    <Link href={`/stocks/${s.market}/${s.symbol}`}
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
      <div>
        <span className="font-semibold text-sm">{s.symbol}</span>
        <span className="text-xs text-gray-400 ml-2">{s.name}</span>
      </div>
      <span className={`text-sm font-mono font-semibold ${color}`}>
        {sign}{(s.price_change_pct ?? 0).toFixed(2)}%
      </span>
    </Link>
  )
}

export default function Dashboard() {
  const usData  = getUsStocks()
  const jpData  = getJpStocks()
  const { surprises } = getEarningsSurprises()

  const allStocks = [...usData.stocks, ...jpData.stocks]
  const recentSurprises = surprises.slice(0, 10)

  const topMovers = [...allStocks]
    .filter(s => s.price_change_pct != null)
    .sort((a, b) => Math.abs(b.price_change_pct!) - Math.abs(a.price_change_pct!))
    .slice(0, 10)

  const updatedAt = usData.updated_at
    ? new Date(usData.updated_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">ダッシュボード</h1>
        {updatedAt && <p className="text-xs text-gray-400">最終更新: {updatedAt}</p>}
      </div>

      {allStocks.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
          データがまだありません。GitHub Actions のバッチを手動実行すると表示されます。
        </div>
      )}

      {/* 市場サマリー */}
      {allStocks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: '米国株 銘柄数', value: usData.stocks.length, unit: '銘柄' },
            { label: '日本株 銘柄数', value: jpData.stocks.length, unit: '銘柄' },
            { label: '決算サプライズ', value: surprises.filter(s => s.is_positive_surprise).length, unit: '件（好決算）' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-white rounded-lg border p-4">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{value}<span className="text-sm text-gray-400 ml-1">{unit}</span></p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 決算サプライズ速報 */}
        <div className="bg-white rounded-lg border">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-semibold text-sm">決算サプライズ速報</h2>
            <Link href="/earnings/surprises" className="text-xs text-blue-600 hover:underline">すべて見る</Link>
          </div>
          {recentSurprises.length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">データなし</p>
            : <div className="divide-y">{recentSurprises.map((s, i) => <SurpriseRow key={i} s={s} />)}</div>
          }
          {recentSurprises.some(s => s.market === 'JP') && (
            <p className="text-xs text-gray-400 px-4 py-2 border-t">
              ※日本株は増収増益（前年同期比）で判定
            </p>
          )}
        </div>

        {/* 株価変動上位 */}
        <div className="bg-white rounded-lg border">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-semibold text-sm">株価変動上位（前日比）</h2>
            <Link href="/stocks" className="text-xs text-blue-600 hover:underline">銘柄一覧へ</Link>
          </div>
          {topMovers.length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">データなし</p>
            : <div className="divide-y">{topMovers.map((s, i) => <MoverRow key={i} s={s} />)}</div>
          }
        </div>
      </div>
    </div>
  )
}
