import { createResizeObserver } from '@solid-primitives/resize-observer'
import { createChart } from 'lightweight-charts'
import { unwrap } from 'solid-js/store'

import { debounce } from '/src/scripts'

export default (props: ChartProps) => {
  const seriesList: LightweightCharts.ISeriesApi<
    'Area' | 'Histogram' | 'Line'
  >[] = []

  let chart: LightweightCharts.IChartApi | undefined
  let div: HTMLDivElement | undefined

  const computeChartDimensions = () => ({
    width: div?.parentElement?.clientWidth || 0,
    height: div?.clientHeight || 0,
  })

  const resize = () => {
    if (chart) {
      const chartDimensions = computeChartDimensions()

      chart.resize(chartDimensions.width, chartDimensions.height)
    }
  }

  createResizeObserver(() => document.body, debounce(resize))

  onMount(async () => {
    if (div) {
      chart = createChart(div, {
        layout: {
          background: { color: '#00000000' },
          textColor: '#ddd',
        },
        grid: {
          vertLines: { color: '#222' },
          horzLines: { color: '#222' },
        },
        ...props.options,
        ...computeChartDimensions(),
      })

      let mainAutoScaleInfo: LightweightCharts.AutoscaleInfo | null = null

      await Promise.all(
        props.series.map(async (parameters) => {
          const autoscaleInfoProvider = (
            getInfo: () => LightweightCharts.AutoscaleInfo | null
          ) => {
            if (parameters.main) {
              mainAutoScaleInfo = getInfo()
            }

            return mainAutoScaleInfo || getInfo()
          }

          const seriesOptions = unwrap(parameters.options)

          const series =
            parameters.kind === 'line'
              ? chart?.addLineSeries({
                  autoscaleInfoProvider:
                    parameters.options?.priceScaleId !== undefined
                      ? undefined
                      : autoscaleInfoProvider,
                  ...seriesOptions,
                })
              : parameters.kind === 'histogram'
              ? chart?.addHistogramSeries({
                  ...seriesOptions,
                })
              : undefined

          if (series) {
            series.setData(await parameters.getData())

            series.applyOptions({
              visible: true,
            })
          }
        })
      )

      chart
        ?.priceScale('background')
        .applyOptions({ scaleMargins: { bottom: 0, top: 0 } })
    }
  })

  onCleanup(() => {
    chart?.remove()
    chart = undefined
  })

  return <div ref={div} class={'h-full'} />
}
