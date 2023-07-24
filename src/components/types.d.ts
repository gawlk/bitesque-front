type IconProp = string | ((...args: any[]) => SolidJS.JSXElement) | true

type StyleProps = string | SolidJS.JSXCSSProperties

type MergeProps<T, HTMLAttributes extends SolidJS.JSX.HTMLAttributes> = T &
  Omit<HTMLAttributes, keyof T>
