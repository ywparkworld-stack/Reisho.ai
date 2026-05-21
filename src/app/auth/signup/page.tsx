'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await signUp(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '登録に失敗しました')
      }
    })
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-haiku text-ink font-semibold tracking-widest">新規登録</h1>
        <p className="text-muted text-sm mt-2">俳句の世界へようこそ</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm text-muted mb-2">ユーザー名</label>
          <input
            name="username"
            type="text"
            required
            minLength={2}
            maxLength={30}
            className="input-field"
            placeholder="松尾芭蕉"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-2">メールアドレス</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input-field"
            placeholder="haiku@example.com"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-2">パスワード</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input-field"
            placeholder="••••••••"
          />
          <p className="text-xs text-muted mt-1">8文字以上</p>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={isPending} className="btn-primary w-full">
          {isPending ? '登録中...' : '登録する'}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        すでにアカウントをお持ちの方は{' '}
        <Link href="/auth/login" className="text-accent hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  )
}
