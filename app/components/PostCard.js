import Link from 'next/link'
import LikeButton from './LikeButton'
import CommentForm from './CommentForm'
import { AvatarIcon } from './AvatarIcon'

const ROLE_COLORS = {
  DPS:     { pill: 'bg-red-100 text-red-600',    bar: '#ef4444' },
  Healer:  { pill: 'bg-green-100 text-green-600', bar: '#22c55e' },
  Status:  { pill: 'bg-purple-100 text-purple-600', bar: '#a855f7' },
  Tank:    { pill: 'bg-yellow-100 text-yellow-700', bar: '#eab308' },
  Support: { pill: 'bg-blue-100 text-blue-600',   bar: '#3b82f6' },
}

const PLATFORM_COLORS = {
  PC:   'text-blue-600',
  PS:   'text-indigo-600',
  Xbox: 'text-green-600',
}

function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match ? match[1] : null
}

export default function PostCard({ post, currentUserId }) {
  const role = post.buildRole
  const roleColor = ROLE_COLORS[role]
  const platformColor = PLATFORM_COLORS[post.author.platform] || 'text-gray-700'
  const likedByMe = currentUserId ? post.likes.some(l => l.userId === currentUserId) : false
  const ytId = getYouTubeId(post.videoUrl)

  return (
    <div className="card overflow-hidden" style={{ borderLeft: `4px solid ${roleColor ? roleColor.bar : '#f97316'}` }}>
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <AvatarIcon iconKey={post.author.avatar} size={40} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author.username}`} className="font-black text-gray-900 text-sm hover:text-orange-500 transition-colors">{post.author.username}</Link>
              <span className={`text-xs font-bold ${platformColor}`}>{post.author.platform}</span>
            </div>
            <p className="text-gray-700 font-bold text-xs mt-0.5">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.isLFG && <span className="px-2.5 py-0.5 bg-orange-100 text-orange-600 text-xs font-black rounded-full">Looking for Group</span>}
          {roleColor && <span className={`px-2.5 py-0.5 text-xs font-black rounded-full ${roleColor.pill}`}>{role}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <p className="text-gray-900 font-bold text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        {post.isLFG && post.lfgRole && (
          <p className="mt-2 text-xs font-bold text-gray-900">Looking for: <span className="text-orange-500 font-black">{post.lfgRole}</span></p>
        )}
      </div>

      {/* Build screenshot */}
      {post.imageUrl && (
        <div className="mx-5 mb-4 rounded-lg overflow-hidden border border-gray-100">
          <img src={post.imageUrl} alt="Build screenshot" className="w-full object-cover max-h-80" />
        </div>
      )}

      {/* YouTube */}
      {ytId && (
        <div className="aspect-video bg-black mx-5 mb-4 rounded-lg overflow-hidden">
          <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" allowFullScreen title="Video" />
        </div>
      )}

      {/* Like/comment counts row */}
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="flex items-center justify-between px-5 py-2 text-xs font-bold text-gray-700">
          {post.likes.length > 0 && <span>❤️ {post.likes.length}</span>}
          {post.comments.length > 0 && <span>{post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}</span>}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center border-t border-gray-100 mx-5">
        <LikeButton postId={post.id} likeCount={post.likes.length} likedByMe={likedByMe} />
        <span className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-gray-900">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Comment
        </span>
      </div>

      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="px-5 pt-3 pb-3 space-y-3 border-t border-gray-50 bg-gray-50/50">
          {post.comments.slice(0, 3).map(comment => (
            <div key={comment.id} className="flex gap-3">
              <AvatarIcon iconKey={comment.author.avatar} size={28} />
              <div className="flex-1 bg-white rounded-2xl px-3 py-2 text-sm">
                <span className="font-black text-gray-900 mr-2">{comment.author.username}</span>
                <span className="font-bold text-gray-900">{comment.content}</span>
              </div>
            </div>
          ))}
          {post.comments.length > 3 && <p className="text-xs font-bold text-gray-700 ml-10">+{post.comments.length - 3} more comments</p>}
        </div>
      )}

      {currentUserId && <CommentForm postId={post.id} />}
    </div>
  )
}
