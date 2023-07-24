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
      const dataset = await this.fetchJSON<FetchedCoinGeckoAssetMarketChart>(
        `/coins/bitcoin/market_chart?vs_currency=${
          parameters.currency || 'usd'
        }&days=max&interval=daily`
      )

      let previousDate: Date | undefined

      return dataset.prices
        .map(
          (
            [timestamp, price]: [number, number],
            index: number,
            arr: [number, number][]
          ): CoinGeckoAssetMarketChart[] => {
            const date = new Date(timestamp)

            // Prices are opens we want closes
            if (index < arr.length - 1) {
              date.setUTCHours(0, 0, 0, 0)
              date.setUTCDate(date.getUTCDate() - 1)
            }

            const numberOfDaysToFill = previousDate
              ? (date.getTime() - previousDate.getTime()) / (1000 * 3600 * 24)
              : 1

            previousDate = date

            return new Array(Math.floor(numberOfDaysToFill))
              .fill(0)
              .map((_, _index) => {
                const _date = new Date(date)

                if (_index) {
                  _date.setDate(_date.getDate() - _index)
                }

                return {
                  time: dateToString(_date),
                  price,
                  volume: dataset.total_volumes[index][1] / price,
                  marketCap: dataset.market_caps[index][1],
                }
              })
              .reverse()
          }
        )
        .flat()
    },
  }
}
