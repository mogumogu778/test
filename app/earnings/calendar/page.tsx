import { getEarningsCalendar } from '@/lib/data'
import Link from 'next/link'

export default function CalendarPage() {
  const { events, updated_at } = getEarningsCalendar()

  const updatedAt = updated_at
    ? new Date(updated_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    : null

  const grouped = events.reduce<Record<string, typeof events>>((acc, e) => {
    acc[e.scheduled_date] = acc[e.scheduled_date] ?? []
    acc[e.scheduled_date].push(e)
    return acc
  }, {})
  const dates = Object.keys(grouped).sort()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold">決算カレンダー</h1>
        {updatedAt && <p className="text-xs text-gray-400">最終更新: {updatedAt}</p>}
      </div>

      {dates.length === 0 && (
        <p className="text-gray-400 text-center py-12">データがありません。バッチ実行後に表示されます。</p>
      )}

      <div className="space-y-4">
        {dates.map(date => (
          <div key={date} className="bg-white rounded-lg border">
            <div className="px-4 py-2 bg-gray-50 border-b text-sm font-semibold text-gray-700">
              📅 {date}（{grouped[date].length}件）
            </div>
            <div className="divide-y">
              {grouped[date].map((e, i) => (
                <Link key={i} href={`/stocks/${e.market}/${e.symbol}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors">
                  <div>
                    <span className="font-semibold text-sm">{e.symbol}</span>
                    <span className="text-xs text-gray-400 ml-2">{e.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    e.market === 'US' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {e.market}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
