import { IconSettings, IconTestPipe } from '@tabler/icons-solidjs'

import Dialog from '/src/components/dialog'
import Label from '/src/components/label'

import Balanced from './components/balanced'
import Chart from './components/chart/index'
import CVDD from './components/cvdd'
import Halvings from './components/halvings'
import Legend from './components/legend'
import Market from './components/market/index'
import Realized from './components/realized'
import Temperature from './components/temperature'
import Terminals from './components/terminals'

import Base from '../../components/container'

export default () => {
  const [state, setState] = createStore({
    chart: null as LightweightCharts.IChartApi | null,
    candlesticksFetched: false,
    crosshairCandle: null as null | CandlestickDataWithVolume,
    series: {
      halvings: null as true | null,
      temperature: null as LightweightCharts.HistogramData[] | null,
      terminals: {
        '100': null as LightweightCharts.LineData[] | null,
        '75': null as LightweightCharts.LineData[] | null,
        '50': null as LightweightCharts.LineData[] | null,
        '25': null as LightweightCharts.LineData[] | null,
      },
      cvdd: null as LightweightCharts.LineData[] | null,
      balanced: null as LightweightCharts.LineData[] | null,
      realized: null as LightweightCharts.LineData[] | null,
      market: {
        candles: null as CandlestickDataWithVolume[] | null,
        volumeMA: null as LightweightCharts.LineData[] | null,
      },
    },
  })

  return (
    <div class="relative flex h-screen max-h-screen flex-col pb-2">
      <Chart
        setChart={(chart) => setState('chart', chart)}
        class={state.candlesticksFetched ? 'opacity-100' : 'opacity-0'}
      />
      <div class="absolute top-0 left-0 z-10 m-4">
        <div class="flex space-x-2">
          <Dialog
            button={{
              icon: IconSettings,
            }}
            title="Settings"
          >
            <Market
              chart={state.series.realized && state.chart}
              setCandlesticksFetched={() =>
                setState('candlesticksFetched', true)
              }
              setCrosshairCandlestick={(candle) =>
                setState('crosshairCandle', candle)
              }
              setCandlesticks={(candlesticks) =>
                setState('series', 'market', 'candles', candlesticks)
              }
              setVolumeMA={(dataList) =>
                setState('series', 'market', 'volumeMA', dataList)
              }
            />
            <Realized
              chart={state.series.balanced && state.chart}
              show={state.candlesticksFetched}
              setDataList={(dataList) =>
                setState('series', 'realized', dataList)
              }
            />

            <Balanced
              chart={state.series.cvdd && state.chart}
              show={state.candlesticksFetched}
              setDataList={(dataList) =>
                setState('series', 'balanced', dataList)
              }
            />
            <CVDD
              chart={state.series.terminals[100] && state.chart}
              show={state.candlesticksFetched}
              setDataList={(dataList) => setState('series', 'cvdd', dataList)}
            />
            <Terminals
              chart={state.series.temperature && state.chart}
              show={state.candlesticksFetched}
              setTerminal100={(dataList) =>
                setState('series', 'terminals', '100', dataList)
              }
              setTerminal75={(dataList) =>
                setState('series', 'terminals', '75', dataList)
              }
              setTerminal50={(dataList) =>
                setState('series', 'terminals', '50', dataList)
              }
              setTerminal25={(dataList) =>
                setState('series', 'terminals', '25', dataList)
              }
            />
            <Temperature
              chart={state.series.halvings && state.chart}
              show={state.candlesticksFetched}
              setTemperature={(dataList) =>
                setState('series', 'temperature', dataList)
              }
              dependencies={{
                candles: state.series.market.candles,
                realized: state.series.realized,
                balanced: state.series.balanced,
                cvdd: state.series.cvdd,
                terminals: state.series.terminals,
              }}
            />
            <Halvings
              chart={state.chart}
              show={state.candlesticksFetched}
              setHalvings={() => setState('series', 'halvings', true)}
              dependencies={{
                candles: state.series.market.candles,
              }}
            />
          </Dialog>
          <Dialog
            button={{
              icon: IconTestPipe,
            }}
            title="Simulation"
          >
            <Label label="Simulation">
              <div>ekop</div>
            </Label>
          </Dialog>
          <Base>
            <Legend candle={state.crosshairCandle} />
          </Base>
        </div>
      </div>
    </div>
  )
}
