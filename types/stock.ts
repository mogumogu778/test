export type Market = 'US' | 'JP'

export type EarningsPattern = '増収増益' | '増収減益' | '減収増益' | '減収減益' | 'N/A'

export interface Stock {
  symbol: string
  name: string
  market: Market
  sector: string
  close: number
  prev_close: number
  price_change_pct: number
  volume: number
  rsi_14: number | null
  ma_5: number | null
  ma_25: number | null
  ma_75: number | null
  ma_200: number | null
  high_52w: number | null
  low_52w: number | null
  date: string
}

export interface StockList {
  updated_at: string
  stocks: Stock[]
}

export interface PricePoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface IndicatorPoint {
  date: string
  rsi_14: number | null
  ma_5: number | null
  ma_25: number | null
  ma_75: number | null
  ma_200: number | null
}

export interface StockDetail {
  symbol: string
  market: Market
  updated_at: string
  prices: PricePoint[]
  indicators: IndicatorPoint[]
}

export interface EarningsSurprise {
  symbol: string
  name: string
  market: Market
  report_date: string
  actual_eps: number | null
  estimated_eps: number | null
  eps_surprise_pct: number | null
  revenue_yoy_pct: number | null
  op_profit_yoy_pct: number | null
  earnings_pattern: EarningsPattern | null
  price_gap_pct: number | null
  is_positive_surprise: boolean
  is_negative_surprise: boolean
  surprise_method: 'eps_analyst' | 'yoy'
}

export interface EarningsSurpriseList {
  updated_at: string
  surprises: EarningsSurprise[]
}

export interface EarningsEvent {
  symbol: string
  name: string
  market: Market
  scheduled_date: string
}

export interface EarningsCalendar {
  updated_at: string
  events: EarningsEvent[]
}
