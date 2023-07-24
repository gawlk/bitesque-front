import { findCurrency } from '/src/scripts'

import Fiat, {
  defaultCurrency,
  defaultInitialAmount,
  defaultRecurrentAmount,
} from './components/fiat'
import Frequency, { defaultIsDateAConversionDay } from './components/frequency'
import Interval, {
  defaultEnd as defaultEndDate,
  defaultStart as defaultStartDate,
} from './components/interval'

export default () => {
  const [state, setState] = createStore({
    fiat: {
      currency: defaultCurrency,
      initial: defaultInitialAmount,
      recurrent: defaultRecurrentAmount,
    },
    frequency: {
      isDateAConversionDay: defaultIsDateAConversionDay,
    },
    interval: {
      start: defaultStartDate,
      end: defaultEndDate,
    },
  })

  return (
    <div class="space-y-12 p-4">
      <Fiat
        {...state.fiat}
        setter={(key, value) =>
          value !== undefined &&
          setState(
            'fiat',
            key,
            key === 'currency' ? findCurrency(value) : Number(value)
          )
        }
      />
      <Frequency
        setter={(isDateAConversionDay) =>
          setState('frequency', {
            isDateAConversionDay,
          })
        }
      />
      <Interval
        setter={(start, end) =>
          setState('interval', {
            start,
            end,
          })
        }
      />
    </div>
  )
}
