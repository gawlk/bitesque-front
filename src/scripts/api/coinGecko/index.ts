import { dateToString } from '/src/scripts'

import { createBaseAPI } from '../base'

export const createCoinGeckoAPI = () => {
  return {
    ...createBaseAPI({
      baseUrl: 'https://api.coingecko.com/api/v3',
      rate: {
        max: 50,
        timeout: 60000,
      },
    }),
    fetchBitcoinMarketChart: async function (parameters: { currency: string }) {
      let cgDataset = await this.fetchJSON<FetchedCoinGeckoAssetMarketChart>(
        `/coins/bitcoin/market_chart?vs_currency=${
          parameters.currency || 'usd'
        }&days=max&interval=daily`
      )

      const dataset = cgDataset.prices.map(
        (
          [timestamp, price]: [number, number],
          index: number,
          arr: [number, number][]
        ): CoinGeckoAssetMarketChart => {
          const date = new Date(timestamp)

          // Prices are opens we want closes
          if (index < arr.length - 1) {
            date.setUTCHours(0, 0, 0, 0)
            date.setUTCDate(date.getUTCDate() - 1)
          }

          return {
            time: dateToString(date),
            price,
            volume: cgDataset.total_volumes[index][1] / price,
            marketCap: cgDataset.market_caps[index][1],
          }
        }
      )

      return dataset
    },
  }
}
