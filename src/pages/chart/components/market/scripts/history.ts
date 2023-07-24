import { binanceAPI } from '/src/scripts'

export const fetchHistoricalCandlesticks = (
  callback: (dataList: CandlestickDataWithVolume[]) => void
) =>
  Promise.all([
    import('/src/assets/data/btcusd.json').then(
      (i) => i.default as CandlestickDataWithVolume[]
    ),
    binanceAPI.fetchBitcoinMarketChart(),
  ]).then((dataLists) => callback(dataLists.flat()))
