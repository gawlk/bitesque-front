import { colors, denoAPI, mixColors } from '/src/scripts'

import { defaultLineOptions } from './scripts'

const multiplyDataList = (
  dataList: LightweightCharts.SingleValueData[],
  multiplier: number
) =>
  dataList.map((data) => ({
    ...data,
    value: data.value ? data.value * multiplier : data.value,
  }))

interface Props {
  chart: LightweightCharts.IChartApi | null
  show: boolean
  setTerminal100: (dataList: LightweightCharts.LineData[]) => void
  setTerminal75: (dataList: LightweightCharts.LineData[]) => void
  setTerminal50: (dataList: LightweightCharts.LineData[]) => void
  setTerminal25: (dataList: LightweightCharts.LineData[]) => void
}

export default (props: Props) => {
  const terminalPromise = denoAPI.fetchBitcoinTerminalPrice()

  createEffect(() => {
    const chart = props.chart
    if (!chart) return

    console.log('terminals: setup')
    ;[
      {
        color: colors.rose,
        multiplier: 1,
        setter: props.setTerminal100,
      },
      {
        color: colors.pink,
        multiplier: 0.75,
        setter: props.setTerminal75,
      },
      {
        color: colors.fuchsia,
        multiplier: 0.5,
        setter: props.setTerminal50,
      },
      {
        color: colors.purple,
        multiplier: 0.25,
        setter: props.setTerminal25,
      },
    ].forEach(async (config) => {
      const seriesOptions: LightweightCharts.DeepPartial<
        LightweightCharts.LineStyleOptions &
          LightweightCharts.SeriesOptionsCommon
      > = {
        ...defaultLineOptions,
        color: mixColors(colors.black, config.color),
      }

      const series = chart.addLineSeries(seriesOptions)

      createEffect(() => {
        series.applyOptions({
          visible: props.show,
        })
      })

      const dataList = multiplyDataList(
        await terminalPromise,
        config.multiplier
      )

      config.setter(dataList)

      series.setData(dataList)
    })
  })

  return () => <></>
}
