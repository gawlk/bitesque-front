interface Props {
  class?: string
}

export default (props: Props) => {
  return (
    <hr
      class={[
        props.class || '',
        '-mx-6 my-4 flex-none border-t border-neutral-600',
      ].join(' ')}
    />
  )
}
