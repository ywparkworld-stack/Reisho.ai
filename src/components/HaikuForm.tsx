'use client'

import { useState, useTransition, useRef } from 'react'
import { createPost } from '@/app/actions'
import { countMora, hasKanji, HAIKU_PATTERN, validateHaiku, type HaikuLines } from '@/lib/mora'
import MoraIndicator from './MoraIndicator'
import Image from 'next/image'

const LABELS = ['上の句', '中の句', '下の句'] as const
const PLACEHOLDERS = ['ふるいけや', 'かわずとびこむ', 'みずのおと'] as const

export default function HaikuForm() {
  const [lines, setLines] = useState<HaikuLines>(['', '', ''])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const isValid = validateHaiku(lines)
  const showKanjiWarning = lines.some(hasKanji)

  function updateLine(index: number, value: string) {
    setLines((prev) => {
      const next = [...prev] as HaikuLines
      next[index] = value
      return next
    })
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      setImagePreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.set('line1', lines[0])
    formData.set('line2', lines[1])
    formData.set('line3', lines[2])
    startTransition(async () => {
      try {
        await createPost(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '投稿に失敗しました')
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card space-y-6">
      {/* 写真アップロード */}
      <div>
        <label className="block text-sm text-muted font-medium mb-2">
          写真
          <span className="ml-2 text-xs text-border">（任意）</span>
        </label>

        {imagePreview ? (
          <div className="relative rounded-lg overflow-hidden">
            <div className="relative w-full aspect-video bg-border">
              <Image
                src={imagePreview}
                alt="プレビュー"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg py-8 text-center text-muted hover:border-accent/40 hover:text-accent/60 transition-colors"
          >
            <span className="block text-2xl mb-1">📷</span>
            <span className="text-sm">タップして写真を追加</span>
          </button>
        )}

        <input
          ref={fileRef}
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={isPending}
        />
      </div>

      {/* 俳句入力 */}
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

      {/* プレビュー */}
      {isValid && (
        <div className="border-t border-border pt-4">
          {imagePreview && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
              <Image
                src={imagePreview}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="font-haiku text-center text-muted text-sm leading-relaxed">
            <p>{lines[0]}</p>
            <p>{lines[1]}</p>
            <p>{lines[2]}</p>
          </div>
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
