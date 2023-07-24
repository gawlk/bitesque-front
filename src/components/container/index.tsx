import { removeProps } from '/src/scripts'

import { propsSpecificToInteractive } from './props'

import { styleToCSSProperties } from '/src/styles'

interface Props extends MergeProps<ContainerProps, SolidJS.JSX.HTMLAttributes> {
  component?: string | SolidJS.Component<any>
}

export default (props: Props) => {
  const dynamicProps = removeProps<Props>(props, propsSpecificToInteractive)

  return (
    <Dynamic
      {...mergeProps({ component: 'div' }, dynamicProps)}
      style={styleToCSSProperties(props.style)}
      class={[
        // Padding
        (() => {
          switch (props.size) {
            case 'base':
              return 'p-2'
          }
        })(),

        // Roundness
        (() => {
          switch (props.rounded) {
            case 'full':
              return 'rounded-full'
            case 'none':
              return
            default:
              return 'rounded-lg'
          }
        })(),

        // Border
        'border border-neutral-600',

        // Text size
        'text-base',

        // Text color
        'text-white',

        // Background color
        'bg-black',
        props.transparent ? 'bg-opacity-0' : '',

        props.class || '',
      ]
        .filter((c) => c)
        .join(' ')
        .trim()}
    >
      {props.children}
    </Dynamic>
  )
}
