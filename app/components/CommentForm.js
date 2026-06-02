'use client'
import { useRef, useTransition } from 'react'
import { addComment } from '@/app/actions/posts'

export default function CommentForm({ postId }) {
  const ref = useRef(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    startTransition(async () => {
      await addComment(formData)
      ref.current?.reset()
    })
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="flex items-center gap-2.5 px-5 py-3 border-t border-gray-100">
      <input type="hidden" name="postId" value={postId} />
      <input
        name="content"
        placeholder="Write a comment..."
        className="flex-1 bg-gray-100 border-none text-gray-700 text-sm px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-400 transition-all"
      />
      <button type="submit" disabled={isPending}
        className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-full transition-colors disabled:opacity-50"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {isPending ? '...' : 'Post'}
      </button>
    </form>
  )
}
