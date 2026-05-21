'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from '@/app/actions'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await signIn(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ログインに失敗しました')
      }
    })
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-haiku text-ink font-semibold tracking-widest">ログイン</h1>
      </div>

      {message === 'confirmation-sent' && (
        <div className="card mb-6 text-center text-sm text-accent border-accent/20">
          確認メールを送りました。メールを確認してください。
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
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
            autoComplete="current-password"
            className="input-field"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={isPending} className="btn-primary w-full">
          {isPending ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        アカウントをお持ちでない方は{' '}
        <Link href="/auth/signup" className="text-accent hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  )
}
