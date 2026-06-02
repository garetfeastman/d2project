'use client'
import { useState } from 'react'
import NewPostModal from './NewPostModal'

export default function NewPostButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary w-full justify-center" style={{ fontFamily: 'var(--font-heading)' }}>
        + New Post
      </button>
      <NewPostModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
