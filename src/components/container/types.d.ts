interface ContainerProps extends BaseProps {
  border?: boolean

  rounded?: 'full' | 'none'

  class?: string

  style?: StyleProps
}

type ContainerPropsKeys = keyof Required<ContainerProps>
