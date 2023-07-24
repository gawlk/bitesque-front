import { colors, denoAPI, mixColors } from '/src/scripts'

import { defaultLineOptions } from './scripts'

interface Props {
  chart: LightweightCharts.IChartApi | null
  show: boolean
  setDataList: (dataList: LightweightCharts.LineData[]) => void
}

export default (props: Props) => {
  const cvddPromise = denoAPI.fetchBitcoinCVDD()

  createEffect(() => {
    const chart = props.chart
    if (!chart) return

    console.log('cvdd: setup')

    const seriesOptions: LightweightCharts.DeepPartial<
      LightweightCharts.LineStyleOptions & LightweightCharts.SeriesOptionsCommon
    > = {
      ...defaultLineOptions,
      color: mixColors(colors.black, colors.cyan),
    }

    const series = chart.addLineSeries(seriesOptions)

    createEffect(() => {
      series.applyOptions({
        visible: props.show,
      })
    })

    cvddPromise.then((dataList) => {
      props.setDataList(dataList)

      series.setData(dataList)
    })
  })

  return () => <></>
}
