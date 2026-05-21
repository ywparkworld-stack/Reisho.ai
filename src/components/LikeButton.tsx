'use client'

import { useTransition } from 'react'
import { toggleLike } from '@/app/actions'

interface Props {
  postId: string
  likeCount: number
  liked: boolean
  isLoggedIn: boolean
}

export default function LikeButton({ postId, likeCount, liked, isLoggedIn }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!isLoggedIn) return
    startTransition(() => toggleLike(postId))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || !isLoggedIn}
      title={isLoggedIn ? undefined : 'ログインして「いとおかし」できます'}
      className={`flex items-center gap-1.5 text-sm transition-all duration-150 px-2 py-1 rounded-lg
        ${isLoggedIn ? 'hover:bg-rose-50 active:scale-95' : 'cursor-default'}
        ${liked ? 'text-rose-500' : 'text-muted hover:text-rose-400'}
        ${isPending ? 'opacity-50' : ''}
      `}
    >
      <span className="text-base leading-none">{liked ? '♥' : '♡'}</span>
      <span className="font-haiku tracking-wide">いとおかし</span>
      {likeCount > 0 && (
        <span className="text-xs tabular-nums">{likeCount}</span>
      )}
    </button>
  )
}
