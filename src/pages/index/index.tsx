import Color from 'colorjs.io'

import {
  average,
  createCoinGeckoAPI,
  createDenoAPI,
  dateToString,
} from '/src/scripts'

import Chart from './components/chart'

import LogoURL from '/src/assets/logoWhite.svg?url'

console.log(LogoURL)

export default () => {
  const [state, setState] = createStore({
    chart: null as ChartProps | null,
  })

  onMount(async () => {
    const coinGecko = createCoinGeckoAPI()

    const deno = createDenoAPI()

    const bitcoinMarketChart = await coinGecko.fetchBitcoinMarketChart({
      currency: 'usd',
    })

    const terminalPrice = (async () => await deno.fetchBitcoinTerminalPrice())()

    const multiplyChartDataValue = (
      data: ChartData,
      multiplier: number
    ): ChartData => ({
      ...data,
      value: data.value ? data.value * multiplier : data.value,
    })

    const ma = 21
    const averageVolume = bitcoinMarketChart.map((data, index, arr) => ({
      time: data.time,
      value:
        index > ma - 1
          ? average(
              arr.slice(index - (ma - 1), index).map((data) => data.volume)
            )
          : NaN,
    }))

    setState('chart', {
      series: [
        {
          kind: 'histogram',
          getData: async () =>
            ['2012-11-28', '2016-07-09', '2020-05-11', '2024-03-23']
              .map((halvingStr, index, halvings) => {
                const computeData = (date: Date, off?: boolean) => ({
                  time: dateToString(date),
                  value: 0,
                  color: `#e9983d${off ? '66' : 'bb'}`,
                })

                const halvingQuarters = []

                const halving = new Date(halvingStr)

                if (index) {
                  const getMidDate = (date1: Date, date2: Date) =>
                    new Date((date1.valueOf() + date2.valueOf()) / 2)

                  const previousHalving = new Date(halvings[index - 1])

                  const halving2Q = getMidDate(previousHalving, halving)

                  const halving1Q = getMidDate(previousHalving, halving2Q)

                  const halving3Q = getMidDate(halving2Q, halving)

                  halvingQuarters.push(
                    computeData(halving1Q, true),
                    computeData(halving2Q, true),
                    computeData(halving3Q, true)
                  )
                }

                return [...halvingQuarters, computeData(halving)]
              })
              .flat()
              .filter((data) => new Date(data.time) < new Date()),
          options: {
            priceScaleId: 'background',
            base: 1,
            lastValueVisible: false,
            priceLineVisible: false,
          },
        },
        {
          kind: 'line',
          getData: async () => terminalPrice,
          options: {
            title: 'Terminal',
            color: '#9d4edd',
            priceLineVisible: false,
          },
        },
        {
          kind: 'line',
          getData: async () =>
            (await terminalPrice).map((data) =>
              multiplyChartDataValue(data, 0.75)
            ),
          options: {
            title: 'Terminal * 0.75',
            color: '#9d4edd66',
            priceLineVisible: false,
          },
        },
        {
          kind: 'line',
          getData: async () =>
            (await terminalPrice).map((data) =>
              multiplyChartDataValue(data, 0.5)
            ),
          options: {
            title: 'Terminal / 2',
            color: '#9d4edd66',
            priceLineVisible: false,
          },
        },
        {
          kind: 'line',
          getData: async () =>
            (await terminalPrice).map((data) =>
              multiplyChartDataValue(data, 0.25)
            ),
          options: {
            title: 'Terminal / 4',
            color: '#9d4edd66',
            priceLineVisible: false,
          },
        },
        {
          kind: 'line',
          getData: async () =>
            (await terminalPrice).map((data) =>
              multiplyChartDataValue(data, 1 / 8)
            ),
          options: {
            title: 'Terminal / 8',
            color: '#9d4edd66',
            priceLineVisible: false,
          },
        },
        {
          kind: 'line',
          getData: async () => deno.fetchBitcoinCVDD(),
          options: {
            title: 'CVDD',
            color: '#7fb800',
            priceLineVisible: false,
          },
        },
        {
          kind: 'line',
          getData: async () => deno.fetchBitcoinBalancedPrice(),
          options: {
            title: 'Balanced',
            color: '#ffb400',
            priceLineVisible: false,
          },
        },
        {
          kind: 'line',
          getData: async () => deno.fetchBitcoinRealizedPrice(),
          options: {
            title: 'Realized',
            color: '#ec7505',
            priceLineVisible: false,
          },
        },
        {
          main: true,
          kind: 'line',
          getData: async () => {
            const fundingRates = await deno.fetchBitcoinFundingRates()

            const values = fundingRates.map((rate) => rate.value)

            const max = Math.max(...values)
            const min = Math.min(...values)

            const white = new Color('#fff')
            const red = new Color('#f6511d')
            const blue = new Color('#00a6ed')

            const getColor = (time: string) => {
              const rate = fundingRates.find((rate) => rate.time === time)

              if (rate) {
                const value = rate.value

                return (
                  new Color(
                    (value > 0
                      ? white.mix(blue, value / max)
                      : white.mix(red, value / min)) as any
                  ).to('srgb') as any
                ).toString({
                  format: 'hex',
                })
              } else {
                return '#fff'
              }
            }

            return bitcoinMarketChart.map(
              (data): ChartData => ({
                time: data.time,
                value: data.price,
                color: getColor(data.time),
              })
            )
          },
          options: {
            title: 'Price',
            color: '#fff',
            priceLineStyle: 3,
          },
        },
        {
          kind: 'line',
          getData: async () => averageVolume,
          options: {
            color: '#f0c14488',
            priceLineVisible: false,
            priceFormat: {
              type: 'volume',
            },
            priceScaleId: '',
            lineWidth: 2,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
            scaleMargins: {
              top: 0.85,
              bottom: 0,
            },
          },
        },
        {
          kind: 'histogram',
          getData: async () =>
            bitcoinMarketChart.map((data, index) => ({
              time: data.time,
              value: data.volume,
              color: `${
                data.price > (bitcoinMarketChart[index - 1]?.price || 0)
                  ? '#52a39a'
                  : '#dd5e56'
              }${data.volume > averageVolume[index].value * 1.5 ? 'dd' : '88'}`,
            })),
          options: {
            priceLineVisible: false,
            priceFormat: {
              type: 'volume',
            },
            priceScaleId: '',
            lastValueVisible: false,
            scaleMargins: {
              top: 0.85,
              bottom: 0,
            },
          },
        },
      ],
      options: {
        rightPriceScale: {
          scaleMargins: { bottom: 0.15, top: 0.15 },
        },
      },
    })
  })

  return (
    <div class="h-screen">
      <Show when={state.chart !== null}>
        <Chart {...(state.chart as ChartProps)} />
      </Show>
    </div>
  )
}
