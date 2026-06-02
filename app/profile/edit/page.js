'use client'
import { useActionState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { editProfile } from '@/app/actions/editProfile'
import { AVATAR_ICONS, MASK_ICONS, AvatarIcon } from '@/app/components/AvatarIcon'

const PLATFORMS = [
  { id: 'PC', label: 'PC' },
  { id: 'PS', label: 'PlayStation' },
  { id: 'Xbox', label: 'Xbox' },
]

export default function EditProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [state, formAction, pending] = useActionState(editProfile, null)
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  function handleAvatarFile(e) {
    const file = e.target.files?.[0]
    if (!file) return setImagePreview(null)
    setImagePreview(URL.createObjectURL(file))
    setSelectedIcon(null) // clear icon selection when uploading custom image
  }

  // Set initial icon from session once loaded
  useEffect(() => {
    if (session?.user?.avatar && selectedIcon === null) {
      setSelectedIcon(session.user.avatar)
    } else if (session && selectedIcon === null) {
      setSelectedIcon('shd')
    }
  }, [session, selectedIcon])

  useEffect(() => {
    if (state?.success) {
      update().then(() => {
        router.refresh()
        router.push(`/profile/${state.username}`)
      })
    }
  }, [state, update, router])

  if (!session) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        <h1 className="text-3xl text-gray-900" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase' }}>Edit Profile</h1>
        <p className="font-bold text-gray-700 mt-1">Update your callsign, icon, and details</p>
      </div>
      <div className="card p-8">
        <form action={formAction} className="space-y-6">

          {/* Username */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-1.5">Callsign / Username</label>
            <input name="username" type="text" required className="field"
              defaultValue={session.user.username}
              pattern="[a-zA-Z0-9_\-]+" minLength={3} />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">Platform</label>
            <div className="flex gap-3">
              {PLATFORMS.map(p => (
                <label key={p.id} className="cursor-pointer flex-1">
                  <input type="radio" name="platform" value={p.id}
                    defaultChecked={session.user.platform === p.id} className="sr-only peer" />
                  <div className="flex items-center justify-center py-3 px-2 rounded-lg border-2 border-gray-200 bg-white cursor-pointer transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                    <span className="text-sm font-black text-gray-900">{p.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-1.5">Bio <span className="font-semibold text-gray-500">(optional)</span></label>
            <textarea name="bio" rows={3} className="field" style={{ resize: 'none' }}
              defaultValue=""
              placeholder="Tell the network who you are..." />
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">Agent Icon</label>

            {/* Custom upload */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-600 mb-2">Upload Your Own</p>
              <label className="flex items-center gap-4 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50/50 transition-colors cursor-pointer">
                <input type="file" name="avatarFile" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleAvatarFile} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-orange-400" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl border-2 border-gray-200">📷</div>
                )}
                <div>
                  <p className="text-sm font-black text-gray-900">{imagePreview ? 'Image selected' : 'Upload a photo'}</p>
                  <p className="text-xs font-bold text-gray-500">JPG, PNG or WebP — max 5MB</p>
                </div>
              </label>
            </div>

            <input type="hidden" name="avatar" value={selectedIcon || 'shd'} />
            <p className="text-xs font-bold text-gray-600 mb-3">Hunter Masks</p>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {MASK_ICONS.map(icon => (
                <button key={icon.key} type="button" onClick={() => setSelectedIcon(icon.key)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    selectedIcon === icon.key ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <AvatarIcon iconKey={icon.key} size={48} />
                  <span className="text-xs font-bold text-gray-900 text-center leading-tight">{icon.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-gray-600 mb-3">SHD Icons</p>
            <div className="grid grid-cols-5 gap-3">
              {AVATAR_ICONS.map(icon => (
                <button key={icon.key} type="button" onClick={() => setSelectedIcon(icon.key)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    selectedIcon === icon.key ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <AvatarIcon iconKey={icon.key} size={48} />
                  <span className="text-xs font-bold text-gray-900 text-center leading-tight">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-3 rounded-lg">{state.error}</div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={pending} className="btn-primary flex-1 justify-center py-3 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
              {pending ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => router.back()}
              className="btn-ghost flex-1 justify-center py-3"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
