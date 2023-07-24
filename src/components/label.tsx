export interface Props extends SolidJS.ParentProps {
  label: string | SolidJS.JSX.Element
  class?: string
}

export default (props: Props) => {
  const id = `${props.label}-${Math.random()}`

  return (
    <div class="space-y-2">
      <label for={id} class="break-words text-lg font-semibold">
        {props.label}
      </label>
      <div id={id} class={props.class ?? 'space-y-2'}>
        {props.children}
      </div>
    </div>
  )
}
