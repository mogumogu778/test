'use client'
import { useState } from 'react'
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import type { PricePoint, IndicatorPoint } from '@/types/stock'

type Period = '1M' | '3M' | '1Y'
const PERIOD_DAYS: Record<Period, number> = { '1M': 30, '3M': 90, '1Y': 252 }

interface Props {
  prices: PricePoint[]
  indicators: IndicatorPoint[]
}

export function PriceChart({ prices, indicators }: Props) {
  const [period, setPeriod] = useState<Period>('3M')
  const [showMA, setShowMA] = useState({ ma25: true, ma75: true, ma200: false })

  const days = PERIOD_DAYS[period]
  const slicedPrices = prices.slice(-days)
  const slicedInds   = indicators.slice(-days)

  const data = slicedPrices.map((p, i) => ({
    ...p,
    ...(slicedInds[i] ?? {}),
    date: p.date.slice(5),
  }))

  const rsiData = slicedInds.map(ind => ({
    date: ind.date.slice(5),
    rsi_14: ind.rsi_14,
  }))

  return (
    <div className="space-y-4">
      {/* 期間切替 */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {(['1M', '3M', '1Y'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                period === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-3 text-xs text-gray-500 ml-4">
          {[
            { key: 'ma25',  label: 'MA25',  color: 'text-yellow-500' },
            { key: 'ma75',  label: 'MA75',  color: 'text-green-500' },
            { key: 'ma200', label: 'MA200', color: 'text-purple-500' },
          ].map(({ key, label, color }) => (
            <label key={key} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showMA[key as keyof typeof showMA]}
                onChange={e => setShowMA(prev => ({ ...prev, [key]: e.target.checked }))}
                className="accent-blue-600"
              />
              <span className={color}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 株価チャート */}
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} width={60} />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            formatter={(v: number) => v?.toFixed(2)}
          />
          <Bar dataKey="volume" yAxisId="vol" fill="#e5e7eb" opacity={0.5} />
          <Line type="monotone" dataKey="close" stroke="#2563eb" dot={false} strokeWidth={2} name="終値" />
          {showMA.ma25  && <Line type="monotone" dataKey="ma_25"  stroke="#f59e0b" dot={false} strokeWidth={1.5} name="MA25" />}
          {showMA.ma75  && <Line type="monotone" dataKey="ma_75"  stroke="#10b981" dot={false} strokeWidth={1.5} name="MA75" />}
          {showMA.ma200 && <Line type="monotone" dataKey="ma_200" stroke="#a855f7" dot={false} strokeWidth={1.5} name="MA200" />}
          <YAxis yAxisId="vol" orientation="right" hide />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* RSIチャート */}
      <div>
        <p className="text-xs text-gray-400 mb-1 pl-1">RSI (14)</p>
        <ResponsiveContainer width="100%" height={100}>
          <ComposedChart data={rsiData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} ticks={[30, 70]} tick={{ fontSize: 9 }} width={30} />
            <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => v?.toFixed(1)} />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" />
            <ReferenceLine y={30} stroke="#3b82f6" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="rsi_14" stroke="#6366f1" dot={false} strokeWidth={1.5} name="RSI" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
