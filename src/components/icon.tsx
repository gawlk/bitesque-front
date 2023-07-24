import { type InteractiveProps } from './interactive'

export interface Props extends InteractiveProps {
  // Illustrations
  icon?: IconProp

  // Sides
  left?: boolean
  right?: boolean
}

export default (props: Props) => {
  const isSpan = createMemo(
    () => !props.icon || typeof props.icon === 'boolean'
  )

  const isImage = createMemo(() => typeof props.icon === 'string')

  return (
    // TODO: Load image if in viewport
    <Dynamic
      // @ts-ignore next-line
      component={isSpan() ? 'span' : isImage() ? 'img' : props.icon}
      {...(isImage() ? { src: props.icon } : {})}
      style={props.style}
      class={[
        // Sizes
        'h-6 w-6',

        // Padding
        props.left ? '-ml-0.5 mr-1.5' : props.right ? 'ml-1.5 -mr-0.5' : '',

        ...(isImage()
          ? ['object-contain', 'rounded-md']
          : [
              props.primary ? 'text-stone-500' : 'text-stone-400',
              props.disabled ? 'transition-none' : 'transition duration-200',
            ]),

        'flex-none',

        props.class || '',
      ].join(' ')}
    />
  )
}
