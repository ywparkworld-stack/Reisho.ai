import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions'

export default async function Nav() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let username: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    username = profile?.username ?? null
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-haiku text-xl font-semibold text-ink tracking-widest hover:text-accent transition-colors"
        >
          隷書
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/post" className="btn-primary text-sm py-1.5 px-4">
                詠む
              </Link>
              <span className="text-muted text-sm hidden sm:block">
                @{username}
              </span>
              <form action={signOut}>
                <button type="submit" className="btn-ghost text-sm">
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost text-sm">
                ログイン
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm py-1.5 px-4">
                はじめる
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
