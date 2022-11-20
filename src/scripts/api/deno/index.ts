import { dateToString } from '/src/scripts'

import { createBaseAPI } from '../base'

export const createDenoAPI = () => {
  return {
    ...createBaseAPI({
      baseUrl: window.location.href.startsWith('https')
        ? 'https://bittemp-back.deno.dev'
        : 'http://localhost:8000',
    }),
    fetchBitcoinRealizedPrice: function () {
      return this.fetchJSON<LightweightCharts.SingleValueData[]>(
        `/bitcoin/realized`
      )
    },
    fetchBitcoinBalancedPrice: function () {
      return this.fetchJSON<LightweightCharts.SingleValueData[]>(
        `/bitcoin/balanced`
      )
    },
    fetchBitcoinCVDD: function () {
      return this.fetchJSON<LightweightCharts.SingleValueData[]>(
        `/bitcoin/cvdd`
      )
    },
    fetchBitcoinTerminalPrice: function () {
      return this.fetchJSON<LightweightCharts.SingleValueData[]>(
        `/bitcoin/terminal`
      )
    },
    fetchBitcoinFundingRates: async function () {
      return (
        await this.fetchJSON<LightweightCharts.SingleValueData[]>(
          `/bitcoin/funding-rates`
        )
      ).map((rate) => {
        const date = new Date(String(rate.time))

        // Date are opens not closes
        date.setUTCDate(date.getUTCDate() - 1)

        rate.time = dateToString(date)

        return rate
      })
    },
  }
}
