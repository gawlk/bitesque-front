import { IconCheck, IconListSearch, IconSelector } from '@tabler/icons-solidjs'

import { addLocationToID } from '/src/scripts'

import Button, { ButtonProps } from './button'
import Dialog, { type CustomDialogButtonProps } from './dialog'
import Input, { type Props as InputProps } from './input'

interface SelfProps {
  id: string
  search?: Omit<InputProps, 'onInput'>
  list: {
    selected: string | null
    values:
      | string[]
      | {
          value: string
          label?: string | SolidJS.JSX.Element
          icon?: ((...args: any[]) => SolidJS.JSX.Element) | undefined
        }[]
  }
}

interface Props extends SelfProps, SolidJS.ParentProps {
  button: CustomDialogButtonProps
  title: string
  onClose: (value?: string) => void
}

export default (props: Props) => {
  const [state, setState] = createStore({
    input: undefined as string | undefined,
  })

  const id = addLocationToID(props.id)

  const saved = localStorage.getItem(id)

  if (saved) {
    props.onClose(saved)
  }

  return (
    <Dialog
      title={props.title}
      button={mergeProps(props.button, {
        id,
        role: 'listbox' as const,
        full: props.button.full ?? true,
        rightIcon: IconSelector,
        rightIconClass: '',
      } as ButtonProps)}
      onClose={(value?: string) => {
        if (value) {
          localStorage.setItem(id, value)
        } else {
          localStorage.removeItem(id)
        }

        props.onClose(value)
      }}
      sticky={
        props.search ? (
          <Input
            {...props.search}
            leftIcon={IconListSearch}
            pre="Name"
            class={`${props.search.class} flex-none`}
            onInput={(value?: string) => setState('input', value)}
          />
        ) : undefined
      }
      form={
        <div class="space-y-2">
          {() => {
            const list = createMemo(() =>
              (props.list.values || [])
                .map((value) =>
                  typeof value === 'string'
                    ? {
                        value,
                      }
                    : value
                )
                .filter(
                  (obj) =>
                    !state.input ||
                    (typeof obj.label === 'string'
                      ? obj.label
                      : // @ts-ignore next-line
                        obj.label.textContent
                    )
                      .toLowerCase()
                      .includes(state.input.toLowerCase())
                )
            )

            return (
              <Show when={list().length} fallback="The list is empty.">
                <For each={list()}>
                  {(obj) => (
                    <Button
                      full
                      leftIcon={obj.icon}
                      rightIcon={
                        props.list.selected === obj.value ? IconCheck : true
                      }
                      value={obj.value}
                    >
                      <span class="w-full truncate text-left">
                        {obj.label || obj.value}
                      </span>
                    </Button>
                  )}
                </For>
              </Show>
            )
          }}
        </div>
      }
    />
  )
}
