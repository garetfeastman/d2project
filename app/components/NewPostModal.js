'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/actions/posts'

const ROLES = ['DPS', 'Healer', 'Status', 'Tank', 'Support']

const MODE_CONFIG = {
  build: {
    title: 'Post a Build',
    placeholder: 'Describe your build — gear, talents, playstyle...',
    submitLabel: 'Post Build',
  },
  video: {
    title: 'Share a Video',
    placeholder: 'Tell agents what this video is about...',
    submitLabel: 'Share Video',
  },
  discussion: {
    title: 'Start a Discussion',
    placeholder: 'What\'s on your mind, Agent?',
    submitLabel: 'Post Discussion',
  },
  lfg: {
    title: 'Looking for Group',
    placeholder: 'Describe what you\'re looking for — playstyle, availability, goals...',
    submitLabel: 'Post Looking for Group',
  },
}

export default function NewPostModal({ isOpen, onClose, mode = 'build' }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(createPost, null)
  const formRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)

  const config = MODE_CONFIG[mode] || MODE_CONFIG.build

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      setImagePreview(null)
      router.refresh()
      onClose()
    }
  }, [state, router, onClose])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return setImagePreview(null)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card w-full max-w-xl p-6 relative" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl text-gray-900" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase' }}>
            {config.title}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 font-bold text-lg">✕</button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-5">
          {/* Hidden flags */}
          {mode === 'lfg' && <input type="hidden" name="isLFG" value="on" />}
          {mode === 'discussion' && <input type="hidden" name="buildRole" value="" />}

          {/* Content */}
          <textarea name="content" required rows={4} placeholder={config.placeholder}
            className="field" style={{ resize: 'none' }} />

          {/* Build Role — build mode only */}
          {mode === 'build' && (
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2">Build Role <span className="text-gray-500 font-semibold">(optional)</span></label>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer">
                  <input type="radio" name="buildRole" value="" className="sr-only peer" defaultChecked />
                  <span className="block text-sm font-bold px-3 py-1.5 rounded-full border-2 border-gray-200 text-gray-600 cursor-pointer transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600">None</span>
                </label>
                {ROLES.map(role => (
                  <label key={role} className="cursor-pointer">
                    <input type="radio" name="buildRole" value={role} className="sr-only peer" />
                    <span className="block text-sm font-bold px-3 py-1.5 rounded-full border-2 border-gray-200 text-gray-600 cursor-pointer transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Photo upload — build mode only */}
          {mode === 'build' && (
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2">Screenshot <span className="text-gray-500 font-semibold">(optional)</span></label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl py-5 cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-colors">
                <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleImage} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <span className="text-2xl mb-1">📷</span>
                    <span className="text-sm font-bold text-gray-600">Click to upload a screenshot</span>
                    <span className="text-xs font-bold text-gray-400 mt-1">JPG, PNG or WebP — max 5MB</span>
                  </>
                )}
              </label>
            </div>
          )}

          {/* YouTube URL — video mode only */}
          {mode === 'video' && (
            <div>
              <label className="block text-sm font-black text-gray-900 mb-1.5">YouTube Link</label>
              <input type="url" name="videoUrl" required placeholder="https://youtube.com/watch?v=..." className="field" />
            </div>
          )}

          {/* LFG Role — lfg mode only */}
          {mode === 'lfg' && (
            <div>
              <label className="block text-sm font-black text-gray-900 mb-1.5">Role you need</label>
              <select name="lfgRole" className="field">
                <option value="">Any role</option>
                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          )}

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-3 rounded-lg">{state.error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={pending}
              className="btn-primary flex-1 justify-center py-3 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
              {pending ? 'Publishing...' : config.submitLabel}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost px-6 py-3"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
