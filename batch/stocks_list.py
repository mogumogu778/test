US_STOCKS = [
    # Technology
    ("AAPL",  "Apple Inc.",                  "Technology"),
    ("MSFT",  "Microsoft Corp.",             "Technology"),
    ("GOOGL", "Alphabet Inc.",               "Technology"),
    ("META",  "Meta Platforms",              "Technology"),
    ("ORCL",  "Oracle Corp.",                "Technology"),
    ("ACN",   "Accenture plc",               "Technology"),
    ("CSCO",  "Cisco Systems",               "Technology"),
    ("IBM",   "IBM Corp.",                   "Technology"),
    ("ADBE",  "Adobe Inc.",                  "Technology"),
    ("INTU",  "Intuit Inc.",                 "Technology"),
    # Semiconductors
    ("NVDA",  "NVIDIA Corp.",                "Semiconductors"),
    ("AVGO",  "Broadcom Inc.",               "Semiconductors"),
    ("AMD",   "Advanced Micro Devices",      "Semiconductors"),
    ("TXN",   "Texas Instruments",           "Semiconductors"),
    ("QCOM",  "Qualcomm Inc.",               "Semiconductors"),
    ("AMAT",  "Applied Materials",           "Semiconductors"),
    ("MU",    "Micron Technology",           "Semiconductors"),
    ("LRCX",  "Lam Research",               "Semiconductors"),
    # Consumer Discretionary
    ("AMZN",  "Amazon.com Inc.",             "Consumer Disc."),
    ("TSLA",  "Tesla Inc.",                  "Consumer Disc."),
    ("HD",    "Home Depot",                  "Consumer Disc."),
    ("MCD",   "McDonald's Corp.",            "Consumer Disc."),
    ("BKNG",  "Booking Holdings",            "Consumer Disc."),
    # Consumer Staples
    ("COST",  "Costco Wholesale",            "Consumer Staples"),
    ("WMT",   "Walmart Inc.",               "Consumer Staples"),
    ("PG",    "Procter & Gamble",            "Consumer Staples"),
    ("KO",    "Coca-Cola Co.",               "Consumer Staples"),
    # Healthcare
    ("LLY",   "Eli Lilly and Co.",           "Healthcare"),
    ("UNH",   "UnitedHealth Group",          "Healthcare"),
    ("JNJ",   "Johnson & Johnson",           "Healthcare"),
    ("ABBV",  "AbbVie Inc.",                 "Healthcare"),
    ("ISRG",  "Intuitive Surgical",          "Healthcare"),
    ("AMGN",  "Amgen Inc.",                  "Healthcare"),
    ("TMO",   "Thermo Fisher Scientific",    "Healthcare"),
    # Financials
    ("JPM",   "JPMorgan Chase",              "Financials"),
    ("V",     "Visa Inc.",                   "Financials"),
    ("MA",    "Mastercard Inc.",             "Financials"),
    ("BAC",   "Bank of America",             "Financials"),
    ("GS",    "Goldman Sachs",               "Financials"),
    ("SPGI",  "S&P Global Inc.",             "Financials"),
    ("AXP",   "American Express",            "Financials"),
    # Streaming / SaaS
    ("NFLX",  "Netflix Inc.",                "Streaming"),
    ("CRM",   "Salesforce Inc.",             "SaaS"),
    ("NOW",   "ServiceNow Inc.",             "SaaS"),
    # AI / Security
    ("PLTR",  "Palantir Technologies",       "AI/Data"),
    ("PANW",  "Palo Alto Networks",          "Security"),
    ("CRWD",  "CrowdStrike Holdings",        "Security"),
    # Others
    ("XOM",   "ExxonMobil Corp.",            "Energy"),
    ("GE",    "GE Aerospace",                "Industrials"),
    ("UBER",  "Uber Technologies",           "Platform"),
]

JP_STOCKS = [
    # 自動車
    ("7203.T", "トヨタ自動車",                "自動車"),
    ("7267.T", "本田技研工業",               "自動車"),
    ("6902.T", "デンソー",                   "自動車部品"),
    # 銀行・金融
    ("8306.T", "三菱UFJフィナンシャルグループ", "銀行"),
    ("8316.T", "三井住友フィナンシャルグループ", "銀行"),
    ("8411.T", "みずほフィナンシャルグループ",  "銀行"),
    # 総合テック・電機
    ("6758.T", "ソニーグループ",              "総合テック"),
    ("6501.T", "日立製作所",                 "ITサービス"),
    ("6752.T", "パナソニックホールディングス",  "電機"),
    ("6503.T", "三菱電機",                   "電機"),
    ("6594.T", "ニデック",                   "モーター"),
    # 半導体・FA
    ("6861.T", "キーエンス",                 "FA/センサー"),
    ("8035.T", "東京エレクトロン",             "半導体製造装置"),
    ("6920.T", "レーザーテック",              "半導体検査"),
    ("6857.T", "アドバンテスト",              "半導体テスト"),
    ("6146.T", "ディスコ",                   "半導体加工"),
    ("4063.T", "信越化学工業",               "半導体材料"),
    ("6723.T", "ルネサスエレクトロニクス",     "半導体"),
    ("6954.T", "ファナック",                  "産業ロボット"),
    # 製薬
    ("4502.T", "武田薬品工業",               "製薬"),
    ("4568.T", "第一三共",                   "製薬"),
    ("4519.T", "中外製薬",                   "製薬"),
    ("4578.T", "大塚ホールディングス",         "製薬"),
    # 通信
    ("9432.T", "NTT",                        "通信"),
    ("9433.T", "KDDI",                       "通信"),
    # IT・ネット
    ("9984.T", "ソフトバンクグループ",         "IT投資"),
    ("6702.T", "富士通",                     "ITサービス"),
    ("4307.T", "野村総合研究所",              "ITサービス"),
    ("6098.T", "リクルートホールディングス",    "HRテック"),
    ("4751.T", "サイバーエージェント",         "デジタル広告"),
    ("4755.T", "楽天グループ",               "EC/Fintech"),
    ("3994.T", "マネーフォワード",             "Fintech SaaS"),
    ("2413.T", "エムスリー",                 "医療IT"),
    # 商社
    ("8058.T", "三菱商事",                   "総合商社"),
    ("8031.T", "三井物産",                   "総合商社"),
    ("8002.T", "丸紅",                       "総合商社"),
    # 小売・消費
    ("9983.T", "ファーストリテイリング",        "アパレル"),
    ("4452.T", "花王",                       "日用品"),
    ("2802.T", "味の素",                     "食品"),
    # 精密・光学
    ("7741.T", "HOYA",                       "光学"),
    ("7751.T", "キヤノン",                   "精密機器"),
    ("7733.T", "オリンパス",                 "精密機器"),
    # ゲーム・エンタメ
    ("7974.T", "任天堂",                     "ゲーム"),
    ("7832.T", "バンダイナムコホールディングス", "ゲーム"),
    # 不動産
    ("8801.T", "三井不動産",                 "不動産"),
    # 重工・インフラ
    ("7011.T", "三菱重工業",                 "重工業"),
    ("6367.T", "ダイキン工業",               "空調"),
    # 鉄道
    ("9022.T", "東海旅客鉄道",               "鉄道"),
    ("9020.T", "東日本旅客鉄道",              "鉄道"),
    # レジャー
    ("4661.T", "オリエンタルランド",           "レジャー"),
]
