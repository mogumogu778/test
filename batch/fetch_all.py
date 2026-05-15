import yfinance as yf
import pandas as pd
import json
import os
import time
from datetime import datetime, timezone
from stocks_list import US_STOCKS, JP_STOCKS

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
PRICES_DIR = os.path.join(DATA_DIR, 'prices')
os.makedirs(PRICES_DIR, exist_ok=True)

SURPRISE_THRESHOLD = 5.0  # EPS差分がこの%以上でサプライズ判定


def safe_float(val) -> float | None:
    try:
        v = float(val)
        return None if pd.isna(v) else round(v, 4)
    except (TypeError, ValueError):
        return None


def safe_int(val) -> int | None:
    try:
        return int(val)
    except (TypeError, ValueError):
        return None


def calc_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = (-delta.clip(upper=0)).rolling(period).mean()
    rs = gain / loss.replace(0, float('nan'))
    return 100 - (100 / (1 + rs))


def compute_indicators(hist: pd.DataFrame) -> pd.DataFrame:
    close = hist['Close'].squeeze()
    hist = hist.copy()
    hist['RSI_14'] = calc_rsi(close, 14)
    hist['MA_5']   = close.rolling(5).mean()
    hist['MA_25']  = close.rolling(25).mean()
    hist['MA_75']  = close.rolling(75).mean()
    hist['MA_200'] = close.rolling(200).mean()
    return hist


def prices_to_list(hist: pd.DataFrame, days: int) -> tuple[list, list]:
    subset = hist.tail(days)
    prices, indicators = [], []
    for date, row in subset.iterrows():
        date_str = date.strftime('%Y-%m-%d')
        prices.append({
            'date':   date_str,
            'open':   safe_float(row['Open']),
            'high':   safe_float(row['High']),
            'low':    safe_float(row['Low']),
            'close':  safe_float(row['Close']),
            'volume': safe_int(row['Volume']),
        })
        indicators.append({
            'date':   date_str,
            'rsi_14': safe_float(row.get('RSI_14')),
            'ma_5':   safe_float(row.get('MA_5')),
            'ma_25':  safe_float(row.get('MA_25')),
            'ma_75':  safe_float(row.get('MA_75')),
            'ma_200': safe_float(row.get('MA_200')),
        })
    return prices, indicators


