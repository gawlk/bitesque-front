import { LineType } from 'lightweight-charts'

import { colors, mixColors } from '/src/scripts'

import { createAutoscaleInfoProvider } from './scripts'

interface Props {
  chart: LightweightCharts.IChartApi | null
  show: boolean
  dependencies: {
    candles: CandlestickDataWithVolume[] | null
    realized: LightweightCharts.LineData[] | null
    balanced: LightweightCharts.LineData[] | null
    cvdd: LightweightCharts.LineData[] | null
    terminals: {
      '100': LightweightCharts.LineData[] | null
      '50': LightweightCharts.LineData[] | null
      '25': LightweightCharts.LineData[] | null
    }
  }
  setTemperature: (dataList: LightweightCharts.HistogramData[]) => void
}

export default (props: Props) => {
  createEffect(() => {
    const chart = props.chart
    if (!chart) return

    console.log('temperature: setup')

    const seriesOptions: LightweightCharts.DeepPartial<
      LightweightCharts.AreaStyleOptions & LightweightCharts.SeriesOptionsCommon
    > = {
      lastValueVisible: false,
      priceLineVisible: false,
      lineType: LineType.WithSteps,
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

    const dataList: LightweightCharts.AreaData[] = []

    props.setTemperature(dataList)

    createEffect(() => {
      dataList.length = 0

      const { candles, realized, balanced, cvdd, terminals } =
        props.dependencies

      if (
        !candles ||
        !realized ||
        !balanced ||
        !cvdd ||
        !terminals ||
        !terminals[100] ||
        !terminals[50] ||
        !terminals[25]
      )
        return

      console.log('temperature: updating dataList')

      untrack(() => {
        let top: number | null = null

        const colorBuy = colors.sky
        const colorCaution = colors.yellow
        const colorSell = colors.orange
        const colorWait = colors.emerald

        candles?.slice(0, -1).forEach((candle, index) => {
          const { open, low, high, close } = candle

          if (close < realized[index].value) {
            top = null
          }

          if (terminals[100] && close > terminals[100][index].value) {
            top = terminals[100][index].value
          }

          const topColor =
            low < cvdd[index].value && low < balanced[index].value
              ? colorBuy
              : low < cvdd[index].value || low < balanced[index].value
              ? mixColors(colors.black, colorBuy, 0.75)
              : close < realized[index].value
              ? mixColors(colors.black, colorBuy, 0.66)
              : !top && terminals[25] && close < terminals[25][index].value
              ? mixColors(colors.black, colorBuy, 0.45)
              : !top && terminals[50] && close < terminals[50][index].value
              ? mixColors(colors.black, colorBuy, 0.33)
              : top && close > top
              ? mixColors(colors.black, colorSell, 0.33)
              : top
              ? mixColors(colors.black, colorWait, 0.33)
              : mixColors(colors.black, colorCaution, 0.33)

          dataList.push({
            time: candle.time,
            value: close,
            topColor,
            bottomColor:
              topColor !== 'transparent' && topColor !== colors.black
                ? mixColors(colors.black, topColor, 0.05)
                : topColor,
          })
        })

        series.setData(dataList)
      })
    })
  })

  return () => <></>
}
