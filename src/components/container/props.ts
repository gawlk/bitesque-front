export const propsSpecificToInteractive: {
  [T in ContainerPropsKeys]: boolean
} = {
  children: true,
  roundedFull: true,
  border: true,
  primary: true,
  secondary: true,
  tertiary: true,
  transparent: true,
  class: true,
  style: true,
}
