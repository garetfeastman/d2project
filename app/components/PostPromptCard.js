'use client'
import { useState } from 'react'
import { AvatarIcon } from './AvatarIcon'
import NewPostModal from './NewPostModal'

export default function PostPromptCard({ avatarKey }) {
  const [mode, setMode] = useState(null)

  function open(m) { setMode(m) }
  function close() { setMode(null) }

  return (
    <>
      <div className="card px-4 py-4">
        <div className="flex items-center gap-3">
          <AvatarIcon iconKey={avatarKey} size={40} />
          <button onClick={() => open('build')}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full font-bold text-gray-500 text-sm cursor-pointer transition-colors text-left">
            What are you running, Agent?
          </button>
        </div>
        <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
          <button onClick={() => open('build')} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <span>🔫</span> Build
          </button>
          <button onClick={() => open('video')} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <span>🎬</span> Video
          </button>
          <button onClick={() => open('discussion')} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <span>💬</span> Discussion
          </button>
        </div>
      </div>
      <NewPostModal isOpen={mode !== null} onClose={close} mode={mode || 'build'} />
    </>
  )
}
