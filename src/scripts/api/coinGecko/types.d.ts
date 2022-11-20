interface FetchedCoinGeckoAssetMarketChart {
  prices: [timestamp: number, price: number][]
  market_caps: [timestamp: number, marketCap: number][]
  total_volumes: [timestamp: number, totalVolume: number][]
}

interface CoinGeckoAssetMarketChart {
  time: string
  price: number
  volume: number
  marketCap: number
}
