import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type {
  StockList,
  StockDetail,
  EarningsSurpriseList,
  Market,
} from '@/types/stock'

const DATA_DIR = join(process.cwd(), 'public', 'data')

function readJson<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) return fallback
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as T
  } catch {
    return fallback
  }
}

const emptyStockList: StockList = { updated_at: '', stocks: [] }
const emptySurpriseList: EarningsSurpriseList = { updated_at: '', surprises: [] }

export function getUsStocks(): StockList {
  return readJson(join(DATA_DIR, 'us_stocks.json'), emptyStockList)
}

export function getJpStocks(): StockList {
  return readJson(join(DATA_DIR, 'jp_stocks.json'), emptyStockList)
}

export function getStockDetail(market: Market, symbol: string): StockDetail | null {
  const filePath = join(DATA_DIR, 'prices', `${market}_${symbol}.json`)
  return readJson<StockDetail | null>(filePath, null)
}

export function getEarningsSurprises(): EarningsSurpriseList {
  return readJson(join(DATA_DIR, 'earnings_surprises.json'), emptySurpriseList)
}
