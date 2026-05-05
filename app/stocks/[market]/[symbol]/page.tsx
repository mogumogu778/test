import { notFound } from 'next/navigation'
import { getUsStocks, getJpStocks, getStockDetail } from '@/lib/data'
import { PriceChart } from '@/components/PriceChart'
import type { Market } from '@/types/stock'

function IndicatorCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-lg border p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

interface Props {
  params: Promise<{ market: string; symbol: string }>
}

export default async function StockDetailPage({ params }: Props) {
  const { market: rawMarket, symbol } = await params
  const market = rawMarket.toUpperCase() as Market

  const usData = getUsStocks()
  const jpData = getJpStocks()
  const allStocks = [...usData.stocks, ...jpData.stocks]
  const stock = allStocks.find(s => s.market === market && s.symbol === symbol)
  if (!stock) notFound()

  const detail = getStockDetail(market, symbol)

  const rsiLabel = stock.rsi_14 == null ? '-'
    : stock.rsi_14 >= 70 ? `${stock.rsi_14.toFixed(1)} 高水準`
    : stock.rsi_14 <= 30 ? `${stock.rsi_14.toFixed(1)} 低水準`
    : stock.rsi_14.toFixed(1)

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg border p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{market}</span>
              <span className="text-xs text-gray-400">{stock.sector}</span>
            </div>
            <h1 className="text-2xl font-bold mt-1">{symbol}</h1>
            <p className="text-gray-500 text-sm">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{stock.close.toFixed(2)}</p>
            <p className={`text-lg font-semibold ${stock.price_change_pct > 0 ? 'text-red-500' : stock.price_change_pct < 0 ? 'text-blue-500' : 'text-gray-500'}`}>
              {stock.price_change_pct > 0 ? '+' : ''}{stock.price_change_pct.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">{stock.date}</p>
          </div>
        </div>
      </div>

      {/* テクニカル指標カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <IndicatorCard label="RSI (14)" value={rsiLabel} />
        <IndicatorCard label="MA 25日" value={stock.ma_25?.toFixed(2) ?? '-'} />
        <IndicatorCard label="MA 75日" value={stock.ma_75?.toFixed(2) ?? '-'} />
        <IndicatorCard label="MA 200日" value={stock.ma_200?.toFixed(2) ?? '-'} />
        <IndicatorCard label="52週高値" value={stock.high_52w?.toFixed(2) ?? '-'} />
        <IndicatorCard label="52週安値" value={stock.low_52w?.toFixed(2) ?? '-'} />
        <IndicatorCard label="MA 5日" value={stock.ma_5?.toFixed(2) ?? '-'} />
        <IndicatorCard label="出来高" value={stock.volume ? (stock.volume / 1_000_000).toFixed(1) + 'M' : '-'} />
      </div>

      {/* チャート */}
      {detail ? (
        <div className="bg-white rounded-lg border p-5">
          <h2 className="font-semibold text-sm mb-4">株価チャート</h2>
          <PriceChart prices={detail.prices} indicators={detail.indicators} />
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border p-8 text-center text-gray-400 text-sm">
          チャートデータがありません。バッチ実行後に表示されます。
        </div>
      )}
    </div>
  )
}
