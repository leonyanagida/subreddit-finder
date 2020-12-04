interface ISpace {
  space: string
}

export default function Spacer({ space }: ISpace): JSX.Element {
  return <div style={{ width: '100%', height: space }} />
}
