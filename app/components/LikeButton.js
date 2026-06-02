'use client'
import { useTransition } from 'react'
import { toggleLike } from '@/app/actions/posts'

export default function LikeButton({ postId, likeCount, likedByMe }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(() => toggleLike(postId))}
      disabled={isPending}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 rounded-lg ${
        likedByMe ? 'text-orange-500' : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      <svg className="w-4 h-4" fill={likedByMe ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {likedByMe ? 'Liked' : 'Like'}
    </button>
  )
}
