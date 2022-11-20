interface ChartProps {
  options: LightweightCharts.DeepPartial<LightweightCharts.ChartOptions>
  series: ChartSeries[]
}

interface ChartSeries {
  main?: boolean
  kind: 'histogram' | 'line'
  getData: () => Promise<ChartData[]>
  options?: LightweightCharts.DeepPartial<
    (
      | LightweightCharts.AreaStyleOptions
      | LightweightCharts.BarStyleOptions
      | LightweightCharts.BaselineStyleOptions
      | LightweightCharts.CandlestickStyleOptions
      | LightweightCharts.HistogramStyleOptions
      | LightweightCharts.LineStyleOptions
    ) &
      LightweightCharts.SeriesOptionsCommon
  >
}

interface ChartData extends LightweightCharts.WhitespaceData {
  value?: number
  color?: string
}

declare namespace LightweightCharts {
  export type IChartApi = import('lightweight-charts').IChartApi
  export type ISeriesApi<T> = import('lightweight-charts').ISeriesApi<T>
  export type IPriceLine = import('lightweight-charts').IPriceLine
  export type ChartOptions = import('lightweight-charts').ChartOptions
  export type DeepPartial<T> = import('lightweight-charts').DeepPartial<T>
  export type SeriesOptionsCommon =
    import('lightweight-charts').SeriesOptionsCommon
  export type AreaStyleOptions = import('lightweight-charts').AreaStyleOptions
  export type BarStyleOptions = import('lightweight-charts').BarStyleOptions
  export type BaselineStyleOptions =
    import('lightweight-charts').BaselineStyleOptions
  export type CandlestickStyleOptions =
    import('lightweight-charts').CandlestickStyleOptions
  export type HistogramStyleOptions =
    import('lightweight-charts').HistogramStyleOptions
  export type LineStyleOptions = import('lightweight-charts').LineStyleOptions
  export type SingleValueData = import('lightweight-charts').SingleValueData
  export type WhitespaceData = import('lightweight-charts').WhitespaceData
  export type LineData = import('lightweight-charts').LineData
  export type TimeRange = import('lightweight-charts').TimeRange
  export type LogicalRange = import('lightweight-charts').LogicalRange
  export type AutoscaleInfo = import('lightweight-charts').AutoscaleInfo
}
