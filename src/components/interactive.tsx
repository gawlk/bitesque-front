import { removeProps } from '/src/scripts'

import Container from './container'
import Icon from './icon'

import { styleToCSSProperties } from '/src/styles'

interface SelfProps {
  // Text
  pre?: string

  // Width
  full?: boolean

  // Padding
  square?: boolean

  // Center
  center?: boolean

  // State
  disabled?: boolean
  clickable?: boolean
  focusable?: boolean

  // Icons
  icon?: IconProp
  leftIcon?: IconProp
  rightIcon?: IconProp

  // Classes
  iconClass?: string
  leftIconClass?: string
  rightIconClass?: string

  // Styles
  iconStyle?: string | SolidJS.JSX.CSSProperties
  leftIconStyle?: string | SolidJS.JSX.CSSProperties
  rightIconStyle?: string | SolidJS.JSX.CSSProperties
}

type SelfPropsKeys = keyof Required<SelfProps>

export const propsSpecificToInteractive: {
  [T in SelfPropsKeys]: boolean
} = {
  disabled: false,

  pre: true,
  full: true,
  square: true,
  center: true,
  clickable: true,
  focusable: true,
  icon: true,
  leftIcon: true,
  rightIcon: true,
  iconClass: true,
  leftIconClass: true,
  rightIconClass: true,
  iconStyle: true,
  leftIconStyle: true,
  rightIconStyle: true,
}

export interface InteractiveProps extends SelfProps, ContainerProps {}

interface Props extends InteractiveProps {
  component: string | SolidJS.Component<any>
}

export default (props: Props) => {
  const dynamicProps = removeProps<Props>(props, propsSpecificToInteractive)

  const iconsProps = removeProps<Props>(props, {
    class: true,
  })

  return (
    <Container
      {...dynamicProps}
      class={[
        // Width
        props.full && 'w-full min-w-0',

        // Padding
        !props.icon && !props.square && 'px-4',

        // Center
        props.center && 'justify-center',

        // Hover color
        !props.disabled && 'hover:brightness-150',

        // Active
        !props.disabled && 'active:brightness-75',

        // State
        props.disabled
          ? 'opacity-60'
          : props.clickable || props.focusable
          ? `group ${props.clickable ? 'clickable' : 'focusable'}`
          : '',

        'inline-flex items-center',
      ]
        .filter((c) => c)
        .join(' ')
        .trim()}
    >
      <Show
        when={!props.icon}
        fallback={
          <Icon
            {...iconsProps}
            icon={props.icon}
            class={props.iconClass}
            style={styleToCSSProperties(props.iconStyle)}
          />
        }
      >
        <Show when={props.leftIcon}>
          <Icon
            {...iconsProps}
            icon={props.leftIcon}
            left={true}
            class={props.leftIconClass}
            style={styleToCSSProperties(props.leftIconStyle)}
          />
        </Show>

        <Show when={props.pre}>
          <span
            class={[
              props.primary ? 'text-stone-400' : 'text-stone-500',
              'whitespace-pre-wrap',
            ].join(' ')}
          >
            {props.pre}:{' '}
          </span>
        </Show>

        {props.children}

        <Show when={props.rightIcon || (props.center && props.leftIcon)}>
          <Icon
            {...iconsProps}
            icon={props.rightIcon}
            right={true}
            class={props.rightIconClass}
            style={styleToCSSProperties(props.rightIconStyle)}
          />
        </Show>
      </Show>
    </Container>
  )
}
