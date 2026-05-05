'use client'
import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { StockTable } from '@/components/StockTable'
import type { Stock, Market } from '@/types/stock'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type SortKey = 'price_change_pct' | 'rsi_14' | 'volume'

export default function StocksPage() {
  const [market, setMarket]   = useState<Market>('US')
  const [sector, setSector]   = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('price_change_pct')
  const [order, setOrder]     = useState<'asc' | 'desc'>('desc')

  const file = market === 'US' ? '/data/us_stocks.json' : '/data/jp_stocks.json'
  const { data, error, isLoading } = useSWR<{ stocks: Stock[]; updated_at: string }>(file, fetcher)

  const sectors = useMemo(() => {
    if (!data) return []
    return Array.from(new Set(data.stocks.map(s => s.sector))).sort()
  }, [data])

  const stocks = useMemo(() => {
    if (!data) return []
    let list = data.stocks
    if (sector) list = list.filter(s => s.sector === sector)
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? -Infinity
      const bv = b[sortKey] ?? -Infinity
      return order === 'desc' ? (bv as number) - (av as number) : (av as number) - (bv as number)
    })
    return list
  }, [data, sector, sortKey, order])

  const updatedAt = data?.updated_at
    ? new Date(data.updated_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold">銘柄一覧</h1>
        {updatedAt && <p className="text-xs text-gray-400">最終更新: {updatedAt}</p>}
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-3">
        <div className="flex rounded-lg border overflow-hidden text-sm">
          {(['US', 'JP'] as Market[]).map(m => (
            <button key={m} onClick={() => { setMarket(m); setSector('') }}
              className={`px-4 py-2 font-medium transition-colors ${market === m ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {m === 'US' ? '🇺🇸 米国株' : '🇯🇵 日本株'}
            </button>
          ))}
        </div>

        <select value={sector} onChange={e => setSector(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white text-gray-700">
          <option value="">全セクター</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">並び替え:</span>
          {([
            { key: 'price_change_pct', label: '前日比' },
            { key: 'rsi_14',           label: 'RSI' },
            { key: 'volume',           label: '出来高' },
          ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
            <button key={key} onClick={() => sortKey === key ? setOrder(o => o === 'desc' ? 'asc' : 'desc') : setSortKey(key)}
              className={`px-3 py-1.5 rounded border transition-colors ${sortKey === key ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {label}{sortKey === key ? (order === 'desc' ? ' ↓' : ' ↑') : ''}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-center text-gray-400 py-12">読み込み中...</p>}
      {error    && <p className="text-center text-red-400 py-12">データの取得に失敗しました</p>}
      {!isLoading && !error && <StockTable stocks={stocks} />}
    </div>
  )
}