def fetch_us(all_surprises: list, all_calendar: list):
    stocks_data = []
    for symbol, name, sector in US_STOCKS:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period='2y', auto_adjust=True)
            if hist.empty or len(hist) < 5:
                print(f'  SKIP {symbol}: no data')
                continue

            hist = compute_indicators(hist)
            latest, prev = hist.iloc[-1], hist.iloc[-2]
            close = safe_float(latest['Close']) or 0
            prev_close = safe_float(prev['Close']) or 0
            price_change_pct = round((close - prev_close) / prev_close * 100, 2) if prev_close else 0
            high_52w = safe_float(hist['High'].rolling(252, min_periods=1).max().iloc[-1])
            low_52w  = safe_float(hist['Low'].rolling(252, min_periods=1).min().iloc[-1])

            stocks_data.append({
                'symbol':           symbol,
                'name':             name,
                'market':           'US',
                'sector':           sector,
                'close':            close,
                'prev_close':       prev_close,
                'price_change_pct': price_change_pct,
                'volume':           safe_int(latest['Volume']),
                'rsi_14':           safe_float(latest.get('RSI_14')),
                'ma_5':             safe_float(latest.get('MA_5')),
                'ma_25':            safe_float(latest.get('MA_25')),
                'ma_75':            safe_float(latest.get('MA_75')),
                'ma_200':           safe_float(latest.get('MA_200')),
                'high_52w':         high_52w,
                'low_52w':          low_52w,
                'date':             hist.index[-1].strftime('%Y-%m-%d'),
            })

            prices, indicators = prices_to_list(hist, 252)
            with open(os.path.join(PRICES_DIR, f'US_{symbol}.json'), 'w') as f:
                json.dump({'symbol': symbol, 'market': 'US',
                           'updated_at': datetime.now(timezone.utc).isoformat(),
                           'prices': prices, 'indicators': indicators}, f)

            # 決算データ
            try:
                ed = ticker.get_earnings_dates(limit=12)
                if ed is not None and not ed.empty:
                    for date, row in ed.iterrows():
                        eps_est = safe_float(row.get('EPS Estimate'))
                        eps_rep = safe_float(row.get('Reported EPS'))
                        date_str = date.strftime('%Y-%m-%d')

                        if eps_est is not None and eps_rep is not None:
                            pct = round((eps_rep - eps_est) / abs(eps_est) * 100, 2) if eps_est != 0 else None
                            if pct is not None and abs(pct) >= SURPRISE_THRESHOLD:
                                all_surprises.append({
                                    'symbol':            symbol,
                                    'name':              name,
                                    'market':            'US',
                                    'report_date':       date_str,
                                    'actual_eps':        eps_rep,
                                    'estimated_eps':     eps_est,
                                    'eps_surprise_pct':  pct,
                                    'revenue_yoy_pct':   None,
                                    'op_profit_yoy_pct': None,
                                    'earnings_pattern':  None,
                                    'price_gap_pct':     None,
                                    'is_positive_surprise': pct >= SURPRISE_THRESHOLD,
                                    'is_negative_surprise': pct <= -SURPRISE_THRESHOLD,
                                    'surprise_method':   'eps_analyst',
                                })
                        elif eps_rep is None and date > pd.Timestamp.now(tz=date.tzinfo):
                            all_calendar.append({
                                'symbol':         symbol,
                                'name':           name,
                                'market':         'US',
                                'scheduled_date': date_str,
                            })
            except Exception as e:
                print(f'  earnings error {symbol}: {e}')

            print(f'  OK {symbol}: {close}')
        except Exception as e:
            print(f'  ERROR {symbol}: {e}')
        time.sleep(0.5)

    with open(os.path.join(DATA_DIR, 'us_stocks.json'), 'w', encoding='utf-8') as f:
        json.dump({'updated_at': datetime.now(timezone.utc).isoformat(), 'stocks': stocks_data}, f, ensure_ascii=False)


