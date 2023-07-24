import { IconChevronRight, IconX } from '@tabler/icons-solidjs'

import { removeProps } from '/src/scripts'

import Button, { type ButtonProps } from './button'
import DialogDivider from './dialogDivider'

interface DialogButtonProps {
  text?: string | SolidJS.JSX.Element
}

type DialogButtonPropsKeys = keyof Required<DialogButtonProps>

const propsSpecificToDialogButton: { [T in DialogButtonPropsKeys]: boolean } = {
  text: true,
}

export interface CustomDialogButtonProps
  extends ButtonProps,
    DialogButtonProps {}

interface SelfProps {
  button: CustomDialogButtonProps
  title: string
  sticky?: SolidJS.JSX.Element
  form?: SolidJS.JSX.Element
  full?: true
  onClose?: (value?: string) => void
}

type SelfPropsKeys = keyof Required<SelfProps>

const propsSpecificToComponent: { [T in SelfPropsKeys]: boolean } = {
  button: true,
  sticky: true,
  form: true,
  title: true,
  full: true,
  onClose: true,
}

interface Props
  extends SelfProps,
    Omit<SolidJS.JSX.DialogHTMLAttributes, 'onClose' | 'title'> {}

// TODO:
// https://tympanus.net/codrops/2021/10/06/how-to-implement-and-style-the-dialog-element/
// https://web.dev/building-a-dialog-component

export default (props: Props) => {
  let dialog: HTMLDialogElement | undefined
  let close: HTMLButtonElement | undefined

  const [state, setState] = createStore({
    open: false,
    value: '',
  })

  const buttonProps = createMemo(() =>
    mergeProps(removeProps(props.button, propsSpecificToDialogButton), {
      rightIcon: props.button.rightIcon ?? IconChevronRight,
      rightIconClass:
        props.button.rightIconClass ??
        'group-hover:translate-x-1 will-change-transform',
    })
  )

  const dialogProps = createMemo(() =>
    removeProps(props, propsSpecificToComponent)
  )

  return (
    <div class={`${props.button.full ? 'w-full' : ''}`}>
      <Button
        {...buttonProps()}
        onClick={() => {
          dialog?.showModal()

          setTimeout(() => {
            setState('open', true)
          }, 1)
        }}
        title={props.title}
      >
        <span class="flex-1 truncate text-left">{props.button.text}</span>
      </Button>
      <dialog
        {...dialogProps()}
        onClose={() => {
          props.onClose?.(state.value || undefined)
        }}
        onTransitionEnd={(event) => {
          if (event.target === dialog && !state.open) {
            dialog.close()
          }
        }}
        ref={dialog}
        class={[
          props.full ? 'h-full' : '',
          state.open ? 'open:translate-y-0 open:opacity-100' : '',
          'peer top-auto bottom-0 mt-[5vh] max-h-[95vh] w-full max-w-full translate-y-4 flex-col space-y-4 rounded-t-2xl border-t border-neutral-600 bg-black p-6 pb-0 text-white opacity-0 transition duration-200 backdrop:bg-black/25 backdrop:backdrop-blur-sm open:flex  motion-reduce:transform-none motion-reduce:transition-none md:top-[10vh] md:mt-0 md:h-fit md:max-h-[32rem] md:max-w-2xl md:rounded-b-2xl md:border',
        ].join(' ')}
      >
        <div class="flex items-center">
          <Button
            ref={close}
            icon={IconX}
            onClick={() =>
              setState({
                value: '',
                open: false,
              })
            }
            class="mr-4"
          />
          <h2 class="flex-grow truncate text-center text-xl font-semibold">
            {props.title}
          </h2>
          <span
            class="min-w-0 flex-1"
            style={{
              'max-width': '2.75rem',
            }}
          />
        </div>
        <DialogDivider />
        {props.sticky}
        <Show when={props.sticky}>
          <DialogDivider />
        </Show>
        <div class="!my-0 -mx-4 flex-1 overflow-y-auto p-4 pb-6">
          {props.children}
          <form
            method="dialog"
            onSubmit={(event) => {
              event.preventDefault()

              setState({
                value:
                  'value' in event.submitter
                    ? (event.submitter.value as string)
                    : '',
                open: false,
              })
            }}
          >
            {props.form}
          </form>
        </div>
      </dialog>
    </div>
  )
}
