import { Title } from '@solidjs/meta'
import {
  IconCalendar,
  IconChartCandle,
  IconChartLine,
} from '@tabler/icons-solidjs'
import { LineStyle } from 'lightweight-charts'

import {
  binanceAPI,
  colors,
  getCandleToColor,
  priceToUSLocale,
} from '/src/scripts'
import { debounce } from '/src/scripts'

import {
  fetchHistoricalCandlesticks,
  getAverageVolume,
  getVolumeBlockColor,
  setMinMaxMarkers,
} from './scripts'

import DialogSelect from '/src/components/dialogSelect'
import Label from '/src/components/label'

import { createAutoscaleInfoProvider } from '../scripts'

interface Props {
  chart: LightweightCharts.IChartApi | null
  setCandlesticksFetched: () => void
  setCrosshairCandlestick: (candle: CandlestickDataWithVolume | null) => void
  setCandlesticks: (candles: CandlestickDataWithVolume[]) => void
  setVolumeMA: (dataList: LightweightCharts.LineData[]) => void
}

export default (props: Props) => {
  const [state, setState] = createStore({
    lastCandle: null as CandlestickDataWithVolume | null,
    ma: 21,
  })

  const candlesticks: CandlestickDataWithVolume[] = []

  let ws: WebSocket | null = null

  createEffect(() => {
    const chart = props.chart
    if (!chart) return

    console.log('market: setup')

    const priceSeries = chart.addCandlestickSeries({
      upColor: colors.green,
      downColor: colors.red,
      wickUpColor: colors.green,
      wickDownColor: colors.red,
      borderVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
      autoscaleInfoProvider: createAutoscaleInfoProvider(true),
    })

    const priceLineOptions: LightweightCharts.PriceLineOptions = {
      price: 0,
      color: 'transparent',
      lineVisible: true,
      lineWidth: 1,
      lineStyle: 3,
      axisLabelVisible: true,
      title: '',
    }

    const priceLine = priceSeries.createPriceLine(priceLineOptions)

    const updatePriceLine = (candle: CandlestickDataWithVolume) =>
      priceLine.applyOptions({
        price: candle.close,
        color: getCandleToColor(candle),
      })

    const volumeOptions: LightweightCharts.DeepPartial<
      LightweightCharts.HistogramStyleOptions &
        LightweightCharts.SeriesOptionsCommon
    > = {
      priceFormat: {
        type: 'volume' as const,
      },
      priceLineVisible: false,
      priceScaleId: '',
      lastValueVisible: false,
    }

    const volumeSeries = chart.addHistogramSeries({
      ...volumeOptions,
    })

    const volumeMASeries = chart.addLineSeries({
      ...volumeOptions,
      color: colors.white,
      lineWidth: 2,
      lineStyle: LineStyle.SparseDotted,
      crosshairMarkerVisible: false,
    })

    ;[volumeSeries, volumeMASeries].map((series) =>
      series.priceScale().applyOptions({
        scaleMargins: {
          top: 0.9,
          bottom: 0,
        },
      })
    )

    fetchHistoricalCandlesticks((_candlesticks) => {
      candlesticks.push(..._candlesticks)

      const lastCandle = candlesticks.at(-1)

      if (lastCandle) {
        setState('lastCandle', lastCandle)

        updatePriceLine(lastCandle)
      }

      priceSeries.setData(
        candlesticks.map((data) => ({
          time: data.time,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
        }))
      )

      const averageVolumeData = getAverageVolume(candlesticks, state.ma)

      volumeMASeries.setData(averageVolumeData)

      volumeSeries.setData(
        candlesticks.map((data, index) => ({
          time: data.time,
          value: data.volume,
          color: getVolumeBlockColor(data, averageVolumeData[index].value),
        }))
      )

      setMinMaxMarkers(chart, priceSeries, candlesticks)

      props.setCandlesticksFetched()

      props.setCandlesticks(candlesticks)

      props.setVolumeMA(averageVolumeData)
    })

    const initWebSocket = () => {
      ws = binanceAPI.createLiveCandleWebsocket((candle) => {
        if (state.lastCandle) {
          setState('lastCandle', candle)

          priceSeries.update({ ...candle })

          updatePriceLine(candle)

          const lastCandle = candlesticks.at(-1)

          if (!lastCandle || lastCandle.time !== candle.time) {
            candlesticks.push(candle)
          } else {
            Object.assign(lastCandle, candle)
          }

          const averageVolume = getAverageVolume(
            candlesticks.slice(-state.ma),
            state.ma
          ).at(-1)

          if (averageVolume) {
            volumeMASeries.update(averageVolume)

            volumeSeries.update({
              time: candle.time,
              value: candle.volume,
              color: getVolumeBlockColor(candle, averageVolume.value),
            })
          }
        }
      })
    }

    initWebSocket()

    document.addEventListener('focus', () => {
      if (!ws || ws.readyState === ws.CLOSED) {
        initWebSocket()
      }
    })

    chart.subscribeCrosshairMove(
      debounce((event: LightweightCharts.MouseEventParams) => {
        return

        const priceSeriesData = event.seriesPrices.get(priceSeries)

        priceSeriesData &&
          props.setCrosshairCandlestick({
            ...(priceSeriesData as unknown as LightweightCharts.CandlestickData),
            time: '',
            volume: event.seriesPrices.get(volumeSeries) as number,
          })
      })
    )
  })

  onCleanup(() => ws?.close)

  return () => (
    <>
      <Title>
        {() =>
          `${
            state.lastCandle
              ? `${priceToUSLocale(state.lastCandle.close)} | `
              : ''
          }bittemp`
        }
      </Title>
      <Label label="Price">
        <DialogSelect
          id="price-series-kind"
          button={{
            leftIcon: IconCalendar,
            pre: 'Series',
            text: 'state.settings.price.type',
          }}
          title="Select a kind"
          list={{
            selected: null,
            values: [
              {
                value: 'line',
                label: 'Line',
                icon: IconChartLine,
              },
              {
                value: 'candlestick',
                label: 'Candles',
                icon: IconChartCandle,
              },
            ],
          }}
          onClose={(value?: string) => {
            if (value) {
              // setState('chart', 'series', )
              console.log(value)
            }
          }}
        />
      </Label>
    </>
  )
}
