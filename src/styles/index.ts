export const styleToCSSProperties = (
  style?: string | SolidJS.JSX.CSSProperties
) => {
  if (!style) {
    return {}
  } else if (typeof style === 'object') {
    return style
  }

  const styleObject: SolidJS.JSX.CSSProperties = {}

  ;(style || '').replace(/([\w-]+)\s*:\s*([^;]+)/g, (_, prop, value) => {
    styleObject[prop] = value
    return ''
  })

  return styleObject
}