def fetch_jp(all_surprises: list, all_calendar: list):
    stocks_data = []
    for yf_symbol, name, sector in JP_STOCKS:
        symbol = yf_symbol.replace('.T', '')
        try:
            ticker = yf.Ticker(yf_symbol)
            hist = ticker.history(period='2y', auto_adjust=True)
            if hist.empty or len(hist) < 5:
                print(f'  SKIP {yf_symbol}: no data')
                continue

            hist = compute_indicators(hist)
            latest, prev = hist.iloc[-1], hist.iloc[-2]
            close = safe_float(latest['Close']) or 0
            prev_close = safe_float(prev['Close']) or 0
            price_change_pct = round((close - prev_close) / prev_close * 100, 2) if prev_close else 0
            high_52w = safe_float(hist['High'].rolling(252, min_periods=1).max().iloc[-1])
            low_52w  = safe_float(hist['Low'].rolling(252, min_periods=1).min().iloc[-1])

            stocks_data.append({
                'symbol':           symbol,
                'name':             name,
                'market':           'JP',
                'sector':           sector,
                'close':            close,
                'prev_close':       prev_close,
                'price_change_pct': price_change_pct,
                'volume':           safe_int(latest['Volume']),
                'rsi_14':           safe_float(latest.get('RSI_14')),
                'ma_5':             safe_float(latest.get('MA_5')),
                'ma_25':            safe_float(latest.get('MA_25')),
                'ma_75':            safe_float(latest.get('MA_75')),
                'ma_200':           safe_float(latest.get('MA_200')),
                'high_52w':         high_52w,
                'low_52w':          low_52w,
                'date':             hist.index[-1].strftime('%Y-%m-%d'),
            })

            prices, indicators = prices_to_list(hist, 252)
            with open(os.path.join(PRICES_DIR, f'JP_{symbol}.json'), 'w', encoding='utf-8') as f:
                json.dump({'symbol': symbol, 'market': 'JP',
                           'updated_at': datetime.now(timezone.utc).isoformat(),
                           'prices': prices, 'indicators': indicators}, f, ensure_ascii=False)

            # 四半期財務データからYoY計算
            try:
                fin = ticker.quarterly_financials
                if fin is not None and not fin.empty and fin.shape[1] >= 4:
                    rev_row = next((r for r in ['Total Revenue', 'Revenue'] if r in fin.index), None)
                    op_row  = next((r for r in ['Operating Income', 'Operating Profit'] if r in fin.index), None)

                    if rev_row and op_row:
                        rev_now  = safe_float(fin.loc[rev_row].iloc[0])
                        rev_yoy  = safe_float(fin.loc[rev_row].iloc[4]) if fin.shape[1] > 4 else None
                        op_now   = safe_float(fin.loc[op_row].iloc[0])
                        op_yoy   = safe_float(fin.loc[op_row].iloc[4]) if fin.shape[1] > 4 else None

                        rev_yoy_pct = round((rev_now - rev_yoy) / abs(rev_yoy) * 100, 2) if rev_now and rev_yoy and rev_yoy != 0 else None
                        op_yoy_pct  = round((op_now - op_yoy) / abs(op_yoy) * 100, 2)   if op_now and op_yoy and op_yoy != 0  else None

                        if rev_yoy_pct is not None and op_yoy_pct is not None:
                            if rev_yoy_pct > 0 and op_yoy_pct > 0:
                                pattern = '増収増益'
                            elif rev_yoy_pct > 0:
                                pattern = '増収減益'
                            elif op_yoy_pct > 0:
                                pattern = '減収増益'
                            else:
                                pattern = '減収減益'

                            is_positive = pattern == '増収増益'
                            is_negative = pattern == '減収減益'

                            if is_positive or is_negative:
                                report_date = fin.columns[0].strftime('%Y-%m-%d') if hasattr(fin.columns[0], 'strftime') else str(fin.columns[0])[:10]
                                all_surprises.append({
                                    'symbol':            symbol,
                                    'name':              name,
                                    'market':            'JP',
                                    'report_date':       report_date,
                                    'actual_eps':        None,
                                    'estimated_eps':     None,
                                    'eps_surprise_pct':  None,
                                    'revenue_yoy_pct':   rev_yoy_pct,
                                    'op_profit_yoy_pct': op_yoy_pct,
                                    'earnings_pattern':  pattern,
                                    'price_gap_pct':     None,
                                    'is_positive_surprise': is_positive,
                                    'is_negative_surprise': is_negative,
                                    'surprise_method':   'yoy',
                                })
            except Exception as e:
                print(f'  financials error {yf_symbol}: {e}')

            print(f'  OK {yf_symbol}: {close}')
        except Exception as e:
            print(f'  ERROR {yf_symbol}: {e}')
        time.sleep(0.5)

    with open(os.path.join(DATA_DIR, 'jp_stocks.json'), 'w', encoding='utf-8') as f:
        json.dump({'updated_at': datetime.now(timezone.utc).isoformat(), 'stocks': stocks_data}, f, ensure_ascii=False)


def main():
    print('=== US stocks ===')
    all_surprises: list = []
    all_calendar:  list = []
    fetch_us(all_surprises, all_calendar)

    print('=== JP stocks ===')
    fetch_jp(all_surprises, all_calendar)

    all_surprises.sort(key=lambda x: x['report_date'], reverse=True)
    all_calendar.sort(key=lambda x: x['scheduled_date'])

    with open(os.path.join(DATA_DIR, 'earnings_surprises.json'), 'w', encoding='utf-8') as f:
        json.dump({'updated_at': datetime.now(timezone.utc).isoformat(), 'surprises': all_surprises}, f, ensure_ascii=False)

    with open(os.path.join(DATA_DIR, 'earnings_calendar.json'), 'w', encoding='utf-8') as f:
        json.dump({'updated_at': datetime.now(timezone.utc).isoformat(), 'events': all_calendar}, f, ensure_ascii=False)

    print('=== Done ===')


if __name__ == '__main__':
    main()
