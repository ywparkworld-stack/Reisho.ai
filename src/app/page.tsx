import { createClient } from '@/lib/supabase/server'
import HaikuCard from '@/components/HaikuCard'
import Link from 'next/link'
import type { PostWithDetails } from '@/types/database'

export const revalidate = 0

export default async function FeedPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(*), likes(*)')
    .order('created_at', { ascending: false })
    .limit(50)

  const enriched: PostWithDetails[] = (posts ?? []).map((post) => ({
    ...post,
    liked_by_user: user
      ? post.likes.some((l: { user_id: string }) => l.user_id === user.id)
      : false,
    like_count: post.likes.length,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-haiku text-ink font-semibold tracking-widest">
            最新の俳句
          </h1>
          <p className="text-muted text-sm mt-1">5・7・5の言葉たち</p>
        </div>
        {user && (
          <Link href="/post" className="btn-primary">
            詠む
          </Link>
        )}
      </div>

      {enriched.length === 0 ? (
        <div className="text-center py-24 text-muted">
          <p className="text-4xl mb-4 font-haiku">静寂</p>
          <p className="text-sm">まだ俳句がありません</p>
          {!user && (
            <Link href="/auth/signup" className="btn-primary mt-6 inline-block">
              はじめる
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {enriched.map((post) => (
            <HaikuCard key={post.id} post={post} currentUserId={user?.id} />
          ))}
        </div>
      )}
    </div>
  )
}
