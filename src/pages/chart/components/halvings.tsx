import { LineType } from 'lightweight-charts'

import {
  colors,
  dateToString,
  getDateBetweenTwoDates,
  mixColors,
} from '/src/scripts'

import { createAutoscaleInfoProvider } from './scripts'

interface Props {
  chart: LightweightCharts.IChartApi | null
  show: boolean
  dependencies: {
    candles: CandlestickDataWithVolume[] | null
  }
  setHalvings: () => void
}

export default (props: Props) => {
  createEffect(() => {
    const chart = props.chart
    if (!chart) return

    console.log('halvings: setup')

    const seriesOptions: LightweightCharts.DeepPartial<
      LightweightCharts.AreaStyleOptions & LightweightCharts.SeriesOptionsCommon
    > = {
      lastValueVisible: false,
      priceLineVisible: false,
      lineType: LineType.WithSteps,
      invertFilledArea: true,
      lineColor: 'transparent',
      topColor: 'transparent',
      bottomColor: 'transparent',
      autoscaleInfoProvider: createAutoscaleInfoProvider(),
    }

    const series = chart.addAreaSeries(seriesOptions)

    createEffect(() => {
      series.applyOptions({
        visible: props.show,
      })
    })

    props.setHalvings()

    createEffect(() => {
      const { candles } = props.dependencies

      if (!candles || !candles.length) return

      untrack(() => {
        const quarters = [
          '2009-01-03',
          '2012-11-28',
          '2016-07-09',
          '2020-05-11',
          '2024-03-23',
        ]
          .map((halvingStr, index, halvingList) => {
            const halvingQuarters = []

            if (index) {
              const halving1Q = new Date(halvingList[index - 1])

              const halving5Q = new Date(halvingStr)

              const halving3Q = getDateBetweenTwoDates(halving1Q, halving5Q)

              const halving2Q = getDateBetweenTwoDates(halving1Q, halving3Q)

              const halving4Q = getDateBetweenTwoDates(halving3Q, halving5Q)

              halvingQuarters.push(
                computeQuarter(halving1Q, 1),
                computeQuarter(halving2Q, 2),
                computeQuarter(halving3Q, 3),
                computeQuarter(halving4Q, 4)
              )

              index === halvingList.length - 1 &&
                halvingQuarters.push(computeQuarter(halving5Q, 1))
            }

            return halvingQuarters
          })
          .flat()

        console.log(quarters)

        series.setData(
          candles.slice(0, -1).map((candle) => {
            const date = new Date(candle.time)

            while (
              quarters.length >= 2 &&
              date > quarters[0].date &&
              date > quarters[1].date
            ) {
              const quarter = quarters.shift()
              console.log('shifted', quarter)
            }

            const color = quarters[0].color

            return {
              time: candle.time,
              value: candle.close,
              bottomColor: color,
              topColor: `${mixColors(colors.black, color, 0.1)}`,
            }
          })
        )
      })
    })
  })

  return () => <></>
}

const computeQuarter = (date: Date, number: 1 | 2 | 3 | 4) => ({
  date,
  color: mixColors(
    colors.black,
    number === 1
      ? colors.yellow
      : number === 2
      ? colors.orange
      : number === 3
      ? colors.pink
      : colors.purple
  ),
})
