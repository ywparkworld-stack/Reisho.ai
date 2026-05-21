import type { PostWithDetails } from '@/types/database'
import LikeButton from './LikeButton'
import Image from 'next/image'

interface Props {
  post: PostWithDetails
  currentUserId?: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}時間前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}日前`
  return new Date(dateStr).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
}

export default function HaikuCard({ post, currentUserId }: Props) {
  return (
    <article className="card !p-0 overflow-hidden group hover:shadow-md transition-shadow duration-200">
      {post.image_url && (
        <div className="relative w-full aspect-video">
          <Image
            src={post.image_url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </div>
      )}

      <div className="p-6">
        <div className="font-haiku space-y-1.5 mb-5">
          <p className="haiku-line text-ink">{post.line1}</p>
          <p className="haiku-line text-ink">{post.line2}</p>
          <p className="haiku-line text-ink">{post.line3}</p>
        </div>

        <div className="flex items-center justify-between text-sm border-t border-border pt-3">
          <div className="flex items-center gap-2 text-muted">
            <span className="font-medium text-ink/70">@{post.profiles.username}</span>
            <span>·</span>
            <time dateTime={post.created_at} className="text-xs">
              {timeAgo(post.created_at)}
            </time>
          </div>

          <LikeButton
            postId={post.id}
            likeCount={post.like_count}
            liked={post.liked_by_user}
            isLoggedIn={!!currentUserId}
          />
        </div>
      </div>
    </article>
  )
}
