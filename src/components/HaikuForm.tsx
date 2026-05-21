'use client'

import { useState, useTransition } from 'react'
import { createPost } from '@/app/actions'
import { countMora, hasKanji, HAIKU_PATTERN, validateHaiku, type HaikuLines } from '@/lib/mora'
import MoraIndicator from './MoraIndicator'

const LABELS = ['上の句', '中の句', '下の句'] as const
const PLACEHOLDERS = ['ふるいけや', 'かわずとびこむ', 'みずのおと'] as const

export default function HaikuForm() {
  const [lines, setLines] = useState<HaikuLines>(['', '', ''])
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const isValid = validateHaiku(lines)
  const showKanjiWarning = lines.some(hasKanji)

  function updateLine(index: number, value: string) {
    setLines((prev) => {
      const next = [...prev] as HaikuLines
      next[index] = value
      return next
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setError('')
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.set('line1', lines[0])
        formData.set('line2', lines[1])
        formData.set('line3', lines[2])
        await createPost(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '投稿に失敗しました')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      {HAIKU_PATTERN.map((target, i) => {
        const count = countMora(lines[i])
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-muted font-medium">
                {LABELS[i]}
                <span className="ml-2 text-xs text-border">（{target}音）</span>
              </label>
              <MoraIndicator count={count} target={target} />
            </div>
            <input
              type="text"
              value={lines[i]}
              onChange={(e) => updateLine(i, e.target.value)}
              placeholder={PLACEHOLDERS[i]}
              className="input-field"
              disabled={isPending}
              autoComplete="off"
            />
          </div>
        )
      })}

      {showKanjiWarning && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          漢字が含まれています。漢字の音節数は読み仮名で数えてください。
        </p>
      )}

      {isValid && (
        <div className="font-haiku text-center text-muted text-sm border-t border-border pt-4 leading-relaxed">
          <p>{lines[0]}</p>
          <p>{lines[1]}</p>
          <p>{lines[2]}</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!isValid || isPending}
        className="btn-primary w-full"
      >
        {isPending ? '詠み上げ中...' : '詠む'}
      </button>
    </form>
  )
}
