interface Props {
  count: number
  target: number
}

export default function MoraIndicator({ count, target }: Props) {
  const isExact = count === target
  const isOver = count > target
  const dotCount = isOver ? count : target

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: dotCount }, (_, i) => {
          let color = 'bg-border'
          if (i < count) {
            color = isOver ? 'bg-red-400' : isExact ? 'bg-green-600' : 'bg-accent/60'
          }
          return (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full transition-all duration-150 ${color}`}
            />
          )
        })}
      </div>
      <span
        className={`text-xs font-mono tabular-nums ${
          isOver ? 'text-red-500' : isExact ? 'text-green-600' : 'text-muted'
        }`}
      >
        {count}/{target}
        {isExact && ' ✓'}
      </span>
    </div>
  )
}
