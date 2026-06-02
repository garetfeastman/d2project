'use client'
import { useState } from 'react'
import NewPostModal from './NewPostModal'

export default function LFGPostButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary w-full justify-center" style={{ fontFamily: 'var(--font-heading)' }}>
        🤝 Post Looking for Group
      </button>
      <NewPostModal isOpen={open} onClose={() => setOpen(false)} lfgMode={true} />
    </>
  )
}
