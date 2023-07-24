import { IconRepeat, IconWallet } from '@tabler/icons-solidjs'

import { currencies, findCurrency } from '/src/scripts'

import DialogSelect from '/src/components/dialogSelect'
import Input from '/src/components/input'
import Section from '/src/components/section'
import SpanCurrency from '/src/components/spanCurrency'

interface Props extends Fiat {
  setter: (key: keyof Fiat, value?: string) => void
}

export const defaultCurrency = findCurrency('USD')
export const defaultInitialAmount = 1000
export const defaultRecurrentAmount = 100

export default (props: Props) => {
  const id = 'investment'

  return (
    <Section
      id={id}
      number={1}
      title="Fiat"
      description="First you'll have to choose the amount of your FIAT money you'll be converting in this simulation. The initial amount is going to be completely converted on the first day of the choose time frame, whereas the recurring amount is the amount of money converted repeatably."
    >
      <div class="space-y-2">
        <DialogSelect
          id="currency"
          button={{
            leftIcon: props.currency.icon,
            pre: 'Currency',
            text: <SpanCurrency currency={props.currency} />,
          }}
          title="Select a currency"
          search={{
            placeholder: 'Currency',
          }}
          list={{
            selected: props.currency.symbol,
            values: currencies.map((currency) => ({
              icon: currency.icon,
              value: currency.symbol,
              label: <SpanCurrency currency={currency} />,
            })),
          }}
          onClose={(value?: string) => props.setter('currency', value)}
        />
        <For
          each={[
            {
              pre: 'Initial',
              svg: IconWallet,
            },
            {
              pre: 'Recurrent',
              svg: IconRepeat,
            },
          ]}
        >
          {(obj) => {
            const key = obj.pre.toLowerCase() as 'initial' | 'recurrent'

            return (
              <Input
                id={`${id}-${key}`}
                leftIcon={obj.svg}
                pre={obj.pre}
                value={props[key]}
                placeholder="Enter an amount here"
                min={0}
                onInput={(value) => props.setter(key, value)}
              />
            )
          }}
        </For>
      </div>
    </Section>
  )
}
