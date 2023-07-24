import {
  IconArrowNarrowRight,
  IconLetterC,
  IconLetterH,
  IconLetterL,
  IconLetterO,
  IconLetterV,
  IconRulerMeasure,
} from '@tabler/icons-solidjs'

import { percentageToUSLocale, priceToUSLocale } from '/src/scripts'

import Icon from '/src/components/icon'

interface Props {
  candle: CandlestickDataWithVolume | null
}

export default (props: Props) => {
  const roundPercentage = (p: number) => Math.floor(p * 1000) / 10

  const isDown = createMemo(
    () => props.candle && props.candle.open > props.candle?.close
  )

  const percantageChange = createMemo(() =>
    roundPercentage(
      props.candle ? props.candle.close / props.candle.open - 1 : 0
    )
  )

  return (
    <div class="grid w-[40rem] auto-cols-max grid-flow-col gap-2">
      <div class="flex items-center space-x-0.5">
        <Icon icon={IconLetterO} />
        <span>{priceToUSLocale(props.candle?.open || -1) || '-'}</span>
      </div>
      <div class="flex items-center space-x-0.5">
        <Icon icon={IconLetterH} />
        <span>{priceToUSLocale(props.candle?.high || -1) || '-'}</span>
      </div>
      <div class="flex items-center space-x-0.5">
        <Icon icon={IconLetterL} />
        <span>{priceToUSLocale(props.candle?.low || -1) || '-'}</span>
      </div>
      <div class="flex items-center space-x-0.5">
        <Icon icon={IconLetterC} />

        <span>{priceToUSLocale(props.candle?.close || -1) || '-'}</span>
      </div>
      <div class="flex items-center space-x-0.5">
        <Icon icon={IconLetterV} />

        <span>{props.candle?.volume || '-'}</span>
      </div>
      <div class="flex items-center space-x-0.5">
        <Icon
          icon={IconArrowNarrowRight}
          class={`${
            percantageChange() > 0
              ? '-rotate-45'
              : percantageChange() < 0
              ? 'rotate-45'
              : ''
          }`}
        />

        <span>{percentageToUSLocale(percantageChange())}</span>
      </div>
      <div class="col-span-1 flex items-center space-x-0.5">
        <Icon icon={IconRulerMeasure} class="rotate-90" />

        <span>
          {percentageToUSLocale(
            roundPercentage(
              props.candle
                ? (isDown()
                    ? props.candle.low / props.candle.high
                    : props.candle.high / props.candle.low) - 1
                : 0
            )
          )}
        </span>
      </div>
    </div>
  )
}
